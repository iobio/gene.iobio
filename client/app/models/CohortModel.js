import CacheHelper      from './CacheHelper.js'
import VariantImporter  from './VariantImporter.js'
import VariantTrioModel from './VariantTrioModel.js'
import SampleModel      from './SampleModel.js'
class CohortModel {

  constructor(globalApp, isEduMode, isBasicMode, endpoint, genericAnnotation, translator, geneModel,
    variantExporter, cacheHelper, genomeBuildHelper, launchedFromClin, freebayesSettings) {

    this.globalApp = globalApp;
    this.isEduMode = isEduMode;
    this.isBasicMode = isBasicMode;
    this.defaultingToDemoData = false;

    this.endpoint = endpoint;
    this.hubSession = null;   // Passed in after init
    this.genericAnnotation = genericAnnotation;
    this.translator = translator;
    this.geneModel = geneModel;
    this.variantExporter = variantExporter;
    this.cacheHelper = cacheHelper;
    this.genomeBuildHelper = genomeBuildHelper;
    this.freebayesSettings = freebayesSettings;
    this.launchedFromClin = launchedFromClin
    this.filterModel = null;
    this.featureMatrixModel = null;

    this.annotationScheme = 'vep';

    this.analyzeCodingVariantsOnly = false;

    this.isLoaded = false;
    this.isSfariProject = false;  // True if launched from Mosaic w/ SSC project

    this.sampleModels  = [];
    this.sampleMap = {};
    this.sampleMapSibs = { affected: [], unaffected: []};

    this.patientPhenotypeEntries = null;
    this.genePhenotypeEntries = {};

    this.mode = 'single';
    this.maxAlleleCount = 0;
    this.affectedInfo = null;
    this.maxDepth = 0;

    this.inProgress = {
      'loadingDataSources': false
    };

    this.genesInProgress = [];
    this.flaggedVariants = [];

    this.knownVariantsViz = 'variants'; // variants, histo, histoExon
    this.sfariVariantsViz = 'variants';

    this.demoVcf = {
      'exome': "https://iobio.s3.amazonaws.com/samples/vcf/2021_platinum/2021_platinum_exomes_GRCh38.vcf.gz",
      'genome': "https://iobio.s3.amazonaws.com/samples/vcf/2021_platinum/2021_platinum_genomes_GRCh38.vcf.gz"
    }
    this.demoBams = {
      'exome': {
        'proband': 'https://iobio.s3.amazonaws.com/samples/cram/2021_platinum/GRCh38_exomes/NA12878.cram',
        'mother':  'https://iobio.s3.amazonaws.com/samples/cram/2021_platinum/GRCh38_exomes/NA12892.cram',
        'father':  'https://iobio.s3.amazonaws.com/samples/cram/2021_platinum/GRCh38_exomes/NA12891.cram',
       // 'sibling': 'https://iobio.s3.amazonaws.com/samples/cram/2021_platinum/GRCh38_exomes/NA12877.cram'
      },
      'genome': {
        'proband': 'https://iobio.s3.amazonaws.com/samples/cram/2021_platinum/GRCh38_genomes/NA12878.cram',
        'mother':  'https://iobio.s3.amazonaws.com/samples/cram/2021_platinum/GRCh38_genomes/NA12892.cram',
        'father':  'https://iobio.s3.amazonaws.com/samples/cram/2021_platinum/GRCh38_genomes/NA12891.cram'
      }
    }


    this.demoVcf37 = {
      'exome': "https://s3.amazonaws.com/iobio/samples/vcf/platinum-exome.vcf.gz",
      'genome': "https://s3.amazonaws.com/iobio/gene/wgs_platinum/platinum-trio.vcf.gz"
    }
    this.demoBams37 = {
      'exome': {
        'proband': 'https://s3.amazonaws.com/iobio/samples/bam/NA12878.exome.bam',
        'mother':  'https://s3.amazonaws.com/iobio/samples/bam/NA12892.exome.bam',
        'father':  'https://s3.amazonaws.com/iobio/samples/bam/NA12891.exome.bam',
        'sibling': 'https://s3.amazonaws.com/iobio/samples/bam/NA12877.exome.bam'
      },
      'genome': {
        'proband': 'https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12878.bam',
        'mother':  'https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12892.bam',
        'father':  'https://s3.amazonaws.com/iobio/gene/wgs_platinum/NA12891.bam'
      }
    }



    this.demoGenes = ['RAI1', 'SCN8A', 'SMARCA2', 'PDHA1', 'PLXNA1', 'ARHGAP8'];


    this.demoModelInfos = {
      'exome': [
        {relationship: 'proband', affectedStatus: 'affected',   name: 'NA12878', 'sample': 'NA12878', sex: 'female',  'vcf': this.demoVcf.exome, 'tbi': this.demoVcf.exome + '.tbi', 'bam': this.demoBams.exome['proband'], 'bai': this.demoBams.exome['proband'] + '.crai' },
        {relationship: 'mother',  affectedStatus: 'unaffected', name: 'NA12892', 'sample': 'NA12892', sex: 'female',  'vcf': this.demoVcf.exome, 'tbi': this.demoVcf.exome + '.tbi', 'bam': this.demoBams.exome['mother'], 'bai': this.demoBams.exome['mother'] + '.crai'  },
        {relationship: 'father',  affectedStatus: 'unaffected', name: 'NA12891', 'sample': 'NA12891', sex: 'male',    'vcf': this.demoVcf.exome, 'tbi': this.demoVcf.exome + '.tbi', 'bam': this.demoBams.exome['father'], 'bai': this.demoBams.exome['father'] + '.crai' },
      //  {relationship: 'sibling', affectedStatus: 'unaffected', name: 'NA12877', 'sample': 'NA12877', sex: 'male',    'vcf': this.demoVcf.exome, 'tbi': this.demoVcf.exome + '.tbi', 'bam': this.demoBams.exome['sibling'], 'bai': this.demoBams.exome['sibling'] + '.crai' },
      ],
      'genome': [
        {relationship: 'proband', affectedStatus: 'affected',   name: 'NA12878', 'sample': 'NA12878', sex: 'female', 'vcf': this.demoVcf.genome, 'tbi': this.demoVcf.genome + '.tbi', 'bam': this.demoBams.genome['proband'], 'bai': this.demoBams.genome['proband'] + '.crai'  },
        {relationship: 'mother',  affectedStatus: 'unaffected', name: 'NA12892', 'sample': 'NA12892', sex: 'female', 'vcf': this.demoVcf.genome, 'tbi': this.demoVcf.genome + '.tbi', 'bam': this.demoBams.genome['mother'],  'bai': this.demoBams.genome['mother'] + '.crai'  },
        {relationship: 'father',  affectedStatus: 'unaffected', name: 'NA12891', 'sample': 'NA12891', sex: 'male',   'vcf': this.demoVcf.genome, 'tbi': this.demoVcf.genome + '.tbi', 'bam': this.demoBams.genome['father'],  'bai': this.demoBams.genome['father'] + '.crai'  },
      ]
    }
    this.eduTourModelInfos = {
      "1": [
        {relationship: 'proband', affectedStatus: 'affected', name: 'Father', 'sample': 'sample2',  sex: 'male',   vcf: 'https://s3.amazonaws.com/iobio/NHMU/nhmu.vcf.gz', 'tbi': null, 'bam': null, 'bai': null},
        {relationship: 'proband', affectedStatus: 'affected', name: 'Jimmy',  'sample': 'sample3',  sex: 'male',   vcf: 'https://s3.amazonaws.com/iobio/NHMU/nhmu.vcf.gz', 'tbi': null, 'bam': null, 'bai': null},
        {relationship: 'proband', affectedStatus: 'affected', name: 'Bobby',  'sample': 'sample4',  sex: 'male',   vcf: 'https://s3.amazonaws.com/iobio/NHMU/nhmu.vcf.gz', 'tbi': null, 'bam': null, 'bai': null},
        {relationship: 'proband', affectedStatus: 'affected', name: 'Sarah',  'sample': 'sample5',  sex: 'female', vcf: 'https://s3.amazonaws.com/iobio/NHMU/nhmu.vcf.gz', 'tbi': null, 'bam': null, 'bai': null}
      ],
      "2": [
        {relationship: 'proband', affectedStatus: 'affected', name: 'John',   'sample': 'sample1',  sex: 'male',   vcf: 'https://s3.amazonaws.com/iobio/NHMU/nhmu.vcf.gz', 'tbi': null, 'bam': null, 'bai': null},
        {relationship: 'proband', affectedStatus: 'affected', name: 'Diego',  'sample': 'sample3',  sex: 'male',   vcf: 'https://s3.amazonaws.com/iobio/NHMU/nhmu.vcf.gz', 'tbi': null, 'bam': null, 'bai': null},
        {relationship: 'proband', affectedStatus: 'affected', name: 'Anna',   'sample': 'sample2',  sex: 'female', vcf: 'https://s3.amazonaws.com/iobio/NHMU/nhmu.vcf.gz', 'tbi': null, 'bam': null, 'bai': null}
      ]

    };
    this.eduTourGeneNames = {
      "1": null,
      "2": ['VKORC1']
    };
    this.myGene2GeneNames = ['KDM1A'];

    this.dispatch = d3.dispatch("alertIssued");
    d3.rebind(this, this.dispatch, "on");
  }

  getModelInfos() {
    return this.getCanonicalModels().map(function(sampleModel) {
        return sampleModel.getModelInfo()
    })
  }

  promiseInitDemo(demoKind='exome') {
    let self = this;
    return new Promise(function(resolve, reject) {
      var promise = null;
      if (self.demoGenes) {
        promise = self.geneModel.promiseCopyPasteGenes(self.demoGenes.join(","));
      } else {
        promise = Promise.resolve();
      }
      promise
      .then(function() {
        self.promiseInit(self.demoModelInfos[demoKind])
        .then(function() {
          resolve();
        })
        .catch(function(error) {
          reject(error);
        })
      })
    })
  }

  promiseInitEduTour(tourNumber, idx) {
    let self = this;
    return new Promise(function(resolve, reject) {
      var promise = null;
      if (self.eduTourGeneNames[tourNumber]) {
        promise = self.geneModel.promiseCopyPasteGenes(self.eduTourGeneNames[tourNumber].join(","));
      } else {
        promise = Promise.resolve();
      }
      promise
      .then(function() {
        self.promiseInit([self.eduTourModelInfos[tourNumber][idx]])
        .then(function() {
          resolve();
        })
        .catch(function(error) {
          reject(error)
        })
      })

    })
  }


  promiseInitMyGene2(siteConfig, fileId) {
    let self = this;

    return new Promise(function(resolve, reject) {
      var validationMsg = "";
      if (siteConfig == null || Object.keys(siteConfig).length == 0 || !siteConfig.hasOwnProperty('mygene2')) {
        validationMsg += "<br>&nbsp;&nbsp;Site configuration is missing for mygene2. "
      } else {
        if (siteConfig.mygene2.tokenEndpoint == "") {
          validationMsg += "<br>&nbsp;&nbsp;Missing site configuration field 'tokenEndpoint'. ";
        }
        if (siteConfig.mygene2.xAuthToken == "") {
          validationMsg += "<br>&nbsp;&nbsp;Missing site configuration field 'xAuthToken'. ";
        }
      }
      if (fileId == null || fileId == "") {
        validationMsg += "<br>&nbsp;&nbsp;Missing request parameter 'fileId'."
      }

      if (!self.genomeBuildHelper.getCurrentBuild()) {
        validationMsg += "<br>&nbsp;&nbsp;Missing request parameter 'build'.";
      }

      if (validationMsg.length > 0) {
        alertify.confirm("Warning", "Cannot load data due to the following errors: " + validationMsg,
         function(){
          reject();
         },
         function(){
            self.defaultingToDemoData = true;
            self.promiseInitDemo()
            .then(function() {
              resolve();
            })
         }).set('labels', {ok:'OK', cancel:'Continue, but just use demo data'});
      } else {

        var endpointUrl = siteConfig.mygene2.tokenEndpoint + "token/" + fileId;

        $.ajax({
            type: 'get',
            url: endpointUrl,
            dataType: 'json',
            contentType: 'json',
            xhrFields: {
                withCredentials: true
            },
            headers: {
                'X-Auth-Token': siteConfig.mygene2.xAuthToken
            },
            success: function(res) {
              var vcfUrl = siteConfig.mygene2.dataEndpoint + res.token + "/" + res.fileUpload.name;
              var modelInfo = {relationship: 'proband', affectedStatus: 'affected', name: 'Proband', 'sample': '', vcf: vcfUrl, 'tbi': null, 'bam': null, 'bai': null};

              var genePromise = null;
              if (self.geneModel.geneNames.length == 0 && self.myGene2GeneNames) {
                genePromise = self.geneModel.promiseCopyPasteGenes(self.myGene2GeneNames.join(","));
              } else {
                genePromise = Promise.resolve();
              }

              genePromise.
              then(function() {
                self.promiseInit([modelInfo])
                .then(function() {
                  resolve();
                })
                .catch(function(error) {
                  reject(error);
                })

              });
            },
            error: function( xhr, status, errorThrown ) {
              console.log( "Error: " + errorThrown );
              console.log( "Status: " + status );
              console.log( xhr );
              console.log("Unable to get MyGene2 endpoint filenames");
              alertify.confirm("Unable to obtain variant files using MyGene2 token.",
               function(){
                  reject(errorThrown);
               },
               function(){
                  self.promiseInitDemo()
                  .then(function() {
                    resolve();
                  })
               }).set('labels', {ok:'OK', cancel:'Continue, but just use demo data'});
            }
        });
      }
    })
  }

  promiseInit(modelInfos, projectId = 0, isSfariProject) {
    let self = this;

    return new Promise(function(resolve, reject) {
      self.isLoaded = false;
      self.isSfariProject = isSfariProject;
      self.inProgress.loadingDataSources = true;
      self.maxAlleleCount = 0;

      self.patientPhenotypes = [];
      self.patientPhenotypesMatchingGene = {};

      let affectedSibs = modelInfos.filter(function(modelInfo) {
        return modelInfo.relationship == 'sibling' && modelInfo.affectedStatus == 'affected';
      })



      let unaffectedSibs = modelInfos.filter(function(modelInfo) {
        return modelInfo.relationship == 'sibling' && modelInfo.affectedStatus != 'affected';
      })


      // sort models by proband, mother, father, sibling
      modelInfos = modelInfos.sort(function(a,b) {
        let getOrder = function(modelInfo) {
          let order = null;
          if (modelInfo.relationship == 'proband') {
            order = 0;
          } else if (modelInfo.relationship == 'mother') {
            order = 1;
          } else if (modelInfo.relationship == 'father') {
            order = 2;
          } else {
            order = 3;
          }
          return order;
        }

        return getOrder(a) - getOrder(b);
      })
      .filter(function(modelInfo) {
        // We exclude siblings here; use a separate method to set siblings
        return modelInfo.relationship != 'sibling';
      });

      self.sampleModels = [];
      self.flaggedVariants = [];
      self.genesInProgress = [];
      self.sampleMap = {};
      self.sampleMapSibs = { affected: [], unaffected: []};

      self.clearLoadedData();

      self.mode = modelInfos.length > 1 ? 'trio': 'single';

      let promises = [];
      modelInfos.forEach(function(modelInfo) {
        promises.push(self.promiseAddSample(modelInfo, isSfariProject));
      });
      promises.push(self.promiseAddClinvarSample());

      if (self.hubSession != null && isSfariProject) {
        promises.push(self.promiseAddSfariSample(projectId));
      }


      Promise.all(promises)
      .then(function() {
        return self.promiseSetSibs(affectedSibs, unaffectedSibs)
      })
      .then(function() {

        self.sortSampleModels();

        self.setAffectedInfo(true);
        self.inProgress.loadingDataSources = false;
        self.isLoaded = true;

        resolve();
      })
      .catch(function(error) {
        reject(error);
      })
    })
  }


