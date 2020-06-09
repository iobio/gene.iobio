<style lang="sass" >
@import ../../../assets/sass/variables

.info-button
  margin: 0px !important
  padding: 0px !important
  min-width: 18px !important
  height: 18px !important
  margin-top: -6px !important

  .btn__content, .v-btn__content
    padding: 0px
    max-width: 18px
    max-height: 18px

    i.material-icons
      font-size: 18px
      color: $link-color
      opacity: .6

.close-button
  margin: 0px !important
  padding: 0px !important
  min-width: 25px !important
  height: 25px !important
  margin-bottom: 15px !important

  .btn__content, .v-btn__content
    padding: 0px
    max-width: 25px
    max-height: 25px

    i.material-icons
      font-size: 25px
      color: $text-color

.info-title
  font-size: 20px
  color: $app-color
  margin-bottom: 15px

.info-card
  padding: 15px 15px 20px 15px

.info-description
  font-size: 13px

.info-publication
  margin-top: 20px
  font-size: 13px
  a
    font-style: italic
    font-size: 13px
    line-height: 16px
</style>
<template>

    <v-dialog  width="500"  v-model="showPopup" lazy >
      <v-btn class="info-button" flat  slot="activator">
        <v-icon>help</v-icon>
      </v-btn>
      <v-card class="info-card full-width">
        <v-card-title style="justify-content:space-between">
          <span class="info-title">{{ info[name].title }}</span>
          <v-btn  @click="onClose" flat class="close-button">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="info-description" v-html="info[name].description">
        </v-card-text>
        <div class="info-publication"  v-if="info[name].publication">
          <a :href="info[name].publicationUrl" target="_info">{{ info[name].publication }}</a>
        </div>
      </v-card>
    </v-dialog>

</template>

<script>

export default {
    name: 'info-popup',
    props: {
      name: String
    },
    data() {
      return {
        showPopup: false,
        info: {
            'revel': {
                title: 'REVEL Score',
                description: 'Revel scores only apply to missense variants.<br><br>The score is a predicted pathogenicity score from 0 to 1 where 0 is benign and 1 is pathogenic.<br><br>Revel scores are open to interpretation, but as a starting point, we have categorized a score > .5 as ‘moderate’ and a score > .75 as ‘high’.',
                publication: 'REVEL: An Ensemble Method for Predicting the Pathogenicity of Rare Missense Variants',
                publicationUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5065685/'

            },
            'gnomAD': {
                title: 'Allele Frequency from gnomAD',
                description: 'The variant allele frequency is obtained from gnomAD genomes only. (In an upcoming release, gene.iobio will obtain allele frequencies from gnomAD Exomes as well.)',
                publication: 'gnomAD site',
                publicationUrl: 'https://gnomad.broadinstitute.org/'

            },
            'impact':  {
              title: 'Impact',
              description: 'Predicted effect of the variant on gene function'
            },
            'clinvar': {
              title: 'ClinVar',
              description: 'Clinical significance according to the ClinVar database.'
            },
            'variantType': {
              title: 'Variant type',
              description: 'How the variant changes the DNA sequence.'
            },
            'pathogenic': {
              title: 'Pathogenic',
              description: 'Causes disease'
            },
            'likelyPathogenic': {
              title: 'Likely pathogenic',
              description: 'Likely causes disease'
            },
            'snp': {
              title: 'Variant type',
              description: 'Single nucleotide polymorphism (change in a nucleotide).'
            }
        }

      }
    },
    methods: {

      onClose: function() {
        this.showPopup = false;
      }
    }
}

</script>
