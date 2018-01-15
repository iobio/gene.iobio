class GeneModel {
  constructor() {
    this.geneSource = null;
    this.refseqOnly = {};
    this.gencodeOnly = {};

    this.transcriptCodingRegions = {};

    this.geneNCBISummaries = {};

    this.genePhenotypes = {};

    this.geneObjects = {};

    this.geneToLatestTranscript = {};

    this.allKnownGeneNames = {};

    this.clinvarGenes = {};

  }

  promiseLoadFullGeneSet(callback) {
    let me = this;
    return new Promise(function(resolve, reject) {
      $.ajax({url: 'genes.json',
        data_type: 'json',
        success: function( data ) {
          var sortedGenes = me.getRidOfDuplicates(data);
          me.allKnownGeneNames = {};
          sortedGenes.forEach(function(geneObject) {
            if (geneObject && geneObject.name && geneObject.name.length > 0) {
              me.allKnownGeneNames[geneObject.name.toUpperCase()] = true;
            }
          })
          resolve(sortedGenes);
        },
        error: function(xhr, ajaxOptions, thrownError) {
          var msg = "failed to get genes.json " + thrownError;
          console.log(msg);
          console.log(xhr.status);
          reject(msg);
        }
      })
    })

  }


  promiseLoadClinvarGenes() {
    let me = this;
    var p = new Promise(function(resolve, reject) {

      me.clinvarGenes = {};

      $.ajax({
          url: global_clinvarGenesUrl,
          type: "GET",
          crossDomain: true,
          dataType: "text",
          success: function( res ) {
            if (res && res.length > 0) {
              let recs = res.split("\n");
              var firstTime = true;
              recs.forEach(function(rec) {
                if (firstTime) {
                  // ignore col headers
                  firstTime = false;
                } else {
                  var fields = rec.split("\t");
                  me.clinvarGenes[fields[0]] = +fields[1];
                }
              })

              resolve();
            } else {
              reject("Empty results returned from promiseLoadClinvarGenes");

            }

          },
          error: function( xhr, status, errorThrown ) {
            console.log( "Error: " + errorThrown );
            console.log( "Status: " + status );
            console.log( xhr );
            reject("Error " + errorThrown + " occurred in promiseLoadClinvarGenes() when attempting get clinvar gene counts ");
          }
      });

    });

  }



  getRidOfDuplicates(genes) {
    let me = this;
    var sortedGenes = genes.sort( function(g1, g2) {
      if (g1.gene_name < g2.gene_name) {
        return -1;
      } else if (g1.gene_name > g2.gene_name) {
        return 1;
      } else {
        return 0;
      }
    });
    // Flag gene objects with same name
    for (var i =0; i < sortedGenes.length - 1; i++) {
          var gene = sortedGenes[i];


          var nextGene = sortedGenes[i+1];
          if (i == 0) {
            gene.dup = false;
          }
          nextGene.dup = false;

          if (gene.gene_name == nextGene.gene_name && gene.refseq == nextGene.refseq && gene.gencode == nextGene.gencode) {
            nextGene.dup = true;
        }

        // Some more processing to gather unique gene sets and add field 'name'
        gene.name = gene.gene_name;
        if (gene.refseq != gene.gencode) {
          if (gene.refseq) {
            me.refseqOnly[gene.gene_name] = gene;
          } else {
            me.gencodeOnly[gene.gene_name] = gene;
          }
        }
    }
    return sortedGenes.filter(function(gene) {
      return gene.dup == false;
    });
  }

  getCanonicalTranscript(theGeneObject) {
    let me = this;
    var geneObject = theGeneObject != null ? theGeneObject : window.gene;
    var canonical;

    if (geneObject.transcripts == null || geneObject.transcripts.length == 0) {
      return null;
    }
    var order = 0;
    geneObject.transcripts.forEach(function(transcript) {
      transcript.isCanonical = false;
      var cdsLength = 0;
      if (transcript.features != null) {
        transcript.features.forEach(function(feature) {
          if (feature.feature_type == 'CDS') {
            cdsLength += Math.abs(parseInt(feature.end) - parseInt(feature.start));
          }
        })
        transcript.cdsLength = cdsLength;
      } else {
        transcript.cdsLength = +0;
      }
      transcript.order = order++;

    });
    var sortedTranscripts = geneObject.transcripts.slice().sort(function(a, b) {
      var aType = +2;
      var bType = +2;
      if (a.hasOwnProperty("transcript_type") && a.transcript_type == 'protein_coding') {
        aType = +0;
      } else if (a.hasOwnProperty("gene_type") && a.gene_type == "gene")  {
        aType = +0;
      } else {
        aType = +1;
      }
      if (b.hasOwnProperty("transcript_type") && b.transcript_type == 'protein_coding') {
        bType = +0;
      } else if (b.hasOwnProperty("gene_type") && b.gene_type == "gene")  {
        bType = +0;
      } else {
        bType = +1;
      }


      var aLevel = +2;
      var bLevel = +2;
      if (me.geneSource.toLowerCase() == 'refseq') {
        if (a.transcript_id.indexOf("NM_") == 0 ) {
          aLevel = +0;
        }
        if (b.transcript_id.indexOf("NM_") == 0 ) {
          bLevel = +0;
        }
      } else {
        // Don't consider level for gencode as this seems to point to shorter transcripts many
        // of the times.
        //aLevel = +a.level;
        //bLevel = +b.level;
      }


      var aSource = +2;
      var bSource = +2;
      if (me.geneSource.toLowerCase() =='refseq') {
        if (a.annotation_source == 'BestRefSeq' ) {
          aSource = +0;
        }
        if (b.annotation_source == 'BestRefSeq' ) {
          bSource = +0;
        }
      }

      a.sort = aType + ' ' + aLevel + ' ' + aSource + ' ' + a.cdsLength + ' ' + a.order;
      b.sort = bType + ' ' + bLevel + ' ' + bSource + ' ' + b.cdsLength + ' ' + b.order;

      if (aType == bType) {
        if (aLevel == bLevel) {
          if (aSource == bSource) {
            if (+a.cdsLength == +b.cdsLength) {
              // If all other sort criteria is the same,
              // we will grab the first transcript listed
              // for the gene.
              if (a.order == b.order) {
                return 0;
              } else if (a.order < b.order) {
                return -1;
              } else {
                return 1;
              }
              return 0;
            } else if (+a.cdsLength > +b.cdsLength) {
              return -1;
            } else {
              return 1;
            }
          } else if ( aSource < bSource ) {
            return -1;
          } else {
            return 1;
          }
        } else if (aLevel < bLevel) {
          return -1;
        } else {
          return 1;
        }
      } else if (aType < bType) {
        return -1;
      } else {
        return 1;
      }
    });
    canonical = sortedTranscripts[0];
    canonical.isCanonical = true;
    return canonical;
  }


  getCanonicalTranscriptOld(theGeneObject) {
    let me = this;

    var geneObject = theGeneObject != null ? theGeneObject : window.gene;
    var canonical;
    var maxCdsLength = 0;
    geneObject.transcripts.forEach(function(transcript) {
      var cdsLength = 0;
      if (transcript.features != null) {
        transcript.features.forEach(function(feature) {
          if (feature.feature_type == 'CDS') {
            cdsLength += Math.abs(parseInt(feature.end) - parseInt(feature.start));
          }
        })
        if (cdsLength > maxCdsLength) {
          maxCdsLength = cdsLength;
          canonical = transcript;
        }
        transcript.cdsLength = cdsLength;
      }

    });

    if (canonical == null) {
      // If we didn't find the canonical (transcripts didn't have features), just
      // grab the first transcript to use as the canonical one.
      if (geneObject.transcripts != null && geneObject.transcripts.length > 0)
      canonical = geneObject.transcripts[0];
    }
    canonical.isCanonical = true;
    return canonical;
  }

  getCodingRegions(transcript) {
    let me = this;
    if (transcript && transcript.features) {
      var codingRegions = me.transcriptCodingRegions[transcript.transcript_id];
      if (codingRegions) {
        return codingRegions;
      }
      codingRegions = [];
      transcript.features.forEach( function(feature) {
        if ($.inArray(feature.feature_type, ['EXON', 'CDS', 'UTR']) !== -1) {
          codingRegions.push({ start: feature.start, end: feature.end });
        }
      });
      me.transcriptCodingRegions[transcript.transcript_id] = codingRegions;
      return codingRegions;
    }
    return [];
  }



  promiseMarkCodingRegions(geneObject, transcript) {
    let me = this;
    return new Promise(function(resolve, reject) {

      var exonPromises = [];
      transcript.features.forEach(function(feature) {
        if (!feature.hasOwnProperty("danger")) {
          feature.danger = {proband: false, mother: false, father: false};
        }
        if (!feature.hasOwnProperty("geneCoverage")) {
          feature.geneCoverage = {proband: false, mother: false, father: false};
        }


        getRelevantVariantCards().forEach(function(vc) {
          var promise = vc.model.promiseGetCachedGeneCoverage(geneObject, transcript)
           .then(function(geneCoverage) {
              if (geneCoverage) {
                var matchingFeatureCoverage = geneCoverage.filter(function(gc) {
                  return feature.start == gc.start && feature.end == gc.end;
                });
                if (matchingFeatureCoverage.length > 0) {
                  var gc = matchingFeatureCoverage[0];
                  feature.geneCoverage[vc.getRelationship()] = gc;
                  feature.danger[vc.getRelationship()] = filterCard.isLowCoverage(gc);
                } else {
                  feature.danger[vc.getRelationship()]  = false;
                }
              } else {
                feature.danger[vc.getRelationship()] = false;
              }

           })
          exonPromises.push(promise);
        })
      })

      Promise.all(exonPromises).then(function() {
        var sortedExons = me._getSortedExonsForTranscript(transcript);
        me._setTranscriptExonNumbers(transcript, sortedExons);
        resolve({'gene': geneObject, 'transcript': transcript});
      });
    })

  }

  _getSortedExonsForTranscript(transcript) {
    var sortedExons = transcript
      .features.filter(function(feature) {
        return feature.feature_type.toUpperCase() == 'EXON';
      })
      .sort(function(feature1, feature2) {

        var compare = 0;
        if (feature1.start < feature2.start) {
          compare = -1;
        } else if (feature1.start > feature2.start) {
          compare = 1;
        } else {
          compare = 0;
        }

        var strandMultiplier = transcript.strand == "+" ? 1 : -1;

        return compare * strandMultiplier;

      })

    var exonCount = 0;
    sortedExons.forEach(function(exon) {
      exonCount++
    })

    var exonNumber = 1;
    sortedExons.forEach(function(exon) {
      exon.exon_number = exonNumber + "/" + exonCount;
      exonNumber++;
    })
    return sortedExons;
  }


  promiseGetNCBIGeneSummary(geneName) {
    let me = this;
    return new Promise( function(resolve, reject) {

      var geneInfo = me.geneNCBISummaries[geneName];
      if (geneInfo != null) {
        resolve(geneInfo);
      } else {
          // Search NCBI based on the gene name to obtain the gene ID
        var url = NCBI_GENE_SEARCH_URL + "&term=" + "(" + geneName + "[Gene name]" + " AND 9606[Taxonomy ID]";
        $.ajax( url )
        .done(function(data) {

          // Now that we have the gene ID, get the NCBI gene summary
          var webenv = data["esearchresult"]["webenv"];
          var queryKey = data["esearchresult"]["querykey"];
          var summaryUrl = NCBI_GENE_SUMMARY_URL + "&query_key=" + queryKey + "&WebEnv=" + webenv;
          $.ajax( summaryUrl )
          .done(function(sumData) {

              if (sumData.result == null || sumData.result.uids.length == 0) {
                if (sumData.esummaryresult && sumData.esummaryresult.length > 0) {
                  sumData.esummaryresult.forEach( function(message) {
                    console.log(message);
                  });
                }
                reject("No NCBI gene summary returned for gene " + geneName);

              } else {

                var uid = sumData.result.uids[0];
                var geneInfo = sumData.result[uid];

                me.geneNCBISummaries[geneName] = geneInfo;
                resolve(geneInfo)
              }
          })
          .fail(function() {
            reject("Unable to get NCBI Gene Summary for gene " + geneName);
          })

        })
        .fail(function() {
          reject("Unable to get NCBI Gene Summary for gene with gene search " + geneName);
        })
      }
    });

  }


  _setTranscriptExonNumbers(transcript, sortedExons) {
    // Set the exon number on each UTR and CDS within the corresponding exon
    transcript.features.forEach(function(feature) {
      if (feature.feature_type.toUpperCase() == 'CDS' || feature.feature_type.toUpperCase() == 'UTR') {
        sortedExons.forEach(function(exon) {
          if (feature.start >= exon.start && feature.end <= exon.end) {
            feature.exon_number = exon.exon_number;
          }
        })
      }
    })
  }

  clearGene(geneName) {
    let me = this;
    if (me.geneObjects && me.geneObjects.hasOwnProperty(geneName)) {
      delete me.geneObjects[geneName];
    }

    if (me.geneNCBISummaries && me.geneNCBISummaries.hasOwnProperty(geneName)) {
      delete me.geneNCBISummaries[geneName];
    }

    if (me.geneToLatestTranscript && me.geneToLatestTranscript.hasOwnProperty(geneName)) {
      delete me.geneToLatestTranscript[geneName];
    }
    if (me.geneToLatestTranscript && me.geneToLatestTranscript[geneName]) {
      delete me.geneToLatestTranscript[geneName];
    }
  }

  promiseGetGenePhenotypes(geneName) {
    var me = this;

    return new Promise( function(resolve, reject) {

      var phenotypes = me.genePhenotypes[geneName];
      if (phenotypes != null) {
        resolve([phenotypes, geneName]);
      } else {
        var url = geneToPhenoServer + "api/gene/" + geneName;
        $.ajax({
        url: url,
        jsonp: "callback",
        type: "GET",
        dataType: "jsonp",
        success: function( response ) {

          var phenotypes = response.sort(function(a,b) {
            if (a.hpo_term_name < b.hpo_term_name) {
              return -1;
            } else if (a.hpo_term_name > b.hpo_term_name) {
              return 1;
            } else {
              return 0;
            }
          });
          me.genePhenotypes[geneName] = phenotypes;

          resolve([response, geneName]);
        },
        fail: function() {
          reject("unable to get phenotypes for gene " + geneName);
        }
       });
      }

    });
  }



  promiseGetCachedGeneObject(geneName, resolveOnError=false) {
    var me = this;
    return new Promise( function(resolve, reject) {
      var theGeneObject = me.geneObjects[geneName];
      if (theGeneObject) {
        resolve(theGeneObject);
      } else {
        me.promiseGetGeneObject(geneName).then(function(geneObject) {
          resolve(geneObject);
        },
        function(error) {
          if (resolveOnError) {
            resolve(null);
          } else {
            reject(error);
          }
        });
      }

    });
  }


  promiseGetGeneObject(geneName) {
    var me = this;
    return new Promise(function(resolve, reject) {

      var url = geneInfoServer + 'api/gene/' + geneName;

      // If current build not specified, default to GRCh37
      var buildName = genomeBuildHelper.getCurrentBuildName() ? genomeBuildHelper.getCurrentBuildName() : "GRCh37";
      $('#build-link').text(buildName);


      url += "?source="  + (me.geneSource ? me.geneSource : siteGeneSource);
      url += "&species=" + genomeBuildHelper.getCurrentSpeciesLatinName();
      url += "&build="   + buildName;


      $.ajax({
        url: url,
        jsonp: "callback",
        type: "GET",
        dataType: "jsonp",
        success: function( response ) {
          if (response.length > 0 && response[0].hasOwnProperty('gene_name')) {
            var theGeneObject = response[0];
            me.geneObjects[theGeneObject.gene_name] = theGeneObject;
            resolve(theGeneObject);
          } else {
          console.log("Gene model for " + geneName + " not found.  Empty results returned from " + url);
            reject("Gene model for " + geneName + " not found.");
          }
        },
        error: function( xhr, status, errorThrown ) {

          console.log("Gene model for " +  geneName + " not found.  Error occurred.");
          console.log( "Error: " + errorThrown );
          console.log( "Status: " + status );
          console.log( xhr );
          reject("Error " + errorThrown + " occurred when attempting to get gene model for gene " + geneName);

        }
      });

    });
  }

  isKnownGene(geneName) {
    return this.allKnownGeneNames[geneName] || this.allKnownGeneNames[geneName.toUpperCase()]
  }


  adjustGeneRegion(geneObject) {
    let me = this;
    if (geneObject.startOrig == null) {
      geneObject.startOrig = geneObject.start;
    }
    if (geneObject.endOrig == null) {
      geneObject.endOrig = geneObject.end;
    }
    // Open up gene region to include upstream and downstream region;
    geneObject.start = geneObject.startOrig < GENE_REGION_BUFFER ? 0 : geneObject.startOrig - GENE_REGION_BUFFER;
    // TODO: Don't go past length of reference
    geneObject.end   = geneObject.endOrig + GENE_REGION_BUFFER;

  }


}