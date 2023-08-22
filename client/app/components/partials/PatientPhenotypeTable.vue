<style lang="sass" >

@import ../../../assets/sass/variables

#patient-phenotype-table
  min-width: 250px
  .title-row
    display: flex
    height: 25px
    align-items: center

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
      min-width: 150px
      max-width: 150px

    .hpo-sample-matches
      min-width: 150px
      max-width: 150px
    
    .match-chip
      width: 70px
      text-align: center
      padding: 0px
      margin-bottom: 2px
      margin-left: 0px
      margin-right: 20px
      margin-top: -1px
      background-color: $nav-badge-color
      box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)

      .v-chip__content 
        border-radius: 10px
        height: 16px
        padding: 0px 5px
        font-size: 11px
        font-weight: 500
        color: white

      &.match-level-0
        background-color: $level-high-color !important
      &.match-level-1
        background-color: $level-high-color !important

   
</style>



<template>

  <div id="patient-phenotype-table">
    <div class="title-row">
      <div class="table-title">
        {{ titleText ? titleText : 'HPO Terms' }}
      </div>
      <v-badge v-if="entryCount != ''" class="count entry-count">
        <span v-if="entryCount != ''" slot="badge">
           {{ entryCount }} 
        </span>
      </v-badge>
    </div>
    <div  style="max-height:500px;overflow-y:scroll;padding-top:5px">
      <div class="hpo-row" v-for="entry in hpoEntries" :key="entry.hpo_term_id">
        
        <v-chip v-if="selectedGene && entry.match != ''" :class="`match-chip match-level-` + entry.matchLevel">
          {{ entry.match }}
        </v-chip>
        <span v-if="selectedGene && hasMatches && entry.match == ''" style="display:inline-block;width:90px"></span>
        <span class="hpo-launch" >
          <a :href="getEntryHref(entry.hpo_term_id)" target="_hpo">
            {{ entry.hpo_term_id }}
          </a>
        </span>
        <span class="hpo-name" >
          {{ entry.hpo_term_name }}
        </span>
        <span class="hpo-sample-matches">
          <span v-for="rel in entry.matchingSamples" :key="rel">
              {{ rel }}
          </span>
        </span>
      </div>
    </div>


  </div>


</template>

<script>

export default {
  name: 'patient-phenotype-table',
  components: {
  },
  props: {
    cohortModel: null,
    selectedGene: null,  
    titleText: null
  },
  data () {
    return {
      hpoEntries: null,
      hpoTermToSample: null,
      hpoTermToGene: null,
      entryCount: ""
    }
  },
  methods: {
    getHPOEntries: function() {
      let self = this;
      self.hasMatches = false;


      let phenotypesPromise = function() {
        if (self.selectedGene) {
          return self.cohortModel.promiseGetPatientPhenotypesMatchingGene(self.selectedGene.gene_name)
          
        } else {
          return Promise.resolve(self.cohortModel.getPatientPhenotypes())
        }

      }

      phenotypesPromise()
      .then(function(data) {
        self.hpoEntries = data;
        self.hasMatches = self.hpoEntries.filter(function(hpoEntry) {
          return hpoEntry.match != ""
        }).length > 0
        self.entryCount = self.hpoEntries.length > 0 ? self.hpoEntries.length : ""
      })
      
    },
    getEntryHref: function(hpo_term_id) {
      return "https://hpo.jax.org/app/browse/term/" + hpo_term_id;
    }
  },
  watch: {
    
  },
  calculated: {
    
  },
  created: function() {
  },
  mounted: function() {
    this.getHPOEntries();
  },
}
</script>

