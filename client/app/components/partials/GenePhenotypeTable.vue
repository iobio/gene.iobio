<style lang="sass" >

@import ../../../assets/sass/variables

#hpo-term-table
  min-width: 450px
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
      min-width: 350px
      max-width: 350px


    &.patient-match
      .hpo-name
        min-width: 300px
        max-width: 300px

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
    padding-left: 10px
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
      <div class="table-title">
        {{ titleText ? titleText : 'Phenotype Associations' }}
      </div>
      <v-badge v-if="entryCount != ''" class="count entry-count">
        <span v-if="entryCount != ''" slot="badge">
           {{ entryCount }} 
        </span>
      </v-badge>
      <v-btn v-if="showDetailsButton" style="margin-left:25px" flat @click="$emit('show-patient-phenotypes-dialog', true)" id="phenotype-details-button">
        <v-icon style="padding-right:3px;">account_box</v-icon>
        Details...
      </v-btn>

    </div>
    <div  style="max-height:90px;overflow-y:scroll;padding-top:5px">
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
    geneModel: null,
    selectedGene: null,
    cohortModel: null,
    highlightMatches: null,
    showDetailsButton: true,
    titleText: null
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

