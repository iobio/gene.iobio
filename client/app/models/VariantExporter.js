import VariantTrioModel from './VariantTrioModel.js'
import SampleModel from './SampleModel.js'

export default class VariantExporter {

  constructor(globalApp) {
    this.globalApp = globalApp;
    this.cohort = null;
    this.exportFields = [
      {field: 'chrom',            exportVcf: false},
      {field: 'start',            exportVcf: false},
      {field: 'end',              exportVcf: false},
      {field: 'ref',              exportVcf: false},
      {field: 'alt',              exportVcf: false},
      {field: 'gene',             exportVcf: true},
      {field: 'transcript',       exportVcf: true},
      {field: 'starred',          exportVcf: true},
      {field: 'freebayesCalled',  exportVcf: true},
      {field: 'type',             exportVcf: true},
      {field: 'impact',           exportVcf: true},
      {field: 'highestImpact',    exportVcf: true},
      {field: 'highestImpactInfo',exportVcf: true},
      {field: 'consequence',      exportVcf: true},
      {field: 'afExAC',           exportVcf: true},
      {field: 'af1000G',          exportVcf: true},
      {field: 'afgnomAD',         exportVcf: true},
      {field: 'inheritance',      exportVcf: true},
      {field: 'polyphen',         exportVcf: true},
      {field: 'SIFT',             exportVcf: true},
      {field: 'rsId',             exportVcf: true},
      {field: 'clinvarClinSig',   exportVcf: true},
      {field: 'clinvarPhenotype', exportVcf: true},
      {field: 'HGVSc',            exportVcf: true},
      {field: 'HGVSp',            exportVcf: true},
      {field: 'regulatory',       exportVcf: true},
      {field: 'qual',             exportVcf: false},
      {field: 'filter',           exportVcf: false},
      {field: 'zygosityProband',  exportVcf: true},
      {field: 'altCountProband',  exportVcf: true},
      {field: 'refCountProband',  exportVcf: true},
      {field: 'depthProband',     exportVcf: true},
      {field: 'bamDepthProband',  exportVcf: true},
      {field: 'zygosityMother',   exportVcf: true},
      {field: 'altCountMother',   exportVcf: true},
      {field: 'refCountMother',   exportVcf: true},
      {field: 'depthMother',      exportVcf: true},
      {field: 'bamDepthMother',   exportVcf: true},
      {field: 'zygosityFather',   exportVcf: true},
      {field: 'altCountFather',   exportVcf: true},
      {field: 'refCountFather',   exportVcf: true},
      {field: 'depthFather',      exportVcf: true},
      {field: 'bamDepthFather',   exportVcf: true},
      {field: 'dbSnpUrl',         exportVcf: false},
      {field: 'clinvarUrl',       exportVcf: false}

    ];

    this.proxyBookmarkFieldsToExport = [
      {field: 'inheritance'},

      {field: 'zygosityProband', target: 'zygosity', isProxy: true },
      {field: 'altCountProband', target: 'genotypeAltCount', isProxy: true },
      {field: 'refCountProband', target: 'genotypeRefCount', isProxy: true },
      {field: 'depthProband',    target: 'genotypeDepth', isProxy: true },
      {field: 'bamDepthProband', target: 'bamDepth', isProxy: true },

      {field: 'zygosityMother', target: 'motherZygosity', isProxy: true },
      {field: 'altCountMother', target: 'genotypeAltCountMother', isProxy: true },
      {field: 'refCountMother', target: 'genotypeRefCountMother', isProxy: true },
      {field: 'depthMother',    target: 'genotypeDepthMother', isProxy: true },
      {field: 'bamDepthMother', isProxy: true },

      {field: 'zygosityFather', target: 'fatherZygosity', isProxy: true },
      {field: 'altCountFather', target: 'genotypeAltCountFather', isProxy: true },
      {field: 'refCountFather', target: 'genotypeRefCountFather', isProxy: true },
      {field: 'depthFather',    target: 'genotypeDepthFather', isProxy: true },
      {field: 'bamDepthFather', isProxy: true }
    ]
  }

