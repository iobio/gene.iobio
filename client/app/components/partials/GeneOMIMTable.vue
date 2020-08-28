<style lang="sass" >

@import ../../../assets/sass/variables

#omim-table
  .table-title
    color: $app-color
  .omim-row
    font-size: 12px
    border-top: solid .5px #ededed
    >span
      display: inline-block
      vertical-align: top
      line-height: 15px

    .omim-launch
      min-width: 20px
      max-width: 20px
      i.material-icons
        font-size: 13px
        color: $link-color
    .omim-phenotype
      min-width: 300px
      max-width: 300px
    .omim-inheritance
      display: inline-block
      min-width: 100px
      max-width: 100px
</style>

<template>

  <div id="omim-table" v-if="omimEntries && omimEntries.length > 0">
    <div class="table-title">OMIM Phenotypes</div>
    <div class="omim-row" v-for="entry in omimEntries" :key="entry.phenotypeMimNumber">
        <span class="omim-launch" >
          <a :href="getEntryHref(entry.phenotypeMimNumber)" target="_omim">
            <v-icon>launch</v-icon>
          </a>
        </span>
        <span class="omim-phenotype" >{{ entry.phenotype }}
        </span>
        <span class="omim-inheritance">{{ entry.phenotypeInheritance }}</span>
    </div>

  </div>


</template>

<script>

export default {
  name: 'gene-omim-table',
  components: {
  },
  props: {
    geneModel: null,
    selectedGene: null,
  },
  data () {
    return {
      omimEntries: []
    }
  },
  methods: {
    getOMIMEntries: function() {
      let self = this;
      if (self.selectedGene && Object.keys(self.selectedGene).length > 0 ) {
        self.geneModel.promiseGetOMIMEntries(self.selectedGene.gene_name)
        .then(function(data) {
          self.omimEntries = data.omimEntries.map(function(entry) {
            return entry.phenotype;
          });
        })
      } else {
        self.omimEntries = [];
      }

    },
    getEntryHref: function(mimNumber) {
      return "https://www.omim.org/entry/" + mimNumber;
    }
  },
  watch: {
    selectedGene: function() {
      this.getOMIMEntries();
    },
  },
  calculated: {
    
  },
  created: function() {
  },
  mounted: function() {
  },
}
</script>

