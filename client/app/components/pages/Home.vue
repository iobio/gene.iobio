/*
 * Home.vue
 *
 */
<style lang="sass">

  .app-card
    margin-bottom: 10px
</style>



<template>

  <div>
    <navigation v-on:input="onGeneSelected"></navigation>
    <v-content>
      <v-container fluid>
        <gene-card
          v-bind:selectedGene="selectedGene"
          v-bind:selectedTranscript="selectedTranscript"
          v-on:transcript-selected="onTranscriptSelected"
          v-on:gene-source-selected="onGeneSourceSelected"
          v-on:gene-region-buffer-change="onGeneRegionBufferChange"
          v-on:gene-region-zoom="onGeneRegionZoom"
          v-on:gene-region-zoom-reset="onGeneRegionZoomReset"
          >
        </gene-card>

        <variant-card v-for="model in cohortModels"
        v-bind:name="model.name"
        >
        </variant-card>

      </v-container>
    </v-content>
  </div>

</template>


<script>

import Navigation from '../partials/Navigation.vue'
import GeneCard  from  '../viz/GeneCard.vue'
import VariantCard    from  '../viz/VariantCard.vue'

import CohortModel    from  '../../models/CohortModel.js'
import FilterModel    from  '../../models/FilterModel.js'
import GeneModel      from  '../../models/GeneModel.js'


export default {
  name: 'home',
  components: {
      Navigation,
      GeneCard,
      VariantCard
  },
  props: [],
  data() {
    return {
      greeting: 'gene.iobio.vue',
      selectedGene: {},
      selectedTranscript: {},
      geneRegionBuffer: 1000,
      geneRegionStart: null,
      geneRegionEnd: null,


      cohortModel: null,
      geneModel: null,
      filterModel: null
    }
  },

  created: function() {

  },

  mounted: function() {
    let self = this;


    genomeBuildHelper.promiseInit({DEFAULT_BUILD: 'GRCh37'})
    .then(function() {
      return self.promiseInitCache();
    })
    .then(function() {
      return cacheHelper.promiseClearStaleCache();
    })
    .then(function() {
      // Instantiate helper class than encapsulates IOBIO commands
      endpoint = new EndpointCmd(useSSL, IOBIO, cacheHelper.launchTimestamp, genomeBuildHelper, utility.getHumanRefNames);

    })
    .then(function() {
      self.geneModel = new GeneModel();
      self.geneModel.geneSource = siteGeneSource;

      self.cohortModel = new CohortModel(self.geneModel);
      return self.cohortModel.promiseInitDemo();
    })
    .then(function() {
      self.filterModel = new FilterModel(self.cohortModel.affectedInfo);
    },
    function(error) {

    })
  },

  computed: {
    cohortModels: function() {
      return this.cohortModel ? this.cohortModel.getModels() : [];
    }
  },

  methods: {


    promiseInitCache: function() {
      return new Promise(function(resolve, reject) {
        cacheHelper.promiseInit()
         .then(function() {
          cacheHelper.isolateSession();
          resolve();
         },
         function(error) {
          var msg = "A problem occurred in promiseInitCache(): " + error;
          console.log(msg);
          reject(msg);
         })
      })
    },

    promiseLoadData: function() {
      let self = this;
      console.log("Loading data"  + self.geneModel);

      return new Promise(function(resolve, reject) {
        self.cohortModel.promiseLoadData(self.selectedGene, self.selectedTranscript, false, self.filterModel)
        .then(function(resultMap) {
            self.filterModel.populateEffectFilters(resultMap);
            self.filterModel.populateRecFilters(resultMap);
            //var bp = me._promiseDetermineVariantBookmarks(vcfData, theGene, theTranscript);
            //bookmarkPromises.push(bp);
            resolve();
        },
        function(error) {
          reject(error);
        })

      })
    },

    onGeneSelected: function(geneObject) {
      var self = this;


      self.geneModel.addGeneName(geneObject.gene_name);
      self.geneModel.promiseGetGeneObject(geneObject.gene_name)
      .then(function(theGeneObject) {
        self.geneModel.adjustGeneRegion(theGeneObject, parseInt(self.geneRegionBuffer));
        self.selectedGene = theGeneObject;
        self.selectedTranscript = self.geneModel.getCanonicalTranscript(self.selectedGene);
        self.promiseLoadData()
        .then(function() {

        })
      })
    },
    onTranscriptSelected: function(transcript) {
      var self = this;
      self.selectedTranscript = transcript;
    },
    onGeneSourceSelected: function(theGeneSource) {
      var self = this;
      self.geneModel.geneSource = theGeneSource;
      this.onGeneSelected(this.selectedGene);
    },
    onGeneRegionBufferChange: function(theGeneRegionBuffer) {
      this.geneRegionBuffer = theGeneRegionBuffer;
      this.onGeneSelected(this.selectedGene);
    },
    onGeneRegionZoom: function(theStart, theEnd) {
      this.geneRegionStart = theStart;
      this.geneRegionEnd = theEnd;
      console.log("gene region zoom = " + this.geneRegionStart + '-' + this.geneRegionEnd);
    },
    onGeneRegionZoomReset: function() {
      this.geneRegionStart = null;
      this.geneRegionEnd = null;
       console.log("gene region zoom reset");
    }

  }
}
</script>