  promiseAddSample(modelInfo, fromSfariProject) {
    let self = this;
    return new Promise(function(resolve,reject) {
      var vm = new SampleModel(self.globalApp);
      vm.init(self);
      vm.setRelationship(modelInfo.relationship);
      vm.affectedStatus = modelInfo.affectedStatus;
      vm.sex = modelInfo.sex && modelInfo.sex != "" ? modelInfo.sex : null;
      vm.isBasicMode = self.isBasicMode;
      vm.isEduMode = self.isEduMode;
      vm.isSfariSample = fromSfariProject;
      // We have patient hpo terms when launching from Mosaic
      if (modelInfo.hasOwnProperty("hpoTerms")) {
        vm.hpoTerms = modelInfo.hpoTerms;
      }

      var vcfPromise = null;
      if (modelInfo.vcf) {
        vcfPromise = new Promise(function(vcfResolve, vcfReject) {
          vm.promiseLoadVcfUrl(modelInfo.vcf, modelInfo.tbi)
          .then(function() {
            vm.setSampleName(modelInfo.sample);
            if (modelInfo.name && modelInfo.name != "") {
              vm.setName(modelInfo.name);
            } else {
              vm.setName(modelInfo.sample);
            }
            vcfResolve();
          }).catch( function(error) {
            vcfReject(error);
          });
        });
      } else {
        vm.sampleName = null;
        vm.samplesNames = null;
        vm.name = null;
        vcfPromise = Promise.resolve();
      }


      var bamPromise = null;
      if (modelInfo.bam) {
        bamPromise = new Promise(function(bamResolve, bamReject) {
          vm.promiseLoadBamUrl(modelInfo.bam, modelInfo.bai)
          .then(function() {
            bamResolve()
          })
          .catch(function(error) {
            bamReject(error);
          });
        })
      } else {
        vm.bam = null;
        bamPromise = Promise.resolve();
      }

      Promise.all([vcfPromise, bamPromise])
      .then(function() {

        var theModel = {'relationship': modelInfo.relationship, 'model': vm};
        self.sampleModels.push(vm);
        self.sampleMap[modelInfo.relationship] = theModel;

        resolve();
      })
      .catch(function(error) {
        reject(error)
      })

    })
  }

  removeSample(relationship) {
    let self = this;
    delete self.sampleMap[relationship];
    var idx = -1;
    var i = 0;
    self.sampleModels.forEach(function(m) {
      if (m.relationship == relationship) {
        idx = i;
      }
      i++;
    })
    if (idx >= 0) {
      self.sampleModels.splice(idx,1);
    }
  }

  promiseSetSibs(affectedSamples, unaffectedSamples) {
    let self = this;

    self.sampleMapSibs.affected = [];
    self.sampleMapSibs.unaffected = [];

    if ((affectedSamples == null || affectedSamples.length == 0) &&
        (unaffectedSamples == null || unaffectedSamples.length == 0)) {
      return Promise.resolve();
    }


    var promises = [];
    if (affectedSamples) {
      affectedSamples.forEach(function(mi) {
        var modelInfo =  {
          'relationship': 'sibling',
          'affectedStatus': 'affected',
          'sex': mi.sex,
          'name':   mi.sample,
          'sample': mi.sample,
          'vcf': self.getProbandModel().vcf.getVcfURL(),
          'tbi': self.getProbandModel().vcf.getTbiURL(),
          'bam': null,
          'bai': null };
        var p = self.promiseAddSib(modelInfo);
        promises.push(p);
      });
    }
    if (unaffectedSamples) {
      unaffectedSamples.forEach(function(mi) {
        var modelInfo =  {
          'relationship': 'sibling',
          'affectedStatus': 'unaffected',
          'sex': mi.sex,
          'name':   mi.sample,
          'sample': mi.sample,
          'vcf': self.getProbandModel().vcf.getVcfURL(),
          'tbi': self.getProbandModel().vcf.getTbiURL(),
          'bam': null, 'bai': null };
        var p = self.promiseAddSib(modelInfo);
        promises.push(p);
      });
    }
    return Promise.all(promises);

  }

  promiseAddSib(modelInfo) {
    let self = this;
    return new Promise(function(resolve,reject) {
      var vm = new SampleModel(self.globalApp);
      vm.init(self);
      vm.setRelationship(modelInfo.relationship);
      vm.affectedStatus = modelInfo.affectedStatus;
      vm.sex = modelInfo.sex;

      var vcfPromise = null;
      if (modelInfo.vcf) {
        vcfPromise = new Promise(function(vcfResolve, vcfReject) {
          vm.promiseLoadVcfUrl(modelInfo.vcf, modelInfo.tbi)
          .then( function() {
            vm.setSampleName(modelInfo.sample);
            vm.setName(modelInfo.relationship + " " + modelInfo.sample);
            vcfResolve();
          })
          .catch(function(error) {
            vcfReject(error);
          })
        });
      } else {
        vm.sampleName = null;
        vm.samplesNames = null;
        vm.name = null;
        vcfPromise = Promise.resolve();
      }


      vcfPromise
      .then(function() {
        self.sampleMapSibs[modelInfo.affectedStatus].push(vm);
        resolve();
      })

    })
  }

  promiseAddClinvarSample() {
    let self = this;
    if (self.sampleMap['known-variants']) {
      return Promise.resolve();
    } else {
      return new Promise(function(resolve,reject) {
        var vm = new SampleModel(self.globalApp);
        vm.init(self);
        vm.setRelationship('known-variants');
        vm.setName('Clinvar')
        var clinvarUrl  = self.globalApp.getClinvarUrl(self.genomeBuildHelper.getCurrentBuildName());

        vm.promiseLoadVcfUrl(clinvarUrl, null)
        .then(function() {
          self.sampleModels.push(vm);

          var sample = {'relationship': 'known-variants', 'model': vm};
          self.sampleMap['known-variants'] = sample;

          resolve(sample);
        })
        .catch(function(error) {
          reject(error);
        });
      })
    }
  }

  promiseAddSfariSample(projectId) {
      let self = this;
      if (self.sampleMap['sfari-variants']) {
        return Promise.resolve();
      } else {
        return new Promise(function(resolve,reject) {
          let vm = new SampleModel(self.globalApp);
          vm.setRelationship('sfari-variants');
          vm.setName('SFARI');

          // Stable sorted url lists
          let nameList = [],
              vcfUrlList = [],
              tbiUrlList = [];

          // Files coming back from Hub
          let vcfFiles = null,
              tbiCsiFiles = null;

          self.hubSession.promiseGetFilesForProject(projectId)
          .then((data) => {
              // Stable sort by file type
              vcfFiles = data.data.filter(f => f.type === 'vcf');
              tbiCsiFiles = data.data.filter(f => f.type === 'tbi' || f.type === 'csi');

              // Pull out combined vcfs from individual chromosome ones
              let sortedVcfFiles = [];
              vcfFiles.forEach((file) => {
                  let phaseFile = false;
                  let name = file.name;
                  // SPECIAL CASE for SSC WES 37
                  if (name === "ssc_wes.vcf.gz") {
                    phaseFile = true;
                  } else {
                      let namePieces = name.split('.');
                      namePieces.forEach((piece) => {
                          if (piece === 'all' || piece.includes('all')) {
                              phaseFile = true;
                          }
                      });
                  }
                  if (phaseFile) {
                      sortedVcfFiles.push(file);
                  }
              });

              let sortedTbiCsiFiles = [];
              tbiCsiFiles.forEach((file) => {
                  let phaseFile = false;
                  let name = file.name;
                  // SPECIAL CASE for SSC WES 37
                  if (name === "ssc_wes.vcf.gz.tbi") {
                      phaseFile = true;
                  } else {
                      let namePieces = name.split('.');
                      namePieces.forEach((piece) => {
                          if (piece === 'all' || piece.includes('all')) {
                              phaseFile = true;
                          }
                      });
                  }
                  if (phaseFile) {
                      sortedTbiCsiFiles.push(file);
                  }
              });

              // Check that we have matching data for all files
              if (sortedVcfFiles.length !== (sortedTbiCsiFiles.length)) {
                  console.log('WARNING: Mismatch on vcf and tbi files pulled from Mosaic for Sfari data. This is a problem.');
              } else if (sortedVcfFiles.length === 0 || sortedTbiCsiFiles.length === 0) {
                  console.log('Did not obtain any project level files from Mosaic for Sfari data. This might be ok.');
              }

              // Initialize sample model vcfs once we know how many we need
              vm.initSfariSample(sortedVcfFiles.length, self);

              // Get urls for both vcf and tbi
              let urlPromises = [];
              for (let i = 0; i < sortedVcfFiles.length; i++) {
                  let currVcf = sortedVcfFiles[i];
                  let currTbi = sortedTbiCsiFiles[i];
                  let urlP = self.promiseGetSignedUrls(currVcf, currTbi, projectId)
                      .then((urlObj) => {
                          nameList.push(urlObj.name);
                          vcfUrlList.push(urlObj.vcf);
                          tbiUrlList.push(urlObj.tbi);
                      });
                  urlPromises.push(urlP);
              }
              // Sort data by chromosome once we have all urls
              Promise.all(urlPromises)
              .then(() => {
                vm.onHubVcfUrlsEntered(vcfUrlList, tbiUrlList, function() {
                  self.sampleModels.push(vm);
                  let sample = {'relationship': 'sfari-variants', 'model': vm};
                  self.sampleMap['sfari-variants'] = sample;
                  resolve(sample);
                });
              })
              .catch((error) => {
                console.log(error)
                self.dispatch.alertIssued('error', 'There was a problem adding hub data to sample model', null, [error]);
                reject(error);
              });
          })
          .catch((error) => {
            console.log('There was a problem unpacking file data from Hub for Sfari variants: ' + error);
          });
        })
      }
  }

    /* Returns an object with a vcf url corresponding to the given vcf, and a tbi url corresponding to the given tbi.
       * It is assumed that the provided vcf and tbi file correspond to the same data. */
    promiseGetSignedUrls(vcf, tbi, projectId) {
        let self = this;
        return new Promise((resolve, reject) => {

            let vcfUrl = '',
                tbiUrl = '';

            let urlPromises = [];

            // Get vcf url
            let vcfP = self.hubSession.promiseGetSignedUrlForFile(projectId, 0, vcf)
                .then((url) => {
                    if (url == null || url.length === 0) {
                        reject('Empty vcf url returned from hub for ' + vcf.name);
                    }
                    else {
                        vcfUrl = url;
                    }
                });
            urlPromises.push(vcfP);

            // Get tbi url
            let tbiP = self.hubSession.promiseGetSignedUrlForFile(projectId, 0, tbi)
                .then((url) => {
                    if (url == null || url.length === 0) {
                        reject('Empty tbi url returned from hub for ' + tbi.name);
                    }
                    else {
                        tbiUrl = url;
                    }
                });
            urlPromises.push(tbiP);

            // Return after we have both to preserve relative ordering
            Promise.all(urlPromises)
                .then(() => {
                    resolve({'name': vcf.name, 'vcf': vcfUrl, 'tbi': tbiUrl});
                })
                .catch((error) => {
                    reject('There was a problem obtaining signed urls from Hub: ' + error);
                })
        });
    }

  sortSampleModels() {
    var MODEL_ORDER = {
      'proband': 2,
      'mother': 3,
      'father': 4,
      'known-variants': 1,
      'sfari-variants': 0
    };
    let sortedModels = this.sampleModels.sort(function(a,b) {
      return MODEL_ORDER[a.relationship] - MODEL_ORDER[b.relationship];
    });
    this.sampleModels = [];
    this.sampleModels = sortedModels;
  }



  setAffectedInfo(forceRefresh) {
    let self = this;
    if (self.affectedInfo == null || forceRefresh) {
      self.affectedInfo = [];
      self.getCanonicalModels().forEach(function(model) {
        if (model && model.getRelationship() !== 'known-variants' && model.getRelationship() !== 'sfari-variants') {
          var info = {};
          info.model = model;
          info.relationship = model.getRelationship();
          info.status = model.isAffected() ? 'affected' : 'unaffected';
          info.label  = model.getRelationship();
          info.sex    = model.sex;

          info.id = info.status + "-_-" + model.getRelationship() + "-_-" + model.getSampleName();

          self.affectedInfo.push(info);
        }
      })

      var sibIdx = 0;
      for (var status in self.sampleMapSibs) {
        var sibs = self.sampleMapSibs[status];
        sibs.forEach(function(model) {
          var info = {};
          info.relationship = model.getRelationship();
          info.status = status;
          info.sex = model.sex;
          info.model = model;
          info.label = model.getRelationship() + " " + model.getSampleName();
          info.id = info.status + "-_-" + model.getRelationship() + "-_-" + model.getSampleName();

          self.affectedInfo.push(info);
        })
      }


    }
  }


  getProbandModel() {
    return this.sampleMap['proband'].model;
  }

  getModel(relationship) {
//todo: refactor to handle all cases of duo, not just a missing parent
      if(this.sampleMap.hasOwnProperty(relationship)) {
        return this.sampleMap[relationship].model;
      }
      else{
        return this.sampleMap["proband"];
      }
  }

  getCanonicalModels() {
    return this.sampleModels.filter(function(model) {
      return model.relationship !== 'known-variants' && model.relationship !== 'sfari-variants';
    })
  }



  isAlignmentsOnly() {
    var theModels = this.getCanonicalModels().filter(function(model) {
      return model.isAlignmentsOnly();
    });
    return theModels.length == this.getCanonicalModels().length;
  }

  hasAlignments() {
    var theModels = this.sampleModels.filter(function(model) {
      return model.isBamLoaded();
    });
    return theModels.length > 0;
  }


  samplesInSingleVcf() {
    let self = this;
    let allSamplesInVcf = false;
    var theVcfs = {};
    var cards = this.sampleModels.forEach(function(model) {
      if (!model.isAlignmentsOnly() && model.getRelationship() !== 'known-variants'
          && model.getRelationship() !== 'sfari-variants') {
        if (model.vcfUrlEntered) {
          theVcfs[model.vcf.getVcfURL()] = true;
        } else {
          theVcfs[model.vcf.getVcfFile().name] = true;
        }

      }
    });
    allSamplesInVcf =  Object.keys(theVcfs).length == 1 ? true : false;

    if (!allSamplesInVcf) {
      allSamplesInVcf = self.doesProbandContainTrioSamples('proband');
    }
    return allSamplesInVcf;

  }