  promiseExportVariants(variantEntries, format, sampleNames) {
    var me = this;

    return new Promise(function(resolve, reject) {

      var promises = [];
      var records = [];
      var headerRecords = [];
      var headerRecordsCalledVariants = [];
      var getHeader = format == 'vcf' ? true : false;

      variantEntries.forEach(function(variant) {

        var exportRec = {};
        exportRec.start        = variant.start;
        exportRec.end          = variant.end;
        exportRec.chrom        = variant.chrom.indexOf("chr") == 0 ? variant.chrom : 'chr' + variant.chrom;
        exportRec.ref          = variant.ref;
        exportRec.alt          = variant.alt;
        exportRec.gene         = variant.gene.gene_name;
        exportRec.transcript   = variant.transcript.transcript_id;
        exportRec.starred      = variant.isFavorite == true ? "Y" : "";

        var promise = null;
        promise = me._promiseCreateExportRecord(variant, exportRec, format, getHeader, sampleNames)
        .then(function(data) {
          var record = data[0];

          if (format == 'csv') {
            records.push(record);
          } else if (format == 'vcf') {
            var annotatedVcfRecs = data[1];
            var theHeaderRecords = null;
            if ((record.hasOwnProperty('fbCalled')        && record.fbCalled == 'Y') ||
              (record.hasOwnProperty('freebayesCalled') && record.freebayesCalled == 'Y')) {
              theHeaderRecords = headerRecordsCalledVariants;
            } else {
              theHeaderRecords = headerRecords;
            }

            if (theHeaderRecords.length == 0) {
              annotatedVcfRecs.forEach(function(vcfRecord) {
                if (vcfRecord.indexOf("#") == 0) {
                  theHeaderRecords.push(vcfRecord);
                }
              })
              annotatedVcfRecs.forEach(function(vcfRecord) {
                if (vcfRecord.indexOf("#") != 0) {
                  var newRec = me._appendVcfRecordAnnotations(vcfRecord, record);
                  records.push(newRec);
                }
              });
            }
          }
        })
        .catch(function(error) {
          var msg = "Cannot produce export record for variant " + exportRec.gene + " " + exportRec.chrom + " " + exportRec.start + " " + exportRec.ref + "->" + exportRec.alt;
          alert(msg);
          console.log(msg);
          console.log(error);
        });

        promises.push(promise);
      });


      // When all of the export records have been created, output the csv or vcf file
      Promise.all(promises).then(function() {
        me._appendHeaderRecords(headerRecords, headerRecordsCalledVariants);

        var output = "";
        if (format == 'csv') {
          var sortedRecords = records.sort(SampleModel.orderVariantsByPosition);
          output = me._outputCSV(sortedRecords);
          resolve(output);
        } else if (format == 'vcf') {
          var sortedRecords = records.sort(SampleModel.orderVcfRecords);
          output  = headerRecords.join("\n");
          output += "\n";
          output += sortedRecords.join("\n");
          resolve(output);
        }

      });

    });

  }

  _appendHeaderRecords(headerRecords, headerRecordsCalledVariants) {
    var me = this;
    if (headerRecords.length == 0 && headerRecordsCalledVariants.length > 0) {
      var idx = 0;
      var injectIdx = headerRecordsCalledVariants.length - 2;
      headerRecordsCalledVariants.forEach(function(rec) {
        if (rec.indexOf('##INFO=<ID=') == 0) {
          injectIdx = idx;
        }
        headerRecords.push(rec);
        idx++;
      });
      // Insert the info field for the iobio annotations
      headerRecords.splice(injectIdx, 0, "##INFO=<ID=IOBIO,Number=.,Type=String,Description=\"Annotations from gene.iobio. Format: field is represented as tag#value, fields delimited by |\">");
      return;
    }

    var infoFields = {};
    var formatFields = {};
    var newInfoFields = {};
    var newFormatFields = {};
    var insertInfoAtIdx = -1;
    var insertFormatAtIdx = -1;
    var idx = 0;
    headerRecords.forEach(function(rec) {
      if (rec.indexOf('##INFO=<ID=') == 0) {
        var parts = rec.split("##INFO=<ID=");
        var key = parts[1].split(",")[0];
        infoFields[key] = rec;
        insertInfoAtIdx = idx;
      } else if (rec.indexOf('##FORMAT=<ID=') == 0) {
        var parts = rec.split("##FORMAT=<ID=");
        var key = parts[1].split(",")[0];
        formatFields[key] = rec;
        insertFormatAtIdx = idx;

      }
      idx++;
    });
    if (insertInfoAtIdx == -1) {
      insertInfoAtIdx = headerRecords.length - 1;
    } else {
      insertInfoAtIdx++;
    }
    if (insertFormatAtIdx == -1) {
      insertFormatAtIdx = headerRecords.length - 1;
    } else {
      insertFormatAtIdx++;
    }
    headerRecordsCalledVariants.forEach(function(rec) {
      if (rec.indexOf('##INFO=<ID=') == 0) {
        var parts = rec.split("##INFO=<ID=");
        var key = parts[1].split(",")[0];
        if (!infoFields.hasOwnProperty(key)) {
          newInfoFields[key] = rec;
        }
      } else if (rec.indexOf('##FORMAT=<ID=') == 0) {
        var parts = rec.split("##FORMAT=<ID=");
        var key = parts[1].split(",")[0];
        if (!formatFields.hasOwnProperty(key)) {
          newFormatFields[key] = rec;
        }
      }

    });

    // Insert the info field for the iobio annotations
    headerRecords.splice(insertInfoAtIdx, 0, "##INFO=<ID=IOBIO,Number=.,Type=String,Description=\"Annotations from gene.iobio. Format: field is represented as tag:value, fields delimited by |\">");

    //  Insert new info fields
    for (var key in newInfoFields) {
      var infoRec = newInfoFields[key];
      headerRecords.splice(insertInfoAtIdx, 0, infoRec);
      insertInfoAtIdx++;
    }

    // Insert new format fields
    for (var key in newFormatFields) {
      var formatRec = newFormatFields[key];
      headerRecords.splice(insertFormatAtIdx, 0, formatRec);
      insertFormatAtIdx++;
    }



  }

