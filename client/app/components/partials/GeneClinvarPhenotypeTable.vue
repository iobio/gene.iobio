<style lang="sass" >

@import ../../../assets/sass/variables

#clinvar-phenotype-table
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
  .clinvar-row
    font-size: 12px
    border-top: solid .5px #ededed
    >span
      display: inline-block
      vertical-align: top
      line-height: 15px

    .clinvar-phenotype
      min-width: 230px
      max-width: 230px
    .clinvar-benign
      display: inline-block
      min-width: 20px
      max-width: 20px
      color: #7ba506
      text-align: right
    .clinvar-other
      display: inline-block
      min-width: 20px
      max-width: 20px
      color: $clinvar-other-color
      text-align: right
    .clinvar-unknown
      display: inline-block
      min-width: 20px
      max-width: 20px
      color: $clinvar-uc-color
      text-align: right
    .clinvar-path
      display: inline-block
      min-width: 20px
      max-width: 20px
      color: $danger-color
      text-align: right
    .clinvar-total
      display: inline-block
      min-width: 20px
      max-width: 20px
      text-align: right
      font-weight: 500
</style>

<template>

  <div id="clinvar-phenotype-table" v-if="phenotypeEntries && phenotypeEntries.length > 0">
    <div class="title-row">
      <span class="table-title">ClinVar Phenotypes</span>
      <span v-if="phenotypeEntries && phenotypeEntries.length > 0" class="count">({{ phenotypeEntries.length }})</span>
    </div>
    <div style="max-height:130px;min-height:130px;overflow-y:scroll">    
      <div class="clinvar-row" v-for="entry in phenotypeEntries" :key="entry.phenotype">
          <span class="clinvar-phenotype" >{{ entry.phenotype }}
          </span>
          <span class="clinvar-benign">{{ entry.benign }}</span>
          <span class="clinvar-other">{{ entry.other }}</span>
          <span class="clinvar-unknown">{{ entry.unknown }}</span>
          <span class="clinvar-path">{{ entry.path }}</span>
          <span class="clinvar-total">{{ entry.total }}</span>
      </div>
    </div>

  </div>


</template>

<script>

export default {
  name: 'gene-clinvar-phenotype-table',
  components: {
  },
  props: {
    cohortModel: null,
    selectedGene: null,
  },
  data () {
    return {
      phenotypeEntries: []
    }
  },
  methods: {
    getPhenotypeEntries: function() {
      let self = this;
      self.phenotypeEntries = [];
      if (self.selectedGene && Object.keys(self.selectedGene).length > 0 ) {
        self.cohortModel.geneModel.promiseGetClinvarPhenotypes(self.cohortModel, 
          self.selectedGene, self.selectedTranscript)
        .then(function(data) {
          self.phenotypeEntries = data;          
        })
      } else {
        self.phenotypeEntries = [];
      }

    },
  },
  watch: {
    selectedGene: function() {
      this.getPhenotypeEntries();
    },
  },
  calculated: {
    
  },
  created: function() {
  },
  mounted: function() {
    let self = this;
    setTimeout(function() {
      self.getPhenotypeEntries();
    },2000)
  },
}
</script>

