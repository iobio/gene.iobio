
<style lang="sass">

.menuable__content__active
  >form
    margin-left: 30px
    margin-right: 30px
    max-width: 660px
    font-size: 12px !important

  .radio label
    line-height: 25px

  .input-group.v-radio-group
    padding-top: 0px

  .input-group__selections__comma
    font-size: 13px


</style>

<template>
  <v-menu
  id="files-menu"
  offset-y
  :close-on-content-click="false"
  :nudge-width="500"
  v-model="showFilesMenu"
  >

    <v-btn flat slot="activator">
     <v-icon>input</v-icon>
     Files
    </v-btn>


    <v-form id="files-form">

      <v-layout row wrap class="mt-2">

        <v-flex xs3 class="px-2" >
            <v-radio-group v-model="mode" @change="onModeChanged"  hide-details row>
                  <v-radio label="Single"  value="single"></v-radio>
                  <v-radio label="Trio"    value="trio"></v-radio>
            </v-radio-group>
        </v-flex>


        <v-flex xs3 class="px-2">
          <v-select
            label="Species"
            hide-details
            v-model="speciesName"
            :items="speciesList"
          ></v-select>
        </v-flex>

        <v-flex xs3 class="px-2">
          <v-select
            label="Genome Build"
            hide-details
            v-model="buildName"
            :items="buildList"
          ></v-select>
         </v-flex>

        <v-flex xs3 sm3>
            <v-select
              :items="demoActions"
              item-value="value"
              item-text="display"
              @input="onLoadDemoData"
              v-model="demoAction"
              overflow
              label="Demo data"></v-select>
        </v-flex>


         <v-flex xs12 class="pt-2"
           v-for="rel in rels[mode]"
              :key="rel"
              :id="rel"
              v-if="modelInfoMap && modelInfoMap[rel] && Object.keys(modelInfoMap[rel]).length > 0">

            <sample-data
             ref="sampleDataRef"
             v-if="modelInfoMap && modelInfoMap[rel] && Object.keys(modelInfoMap[rel]).length > 0"
             :modelInfo="modelInfoMap[rel]"
             @sample-data-changed="validate"
            >
          </sample-data>
         </v-flex>



        <v-flex xs12 class="mt-4 text-xs-right">
          <v-btn
            @click="onLoad"
            :disabled="!isValid">
            Load
          </v-btn>

          <v-btn @click="onCancel">
           Cancel
         </v-btn>
        </v-flex>
      </v-layout>

    </v-form>

  </v-menu>
</template>

<script>

import SampleData          from '../partials/SampleData.vue'


export default {
  name: 'files-menu',
  components: {
    SampleData
  },
  props: {
    cohortModel: null
  },
  data () {
    return {
      showFilesMenu: false,
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
      demoAction: null
    }
  },
  watch: {
    showFilesMenu: function() {
      if (this.cohortModel && this.showFilesMenu) {
        this.mode = this.cohortModel.mode;
        this.init();
      }
    }
  },
  methods: {
    onLoad: function() {
      let self = this;
      if (self.demoAction) {
        self.cohortModel.geneModel.copyPasteGenes(self.cohortModel.demoGenes.join(", "));
      }

      this.cohortModel.mode = this.mode;
      self.cohortModel.genomeBuildHelper.setCurrentBuild(self.buildName);
      self.cohortModel.genomeBuildHelper.setCurrentSpecies(self.speciesName);
      self.cohortModel.promiseAddClinvarSample();
      self.cohortModel.setAffectedInfo();
      self.cohortModel.isLoaded = true;
      self.$emit("on-files-loaded");
      self.showFilesMenu = false;
    },
    onCancel:  function() {
      this.showFilesMenu = false;
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
            self.$refs.sampleDataRef.forEach(function(ref) {
              if (ref.modelInfo.relationship == theModel.relationship) {
                theModel.sampleName = theModelInfo.sample;
                ref.updateSamples(sampleNames, theModelInfo.sample);
                theModel.name = theModel.relationship + " " + theModel.sampleName;
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
      self.cohortModel.getCanonicalModels().forEach(function(model) {
        var modelInfo = self.modelInfoMap[model.relationship];
        if (modelInfo == null) {
          modelInfo = {};
          modelInfo.relationship = model.relationship;
          modelInfo.vcf          = model.vcf ? model.vcf.getVcfURL() : null;
          modelInfo.bam          = model.bam ? model.bam.bamUri : null;
          modelInfo.sample       = model.getSampleName();
          modelInfo.name         = model.getName();
          modelInfo.samples      = model.sampleNames;
          modelInfo.isAffected   = model.isAffected();
          modelInfo.model        = model;
          self.$set(self.modelInfoMap, model.relationship, modelInfo);
        }
      })
    },
    promiseInitMotherFather: function() {
      let self = this;

      return new Promise(function(resolve, reject) {
        var modelInfoMother = {};
        modelInfoMother.relationship = 'mother';
        modelInfoMother.vcf = null;
        modelInfoMother.bam = null;
        modelInfoMother.affectedStatus = 'unaffected'
        self.cohortModel.promiseAddSample(modelInfoMother)
        .then(function() {
          var modelInfoFather = {};
          modelInfoFather.relationship = 'father';
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
    this.speciesName =  this.cohortModel.genomeBuildHelper.getCurrentSpeciesName();
    this.buildName   =  this.cohortModel.genomeBuildHelper.getCurrentBuildName();
    this.speciesList =  this.cohortModel.genomeBuildHelper.speciesList.map(function(sp) {
      return sp.name;
    });


  },
  mounted: function() {


  }
}
</script>
