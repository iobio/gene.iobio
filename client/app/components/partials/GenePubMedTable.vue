<style lang="sass" >

@import ../../../assets/sass/variables

#pubmed-table
  .loader
    width: 582px
    font-size: 12px
    margin-top: -20px

  .pubmed-header-row
    .v-input.v-text-field
      max-width: 230px
      max-width: 230px
      .v-text-field__slot
        margin-top: 0px
      .v-input__icon
        width: 15px
        min-width: 15px
      i.material-icons
        font-size: 17px

  .pubmed-rows
    max-height: 130px 
    min-height: 130px 
    overflow-y: scroll
    margin-top: 5px

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
  .match-message
    display: inline-block
    margin-left: 10px
    font-size: 12px

  .pubmed-row
    font-size: 12px
    padding-bottom: 5px
    >span
      display: inline-block
      vertical-align: top
      line-height: 15px

    .pubmed-item-number
      min-width: 20px
      max-width: 20px
      font-size: 11px
      padding-top: 1px

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
      .matched
        font-weight: 500
        background-color: #d3effed4
        color: black
    .pubmed-pub-author
      display: inline-block
      min-width: 80px
      max-width: 80px
      vertical-align: top
    .pubmed-pub-source
      display: inline-block
      min-width: 100px
      max-width: 100px
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

<style lang="css">
/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
.pubmed-title {
  min-width: 200px !important;
  max-width: 200px !important;
}  
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
.pubmed-title {
  min-width: 200px !important;
  max-width: 200px !important;
}  

}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
.pubmed-title {
  min-width: 300px !important;
  max-width: 300px !important;
}  

}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
.pubmed-title {
  min-width: 300px !important;
  max-width: 300px !important;
}  

}
/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1250px) {
.pubmed-title {
  min-width: 350px !important;
  max-width: 350px !important;
} 
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1410px) {
.pubmed-title {
  min-width: 400px !important;
  max-width: 400px !important;
}  

}

</style>


<template>

  <div id="pubmed-table" v-if="pubMedEntries && geneModel && selectedGene">
    <div class="pubmed-header-row" style="display: flex;align-items: bottom;">

      <v-text-field id="search-input" 
        v-if="pubMedEntries && pubMedEntries.length > 0 && pubMedEntries[0].title != 'loading...'"
        v-model="search" 
        prepend-icon="search"
        :loading="loading"
        hide-details>
      </v-text-field>
      
      <div class="title-row">
        <span v-if="pubMedCount && pubMedCount > 0" class="count">({{ pubMedCount }})</span>
      </div>
      <span class="match-message"> {{ matchMessage }} </span>



    </div>

    <div class="loader" 
    v-if="pubMedEntries && pubMedEntries.length > 0 && pubMedEntries[0].title == 'loading...'">
        <span class="loader-label">loading</span>
        <img src="../../../assets/images/wheel.gif">
    </div> 

    <div class="pubmed-rows" v-if="pubMedEntries && pubMedEntries.length > 0 && pubMedEntries[0].title != 'loading...'">
           

      <div class="pubmed-row" v-for="entry, idx in pubMedEntries" :key="entry.uid">
        <span class="pubmed-item-number">{{ idx+1 }}.</span>
        <span class="pubmed-title" v-html="entry.title"></span>
        <span  class="pubmed-launch" >
          <a v-if="entry.uid" :href="getEntryHref(entry.uid)" target="_pubmed">
            <v-icon>launch</v-icon>
          </a>
        </span>
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
    showAll: null,
  },
  data () {
    return {       
      pubMedEntries: [],
      pubMedCount: 0,

      pubMedEntriesAll: [],

      loading: false,
      search: null,  
      items: [],
      matchMessage: "" 
    }
  },
  methods: {
    getPubMedEntries: function() {
      let self = this;
      self.pubMedEntries = [ {title: 'loading...'}];
      self.pubMedCount = 0;
      self.matchMessage = "";
      let options = {retmax: 5, useCached: true};
      if (self.showAll) {
        options.retmax = 500;
        options.useCached = false;
      }
      if (self.selectedGene && Object.keys(self.selectedGene).length > 0 ) {
        self.geneModel.promiseGetPubMedEntries(self.selectedGene.gene_name, options)
        .then(function(data) {
          self.pubMedEntries = data.entries;
          if (self.showAll) {
            self.pubMedEntriesAll = data.entries;
          }
          self.pubMedCount = data.count;
          if (self.showAll) {
            self.matchMessage = "";
            if (data.count > self.pubMedEntries.length) {
              self.matchMessage = "top " + self.pubMedEntries.length + " entries.";
            }
          } else {
            self.matchMessage = data.count > self.pubMedEntries.length ? "5 most recent displayed." : "";
          }
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
      if (v && v.length < 3) {
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
      if (self.pubMedEntriesAll && self.pubMedEntriesAll.length > 0) {
        promiseGetAllEntries = Promise.resolve()
      } else {
        promiseGetAllEntries = self.geneModel.promiseGetPubMedEntries(self.selectedGene.gene_name, {retmax: 500, useCached: false})
      }



      promiseGetAllEntries
      .then(function(data) {
        if (data) {
          self.pubMedEntriesAll = data.entries;
        }
        let searchTerms = v.split(" ");
        let matchedEntries  = self.pubMedEntriesAll.filter(e => {
          let matches = searchTerms.filter(function(searchTerm) {
            return (e.title || '').toLowerCase().indexOf((searchTerm || '').toLowerCase()) > -1;
          })
          return matches.length > 0;
        })
        .map(function(e) {
          var regexp = new RegExp('(' + searchTerms.join("|") + ')', 'ig');
          let newObj = $.extend({}, e);
          newObj.title = newObj.title.replace(regexp, '<span class="matched">$&</span>');
          return newObj
        })
        
        if (matchedEntries.length > 0) {
          self.pubMedEntries = matchedEntries;
          self.matchMessage = matchedEntries.length 
          + (matchedEntries.length > 1 ? " matches" : " match")
          +  "."
        } else {
          self.pubMedEntries = [{title: ''}];
          self.matchMessage = "no matches.";
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
    selectedGene: function(oldSelectedGene, newSelectedGene) {
      if (oldSelectedGene.gene_name != newSelectedGene.gene_name) {
        this.search = "";
        this.pubMedEntriesAll = null;
        this.getPubMedEntries();        
      }          
    },
    search (val) {
      let self = this;
      if (val && val !== this.select) {
        this.querySelections(val);
      } else if (this.value == null || this.val == "") {
        if (self.showAll) {
          self.pubMedEntries = self.pubMedEntriesAll;
        } else {
          //self.getPubMedEntries();
        }
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