  doesProbandContainTrioSamples() {
    let self = this;
    let hasAllSamples = false;

    if (this.mode == 'trio'
           && this.getModel('proband')
           && this.getModel('proband').samples
           && this.getModel('mother')
           && this.getModel('mother').sampleName
           && this.getModel('father')
           && this.getModel('father').sampleName) {
      hasAllSamples =
        this.getModel('proband').doesContainOtherSample(this.getModel('mother')) &&
        this.getModel('proband').doesContainOtherSample(this.getModel('father'));
    }

    return hasAllSamples;
  }


  promiseLoadData(theGene, theTranscript, options) {
    let self = this;
    let promises = [];

    return new Promise(function(resolve, reject) {
      if (Object.keys(self.sampleMap).length == 0) {
        resolve();
      } else {

        self.startGeneProgress(theGene.gene_name);

        self.clearLoadedData();

        let cohortResultMap = null;

        // Annotate the variants
        self.promiseLoadVariants(theGene, theTranscript, options)
        .then(function(data) {
          cohortResultMap = data.resultMap;
          self.setLoadedVariants(theGene);

          // We have to load coverage AFTER we have loaded the variants
          // so that we can populate the variant records with bamDepth
          // (for exporting variants)
          return self.promiseLoadCoverage(theGene, theTranscript, options)

        })
        .then(function() {
          self.setCoverage();

          // Now summarize the danger for the selected gene
          return self.promiseSummarizeDanger(theGene, theTranscript, cohortResultMap.proband, null);
        })
        .then(function() {
          self.setLoadedVariants(theGene);

          self.endGeneProgress(theGene.gene_name);
          resolve(cohortResultMap);
        })
        .catch(function(error) {
          if (error && error.hasOwnProperty('alertType') && error.alertType == 'warning') {
            if (error.indexOf(geneName) >= 0 ) {
              self.dispatch.alertIssued('warning', error.message, error.gene);
            } else {
              self.dispatch.alertIssued('warning', error + " for gene " + theGene.gene_name, theGene.gene_name);
            }
            self.endGeneProgress(theGene.gene_name);
            reject(error);
          } else {
            self.promiseSummarizeError(theGene.gene_name, error)
            self.endGeneProgress(theGene.gene_name);
            reject(error);
          }
        })
      }
    })
  }

  startGeneProgress(geneName) {
    var idx = this.genesInProgress.indexOf(geneName.toUpperCase());
    if (idx < 0) {
      this.genesInProgress.push(geneName.toUpperCase());
    }
  }

  endGeneProgress(geneName) {
    var idx = this.genesInProgress.indexOf(geneName.toUpperCase());
    if (idx >= 0) {
      this.genesInProgress.splice(idx,1);
    }
  }

  promiseLoadKnownVariants(theGene, theTranscript, selectedCategories) {
    let self = this;
    if (self.knownVariantsViz == 'variants') {
      return self._promiseLoadKnownVariants(theGene, theTranscript, selectedCategories);
    } else  {
      return self._promiseLoadKnownVariantCounts(theGene, theTranscript);
    }
  }

  _promiseLoadKnownVariants(theGene, theTranscript, selectedCategories) {
    let self = this;
    return new Promise(function(resolve, reject) {

      self.sampleMap['known-variants'].model.promiseGetKnownVariantHistoData(theGene, theTranscript, null)
      .then(function(binnedCounts) {
        let totalPath = 0
        binnedCounts.forEach(function(counts) {
          totalPath += counts.path
        })
        self.getModel('known-variants').inProgress.loadingVariants = true;
        self.sampleMap['known-variants'].model.promiseGetClinvarVariants(theGene, theTranscript, self.sampleMap['known-variants'].model, selectedCategories)
        .then(function(resultMap) {
          self.getModel('known-variants').inProgress.loadingVariants = false;
          self.setLoadedVariants(theGene, 'known-variants');
          self.getModel('known-variants')
          resolve(resultMap);
        })
        .catch(function(error) {
          reject(error)
        });
      })
    })
  }

