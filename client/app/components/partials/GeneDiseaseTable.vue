<style lang="sass" >

@import ../../../assets/sass/variables

#hpo-disease-table
  min-width: 500px

  .entry-count
    margin-left: 5px


  .title-row
    display: flex
    height: 25px
    align-items: center


    .table-title
      color: $app-color
      font-size: 14px
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

    .phenotype-inheritance
      min-width: 100px
      max-width: 100px
   
</style>



<template>

  <div id="hpo-disease-table">
    <div class="title-row">
      <div class="table-title">
      {{ titleText ? titleText : 'Disease Associations' }}
      </div>
      <v-badge v-if="entryCount != ''" class="count entry-count">
        <span v-if="entryCount != ''" slot="badge">
           {{ entryCount }} 
        </span>
      </v-badge>
    </div>
    <div  class="disease-table-body" style="padding-top:5px">
      <div class="hpo-row" v-for="entry in entries" :key="entry.diseaseId">
          <span class="hpo-launch" >
            <a :href="entry.url" target="_hpo">
              {{ entry.diseaseId }}
            </a>
          </span>
          <span class="hpo-name" >
            {{ entry.diseaseName }}
          </span>
          <span class="phenotype-inheritance" >
            {{ entry.phenotypeInheritance }}
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
  name: 'gene-disease-table',
  components: {
  },
  props: {
    geneModel: null,
    selectedGene: null,
    titleText: null
  },
  data () {
    return {
      hpoEntries: null,
      omimEntryMap: {},
      entries: null,
      entryCount: ""
    }
  },
  methods: {
    getEntries: function() {
      let self = this;
      self.entryCount = "";
      self.entries = []
      self.promiseGetOMIMEntries()
      .then(function() {
        self.promiseGetHPOEntries()
        .then(function() {
          self.hpoEntries.map(function(hpoEntry) {
            let matchingOmimEntry = self.omimEntryMap[hpoEntry.dbId]
            if (matchingOmimEntry) {
              matchingOmimEntry.match = true;
              hpoEntry.phenotypeInheritance = matchingOmimEntry.phenotypeInheritance;
              hpoEntry.url = self.getOMIMEntryHref(matchingOmimEntry.mimNumber)
            } else {
              hpoEntry.phenotypeInheritance = "";
              hpoEntry.url = self.getEntryHref(hpoEntry.diseaseId)
            }
            self.entries.push(hpoEntry)
          })
          Object.values(self.omimEntryMap).forEach(function(omimEntry) {
            if (!omimEntry.match) {
              self.entries.push({'diseaseId': omimEntry.phenotypeMimNumber, 
                            'phenotypeInheritance': omimEntry.phenotypeInheritance,
                            'diseaseName': omimEntry.phenotype,
                            'url': omimEntry.url, })
            }
          })
          self.entryCount = self.entries.length > 0 ? self.entries.length : ""

        })
        .catch(function(error) {

        })
      })
      .catch(function() {

      })
    },
    promiseGetHPOEntries: function() {
      let self = this;
      self.hpoEntries = [];
      return new Promise(function(resolve, reject) {

        if (self.selectedGene && Object.keys(self.selectedGene).length > 0 ) {
          self.geneModel.promiseGetHPOTermsPublicAPI(self.selectedGene.gene_name)
          .then(function(data) {
            self.hpoEntries = data.diseaseAssoc;
            resolve();
          })
          .catch(function(error) {
            reject(error)
          })
        } else {
          resolve();
        }
      })
  
    },
    getEntryHref: function(diseaseId) {
      return "https://hpo.jax.org/app/browse/disease/" + diseaseId;
    },
    promiseGetOMIMEntries: function() {
      let self = this;

      return new Promise(function(resolve, reject) {
        self.omimEntryMap = {};
    
        if (self.selectedGene && Object.keys(self.selectedGene).length > 0 ) {
          self.geneModel.promiseGetOMIMEntries(self.selectedGene.gene_name)
          .then(function(data) {
            if (data && data.omimEntries) {
              self.omimEntries = data.omimEntries.map(function(entry) {
                return entry.phenotype;
              }).forEach(function(omimEntry) {
                self.omimEntryMap[omimEntry.phenotypeMimNumber] = omimEntry;
              })

              resolve()
            }
          })
          .catch(function(error) {
            reject(error)
          })
        } else {
          resolve();
        }
      })
    },
    getOMIMEntryHref: function(mimNumber) {
      return "https://www.omim.org/entry/" + mimNumber;
    }

  },
  watch: {
    selectedGene: function() {
      this.getEntries();
    },
  },
  calculated: {
    
  },
  created: function() {
  },
  mounted: function() {
    let self = this;
    this.getEntries()
  },
}
</script>