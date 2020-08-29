<style lang="sass" >

@import ../../../assets/sass/variables

#clinvar-phenotype-table
  .title-row
    display: flex
    height: 25px
    border-bottom: solid .5px #ededed

    .table-title
      color: $app-color
    .count
      display: inline-block
      font-size: 12px
      margin-left: 10px
      padding-top: 1px
  .clinvar-row
    font-size: 12px
    border-bottom: solid .5px #ededed
    >span
      display: inline-block
      vertical-align: top
      line-height: 15px

    .clinvar-phenotype
      min-width: 250px
      max-width: 250px
    .clinvar-total
      display: inline-block
      min-width: 20px
      max-width: 20px
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
      if (self.selectedGene && Object.keys(self.selectedGene).length > 0 ) {
        self.cohortModel.promiseGetClinvarPhenotypes(self.selectedGene, self.selectedTranscript)
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

