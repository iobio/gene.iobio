<style lang="sass" >

@import ../../../assets/sass/variables

#hpo-term-table
  min-width: 300px

  .hpo-header-row
    display: flex  
    margin-top: 2px 
    margin-bottom: 5px

    .search-input
      margin-left: 30px
      .v-input__control
        height: 40px
      .v-input.v-text-field
        min-width: 270px
        max-width: 270px
        align-items: center
        .v-text-field__slot
          margin-top: 0px
        .v-input__icon
          width: 15px
          min-width: 15px
        i.material-icons
          font-size: 20px
          padding-bottom: 6px
      .v-input input
        color: $text-color
        font-size: 14px
        padding-bottom: 2px
      .v-input
        padding: 0px 0 0
      .v-text-field__slot
        min-height: 0px
        margin-top: 8px
      .v-label
        font-size: 13px
      

  .search-match-message
    display: inline-block
    margin-left: 10px
    font-size: 12px
    padding-top: 18px
    padding-bottom: 10px
    font-style: italic
    font-weight: 600
    color: $nav-badge-color

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
    padding-top: 5px
    align-content: flex-start

    &.tabular
      flex-flow: row 
      flex-wrap: wrap

      .hpo-row
        padding-bottom: 10px !important

      .hpo-name
        min-width: 250px !important
        max-width: 250px !important

      &.patient-match
        .hpo-name
          min-width: 250px !important
          max-width: 250px !important

    &.tabular-compact
      flex-flow: row 
      flex-wrap: wrap

      .hpo-row
        padding-bottom: 10px !important

      .hpo-name
        min-width: 250px !important
        max-width: 250px !important

      .hpo-launch
        display: none !important

      &.patient-match
        .hpo-name
          min-width: 250px !important
          max-width: 250px !important


    &.dense-tags
      flex-flow: row 
      flex-wrap: wrap

      .hpo-row
        padding-bottom: 10px !important

      .hpo-name
        min-width: 20px !important
        max-width: 400px !important
        border: thin solid #d2d1d1
        padding: 2px

      .hpo-launch
        display: none !important

      &.patient-match
        .hpo-name
          min-width: 20px !important
          max-width: 400px !important
          border: thin solid #d2d1d1
          padding: 2px

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
      
      &.matched 
        color: $nav-badge-color
        font-weight: 600
      &.match-level-0
        color: $level-high-color
      &.match-level-1
        color: $level-high-color


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
        color: $nav-badge-color        
        border-color: $nav-badge-color
        border-style: solid
        background-color: white

        .v-chip__content 
          border-radius: 10px
          height: 16px
          padding: 0px 5px
          font-size: 11px
          font-weight: 500
          color: $nav-badge-color

        &.match-level-0 
          border-color: $level-high-color !important
          border-style: solid !important
          background: white !important

          .v-chip__content 
            color: $level-high-color !important
        &.match-level-1 
          border-color: $level-high-color !important
          border-style: solid !important
          background: white !important  

          .v-chip__content 
            color: $level-high-color !important


  .details-button
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
        color:  $link-color !important
  


</style>



