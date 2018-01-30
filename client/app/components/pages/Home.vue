/*
 * Home.vue
 *
 */
<style lang="sass">

  .app-card
    margin-bottom: 10px

  #data-sources-loader
    margin-top: 20px
    margin-left: auto
    margin-right: auto
    text-align: center

</style>



<template>

  <div>


    <navigation
      @input="onGeneSelected"
      @navLoadDemoData="onLoadDemoData"
    >
    </navigation>
    <v-content>
      <v-container fluid>
        <gene-card
          v-bind:class="{ hide: Object.keys(selectedGene).length == 0 }"
          :selectedGene="selectedGene"
          :selectedTranscript="selectedTranscript"
          @transcript-selected="onTranscriptSelected"
          @gene-source-selected="onGeneSourceSelected"
          @gene-region-buffer-change="onGeneRegionBufferChange"
          @gene-region-zoom="onGeneRegionZoom"
          @gene-region-zoom-reset="onGeneRegionZoomReset"
          >
        </gene-card>


        <div
        id="data-sources-loader"
        class="loader"
        v-bind:class="{ hide: !cohortModel ||  !cohortModel.inProgress.loadingDataSources }">
          <span class="loader-label">Loading files</span>
          <img src="../../../assets/images/wheel.gif">
        </div>

        <variant-card
        ref="variantCardRef"
        v-for="model in models"
        v-bind:class="{ hide: Object.keys(selectedGene).length == 0 || !cohortModel  || cohortModel.inProgress.loadingDataSources }"
        :name="model.name"
        :relationship="model.relationship"
        :affectedInfo="cohortModel.affectedInfo"
        :cohortMode="cohortModel.mode"
        :maxAlleleCount="cohortModel.maxAlleleCount"
        :width="cardWidth"
        :key="model.relationship"
        :selectedGene="selectedGene"
        :selectedTranscript="selectedTranscript"
        :regionStart="geneRegionStart"
        :regionEnd="geneRegionEnd"
        :loadedVariants="model.loadedVariants"
        :coverage="model.coverage"
        :maxDepth="maxDepth"
        :inProgress="cohortModel.inProgress"
        :showGeneViz="model.relationship == 'proband' || model.relationship == 'known-variants'"
        :showDepthViz="model.relationship != 'known-variants'"
        :showVariantViz="model.relationship != 'known-variants' || showClinvarVariants"
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
      models: [],
      geneModel: null,
      filterModel: null,


      cardWidth: 0,

      showClinvarVariants: false
    }
  },

  created: function() {

  },

  mounted: function() {
    let self = this;

    self.cardWidth = self.$el.offsetWidth;

    global.bus.$on('cohortVariantHover', function (variant) {
      self.$refs.variantCardRef.forEach(function(variantCard) {
        variantCard.onVariantHover(variant);
      })
    })

    global.bus.$on('cohortVariantHoverEnd', function (variant) {
      self.$refs.variantCardRef.forEach(function(variantCard) {
        variantCard.onVariantHoverEnd();
      })
    })

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

    })
    .then(function() {
      self.models = self.cohortModel.sampleModels;
      self.filterModel = new FilterModel(self.cohortModel.affectedInfo);
    },
    function(error) {

    })
  },

  computed: {
    maxDepth: function() {
      if (this.cohortModel && this.cohortModel.maxDepth) {
        return this.cohortModel.maxDepth;
      } else {
        return 0;
      }
    }
  },

  watch: {
  },

  methods: {


    promiseInitCache: function() {
      return new Promise(function(resolve, reject) {
        cacheHelper.promiseInit()
         .then(function() {
          cacheHelper.isolateSession();
          resolve();
         })
         .catch(function(error) {
          var msg = "A problem occurred in promiseInitCache(): " + error;
          console.log(msg);
          reject(msg);
         })
      })
    },

    promiseClearCache: function() {
       return cacheHelper._promiseClearCache(cacheHelper.launchTimestampToClear);
    },

    onLoadDemoData: function() {
      let self = this;
      self.cohortModel.promiseInitDemo()
      .then(function() {
        self.models = self.cohortModel.sampleModels;
        if (self.selectedGene) {
          self.promiseLoadData();
        }
      })
    },

    promiseLoadData: function() {
      let self = this;


      return new Promise(function(resolve, reject) {
        self.cohortModel.promiseLoadData(self.selectedGene,
          self.selectedTranscript,
          self.filterModel,
          {getKnownVariants: self.showClinvarVariants})
        .then(function(resultMap) {
            self.filterModel.populateEffectFilters(resultMap);
            self.filterModel.populateRecFilters(resultMap);
            //var bp = me._promiseDetermineVariantBookmarks(vcfData, theGene, theTranscript);
            //bookmarkPromises.push(bp);
            resolve();
        })
        .catch(function(error) {
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
        self.geneRegionStart = theGeneObject.start;
        self.geneRegionEnd   = theGeneObject.end;
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
      let self = this;
      self.geneRegionBuffer = theGeneRegionBuffer;
      // We have to clear the cache since the gene regions change
      self.promiseClearCache()
      .then(function() {
        self.onGeneSelected(self.selectedGene);
      })
    },
    onGeneRegionZoom: function(theStart, theEnd) {
      this.geneRegionStart = theStart;
      this.geneRegionEnd = theEnd;
      this.cohortModel.setLoadedVariants(this.selectedGene, this.geneRegionStart, this.geneRegionEnd);
      this.cohortModel.setCoverage(this.geneRegionStart, this.geneRegionEnd);
    },
    onGeneRegionZoomReset: function() {
      this.geneRegionStart = this.selectedGene.start;
      this.geneRegionEnd = this.selectedGene.end;
      this.cohortModel.setLoadedVariants(this.selectedGene);
      this.cohortModel.setCoverage();
    }

  }
}
</script>
