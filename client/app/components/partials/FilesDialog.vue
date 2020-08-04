
<style lang="sass">
@import ../../../assets/sass/variables




#files-form
  padding-left: 40px
  padding-right: 20px

  .input-group.radio
    margin-top: 0px
    margin-bottom: 0px

  .v-radio
    padding-right: 0px
    margin-bottom: 0px

  .radio label,
  .v-radio label
    line-height: 25px
    padding-top: 3px
    font-size: 13px
    margin: 0px

  .input-group.radio-group
    padding-top: 0px

  .v-input--radio-group
    padding-top: 0px
    margin-top: 0px

  .input-group__selections__comma, .v-select__selection--comma
    font-size: 13px

  .input-group.input-group--selection-controls.switch,
  .v-input--selection-controls.v-input--switch,
    label
      font-weight: normal
      font-size: 13px
      padding-left: 5px

  .radio-group
    padding-top: 0px
    .input-group__input
      min-height: 25px

  .loader
    display: inline-block
    margin-right: 2px

    img
      width: 20px
      height: 20px

  .sample-label
    span
      margin-top: 2px
      margin-bottom: 2px
      vertical-align: top
      margin-left: 0px
      font-size: 15px
      color: $app-color
      display: inline-block
      margin-right: 20px
    .switch
      display: inline-block
      width: 100px

  button

    height: 24px !important;
    min-width: 100px;

    &.action-button

      height: 30px !important
      min-width: 77px
      color: $app-button-color

      &.cancer-button
        color: $text-color

    &.load-button
      padding: 0px
      height: 30px !important
      background-color: $app-button-color !important
      color: white !important
      min-width: 100px !important
      margin: 0px

      &.disabled
        opacity: 0.20 !important

      &.v-btn--disabled
        opacity: 0.20 !important


  .v-text-field__slot,
  .v-select__slot
    input
      font-size: 12px
      color: $text-color

  .sample-label
    .v-input--switch
      margin-bottom: 10px
      margin-top: 0px

</style>

<template>
   <v-dialog v-model="showFilesDialog" persistent max-width="890" >
      <v-card class="full-width" style="min-height:0px;max-height:670px;overflow-y:scroll">



          <v-form id="files-form">

            <v-layout row nowrap class="mt-0">
             <v-card-title class="headline">Files</v-card-title>

              <v-flex xs12 class="mt-2 text-xs-right">
                <div class="loader" v-show="inProgress">
                  <img src="../../../assets/images/wheel.gif">
                </div>
                <v-btn class="load-button action-button"
                  @click="onLoad"
                  :disabled="!isValid">
                  Load
                </v-btn>

                <v-btn class="cancer-button action-button" @click="onCancel">
                 Cancel
               </v-btn>
              </v-flex>
            </v-layout>


            <v-layout row nowrap class="mt-0">

              <v-flex class="mt-0" style="max-width: 90px;margin-right: 10px;" >
                  <v-radio-group v-model="mode" @change="onModeChanged"  hide-details column>
                        <v-radio label="Single"  value="single"></v-radio>
                        <v-radio label="Trio"    value="trio"></v-radio>
                  </v-radio-group>
              </v-flex>

              <v-flex style="width:90px;margin-right:10px" class="mt-2" >
                  <v-switch  label="Separate URL for index" hide-details v-model="separateUrlForIndex">
                  </v-switch>
              </v-flex>


              <v-flex style="max-width:160px" >
                <v-select
                  label="Species"
                  hide-details
                  v-model="speciesName"
                  :items="speciesList"
                ></v-select>
              </v-flex>

              <v-flex style="max-width:160px" class="ml-2">
                <v-select
                  label="Genome Build"
                  hide-details
                  v-model="buildName"
                  :items="buildList"
                ></v-select>
               </v-flex>

              <v-flex style="max-width:160px" class="ml-2">
                  <v-select
                    :items="demoActions"
                    item-value="value"
                    item-text="display"
                    @input="onLoadDemoData"
                    v-model="demoAction"
                    hide-details
                    label="Demo data"></v-select>
              </v-flex>

            </v-layout>


            <v-layout row wrap class="mt-3">



               <v-flex xs12
                 v-for="rel in rels[mode]"
                    :key="rel"
                    :id="rel"
                    v-if="modelInfoMap && modelInfoMap[rel] && Object.keys(modelInfoMap[rel]).length > 0">

                  <sample-data
                   ref="sampleDataRef"
                   v-if="modelInfoMap && modelInfoMap[rel] && Object.keys(modelInfoMap[rel]).length > 0"
                   :modelInfo="modelInfoMap[rel]"
                   :separateUrlForIndex="separateUrlForIndex"
                   @sample-data-changed="validate"
                   @samples-available="onSamplesAvailable"
                  >
                </sample-data>
               </v-flex>

            </v-layout >

            <v-layout row nowrap class="mt-2">

               <v-flex  class="sample-label mt-3 pl-2 pr-3" >
                <span v-if="probandSamples && probandSamples.length > 0"
                 dark small >
                  siblings
                </span>
               </v-flex>

               <v-flex  class=" pl-2 pr-3" >
                 <v-autocomplete
                  v-if="probandSamples && probandSamples.length > 0"
                  v-bind:class="probandSamples == null || probandSamples.length == 0 ? 'hide' : ''"
                  label="Affected Siblings"
                  multiple
                  v-model="affectedSibs"
                  :items="probandSamples"
                  hide-details
                  >
                </v-autocomplete>
               </v-flex>

               <v-flex   class="pr-2">
                 <v-autocomplete
                  v-if="probandSamples && probandSamples.length > 0"
                  v-bind:class="probandSamples == null || probandSamples.length == 0 ? 'hide' : ''"
                  label="Unaffected Siblings"
                  multiple
                  v-model="unaffectedSibs"
                  :items="probandSamples"
                  hide-details
                  >
                </v-autocomplete>
               </v-flex>
            </v-layout>

          </v-form>
      </v-card>
  </v-dialog>
