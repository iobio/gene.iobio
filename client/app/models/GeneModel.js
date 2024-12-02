import Reactor                 from './Reactor.js';
import CaseInsensitiveMap      from './CaseInsensitiveMap.js'

class GeneModel {
  constructor(globalApp, enforceGeneLimit, genomeBuildHelper, genePanels) {

    this.globalApp                 = globalApp;
    this.enforceGeneLimit          = enforceGeneLimit;
    this.genomeBuildHelper         = genomeBuildHelper;
    this.genePanels                = genePanels;
    
    this.phenolyzerServer          = "https://services.backend.iobio.io/phenolyzer/";

    this.NCBI_GENE_SEARCH_URL      = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gene&usehistory=y&retmode=json";
    this.NCBI_GENE_SUMMARY_URL     = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&usehistory=y&retmode=json";


    this.NCBI_PUBMED_SEARCH_URL    = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&usehistory=y&retmode=json";
    this.NCBI_PUBMED_SUMMARY_URL   = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&usehistory=y&retmode=json";

    this.ENSEMBL_GENE_URL          = "https://rest.ensembl.org/xrefs/symbol/homo_sapiens/GENESYMBOL?content-type=application/json"
    this.ENSEMBL_LOOKUP_BY_ID      = "https://rest.ensembl.org/xrefs/id/ENSEMBL-GENE-ID?content-type=application/json"
    this.OMIM_URL                  = "https://api.omim.org/api/";
    this.warnedMissingOMIMApiKey   = false;

    this.HPO_URL                   = "https://hpo.jax.org/api/hpo/gene/"

    this.linkTemplates = {
        omim:      { display: 'OMIM',      url: 'https://www.omim.org/search/?search=GENESYMBOL'},
        opentargets:{ display: 'Open Targets',      url: 'https://platform.opentargets.org/target/ENSEMBL-GENE-ID/associations/'},
        humanmine: { display: 'HumanMine', url: 'http://www.humanmine.org/humanmine/keywordSearchResults.do?searchTerm=+GENESYMBOL&searchSubmit=GO'},
        ncbi:      { display: 'NCBI',      url: 'https://www.ncbi.nlm.nih.gov/gene/GENEUID'},
        pubmed:    { display: 'PubMed',    url: 'https://pubmed.ncbi.nlm.nih.gov/?from_uid=GENEUID&linkname=gene_pubmed'},
        decipher:  { display: 'DECIPHER',  url: 'https://decipher.sanger.ac.uk/search?q=GENESYMBOL'},
        marrvel:   { display: 'MARRVEL',   url: 'http://marrvel.org/search/gene/GENESYMBOL'},
        genecards: { display: 'GeneCards', url: 'https://www.genecards.org/cgi-bin/carddisp.pl?gene=GENESYMBOL'},
        uniprot:   { display: 'UniProt',   url: 'http://www.uniprot.org/uniprot/?query=gene:GENESYMBOL AND organism:"Homo sapiens (Human) [9606]"'},
        gtex:      { display: 'GTex',      url: 'https://www.gtexportal.org/home/gene/GENESYMBOL'},
        humanproteinatlas:
                    { display: 'Human Protein Atlas', url: 'https://www.proteinatlas.org/search/gene_name:GENESYMBOL'},
        ucsc:       { display: 'UCSC Browser',        url: 'http://genome.ucsc.edu/cgi-bin/hgTracks?db=GENOMEBUILD-ALIAS-UCSC&position=GENECOORD'},
    }

    this.variantLinkTemplates = {
        gnomad:    { display: 'gnomAD',       url: 'http://gnomad.broadinstitute.org/variant/VARIANTCOORD-GNOMAD'},
        varsome:   { display: 'VarSome',      url: 'https://varsome.com/variant/GENOMEBUILD-ALIAS-UCSC/VARIANTCOORD-VARSOME'},
        dbsnp:     { display: 'dbSNP',        url: 'http://www.ncbi.nlm.nih.gov/snp/VARIANT-RSID'},
        ucsc:      { display: 'UCSC Browser', url: 'http://genome.ucsc.edu/cgi-bin/hgTracks?db=GENOMEBUILD-ALIAS-UCSC&position=VARIANTCOORD-UCSC'},
        clinvar:   { display: 'ClinVar',      url: 'https://www.ncbi.nlm.nih.gov/clinvar/variation/VARIANT-CLINVAR-UID/'}
    }

    this.geneSources = ['gencode', 'refseq'];

    this.geneSource = 'gencode';
    this.refseqOnly = {};
    this.gencodeOnly = {};

    this.translator = null;


    this.geneNames = [];
    this.geneDangerSummaries = {};
    this.sortedGeneNames = [];
    this.candidateGenes = null;


    this.geneNCBISummaries = {};
    this.geneOMIMEntries = {};
    this.genePubMedEntries = {};
    this.genePubMedCount = {};
    this.geneClinvarPhenotypes = {};
    this.genePhenotypes = {};
    this.geneDisorders = {};
    this.geneObjects = {};
    this.geneToLatestTranscript = {};
    this.geneToEnsemblId = {};
    this.geneToHPOTerms = {};


    this.validGeneNameMap = new CaseInsensitiveMap();
    this.geneEntryMap = {};
    this.clinvarGenes = {};

    this.transcriptCodingRegions = {};

    this.geneRegionBuffer = 1000;

    this.NUMBER_PHENOLYZER_GENES = 300;
    this.phenolyzerTopGenesToKeep = 20;
    this.phenolyzerGenes = [];

    this.pendingNCBIRequests = {};

    this.rankedGenes = {};

    this.genePhenotypeHits = {};

    this.isFullAnalysis = false;

    this.genesAssociatedWithSource = {};
    
    this.reactor = new Reactor();
    this.reactor.registerEvent("geneDangerSummarized")
    this.reactor.registerEvent("alertIssued")
    this.reactor.registerEvent("alertRetracted")
    this.reactor.registerEvent("selectGene")
    this.reactor.registerEvent("removeGene")

  }
  addEventListener(eventName, callback) {
    this.reactor.addEventListener(eventName, callback)
  }

  dispatchEvent(eventName, eventArgs) {
    this.reactor.dispatchEvent(eventName, eventArgs)
  }


  getGenePanelNames() {
    let self = this;
    let siteName = process.env.SITE_NAME;
    let filteredGenePanelNames = Object.keys(this.genePanels).filter(function(name) {
      let gp = self.genePanels[name];
      if (gp.sites == null || (siteName != null && siteName.length > 0 && gp.sites.indexOf(siteName) >= 0)) {
        return true;
      } else {
        return false;
      }
    })
    return filteredGenePanelNames;
  }

  getGenePanelShortName(name) {
    if (this.genePanels[name]) {
      return this.genePanels[name].shortName
    } else {
      return null;
    }
  }

  getGenePanelGenes(name) {
    if (this.genePanels[name]) {
      return this.genePanels[name].genes;
    } else {
      return null;
    }
  }

  setCandidateGenes(genes) {
    let self = this;
    self.candidateGenes = {};
    genes.forEach(function(gene) {
      self.candidateGenes[gene] = true;
    })
  }

  getCandidateGenes() {
    let self = this;
    return Object.keys(self.candidateGenes);
  }

  isCandidateGene(theGeneName) {
    let self = this;
    if (self.candidateGenes != null) {
      return self.candidateGenes[theGeneName];
    } else {
      return true;
    }
  }


  getGenePhenotypeHits(geneName) {
    if (this.genePhenotypeHits) {
      return this.genePhenotypeHits[geneName];
    } else {
      return null;
    }
  }


  setGenePhenotypeHitsFromClin(genesReport) {
    let self = this;
    if (genesReport) {
      this.genePhenotypeHits = {};
      genesReport.forEach(function(geneEntry) {
        var searchTerms = self.genePhenotypeHits[geneEntry.name];
        if (searchTerms == null) {
          searchTerms = {};
          self.genePhenotypeHits[geneEntry.name] = searchTerms;
        }
        if (geneEntry.searchTermsGtr && geneEntry.searchTermsGtr.length > 0) {
          geneEntry.searchTermsGtr.forEach(function(searchTermObject) {
            var searchTerm = searchTermObject.searchTerm.split(" ").join("_");
            var ranks = searchTerms[searchTerm];
            if (ranks == null) {
              ranks = [];
              searchTerms[searchTerm] = ranks;
            }
            ranks.push( {'rank': searchTermObject.rank, 'source': 'GTR'});
          })
        }
        if (geneEntry.searchTermsPhenolyzer && geneEntry.searchTermsPhenolyzer.length > 0) {
          geneEntry.searchTermsPhenolyzer.forEach(function(searchTermObject) {
            var searchTerm = searchTermObject.searchTerm.split(" ").join("_");
            var ranks = searchTerms[searchTerm];
            if (ranks == null) {
              ranks = [];
              searchTerms[searchTerm] = ranks;
            }
            ranks.push( {'rank': searchTermObject.rank, 'source': 'Phenolyzer'});
          })
        }
        if (geneEntry.searchTermHpo && geneEntry.searchTermHpo.length > 0) {
          geneEntry.searchTermHpo.forEach(function(searchTermObject) {
            var searchTerm = searchTermObject.searchTerm.split(" ").join("_");
            var ranks = searchTerms[searchTerm];
            if (ranks == null) {
              ranks = [];
              searchTerms[searchTerm] = ranks;
            }
            ranks.push( { 'hpoPhenotype': searchTermObject.hpoPhenotype, 'source': 'HPO'});
          })
        }

      })

    }
  }

  setGenePhenotypeHitsFromPhenolyzer(phenotypeTerm, phenotypeGenes) {
    let self = this;

    if (phenotypeGenes && phenotypeGenes.length > 0) {
      var searchTerm = phenotypeTerm.split(" ").join("_");
      phenotypeGenes.forEach(function(phenotypeGene) {
        var searchTerms = self.genePhenotypeHits[phenotypeGene.geneName];
        if (searchTerms == null) {
          searchTerms = {};
          self.genePhenotypeHits[phenotypeGene.geneName] = searchTerms;
        }
        var ranks = searchTerms[searchTerm];
        if (ranks == null) {
          ranks = [];
          searchTerms[searchTerm] = ranks;
        }
        let matchingRanks = ranks.filter(function(entry) {
          return entry.source == 'Phenolyzer' && entry.rank == phenotypeGene.rank;
        })
        if (matchingRanks.length == 0) {
          ranks.push( {'rank': phenotypeGene.rank, 'source': 'Phenolyzer'});
        }
      })
    }

  }


  getPhenotypeHits(geneName) {
    return this.genePhenotypeHits[geneName];
  }

  setRankedGenes(rankedGenes) {
    let self = this;
    self.rankedGenes = {};
    if (rankedGenes.gtr) {
      rankedGenes.gtr.forEach(function(gtrGene) {
        let theRankedGene = self.rankedGenes[gtrGene.name];
        if (theRankedGene == null) {
          theRankedGene = { 'name': gtrGene.name, 'gtrRank': gtrGene.gtrRank, 'gtrAssociated': gtrGene.gtrAssociated};
          self.rankedGenes[gtrGene.name] = theRankedGene;
        } else {
          theRankedGene.gtrRank = gtrGene.gtrRank;
          theRankedGene.gtrAssociated = gtrGene.gtrAssociated;
        }
      })
    }
    if (rankedGenes.phenolyzer) {
      rankedGenes.phenolyzer.forEach(function(phGene) {
        let theRankedGene = self.rankedGenes[phGene.name];
        if (theRankedGene == null) {
          theRankedGene = { 'name': phGene.name, 'phenolyzerRank': phGene.phenolyzerRank};
          self.rankedGenes[phGene.name] = theRankedGene;
        } else {
          theRankedGene.phenolyzerRank = phGene.phenolyzerRank;
        }
      })
    }
    if (rankedGenes.hpo) {
      rankedGenes.hpo.forEach(function(hpoGene) {
        let theRankedGene = self.rankedGenes[hpoGene.name];
        if (theRankedGene == null) {
          theRankedGene = { 'name': hpoGene.name, 'hpoRank': hpoGene.hpoRank};
          self.rankedGenes[hpoGene.name] = theRankedGene;
        } else {
          theRankedGene.hpoRank = hpoGene.hpoRank;
        }
      })
    }
  }

  getGeneRank(geneName) {
    if (this.rankedGenes) {
      return this.rankedGenes[geneName];
    } else {
      var rank = this.geneNames.indexOf(geneName) + 1;
      return { 'name': geneName, 'genericRank': rank};
    }
  }

  promiseAddGeneName(geneName) {
    let me = this;

    return new Promise(function(resolve, reject) {


      if (geneName == null || geneName.length == 0) {
        resolve({'geneName': geneName,
                'success': false,
                'status': 'bypassed',
                'message': 'Blank gene name encountered.',
                'geneObject': null})
      } else {
        
        if (me.geneNames.indexOf(geneName) < 0) {
          // Add the gene if it isn't already added
          // Even invalid genes will get added b/c we want
          // to show an error or warning message for
          // the gene.
          me.geneNames.push(geneName.toUpperCase());
          me.sortedGeneNames.push(geneName.toUpperCase());

          // Now we will try to get the gene and its transcripts.
          let theGeneObject = null;
          me.promiseGetCachedGeneObject(geneName)
          .then(function(geneObject) {
            theGeneObject = geneObject;
            // Success. Now get the gene phenotypes
            me.promiseGetGenePhenotypes(geneObject.gene_name)
            .then(function() {
              // We have successfully added the gene, retreived the gene
              // object and transcripts, and the gene phenotypes.
              // Resolve with justAdded set to true.
              resolve({'geneName':   theGeneObject.gene_name,
                       'success':    true,
                       'status':     'added',
                       'geneObject': theGeneObject});

            })
            .catch(function(error) {
              let msg  =  "Problem getting phenotypes for gene " + "<pre>" + geneName + "</pre>."
              me.dispatchEvent("alertIssued", "error",
                  msg,
                  geneName,
                  [error]);
              resolve({'geneName':   geneName,
                  'success':    false,
                  'status':     'added',
                  'geneObject': theGeneObject});

            })
          })
          .catch(function(error) {
            // Unable to get gene object for the gene
              resolve({'geneName': geneName,
                       'success':  false,
                       'status':   'added',
                       'geneObject': null})

          })
        } else {
          // We have already added this gene
          resolve({'geneName': geneName,
                  'success':  true,
                  'status':   'already_added',
                  'geneObject': me.geneObjects[geneName.toUpperCase()]})
        }
      }
    })
  }


