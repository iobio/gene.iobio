<style lang="sass" >

@import ../../../assets/sass/variables

#hpo-disease-table
  min-width: 450px
  .title-row
    display: flex
    height: 25px

    .table-title
      color: $app-color
    .count
      display: inline-block
      font-size: 12px
      margin-left: 10px
      padding-top: 1px


  .hpo-row
    font-size: 12px
    padding-bottom: 5px
    >span
      display: inline-block
      vertical-align: top
      line-height: 15px
    
    .hpo-launch
      min-width: 90px
      max-width: 90px
      a 
        color: $link-color
        font-weight: 500
    .hpo-name
      min-width: 300px
      max-width: 300px
   
</style>



<template>

  <div id="hpo-disease-table">
    <div class="title-row">
      <div class="table-title">Gene:Disease Associations</div>
    </div>
    <div  style="max-height:108px;min-height:108px;overflow-y:scroll;padding-top:5px">
      <div class="hpo-row" v-for="entry in hpoEntries" :key="entry.diseaseId">
          <span class="hpo-launch" >
            <a :href="getEntryHref(entry.diseaseId)" target="_hpo">
              {{ entry.diseaseId }}
            </a>
          </span>
          <span class="hpo-name" >{{ entry.diseaseName }}
          </span>
      </div>
      <div class="hpo-row" v-if="hpoEntries && hpoEntries.length === 0">
      No hpo entries found for {{ selectedGene.gene_name }}
      </div>
    </div>

  </div>


</template>

<script>

export default {
  name: 'gene-hpo-table',
  components: {
  },
  props: {
    geneModel: null,
    selectedGene: null,
  },
  data () {
    return {
      hpoEntries: null
    }
  },
  methods: {
    getHPOEntries: function() {
      let self = this;
      self.hpoEntries = [];
  
      if (self.selectedGene && Object.keys(self.selectedGene).length > 0 ) {
        self.geneModel.promiseGetHPOTermsPublicAPI(self.selectedGene.gene_name)
        .then(function(data) {
          self.hpoEntries = data.diseaseAssoc;
        })
        .catch(function(error) {
          self.hpoEntries = [];
        })
      } else {
        self.hpoEntries = [];
      }

    },
    getEntryHref: function(diseaseId) {
      return "https://hpo.jax.org/app/browse/disease/" + diseaseId;
    }
  },
  watch: {
    selectedGene: function() {
      this.getHPOEntries();
    },
  },
  calculated: {
    
  },
  created: function() {
  },
  mounted: function() {
    let self = this;
    this.hpoEntries = null;
    setTimeout(function() {
      self.getHPOEntries();
    },1000)
  },
}
</script>