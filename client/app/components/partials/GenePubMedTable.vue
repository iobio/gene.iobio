<style lang="sass" >

@import ../../../assets/sass/variables

#pubmed-table
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
  .match-message
    display: inline-block
    margin-left: 10px
    font-size: 12px

  .pubmed-row
    font-size: 12px
    border-bottom: solid .5px #ededed
    >span
      display: inline-block
      vertical-align: top
      line-height: 15px

    .pubmed-launch
      min-width: 20px
      max-width: 20px
      i.material-icons
        font-size: 13px
        color: $link-color

    .pubmed-title
      display: inline-block
      min-width: 350px
      max-width: 350px
      vertical-align: top
    .pubmed-pub-author
      display: inline-block
      min-width: 80px
      max-width: 80px
      vertical-align: top
    .pubmed-pub-source
      display: inline-block
      min-width: 80px
      max-width: 80px
      vertical-align: top
    .pubmed-pub-date
      display: inline-block
      min-width: 80px
      max-width: 80px
      vertical-align: top

 

  .v-input input
    color: $text-color
    font-size: 12px
  .v-input
    padding: 0px 0 0
  .v-text-field__slot
    min-height: 0px
    margin-top: 8px
  .v-select__slot input
    padding-bottom: 0px

  .v-select__slot label
    top: 7px
    &.v-label--active
      top: 16px
  
</style>

<template>

  <div id="pubmed-table" v-if="pubMedEntries && pubMedEntries.length > 0" style="margin-left:10px">
    <div style="display:flex;">
      <div class="title-row">
        <span class="table-title">PubMed</span>
        <span v-if="pubMedCount && pubMedCount > 0" class="count">({{ pubMedCount }})</span>
      </div>

      <v-autocomplete id="search-input"
        v-model="select"
        :loading="loading"
        :items="items"
        :search-input.sync="search"
        light
        dense
        hide-details
        hide-no-data
        label="search"
        style="margin-left:20px;max-width:230px"
      ></v-autocomplete>
      <span class="match-message"> {{ matchMessage }} </span>

    </div>
    <div style="max-height:130px;min-height:130px;overflow-y:scroll">
      <div class="pubmed-row" v-for="entry in pubMedEntries" :key="entry.uid">
        <span  class="pubmed-launch" >
          <a v-if="entry.uid" :href="getEntryHref(entry.uid)" target="_pubmed">
            <v-icon>launch</v-icon>
          </a>
        </span>
        <span class="pubmed-title" >{{ entry.title }}</span>
        <span v-if="showSource" class="pubmed-pub-source">{{ entry.source }}</span>
        <span v-if="showAuthor" class="pubmed-pub-author">{{ entry.firstAuthor }}</span>
        <span class="pubmed-pub-date">{{ entry.pubDate }}</span>
      </div>
    </div>

  </div>


</template>

<script>

export default {
  name: 'gene-pubmed-table',
  components: {
  },
  props: {
    geneModel: null,
    selectedGene: null,
    showAuthor: null,
    showSource: null,
  },
  data () {
    return {       
      pubMedEntries: [],
      pubMedCount: 0,

      pubMedEntriesAll: [],

      loading: false,
      search: null,
      select: null,    
      items: [],
      matchMessage: "" 
    }
  },
  methods: {
    getPubMedEntries: function() {
      let self = this;
      self.pubMedEntries = [];
      self.pubMedCount = 0;
      self.matchMessage = "";
      if (self.selectedGene && Object.keys(self.selectedGene).length > 0 ) {
        self.geneModel.promiseGetPubMedEntries(self.selectedGene.gene_name)
        .then(function(data) {
          self.pubMedEntries = data.entries;
          self.pubMedCount = data.count;
          self.matchMessage = data.count > self.pubMedEntries.length ? "showing 5 most recent publications." : "";
        })
        .catch(function(error) {
          self.pubMedEntries = [];
          self.pubMedCount = 0;
          self.matchMessage = "";
        })
      } else {
        self.pubMedEntries = [];
        self.pubMedCount = 0;
        self.matchMessage = "";

      }

    },
    getEntryHref: function(uid) {
      return "https://pubmed.ncbi.nlm.nih.gov/" + uid;
    },
    querySelections (v) {
      let self = this;
      if (this.loading) {
        return;
      }
      this.loading = true;
      this.items = [];

      if (v == "" || v == null) {
        self.matchMessage = "";
        self.getPubMedEntries();
        return;
      }

      let promiseGetAllEntries = null;
      if (self.pubMedEntriesAll) {
        promiseGetAllEntries = Promise.resolve()
      } else {
        promiseGetAllEntries = self.geneModel.promiseGetPubMedEntries(self.selectedGene.gene_name, {retmax: 500, useCached: false})
      }



      promiseGetAllEntries
      .then(function(data) {
        if (data) {
          self.pubMedEntriesAll = data.entries;
        }
        let matchedEntries  = self.pubMedEntriesAll.filter(e => {
          return (e.title || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
        })
        if (matchedEntries.length > 0) {
          self.pubMedEntries = matchedEntries;
          self.matchMessage = matchedEntries.length 
          + (matchedEntries.length > 1 ? " matches" : " match")
          + " to '" + v + "'."
        } else {
          self.pubMedEntries = [{title: ''}];
          self.matchMessage = "(no matches)";
        }
        self.items = [];
        self.loading = false

      })
      .catch(function(error) {
        self.pubMedEntriesAll = [];
        self.pubMedEntries = [];
        self.items = [];
        self.loading = false;
      })
    }    
  },
  watch: {
    selectedGene: function() {          
      this.pubMedEntriesAll = null;
      this.getPubMedEntries();
    },
    search (val) {
      let self = this;
      if (val && val !== this.select) {
        this.querySelections(val);
      } else if (this.value == null || this.val == "") {
        self.matchMessage = "";
        self.getPubMedEntries();
      }
    }
  },
  calculated: {
    
  },
  created: function() {
  },
  mounted: function() {
    let self = this;
    setTimeout(function() {
      self.getPubMedEntries();
    },2000)
  },
}
</script>