  promiseAddGenesOrAliases(genesToAdd, removeInvalidGenes=true) {
    let self = this;
    return new Promise(function(resolve, reject) {
      if (genesToAdd && genesToAdd.length > 0) {
        // Populate the knownGeneMap with all valid
        // gene names so that we don't make individual
        // requests to gene info service to lookup the
        // gene entry
        self.promiseCacheGeneEntries(genesToAdd)
        .then(function() {
          let promises = [];
          genesToAdd.forEach(function(geneName) {
            // Add the gene or if no transcripts, find an alias
            // and use it. The second arg indicates that we
            // don't want to select (show) the gene after
            // the add
            // Don't remove invalid genes so that the
            // user can see the error message
            // to understand why the gene was bypassed
            let p = self.promiseAddGeneOrAlias(geneName, false, false,removeInvalidGenes )
            promises.push(p)
          })
          Promise.all(promises)
          .then(function() {
            resolve(true)
          })
          .catch(function(error) {
            reject(error)
          })

        })
        .catch(function(error) {
          console.log(error)
          reject(error)
        })
      } else {
        return resolve(true)
      }
    })
  }

  promiseAddGeneOrAlias(geneName,
                        selectOriginalGene=true,
                        selectReplacementGene=true,
                        removeOriginalGeneIfReplaced=true) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let theGeneName = geneName;
      let geneAdded = false;
      
