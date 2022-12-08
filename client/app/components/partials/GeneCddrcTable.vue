<style lang="sass" >

@import ../../../assets/sass/variables

#cddrc-table
  min-width: 400px
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


  .cddrc-row
    font-size: 12px
    padding-bottom: 5px
    >span
      display: inline-block
      vertical-align: top
      line-height: 15px
    
    .cddrc-launch
      min-width: 20px
      max-width: 20px
      i.material-icons
        font-size: 13px
        color: $link-color
    .cddrc-field
      display: inline-block
      min-width: 100px
      max-width: 100px
</style>

<style lang="css">
/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
#cddrc-table {
  min-width:  250px !important;
}
.cddrc-field {
  min-width: 150px !important;
  max-width: 150px !important;
}  

}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
#cddrc-table {
  min-width:  250px @important;
}
.cddrc-field {
  min-width: 150px !important;
  max-width: 150px !important;
}  

}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
#cddrc-table {
  min-width:  300px !important;
}
.cddrc-field {
  min-width: 150px !important;
  max-width: 150px !important;
}  

}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
#cddrc-table {
  min-width:  300px !important;
}
.cddrc-field {
  min-width: 150px !important;
  max-width: 150px !important;
} 

}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
#cddrc-table {
  min-width:  300px !important;
}
.cddrc-field {
  min-width: 150px !important;
  max-width: 150px !important;
} 

}
/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1400px) {
#cddrc-table {
  min-width:  400px !important;
}
.cddrc-field {
  min-width: 160px !important;
  max-width: 160px !important;
} 

}

</style>

<template>

<!--  todo: change styling tags/classes above-->

<!--  todo: put in info tooltip of what cddrc is and link to website-->

  <div id="cddrc-table">
    <div class="title-row">
      <div class="table-title">CDDRC Orthologous Data</div>
    </div>
    <div  style="max-height:158px;min-height:158px;overflow-y:scroll;padding-top:5px">
      <div class="loader"
           v-if="cddrcEntries && cddrcEntries.length > 0 && cddrcEntries[0].ensembl_id === 'loading...'">
        <span class="loader-label">loading</span>
        <img src="../../../assets/images/wheel.gif">
      </div>
      <div v-else class="cddrc-row" v-for="entry in cddrcEntries" :key="entry.ensembl_id">
          <span class="cddrc-launch">
            <a :href="getMosaicLink(entry.project_ids)" target="_cddrc">
              <v-icon>launch</v-icon>
            </a>
          </span>
          <span class="cddrc-field" >{{ entry.ensembl_id }}
          </span>
        <span class="cddrc-field" >{{ entry.species }}
          </span>
<!--          <span class="omim-inheritance">{{ entry.phenotypeInheritance }}</span>-->
      </div>
      <div class="cddrc-row" v-if="cddrcEntries && cddrcEntries.length === 0">
      No CDDRC entries found for {{ selectedGene.gene_name }}
      </div>
    </div>

  </div>


</template>

<script>

export default {
  name: 'gene-cddrc-table',
  components: {
  },
  props: {
    cohortModel: null,
    selectedGene: null,
  },
  data () {
    return {
      cddrcEntries: null
    }
  },
  methods: {
    getCddrcEntries: function() {
      const self = this;
      self.cddrcEntries = [ {ensembl_id: 'loading...'}];
  
      if (self.selectedGene && Object.keys(self.selectedGene).length > 0 ) {
        self.cohortModel.promiseGetCddrcEntries(self.selectedGene.gene_name)
        .then(function(entries) {
          self.cddrcEntries = []
          if (entries) {
            self.cddrcEntries = entries;
          }
        })
        .catch(function(error) {
          console.log("Cannot get CDDRC entries for gene " + self.selectedGene.gene_name + ". Error: " + error);
          self.cddrcEntries = [];
        })
      } else {
        self.cddrcEntries = [];
      }

    },
    getMosaicLink: function(projectIds) {
      return 'https://cddrc.utah.edu/#/projects/1047/';
    }
  },
  watch: {
    selectedGene: function() {
      this.getCddrcEntries();
    },
  },
  calculated: {
    
  },
  created: function() {
  },
  mounted: function() {
    let self = this;
    this.cddrcEntries = null;
    setTimeout(function() {
      self.getCddrcEntries();
    },2000)
  },
}
</script>

