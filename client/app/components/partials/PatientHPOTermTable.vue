<style lang="sass" >

@import ../../../assets/sass/variables

#patient-hpo-term-table
  min-width: 250px
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


  .hpo-row
    font-size: 12px
    padding-bottom: 10px
    >span
      display: inline-block
      vertical-align: top
      line-height: 15px
    
    .hpo-launch
      min-width: 74px
      max-width: 74px
      a 
        color: $link-color
        font-weight: 500
    .hpo-name
      min-width: 150px
      max-width: 150px
    
    .match-chip
      width: 70px
      text-align: center
      padding: 0px
      margin-bottom: 2px
      margin-left: 0px
      margin-right: 2px
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

  <div id="patient-hpo-term-table">
    <div class="title-row">
      <div class="table-title">HPO Terms</div>
    </div>
    <div  style="max-height:500px;overflow-y:scroll;padding-top:5px">
      <div class="hpo-row" v-for="entry in hpoEntries" :key="entry.hpo_term_id">
        <v-chip v-if="entry.match != ''" :class="`match-chip match-level-` + entry.matchLevel">
          {{ entry.match }}
        </v-chip>
        <span v-if="hasMatches && entry.match == ''" style="display:inline-block;width:57px"></span>
        <span class="hpo-launch" >
          <a :href="getEntryHref(entry.hpo_term_id)" target="_hpo">
            {{ entry.hpo_term_id }}
          </a>
        </span>
        <span class="hpo-name" >{{ entry.hpo_term_name }}
        </span>
      </div>
    </div>


  </div>


</template>

<script>

export default {
  name: 'patient-hpo-term-table',
  components: {
  },
  props: {
    cohortModel: null
  },
  data () {
    return {
      hpoEntries: null,
      hpoTermToSample: null,
    }
  },
  methods: {
    getHPOEntries: function() {
      let self = this;
      self.hasMatches = false;
      let hpoTerms = []

      if (self.hpoTermToSample == null) {
        self.hpoTermToSample = {};
        self.cohortModel.getCanonicalModels().forEach(function(sampleModel) {
          let relationship = sampleModel.relationship;
          if (sampleModel.hpoTerms) {
            sampleModel.hpoTerms.forEach(function(hpoTerm) {
              let matched = hpoTerms.filter(function(term) {
                return term.hpo_id == hpoTerm.hpo_id
              })
              if (matched.length == 0) {
                hpoTerms.push(hpoTerm)
              }
              let rels = self.hpoTermToSample[hpoTerm.hpo_id];
              if (rels == null) {
                rels = [];
              }
              rels.push(relationship);
              self.hpoTermToSample[hpoTerm.hpo_id] = rels;
            })
          }
        })
      }

      let idx = 0;
      self.hpoEntries = hpoTerms.map(function(hpoTerm) {
        let rels = self.hpoTermToSample[hpoTerm.hpo_id];
        let matchToken = null;
        let matchLevel= 99;
        if (rels == null) {
          matchToken = ""
        } else if (rels.indexOf("proband") >= 0 && rels.length == 1) {
          matchToken = "Proband"
          matchLevel = 0;
        } else if (rels.indexOf("proband") >= 0 && rels.length > 1) {
          matchToken = "Proband+"
          matchLevel = 1;
        } else {
          if (rels.indexOf("mother") >= 0 && rels.indexOf("father") >= 0) {
            matchToken = "Parents"
            matchLevel = 2;
          } else if (rels.indexOf("mother") >= 0 && rels.length == 1) {
            matchToken = "Mother"
            matchLevel = 2;
          } else if (rels.indexOf("father") >= 0 && rels.length == 1) {
            matchToken = "Mother"
            matchLevel = 2;
          } else if (rels.indexOf("sibling") >= 0 && rels.length == 1) {
            matchToken = "Sibling"
            matchLevel = 2;
          } else if (rels.length > 1) {
            matchToken = "Family"
            matchLevel = 2;
          }
        }
        if (matchToken != "") {
          self.hasMatches = true;
        }
        idx++;
        return {'match': matchToken, 'matchLevel': matchLevel, 'hpo_term_id': hpoTerm.hpo_id, 'hpo_term_name': hpoTerm.label, 'ordinal': idx}
      })
      .sort(function(a,b) {
        if (a.matchLevel != b.matchLevel) {
          if (a.matchLevel > b.matchLevel) {
            return 1;
          } else if (a.matchLevel < b.matchLevel) {
            return -1;
          } 
        } else {
          if (a.ordinal < b.ordinal) {
            return -1
          } else if (a.ordinal > b.ordinal) {
            return 1
          } else {
            return 0;
          }
        }
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