  _promiseLoadKnownVariantCounts(theGene, theTranscript) {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.getModel('known-variants').inProgress.loadingVariants = true;
      var binLength = null;
      if (self.knownVariantsViz == 'histo') {
        binLength = Math.floor( ((+theGene.end - +theGene.start) / $('#gene-viz').innerWidth()) * 8);
      }
      self.sampleMap['known-variants'].model.promiseGetKnownVariantHistoData(theGene, theTranscript, binLength)
      .then(function(data) {
        self.getModel('known-variants').inProgress.loadingVariants = false;
        self.setVariantHistoData('known-variants', data);
        resolve(data);
      })
    })
  }

  promiseLoadSfariVariants(theGene, theTranscript) {
      let self = this;
      if (self.sfariVariantsViz === 'variants') {
          return self._promiseLoadSfariVariants(theGene, theTranscript);
      } else  {
          return self._promiseLoadSfariVariantCounts(theGene, theTranscript);
      }
  }

    _promiseLoadSfariVariants(theGene, theTranscript) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.getModel('sfari-variants').inProgress.loadingVariants = true;
            self.sampleMap['sfari-variants'].model.promiseAnnotateSfariVariants(theGene, theTranscript, [self.sampleMap['sfari-variants'].model], {'isMultiSample': false, 'isBackground': false})
                .then(function(resultMap) {
                    self.getModel('sfari-variants').inProgress.loadingVariants = false;
                    self.setLoadedVariants(theGene, 'sfari-variants');
                    resolve(resultMap);
                })
                .catch((error) => {
                  reject('Problem loading sfari variants: ' + error);
                })
        })
    }

    _promiseLoadSfariVariantCounts(theGene, theTranscript) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.getModel('sfari-variants').inProgress.loadingVariants = true;
            var binLength = null;
            if (self.knownVariantsViz === 'histo') {
                binLength = Math.floor( ((+theGene.end - +theGene.start) / $('#gene-viz').innerWidth()) * 8);
            }
            self.sampleMap['sfari-variants'].model.promiseGetKnownVariantHistoData(theGene, theTranscript, binLength)
                .then(function(data) {
                    self.getModel('sfari-variants').inProgress.loadingVariants = false;
                    self.setVariantHistoData('sfari-variants', data);
                    resolve(data);
                })
        })
    }

  promiseLoadVariants(theGene, theTranscript, options) {
    let self = this;

    return new Promise(function(resolve, reject) {

      if (self.isAlignmentsOnly()) {
        let resultMap = {};
        let promises = [];
        self.getCanonicalModels().forEach(function(model) {
          model.inProgress.loadingVariants = true;
          let p = model.promiseGetVcfData(theGene, theTranscript)
          .then(function(data) {
            let results = null;
            if (data == null || data.vcfData == null) {
              results =  {'features': [], 
                          'loadState': {}, 
                          'gene': theGene, 
                          'transcript': theTranscript }   

            } else {
              results = data.vcfData;
            }
            resultMap[model.relationship] = results;
          })
          promises.push(p);
        });
        Promise.all(promises)
        .then(function() {
          for (var theRelationship in resultMap) {
            if (options != null && !options.isBackground) {
              self.getModel(theRelationship).inProgress.loadingVariants = false;
            }
          }

          resolve({'resultMap': resultMap, 'gene': theGene, 'transcript': theTranscript});
        })

      } else {
        let theOptions = $.extend({'isMultiSample': self.mode == 'trio' && self.samplesInSingleVcf(), 'isBackground': false}, options);
        self.promiseAnnotateVariants(theGene, theTranscript, theOptions)
        .then(function(resultMap) {
          // Flag bookmarked variants
          self.syncUpFlaggedSwitch(resultMap.proband);

          // the variants are fully annotated so determine inheritance (if trio).
          return self.promiseAnnotateInheritance(theGene, theTranscript, resultMap, {isBackground: false, cacheData: true})
        })
        .then(function(resultMap) {
          resolve(resultMap);
        })
        .catch(function(error) {
          self.dispatch.alertIssued( "error", error, theGene.gene_name)
          reject(error);
        })
      }
  
    })

  }
  promiseLoadCoverage(theGene, theTranscript, options) {
    let self = this;

    return new Promise(function(resolve, reject) {

      self.promiseGetCachedGeneCoverage(theGene, theTranscript, true, options)
      .then(function(data) {
        return self.promiseLoadBamDepth(theGene, theTranscript, options);
      })
      .then(function(data) {
        resolve(data);
      })
      .catch(function(error) {
        reject(error);
      })
    })

  }

  getPatientPhenotypes() {
    let self = this;

    if (self.patientPhenotypeEntries) {
      return self.patientPhenotypeEntries
    } else {
      self.patientPhenotypeEntries = [];
      let matchingSampleMap = {};

      // Create a list of unique phenotype terms of the proband and associated family
      // members
      self.getCanonicalModels().forEach(function(sampleModel) {
        let relationship = sampleModel.relationship;
        if (sampleModel.hpoTerms) {
          sampleModel.hpoTerms.forEach(function(hpoTerm) {

            let dups = self.patientPhenotypeEntries.filter(function(term) {
              return term.hpo_id == hpoTerm.hpo_id
            })
            // Add to the list of unique phenotype terms 
            if (dups.length == 0) {
              self.patientPhenotypeEntries.push(hpoTerm)
            }

            // Keep track of which samples match to a phenotype term.
            let rels = matchingSampleMap[hpoTerm.hpo_id];
            if (rels == null) {
              rels = [];
            }
            rels.push(relationship);
            matchingSampleMap[hpoTerm.hpo_id] = rels;
          })
        }
      })

      // Now we have a union of all phenotypes of the family; For
      // each phenotype, keep track which family members have this phenotype
      // and designate a 'match level' so that terms belonging to the phenotype
      // appear first, followed by terms belong to the phenotype and other 
      // family members, followed by phenotype associated with mother, then father,
      // then siblings.
      let ordinal = 0;
      self.patientPhenotypeEntries = self.patientPhenotypeEntries.map(function(phenotypeEntry) {
        let matchLevel = 99;
        let matchToken = ""
        let rels = matchingSampleMap[phenotypeEntry.hpo_id];
        if (rels.indexOf("proband") >= 0 && rels.length == 1) {
          matchLevel = 0;
          matchToken = 'Proband'
        } else if (rels.indexOf("proband") >= 0 && rels.length > 1) {
          matchLevel = 1;
          matchToken = "Proband+"
        } else {
          if (rels.indexOf("mother") >= 0 && rels.indexOf("father") >= 0) {
            matchLevel = 5;
            matchToken = "Parents"
          } else if (rels.indexOf("mother") >= 0 && rels.length == 1) {
            matchLevel = 3;
            matchToken = "Mother"
          } else if (rels.indexOf("father") >= 0 && rels.length == 1) {
            matchLevel = 4;
            matchToken = "Father";
          } else if (rels.indexOf("sibling") >= 0 && rels.length == 1) {
            matchLevel = 6;
            matchToken = "Sibling"
          } else if (rels.length > 1) {
            matchLevel = 2;
            matchToken = "Family"
          }
        }
        return {'match': matchToken, 
                'matchLevel': matchLevel, 
                'hpo_term_id': phenotypeEntry.hpo_id, 
                'hpo_term_name': phenotypeEntry.label, 
                'ordinal': ordinal++, 
                'matchingSamples': rels}
      })
      // Now sort the phenotype entries so that terms matching the phenotype
      // appear in the list before phenotypes matching other family members
      .sort(function(a,b) {
        if (a.matchLevel != b.matchLevel) {
          if (a.matchLevel > b.matchLevel) {
            return 1;
          } else if (a.matchLevel < b.matchLevel) {
            return -1;
          } 
        } else {
          if (a.ordinal < b.ordinal) {
            return -1
          } else if (a.ordinal > b.ordinal) {
            return 1
          } else {
            return 0;
          }
        }
      })
      return self.patientPhenotypeEntries;
    }
  }

  promiseGetPatientPhenotypesMatchingGene(geneName) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let patientPhenotypeEntries = self.patientPhenotypesMatchingGene[geneName];
      if (patientPhenotypeEntries) {
        resolve(patientPhenotypeEntries)
      } else {

        // Populate a list of all patient phenotypes. Clone the entries
        // as we will be designating if the phenotype matches a gene
        // phenotype
        patientPhenotypeEntries = []
        self.getPatientPhenotypes().forEach(function(hpoEntry) {
          patientPhenotypeEntries.push($.extend({}, hpoEntry))
        })

        self.promiseGetGenePhenotypeAssociations(geneName)
        .then(function(data) {

          let genePhenotypeEntries = data.hpoEntries;
          let hpoTermToGene = {}

          // Create a map for easy lookup
          genePhenotypeEntries.forEach(function(hpoEntry) {
            hpoTermToGene[hpoEntry.ontologyId] = geneName;
          })

          // Set the "match" field based on whether phenotype is associated
          // with gene
          patientPhenotypeEntries.forEach(function(patientPhenotype) {
            let geneName = hpoTermToGene[patientPhenotype.hpo_term_id]
            if (geneName) {
              patientPhenotype.match = "Match"
            } else {
              patientPhenotype.match = ""
            }
          })

          // Sort the patient phenotypes so that the proband phenotypes matching
          // the gene phenotype show first, then phenotypes for other family members
          // that match the gene phenotype, then unmatched phenotypes.
          let sortedPatientPhenotypes = patientPhenotypeEntries.sort(function(a,b) {
            if (a.match != b.match) {
              if (a.match.length > 0 && b.match.length == 0) {
                return -1;
              } else if (a.match.length == 0 && b.match.length > 0)  {
                return 1;
              } 
            } else if (a.matchLevel != b.matchLevel ){
              if (a.matchLevel > b.matchLevel) {
                return 1;
              } else if (a.matchLevel < b.matchLevel) {
                return -1;
              } 
            } else {
              if (a.ordinal < b.ordinal) {
                return -1
              } else if (a.ordinal > b.ordinal) {
                return 1
              } else {
                return 0;
              }
            }
          })
          self.patientPhenotypesMatchingGene[geneName] = sortedPatientPhenotypes;
          resolve(sortedPatientPhenotypes)
        })
        .catch(function(error) {
          reject(error)
        })
      }


    })
  }

  promiseGetGenePhenotypeAssociations(geneName, includePatientMatchesOnly=false) {
    let self = this;

    return new Promise(function(resolve, reject) {
      let hasMatches = false;
      let hpoEntries = [];
      let hpoTermToSample = {};
      self.getCanonicalModels().forEach(function(sampleModel) {
        let relationship = sampleModel.relationship;
        if (sampleModel.hpoTerms) {
          sampleModel.hpoTerms.forEach(function(hpoTerm) {
            let rels = hpoTermToSample[hpoTerm.hpo_id];
            if (rels == null) {
              rels = [];
            }
            rels.push(relationship);
            hpoTermToSample[hpoTerm.hpo_id] = rels;
          })
        }
      })

      self.geneModel.promiseGetGenePhenotypes(geneName)
      .then(function(data) {

        let hpoTerms = data[0];
        let idx = 0;
        hpoEntries = hpoTerms.map(function(hpoTerm) {
          let rels = hpoTermToSample[hpoTerm.hpo_id];
          let matchToken = null;
          let matchLevel = 99;
          if (rels == null) {
            matchToken = ""
          } else if (rels.indexOf("proband") >= 0 && rels.length == 1) {
            matchToken = "Proband"
            matchLevel = 0
          } else if (rels.indexOf("proband") >= 0 && rels.length > 1) {
            matchToken = "Proband+"
            matchLevel = 1
          } else {
            if (rels.indexOf("mother") >= 0 && rels.indexOf("father") >= 0) {
              matchToken = "Parents"
              matchLevel = 2;
            } else if (rels.indexOf("mother") >= 0 && rels.length == 1) {
              matchToken = "Mother"
              matchLevel = 2
            } else if (rels.indexOf("father") >= 0 && rels.length == 1) {
              matchToken = "Father"
              matchLevel = 2
            } else if (rels.indexOf("sibling") >= 0 && rels.length == 1) {
              matchToken = "Child"
              matchLevel = 2
            } else if (rels.length > 1) {
              matchToken = "Family"
              matchLevel = 2
            }
          }
          if (matchToken != "") {
            hasMatches = true;
          }
          idx++;
          // Backward compatibility - newest gene_phenotype.db has different column names:
          // hpo_term_id -> hpo_id,  hpo_term_name -> hpo_name
          return {'match': matchToken, 
                  'matchLevel': matchLevel, 
                  'ontologyId': hpoTerm.hasOwnProperty('hpo_term_id') ? hpoTerm.hpo_term_id : hpoTerm.hpo_id, 
                  'name': hpoTerm.hasOwnProperty('hpo_term_name') ?  hpoTerm.hpo_term_name : hpoTerm.hpo_name, 
                  'matchingSamples': rels,
                  'ordinal': idx}
        })
        .sort(function(a,b) {
          if (a.matchLevel != b.matchLevel) {
            if (a.matchLevel > b.matchLevel) {
              return 1;
            } else if (a.matchLevel < b.matchLevel) {
              return -1;
            } 
          } else {
            if (a.ordinal < b.ordinal) {
              return -1
            } else if (a.ordinal > b.ordinal) {
              return 1
            } else {
              return 0;
            }
          }
        })
        .filter(function(hpoEntry) {
          if (includePatientMatchesOnly) {
            return hpoEntry.match != "";
          } else {
            return true;
          }
        })
        resolve({'hpoEntries': hpoEntries, 'hasMatches': hasMatches, 'gene': geneName})

      })
      .catch(function(error) {
        let msg = "Cannot get phenotypes for gene " + geneName;
        console.log(msg)
        console.log(error)
        self.dispatch.alertIssued("warning", 
                         "Cannot get phenotypes for gene <pre>" + geneName + "</pre>",
                         geneName,
                         [error]
          )
        reject(msg)
      })
    })
  }


  clearLoadedData() {
    let self = this;
    self.sampleModels.forEach(function(model) {
      model.loadedVariants = {loadState: {}, features: [], maxLevel: 1, featureWidth: 0};
      model.calledVariants = {loadState: {}, features: [], maxLevel: 1, featureWidth: 0};
      model.variantHistoData = [];
      model.coverage = [[]];
    });
  }

  stopAnalysis() {
    this.genesInProgress = [];
  }

  clearCalledVariants() {
    let self = this;
    self.sampleModels.forEach(function(model) {
      model.calledVariants = {loadState: {}, features: [], maxLevel: 1, featureWidth: 0};
    })
  }

  setHubSession(hubSession) {
    let self = this;
    self.hubSession = hubSession;
  }


  setLoadedVariants(gene, relationship=null) {
    let self = this;


    var filterAndPileupVariants = function(model, start, end, target='loaded') {
      var filteredVariants = $.extend({}, model.vcfData);
      filteredVariants.features = model.vcfData.features.filter( function(feature) {

        var isTarget = false;
        if (target == 'loaded' && (!feature.fbCalled || feature.fbCalled != 'Y')) {
          isTarget = true;
        } else if (target == 'called' && feature.fbCalled && feature.fbCalled == 'Y') {
          isTarget = true;
        }

        var bypassZyg = (relationship === 'sfari-variants') ? false : SampleModel.isZygosityToBypass(feature, model.relationship);

        var inRegion = true;
        if (self.filterModel.regionStart && self.filterModel.regionEnd) {
          inRegion = feature.start >= self.filterModel.regionStart && feature.start <= self.filterModel.regionEnd;
        }

        var passesModelFilter = self.filterModel.passesModelFilter(model.relationship, feature);

        return isTarget && !bypassZyg && inRegion && passesModelFilter;
      });

      // For MyGene2 basic mode, we filter the variants to only show those that are clinvar pathogenic rare
      // variants
      if (self.isBasicMode) {
        filteredVariants = model.filterVariants(filteredVariants, self.filterModel.getFilterObject(),self.filterModel.regionStart, self.filterModel.regionEnd, true, self.filterModel);
      }

      var pileupObject = model._pileupVariants(filteredVariants.features, start, end);
      filteredVariants.maxLevel = pileupObject.maxLevel + 1;
      filteredVariants.featureWidth = pileupObject.featureWidth;

      return filteredVariants;
    }


    self.sampleModels.forEach(function(model) {
      /* Sfari model stores data in vcfData akin to non-clinvar models,
       * have to add additional check here instead of at next-below check for clinvar */
      if ((relationship == null && model.relationship !== 'sfari-variants') || relationship === model.relationship) {
        if (model.vcfData && model.vcfData.features) {

          var start = self.filterModel.regionStart ? self.filterModel.regionStart : gene.start;
          var end   = self.filterModel.regionEnd   ? self.filterModel.regionEnd   : gene.end;

          var loadedVariants = filterAndPileupVariants(model, start, end, 'loaded');
          model.loadedVariants = loadedVariants;

          var calledVariants = filterAndPileupVariants(model, start, end, 'called');
          model.calledVariants = calledVariants;

          if (model.getRelationship() == 'proband') {
            var allVariants = $.extend({}, model.loadedVariants);
            allVariants.features = model.loadedVariants.features.concat(model.calledVariants.features);
            self.featureMatrixModel.promiseRankVariants(allVariants);
          }

        } else {
          model.loadedVariants = {loadState: {}, features: []};
          model.calledVariants = {loadState: {}, features: []}
        }

      }
    })
  }

  setCoverage(regionStart, regionEnd) {
    let self = this;
    self.getCanonicalModels().forEach(function(model) {
      if (model.bamData) {
        if (regionStart && regionEnd) {
          model.coverage = model.bamData.coverage.filter(function(depth) {
            return depth[0] >= regionStart && depth[0] <= regionEnd;
          })
        } else {
          model.coverage = model.bamData.coverage;
        }

        if (model.coverage) {
          var max = d3.max(model.coverage, function(d,i) { return d[1]});
          if (max > self.maxDepth) {
            self.maxDepth = max;
          }
        }
      }
    })
  }

  setVariantHistoData(relationship, data, regionStart, regionEnd) {
    let self = this;
    var model = self.getModel(relationship);
    if (regionStart && regionEnd) {
      model.variantHistoData = data.filter(function(binObject) {
        binObject.start >= regionStart && binObject.end <= regionEnd;
      })
    } else {
      model.variantHistoData = data;
    }

    model.variantHistoCount = 0;
    model.variantHistoData.forEach(function(histo) {
      model.variantHistoCount += histo.total;
    })
  }

  promiseAnnotateVariants(theGene, theTranscript, options={}) {
    let self = this;
    return new Promise(function(resolve, reject) {

      var annotatePromises = [];
      var theResultMap = {};
      if (options.isMultiSample) {
        self.getCanonicalModels().forEach(function(model) {
          if (!options.isBackground) {
            model.inProgress.loadingVariants = true;
          }
        })
        options.analyzeCodingVariantsOnly = self.analyzeCodingVariantsOnly;
        p = self.sampleMap['proband'].model.promiseAnnotateVariants(theGene, theTranscript, self.getCanonicalModels(), options)
        .then(function(resultMap) {
          if (!options.isBackground) {
            self.getCanonicalModels().forEach(function(model) {
              model.inProgress.loadingVariants = false;
            })
          }
          theResultMap = resultMap;
        })
        annotatePromises.push(p);
      } else {
        for (var rel in self.sampleMap) {
          var model = self.sampleMap[rel].model;
          if (model.isVcfReadyToLoad() ) {
            if (!options.isBackground) {
              model.inProgress.loadingVariants = true;
            }
            if (rel !== 'known-variants' && rel !== 'sfari-variants') {
              options.analyzeCodingVariantsOnly = self.analyzeCodingVariantsOnly;
              var p = model.promiseAnnotateVariants(theGene, theTranscript, [model], options)
                .then(function(resultMap) {
                    for (var theRelationship in resultMap) {
                        if (!options.isBackground) {
                            self.getModel(theRelationship).inProgress.loadingVariants = false;
                        }
                        theResultMap[theRelationship] = resultMap[theRelationship];
                    }
                })
                .catch(function(error) {
                  model.inProgress.loadingVariants = false;
                  reject(error)
                })
              annotatePromises.push(p);
            }
          }
        }
      }
      if (options.getKnownVariants && (!options.hasOwnProperty('bypassAnnotate') || options.bypassAnnotate == false)) {
        let p = self.promiseLoadKnownVariants(theGene, theTranscript)
        .then(function(resultMap) {
          if (self.knownVariantViz === 'variants') {
            for (var rel in resultMap) {
              theResultMap[rel] = resultMap[rel];
            }
          }
        })
        .catch(function(error) {
          reject(error)
        })
        annotatePromises.push(p);
      }

      if (options.getSfariVariants && (!options.hasOwnProperty('bypassAnnotate') || options.bypassAnnotate == false)) {
        let p = self.promiseLoadSfariVariants(theGene, theTranscript)
          .then(function(resultMap) {
            if (self.sfariVariantsViz === 'variants') {
              for (var rel in resultMap) {
                  theResultMap[rel] = resultMap[rel];
              }
            }
          });
        annotatePromises.push(p);
      }

      Promise.all(annotatePromises)
      .then(function() {

        if (!options.hasOwnProperty('bypassAnnotate') || options.bypassAnnotate == false) {
          self.promiseAnnotateWithClinvar(theResultMap, theGene, theTranscript, options.isBackground)
          .then(function(data) {
            resolve(data)
          })          
        } else {
          resolve(theResultMap)
        }

      })
      .catch(function(error) {
        if (!options.isBackground) {
          self.getCanonicalModels().forEach(function(model) {
            model.inProgress.loadingVariants = false;
          })
        }
        reject(error)
      })
    })
  }

  promiseGetClinvarPhenotypes(geneObject, transcript) {
    var self = this;
    return new Promise( function(resolve, reject) {
      var refName = self.getProbandModel()._stripRefName(geneObject.chr);
      self.getProbandModel().vcf.promiseGetClinvarPhenotypes(refName, geneObject, transcript)
      .then(function(results) {
        resolve(results);
      })
      .catch(function(error) {
        reject(error);
      })
    })
  }



  promiseAnnotateWithClinvar(resultMap, geneObject, transcript, isBackground) {
    let self = this;
    var formatClinvarKey = function(variant) {
      var delim = '^^';
      return variant.chrom + delim + variant.ref + delim + variant.alt + delim + variant.start + delim  + variant.end;
    }

    var formatClinvarThinVariant = function(key) {
      var delim = '^^';
      var tokens = key.split(delim);
      return {'chrom': tokens[0], 'ref': tokens[1], 'alt': tokens[2], 'start': tokens[3], 'clinvarStart': tokens[4], 'end': tokens[4]};
    }

    var formatClinvarCoord = function(variant) {
      return {'chrom':        variant.chrom,
              'ref':          variant.ref,
              'alt':          variant.alt,
              'start':        variant.start,
              'end':          variant.end,
              'clinvarRef':   variant.clinvarRef,
              'clinvarAlt':   variant.clinvarAlt,
              'clinvarStart': variant.clinvarStart
            };

    }



    var refreshVariantsWithClinvarLookup = function(theVcfData, clinvarLookup) {
      theVcfData.features.forEach(function(variant) {
        var clinvarAnnot = clinvarLookup[formatClinvarKey(variant)];
        if (clinvarAnnot) {
          for (var key in clinvarAnnot) {
            variant[key] = clinvarAnnot[key];
          }
        }
      })
      if (theVcfData.loadState == null) {
        theVcfData.loadState = {};
      }
      theVcfData.loadState['clinvar'] = true;
    }



    return new Promise(function(resolve, reject) {

      // Combine the trio variants into one set of variants so that we can access clinvar once
      // instead of on a per sample basis
      var uniqueVariants = {};
      var unionVcfData = {features: []}
      for (var rel in resultMap) {
        var vcfData = resultMap[rel];
        if (vcfData) {
          if (!vcfData.loadState['clinvar'] && rel !== 'known-variants' && rel !== 'sfari-variants') {
           vcfData.features.forEach(function(feature) {
              uniqueVariants[formatClinvarKey(feature)] = formatClinvarCoord(feature);
           })
          }
        }
      }
      if (Object.keys(uniqueVariants).length == 0) {
        resolve(resultMap);
      } else {

        for (var key in uniqueVariants) {
          unionVcfData.features.push(uniqueVariants[key]);
        }

        var refreshVariantsFunction = self.globalApp.isClinvarOffline || self.globalApp.clinvarSource == 'vcf'
          ? self.getProbandModel()._refreshVariantsWithClinvarVCFRecs.bind(self.getProbandModel(), unionVcfData)
          : self.getProbandModel()._refreshVariantsWithClinvarEutils.bind(self.getProbandModel(), unionVcfData);

        self.getProbandModel().vcf.promiseGetClinvarRecords(
            unionVcfData,
            self.getProbandModel()._stripRefName(geneObject.chr),
            geneObject,
            self.geneModel.clinvarGenes,
            refreshVariantsFunction)
        .then(function() {

            // Create a hash lookup of all clinvar variants
            var clinvarLookup = {};
            unionVcfData.features.forEach(function(variant) {
              var clinvarAnnot = {};

              for (var key in self.getProbandModel().vcf.getClinvarAnnots()) {
                  clinvarAnnot[key] = variant[key];
                  clinvarLookup[formatClinvarKey(variant)] = clinvarAnnot;
              }
            })

            var refreshPromises = [];

            // Use the clinvar variant lookup to initialize variants with clinvar annotations
            for (var rel in resultMap) {
              var vcfData = resultMap[rel];
              if (vcfData) {
                if (!vcfData.loadState['clinvar']) {
                  var p = refreshVariantsWithClinvarLookup(vcfData, clinvarLookup);
                  if (!isBackground) {
                    self.getModel(rel).vcfData = vcfData;
                  }
                  //var p = getVariantCard(rel).model._promiseCacheData(vcfData, CacheHelper.VCF_DATA, vcfData.gene.gene_name, vcfData.transcript);
                  refreshPromises.push(p);
                }
              }
            }

            Promise.all(refreshPromises)
            .then(function() {
              resolve(resultMap);
            })
            .catch(function(error) {
              reject(error);
            })

        })
        .catch(function(error) {
          console.log(error)
          reject(error)
        })
      }


    })
  }


  promiseAnnotateInheritance(geneObject, theTranscript, resultMap, options={isBackground: false, cacheData: true}) {
    let self = this;

    var resolveIt = function(resolve, resultMap, geneObject, theTranscript, options) {

      self.promiseCacheCohortVcfData(geneObject, theTranscript, CacheHelper.VCF_DATA, resultMap, options.cacheData)
      .then(function() {
        resolve({'resultMap': resultMap, 'gene': geneObject, 'transcript': theTranscript});
      })

    }

    return new Promise(function(resolve,reject) {

      if (self.isAlignmentsOnly() && !self.globalApp.autocall && (resultMap == null || resultMap.proband == null)) {
          resolve({'resultMap': {'proband': {features: []}}, 'gene': geneObject, 'transcript': theTranscript});
      } else {
        // Set the max allele count across all variants in the trio.  We use this to properly scale
        // the allele counts bars in the tooltip
        for(var rel in resultMap) {
          self.maxAlleleCount = SampleModel.calcMaxAlleleCount(resultMap[rel], self.maxAlleleCount);
        }


        if (self.mode == 'single') {
          // Determine harmful variants, cache data, etc.
          resolveIt(resolve, resultMap, geneObject, theTranscript, options);
        } else {
          // We only pass in the affected info if we need to sync up genotypes because samples
          // where in separate vcf files
          var syncGenotypes = self.isAlignmentsOnly() || self.samplesInSingleVcf() ? false : true;

          var trioModel = new VariantTrioModel(resultMap.proband, resultMap.mother, resultMap.father, null, syncGenotypes, self.affectedInfo);

          // Compare the mother and father variants to the proband, setting the inheritance
          // mode on the proband's variants
          trioModel.compareVariantsToMotherFather(function() {

            self.getProbandModel().promiseDetermineCompoundHets(resultMap.proband, geneObject, theTranscript)
            .then(function() {
              // Now set the affected status for the family on each variant of the proband
              self.getProbandModel().determineAffectedStatus(resultMap.proband, geneObject, theTranscript, self.affectedInfo, function() {

                // Determine harmful variants, cache data, etc.
                resolveIt(resolve, resultMap, geneObject, theTranscript, options);

              });
            })



          })
        }

      }


    })

  }


  promiseCacheCohortVcfData(geneObject, theTranscript, dataKind, resultMap, cacheIt) {
    let self = this;
    return new Promise(function(resolve, reject) {
      // Cache vcf data for trio
      var cachePromise = null;
      if (cacheIt) {
        var cachedPromises = [];
        self.sampleModels.forEach(function(model) {
          if (resultMap[model.getRelationship()]) {
            if (resultMap[model.getRelationship()].cacheState && resultMap[model.getRelationship()].cacheState == 'cached') {
              cachedPromises.push(Promise.resolve)
            } else {
              var p = model._promiseCacheData(resultMap[model.getRelationship()], dataKind, geneObject.gene_name, theTranscript);
              cachedPromises.push(p);              
            }
          }
        })
        Promise.all(cachedPromises).then(function() {
          resolve();
        })
      } else {
        resolve();
      }

    })

  }

  promiseSummarizeError(geneName, error) {
    let self = this;
    return new Promise(function(resolve, reject) {
      let theGeneName = geneName;
      self.getProbandModel().promiseSummarizeError(geneName, error)
      .then(function(dangerObject) {
          self.geneModel.setDangerSummary(theGeneName, dangerObject);
          
          resolve(dangerObject);
      }).
      catch(function(error) {
        if (error.indexOf(geneName) >= 0 ) {
          self.dispatch.alertIssued('error', error, theGeneName);
        } else {
          self.dispatch.alertIssued('error', error + " for gene " + theGeneName, theGeneName);
        }
        reject(error);
      })
    })
  }

  promiseSummarizeDanger(geneObject, theTranscript, probandVcfData, options) {
    let self = this;

    if (!self.geneModel.isCandidateGene(geneObject.gene_name)) {
      return Promise.resolve();
    } else {

      return new Promise(function(resolve, reject) {
        var analyzeGeneCoverage = null;
        var dangerSummaryExisting = null;
        if (options && options.hasOwnProperty('GENECOVERAGE')) {
          analyzeGeneCoverage = options.GENECOVERAGE;
        } else {
          analyzeGeneCoverage = true;
        }

        var coveragePromise = null;
        if (analyzeGeneCoverage) {
          coveragePromise = self.promiseGetCachedGeneCoverage(geneObject, theTranscript, false, options);
        } else {
          coveragePromise = Promise.resolve();
        }

        coveragePromise.then(function(data) {

          var geneCoverageAll = null;
          if (analyzeGeneCoverage) {
            geneCoverageAll =  data.geneCoverage;
          }
          var theOptions = null;
          var notFoundVariants = null;

          self.getProbandModel().promiseGetDangerSummary(geneObject.gene_name)
          .then(function(dangerSummary) {

              dangerSummaryExisting = dangerSummary;

              // These are the imported variants that were not found in the vcf
              // file. If we don't save them here, we will lose this count in
              // dangerSummary.badges.notFound. We need this to show in the 'not found'
              // section of the flagged variants panel.
              if (dangerSummary && dangerSummary.badges && dangerSummary.badges.notFound) {
                notFoundVariants = dangerSummary.badges.notFound;    
              }

              // Summarize the danger for the gene based on the filtered annotated variants and gene coverage
              var filteredVcfData = null;
              var filteredFbData = null;
              if (probandVcfData) {
                if (probandVcfData.features && probandVcfData.features.length > 0) {
                  filteredVcfData = self.getProbandModel().filterVariants(probandVcfData, self.filterModel.getFilterObject(), geneObject.start, geneObject.end, true);
                  filteredFbData  = self.getProbandModel().reconstituteFbData(filteredVcfData);
                } else if (probandVcfData.features) {
                  filteredVcfData = probandVcfData;
                }


                theOptions = $.extend({}, options);

                theOptions.GENECOVERAGE = analyzeGeneCoverage;

                if ((dangerSummary && dangerSummary.CALLED) || (filteredFbData && filteredFbData.features.length > 0)) {
                    theOptions.CALLED = true;
                }

              }

              if (filteredVcfData && filteredVcfData.features) {
                return self.getProbandModel().promiseDetermineCompoundHets(filteredVcfData, geneObject, theTranscript);
              } else {
                return Promise.resolve();
              }


          })
          .then(function(theVcfData) {
              return self.getProbandModel().promiseSummarizeDanger(geneObject, theVcfData, theOptions, geneCoverageAll, self.filterModel, theTranscript, notFoundVariants, dangerSummaryExisting);
          })
          .then(function(data) {
            let theDangerSummary = data.dangerSummary;
            let isDirty          = data.isDirty;
            // If the danger summary hasn't changed since the last time this gene was selected,
            // we don't want to re-issue alerts or set the danger summary on the gene model,
            // which will cause an event to get dispatched.
            if (isDirty) {
              if (theDangerSummary && theDangerSummary.geneCoverageProblem && theDangerSummary.geneCoverageProblemNonProband) {
                self.dispatch.alertIssued("coverage", "Insufficient sequence coverage for gene <pre>" + theDangerSummary.geneName + "</pre> in proband and non-proband (e.g. mother, father) samples", theDangerSummary.geneName);
              } else if (theDangerSummary && theDangerSummary.geneCoverageProblem) {
                self.dispatch.alertIssued("coverage", "Insufficient sequence coverage for gene <pre>" + theDangerSummary.geneName + "</pre> in proband sample", theDangerSummary.geneName);
              } else if (theDangerSummary && theDangerSummary.geneCoverageProblemNonProband) {
                self.dispatch.alertIssued("coverage", "Insufficient sequence coverage for gene <pre>" + theDangerSummary.geneName + "</pre> in non-proband (e.g. mother, father) sample", theDangerSummary.geneName);
              } 

              self.geneModel.setDangerSummary(geneObject.gene_name, theDangerSummary);
            }
            resolve();
          })
          .catch(function(error) {
            var msg = "An error occurred in promiseSummarizeDanger() when calling SampleModel.promiseGetDangerSummary(): " + error;
            console.log(msg);
            reject(msg);
          })


        })
        .catch(function(error) {
          var msg = "An error occurred in CohortModel.promiseSummarizeDanger() when calling promiseGetCachedGeneCoverage(): " + error;
          console.log(msg);
          reject(msg);
        });

      });
    }



  }


  promiseGetCachedGeneCoverage(geneObject, transcript, showProgress = false) {
    let self = this;

    return new Promise(function(resolve, reject) {
      var geneCoverageAll = {gene: geneObject, transcript: transcript, geneCoverage: {}};

      var promises = [];
      self.sampleModels.forEach(function(model) {
        if (model.isBamLoaded()) {
          if (showProgress) {
            //vc.showBamProgress("Analyzing coverage in coding regions");
          }
          var promise = model.promiseGetGeneCoverage(geneObject, transcript)
           .then(function(data) {
            var gc = data.geneCoverage;
            geneCoverageAll.geneCoverage[data.model.getRelationship()] = gc;
            if (showProgress) {
              //getVariantCard(data.model.getRelationship()).endBamProgress();
            }
           })
           .catch(function(error) {
            reject(error);
           })
          promises.push(promise);
        }

      })
      Promise.all(promises).then(function() {
        resolve(geneCoverageAll);
      })
    })

  }

  promiseLoadBamDepth(theGene, theTranscript, options) {
    let self = this;

    return new Promise(function(resolve, reject) {
      let promises = [];
      let theResultMap = {};
      self.getCanonicalModels().forEach(function(model) {
        if (model.isBamLoaded()) {
          model.inProgress.loadingCoverage = true;
          var p = model.promiseGetBamDepth(theGene, theTranscript)
          .then(function(data) {
            data.model.inProgress.loadingCoverage = false;
            theResultMap[data.model.relationship] = data.coverageData;
          });

          promises.push(p);
        }
      });

      Promise.all(promises)
      .then(function() {
        resolve(theResultMap);
      })
      .catch(function(error) {
        reject(error)
      })

    })

  }

  promiseMarkCodingRegions(geneObject, transcript) {
    let self = this;
    return new Promise(function(resolve, reject) {

      var exonPromises = [];
      transcript.features.forEach(function(feature) {
        if (!feature.hasOwnProperty("danger")) {
          feature.danger = {proband: false, mother: false, father: false};
        }
        if (!feature.hasOwnProperty("geneCoverage")) {
          feature.geneCoverage = {proband: false, mother: false, father: false};
        }


        self.getCanonicalModels().forEach(function(model) {
          var promise = model.promiseGetCachedGeneCoverage(geneObject, transcript)
           .then(function(geneCoverage) {
              if (geneCoverage) {
                var matchingFeatureCoverage = geneCoverage.filter(function(gc) {
                  return feature.start == gc.start && feature.end == gc.end;
                });
                if (matchingFeatureCoverage.length > 0) {
                  var gc = matchingFeatureCoverage[0];
                  feature.geneCoverage[model.getRelationship()] = gc;
                  feature.danger[model.getRelationship()] = self.filterModel.isLowCoverage(gc);
                } else {
                  feature.danger[model.getRelationship()]  = false;
                }
              } else {
                feature.danger[model.getRelationship()] = false;
              }

           })
          exonPromises.push(promise);
        })
      })

      Promise.all(exonPromises).then(function() {
        var sortedExons = self.geneModel._getSortedExonsForTranscript(transcript);
        self.geneModel._setTranscriptExonNumbers(transcript, sortedExons);

        // Keep track of exons in sample that don't meet coverage thresholds.
        self.getCanonicalModels().forEach(function(model) {
          model.determineCoverageDangerRegions(transcript);
        })

        resolve({'gene': geneObject, 'transcript': transcript});
      });
    })

  }



  getCurrentTrioVcfData() {
    var trioVcfData = {};
    this.getCanonicalModels().forEach(function(model) {
      var theVcfData = model.vcfData;
      if (model.isAlignmentsOnly()) {
        if (theVcfData == null) {
          theVcfData = {};
          theVcfData.features = [];
          theVcfData.loadState = {};          
        } else {
          let loadedVariantsOnly = theVcfData.features.filter(function(feature) {
            return !feature.fbCalled || feature.fbCalled != 'Y';
          })
          theVcfData.features = loadedVariantsOnly;
        }
      }
      trioVcfData[model.getRelationship()] = theVcfData;
    })
    return trioVcfData;
  }



  promiseJointCallVariants(geneObject, theTranscript, loadedTrioVcfData, options) {
    var me = this;

    return new Promise(function(resolve, reject) {

      var showCallingProgress = function() {
        if (!options.isBackground) {
          me.getCanonicalModels().forEach(function(model) {
            model.inProgress.callingVariants = true;
          })
        }
      }

      var showCalledVariants = function() {
        if (!options.isBackground) {
          me.endGeneProgress(geneObject.gene_name);
          me.setLoadedVariants(geneObject);
          me.getCanonicalModels().forEach( function(model) {
            model.inProgress.callingVariants = false;
          });
        }
      }

      var endCallProgress = function() {
        if (!options.isBackground) {
          me.getCanonicalModels().forEach(function(model) {
            model.inProgress.callingVariants = false;
          })

        }
      }
      var refreshClinvarAnnots = function(trioFbData) {
        for (var rel in trioFbData) {
          if (trioFbData) {
            if (trioFbData[rel]) {
              trioFbData[rel].features.forEach(function (fbVariant) {
                if (fbVariant.source) {
                  fbVariant.source.clinvarUid                  = fbVariant.clinvarUid;
                  fbVariant.source.clinvarClinSig              = fbVariant.clinvarClinSig;
                  fbVariant.source.clinvarTrait                = fbVariant.clinvarTrait;

                  fbVariant.source.clinvarAccession            = fbVariant.clinvarAccession;
                  fbVariant.source.clinvarRank                 = fbVariant.clinvarRank;
                  fbVariant.source.clinvar                     = fbVariant.clinvar;
                  fbVariant.source.clinvarSubmissions          = fbVariant.clinvarSubmissions;
                }
              });

            }
          }
        }
      }

      var makeDummyVcfData = function() {
        return {'loadState': {}, 'features': []}
      }


      var trioFbData  = {'proband': null, 'mother': null, 'father': null};
      var trioVcfData = loadedTrioVcfData ? loadedTrioVcfData : null;

      me.startGeneProgress(geneObject.gene_name);

      me.clearCalledVariants();

      me.promiseHasCachedCalledVariants(geneObject, theTranscript)
      .then(function(hasCalledVariants) {

        if (options.checkCache && hasCalledVariants) {
          showCallingProgress();
          var promises = [];

          me.getCanonicalModels().forEach(function(model) {


            var theFbData;
            var theVcfData = trioVcfData && trioVcfData[model.getRelationship()] ? trioVcfData[model.getRelationship()] : null;
            var theModel;


            var p = model.promiseGetFbData(geneObject, theTranscript)
            .then(function(data) {
              theFbData = data.fbData;
              theModel = data.model;
              if (theVcfData) {
                return Promise.resolve({'vcfData': theVcfData});
              } else {
                return the.promiseGetVcfData(geneObject, theTranscript);
              }
            })
            .then(function(data) {
              theVcfData = data.vcfData;
              if (theVcfData == null) {
                theVcfData = makeDummyVcfData();
              }

              // When only alignments provided, only the called variants were cached as "fbData".
              // So initialize the vcfData to 0 features.
              var promise = null;
              if (theFbData && theFbData.features.length > 0 && theVcfData.features.length == 0) {
                promise = theModel.promiseCacheDummyVcfDataAlignmentsOnly(theFbData, geneObject, theTranscript );
              } else {
                Promise.resolve();
              }

              promise.then(function() {
                if (!options.isBackground) {
                  theModel.vcfData = theVcfData;
                  theModel.fbData  = theFbData;
                }
                trioFbData[model.getRelationship()] = theFbData;
                trioVcfData[model.getRelationship()] = theVcfData;
              })

            })
            .catch(function(error) {
              me.endGeneProgress(geneObject.gene_name);
              var msg = "A problem occurred in joint calling variants. Error: " + error;
              console.log(msg);
              console.log(error);
              reject(msg);
            })

            promises.push(p);
          })
          Promise.all(promises)
          .then(function() {
            showCalledVariants();
              resolve({
                'gene': geneObject,
                'transcript': theTranscript,
                'jointVcfRecs': [],
                'trioVcfData': trioVcfData,
                'trioFbData': trioFbData,
                'refName': geneObject.chr,
                'sourceVariant': options.sourceVariant});
          })
          .catch(function(error) {
            reject(error)
          })


        } else {
          var bams = [];
          me.getCanonicalModels().forEach(function(model) {
            bams.push(model.bam);
          });

          showCallingProgress();

          me.getProbandModel().bam.promiseFreebayesJointCall(
            geneObject,
            theTranscript,
            bams,
            me.geneModel.geneSource == 'refseq' ? true : false,
            me.freebayesSettings.arguments,
            me.globalApp.vepAF, // vep af
            me.getTrioAlignmentSampleNames(),
            options.gnomADExtra,
            options.decompose)
          .then(function(data) {

            let jointVcfRecs = data.variantData.split("\n");
            let trRefName    = data.refName;

            if (trioVcfData == null) {
              trioVcfData = {'proband': makeDummyVcfData(), 'mother': makeDummyVcfData(), 'father': makeDummyVcfData()};
            }

            // Parse the joint called variants back to variant models
            var data = me._parseCalledVariants(data.geneObject, data.transcript, trRefName, jointVcfRecs, trioVcfData, options)

            if (data == null) {
              endCallProgress();
              reject("Empty results when parsing called variants for gene " + data.geneObject.gene_name)
            } else {
              trioFbData = data.trioFbData;


              // Annotate called variants with clinvar
              return me.promiseAnnotateWithClinvar(trioFbData, geneObject, theTranscript, true)
              .then(function() {

                refreshClinvarAnnots(trioFbData);

                // We need to cache the vcf data with the merged in called variants (fbCalled=Y)
                // So, reset the cacheState to blank.
                trioVcfData.proband.cacheState = null

                // Determine inheritance across union of loaded and called variants
                me.promiseAnnotateInheritance(geneObject, theTranscript, trioVcfData, {isBackground: options.isBackground, cacheData: true})
                .then( function() {
                    me.getCanonicalModels().forEach(function(model) {
                      model.loadCalledTrioGenotypes(trioVcfData[model.getRelationship()], trioFbData[model.getRelationship()]);
                    })
                    // Summarize danger for gene
                   return me.promiseSummarizeDanger(geneObject, theTranscript, trioVcfData.proband, {'CALLED': true});
                })
                .then(function() {
                  showCalledVariants();

                  var refreshedSourceVariant = null;
                  if (options.sourceVariant) {
                    trioVcfData.proband.features.forEach(function(variant) {
                      if (!refreshedSourceVariant &&
                        me.globalApp.utility.stripRefName(variant.chrom) == me.globalApp.utility.stripRefName(options.sourceVariant.chrom) &&
                        variant.start == options.sourceVariant.start &&
                        variant.ref == options.sourceVariant.ref &&
                        variant.alt == options.sourceVariant.alt) {

                        refreshedSourceVariant = variant;
                        refreshedSourceVariant.notes = options.sourceVariant.notes;
                        refreshedSourceVariant.interpretation = options.sourceVariant.interpretation;
                  
                        // CohortModel.promiseExportVariants has refreshed the bamDepth
                        // from the coverage data. We don't want to lose these values
                        // when we export these called variants
                        refreshedSourceVariant.bamDepth = options.sourceVariant.bamDepth;
                        refreshedSourceVariant.bamDepthMother = options.sourceVariant.bamDepthMother;
                        refreshedSourceVariant.bamDepthFather = options.sourceVariant.bamDepthFather;


                      }
                    })
                  }
                  resolve({
                    'gene': geneObject,
                    'transcript': theTranscript,
                    'jointVcfRecs': jointVcfRecs,
                    'trioVcfData': trioVcfData,
                    'trioFbData': trioFbData,
                    'refName': trRefName,
                    'sourceVariant': refreshedSourceVariant ? refreshedSourceVariant : options.sourceVariant });
                })
                .catch(function(error) {
                  reject(error)
                })
              })
              .catch(function(error) {
                reject(error)
              })
            }

          })
          .catch(function(error) {
            reject(error)
          })
        }
      })
    })

  }


  _parseCalledVariants(geneObject, theTranscript, translatedRefName, jointVcfRecs, trioVcfData, options) {
    var me = this;
    var trioFbData  = {'proband': null, 'mother': null, 'father': null};
    var fbPromises = [];
    var idx = 0;

    me.getCanonicalModels().forEach(function(model) {

      var sampleNamesToGenotype = model.getSampleNamesToGenotype();

      var theVcfData = trioVcfData[model.getRelationship()];
      if (theVcfData == null) {
        theVcfData = {loadState: [], features: []};
        trioVcfData[model.getRelationship()] = theVcfData;
      }

      theVcfData.loadState['called'] = true;
      var data = model.vcf.parseVcfRecordsForASample(jointVcfRecs, translatedRefName, geneObject, theTranscript, me.translator.clinvarMap, true, (sampleNamesToGenotype ? sampleNamesToGenotype.join(",") : null), idx, me.globalApp.vepAF, options.gnomADExtra);

      var theFbData = data.results;
      theFbData.loadState['called'] = true;
      // Determine the af and highest af for all variants
      theFbData.features.forEach(function(variant) {
        variant.extraAnnot = true;
        variant.fbCalled = "Y";
        variant.extraAnnot = true;
        model._determineHighestAf(variant);
        model._determineAf(variant)
      })


      // Filter the freebayes variants to only keep the ones
      // not present in the vcf variant set.
      model._determineUniqueFreebayesVariants(geneObject, theTranscript, theVcfData, theFbData);


      if (!options.isBackground) {
        model.fbData = theFbData;
        model.vcfData = theVcfData;
      }
      trioFbData[model.getRelationship()]  = theFbData;

      idx++;
    });


    return {'trioVcfData': trioVcfData, 'trioFbData': trioFbData};

  }

  promiseHasCalledVariants() {
    var me = this;

    return new Promise(function(resolve, reject) {
      var promises = [];
      var cardCount = 0;
      var count = 0;

      me.getCanonicalModels().forEach(function(model) {
        cardCount ++;
        var promise = model.promiseHasCalledVariants().then(function(hasCalledVariants) {
          if (hasCalledVariants) {
            count++;
          }
        })
        promises.push(promise);
      });

      Promise.all(promises).then(function() {
        resolve(count == cardCount);
      })
    });

  }

  promiseHasCachedCalledVariants(geneObject, transcript) {
    var me = this;
    return new Promise(function(resolve, reject) {
      var cachedCount =  0;
      var promises = [];
      me.getCanonicalModels().forEach(function(model) {
        var p = model.promiseGetFbData(geneObject, transcript)
         .then(function(data) {
          if (data.fbData) {
            cachedCount ++;
          }

         })
        promises.push(p);
      });
      Promise.all(promises).then(function() {
        resolve(cachedCount == me.getCanonicalModels().length);
      })

    })
  }

  setVariantInterpretation(theGene, theTranscript, variant, options) {
    var self = this;
    this._recacheForFlaggedVariant(theGene, theTranscript, variant, options);
  }

  addUserFlaggedVariant(theGene, theTranscript, variant) {
    var self = this;
    variant.isFlagged = true;
    variant.isUserFlagged = true;
    if (variant.filtersPassed == null) {
      variant.filtersPassed = [];
    }
    variant.filtersPassed.push("userFlagged");
    variant.featureClass = "flagged";

    self._recacheForFlaggedVariant(theGene, theTranscript, variant, {summarizeDanger: true});

  }

  removeFilterPassed(variant, filterName) {
    if (variant && variant.filtersPassed && variant.filtersPassed.length > 0) {
      var idx = variant.filtersPassed.indexOf(filterName);
      if (idx >= 0 ) {
        variant.filtersPassed.splice(idx, 1);
      }
    }
  }

  removeUserFlaggedVariant(theGene, theTranscript, variant) {
    var self = this;
    var index = -1;
    var i = 0;

    variant.isFlagged = false;
    variant.isUserFlagged = false;
    this.removeFilterPassed(variant, "userFlagged");

    this._removeFlaggedVariantImpl(variant);

    this.getProbandModel().promiseGetDangerSummary(theGene.gene_name)
    .then(function(dangerSummary) {
      let reviewedVariants = dangerSummary.badges['reviewed'];
      var i = 0;
        if (reviewedVariants) {
        reviewedVariants.forEach(function(v) {
          var matches = (
            self.globalApp.utility.stripRefName(v.chrom) == self.globalApp.utility.stripRefName(variant.chrom)
            && v.start == variant.start
            && v.ref == variant.ref
            && v.alt == variant.alt);
          if (matches) {
            index = i;
          }
          i++;
        })
        if (index >= 0) {
          reviewedVariants.splice(index, 1);
          me.geneModel.setDangerSummary(theGene.gene_name, dangerSummary);
        }
      }
      //self._recacheForFlaggedVariant(theGene, theTranscript, variant, {summarizeDanger: true});
    })
  }

  _removeFlaggedVariantImpl(variant) {
    let self = this;
    var index = -1;
    var i = 0;
    this.flaggedVariants.forEach(function(v) {
      var matches = (
        self.globalApp.utility.stripRefName(v.chrom) == self.globalApp.utility.stripRefName(variant.chrom)
        && v.start == variant.start
        && v.ref == variant.ref
        && v.alt == variant.alt);
      if (matches) {
        index = i;
        v.isUserFlagged = false;
        v.isFlagged = false;
        self.removeFilterPassed(v, "userFlagged");
      }
      i++;
    })
    if (index >= 0) {
      this.flaggedVariants.splice(index, 1);
    }
  }

  _recacheForFlaggedVariant(theGene, theTranscript, variant, options) {
    let self = this;
    self.getProbandModel().promiseGetVcfData(theGene, theTranscript)
    .then(function(data) {
      let cachedVcfData = data.vcfData;
      cachedVcfData.features.forEach(function(v) {
        var matches = (
                      self.globalApp.utility.stripRefName(v.chrom) == self.globalApp.utility.stripRefName(variant.chrom)
                      && v.start == variant.start
                      && v.ref == variant.ref
                      && v.alt == variant.alt);

        if (matches) {
          v.isFlagged      = variant.isFlagged
          v.isUserFlagged  = variant.isUserFlagged;
          v.filtersPassed  = variant.filtersPassed;
          v.interpretation = variant.interpretation;
          v.notes          = variant.notes;
        }
      });
      self.getProbandModel()._promiseCacheData(cachedVcfData, CacheHelper.VCF_DATA, theGene.gene_name, theTranscript);

      if (options && options.summarizeDanger) {
        // Now summarize the danger for the selected gene
        self.promiseSummarizeDanger(theGene, theTranscript, cachedVcfData, null)
      }
    });
  }


  clearFlaggedVariants() {
    this.flaggedVariants = [];
  }


  syncUpFlaggedSwitch(vcfData) {
    let self = this;
    if (vcfData) {
      vcfData.features.forEach(function(variant) {
        let existingVariant = self.getFlaggedVariant(variant);
        if (existingVariant) {
          variant.isFlagged      = existingVariant.isFlagged;
          variant.isUserFlagged  = existingVariant.isUserFlagged;
          variant.filtersPassed  = existingVariant.filtersPassed;
          variant.interpretation = existingVariant.interpretation;
          variant.notes          = existingVariant.notes;
          variant.featureClass   = existingVariant.isUserFlagged ? "flagged" : "";
        } else {
          variant.isFlagged = false;
          variant.isUserFlagged = false;
          variant.filtersPassed = [];
          variant.featureClass  = "";
        }
      });
    }
  }

  isFlaggedVariant(variant) {
    var matchingVariants = this.flaggedVariants.filter(function(v) {
      return v.start == variant.start
       && v.ref      == variant.ref
       && v.alt      == variant.alt;
    });
    return matchingVariants.length > 0;
  }

  _promiseRefreshFlaggedVariantCoverage(geneObject, transcript, flaggedVariants) {
    let self = this;
    return new Promise(function(resolve, reject) {
      
      self.promiseLoadCoverage(geneObject, transcript)
      .then(function(resultMap) {
        // Update the coverage for each of the flagged variants and the related
        // variants for mother, father
        for (let rel in resultMap) {
          let coverage = resultMap[rel];
          flaggedVariants.forEach(function(theVariant) {
            let bamDepth = self.getModel(rel).getBamDepthAtVariantPosition(theVariant, coverage);
            if (bamDepth) {
              if (rel == 'proband') {
                theVariant.bamDepth = bamDepth;
              } else {
                theVariant['bamDepth' + self.globalApp.utility.capitalizeFirstLetter(rel)] = bamDepth;
              }
            }
          })
        }
        resolve();
      })
      .catch(function(error) {
        console.log("Cannot refresh flagged variant coverage " + error)
        reject(error)
      })
    })
  }

  promiseExportFlaggedVariants(format = 'csv') {
    let self = this;

    return new Promise(function(resolve, reject) {

      // If this is a trio, the exporter will be getting the genotype info for proband, mother
      // and father, so pass in a comma separated value of sample names for trio.  Otherwise,
      // just pass null, which will default to the proband's sample name
      var sampleNames = null;
      if (self.mode == 'trio') {
        sampleNames = self.getCanonicalModels().map(function(model) {
          return model.getSampleName();
        })
      }

      let genesToAnalyze = {}
      self.flaggedVariants.forEach(function(variant) {
        let geneObject = variant.gene;

        let geneInfo = genesToAnalyze[geneObject.gene_name]
        if (geneInfo == null) {
          let transcript = self.geneModel.getCanonicalTranscript(geneObject);
          let theVariants = [];
          geneInfo = {'geneObject': geneObject, 'transcript': transcript, 'flaggedVariants': theVariants};
          genesToAnalyze[geneObject.gene_name] = geneInfo;        
        } 
        geneInfo.flaggedVariants.push(variant)
      })

      let promises = [];
      Object.keys(genesToAnalyze).forEach(function(geneName) {
        let geneInfo = genesToAnalyze[geneName]
        let p = self._promiseRefreshFlaggedVariantCoverage(geneInfo.geneObject, geneInfo.transcript, geneInfo.flaggedVariants)
        promises.push(p)
      })
      Promise.all(promises)
      .then(function() {
        return self.variantExporter.promiseExportVariants(self.flaggedVariants, format, sampleNames);
      })
      .then(function(output) {
        resolve(output)
      })
      .catch(function(error) {
        console.log(error)
        self.dispatch.alertIssued("error", "Unable to export variants", null, [error]);
        reject(error)
      })
    })

  }

  promiseExportFlaggedVariant(format = 'csv', variant) {
    let self = this;
    // If this is a trio, the exporter will be getting the genotype info for proband, mother
    // and father, so pass in a comma separated value of sample names for trio.  Otherwise,
    // just pass null, which will default to the proband's sample name
    var sampleNames = null;
    if (self.mode == 'trio') {
      sampleNames = self.getCanonicalModels().map(function(model) {
        return model.getSampleName();
      })
    }

    return self.variantExporter.promiseExportVariants([variant], format, sampleNames);
  }

  onFlaggedVariantsFileSelected(fileSelection, fileType, callback) {
    var files = fileSelection.currentTarget.files;
    var me = this;
    // Check for the various File API support.
    if (window.FileReader) {
      var variantsFile = files[0];
      var reader = new FileReader();

      reader.readAsText(variantsFile);

      // Handle errors load
      reader.onload = function(event) {
        var data = event.target.result;
        me.importFlaggedVariants(fileType, data,
        function() {
          // When all flagged variantsww imported

        },
        function() {
          // When all flagged variants imported, analyzed, and cached
          if (callback) {
            callback();
          }
        });
        fileSelection.value = null;
      }
      reader.onerror = function(event) {
        alert("Cannot read file. Error: " + event.target.error.name);
        console.log(event.toString())
        if (callback) {
          callback();
        }
      }

    } else {
      alert('FileReader are not supported in this browser.');
      if (callback) {
        callback();
      }
    }
  }

  promiseMergeImportedVariants(importedVariants) {
    let self = this;
    let promises = [];

    return new Promise(function(resolve, reject) {
      importedVariants.forEach(function(importedVariant) {
        var matchingVariant = self.getFlaggedVariant(importedVariant);
        if (!matchingVariant) {
          let p = self.geneModel.promiseGetCachedGeneObject(importedVariant.gene)
          .then(function(geneObject) {
             let variant = self.setImportedVariantGeneAndTranscript(importedVariant, geneObject, {copy: true})
             self.flaggedVariants.push(variant);
          })
          promises.push(p)
        } else {
          matchingVariant.interpretation = importedVariant.interpretation;
          matchingVariant.notes          = importedVariant.notes;
          matchingVariant.isUserFlagged  = importedVariant.isUserFlagged;
          matchingVariant.featureClass   = importedVariant.isUserFlagged ? "flagged" : "";
          promises.push(Promise.resolve())
        }
      })
      Promise.all(promises)
      .then(function() {
        resolve()
      })
      .catch(function(error) {
        reject(error);
      })

    })
  }

  setImportedVariantGeneAndTranscript(importedVariant, geneObject, options) {
    let self = this;

    let variant = null;
    if (options && options.copy) {
      variant = $.extend({}, importedVariant)
    } else {
      variant = importedVariant;
    }

    variant.geneName = variant.gene;
    variant.gene = geneObject;
    variant.isProxy = true;
    variant.isFlagged = true;
    variant.notCategorized = false;
    variant.isImported = true;

    variant.filtersPassed = variant.filtersPassed && variant.filtersPassed.indexOf(",") > 0 ? variant.filtersPassed.split(",").join() : (variant.filtersPassed ? [variant.filtersPassed] : ['notCategorized']);
    if (variant.isUserFlagged == 'Y') {
      variant.isUserFlagged = true;
    } else {
      variant.isUserFlagged = null;
    }
    if (variant.transcript && typeof variant.transcript === 'object') {

    } else if (variant.transcript && variant.transcript.length > 0) {
      variant.transcript = self.geneModel.getTranscript(geneObject, variant.transcript);
    } else {
      var tx = geneObject ? self.geneModel.getCanonicalTranscript(geneObject) : null;
      if (tx) {
        variant.transcript = tx;
      }
    }
    return variant;

  }

  importFlaggedVariants(fileType, data, callbackPostImport, callbackPostAnalyze) {
    var me = this;
    me.flaggedVariants = [];

    var isObject = function(val) {
      if (val === null) {
        return false;
      } else {
        return ( (typeof val === 'function') || (typeof val === 'object') );
      }
    }


    var importRecords = null;
    if (fileType == 'json') {
      importRecords = data == null ? [] : data;
    } else {
      importRecords = VariantImporter.parseRecords(fileType, data);
    }

    // If the number of bookmarks exceeds the max gene limit, truncate the
    // bookmarked variants to this max.
    if (me.globalApp.maxGeneCount && importRecords.length > me.globalApp.maxGeneCount) {
      var bypassedCount = importRecords.length - me.globalApp.maxGeneCount;
      importRecords = importRecords.slice(0, me.globalApp.maxGeneCount);
      var msg = "Only first " + me.globalApp.maxGeneCount + " bookmarks will be imported. " + bypassedCount.toString() + " were bypassed.";
      me.dispatch.alertIssued("warning", msg)
    }


    // We need to make sure each imported record has a cached gene object and is assigned
    // a transcript.
    // So first, cache all of the gene objects for the imported variants
    var promises = []

    // Workaround - some older saved analysis had empty variant
    // records. Bypass these.
    importRecords = importRecords.filter(function(ir) {
      if (ir == null) {
        console.log("WARNING: bypassing null variant record")
        me.dispatch.alertIssued('warning', 'Bypassing blank variant.');          
        return false;
      } else {
        return true;
      }
    })

    importRecords.forEach( function(ir) {
      // Workaround.  variant.gene sometimes an
      // object, sometimes a gene name.  Other times
      // variant.geneName is filled in instead
      // of variant.gene.

      if (ir.gene == null && ir.geneName) {
        if (isObject(ir.geneName)) {
          ir.gene  = ir.geneName.gene_name
        } else {
          ir.gene  = ir.geneName;
        }
      } else {
        if (ir.gene && isObject(ir.gene)) {
          ir.gene  = ir.gene.gene_name;
        }
      }
      if (ir.gene == null) {
        me.dispatch.alertIssued('warning', 'Bypassing variant. Gene symbol is missing.');          
      } else {
        var theGeneObject = me.geneModel.geneObjects[ir.gene];
        if (theGeneObject == null || !ir.transcript || ir.transcript == '') {
          var promise = me.geneModel.promiseGetCachedGeneObject(ir.gene, true)
          .then(function(theGeneObject) {
            if (theGeneObject.notFound) {
              if (me.geneModel.isKnownGene(theGeneObject.notFound)) {
                me.geneModel.promiseAddGeneName(theGeneObject.notFound);
              } else {
                me.dispatch.alertIssued('warning', 'Bypassing variant. Unknown gene <pre>' + theGeneObject.notFound + "</pre>.", theGeneObject.notFound);          
              }
            }
            else if (ir.gene && theGeneObject.notFound === undefined){
              if (me.geneModel.isKnownGene(ir.gene)) {
                me.geneModel.promiseAddGeneName(ir.gene);
              } else {
                me.dispatch.alertIssued('warning', 'Bypassing variant. Unknown gene <pre>' + ir.gene + "</pre>.", ir.gene);          
              }
            }
          })
          .catch(function(error) {
            me.dispatch.alertIssued('warning', error.message, error.gene)
          })
          promises.push(promise);
        }
      }
    })

    // Now that all of the gene objects have been cached, we can fill in the
    // transcript if necessary and then find load the imported bookmarks
    Promise.all(promises)
    .then(function() {
      var genesToAnalyze = {load: [], call: []};
      var geneToAltTranscripts = {};
      importRecords.forEach( function(variant) {
        var geneObject = me.geneModel.geneObjects[variant.gene];

        if (geneObject) {
          me.setImportedVariantGeneAndTranscript(variant, geneObject);
          geneToAltTranscripts[geneObject.gene_name] = variant.transcript;

          me.flaggedVariants.push(variant);

          var analyzeKinds = variant.freebayesCalled == 'Y' ? ['call'] : ['load'];
          analyzeKinds.forEach(function(analyzeKind) {
            var theVariants = genesToAnalyze[analyzeKind][variant.gene.gene_name];
            if (theVariants == null) {
              theVariants = [];
              genesToAnalyze[analyzeKind][variant.gene.gene_name] = theVariants;
            }
            theVariants.push(variant);
          })         
        }


      });
      // First callback when flagged variants are now populated by imported records
      if (callbackPostImport) {
        callbackPostImport(me.flaggedVariants.length);
      }


      var intersectedGenes = {};
      for (var analyzeKind in genesToAnalyze) {
        for (var geneName in genesToAnalyze[analyzeKind]) {
          var variants = genesToAnalyze[analyzeKind][geneName];
          var allVariants = intersectedGenes[geneName];
          if (allVariants == null) {
            allVariants = [];
            intersectedGenes[geneName] = allVariants;
          }
          variants.forEach(function(v) {
            allVariants.push(v);
          })
        }
      }




      if (me.isLoaded) {
        me.cacheHelper.on("geneAnalyzed", function(theGene, transcript, analyzeCalledVariants) {
          me.onImportedGeneAnalyzed(theGene.gene_name, intersectedGenes, theGene, transcript, analyzeCalledVariants)

        })

        me.cacheHelper.promiseAnalyzeSubset(me, Object.keys(genesToAnalyze.load), geneToAltTranscripts, false, false)
        .then(function() {
          if (Object.keys(genesToAnalyze.call).length > 0) {
            return me.cacheHelper.promiseAnalyzeSubset(me, Object.keys(genesToAnalyze.call), geneToAltTranscripts, true, false)
          } else {
            return Promise.resolve();
          }
        })
        .then(function() {
          // Second callback when every gene has been analyzed
          if (callbackPostAnalyze) {
            callbackPostAnalyze();
          }

        })
        .catch(function(error) {
          var msg = "An error occurred when analyzing all genes from imported variants. " + error;
          console.log(msg);
          if (callbackPostAnalyze) {
            callbackPostAnalyze();
          }

        })

      }

    })
    .catch(function(error) {
      console.log("CohortModel.importFlaggedVariants() failed with error " + error)
      me.dispatch.alertIssued('warning', error.message, error.gene)
    })

  }

  onImportedGeneAnalyzed(geneName, intersectedGenes, theGeneObject, theTranscript, analyzeCalledVariants) {
    let me = this;
    let dataPromises = [];
    if (me.geneModel.isCandidateGene(geneName)) {
      var uniqueTranscripts = {};
      if(!intersectedGenes[geneName]){
        intersectedGenes[geneName] = [{}];
      } else  {
        intersectedGenes[geneName].forEach(function(importedVariant) {
          if (importedVariant.transcript == null || importedVariant.transcript.transcript_id == null) {
            console.log("No transcript for importedVariant");
            console.log(importedVariant);
            me.dispatch.alertIssued('warning', 'No transcript specified for imported variant in gene <pre>' + geneName + '</pre>', geneName);
          } else {
            uniqueTranscripts[importedVariant.transcript.transcript_id] = importedVariant.transcript;
          }
        })
      }

      if (theTranscript) {
        uniqueTranscripts[theTranscript.transcript_id] = theTranscript;
      }
      for (var transcriptId in uniqueTranscripts) {
        let dataPromise =  new Promise(function(resolve, reject) {

          var notFoundVariants = []
          var geneObject = theGeneObject ? theGeneObject : me.geneModel.geneObjects[geneName];
          var transcript = uniqueTranscripts[transcriptId];
          var importedVariants = intersectedGenes[geneName]
            .filter(function(importedVariant) {
              // If the gene analyzed was freebayes joint called, look for
              // imported variants that were called. Otherwise; look for
              // imported variants that were loaded from vcf.
              if (analyzeCalledVariants) {
                return importedVariant.freebayesCalled && importedVariant.freebayesCalled == 'Y';
              } else {
                return !importedVariant.freebayesCalled || importedVariant.freebayesCalled != 'Y';
              }
            })

          me.getProbandModel().promiseGetVcfData(geneObject, transcript, true)
          .then(function(data) {

            if (data == null || data.vcfData == null || data.vcfData.features == null) {
              var msg = "Unable to get variant vcf data for " + geneObject.gene_name + " " + transcript.transcript_id;
              console.log(msg);
              resolve();
            } else if (importedVariants && importedVariants.length > 0) {

              importedVariants.forEach(function(importedVariant) {
                let matchingVariants = data.vcfData.features.filter(function(v) {
                  let isMatch = me.globalApp.utility.stripRefName(v.chrom) == me.globalApp.utility.stripRefName(importedVariant.chrom)
                     && v.start == importedVariant.start
                     && v.ref      == importedVariant.ref
                     && v.alt      == importedVariant.alt;

                  return isMatch;
                })
                if (matchingVariants.length > 0) {
                  let matchingVariant = matchingVariants[0];

                  var origImportedVariant = $.extend({}, importedVariant);
                  importedVariant         = $.extend(importedVariant, matchingVariant);

                  importedVariant.isFlagged      = true;
                  importedVariant.isImported     = true;
                  importedVariant.isProxy        = false;

                  importedVariant.gene           = origImportedVariant.gene;
                  importedVariant.transcript     = origImportedVariant.transcript;
                  importedVariant.isUserFlagged  = origImportedVariant.isUserFlagged;
                  importedVariant.featureClass   = origImportedVariant.isUserFlagged ? "flagged" : "";
                  importedVariant.interpretation = origImportedVariant.interpretation;
                  importedVariant.notes          = origImportedVariant.notes;

                  matchingVariant.isImported     = true;
                  matchingVariant.isUserFlagged  = origImportedVariant.isUserFlagged;
                  matchingVariant.featureClass   = origImportedVariant.isUserFlagged ? "flagged" : "";
                  matchingVariant.interpretation = origImportedVariant.interpretation;
                  matchingVariant.notes          = origImportedVariant.notes;

                } else {
                  importedVariant.isProxy = true;
                  importedVariant.notFound = true;
                  importedVariant.isFlagged = true;
                  notFoundVariants.push(importedVariant)
                  
                  console.log("Unable to match imported variant to vcf data for " + importedVariant.gene.gene_name + " " + importedVariant.transcript.transcript_id + " " + importedVariant.start)
                  
                  me.dispatch.alertIssued('warning', 'Imported variant ' 
                  + 'in gene <pre>' + geneObject.gene_name + '</pre> not found in proband variant file.', geneObject.gene_name);          

                }
              })

              // Make sure that the imported variants are re-assessed to determine the filters they
              // pass.  We need this so that the imported variants show up in the left flagged variants
              // side panel.
              let badgesFromImported = me.filterModel.flagImportedVariants(importedVariants);

              // We need to recache the variants since the isUserFlag has been established
              me.getProbandModel()._promiseCacheData(data.vcfData, CacheHelper.VCF_DATA, geneObject.gene_name, transcript)
              .then(function() {

                // Now recalc the badge counts on danger summary to reflect imported variants
                me.getProbandModel().promiseGetDangerSummary(geneObject.gene_name)
                .then(function(dangerSummary) {
                  // In addition to the vcf data variants, pass in the notFound imported variants
                  // so that dangerSummary badges include this under the 'notFound' category.
                  dangerSummary.badges = me.filterModel.flagVariants(data.vcfData);

                  me.captureFlaggedVariants(dangerSummary, geneObject)

                  if (badgesFromImported && badgesFromImported.notFound) {
                    dangerSummary.badges.notFound = badgesFromImported.notFound;
                  }
                  me.geneModel.setDangerSummary(geneObject.gene_name, dangerSummary);
                  me.getProbandModel()._promiseCacheData(dangerSummary, CacheHelper.DANGER_SUMMARY_DATA, geneObject.gene_name)
                  .then(function() {
                    resolve()
                  })

                  // For every gene, we will analyze the coverage across the exons
                  // NOTE:  This is an expensive operation!

                  //me.promiseLoadCoverage(geneObject, transcript)
                  //.then(function() {
                  //  resolve();
                  //})

                });
              })
            }
          })
          .catch(function(error) {
            resolve();
          })

        })
        dataPromises.push(dataPromise);
      }



    }
    return dataPromises;
  }

  /* 
   *  Create a structure that organizes variants: filter -> genes -> variants
   */
  promiseOrganizeVariantsByFilterAndGene(activeFilterName, isFullAnalysis, interpretationFilters, variant, options={includeNotCategorized: false, includeReviewed: true, includeAll: true}) {
    let self = this;


    return new Promise(function(resolve, reject) {
      let filters = [];
      for (var filterName in self.filterModel.flagCriteria) {
        if (activeFilterName == null || activeFilterName == filterName || activeFilterName == 'coverage') {
          let flagCriteria = self.filterModel.flagCriteria[filterName];
          let include = true;

          if (!options.includeReviewed && filterName == 'reviewed') {
            include = false;
          }

          if (include) {
            var sortedGenes = self._organizeVariantsForFilter(filterName, flagCriteria.userFlagged, isFullAnalysis, interpretationFilters, options, variant);

            if (sortedGenes.length > 0 || options.includeAll) {
              filters.push({'key': filterName, 'filter': flagCriteria, 'genes': sortedGenes });
            }
          }
        }
      }

      let sortedFilters = filters.sort(function(filterObject1, filterObject2) {
     
        if (filterObject1.genes.length > 0 && filterObject2.genes.length > 0) {
          return filterObject1.filter.order > filterObject2.filter.order;
        } else if (filterObject1.genes.length > 0) {
          return -1;
        } else if (filterObject2.genes.length > 0) {
          return 1;
        } else {
          return filterObject1.filter.order > filterObject2.filter.order;
        }
     
      })

      sortedFilters.forEach(function(filterObject) {
        filterObject.variantCount = 0;
        var variantIndex = 1;
        filterObject.genes.forEach(function(geneList) {

          // Sort the variants according to the Ranked Variants table features
          self.featureMatrixModel.setFeaturesForVariants(geneList.variants);
          geneList.variants = self.sortVariants(geneList.variants)


          geneList.variants.forEach(function(variant) {
            variant.ordinalFilter = variantIndex++;
            filterObject.variantCount++;
          })

        })
      })

      let geneToPhenotypes = {}
      let promises = [];
      sortedFilters.forEach(function(filterObject) {
        filterObject.genes.forEach(function(geneList) {
          let p = self.promiseGetGenePhenotypeAssociations(geneList.gene.gene_name, true)
          .then(function(data) {
            geneToPhenotypes[data.gene] = data.hpoEntries;
          })
          promises.push(p)

        })
      })

      Promise.all(promises)
      .then(function() {
        sortedFilters.forEach(function(filterObject) {
          filterObject.genes.forEach(function(geneList) {
            geneList.matchingPhenotypes = geneToPhenotypes[geneList.gene.gene_name]
          })
        })
        resolve(sortedFilters)
      })
      .catch(function(error) {
        reject(error)
      })
    })
  }

  getFlaggedVariant(theVariant) {
    let self = this;
    var existingVariants = this.flaggedVariants.filter(function(v) {
      var matches = (
        self.globalApp.utility.stripRefName(v.chrom) == self.globalApp.utility.stripRefName(theVariant.chrom)
        && v.start == theVariant.start
        && v.ref == theVariant.ref
        && v.alt == theVariant.alt);
      return matches;
    })
    if (existingVariants && existingVariants.length > 0) {
      return existingVariants[0];
    } else {
      return null;
    }

  }

  getFlaggedVariantCount(isFullAnalysis, options={includeNotCategorized: false}) {
    let self = this;
    let theFlaggedVariants = self.flaggedVariants.filter(function(variant) {
      if (isFullAnalysis) {
        let include = true;
        if (!options.includeNotCategorized && variant.filtersPassed.length() == 1 && variant.filtersPassed.indexOf("notCategorized") == 0) {
          include = false;
        }
        return include && !self.geneModel.isCandidateGene(variant.geneName);

      } else {
        return self.geneModel.isCandidateGene(variant.geneName);

      }
    })
    return theFlaggedVariants.length;
  }

  getFlaggedVariantsByFilter(geneName) {
    let self = this;
    let variants = this.flaggedVariants.filter(function(flaggedVariant) {
      return flaggedVariant.gene.gene_name == geneName;
    });
    let filterToVariantMap = {};
    variants.forEach(function(v) {
      if (v.isUserFlagged) {
        var filterName = 'userFlagged';
        let theVariants = filterToVariantMap[filterName];
        if (theVariants == null) {
          theVariants =[];
          filterToVariantMap[filterName] = theVariants;
        }
        theVariants.push(v);
      } else if (v.filtersPassed) {
        v.filtersPassed.forEach(function(filterName) {
          let theVariants = filterToVariantMap[filterName];
          if (theVariants == null) {
            theVariants =[];
            filterToVariantMap[filterName] = theVariants;
          }
          theVariants.push(v);
        })
      }
    })
    let filters = [];
    for (var filterName in self.filterModel.flagCriteria) {
      var theFilter = self.filterModel.flagCriteria[filterName];
      var theVariants = filterToVariantMap[filterName];

      if (theVariants) {
        // Sort the variants according to the Ranked Variants table features
        self.featureMatrixModel.setFeaturesForVariants(theVariants);
        let sortedVariants = self.sortVariants(theVariants)

        filters.push({filter: theFilter, variants: sortedVariants});
      }
    }
    return filters.sort(function(filterObject1, filterObject2) {
      return filterObject1.filter.order > filterObject2.filter.order;
    })


  }

  getFlaggedVariantsForGene(geneName) {
    let self = this;
    let theVariants = this.flaggedVariants.filter(function(flaggedVariant) {
      return flaggedVariant.gene.gene_name == geneName;
    });
    return theVariants;
  }

  removeFlaggedVariantsForGene(geneName) {
    let self = this;
    let variantsToRemove = this.flaggedVariants.filter(function(flaggedVariant) {
      return flaggedVariant.gene.gene_name == geneName;
    });
    variantsToRemove.forEach(function(variant) {
      var index = self.flaggedVariants.indexOf(variant);
      variant.filtersPassed = [];
      if (index !== -1) {
        self.flaggedVariants.splice(index, 1);
      }
    })
  }


  _organizeVariantsForFilter(filterName, userFlagged, isFullAnalysis, interpretationFilters, options, variant) {
    let self = this;
    let geneMap        = {};
    let flaggedGenes   = [];

    if (this.flaggedVariants) {
      if(variant) {
        let isUnique = true;
        for(let i = 0; i < this.flaggedVariants.length; i++){
          if((this.launchedFromClin || (!this.launchedFromClin && !variant.variant_id)) && this.flaggedVariants[i].start === variant.start && this.flaggedVariants[i].end === variant.end && this.flaggedVariants[i].ref === variant.ref && this.flaggedVariants[i].alt === variant.alt){
            this.flaggedVariants[i] = variant;
            isUnique = false;
          }
        }
        if(isUnique && variant.isUserFlagged && variant.start && variant.end && variant.ref && variant.alt){
          this.flaggedVariants.push(variant);
        }
      }


      this.flaggedVariants.forEach(function(variant) {
        let isReviewed = (variant.notes && variant.notes.length > 0) ||
            (variant.interpretation != null && variant.interpretation != "not-reviewed");


        let matches = false;
        if (filterName == 'reviewed' && isReviewed) {
          matches = true;
        } else if ((userFlagged && variant.isUserFlagged) ||
          (filterName && variant.filtersPassed && variant.filtersPassed.indexOf(filterName) >= 0)) {
          if (!isReviewed) {
            matches = true;
          }
        }

        if (matches) {

          let keepVariant = interpretationFilters && interpretationFilters.length > 0 ? interpretationFilters.indexOf(variant.interpretation ? variant.interpretation : 'not-reviewed') >= 0 : true;

          let flaggedGene = geneMap[variant.gene.gene_name];

          let keepGene = self.geneModel.isCandidateGene(variant.gene.gene_name);


          if (keepGene && keepVariant) {
            if (flaggedGene == null) {
              flaggedGene = {};
              flaggedGene.gene = variant.gene;
              flaggedGene.transcript = variant.transcript;
              flaggedGene.variants = [];
              geneMap[variant.gene.gene_name] = flaggedGene;
              flaggedGenes.push(flaggedGene);
            }

            flaggedGene.variants.push(variant);

          }
        }
      })

      var sortedGenes = self.sortGenesByVariants(flaggedGenes)
      let i = 0;
      sortedGenes.forEach(function(flaggedGene) {
        // Sort the variants according to the Ranked Variants table features
        self.featureMatrixModel.setFeaturesForVariants(flaggedGene.variants);
        let sortedVariants = self.sortVariants(flaggedGene.variants)

        sortedVariants.forEach(function(variant) {
          variant.index = i;
          i++;
        })
        flaggedGene.variants = sortedVariants;
      });
      return sortedGenes;

    } else {
      return [];
    }

  }

  sortGenesByVariants(theGenes) {
    let self = this;
    let theVariants = [];
    theGenes.forEach(function(flaggedGene) {
      let variantsForGene = flaggedGene.variants;
      variantsForGene.forEach(function(variant) {
        theVariants.push(variant);
      })
    })
    let sortedVariants = self.sortVariants(theVariants);

    let i = 0;
    sortedVariants.forEach(function(variant) {
      variant.sortIndex = i;
      i++;
    })
    theGenes.forEach(function(flaggedGene) {
      let variantsForGene = flaggedGene.variants;
      flaggedGene.sortIndex = variantsForGene[0].sortIndex;
    })
    return theGenes.sort(function(a,b) {
      return a.sortIndex - b.sortIndex;
    })


  }

  sortVariants(theVariants) {
    let self = this;
    return theVariants.sort(function (a, b) {
      var featuresA = "";
      var featuresB = "";


      var clinvarA = self.featureMatrixModel.getClinvarRank(a, a.clinvarClinSig)
      var clinvarB = self.featureMatrixModel.getClinvarRank(b, b.clinvarClinSig)

      var impactA = self.featureMatrixModel.getImpactRank(a, a.vepImpact)
      var impactB = self.featureMatrixModel.getImpactRank(b, b.vepImpact)

      var inheritanceA = a.inheritance ? (a.inheritance.indexOf('n/a') == -1 ? 1 : 0) : 0;
      var inheritanceB = b.inheritance ? (b.inheritance.indexOf('n/a') == -1 ? 1 : 0) : 0;

      var afA = a.isImported ? +a.afgnomAD : (a.afHighest ? +a.afHighest : 99);
      var afB = a.isImported ? +a.afgnomAD : (b.afHighest ? +b.afHighest : 99);

      if (clinvarA == clinvarB) {
        if (impactA == impactB) {
          if (inheritanceA == inheritanceB) {
            return afA - afB;
          } else {
            return b.start - a.start;
          }
        } else {
          return impactA - impactB;
        }
      } else {
        return clinvarA - clinvarB;
      }
    })
  }

  captureFlaggedVariants(dangerSummary, geneObject) {
    let self = this;
    if (self.flaggedVariants == null) {
      self.flaggedVariants = [];
    }

    if (dangerSummary) {
      for (var filterName in self.filterModel.flagCriteria) {
        if (dangerSummary.badges[filterName]) {
          let theFlaggedVariants = dangerSummary.badges[filterName];

          // Add variants in danger summary (if not already present)
          // to flagged variants
          theFlaggedVariants.forEach(function(variant) {
            if (variant) {
              if (variant.interpretation && variant.interpretation == 'unknown-sig') {
                variant.interpretation = 'uncertain-sig'
              }
              let matchingVariant = self.getFlaggedVariant(variant);
              if (matchingVariant) {
                // Keep track of the mosaic_id. If we launched from Mosaic with a
                // variant set, the mosaic_id will be filled in on the flagged (imported)
                // variant. If we are launching from a Mosaic analysis, the mosaic_id
                // will be filled in on the dangerSummary.badges variant.
                if (matchingVariant.mosaic_id && !variant.mosaic_id) {
                  variant.mosaic_id = matchingVariant.mosaic_id;
                } else if (!matchingVariant.mosaic_id && variant.mosaic_id) {
                  matchingVariant.mosaic_id = variant.mosaic_id;
                }
              } else {
                variant.gene = geneObject
                self.flaggedVariants.push(variant);
              }              
            }
          })

        }
      }
    }
  }

  getTrioAlignmentSampleNames() {
    let self = this;
    let sampleNames = [];

    let rels = self.mode == 'trio' ? ['proband', 'mother', 'father'] : ['proband'];
    rels.forEach(function(rel) {
      let sampleName = self.sampleMap[rel].model.getSampleName();
      sampleNames.push(sampleName);
    })

    return sampleNames;
  }
}

export default CohortModel;