  _appendVcfRecordAnnotations(vcfRecord, record) {
    var me = this;
    var fields = vcfRecord.split("\t");
    var info = fields[7];

    var buf = "";
    me.exportFields.forEach(function(exportField) {
      if (exportField.exportVcf) {
        if (buf.length > 0) {
          buf += "|";
        }
        buf += exportField.field + "#" + (record[exportField.field] && record[exportField.field] != "" ? record[exportField.field] : ".");
      }
    })

    info += ";IOBIO=" + buf;


    fields[7] = info;
    return fields.join("\t");
  }



  _outputCSV(records) {
    var me = this;

    // Create the column header line
    var output = "";
    me.exportFields.forEach(function(exportField) {
      if (output.length > 0) {
        output += ",";
      }
      output += "\"" + exportField.field + "\"";
    });

    // Now create an output (csv) line for each of the bookmark records
    records.forEach(function(rec) {
      output += "\n";
      var isFirstTime = true;
      me.exportFields.forEach( function(exportField) {
        if (isFirstTime) {
          isFirstTime = false;
        } else {
          output += ",";
        }

        var fieldValue = rec[exportField.field] ? rec[exportField.field] : "" ;
        output +=  "\"" + fieldValue + "\"";
      });
    });
    return output;
  }



  _promiseCreateExportRecord(variant, exportRec, format, getHeader, sampleNames) {
    var me = this;

    return new Promise( function(resolve, reject) {
      me.cohort.geneModel.promiseGetCachedGeneObject(exportRec.gene).then(function(theGeneObject) {
        var theTranscript = null;
        if (theGeneObject == null || theGeneObject.transcripts == null) {
          var msg = "Unable to export variant.  Invalid gene. " + exportRec.gene;
          console.log(msg);
          reject(msg);
        }
        theGeneObject.transcripts.forEach(function(transcript) {
          if (!theTranscript && transcript.transcript_id == exportRec.transcript) {
            theTranscript = transcript;
          }
        });
        if (theTranscript) {


          if ((variant.hasOwnProperty('fbCalled')        && variant.fbCalled == 'Y') ||
            (variant.hasOwnProperty('freebayesCalled') && variant.freebayesCalled == 'Y')) {
            // If the variant was called on-demand, issue the service calls to
            // generate the vcf records.


            me.cohort.promiseJointCallVariants(theGeneObject, theTranscript, me.cohort.getCurrentTrioVcfData(), {sourceVariant: variant, checkCache: true, isBackground: true})
            .then(function(data) {
                var theGeneObject1    = data.gene;
                var theTranscript1    = data.transcript;
                var jointVcfRecs      = data.jointVcfRecs
                var translatedRefName = data.refName;
                var sourceVariant     = data.sourceVariant;
                var theVariant = null;
                var theVcfRecs = null;

                if (format == 'vcf') {
                  theVcfRecs = me._formatJointVcfRecs(jointVcfRecs, sourceVariant);
                }

                var sampleNamesToGenotype = me.cohort.getProbandModel().getSampleNamesToGenotype();
                var data = me.cohort.getProbandModel().vcf.parseVcfRecordsForASample(jointVcfRecs, translatedRefName, theGeneObject1, theTranscript1, me.cohort.translator.clinvarMap, true, (sampleNamesToGenotype ? sampleNamesToGenotype.join(",") : null), 0, me.globalApp.vepAF)
                var theFbData = data.results;

                theFbData.features.forEach(function(v) {
                  if (theVariant == null
                    && me.cohort.getProbandModel()._stripRefName(v.chrom) == me.cohort.getProbandModel()._stripRefName(sourceVariant.chrom)
                    && v.start  == sourceVariant.start
                    && v.ref    == sourceVariant.ref
                    && v.alt    == sourceVariant.alt) {
                    theVariant = v;
                  }
                })
                me._promiseFormatRecord(theVariant, sourceVariant, theVcfRecs, theGeneObject, theTranscript, format, exportRec)
                .then(function(data) {
                  resolve(data);
                })
            });

          } else {

            me.cohort.getProbandModel()
             .promiseGetVariantExtraAnnotations(theGeneObject, theTranscript, variant, format, getHeader, sampleNames)
             .then(function(data) {
              var theVariant = data[0];
              var sourceVariant = data[1];
              var theRawVcfRecords = data[2];

              me._promiseFormatRecord(theVariant, sourceVariant, theRawVcfRecords, theGeneObject, theTranscript, format, exportRec)
                .then(function(data) {
                  resolve(data);
                })

            });
          }


        } else {
          reject("Problem during exporting variants.  Cannot find transcript " + exportRec.transcript + " in gene " + exportRec.gene);
        }
      });
    });


  }

