<style lang="sass" >

@import ../../../assets/sass/variables

#hpo-disease-table
  min-width: 600px

  .disease-table-body
    min-height: 100px 
    max-height: 100px
    overflow-y: scroll

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
      min-width: 350px
      max-width: 350px

    .phenotype-inheritance
      min-width: 0px
      max-width: 150px
   
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
      self.geneModel.promiseGetGeneDisorders(self.selectedGene.gene_name)
      .then(function(data) {
        let geneDisorders = data[0];
        let geneName      = data[1]
        geneDisorders.forEach(function(geneDisorder) {
          let source = null;
          let mimNumber = null;
          let url = null;
          if (geneDisorder.disease_id && geneDisorder.disease_id.indexOf(":") > 0) {
            source = geneDisorder.disease_id.split(":")[0];
            mimNumber = geneDisorder.disease_id.split(":")[1];
            url = source == 'OMIM' ? self.getOMIMEntryHref(mimNumber) : self.getEntryHref(geneDisorder.disease_id);
          }
          self.entries.push({'diseaseId': geneDisorder.disease_id, 
                        'phenotypeInheritance': geneDisorder.inheritance,
                        'diseaseName': geneDisorder.disorder,
                        'url': url })

        })
        self.entryCount = self.entries.length > 0 ? self.entries.length : ""
      })
      .catch(function(error) {
        console.log(error)

      })
    },
    getEntryHref: function(diseaseId) {
      return "https://hpo.jax.org/app/browse/disease/" + diseaseId;
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