<template>

  <div id="hpo-term-table">
    <div class="title-row hpo-header-row">
      <div  v-if="showTitle" class="table-title">
        {{ titleText ? titleText : 'Phenotype Associations' }}
      </div>
      <v-badge v-if="showTitle && entryCount != ''" class="count entry-count" style="margin-right:40px">
        <span v-if="entryCount != ''" slot="badge">
           {{ entryCount }} 
        </span>
      </v-badge>
      <v-btn class="details-button" v-if="showDetailsButton" style="margin-left:0px" flat @click="$emit('show-patient-phenotypes-dialog', true)" id="phenotype-details-button">
        <v-icon style="padding-right:3px;">account_box</v-icon>
        Details...
      </v-btn>

      <v-btn-toggle v-model="viewMode" v-if="showSearch" mandatory style="">
        <v-btn small flat value="list">
          <v-icon>view_list</v-icon>
        </v-btn>
        <v-btn small flat value="tabular">
          <v-icon>view_module</v-icon>
        </v-btn>
        <v-btn small flat value="tabular-compact">
          <v-icon>apps</v-icon>
        </v-btn>
        <v-btn small flat value="dense-tags">
          <v-icon>view_comfy</v-icon>
        </v-btn>
      </v-btn-toggle>

      <v-btn-toggle style="margin-left: 30px" v-model="sortBy" mandatory v-if="showSearch">
        <v-btn small flat value="sort-by-priority">
          <v-icon>sort</v-icon>
        </v-btn>
        <v-btn small flat value="sort-by-alpha">
          <v-icon>sort_by_alpha</v-icon>
        </v-btn>
      </v-btn-toggle>


     
      <div class="search-input" v-if="showSearch">
        <v-text-field id="search-input" 
          v-if="hpoEntriesAll && hpoEntriesAll.length > 0"
          v-model="searchTerm" 
          prepend-icon="search"
          :loading="loading"
          label="Search"
          v-tooltip.top-center="`To search multiple terms, enter space between terms.`">
          hide-details>
        </v-text-field>
      </div>
      <span class="search-match-message" v-if="showSearch"> {{ searchMatchMessage }} </span>

    </div>

    <div  :class="`hpo-table-body` + ' ' + viewMode">
      <div class="hpo-row patient-match" v-for="entry in hpoEntries" :key="entry.key">
        <v-chip v-if="highlightMatches  && entry.match != ''" :class="`match-chip match-level-` + entry.matchLevel">
          {{ entry.match }}
        </v-chip>
        <span v-if="highlightMatches && hasMatches && entry.match == ''" style="display:inline-block;width:90px"></span>
        
        <span class="hpo-launch" >
          <a :href="getEntryHref(entry.ontologyId)" target="_hpo">
            {{ entry.ontologyId }}
          </a>
        </span>
        <span class="hpo-name" :class="'hpo-name ' + (entry.match != '' ? 'matched match-level-' + entry.matchLevel : '')" v-html="entry.name" >
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
    showTitle: null,

    showSearch: null,
    initialViewMode: null
  },
  data () {
    return {
      hpoEntries: null,
      hpoEntriesAll: null,
      hpoTermToSample: null,
      hasMatches: false,
      entryCount: "",

      searchTerm: null,
      searchMatchCount: null,
      searchMatchMessage: null,
      loading: null,

      sortBy:    'sort-by-priority',
      viewMode:  this.initialViewMode ? this.initialViewMode : 'list'
    }
  },
  methods: {
    getHPOEntries: function() {
      let self = this;
      self.entryCount = "";
      self.hasMatches = false;

      if (self.genePatientPhenotypes) {
        self.hpoEntries = self.genePatientPhenotypes.map(function(entry) {
          entry.key = entry.ontologyId + "-" + entry.name.replaceAll(" ", "_")
          return entry;
        })
        self.entryCount = self.hpoEntries.length > 0 ? self.hpoEntries.length : ""
        self.hasMatches = self.hpoEntries.filter(function(hpoEntry) {
          return hpoEntry.match != ""
        }).length > 0;

      } else {
        self.hpoEntries = [];

        self.cohortModel.promiseGetGenePhenotypeAssociations(self.selectedGene.gene_name)
        .then(function(data) {
          self.hasMatches = data.hasMatches;
          let idx = 0;
          self.hpoEntries = data.hpoEntries.map(function(entry) {
            entry.ordinal = idx++;
            entry.key = entry.ontologyId + "-" + entry.name.replaceAll(" ", "_")
            return entry;
          })
          self.hpoEntriesAll = self.hpoEntries;

          self.entryCount = self.hpoEntries.length > 0 ? self.hpoEntries.length : ""

        })
        .catch(function(error) {
          self.hpoEntries = [];
        })

      }

    },
    getEntryHref: function(ontologyId) {
      return "https://hpo.jax.org/app/browse/term/" + ontologyId;
    },
    reorderEntries: function() {
      let self = this;
      self.hpoEntriesAll = self.hpoEntriesAll.sort(function(a,b) {
        if (self.sortBy == 'sort-by-priority') {
          return a.ordinal - b.ordinal;
        } else if (self.sortBy == 'sort-by-alpha') {
          return a.name.localeCompare(b.name);
        }
      })
      self.hpoEntries = self.hpoEntriesAll;
      if (this.searchTerm != null && this.searchTerm != "") {
        self.searchEntries(this.searchTerm)
      }
    },
    searchEntries: function(v) {
      let self = this;
      if (this.loading) {
        return;
      }
      if (v && v.length < 3) {
        return;
      }

      this.loading = true;
      let searchTerms = v.split(" ");
      let matchedEntries  = self.hpoEntriesAll
      .filter(function(e) {
        let matches = searchTerms.filter(function(searchTerm) {
          return (e.name || '').toLowerCase().indexOf((searchTerm || '').toLowerCase()) > -1;
        })
        return matches.length > 0;
      })
      .map(function(e) {
        var regexp = new RegExp('(' + searchTerms.join("|") + ')', 'ig');
        let newObj = $.extend({}, e);
        newObj.name = newObj.name.replace(regexp, '<span class="matched">$&</span>');

        return newObj
      })
      
      if (matchedEntries.length > 0) {
        self.hpoEntries = matchedEntries;
        self.searchMatchMessage = matchedEntries.length 
        + (matchedEntries.length > 1 ? " matches" : " match")
        +  "."
      } else {
        self.hpoEntries = [{name: ''}];
        self.searchMatchMessage = "no matches.";
      }
      this.loading = false;


      
    }    
  },
  watch: {
    selectedGene: function() {
      if (this.selectedGene && this.selectedGene != "" && this.selectedGene.gene_name && this.selectedGene.gene_name != "") {
        this.getHPOEntries();
      }
    },
    sortBy: function(newValue, oldValue) {
      if (this.sortBy != null && oldValue != null) {
        this.reorderEntries()
      }
    },
    searchTerm: function(newValue, oldValue) {
      let self = this;
      if (newValue && oldValue != null) {
        this.searchEntries(newValue);
      } else if (this.newValue == null || this.newValue == "") {
        self.hpoEntries = self.hpoEntriesAll;
        self.searchMatchMessage = "";
      }
    }
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

