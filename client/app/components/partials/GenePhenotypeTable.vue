<style lang="sass" >

@import ../../../assets/sass/variables

#hpo-term-table
  min-width: 300px

  .title-row
    display: flex
    height: 25px
    align-items: center

    .table-title
      color: $app-color
      margin-right: 10px
    .count
      display: inline-block
      font-size: 12px
      margin-left: 10px
      padding-top: 1px

  .hpo-table-body
    display: flex 
    flex-flow: column

    &.tabular
      flex-flow: row 
      flex-wrap: wrap

      .hpo-row
        padding-bottom: 5px !important

      .hpo-name
        min-width: 150px !important
        max-width: 150px !important


      &.patient-match
        .hpo-name
          min-width: 150px !important
          max-width: 150px !important



  .hpo-row
    font-size: 12px
    padding-bottom: 2px
    padding-right:  10px
    >span
      display: inline-block
      vertical-align: top
      line-height: 15px
    
    .hpo-launch
      min-width: 75px
      max-width: 75px
      a 
        color: $link-color
        font-weight: 500
    .hpo-name
      min-width: 250px 
      max-width: 250px 


    &.patient-match
      .hpo-name
        min-width: 250px
        max-width: 250px

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

  button
    padding: 0px
    height: 26px !important
    background-color: white !important
    margin: 0px
    padding-left: 0px
    padding-right: 10px
    color: $link-color !important
    margin-left: 41px

    .v-btn__content
      font-size: 13px
      font-weight: 500
      .material-icons
        font-size: 20px
</style>



<template>

  <div id="hpo-term-table">
    <div class="title-row">
      <div  v-if="showTitle" class="table-title">
        {{ titleText ? titleText : 'Phenotype Associations' }}
      </div>
      <v-badge v-if="showTitle && entryCount != ''" class="count entry-count" style="margin-right:40px">
        <span v-if="entryCount != ''" slot="badge">
           {{ entryCount }} 
        </span>
      </v-badge>
      <v-btn v-if="showDetailsButton" style="margin-left:0px" flat @click="$emit('show-patient-phenotypes-dialog', true)" id="phenotype-details-button">
        <v-icon style="padding-right:3px;">account_box</v-icon>
        Details...
      </v-btn>

    </div>
    <div  class="hpo-table-body" style="padding-top:5px">
      <div class="hpo-row patient-match" v-for="entry in hpoEntries" :key="entry.ontologyId">
        <v-chip v-if="highlightMatches  && entry.match != ''" :class="`match-chip match-level-` + entry.matchLevel">
          {{ entry.match }}
        </v-chip>
        <span v-if="highlightMatches && hasMatches && entry.match == ''" style="display:inline-block;width:90px"></span>
        
        <span class="hpo-launch" >
          <a :href="getEntryHref(entry.ontologyId)" target="_hpo">
            {{ entry.ontologyId }}
          </a>
        </span>
        <span class="hpo-name" >{{ entry.name }}
        </span>
      </div>
    </div>


  </div>


</template>

<script>

export default {
  name: 'gene-phenotype-table',
  components: {
  },
  props: {
    // When initialized, the data has been passed in as a prop; otherwise,
    // the list is generated get the getHPOEntries() method.
    genePatientPhenotypes: null,  

    selectedGene: null,
    geneModel: null,
    cohortModel: null,

    // Do we want to show a chip in the right hand column that indicates that a
    // phenotype term listed for the gene is also listed for the proband (or family members)
    highlightMatches: null,

    // Show the details button to the right of the title table. 
    showDetailsButton: true,

    titleText: null,
    showTitle: null
  },
  data () {
    return {
      hpoEntries: null,
      hpoTermToSample: null,
      hasMatches: false,
      entryCount: ""
    }
  },
  methods: {
    getHPOEntries: function() {
      let self = this;
      self.entryCount = "";
      self.hasMatches = false;

      if (self.genePatientPhenotypes) {
        self.hpoEntries = self.genePatientPhenotypes;
        self.entryCount = self.hpoEntries.length > 0 ? self.hpoEntries.length : ""
        self.hasMatches = self.hpoEntries.filter(function(hpoEntry) {
          return hpoEntry.match != ""
        }).length > 0;

      } else {
        self.hpoEntries = [];

        self.cohortModel.promiseGetGenePhenotypeAssociations(self.selectedGene.gene_name)
        .then(function(data) {
          self.hasMatches = data.hasMatches;
          self.hpoEntries = data.hpoEntries;
          self.entryCount = self.hpoEntries.length > 0 ? self.hpoEntries.length : ""

        })
        .catch(function(error) {
          self.hpoEntries = [];
        })

      }

    },
    getEntryHref: function(ontologyId) {
      return "https://hpo.jax.org/app/browse/term/" + ontologyId;
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
    },100)
  },
}
</script>