  _formatJointVcfRecs(jointVcfRecs, sourceVariant, getHeader) {
    var theVcfRecs = [];
    var theVcfRec = null;

    jointVcfRecs.forEach(function(vcfRec) {
      if (getHeader && vcfRec.indexOf("#") == 0) {
        theVcfRecs.push(vcfRec);
      } else  {
        fields = vcfRec.split("\t");
        var chrom = me.cohort.getProbandModel()._stripRefName(fields[0]);
        var start = fields[1];
        var ref   = fields[3];
        var alt   = fields[4];

        if (theVcfRec == null
          && chrom  == me.cohort.getProbandModel()._stripRefName(sourceVariant.chrom)
          && start  == sourceVariant.start
          && ref    == sourceVariant.ref
          && alt    == sourceVariant.alt) {

          theVcfRec = vcfRec;
          // Strip off mother and father genotype fields for now since
          // the loaded variants won't have these when bookmarks are
          // exported.
          var fields = theVcfRec.split("\t");
          if (fields.length > 10) {
            fields.splice(10, fields.length - 10);
            theVcfRec = fields.join("\t");
          }

          theVcfRecs.push(theVcfRec);
        }
      }
    });

    return theVcfRecs;
  }


  _promiseFormatRecord(theVariant, sourceVariant, theRawVcfRecords, theGeneObject, theTranscript, format, rec) {
    var me = this;
    return new Promise( function(resolve, reject) {

      // Merge the properties of the bookmark entry with the variant with the full annotations
      // Always use the inheritance from the bookmarkEntry
      var revisedVariant = $().extend({}, sourceVariant, theVariant);
      revisedVariant.extraAnnot = true;

      // If this is a trio, get the genotypes for mother and father
      if (Object.keys(revisedVariant.genotypes).length == 3) {
        var motherGenotype = null;
        var fatherGenotype = null;
        for (var key in revisedVariant.genotypes) {
          var gt = revisedVariant.genotypes[key];
          if (gt.sampleIndex == 1) {
            motherGenotype = gt;
          } else if (gt.sampleIndex == 2) {
            fatherGenotype = gt;
          }
        }
        if (motherGenotype) {
          revisedVariant.motherZygosity          = motherGenotype.zygosity;
          revisedVariant.genotypeAltCountMother  = motherGenotype.altCount;
          revisedVariant.genotypeRefCountMother  = motherGenotype.refCount;
          revisedVariant.genotypeDepthMother     = motherGenotype.genotypeDepth;

        }
        if (fatherGenotype) {
          revisedVariant.fatherZygosity          = fatherGenotype.zygosity;
          revisedVariant.genotypeAltCountFather  = fatherGenotype.altCount;
          revisedVariant.genotypeRefCountFather  = fatherGenotype.refCount;
          revisedVariant.genotypeDepthFather     = fatherGenotype.genotypeDepth;
        }

      }
      VariantTrioModel.determineInheritance(revisedVariant);

      // The bookmarkEntry contains fields that need to be in loaded
      // into the record that will be exported.  These include trio
      // allele counts, inheritance.  If the bookmark variant has
      // been refreshed with live data, bypass loading these fields
      // since they are already updated with latest info
      me.proxyBookmarkFieldsToExport.forEach(function(ftr) {
        var targetField = ftr.hasOwnProperty('target') ? ftr.target : ftr.field;
        if (ftr.hasOwnProperty('isProxy') && ftr.isProxy && sourceVariant.hasOwnProperty('isProxy') && sourceVariant.isProxy) {
          if (sourceVariant.hasOwnProperty(ftr.field)) {
            revisedVariant[targetField] = sourceVariant[ftr.field];
          }
        } else if (!ftr.hasOwnProperty('isProxy') || !ftr.isProxy) {
          if (sourceVariant.hasOwnProperty(ftr.field)) {
            revisedVariant[targetField] = sourceVariant[ftr.field];
          }
        }
      });

      // Set the clinvar start, alt, ref for clinvar web access
      me.cohort.getProbandModel().vcf._formatClinvarCoordinates(theVariant, theVariant);

      // Get the clinvar data and load into the variant record
      var dummyVcfData  = {features: [revisedVariant]};
      var clinvarLoader = me.globalApp.isClinvarOffline || me.globalApp.clinvarSource == "vcf" ? me.cohort.getProbandModel()._refreshVariantsWithClinvarVCFRecs.bind(me.cohort.getProbandModel(), dummyVcfData) : me.cohort.getProbandModel()._refreshVariantsWithClinvarEutils.bind(me.cohort.getProbandModel(), dummyVcfData);
      me.cohort.getProbandModel()
      .vcf
      .promiseGetClinvarRecords(dummyVcfData,
        me.cohort.getProbandModel()._stripRefName(revisedVariant.chrom),
        theGeneObject,
        me.cohort.geneModel.clinvarGenes,
        clinvarLoader)
      .then(function() {

        me.formatDisplay(revisedVariant, rec);

        if (format == 'csv') {
          resolve([rec]);
        } else {
          resolve([rec, theRawVcfRecords]);
        }
      })
    });
  }