</template>

<script>

import SampleData          from '../partials/SampleData.vue'


export default {
  name: 'files-dialog',
  components: {
    SampleData
  },
  props: {
    cohortModel: null,
    showDialog: null
  },
  data () {
    return {
      showFilesDialog: false,
      isValid: false,
      mode: 'single',
      speciesList: [],
      speciesName: null,
      buildName: null,
      activeTab: null,
      modelInfoMap: {
        proband: {},
        mother: {},
        father: {}
      },
      rels: {
        single: ['proband'],
        trio: ['proband', 'mother', 'father']
      },
      demoActions: [
        {'display': 'Demo WES trio', 'value': 'exome'},
        {'display': 'Demo WGS trio', 'value': 'genome'}
      ],
      demoAction: null,
      separateUrlForIndex: false,
      probandSamples: null,
      affectedSibs: null,
      unaffectedSibs: null,
      inProgress: false
    }
  },
  watch: {
    showDialog: function() {
      if (this.cohortModel && this.showDialog) {
        this.showFilesDialog = true
        this.mode = this.cohortModel.mode;
        this.init();
      }
    },
    showFilesDialog: function() {
      if (!this.showFilesDialog) {
        this.$emit("on-cancel");
      }
    }
  },
  methods: {
    onLoad: function() {
      let self = this;
      self.inProgress = true;

      self.cohortModel.mode = self.mode;
      self.cohortModel.genomeBuildHelper.setCurrentBuild(self.buildName);
      self.cohortModel.genomeBuildHelper.setCurrentSpecies(self.speciesName);

      let sms = self.cohortModel.sampleModels;
      let areAnyDuplicates = false;
      let dupId = null;
      sms.map(function(obj) {
        return obj.name;
      }).forEach(function (element, index, arr) {
        if (arr.indexOf(element) !== index) {
          console.log("dup id found for element", element);
          dupId = element;
          areAnyDuplicates = true;
        }
      });

      self.cohortModel.promiseAddClinvarSample()
      .then(function() {
        return  self.cohortModel.promiseSetSibs(self.affectedSibs, self.unaffectedSibs)
      })
      .then(function() {
        self.cohortModel.setAffectedInfo(true);
        self.cohortModel.isLoaded = true;
        self.cohortModel.getCanonicalModels().forEach(function(model) {
          if (model.name == null || model.name.length == 0) {
            model.name = model.relationship;
          }
        })
        self.cohortModel.sortSampleModels();

      })
      .then(function() {
        let performAnalyzeAll = self.demoAction ? true : false;
        self.inProgress = false;

        self.$emit("on-files-loaded", performAnalyzeAll);
        self.showFilesDialog = false;
      })
    },
    onCancel:  function() {
      let self = this;
      self.$emit("on-cancel");
      self.showFilesDialog = false;
    },
    onModeChanged: function() {
      if (this.mode == 'trio' && this.cohortModel.getCanonicalModels().length < 3 ) {
        this.promiseInitMotherFather();
      } else if (this.mode == 'single' && this.cohortModel.getCanonicalModels().length > 1) {
        this.removeMotherFather();
      }

      this.validate();
    },
    onLoadDemoData: function() {
      let self = this;
      this.$emit('isDemo', true);

      if (self.mode == 'single') {
        self.mode = 'trio';
      }

      var p = null;
      if (self.cohortModel.getCanonicalModels().length < 3 ) {
        p = self.promiseInitMotherFather();
      } else {
        p = Promise.resolve();
      }
      p.then(function() {
        self.cohortModel.demoModelInfos[self.demoAction].forEach(function(modelInfo) {
          var rel = modelInfo.relationship;
          self.modelInfoMap[rel] = modelInfo;
        })
        self.cohortModel.getCanonicalModels().forEach(function(model) {
          self.promiseSetModel(model);
        })
      })
    },
    promiseSetModel: function(model) {
      let self = this;
      return new Promise(function(resolve, reject) {
        var theModel = model;
        var theModelInfo = self.modelInfoMap[theModel.relationship];
        theModelInfo.model = theModel;
        theModel.onVcfUrlEntered(theModelInfo.vcf, null, function(success, sampleNames) {
          if (success) {
            theModelInfo.samples = sampleNames;
            if (theModel.relationship == 'proband') {
              self.probandSamples = sampleNames;
            }
            self.$refs.sampleDataRef.forEach(function(ref) {
              if (ref.modelInfo.relationship == theModel.relationship) {
                theModel.sampleName = theModelInfo.sample;
                ref.updateSamples(sampleNames, theModelInfo.sample);
                theModel.name = theModel.sampleName;
                self.validate();
              }
            })
            theModel.onBamUrlEntered(theModelInfo.bam, null, function(success) {
              self.validate();
              if (success) {
                resolve();
              } else {
                reject();
              }
            })
          } else {
            reject();
          }
        })
      })
    },
    validate: function() {
      this.isValid = false;
      if (this.mode == 'single') {
        if (this.modelInfoMap.proband && this.modelInfoMap.proband.model.isReadyToLoad()) {
          this.isValid = true;
        }
      } else {
        if (this.modelInfoMap.proband && this.modelInfoMap.proband.model && this.modelInfoMap.proband.model.isReadyToLoad()
            && this.modelInfoMap.mother && this.modelInfoMap.mother.model && this.modelInfoMap.mother.model.isReadyToLoad()
            && this.modelInfoMap.father && this.modelInfoMap.father.model && this.modelInfoMap.father.model.isReadyToLoad()) {
          this.isValid = true;
        }
      }
    },
    onSamplesAvailable: function(relationship, samples) {
      if (relationship == 'proband') {
        this.probandSamples = samples;
        if (this.cohortModel.sampleMapSibs.affected && this.cohortModel.sampleMapSibs.affected.length > 0) {
          this.affectedSibs = this.cohortModel.sampleMapSibs.affected.map(function(sampleModel) {
            return sampleModel.sampleName;
          })
        }
        if (this.cohortModel.sampleMapSibs.unaffected && this.cohortModel.sampleMapSibs.unaffected.length > 0) {
          this.unaffectedSibs = this.cohortModel.sampleMapSibs.unaffected.map(function(sampleModel) {
            return sampleModel.sampleName;
          })
        }
      }
      if (samples && samples.length > 0 && this.getModel(relationship)) {
        this.getModel(relationship).samples = samples;
      }
    },
    getModel: function(relationship) {
      var theModel = null;
      if (this.cohortModel) {
        var modelObject = this.cohortModel.sampleMap[relationship];
        if (modelObject) {
          theModel = modelObject.model;
        }
      }
      return theModel;
    },
    init: function() {
      let self = this;
      self.modelInfoMap = {};
      if (self.cohortModel && self.cohortModel.getCanonicalModels().length > 0) {
        self.initModelInfo();
      } else {
        var modelInfo = {};
        modelInfo.relationship = 'proband';
        modelInfo.vcf = null;
        modelInfo.bam = null;
        modelInfo.affectedStatus = 'affected'
        self.cohortModel.promiseAddSample(modelInfo)
        .then(function() {
          self.initModelInfo();
        })
      }
    },
    initModelInfo: function() {
      let self = this;
      self.separateUrlForIndex = false;
      self.cohortModel.getCanonicalModels().forEach(function(model) {
        var modelInfo = self.modelInfoMap[model.relationship];
        if (modelInfo == null) {
          modelInfo = {};
          modelInfo.relationship = model.relationship;
          modelInfo.sex          = model.sex ? model.sex : null;
          modelInfo.vcf          = model.vcf ? model.vcf.getVcfURL() : null;
          modelInfo.tbi          = model.vcf ? model.vcf.getTbiURL() : null;
          modelInfo.bam          = model.bam ? model.bam.bamUri : null;
          modelInfo.bai          = model.bam ? model.bam.baiUri : null;
          modelInfo.sample       = model.getSampleName();
          modelInfo.name         = model.getName();
          modelInfo.samples      = model.sampleNames;
          modelInfo.isAffected   = model.isAffected();
          modelInfo.model        = model;
          if (modelInfo.tbi || modelInfo.bai) {
            self.separateUrlForIndex = true;
          }
          self.$set(self.modelInfoMap, model.relationship, modelInfo);
        }
      })
    },
    promiseInitMotherFather: function() {
      let self = this;

      return new Promise(function(resolve, reject) {
        var modelInfoMother = {};
        modelInfoMother.relationship = 'mother';
        modelInfoMother.sex = "female";
        modelInfoMother.vcf = null;
        modelInfoMother.bam = null;
        modelInfoMother.affectedStatus = 'unaffected'
        self.cohortModel.promiseAddSample(modelInfoMother)
        .then(function() {
          var modelInfoFather = {};
          modelInfoFather.relationship = 'father';
          modelInfoFather.sex = "male"
          modelInfoFather.vcf = null;
          modelInfoFather.bam = null;
          modelInfoFather.affectedStatus = 'unaffected'

            self.cohortModel.promiseAddSample(modelInfoFather)
            .then(function() {

              self.initModelInfo();
              resolve();

            })
            .catch(function(error) {
              reject(error);
            })
        })
        .catch(function(error) {
          reject(error);
        })

      })
    },
    removeMotherFather: function() {
      let self = this;
      delete self.modelInfoMap.mother;
      delete self.modelInfoMap.father;
      self.cohortModel.removeSample("mother");
      self.cohortModel.removeSample("father");
    }
  },
  computed: {
    buildList: function() {
      if (this.speciesName && this.cohortModel.genomeBuildHelper) {
        return this.cohortModel.genomeBuildHelper.speciesToBuilds[this.speciesName].map(function(gb) {
          return gb.name;
        })
      } else {
        return [];
      }
    }
  },
  created: function() {
    let self = this;

  },
  mounted: function() {
    if (this.cohortModel) {
      this.speciesName =  this.cohortModel.genomeBuildHelper.getCurrentSpeciesName();
      this.buildName   =  this.cohortModel.genomeBuildHelper.getCurrentBuildName();
      this.speciesList =  this.cohortModel.genomeBuildHelper.speciesList.map(function(sp) {
        return sp.name;
      }).filter(function(name) {
        return name == 'Human';
      });
    }



  }
}
</script>