      self.promiseAddGeneName(theGeneName)
      .then(function(response) {

        // We have added the gene, but at this point, we haven't validated it.
        // promiseGetCachedGeneObject() will resolve with the gene
        // object when the gene name is valid and it has transcripts
        // for the build and source, and will reject under other
        // circumstances, detailed in the catch block below.
        
        return self.promiseGetCachedGeneObject(theGeneName)
      })
      .then(function(geneObject) {
        // The original gene is valid and has transcripts for the build and source.
        //  Optionally, select the gene from the left side panel.
        if (selectOriginalGene) {
          self.dispatchEvent("selectGene", theGeneName)
        }
        resolve({'geneName': theGeneName, 'added': geneAdded, 'success': true, 'geneObject': geneObject});
      })
      .catch(function(error) {
        
        // This promise will resolve under this circumstance:
        // 1. The gene name is found or the gene name is a valid gene alias
        // AND
        // 2. The gene has at least 1 transcript for the build and source
        //
        // getCachedGeneObject rejected due to one of the following:
        // 1. The gene name isn't found (response.isValidGeneName is false)
        // OR
        // 2. The gene name is valid, but there are no transcripts for the
        //    build and source. But good news -- there is a gene alias with 
        //    transcripts for the build and gene source. 
        //    The catch block will add the alternative gene name
        //    (response.useDifferentGene) instead of the gene name provided.
        // OR
        // 3. The gene name is valid, but there are no transcripts for the
        //    build and source. But somewhat hopeful news -- We didn't find 
        //    a suitable alternative gene alias with transcripts, but
        //    there are transcripts for the other gene source 
        //    (response.useDifferentSource). The catch block will alert the
        //    user, but not automatically change the source as this applies
        //    across all genes and requires reanalysis of the variants.
        // 4. Bummer. The gene name is valid, but there are no transcripts for the
        //    build and source, nor are there any alternative gene aliases that
        //    have transcripts, nor are there any transcripts under the other
        //    gene source. 
        // OR
        // 5. Major bummer. An unexpected error occurred. Alert the user of the error.
        //    

        // The gene that was selected doesn't have any transcripts for the source and
        // build. We are adding a gene that is an alias for the gene to user selected.
        // This new gene has transcripts for the source and build.
        if (error.hasOwnProperty('useDifferentGene')) {
          if (removeOriginalGeneIfReplaced) {

            self.dispatchEvent("alertRetracted", 'warning', error.message, theGeneName)
            self.dispatchEvent("removeGene", theGeneName)
          }
          // Add the replacement gene
          self.promiseAddGeneName(error.useDifferentGene)
          .then(function(differentGeneAdded) {
            // We just added the gene alias that has transcripts and retreived the
            // gene object. At this point, optionally, select the gene (alias) from
            // the genes side panel. Now add the alert indicating that we are using
            // the gene alias instead of the gene requested. Resolve, indicating
            // we have successfully added the gene alias.
            self.promiseGetCachedGeneObject(error.useDifferentGene)
            .then(function(differentGeneObject) {
              // The replacement gene (alias) is valid (as expected). Optionally select
              // the replacement gene (alias) from the left side panel.
              if (selectReplacementGene) {
                setTimeout(function() {
                  self.dispatchEvent("selectGene", error.useDifferentGene)

                  setTimeout(function() {
                    self.dispatchEvent("alertIssued", error.hasOwnProperty('alertType') ? error.alertType : 'error',
                                  error.hasOwnProperty('message') ? error.message :
                                        'Gene ' + theGeneName + ' not found. Using alias ' + error.useDifferentGene + ' instead.',
                                  error.useDifferentGene,
                                  null,
                                  error.hasOwnProperty("options") ? error.options : {'selectAlert' : true, 'showAlertPanel': true})
                    resolve({'geneName':          error.useDifferentGene,
                              'added':            differentGeneAdded,
                              'geneObject':       differentGeneObject,
                              'success':          true,
                              'isAlias' :         true,
                              'originalGeneName': theGeneName});
                  }, 1000)
                },1000)
              } else {
                self.dispatchEvent("alertIssued", error.hasOwnProperty('alertType') ? error.alertType : 'error',
                              error.hasOwnProperty('message') ? error.message : error,
                              error.useDifferentGene,
                              null,
                              error.hasOwnProperty("options") ? error.options : {'selectAlert' : true, 'showAlertPanel': true})
                resolve({'geneName':         error.useDifferentGene,
                          'added':            differentGeneAdded,
                          'geneObject':       differentGeneObject,
                          'success':          true,
                          'isAlias' :         true,
                          'originalGeneName': theGeneName});
              }
            })
          })

        } else {
          // The orginal gene we added isn't present or doesn't have any transcripts
          // for the build and gene source. And none of its aliases have transcripts
          // for the build and gene source. Reject and add an alert.
          self.dispatchEvent("alertIssued", error.hasOwnProperty('alertType') ? error.alertType : 'error',
            error.hasOwnProperty('message') ? error.message :
                              'Unable to get gene transcripts for gene ' + theGeneName,
            theGeneName,
            error.hasOwnProperty('errorDetails') ? error.errorDetails : null,
            error.hasOwnProperty("options") ? error.options : {'selectAlert' : true, 'showAlertPanel': true})

          if (error.alertType && error.alertType == 'warning') {
            resolve({'geneName':          theGeneName,
                      'added':            false,
                      'geneObject':       null,
                      'success':          false,
                      'isAlias' :         false,
                      'originalGeneName': theGeneName})
          } else {
            reject(error)
          }

        }
      })
    })
  }


  ACMGGenes() {
    this.promiseCopyPasteGenes(this.getGenePanel("ACMG 59").join(","));
  }


  promiseCopyPasteGenes(genesString, options={replace:true, warnOnDup: true}) {
    var me = this;

    return new Promise(function(resolve, reject) {

      let newGenes = null;
      me._promiseCopyPasteGenesImpl(genesString, options)
      .then(function(results) {
        newGenes = results && results.hasOwnProperty('newGenes') ? results.newGenes : null;
        me.getNCBIGeneSummariesForceWait(me.geneNames)

        var promises = [];
        me.geneNames.forEach(function(geneName) {
          promises.push(me.promiseGetCachedGeneObject(geneName));
          promises.push(me.promiseGetGenePhenotypes(geneName));
        })

        return Promise.all(promises)
      })
      .then(function(results) {
        resolve({'newGenes': newGenes});
      })
      .catch(function(error) {
        console.log(error);
        resolve({'newGenes': newGenes});
      })

    })


 }

 getCopyPasteGeneCount(genesString) {
    if (genesString == "") {
      return 0;
    }
    genesString = genesString.replace(/\s*$/, "");
    var geneNameList = genesString.split(/(?:\s+|,\s+|,|\n)/g);
    return geneNameList.length;
 }

 _promiseCopyPasteGenesImpl(genesString, options={replace: true, warnOnDup: true}) {
    var me = this;

    return new Promise(function(resolve, reject) {

      genesString = genesString.replace(/\s*$/, "");
      var geneNameList = genesString.split(/(?:\s+|,\s+|,|\n)/g);



      var genesToApply = [];
      var newGenes = [];
      var unknownGeneNames = {};
      var duplicateGeneNames = {};
      var promises = [];
      me.promiseCacheGeneEntries(geneNameList)
      .then(function() {
        geneNameList.forEach( function(geneName) {
          let theGeneName = geneName.trim();
          if (theGeneName.length > 0) {
            let p = me.promiseIsValidGeneName(theGeneName)
            .then(function(response) {
              if (response.isKnownGene) {
                if (options.replace) {
                  // Make sure this isn't a duplicate.
                  if (genesToApply.indexOf(response.geneName.toUpperCase()) < 0) {
                    genesToApply.push(response.geneName.toUpperCase());
                  } else {
                    duplicateGeneNames[response.geneName.toUpperCase()] = true;
                  }

                } else {

                  // Make sure this isn't a duplicate and check for dups in the existing
                  // gene list as well.
                  if (genesToApply.indexOf(response.geneName.toUpperCase()) < 0
                  && me.geneNames.indexOf(response.geneName.toUpperCase()) < 0) {
                    genesToApply.push(response.geneName.toUpperCase());
                  } else {
                    duplicateGeneNames[response.geneName.toUpperCase()] = true;
                  }
                }

                // Keep track of genes that are not in the current list. We
                // send this list back in the resolve so that the caller knows
                // of the genes just added. This is useful when selecting
                // a variant in the variants tab once all of the genes have
                // been analyzed.
                if (me.geneNames.indexOf(response.geneName.toUpperCase()) < 0) {
                  newGenes.push(response.geneName.toUpperCase())
                }

              } else {
                // Add to the invalid gene list if it isn't in the genes json
                unknownGeneNames[response.geneName.toUpperCase()] = true;
                if (genesToApply.indexOf(response.geneName.toUpperCase()) < 0
                    && (options.replace || me.geneNames.indexOf(response.geneName.toUpperCase()) < 0)) {
                  genesToApply.push(response.geneName.toUpperCase());
                }
              }
            })
            promises.push(p);
          }
        });

        Promise.all(promises)
        .then(function() {


          if (options.replace) {
            me.geneNames = [];
            me.sortedGeneNames = [];
          }

          // Add the genes
          // Note: We don't have to remove genes because the gene list is either
          //       replaced or combined with the existing list.
          //  1. When we copy/paste genes from the nav genes list, the genes are replaced.
          //  2. When we get a new list of genes from Phenolyzer, the user gets to
          //     specify if the genes are replaced or combined. In the former case, the
          //     entire list of genes is replaced, in the latter, genes are added
          //     to the existing list. In both cases, we don't have to handle removing
          //     individual genes.
          genesToApply.forEach(function(geneName) {
            me.geneNames.push(geneName);
            me.sortedGeneNames.push(geneName);
          })

          if (Object.keys(unknownGeneNames).length > 0) {
            var message = "Bypassing unknown genes: " + Object.keys(unknownGeneNames).join(", ") + ".";
            me.dispatchEvent("alertIssued", "warning", message, Object.keys(unknownGeneNames).join(", "), Object.keys(unknownGeneNames))
          }

          if (Object.keys(duplicateGeneNames).length > 0 && options.warnOnDup) {
            var message = "Bypassing duplicate gene name(s): " + Object.keys(duplicateGeneNames).join(", ") + ".";
            me.dispatchEvent("alertIssued", "warning", message, null, Object.keys(duplicateGeneNames))
          }

          if (me.enforceGeneLimit) {
            if (me.globalApp.maxGeneCount && me.geneNames.length > me.globalApp.maxGeneCount) {
              var bypassedCount = me.geneNames.length - me.globalApp.maxGeneCount;
              me.geneNames = me.geneNames.slice(0, me.globalApp.maxGeneCount);
              let msg = "Due to browser cache limitations, only the first " + me.globalApp.maxGeneCount
                + " genes were added. "
                + bypassedCount.toString()
                + " "
                + (bypassedCount == 1 ? "gene" : "genes")
                +  " bypassed.";
              me.dispatchEvent("alertIssued", "warning", msg)
            }

          }

          resolve({'newGenes': newGenes});

        })
        .catch(function(error) {
          reject(error);
        })


      })

    })

 }


  setDangerSummary(geneName, dangerSummary) {
    if (geneName == null) {
      return;
    }
    delete this.geneDangerSummaries[geneName];
    this.geneDangerSummaries[geneName.toUpperCase()] = dangerSummary;
    this.dispatchEvent("geneDangerSummarized", dangerSummary);
  }

  getDangerSummary(geneName) {
    if (geneName == null) {
      return
    }
    return this.geneDangerSummaries[geneName.toUpperCase()];
  }

  clearDangerSummaries() {
    this.geneDangerSummaries = {};
  }

  clearGeneToLatestTranscript() {
    this.geneToLatestTranscript = {}
  }


  promiseLoadClinvarGenes() {
    let me = this;
    var p = new Promise(function(resolve, reject) {

      me.clinvarGenes = {};

      $.ajax({
          url: me.globalApp.clinvarGenesUrl,
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

  getTranscript(geneObject, transcriptId) {
    var theTranscripts = geneObject.transcripts.filter(function(transcript) {
      return transcript.transcript_id == transcriptId;
    });
    return theTranscripts.length > 0 ? theTranscripts[0] : null;
  }

  getCanonicalTranscript(theGeneObject) {
    let me = this;
    var geneObject = theGeneObject != null ? theGeneObject : window.gene;
    
    if (geneObject == null || geneObject.gene_name == null) {
      console.log("Null gene object sent into method GeneModel.getCanonicalTranscript")
      return null;
      
    }
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
        a.type = +0;
      } else if (a.hasOwnProperty("gene_type") && a.gene_type == "gene")  {
        aType = +0;
        a.type = +0;
      } else {
        aType = +1;
        a.type = +1;
      }
      if (b.hasOwnProperty("transcript_type") && b.transcript_type == 'protein_coding') {
        bType = +0;
        b.type = +0;
      } else if (b.hasOwnProperty("gene_type") && b.gene_type == "gene")  {
        bType = +0;
        b.type = +0;
      } else {
        bType = +1;
        b.type = +1;
      }

      var aManeSelect = +1;
      var bManeSelect = +1;
      if (a.hasOwnProperty("is_mane_select") && a.is_mane_select == 'true') {
        aManeSelect = +0;
      }
      if (b.hasOwnProperty("is_mane_select") && b.is_mane_select == 'true') {
        bManeSelect = +0;
      }


      var aLevel = +2;
      var bLevel = +2;
      if (me.geneSource.toLowerCase() == 'refseq') {
        if (a.transcript_id.indexOf("NM_") == 0 ) {
          aLevel = +0;
          a.level = +0;
        }
        if (b.transcript_id.indexOf("NM_") == 0 ) {
          bLevel = +0;
          b.level = +0;
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
          a.source = +0;
        }
        if (b.annotation_source == 'BestRefSeq' ) {
          bSource = +0;
          b.source = +0;
        }
      }

      a.sort = aType + ' ' + aLevel + ' ' + aSource + ' ' + a.cdsLength + ' ' + a.order;
      b.sort = bType + ' ' + bLevel + ' ' + bSource + ' ' + b.cdsLength + ' ' + b.order;

      if (aManeSelect == bManeSelect) {
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
      } else if (aManeSelect < bManeSelect) {
        return -1;
      } else {
        return 1;
      }
    });
    canonical = sortedTranscripts[0];
    let nextTranscript = sortedTranscripts.length > 1 ? sortedTranscripts[1] : null
    if (canonical) {
      canonical.isCanonical = true;
      canonical.canonical_reason = ''
      if (canonical.is_mane_select && canonical.is_mane_select == 'true') {
        canonical.canonical_reason = 'MANE SELECT'
      }
    }
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

  getNCBIGeneSummariesForceWait(geneNames) {
    let me = this;
    let waitSeconds = 0;
    if (Object.keys(me.geneNCBISummaries).length > 0) {
      waitSeconds = 5000;
    }
    setTimeout(function() {
      me.promiseGetNCBIGeneSummaries(geneNames)
      .catch(function(error) {
        console.log("Error when getting NCBI gene summaries for gene " + geneNames);
        console.log(error)
      })
    }, waitSeconds);
  }

  promiseGetNCBIGeneSummaries(geneNames) {
    let me = this;
    return new Promise( function(resolve, reject) {

      let unknownGeneInfo = {description: ' ', summary: ' '};

      let theGeneNames = geneNames.filter(function(geneName) {
        return me.geneNCBISummaries[geneName] == null;
      })

      if (theGeneNames.length == 0) {
        resolve();
      } else {

        let searchGeneExpr = "";
        theGeneNames.forEach(function(geneName) {
          var geneInfo = me.geneNCBISummaries[geneName];
          if (geneInfo == null) {
            if (searchGeneExpr.length > 0) {
              searchGeneExpr += " OR ";
            }
            searchGeneExpr += geneName + "[Gene name]";
          }
        })
        var searchUrl = me.NCBI_GENE_SEARCH_URL + "&term=" + "(9606[Taxonomy ID] AND (" + searchGeneExpr + "))";
        me.pendingNCBIRequests[theGeneNames] = true;

        $.ajax( searchUrl )
         .done(function(data) {

            // Now that we have the gene ID, get the NCBI gene summary
            var webenv = data["esearchresult"]["webenv"];
            var queryKey = data["esearchresult"]["querykey"];
            var summaryUrl = me.NCBI_GENE_SUMMARY_URL + "&query_key=" + queryKey + "&WebEnv=" + webenv;
            $.ajax( summaryUrl )
            .done(function(sumData) {
                if (sumData.result == null || sumData.result.uids.length == 0) {
                  if (sumData.esummaryresult && sumData.esummaryresult.length > 0) {
                    sumData.esummaryresult.forEach( function(message) {
                      console.log("Unable to get NCBI gene summary from eutils esummary")
                      console.log(message);
                    });
                  }
                  delete me.pendingNCBIRequests[theGeneNames];
                  reject();

                } else {

                  sumData.result.uids.forEach(function(uid) {
                    var geneInfo = sumData.result[uid];
                    me.geneNCBISummaries[geneInfo.name] = geneInfo;

                  })
                  delete me.pendingNCBIRequests[theGeneNames];
                  resolve();
                }
            })
           .fail(function(error) {
              console.log(error)
              if (me.pendingNCBIRequests && me.pendingNCBIRequests[theGeneNames]) {
                delete me.pendingNCBIRequests[theGeneNames];
              }
              console.log("Error occurred when making http request to NCBI eutils esummary for genes " + geneNames.join(","));
              reject(error);
            })

          })
          .fail(function(error) {
            console.log(error)
            if (me.pendingNCBIRequests && me.pendingNCBIRequests[theGeneNames]) {
              delete me.pendingNCBIRequests[theGeneNames];
            }
            console.log("Error occurred when making http request to NCBI eutils esearch for gene " + geneNames.join(","));
            reject(error);
          })

      }

    })


  }


  promiseGetNCBIGeneSummary(geneName) {
    let me = this;
    return new Promise( function(resolve, reject) {

      var geneInfo = me.geneNCBISummaries[geneName];
      let unknownGeneInfo = {description: ' ', summary: ' '};

      if (geneInfo != null && geneInfo.summary != " ") {
        me.dispatchEvent("alertRetracted", "warning", "Unable to get NCBI gene summary", geneName)
        resolve(geneInfo);
      } else {
        // Search NCBI based on the gene name to obtain the gene ID
        var url = me.NCBI_GENE_SEARCH_URL + "&term=" + "(" + geneName + "[Gene name]" + " AND 9606[Taxonomy ID]";
        $.ajax( url )
        .done(function(data) {

          // Now that we have the gene ID, get the NCBI gene summary
          var webenv = data["esearchresult"]["webenv"];
          var queryKey = data["esearchresult"]["querykey"];
          var summaryUrl = me.NCBI_GENE_SUMMARY_URL + "&query_key=" + queryKey + "&WebEnv=" + webenv;
          // To avoid status clde 429 (Too Many Requests), wait 1/2 second before issuing the eutil summary request
          setTimeout(function() {
            $.ajax( summaryUrl )
            .done(function(sumData) {
                if (sumData.result == null || sumData.result.uids.length == 0) {
                  if (sumData.esummaryresult && sumData.esummaryresult.length > 0) {
                    sumData.esummaryresult.forEach( function(message) {
                      console.log("Unable to get NCBI gene summary from eutils esummary")
                      console.log(message);
                    });
                  }
                  me.geneNCBISummaries[geneName] = unknownGeneInfo;
                  me.dispatchEvent("alertRetracted", "warning", "Unable to get NCBI gene summary", geneName)
  
                  resolve(unknownGeneInfo);
  
                } else {
  
                  var uid = sumData.result.uids[0];
                  var geneInfo = sumData.result[uid];
  
                  me.geneNCBISummaries[geneName] = geneInfo;
                  me.dispatchEvent("alertRetracted", "warning", "Unable to get NCBI gene summary", geneName)
                  resolve(geneInfo)
                }
            })
            .fail(function(response) {
              console.log("Error occurred when making http request to NCBI eutils esummary for gene " + geneName);
              console.log(response)
              me.dispatchEvent("alertIssued", "warning",
                "Unable to get NCBI gene summary (esummary) for gene <pre>" + geneName + "</pre>", geneName,
                ['Error occurred when making http request to NCBI eutils esummary',summaryUrl])
              me.geneNCBISummaries[geneName] = unknownGeneInfo;
              resolve(unknownGeneInfo);
            })
              
          },500)

        })
        .fail(function() {
          console.log("Error occurred when making http request to NCBI eutils esearch for gene " + geneName);
            me.dispatchEvent("alertIssued", "warning",
              "Unable to get NCBI gene summary (esearch) for gene <pre>" + geneName + "</pre>", geneName,
              ['Error occurred when making http request to NCBI eutils esearch',url])
          me.geneNCBISummaries[geneName] = unknownGeneInfo;
          resolve(geneInfo);
        })
      }
    });

  }

  promiseGetPubMedCount(theGeneName, options={useCached: true}) {
    let me = this;
    return new Promise( function(resolve, reject) {

      let theCount = me.genePubMedCount[theGeneName];
      if (theCount && options.useCached) {
        me.dispatchEvent("alertRetracted", "warning", "Unable to get PubMed count", theGeneName);
        resolve(theCount)
      }
      else {
        let geneName = theGeneName;
        var pubMedCount = null;
        var searchUrl = me.NCBI_PUBMED_SEARCH_URL  + "&term=" + geneName + "[title/abstract]";
        me.pendingNCBIRequests[geneName] = true;

        $.ajax( searchUrl )
         .done(function(data) {
          me.dispatchEvent("alertRetracted", "warning", "Unable to get PubMed count", geneName);

          // Now that we have the gene ID, get the NCBI gene summary
          pubMedCount = data["esearchresult"]["count"]
          me.genePubMedCount[geneName] = pubMedCount;
          resolve(pubMedCount)

         })
         .fail(function(error) {
            delete me.pendingNCBIRequests[geneName];

            let msg = "Unable to get PubMed count for " + geneName;
            console.log(msg);
            console.log("Error occurred when making http request to NCBI eutils esummary pubmed for gene " + geneName);
            me.dispatchEvent("alertIssued", "warning", msg, geneName, [error])
            reject();
         })
      }
    })
  }

  promiseGetPubMedEntries(theGeneName, options={retmax: 5, useCached: true}) {
    let me = this;
    return new Promise( function(resolve, reject) {

      let theEntry = me.genePubMedEntries[theGeneName];
      if (theEntry && options.useCached) {
        me.dispatchEvent("alertRetracted", "warning", "Unable to get PubMed entries", theGeneName);
        resolve(theEntry)
      }
      else {

        let geneName = theGeneName;
        var pubMedEntries = [];
        var searchUrl = me.NCBI_PUBMED_SEARCH_URL  + "&term=" + geneName + "[title/abstract]";
        me.pendingNCBIRequests[geneName] = true;

        $.ajax( searchUrl )
        .done(function(data) {

            // Now that we have the gene ID, get the NCBI gene summary
            var webenv = data["esearchresult"]["webenv"];
            var queryKey = data["esearchresult"]["querykey"];
            var count = data["esearchresult"]["count"]
            var summaryUrl = me.NCBI_PUBMED_SUMMARY_URL + "&query_key=" + queryKey + "&WebEnv=" + webenv + "&retmax=" + options.retmax;
            $.ajax( summaryUrl )
            .done(function(sumData) {
              delete me.pendingNCBIRequests[geneName];

              if (sumData.result != null && sumData.result.uids && sumData.result.uids.length > 0) {
                sumData.result.uids.forEach(function(uid) {
                  var entry = sumData.result[uid];
                  pubMedEntries.push({uid: uid, title: entry.title, firstAuthor: entry.sortfirstauthor, pubDate: entry.pubdate, source: entry.source})

                })
                let theEntry = {geneName: geneName, count: count, entries: pubMedEntries};
                if (options.useCached) {
                  me.genePubMedEntries[geneName] = theEntry;
                }
                me.dispatchEvent("alertRetracted", "warning", "Unable to get PubMed entries", geneName);
                resolve(theEntry);
              } else {
                let theEntry = {geneName: geneName, count: 0, entries: null}
                if (options.useCached) {
                  me.genePubMedEntries[geneName] = theEntry;
                }
                me.dispatchEvent("alertRetracted", "warning", "Unable to get PubMed entries", geneName);
                resolve(theEntry)
              }

            })
           .fail(function(error) {
              delete me.pendingNCBIRequests[geneName];
              let msg = "Unable to get PubMed entries for <pre>" + geneName + "</pre>";
              console.log(msg)
              console.log("Error occurred when making http request to NCBI eutils esummary pubmed for gene " + geneName);
              me.dispatchEvent("alertIssued", "warning", msg, geneName, [error])
              reject();
            })

        })
        .fail(function(error) {
            delete me.pendingNCBIRequests[geneName];

            let msg = "Unable to get PubMed entries for " + geneName;
            console.log(msg);
            console.log("Error occurred when making http request to NCBI eutils esummary pubmed for gene " + geneName);
            me.dispatchEvent("alertIssued", "warning", msg, geneName, [error])
            reject();
        })

      }
    })
  }

  promiseGetClinvarPhenotypes(cohortModel, geneObject, transcript) {
    let self = this;
    return new Promise(function(resolve, reject) {

      let theEntry = self.geneClinvarPhenotypes[geneObject.gene_name];
      if (theEntry) {
        resolve(theEntry)
      } else {
        let geneName = geneObject.gene_name;
        cohortModel.promiseGetClinvarPhenotypes(geneObject, transcript)
        .then(function(data) {
          self.geneClinvarPhenotypes[geneName] = data;
          resolve(data);
        })
        .catch(function(error) {
          reject(error)
        })
      }
    })
  }




  promiseGetOMIMEntries(theGeneName) {
    let self = this;
    return new Promise(function(resolve, reject) {

      let theEntry = self.geneOMIMEntries[theGeneName];
      if (theEntry) {
        self.dispatchEvent("alertRetracted", "warning", "Cannot get OMIM entries", theGeneName);
        resolve(theEntry)
      } else {
        let geneName = theGeneName;
        self._promiseGetOMIMGene(geneName)
        .then(function(data) {
          if (data.phenotypes && data.phenotypes.length > 0) {
            let promises = [];
            let omimEntries = [];
            data.phenotypes.forEach(function(phenotype) {
              let p = self._promiseGetOMIMClinicalSynopsis(data.geneName, phenotype)
              .then(function(data) {
                omimEntries.push(data);
              })
              promises.push(p)
            })
            Promise.all(promises)
            .then(function() {
              let theEntry = {geneName: geneName, omimEntries: omimEntries};
              self.geneOMIMEntries[geneName] = theEntry;
              self.dispatchEvent("alertRetracted", "warning", "Cannot get OMIM entries", geneName);
              resolve(theEntry)
            })
          } else {
            let theEntry = {geneName: geneName, omimEntries: null};
            self.geneOMIMEntries[geneName] = theEntry;
            self.dispatchEvent("alertRetracted", "warning", "Cannot get OMIM entries", geneName);
            resolve(theEntry)
          }
        })
        .catch(function(error) {
          let msg = "Cannot get OMIM entries for gene <pre>" + theGeneName + "</pre>."
          console.log(msg)
          console.log(error)
          self.dispatchEvent("alertIssued", 'warning', msg, theGeneName)
          reject(error)
        })

      }

    })

  }

  promiseGetHPOTermsPublicAPI(geneName) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let hpoTerms = self.geneToHPOTerms[geneName];
      if (hpoTerms) {
        self.dispatchEvent("alertRetracted", "warning", "Cannot get HPO terms for gene", geneName);
        resolve(hpoTerms)
      } else {
        self.promiseGetNCBIGeneSummary(geneName)
        .then(function(ncbiSummary) {
          if (ncbiSummary && ncbiSummary.uid) {
            self.dispatchEvent("alertRetracted", "warning", "Unable to lookup NCBI id for gene", geneName);
            let url = self.HPO_URL + ncbiSummary.uid;
            $.ajax( url )
            .done(function(data) {
              self.geneToHPOTerms[geneName] = data;
              self.dispatchEvent("alertRetracted", "warning", "Cannot get HPO terms for gene", geneName);
              resolve(data)
            })
            .fail(function(error) {
              let msg = "Unable to get hpo terms for gene " + geneName;
              console.log(msg);
              console.log(error)
              self.dispatchEvent("alertIssued", "warning", "Cannot get HPO terms for gene <pre>" + geneName + "</pre>", geneName, [error])
              reject(msg + '. Error: ' + error);
            })
          } else {
            self.dispatchEvent("alertIssued", "warning", "Cannot get HPO terms for gene <pre>" + geneName + "</pre>. Unable to lookup NCBI id for gene.", geneName)
            reject("Unable to get gene HPO terms because lookup of NCBI gene returned empty results.")
          }
        })
      }
    })
  }

  _promiseGetOMIMGene(geneName) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let apiKey = process.env.OMIM_API_KEY;

      if (apiKey == null || apiKey == "") {
        if (!self.warnedMissingOMIMApiKey) {
          let msg ="Unable to access OMIM.  API key is required in env."
          self.dispatchEvent("alertIssued", "warning", msg, geneName)
          self.warnedMissingOMIMApiKey = true;
        }
        resolve();
      } else {
        let url = self.OMIM_URL  + 'entry/search'
          + '?apiKey=' + apiKey
          + '&search=approved_gene_symbol:' + geneName
          + '&format=json'
          + '&retrieve=geneMap'
          + '&start=0'
          + '&limit=10';

        $.ajax( url )
          .done(function(data) {
            let mimNumber = null;
            let phenotypes = null;
            if (data
              && data.omim.searchResponse
              && data.omim.searchResponse.geneMapList
              && data.omim.searchResponse.geneMapList.length > 0) {
              let geneMap = data.omim.searchResponse.geneMapList[0].geneMap;
              mimNumber = geneMap.mimNumber;
              if (geneMap.phenotypeMapList) {
                phenotypes = geneMap.phenotypeMapList.map(function(entry) {
                  return entry.phenotypeMap;
                })
              }
              self.dispatchEvent("alertRetracted", "warning", "Unable to get phenotype mim number OMIM", geneName);
              resolve({geneName: geneName, mimNumber: mimNumber, phenotypes: phenotypes});
            }
            else {
              let msg = "No OMIM entry found for gene " + geneName;
              reject(msg)
            }

          })
          .fail(function(error) {
              let msg = "Unable to get phenotype mim number OMIM for gene " + geneName;
              console.log(msg);
              console.log(error)
              self.dispatchEvent("alertIssued", "warning", msg, geneName)
              reject(msg + '. Error: ' + error);
          })

      }

    })
  }

  _promiseGetOMIMClinicalSynopsis(geneName, phenotype) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let apiKey = process.env.OMIM_API_KEY;

      let url = self.OMIM_URL  + 'clinicalSynopsis'
        + '?apiKey=' + apiKey
        + '&mimNumber=' + phenotype.phenotypeMimNumber
        + '&include=clinicalSynopsis'
        + '&format=json';

      $.ajax( url )
        .done(function(data) {
          let clinicalSynopsis = null;
          if (data && data.omim.clinicalSynopsisList && data.omim.clinicalSynopsisList.length > 0) {
            clinicalSynopsis = data.omim.clinicalSynopsisList[0].clinicalSynopsis;
          }
          resolve({geneName: geneName, phenotype: phenotype, clinicalSynopsis: clinicalSynopsis});
        })
        .fail(function(error) {
            let msg = "Unable to get clinical synopsis from OMIM " + url;
            console.log(msg);
            console.log(error)
            reject(msg + '. Error: ' + error);
        })
    })
  }


  clearAllGenes() {
    this.promiseCopyPasteGenes("");
  }

  removeGene(geneName) {
    let self = this;
    let geneNameUC = geneName.toUpperCase();

    var index = self.geneNames.indexOf(geneName);
    if (index >= 0) {
      self.geneNames.splice(index, 1);
    }

    index = self.sortedGeneNames.indexOf(geneName);
    if (index >= 0) {
      self.sortedGeneNames.splice(index, 1);
    }

    if (self.geneDangerSummaries && self.geneDangerSummaries.hasOwnProperty(geneName)) {
      delete self.geneDangerSummaries[geneName];
    }
    if (self.genePhenotypes && self.genePhenotypes.hasOwnProperty(geneName)) {
      delete self.genePhenotypes[geneName];
    }
    if (self.geneDisorders && self.geneDisorders.hasOwnProperty(geneName)) {
      delete self.geneDisorders[geneName];
    }
    if (self.geneToEnsemblId && self.geneToEnsemblId.hasOwnProperty(geneName)) {
      delete self.geneToEnsemblId[geneName];
    }

    if (self.geneToHPOTerms && self.geneToHPOTerms.hasOwnProperty(geneName)) {
      delete self.geneToHPOTerms[geneName]
    }

    if (self.geneObjects && self.geneObjects.hasOwnProperty(geneNameUC)) {
      delete self.geneObjects[geneNameUC];
    }
    
    
    if (self.geneEntryMap && self.geneEntryMap.hasOwnProperty(geneNameUC)) {
      delete self.geneEntryMap[geneNameUC];
    }
    
    if (self.validGeneNameMap && self.validGeneNameMap.has(geneNameUC)) {
      self.validGeneNameMap.delete(geneNameUC);
    }

    if (self.geneNCBISummaries && self.geneNCBISummaries.hasOwnProperty(geneName)) {
      delete self.geneNCBISummaries[geneName];
    }
    if (self.geneOMIMEntries && self.geneOMIMEntries.hasOwnProperty(geneName)) {
      delete self.geneOMIMEntries[geneName];
    }
    if (self.genePubMedEntries && self.genePubMedEntries.hasOwnProperty(geneName)) {
      delete self.genePubMedEntries[geneName];
    }
    if (self.genePubMedCount && self.genePubMedCount.hasOwnProperty(geneName)) {
      delete self.genePubMedCount[geneName];
    }
    if (self.geneToLatestTranscript && self.geneToLatestTranscript.hasOwnProperty(geneName)) {
      delete self.geneToLatestTranscript[geneName];
    }
    if (self.geneClinvarPhenotypes && self.geneClinvarPhenotypes.hasOwnProperty(geneName)) {
      delete self.geneClinvarPhenotypes[geneName];
    }
  }


  promiseGetGeneEnsemblId(geneName) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let ensemblGeneId = self.geneToEnsemblId[geneName.toUpperCase()]
      if (ensemblGeneId) {
        resolve({geneName: geneName, ensemblGeneId: ensemblGeneId});
      } else {
        let url = self.ENSEMBL_GENE_URL
        url = url.replace(/GENESYMBOL/g, geneName );
        $.ajax( url )
          .done(function(data) {
            if (data && Array.isArray(data)) {
              let ensemblIds = []
              data.forEach(function(entry) {
                if (ensemblGeneId == null && entry.type == "gene" && entry.id.startsWith("ENSG")) {
                  ensemblIds.push(entry.id);
                }
              })
              let lookupPromises = []
              let matchingEnsemblGeneId = null
              ensemblIds.forEach(function(id) {
                let p = self._promiseLookupEnsemblGene(id, geneName)
                .then(function(data) {
                  if (data && data.geneName.toUpperCase() == geneName.toUpperCase()) {
                    matchingEnsemblGeneId = data.ensembleGeneId
                  }
                })
                lookupPromises.push(p)
              })
              Promise.all(lookupPromises).then(function() {
                if (matchingEnsemblGeneId) {
                  self.geneToEnsemblId[geneName.toUpperCase()] = matchingEnsemblGeneId;
                  resolve({geneName: geneName, ensemblGeneId: matchingEnsemblGeneId});
                } else {
                  let msg = "Unable to find ensembl gene id that matches gene name " + geneName;
                  console.log(msg);
                  reject(msg );
                }
              })
              .catch(function(error) {
                reject(error)
              })
            }
          })
          .fail(function(error) {
              let msg = "Unable to get ensembl gene id " + url;
              console.log(msg);
              console.log(error)
              reject(msg + '. Error: ' + error);
          })

      }
    })
  }


  _promiseLookupEnsemblGene(id, geneName) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let theGeneName = geneName;
      let ensemblGeneId = id
      let url = self.ENSEMBL_LOOKUP_BY_ID
      url = url.replace(/ENSEMBL-GENE-ID/g, id );
      $.ajax( url )
      .done(function(data) {
        if (data && Array.isArray(data)) {
          let matchedEntry = null;
          data.forEach(function(entry) {
            if (entry.dbname ==  'EntrezGene') {
              matchedEntry = entry;
            }
          })
          if (matchedEntry) {
            resolve({'ensembleGeneId': ensemblGeneId, 'geneName': theGeneName })
          } else {
            resolve(null)
          }
        } else {
          let msg  = "No data returned from _promiseLookupEnsemblGene " + url
          console.log(msg);
          console.log(error.responseJSON.error)
          reject("No data returned from ENSEMBL gene lookup for gene <pre>" + theGeneName + "</pre>. "  + error.responseJSON.error);
        }
      })
      .fail(function(error) {
            let msg = "Unable to get lookup by ensembl gene id " + url;
            console.log(msg);
            console.log(error.responseJSON.error)
            reject("An error occurred from ENSEMBL gene lookup for gene <pre>" + theGeneName + "</pre>. "  + error.responseJSON.error);
      })
    })
  }

  promiseGetGenePhenotypes(geneName) {
    var me = this;

    return new Promise( function(resolve, reject) {
      let theGeneName = geneName;
      let geneNameUC = geneName;
      var phenotypes = me.genePhenotypes[geneNameUC];
      if (phenotypes != null) {
        resolve([phenotypes, theGeneName]);
      } else {
        var url = me.globalApp.geneToPhenoServer + 'associations/' + theGeneName;

        fetch(url)
        .then(function(r) {
          if (r.ok) {
            return r.json()
          } else {
            console.log(r.status)
            reject("Unable to get phenotypes. status=" + r.status )
          }
        })
        .then((response) => {

          me.genePhenotypes[geneNameUC] = response.phenotypes;
          me.geneDisorders[geneNameUC] = response.disorders;

          resolve([response.phenotypes, theGeneName]);
        })
        .catch((e) => {
          console.error(e);
          reject("unable to get phenotypes for gene " + theGeneName);
        });
      }
    });
  }


  promiseGetGeneDisorders(geneName) {
    var me = this;

    return new Promise( function(resolve, reject) {
      let theGeneName = geneName;
      let geneNameUC = geneName;
      var disorders = me.geneDisorders[geneNameUC];
      if (disorders != null) {
        resolve([disorders, theGeneName]);
      } else {
        var url = me.globalApp.geneToPhenoServer + 'associations/' + theGeneName;

        fetch(url).then(r => r.json())
        .then((response) => {

          me.genePhenotypes[geneNameUC] = response.phenotypes;
          me.geneDisorders[geneNameUC] = response.disorders;

          resolve([response.disorders, theGeneName]);
        })
        .catch((e) => {
          console.error(e);
          reject("unable to get disorders for gene " + theGeneName);
        });
      }
    });
  }


  /* 
   * See detailed comments under _promiseGetGeneObject
   *
   * Arguments: 
   *   geneName:       The case-sensitive gene name
   *   resolveOnError: If _promiseGetGeneObject rejects, 
   *                   just resolve with a simple object of {notFound: [the gene name]}
   *   checkAliases:   A boolean, indicating if we should
   *                   extend our lookup to gene aliases to try to
   *                   find an alternative gene name that has transcripts
   * 
   * This method checks the GeneModel cache first. If the
   * gene is in the cache, resolve with that cached
   * gene object. 
   * If it isn't in the GeneModel cache, call _promiseGetGeneObject.
   */
  promiseGetCachedGeneObject(geneName, resolveOnError=false, checkAliases=true) {
    var me = this;
    return new Promise( function(resolve, reject) {
      let theGeneName = geneName;
      var theGeneObject = me.geneObjects[theGeneName.toUpperCase()];
      if (theGeneObject) {
        resolve(theGeneObject);
      } else {
        me._promiseGetGeneObject(theGeneName, checkAliases).then(function(geneObject) {
          resolve(geneObject);
        })
        .catch(function(error) {
          if (resolveOnError) {
            resolve({notFound: theGeneName});
          } else {
            reject(error);
          }
        });
      }

    });
  }

  /* 
  *
  * _promiseGetGeneObject
  *
  * Arguments
  *   geneName:      The case-sensitive gene symbol. 
  *   checkAliases:  A boolean, indicating if this method should
  *                  interrogate the aliases of a gene in the 
  *                  case where a valid gene name was supplied,
  *                  but there are no transcripts for the
  *                  build and gene source.
  *
  * This promise will resolve under the following circumstance:
  *    1. The gene name is found or the gene name is a valid gene alias
  *    AND
  *    2. The gene has at least 1 transcript for the build and source
  *   
  *     
  *  This promise will reject due to one of the following circumstances:
  *    1. The gene name isn't found (response.isValidGeneName is false)
  *    OR
  *    2. The gene name is valid, but there are no transcripts for the
  *       build and source. But good news -- there is a gene alias with 
  *       transcripts for the build and gene source. 
  *       The catch block will add the alternative gene name
  *       (response.useDifferentGene) instead of the gene name provided.
  *    OR
  *    3. The gene name is valid, but there are no transcripts for the
  *       build and source. But somewhat hopeful news -- We didn't find 
  *       a suitable alternative gene alias with transcripts, but
  *       there are transcripts for the other gene source 
  *       (response.useDifferentSource). The catch block will alert the
  *       user, but not automatically change the source as this applies
  *       across all genes and requires reanalysis of the variants.
  *    OR
  *    4. Bummer. The gene name is valid, but there are no transcripts for the
  *       build and source, nor are there any alternative gene aliases that
  *       have transcripts, nor are there any transcripts under the other
  *       gene source. 
  *    OR
  *    5. Major bummer. An unexpected error occurred. Alert the user of the error.
  * 
  *    Here is the error object from the reject:
  *     gene:              The gene name supplied by the caller of this method.
  *     useDifferentGene:  The alternate gene name that can be used
  *                        instead of the gene name supplied. 
  *     useDifferentSource: The other gene source that can
  *                        be set instead of the one currently in use.
  *                        If the gene source is switched, the gene 
  *                        name supplied has transcripts.
  *     isValidGeneName      A boolean. True when the gene name supplied exists
  *                        in either refseq or gencode or is a known HGVS gene
  *                        alias.
  *     message:           The alert message
  *     alertType:         Whether the alert message constitutes an error or warning 
  *     options:           Options about how to display the warning/error message to
  *                        to user.
  *     errorDetails:      An array of strings to supply more detailed error message
  *                        to the user.
  */      
  _promiseGetGeneObject(geneName, checkAliases = true) {
    var me = this;
    return new Promise(function(resolve, reject) {


      let theGeneName = geneName;

      // If current build not specified, default to GRCh37
      var buildName = me.genomeBuildHelper.getCurrentBuildName() ? me.genomeBuildHelper.getCurrentBuildName() : "GRCh37";
      $('#build-link').text(buildName);

      var defaultGeneSource = me.geneSource ? me.geneSource : 'gencode';
      var otherGeneSource = defaultGeneSource == 'gencode' ? 'refseq' : 'gencode';
      
      // First, find out if the gene provided has transcripts for the given build and gene source
      me.promiseGetGeneEntry(theGeneName, true)
      .then(function(geneEntry) {
        let theGeneSource = null;
        let thePromise = null;
        let theGeneEntry = geneEntry;
        // Success. We have a gene with transcripts for the build and gene source
        if (theGeneEntry != null && theGeneEntry != false 
          && theGeneEntry[buildName] 
          && theGeneEntry[buildName][defaultGeneSource]) {
            
          theGeneSource = defaultGeneSource
          thePromise = Promise.resolve({'geneName': theGeneEntry.gene_name,
                                        'build': buildName,
                                        'geneSource': defaultGeneSource,
                                        'success': true,
                                        'otherGeneSource': otherGeneSource,
                                        'transcriptCountOtherGeneSource': theGeneEntry[buildName][otherGeneSource]});
        } else {
          theGeneSource = null;
          if (theGeneEntry) {
            let transcriptCountOtherSource = theGeneEntry[buildName][otherGeneSource]  
            
            // The gene exists but it doesn't have transcripts for the build and
            // gene source. Check if any of the aliases the gene have transcripts
            // for the build and source. If so, we will resolve with an object with a
            // preferredGeneName filled in that will be used in the catch block
            // to reject with warning message and the alternative gene name
            // to use instead.
            if (checkAliases) {
              thePromise = me.promiseGetPreferredGeneName(theGeneName, buildName, defaultGeneSource)
            } else {
              // The caller of the method doesn't want to check for aliases.
              // The subsequent "then()" block will formulate a detailed warning
              // message.
              thePromise = Promise.resolve( {'geneName': theGeneName,
                            'build':      buildName,
                            'geneSource': defaultGeneSource,
                            'success':    false,
                            'isValidGeneName': true,   
                            'otherGeneSource': otherGeneSource,
                            'transcriptCountOtherGeneSource': transcriptCountOtherSource,                         
                           })
            }
          } else {
            // The gene doesn't exist.
            thePromise = Promise.resolve({'geneName':  theGeneName,
                                         'build':      buildName,
                                         'geneSource': defaultGeneSource,
                                         'success':    false,
                                         'isValidGeneName': false,
                                         'alertType':  'warning',
                                         'message':    "Invalid gene name. No entry found for <pre>" + theGeneName + "</pre>."
                                         });
          }
        }

        return thePromise;
      })
      .then(function(result) {
        // This is the positive use case where the gene name provided (the argument to this method)
        // has transcripts for the build and gene source. Now we will call the gene info service
        // to get the gene object, which includes all of its transcripts.
        if (result.hasOwnProperty('success') && result.success) {
          // Get the gene object and its transcripts from the geneinfo server for the gene source
          // and genome build.
          var url = me.globalApp.geneInfoServer + result.geneName;
          url += "?source="  + result.geneSource;
          url += "&species=" + me.genomeBuildHelper.getCurrentSpeciesLatinName();
          url += "&build="   + result.build;


          fetch(url).then(r => r.json())
          .then((response) => {
            if (response.length > 0 && response[0].hasOwnProperty('gene_name')) {
              var theGeneObject = response[0];
              // This is an extra check. We should never run into this case b/c we should have only
              // called the gene info service when we know we have a gene that has at least one transcript
              // for the given gene source and build.
              if (theGeneObject.transcripts == null || theGeneObject.transcripts.length == 0) {
                let msg = "Unexpected result from geneinfo service. Bypassing gene <pre>" + theGeneName +
                          "</pre>. There are no transcripts for this gene or any of its aliases.";
                console.log(msg);
                reject({
                        'gene': theGeneName,
                        'isValidGeneName': true,
                        'message': msg,
                        'alertType': 'error',
                        'options': {'showAlertPanel': true, 'selectAlert': true} });
              } else {
                // 
                // SUCCESS
                //
                // For each transcript in the gene, determine the exons, creating a new array. 
                // Sort the exons and number them.
                // Apply this number to the coding features (UTR, CDS).
                // Resolve with the gene object
                me.determineExons(theGeneObject)
                me.geneObjects[theGeneObject.gene_name.toUpperCase()] = theGeneObject;
                resolve(theGeneObject);
              }
            } else {
              // We shouldn't hit this condition b/c we already determined via promiseGetGeneEntry
              // that this gene has transcripts for the build and gene source.
              let msg = "Unexpected result. Bypassing gene <pre>" + theGeneName + "</pre>. There are no " +
                        result.geneSource + " " + result.build + " transcripts for this gene.";
              console.log(msg);
              reject({
                      'gene': theGeneName,
                      'isValidGeneName': false,
                      'message': msg,
                      'alertType': 'error',
                      'options': {'showAlertPanel': true, 'selectAlert': true}
                    });
            }
          })
          .catch((errorThrown) => {
            console.log("An unexpected error occurred when getting transcripts for gene " +  theGeneName + ".");
            console.log( "Error: " + errorThrown );
            let msg = "Error " + errorThrown + " occurred when attempting to get transcripts for gene <pre>" + theGeneName + "</pre>";
            reject({
                    'gene': theGeneName,
                    'isValidGeneName': false,
                    'message': msg,
                    'alertType': 'error',
                    'options': {'showAlertPanel': true, 'selectAlert': true},
                    'errorDetails': [errorThrown]
                  });
          });

        } else {

          // Reject with an error object that directs the caller to either:
          //
          // SCENARIO 1. Use a different gene name and notify the user of the substitution. 
          //  OR
          // SCENARIO 2. The gene name is valid. 
          //    No suitable gene alias was found or the caller of the method didn't want to check
          ///   aliases. Provide a warning message that informs the user 
          //    that the gene will be bypassed. In the case where the other gene source has 
          //    transcripts for the gene, the warning message will suggest changing the gene source.
          // OR
          // SCENARIO 3. The gene name is invalid. 
          // OR
          // SCENARIO 4. An unexpected error occurred in the chain of promises. Reject with the error information.
          
          let msg = "Bypassing gene <pre>" + theGeneName + "</pre>. ";
          if (result.isValidGeneName && result.preferredGeneName && result.preferredGeneName.length > 0) {
            //
            // SCENARIO 1. 
            // There is an alias to the gene that has transcripts. Reject with an object
            // that will offer a preferred gene name to use instead.
          
            // Reject, specifying the different gene name to use.
            // The caller of this method will respond by re-issuing the add gene operation
            // with another gene name (an alias for the gene that has transcripts). 
            // A warning should be issued  so that the user is aware that of the gene 
            // name substitution.
            //
            msg += "Analyzing gene <pre>" + result.preferredGeneName + "</pre> instead."
            
            
            reject({
                    'gene':      theGeneName,
                    'isValidGeneName': result.hasOwnProperty('isValidGeneName') ? result.isValidGeneName : false,
                    'useDifferentGene': result.preferredGeneName,
                    'message':   msg,
                    'alertType': 'warning',
                    'options':   {'showAlertPanel': true,
                                  'selectAlert': true}
                     });

          } else if (result.isValidGeneName 
            && result.hasOwnProperty('otherGeneSource') 
            && result.hasOwnProperty('transcriptCountOtherGeneSource'))  {
            // 
            //  SCENARIO 2. 
            //  Reject. The gene name is valid, but there are no transcripts for the gene 
            //  (for the given build and gene source). And if directed to check aliases, there 
            //  were no suitable subsitutions (aliases) for the gene that had transcripts. 
            //  Supply information about switching to the other gene source if the gene has transcripts 
            //  under the other gene source.
            //
            msg += "There are no " + result.build + " " + result.geneSource 
                    + " transcripts for this gene";
            msg += (result.hasOwnProperty('aliasFound') && result.aliasFound == false) ? 
                    " or any of its aliases. " : ". ";
            msg += (result.transcriptCountOtherGeneSource > 0) ?
                    " However, this gene has " + result.transcriptCountOtherGeneSource +  
                    " " + result.build + " <strong>" + result.otherGeneSource + " transcript(s)</strong>." + 
                      "<br><br>You can switch the gene source by clicking on the settings icon in the nav bar." +
                    "<br><br><strong><em>NOTE: This will reanalyze all genes.</em></strong> "    
                    :
                    "";
            reject( {
              'gene':      theGeneName,
              'isValidGeneName': result.isValidGeneName,
              'message':   msg,
              'alertType': 'warning',
              'options':   {'showAlertPanel': true, 'selectAlert': true} });
          } else if (result.hasOwnProperty('message') && result.hasOwnProperty('alertType')) {
            // SCENARIO 3. 
            // Reject. The gene name is invalid. 
            reject({
                'gene':      theGeneName,
                'isValidGeneName': result.hasOwnProperty('isValidGeneName') ? result.isValidGeneName : false,
                'message':   result.message,
                'alertType': result.alertType,
                'options':   {'showAlertPanel': true, 'selectAlert': true} });
          } else {
            // SCENARIO 4. 
            // Reject. An unexpected error occurred
            console.log(result)
            reject({
              'message':  'An unexpected problem occurred when getting gene object',
              'gene':      theGeneName,
              'isValidGeneName': false,
              'alertType': 'error',
              'options':   {'showAlertPanel': true, 'selectAlert': true},
              'errorDetails': [result]});
          }
        }
      })
      .catch(function(error) {
        console.log("An error occurred when getting known gene in GeneModel.getGeneObject for gene " +  theGeneName + ".");
        console.log( error );
        let msg = "An error occurred when getting known gene in GeneModel.getGeneObject for gene <pre>" +  theGeneName + "</pre>.";
        reject({'message': msg,
                'gene': theGeneName,
                'alertType': 'error',
                'options': {'showAlertPanel': true, 'selectAlert': true},
                'errorDetails': [error]
              });
      })
    })
  }


  /*
   * Capture the exons for a gene transcript. For the user interface,
   * this is a convenience function that represents each rectangle on the
   * transcript diagram, which will be a UTR or a CDS for protein coding
   * genes. But for non-protein coding genes, just filter by feature type
   * 'exon'.
   * This function also numbers the exons and sorts them accordingly. The
   * strand determines which is the first exon.
   */
  determineExons(gene) {
    let self = this;
    gene.transcripts.forEach(function(transcript) {

      // Exons are what we use the number the features. Each exon is assigned
      // a number sequentially. For forward strand, we number exons from
      // first to last exon; For reverse strand, we number from last to
      // first exon.
      let exons = transcript.features.filter(function(feature) {
        return feature.feature_type.toLowerCase() == 'exon';
      })
      .sort(function(a,b) {
        if (gene.strand == "+") {
          return a.start - b.start;
        } else {
          return (a.start - b.start) * -1;
        }
      })

      // These are the features (UTRs and CDSs for protein coding transcripts,
      // EXONs for non-protein coding transcripts) that we treat as exons, that we
      // will draw on the trascript diagram
      let exonicFeatures  = transcript.features.filter(function(feature) {
        if ( transcript.transcript_type == 'protein_coding'
            || transcript.transcript_type == 'UNIONED'
            || feature.transcript_type == 'mRNA'
            || feature.transcript_type == 'transcript'
            || feature.transcript_type == 'primary_transcript') {
          return feature.feature_type.toLowerCase() == 'utr' || feature.feature_type.toLowerCase() == 'cds';
        } else {
          return feature.feature_type.toLowerCase() == 'exon';
        }
      })
      .sort(function(a,b) {
        if (gene.strand == "+") {
          return a.start - b.start;
        } else {
          return (a.start - b.start) * -1;
        }
      })

      // Assign the exon number sequentially
      let count = 1;
      exons.forEach(function(exon) {
        exon.number = count++;
        exon.exon_number = exon.number + '/' + exons.length;
      })

      let getEncapsulatingExon = function(feature) {
        let matched = exons.filter(function(exon) {
          return exon.start <= feature.start && exon.end >= feature.end;
        })
        if (matched.length > 0) {
          return matched[0];
        } else {
          return null;
        }
      }

       // Number the UTR and CDS according to the encapsulating EXON.
      exonicFeatures.forEach(function(feature) {
        if (!feature.hasOwnProperty("number")) {
          let theExon = getEncapsulatingExon(feature, exons)
          if (theExon) {
            feature.number = theExon.number;
            feature.exon_number = theExon.exon_number;
          } else {
            console.log("Unable to find encapsulating exon in gene " +
              gene.gene_name + " for feature " +
              feature.feature_type + " " +
              feature.start + "-" + feature.end +
              ". Feature will not numbered.")
          }

        }
      })


      transcript.exons = exonicFeatures;
      transcript.exonsOnly = exons;

    })
    return gene;
  }

  promiseGetGeneForVariant(variant) {
    var me = this;
    return new Promise(function(resolve, reject) {

      var url = me.globalApp.geneInfoServer + 'api/region/' + variant.chrom + ":" + variant.start + "-" + variant.start;

      // If current build not specified, default to GRCh37
      var buildName = me.genomeBuildHelper.getCurrentBuildName() ? me.genomeBuildHelper.getCurrentBuildName() : "GRCh37";


      var defaultGeneSource = me.geneSource ? me.geneSource : 'gencode';


      if (defaultGeneSource) {
        url += "?source="  + defaultGeneSource;
        url += "&species=" + me.genomeBuildHelper.getCurrentSpeciesLatinName();
        url += "&build="   + buildName;
        url += "&bound=inner"


        $.ajax({
          url: url,
          jsonp: "callback",
          type: "GET",
          dataType: "json",
          success: function( response ) {
            if (response.length > 0 && response[0].hasOwnProperty('gene_name')) {
              var theGeneObject = response[0];
              me.geneObjects[theGeneObject.gene_name.toUpperCase()] = theGeneObject;
              resolve({'gene': theGeneObject, 'variant': variant});
            } else {
              let msg = "Gene model for region " + variant.chrom + ":" + variant.start + " not found.  Empty results returned from " + url;
              console.log(msg);
              reject(msg);
            }
          },
          error: function( xhr, status, errorThrown ) {

            console.log("Gene model for region " + variant.chrom + ":" + variant.start + " not found.  Error occurred.");
            console.log( "Error: " + errorThrown );
            console.log( "Status: " + status );
            console.log( xhr );
            reject("Error " + errorThrown + " occurred when attempting to get gene for region " +  variant.chrom + ":" + variant.start);

          }
        });

      } else {
        reject("No known gene source");
      }



    });
  }

  searchPhenolyzerGenes(phenotypeTerm, statusCallback) {
    var me = this;

    var url = me.phenolyzerServer + '?term=' + phenotypeTerm;
    var status = null;

    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      success: function( data ) {
      if (data == "") {
      } else if (data.record == 'queued') {
        if (statusCallback) {
          statusCallback({status:'queued', 'phenotypeTerm': phenotypeTerm});
        }
        setTimeout(function() {
            me.searchPhenolyzerGenes(phenotypeTerm, statusCallback);
          }, 5000);
      } else if (data.record == 'pending') {
        if (statusCallback) {
          statusCallback({status:'running', 'phenotypeTerm': phenotypeTerm});
        }
        setTimeout(function() {
            me.searchPhenolyzerGenes(phenotypeTerm, statusCallback);
          }, 5000);
      } else {
        me.parsePhenolyzerGenes(data.record, me.NUMBER_PHENOLYZER_GENES,
        function(success) { 
          if ( success && statusCallback) {
            me.setGenePhenotypeHitsFromPhenolyzer(phenotypeTerm, me.phenolyzerGenes);          
            statusCallback({status:'done', 'phenotypeTerm': phenotypeTerm, 'genes': me.phenolyzerGenes});
          }
            
        })

      }

      },
      fail: function() {
        alert("An error occurred in Phenolyzer iobio services. " + thrownError);
        if (statusCallback) {
          me.setGenePhenotypeHitsFromPhenolyzer(phenotypeTerm, null);
          statusCallback({status:'error', error: thrownError})
        }
      }
    });

  }

  parsePhenolyzerGenes(data, numberPhenolyzerGenes, parserCallback) {
    var me = this;
    var count = 0;
    
    let rawPhenolyzerGenes = [];
    data.split("\n").forEach( function(rec) {
      var fields = rec.split("\t");
      if (fields.length > 2 && fields[1]!=="Gene") {
        var geneName               = fields[1];
        if (count < numberPhenolyzerGenes) {
          var rank                 = fields[0];
          var score                = fields[3];
          var haploInsuffScore     = fields[5];
          var geneIntoleranceScore = fields[6];
          var selected             = count < me.phenolyzerTopGenesToKeep ? true : false;
          rawPhenolyzerGenes.push({rank: rank, geneName: geneName, score: score, haploInsuffScore: haploInsuffScore, geneIntoleranceScore: geneIntoleranceScore, selected: selected});
        }
        count++;
      }      
    });
    
    let promises = [];
    me.phenolyzerGenes = [];
    
    let inputGeneNames = rawPhenolyzerGenes.filter(function(phenolyzerGene){
      return phenolyzerGene.selected
    })
    .map(function(pg) {
      return pg.geneName;
    })
    me.promiseGetCorrectGeneNames(inputGeneNames)
    .then(function() {
      rawPhenolyzerGenes.forEach(function(phenolyzerGene) {
        if (phenolyzerGene.selected) {
          let correctName = me.validGeneNameMap.get(phenolyzerGene.geneName)
          if (correctName && typeof correctName === 'string') {
            phenolyzerGene.geneName = correctName;
          } else if (correctName && correctName.hasOwnProperty('gene_alias')) {
            phenolyzerGene.geneName = correctName.gene_alias;
          } 
        }
        me.phenolyzerGenes.push(phenolyzerGene)
      })
      if (parserCallback) {
        parserCallback(true)
      }
    })
    .catch(function(error) {
      let msg = "Unable to parse phenolyzer output in GeneMode.parsePhenolyzerGenes";
      me.dispatchEvent("alertIssued", 'error', msg, null, [error])
      if (parserCallback) {
        parserCallback(false)
      }
    })

  }

  promiseGetLinks(geneName) {
    let me = this;

    return new Promise(function(resolve, reject) {
      let links = [];

      let theGeneName = geneName;
      let geneNameUC = geneName.toUpperCase();
      
      var geneCoord = null;
      var geneObject = me.geneObjects[geneNameUC];
      if (geneObject) {
        geneCoord = geneObject.chr + ":" + geneObject.start + "-" + geneObject.end;
      }
      let ensemblGeneId = null

      let populateLinks =  function() {
        var buildAliasUCSC = me.genomeBuildHelper.getBuildAlias('UCSC');
        var geneUID = null;
        var ncbiInfo = me.geneNCBISummaries[theGeneName];
        if (ncbiInfo) {
          geneUID = ncbiInfo.uid;
        }
        for (var linkName in me.linkTemplates) {
          var theLink = $.extend({}, me.linkTemplates[linkName]);
          theLink.name = linkName;
          let resolved = false;
          if (geneUID && theLink.url.indexOf('GENEUID') >= 0) {
            theLink.url = theLink.url.replace(/GENEUID/g, geneUID );
            resolved = true;
          }
          if (geneObject && theLink.url.indexOf('GENESYMBOL') >= 0) {
            theLink.url = theLink.url.replace(/GENESYMBOL/g, theGeneName);
            resolved = true;
          }
          if (geneCoord && theLink.url.indexOf('GENECOORD') >= 0) {
            theLink.url = theLink.url.replace(/GENECOORD/g, geneCoord);
            resolved = true;
          }
          if (buildAliasUCSC && theLink.url.indexOf('GENOMEBUILD-ALIAS-UCSC') >= 0) {
            theLink.url = theLink.url.replace(/GENOMEBUILD-ALIAS-UCSC/g, buildAliasUCSC);
            resolved = true;
          }
          if (ensemblGeneId && theLink.url.indexOf('ENSEMBL-GENE-ID') >= 0) {
            theLink.url = theLink.url.replace(/ENSEMBL-GENE-ID/g, ensemblGeneId);
            resolved = true;
          }
          if (resolved) {
            links.push(theLink)
          }
        }
      }


      me.promiseGetGeneEnsemblId(theGeneName)
      .then(function(data) {
        ensemblGeneId = data.ensemblGeneId
        return me.promiseGetNCBIGeneSummary(theGeneName)
      })
      .then(function() {
        populateLinks()
        resolve(links)
      })
      .catch(function(error) {
        me.dispatchEvent("alertIssued", 'warning', error, theGeneName)
        populateLinks()
        resolve(links)

      })

    })
  }

  getVariantLinks(geneName, variant) {

    let me = this;
    let geneNameUC = geneName.toUpperCase();
    let variantLinks = [];

    var variantCoordUCSC = null;
    var variantCoordVarSome = null;
    var variantCoordGNomAD
    var geneObject = me.geneObjects[geneNameUC];

    var buildAliasUCSC = me.genomeBuildHelper.getBuildAlias('UCSC');

    if (geneObject) {
      variantCoordUCSC    = geneObject.chr + ":" + variant.start + "-" + variant.end;

      if (variant.alt.length > variant.ref.length && variant.ref.length == 1) {
        // ins
        variantCoordVarSome = geneObject.chr + "-" + (variant.start+1) + "-"  + '-' + variant.alt.substr(1);
      } else if (variant.ref.length > variant.alt.length && variant.alt.length == 1) {
        // del
        variantCoordVarSome = geneObject.chr + "-" + (variant.start+1) + "-"  + variant.ref.substr(1) ;
      } else if (variant.ref.length == variant.alt.length) {
        // snp
        variantCoordVarSome = geneObject.chr + "-" + variant.start + "-" + variant.ref + '-' + variant.alt;
      } else {
        // complex - just show varsome = at given loci
        variantCoordVarSome = geneObject.chr + "-" + variant.start
      }

      variantCoordGNomAD  = me.globalApp.utility.stripRefName(geneObject.chr) + "-" + variant.start + "-" + variant.ref + '-' + variant.alt;
      if (me.genomeBuildHelper.getCurrentBuildName() == 'GRCh38') {
        variantCoordGNomAD += "?dataset=gnomad_r3"
      };

    }

    var info = me.globalApp.utility.formatDisplay(variant, me.translator, false);


    for (var linkName in me.variantLinkTemplates) {
      var theLink = $.extend({}, me.variantLinkTemplates[linkName]);
      theLink.name = linkName;

      if (variantCoordGNomAD) {
        theLink.url = theLink.url.replace(/VARIANTCOORD-GNOMAD/g, variantCoordGNomAD);
      }
      if (variantCoordUCSC) {
        theLink.url = theLink.url.replace(/VARIANTCOORD-UCSC/g, variantCoordUCSC);
      }
      if (variantCoordVarSome) {
        theLink.url = theLink.url.replace(/VARIANTCOORD-VARSOME/g, variantCoordVarSome);
      }
      if (buildAliasUCSC) {
        theLink.url = theLink.url.replace(/GENOMEBUILD-ALIAS-UCSC/g, buildAliasUCSC);
      }
      if (info && info.rsId &&  info.rsId.length > 0) {
        theLink.url = theLink.url.replace(/VARIANT-RSID/g, info.rsId);
      }
      if (variant.clinvarUid) {
        theLink.url = theLink.url.replace(/VARIANT-CLINVAR-UID/g, variant.clinvarUid);
      }
      var keep = false;

      if (linkName == 'gnomad') {
        if (variant.gnomAD && variant.gnomAD.af && variant.gnomAD.af != ".") {
          keep = true;
        }
      } else if (linkName == 'dbsnp') {
        if (info && info.rsId &&  info.rsId.length > 0) {
          keep = true;
        }
      } else if (linkName == 'clinvar') {
        if (variant.clinvarUid && variant.clinvarUid.length > 0) {
          keep = true;
        }
      } else {
        keep = true;
      }
      if (keep) {
        variantLinks.push(theLink);
      }
    }

    return variantLinks;

  }


  promiseIsValidGeneName(geneName) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let theGeneName = geneName;
      if (theGeneName == null) {
        // Edge case. We have a null gene name.
        resolve({'isKnownGene': false, 'geneName': theGeneName})
      } else {
        self.promiseGetValidGeneName(theGeneName, true)
        .then(function(lookupObject) {
          if (lookupObject) {
            resolve({'isKnownGene': true, 'geneName': theGeneName});
          } else {
            resolve({'isKnownGene': false, 'geneName': theGeneName});
          }
        })
        .catch(function(error) {
          reject(error)
        })
      }
    })
  }
  

    
  /* This is a case-insensitive lookup of gene names. The promise will resolve 
  *  with an object (map) with a key set to the input gene name and the value
  *  set to the case-sensitive gene name, or if not found, set to false.
  *  Example result:
  *    {'c9orf72': 'C9orf72', 'rai1': 'RAI1', 'MTHFR': 'MTHFR', 'foo': false}
  *  
  */
  promiseGetCorrectGeneNames(geneNames) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let theGeneNames = geneNames;
      let geneNamesToLookup = [];
      let theGeneNameMap = new CaseInsensitiveMap();
      
      // Figure out which gene names we need to lookup (not cached)
      geneNames.forEach(function(geneName) {
        let cachedEntry = self.validGeneNameMap.get(geneName);
        if (cachedEntry) {
          theGeneNameMap.set(geneName, cachedEntry);
        } else if (cachedEntry == null) {
          geneNamesToLookup.push(geneName)
        } else if (cachedEntry == false) {
          theGeneNameMap.set(geneName, false);
        }
      })
      
      
      if (geneNamesToLookup.length == 0) {
        // We have already looked up these genes. Resolve with the cached entries.
        resolve(theGeneNameMap);
      } else {
        // Call the gene info service to get the entry for this gene. This will return
        // candidate gene names (exactMatch=false), so the response will be filtered
        // based on a case-insensitive match.
        let url = self.globalApp.geneInfoServer + "api/lookupGenes" + '?searchAlias=never&genes=' + geneNamesToLookup.join(",");
        $.ajax({
          url: url,
          jsonp: "callback",
          type: "GET",
          dataType: "json",
          success: function( response ) {
            if (response && response.hasOwnProperty('genes')) {
              let entry = null;
              let match = false;
              if (response.genes && response.genes.length > 0) {
              // For each gene in the response, cache the gene entry if found. 
              // If the gene wasn't found, cache with the entry set to false. 
              // This will prevent the re-issue unecessary calls 
              // to gene info service.
              response.genes.forEach(function(geneEntry) {
                  if (geneEntry.match) {
                    let inputGeneName   = geneEntry['input_gene_name']
                    let matchedEntry = null;
                    if (geneEntry.hasOwnProperty('gene_name')) {
                      matchedEntry = geneEntry['gene_name'] 
                    } else if (geneEntry.hasOwnProperty('gene_alias')) {
                      matchedEntry = geneEntry;
                    }
                    theGeneNameMap.set(inputGeneName, matchedEntry);
                    self.validGeneNameMap.set(inputGeneName, matchedEntry);
                  } else {
                    let inputGeneName = geneEntry['input_gene_name']
                    theGeneNameMap.set(inputGeneName, false);
                    self.validGeneNameMap.set(inputGeneName, false);
                  }             
                })
              }
              
             

              resolve(theGeneNameMap)
            } else {
              console.log(msg);
              reject("Problem in GeneModel.promiseGetCorrectGeneNames() getting response from " + url)
            }
          },
          error: function( xhr, status, errorThrown ) {
            console.log(errorThrown)
            reject(errorThrown)
          }
        })
      }
    })

    
  }


  promiseGetGeneEntry(geneName) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let theGeneName = geneName;
      let geneNameUC = geneName.toUpperCase();
      let cachedEntry = self.geneEntryMap[geneNameUC]
      if (cachedEntry != null) {
        // We have already looked this gene. Return the cached entry.
        resolve(cachedEntry);
      } else {
        // Call the gene info service to get the entry for this gene
        let url = self.globalApp.geneInfoServer + "lookupEntries/" + theGeneName;
        $.ajax({
          url: url,
          jsonp: "callback",
          type: "GET",
          dataType: "json",
          success: function( response ) {
            if (response && response.hasOwnProperty('genes')) {
              let entry = null;
              if (response.genes && response.genes.length > 0) {
                response.genes.forEach(function(geneEntry) {
                  if (!self.geneEntryMap.hasOwnProperty(geneEntry.gene_name.toUpperCase())) {
                    self.geneEntryMap[geneEntry.gene_name.toUpperCase()] = geneEntry;
                  }
                })
              }
              // If the gene wasn't found, cache with the entry set to false. This
              // will allow us to not re-issue unecessary calls to gene info service
              // for a gene name not found.
              if (!self.geneEntryMap.hasOwnProperty(geneNameUC)) {
                self.geneEntryMap[geneNameUC] = false
              }

              resolve(self.geneEntryMap[geneNameUC])
            } else {
              console.log(msg);
              reject("Problem getting response from " + url)
            }
          },
          error: function( xhr, status, errorThrown ) {
            console.log(errorThrown)
            reject(errorThrown)
          }
        })
      }

    })

  }


  /* 
   * Lookup entries for a list of gene names. This will speedup lookup because we will
   * make one request for all gene names rather than making multiple requests (one for each
   * gene name). After this method is invoked, the caller can assume in the then()
   * block that self.geneEntryMap will have an entry for each of the gene names
   * sent into this method. 
   * NOTE: To minimize requests for genes that are not found, the lookup map geneEntryMap
   *       will map 'false' to the gene name. When the gene name is found, the entry
   *       (an object with build keys and counts for each gene source) will be mapped
   *       to the gene name.
   */ 
  promiseCacheGeneEntries(geneNames) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let theGeneNames = geneNames.filter(function(geneName) {
        return geneName != null && geneName.length > 0;
      })
      let genesNotCached = [];
      let cachedEntries = [];
      theGeneNames.forEach(function(theGeneName) {
        let cachedEntry = self.geneEntryMap[theGeneName.toUpperCase()]
        if (cachedEntry == null) {
          genesNotCached.push(theGeneName)
        } else {
          cachedEntries.push(cachedEntry)
        }
      })
      if (genesNotCached.length == 0  && cachedEntries.length == theGeneNames.length) {
        // If the genes have already looked up, there is no need to call the gene info
        // service.
        resolve()
      } else {
        // Some or all of the genes have never been looked up. Call the gene info
        // service to get the entries for each of the genes not previously cached.
        let url = self.globalApp.geneInfoServer + "lookupEntries/" + genesNotCached.join(",");
        $.ajax({
          url: url,
          jsonp: "callback",
          type: "GET",
          dataType: "json",
          success: function( response ) {
            if (response && response.hasOwnProperty('genes')) {
              let match = null;
              if (response.genes && response.genes.length > 0) {
                // Hash all of the entries return from the geneinfo lookupEntries service
                response.genes.forEach(function(geneEntry) {
                  if (!self.geneEntryMap.hasOwnProperty(geneEntry.gene_name.toUpperCase())) {
                    self.geneEntryMap[geneEntry.gene_name.toUpperCase()] = geneEntry;
                  }
                })
                // Now loop through the genes we attempted to look up but
                // didn't find in the database. Add missing genes with a boolean false
                // value so that we don't attempt getting this entry again
                genesNotCached.forEach(function(theGeneName) {
                  if (!self.geneEntryMap.hasOwnProperty(theGeneName.toUpperCase())) {
                    self.geneEntryMap[theGeneName.toUpperCase()] = false;
                  }
                })
                resolve();
              } else {
                // No genes were returned. Cache the gene names with false so that we don't
                // attempt lookup again.
                genesNotCached.forEach(function(theGeneName) {
                  if (!self.geneEntryMap.hasOwnProperty(theGeneName.toUpperCase())) {
                    self.geneEntryMap[theGeneName.toUpperCase()] = false
                  }
                })
                resolve();
              }
            } else {
              console.log(msg);
              reject("Problem getting response from " + url)
            }
          },
          error: function( xhr, status, errorThrown ) {
            console.log(status + " " + errorThrown)
            let msg = errorThrown && errorThrown.length > 0 ? errorThrown : ' status=' + xhr.status + ", error=" + xhr.responseText + ' url=' + url;
            reject("Failed to lookup genes. " + msg)
          }
        })
      }

    })
  }
  promiseGetValidGeneName(geneName, exactMatch=true) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let theGeneName = geneName;
      let geneNameUC = geneName.toUpperCase();

      if (self.validGeneNameMap.has(theGeneName)) {
        resolve(self.validGeneNameMap.get(theGeneName))
      } else {
        let url = self.globalApp.geneInfoServer + "lookup/" + theGeneName + "?searchAlias=last&exactMatch=" + (exactMatch ? "true" : "false");
        $.ajax({
          url: url,
          jsonp: "callback",
          type: "GET",
          dataType: "json",
          success: function( response ) {
            if (response && response.hasOwnProperty('genes')) {
              let matchingLookup = null;
              response.genes.forEach(function(lookupObject) {
                if (!matchingLookup) {
                  if (lookupObject.gene_name.toUpperCase() == geneNameUC) {
                    matchingLookup = lookupObject.gene_name;
                    self.validGeneNameMap.set(theGeneName, lookupObject.gene_name);
                  } else if (lookupObject.hasOwnProperty('gene_alias') && lookupObject.gene_alias.toUpperCase() == geneNameUC) {
                    matchingLookup = lookupObject;
                    self.validGeneNameMap.set(theGeneName, lookupObject);
                  }
                }
              })
              // We will return the proper gene name (case-sensitive) if the gene name is found; otherwise, we will
              // return an object with the gene name and gene alias if the gene name was found only as an alias; otherwise,
              // the method will resolve as boolean false if the gene name provided is not found 
              resolve(matchingLookup)
            } else {
              console.log(msg);
              reject("Problem getting response from " + url)
            }
          },
          error: function( xhr, status, errorThrown ) {
            console.log(errorThrown)
            reject(errorThrown)
          }
        })
      }
    })
  }

  /*
  * promiseGetPreferredGeneName
  *
  * Arguments:
  *  geneName: The gene name (case sensitive) that doesn't have transcripts. This method
  *            will evaluate the aliases to find a suitable substitution
  *  build:    The genome build
  *  source:   The gene source which provides coordinates and transcripts (refseq or gencode)
  * 
  * Output:
  *   Resolve with an object that identifies the alias that is a suitable replacement, meeting
  *   the following criteria:
  *   1. Has at least 1 transcript for the build and gene source
  *   2. If the original gene has coordinates (for the gene source), the
  *      alias must have the same coordinates. This ensures that an alias
  *      on a different chromosome or at a different location is 
  *      used as a substitution.
  *   If the gene has no aliases or non that meet the criteria, resolve with aliasFound = false
  *   and preferredGeneName = null.
  * 
  *   Reject:
  *   When an unexpected error occurs.
  */
  promiseGetPreferredGeneName(geneName, build, source) {
    let self = this;

    return new Promise(function(resolve, reject) {
      let theGeneName = geneName;
      let otherGeneNames = null;
      let preferredGeneName = null;
      let transcriptCountPreferredGeneName = null;
      let transcriptCountOtherGeneSource = null;
      let geneOrigChr = null;
      let geneOrigStart = null;
      let geneOrigEnd = null;
      
      let otherGeneSource = source == 'gencode' ? 'refseq' : 'gencode';
      
      

      self.promiseGetGeneEntry(theGeneName)
      .then(function(entry) {
        
        if (entry.hasOwnProperty('gene_coord')) {
          geneOrigChr =    entry.gene_coord[build][source].hasOwnProperty('chr') ? entry.gene_coord[build][source].chr : null;
          geneOrigStart =  entry.gene_coord[build][source].hasOwnProperty('start')  ? entry.gene_coord[build][source].start : null;
          geneOrigEnd =    entry.gene_coord[build][source].hasOwnProperty('end') ?  entry.gene_coord[build][source].end : null;
        }
        
        // The caller of the method doesn't want to check for aliases.
        transcriptCountOtherGeneSource = entry[build][otherGeneSource]
        
        // First, cache the gene's aliases (enbulk) for faster processing
        let cachePromise = null;
        if (entry && entry.hasOwnProperty('aliases') && entry.aliases.length > 0) {
          otherGeneNames = entry.aliases.split(",");
          if (otherGeneNames && otherGeneNames.length > 0) {
            // Cache the known gene entries in bulk so that we lookup
            // entries more efficiently
            cachePromise = self.promiseCacheGeneEntries(otherGeneNames)
          } else {
            cachePromise = Promise.resolve();
          }            
        } else {
          otherGeneNames = [];
          cachePromise = Promise.resolve();
        }
        
        return cachePromise;
      })
      .then(function() {
        // Keep the first gene alias that has transcripts
        // for the given build and source
        let promises = []
        otherGeneNames.forEach(function(otherGeneName) {
          let otherGeneEntry = self.geneEntryMap[otherGeneName.toUpperCase()]

          if (otherGeneEntry && otherGeneEntry[build] && otherGeneEntry[build][source]) {
            let transcriptCount = otherGeneEntry[build][source];
            if (transcriptCount > 0 && preferredGeneName == null) {
              
              let p = self.promiseGetCachedGeneObject(otherGeneEntry.gene_name, true, false)
              .then(function(otherGeneObject) {
                if (preferredGeneName == null && otherGeneObject && otherGeneObject.hasOwnProperty('gene_name')) {
                  if ((geneOrigChr == null || otherGeneObject.chr == geneOrigChr) && 
                      (geneOrigStart == null || otherGeneObject.start == geneOrigStart) &&
                      (geneOrigEnd == null || otherGeneObject.end == geneOrigEnd)) {
                    preferredGeneName = otherGeneObject.gene_name
                    transcriptCountPreferredGeneName = otherGeneObject.transcripts.length;
                  }
                }
              })
              promises.push(p)
            }
          }
        })
        Promise.all(promises)
        .then(function() {
        
            resolve({
                    'geneName': theGeneName,
                    'isValidGeneName': true, // The original gene name provided is a valid gene name or alias
                    'success': false, // The original gene name does not have transcripts for the build and gene source
                    'geneSource': source,
                    'build': build,
                    'aliasFound': preferredGeneName ? true : false,  // There is a suitable gene alias that has transcripts
                    'preferredGeneName': preferredGeneName,
                    'transcriptCountPreferredGeneName': transcriptCountPreferredGeneName, // Number of transcripts for the alias
                    'otherGeneSource': otherGeneSource, // If a suitable alias isn't found, the other alternative
                                                        // is to switch the gene source. Provide a transcript
                                                        // count for the other gene source for the input gene
                                                        // so that the caller of this method can formulate
                                                        // a response that involves switching the gene source. 
                    'transcriptCountOtherGeneSource': transcriptCountOtherGeneSource})
        })

      })
      .catch(function(error) {
        let msg = "Problem getting known gene entry for aliases of gene " + theGeneName;
        console.log(msg)
        console.log(error)
        self.dispatchEvent("alertIssued", 'error', msg, theGeneName, [error] );
        reject(error)
      })
    })
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
    geneObject.start = geneObject.startOrig < me.geneRegionBuffer ? 0 : geneObject.startOrig - me.geneRegionBuffer;
    // TODO: Don't go past length of reference
    geneObject.end   = geneObject.endOrig + me.geneRegionBuffer;

  }

  getLatestGeneTranscript(geneName) {
    return this.geneToLatestTranscript[geneName];
  }

  setLatestGeneTranscript(geneName, transcript) {
    this.geneToLatestTranscript[geneName] = transcript;
  }

  sortGenes(sortBy) {
    var me = this;

    me.sortedGeneNames = null;


    if (sortBy.indexOf("gene name") >= 0) {
      me.sortedGeneNames = me.geneNames.slice().sort();
    } else if (sortBy.indexOf("harmful variant") >= 0 || sortBy.indexOf("danger summary") >= 0) {
      me.sortedGeneNames = me.geneNames.slice().sort( function(a,b) {
        return me.compareDangerSummary(a,b);
      });
    } else if (sortBy.indexOf("coverage") >= 0) {
      me.sortedGeneNames = me.geneNames.slice().sort( function(a,b) {
        return me.compareDangerSummaryByLowCoverage(a,b);
      });
    } else if (sortBy.indexOf("original") >= 0) {
      me.sortedGeneNames = me.geneNames.slice();
    }

  }

  compareDangerSummary(geneName1, geneName2) {
    var me = this;

    var danger1 = me.geneDangerSummaries[geneName1];
    var danger2 = me.geneDangerSummaries[geneName2];

    var value = me.compareDangerSummaryObjects(danger1, danger2);
    if (value == 0) {
      if (geneName1 < geneName2) {
        value = -1;
      } else if (geneName2 < geneName1) {
        value = 1;
      }
    }
    return value;
  }

  compareDangerSummaryObjects(danger1, danger2) {
    var me = this;
    if (danger1 == null && danger2 == null) {
      return 0;
    } else if (danger2 == null) {
      return -1;
    } else if (danger1 == null) {
      return 1;
    }

    var dangers = [danger1, danger2];


    // clinvar badges
    if (danger1.badges.pathogenic && danger2.badges.pathogenic && danger1.badges.pathogenic.length !== danger2.badges.pathogenic.length) {
      return danger2.badges.pathogenic.length -  danger1.badges.pathogenic.length;
    }

    // inheritance badges
    if (danger1.badges.recessive && danger2.badges.recessive && danger1.badges.recessive.length !== danger2.badges.recessive.length) {
      return danger2.badges.recessive.length -  danger1.badges.recessive.length;
    }
    if (danger1.badges.denovo && danger2.badges.denovo && danger1.badges.denovo.length !== danger2.badges.denovo.length) {
      return danger2.badges.denovo.length -  danger1.badges.denovo.length;
    }

    // high or moderate badge
    if (danger1.badges.high && danger2.badges.high) {
      if (danger1.badges.high.length !== danger2.badges.high.length) {
        return danger2.badges.high.length -  danger1.badges.high.length;
      }
    }


    // lowest clinvar value = highest relevance
    var clinvarValues = [9999, 9999];
    dangers.forEach(function(danger, index) {
      if (danger.CLINVAR) {
        for (var key in danger.CLINVAR) {
          var showBadge = me.translator.clinvarMap[key].badge;
          if (showBadge) {
            clinvarValues[index] = danger.CLINVAR[key].value;
          }
        }
      }
    });
    if (clinvarValues[0] !== clinvarValues[1]) {
      return clinvarValues[0] - clinvarValues[1];
    }

    // lowest impact value = highest relevance
    var impactValues = [9999, 9999];
    dangers.forEach(function(danger, index) {
      if (danger.IMPACT) {
        for (var key in danger.IMPACT) {
          impactValues[index] = me.translator.impactMap[key].value;
        }
      }
    });
    if (impactValues[0] !== impactValues[1]) {
      return impactValues[0] - impactValues[1];
    }

    /*
    // FIXME: Can't compare allele frequencies because it would be lowest for all variants, not
    // a particular variant

    // lowest allele frequency = highest relevance
    var afValues = [9999,9999];
    dangers.forEach(function(danger, index) {
      if (danger.AF && Object.keys(danger.AF).length > 0) {
        var clazz   = Object.keys(danger.AF)[0];
        var afValue  = danger.AF[clazz].value;
        afValues[index] = afValue;
      }
    });
    if (afValues[0] !== afValues[1]) {
      return afValues[0] - afValues[1];
    }
    */

    return 0;
  }

  compareDangerSummaryOld(geneName1, geneName2) {
    var me = this;

    var danger1 = me.geneDangerSummaries[geneName1];
    var danger2 = me.geneDangerSummaries[geneName2];

    if (danger1 == null && danger2 == null) {
      return 0;
    } else if (danger2 == null) {
      return -1;
    } else if (danger1 == null) {
      return 1;
    }

    var dangers = [danger1, danger2];


    // lowests (non-zero) harmful variant level  = highest relevance
    var harmfulVariantValues = [9999, 9999];
    dangers.forEach(function(danger, index) {
      if (danger.harmfulVariantsLevel) {
        harmfulVariantValues[index] = danger.harmfulVariantsLevel;
      }
    });
    if (harmfulVariantValues[0] !== harmfulVariantValues[1]) {
      return harmfulVariantValues[0] - harmfulVariantValues[1];
    }

    // lowest clinvar value = highest relevance
    var clinvarValues = [9999, 9999];
    dangers.forEach(function(danger, index) {
      if (danger.CLINVAR) {
        for (var key in danger.CLINVAR) {
          var showBadge = me.translator.clinvarMap[key].badge;
          if (showBadge) {
            clinvarValues[index] = danger.CLINVAR[key].value;
          }
        }
      }
    });
    if (clinvarValues[0] !== clinvarValues[1]) {
      return clinvarValues[0] - clinvarValues[1];
    }

    // sift
    var siftValues = [9999, 9999];
    dangers.forEach(function(danger, index) {
      if (danger.SIFT) {
        for (var key in danger.SIFT) {
          var siftClass = Object.keys(danger.SIFT[key])[0];
          var showBadge = me.translator.siftMap[siftClass].badge;
          if (showBadge) {
            siftValues[index] = me.translator.siftMap[siftClass].value;
          }
        }
      }
    });
    if (siftValues[0] !== siftValues[1]) {
      return siftValues[0] - siftValues[1];
    }

    // polyphen
    var polyphenValues = [9999, 9999];
    dangers.forEach(function(danger, index) {
      if (danger.POLYPHEN) {
        for (var key in danger.POLYPHEN) {
          var polyphenClass = Object.keys(danger.POLYPHEN[key])[0];
          var showBadge = me.translator.polyphenMap[polyphenClass].badge;
          if (showBadge) {
            polyphenValues[index] = me.translator.polyphenMap[polyphenClass].value;
          }
        }
      }
    });
    if (polyphenValues[0] !== polyphenValues[1]) {
      return polyphenValues[0] - polyphenValues[1];
    }

    // lowest impact value = highest relevance
    var impactValues = [9999, 9999];
    dangers.forEach(function(danger, index) {
      if (danger.IMPACT) {
        for (var key in danger.IMPACT) {
          impactValues[index] = me.translator.impactMap[key].value;
        }
      }
    });
    if (impactValues[0] !== impactValues[1]) {
      return impactValues[0] - impactValues[1];
    }

    // lowest allele frequency = highest relevance
    var afValues = [9999,9999];
    dangers.forEach(function(danger, index) {
      if (danger.AF && Object.keys(danger.AF).length > 0) {
        var clazz   = Object.keys(danger.AF)[0];
        var afValue  = danger.AF[clazz].value;
        afValues[index] = afValue;
      }
    });
    if (afValues[0] !== afValues[1]) {
      return afValues[0] - afValues[1];
    }



    if (geneName1 < geneName2) {
      return -1;
    } else if (geneName2 < geneName1) {
      return 1;
    }
    return 0;
  }


  compareDangerSummaryByLowCoverage(geneName1, geneName2) {
    var me = this;

    var danger1 = me.geneDangerSummaries[geneName1];
    var danger2 = me.geneDangerSummaries[geneName2];


    if (danger1 == null && danger2 == null) {
      return 0;
    } else if (danger2 == null) {
      return -1;
    } else if (danger1 == null) {
      return 1;
    }

    geneCoverageProblem1 = danger1.geneCoverageProblem ? danger1.geneCoverageProblem : false;
    geneCoverageProblem2 = danger2.geneCoverageProblem ? danger2.geneCoverageProblem : false;


    if (geneCoverageProblem1 == geneCoverageProblem2) {
      if (geneName1 < geneName2) {
        return -1;
      } else if (geneName2 < geneName1) {
        return 1;
      } else {
        return 0;
      }
    } else if (geneCoverageProblem1) {
      return -1;
    } else if (geneCoverageProblem2) {
      return 1;
    }

  }

  setSourceForGenes(genes, source) {
    let self = this;
    let sourceIndicatorMap = {
      "imported_gene": 1,
      "phenotype_gene_list": 2
    }
    let sourceMap = {
      "imported_gene": "Variant is a member of an imported set of potentially interesting variants",
      "phenotype_gene_list": "Variant is in a gene associated with the patient's clinical note"
    }
    let sourceGeneTabMap = {
      "imported_gene": "Genes contains an imported potentially interesting variant",
      "phenotype_gene_list": "Gene is associated with the patient's clinical note"
    }
    genes.forEach(gene => {
      if(self.genesAssociatedWithSource[gene] === undefined){
        self.genesAssociatedWithSource[gene] = {
          "source": [sourceMap[source]],
          "sourceIndicator": [sourceIndicatorMap[source]],
          "source_gene_tab": [sourceGeneTabMap[source]],
        }
      }
      else {
        if(!self.genesAssociatedWithSource[gene].source.includes(sourceMap[source])){
          self.genesAssociatedWithSource[gene].source.push(sourceMap[source])
          self.genesAssociatedWithSource[gene].sourceIndicator.push(sourceIndicatorMap[source])
          self.genesAssociatedWithSource[gene].source_gene_tab.push(sourceGeneTabMap[source])
        }
      }
    })
  }

  getSourceForGenes() {
    let self = this;
    return self.genesAssociatedWithSource;
  }

}



export default GeneModel
