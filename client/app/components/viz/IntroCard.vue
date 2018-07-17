<style lang="sass">
@import ../../../assets/sass/variables

#intro-card
  #intro-text
    clear: both

  a
    color: $link-color !important

  .switch-mode
    font-size: 16px

  .welcome-title
    display: inline-block
    font-size: 16px
    margin-bottom: 0px
    margin-right: 15px
    color: $app-color

  .left-info
    width: 200px
    float: left

  .right-info
    display: inline-block
    width: 200px
    float: right
    margin-right: 5px
    text-align: right

</style>

<template>

<v-card id="intro-card" class="app-card">
  <div style="text-align:center">
    <div>
      <div class="left-info">
        <span class="label-warning" v-show="defaultingToDemoData">
            Warning:  Using Demo Data
        </span>
        <span  v-show="!defaultingToDemoData">
            &nbsp;
        </span>
      </div>
      <span class="welcome-title">

        Welcome to Gene.iobio on MyGene2

      </span>
      <a id="intro-link" v-if="!showIntro" href="javascript:void(0)" @click="showIntro = true">tell me more...</a>

      <div class="right-info" >
        <a class="switch-mode" v-show="siteConfig != null && isBasicMode" @click="onAdvancedMode">
           Go to advanced
        </a>

        <a class="switch-mode" raised v-if="siteConfig != null && !isBasicMode"  @click="onBasicMode">
           Go to basic
        </a>
      </div>
    </div>


  </div>
  <div id="intro-text" v-if="showIntro" >
    <p>
      You can view your raw sequence data (VCF file) in multiple ways. From the navigation bar, you can search by name of gene (example: KDM1A) or by name of condition (examples: cystic fibrosis, breast cancer). When you search for the name of a condition, you may find a list of one or more genes reported to underlie that condition.
    </p>

    <p>
      In the 'Genes' panel, you will see a list of all genes.  Click on a gene button to select it.  In the 'Gene' panel, you can see a short summary of what is known about the gene.
    </p>
      Below that is the 'Variants' panel, showing the variants you have in the gene. Different types of variants are presented by different shapes (see legend in the navigation menu for more details). Hovering or clicking on a variant shape will highlight the corresponding column in the table.
    </p>
    <p>
      In the left side panel, you will see variants that predicted to underlie a condition according to a database called <a href="https://www.ncbi.nlm.nih.gov/clinvar/intro/">ClinVar</a>. A person who has a variant does not necessarily have the condition. In Basic mode, only variants that have a classification in ClinVar and have a frequency of &lt;1% in the general population are shown. If there are no matching variants, the side panel will be empty. You may have other variants in this gene that are not yet classified in ClinVar. These variants are shown in the 'Variants' panel and can also be seen in Advanced mode.
    </p>
    <div style="text-align:center">
      <a id="intro-less-link" v-if="showIntro" href="javascript:void(0)" @click="showIntro = false">Close</a>
    </div>
  </div>

</v-card>

</template>


<script>

export default {
  name: 'intro-card',
  components: {
  },
  props: {
    closeIntro: false,
    isBasicMode: null,
    siteConfig: null,
    defaultingToDemoData: null
  },
  data () {
    return {
      showIntro: true
    }
  },
  watch: {
    closeIntro: function() {
      if (this.closeIntro) {
        this.showIntro = false;
      }
    }
  },
  methods: {
    onAdvancedMode: function() {
      this.$emit("on-advanced-mode");
    },
    onBasicMode: function() {
      this.$emit("on-basic-mode");
    }
  },
  mounted: function() {

  }
}

</script>