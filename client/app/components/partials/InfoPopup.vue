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
      font-size: 14px !important
      color: $link-color
      opacity: .7

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

.toggle-info-button
  margin-bottom: 0 !important
  margin-top: 0 !important
  margin-right: 30px !important
  margin-left: 0 !important
  padding-top: 0 !important
  padding-left: 5px !important
  padding-right: 5px !important
  padding-bottom: 0 !important
  min-width: 18px !important
  .btn__content, .v-btn__content
    padding: 0px
    max-width: 18px
    i.material-icons
      font-size: 18px
      color: $link-color
      opacity: .6
</style>
<template>

    <v-dialog  width="500"  v-model="showPopup" lazy >
      <v-btn   v-bind:class="{ 'info-button': name !== 'variant-toggle', 'toggle-info-button': name === 'variant-toggle' }"
               flat  slot="activator">
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
              description: '<div style="font-size: 15px; padding-bottom: 10px; font-style: italic">Predicted effect of the variant on gene function based on VEP annotations. </div>' +
                  ' <strong> High impact variant consequence </strong> ' +
                  '<div>The variant is assumed to have high (disruptive) impact in the protein, probably causing protein truncation, loss of function or triggering nonsense mediated decay.</div>' +
                  '<strong>Moderate impact variant consequence</strong>' +
                  '<div>A non-disruptive variant that might change protein effectiveness.</div>' +
                  '<strong>Modifier impact variant consequence</strong>' +
                  '<div>Usually non-coding variants or variants affecting non-coding genes, where predictions are difficult or there is no evidence of impact.</div>' +
                  '<strong>Low impact variant consequence</strong>' +
                  '<div>A variant that is assumed to be mostly harmless or unlikely to change protein behaviour</div>',
              publication: 'VEP impact guidelines',
              publicationUrl: 'https://m.ensembl.org/info/genome/variation/prediction/predicted_data.html'

            },
          'QC':  {
            title: 'Quality Control',
            description: 'Does the VCF have sufficient coverage for a variant based on the minimum overage thresholds set within gene.iobio (default: 10 reads)',
          },
            'inheritance' : {
              title: 'Inheritance',
              //Matts wording
                // description: 'The Mendelian mode of inheritance and allele segregation pattern for a given variant',
              description: 'The manner in which a genetic variant is passed from one generation to the next',
              publication: 'Mode of inheritance terminology',
              publicationUrl: 'https://www.ons.org/genomics-taxonomy/mode-inheritance'
            },
            'clinvar': {
              title: 'ClinVar',
              description: 'Clinical significance according to the ClinVar database.  The guidelines for reporting ClinVar significance are outlined by ACMG/AMP, for variants interpreted for Mendelian disorders.',
              publication: 'ClinVar significance terminology guidelines',
              publicationUrl: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4544753/',
            },
            'variantType': {
              title: 'Variant type',
              description:
                  '<div style="font-size: 15px; padding-bottom: 10px; font-style: italic">How the genetic sequence of the sample differs from the human reference genome </div>' +
                  ' <strong> SNP </strong> ' +
                  '<div> The genetic sequence of a sample differs at a single position from the human reference genome</div>' +
                  '<strong>Deletion</strong>' +
                  '<div> The genetic sequence of a the human reference genome is absent from the sample</div>' +
                  '<strong>Insertion</strong>' +
                  '<div> The genetic sequence of a sample is absent from the human reference genome</div>' +
                  '<strong>Complex</strong>' +
                  '<div>A genetic sequence where the difference between the human reference genome and the sample that cannot be described by a basic variant type</div>',
            },

          //todo: write better description of evidence
              'evidence': {
            title: 'Evidence for Pathogenicity',
            description: 'Support for pathogenicity based on internal, gene.iobio criteria.  This evidence is not based on ACMG evidence codes',
              },

          //Todo: fill out coverage popout
          'coverage': {
            title: 'Coverage',
            description: ''
          },

          //todo: fill out called variants description
          'called-variants': {
            title: 'Variants called in gene.iobio',
            description: '',
          },


            'variant-toggle': {
              title: 'Filter variant track by inheritance',
              description: 'Only show variants on variant tracks that pass one of the selected inheritance filters.'
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