  formatDisplay(variant, rec) {
    var me = this;


    var info    = me.globalApp.utility.formatDisplay(variant, this.cohort.translator, this.cohort.isEduMode);

    rec.inheritance       = info.inheritance ? this.cohort.translator.getInheritanceLabel(info.inheritance) : "";
    rec.impact            = info.vepImpact;
    rec.highestImpact     = info.vepHighestImpactValue;
    rec.highestImpactInfo = info.vepHighestImpactInfo;
    rec.consequence       = info.vepConsequence;
    rec.polyphen          = info.polyphen;
    rec.type              = variant.type;
    rec.SIFT              = info.sift;
    rec.regulatory        = info.regulatory;
    rec.rsId              = info.rsId;
    rec.dbSnpUrl          = info.dbSnpUrl;
    rec.clinvarUrl        = info.clinvarUrl;
    rec.clinvarClinSig    = info.clinvarSig;
    rec.clinvarPhenotype  = info.phenotype;
    rec.HGVSc             = info.HGVSc;
    rec.HGVSp             = info.HGVSp;
    rec.afExAC            = (variant.afExAC == -100 ? "n/a" : variant.afExAC);
    rec.af1000G           = variant.af1000G;
    rec.afgnomAD          = variant.afgnomAD == "." ? 0 : variant.afgnomAD;
    rec.qual              = variant.qual;
    rec.filter            = variant.filter;
    rec.freebayesCalled   = variant.fbCalled;

    rec.zygosityProband   = variant.zygosity;
    rec.altCountProband   = variant.genotypeAltCount;
    rec.refCountProband   = variant.genotypeRefCount;
    rec.depthProband      = variant.genotypeDepth;
    rec.bamDepthProband   = variant.bamDepth;

    rec.zygosityMother    = variant.motherZygosity;
    rec.altCountMother    = variant.genotypeAltCountMother;
    rec.refCountMother    = variant.genotypeRefCountMother;
    rec.depthMother       = variant.genotypeDepthMother;
    rec.bamDepthMother    = variant.bamDepthMother;

    rec.zygosityFather    = variant.fatherZygosity;
    rec.altCountFather    = variant.genotypeAltCountFather;
    rec.refCountFather    = variant.genotypeRefCountFather;
    rec.depthFather       = variant.genotypeDepthFather;
    rec.bamDepthFather    = variant.bamDepthFather;

    return rec;

  }


}

