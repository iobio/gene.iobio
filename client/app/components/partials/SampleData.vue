<style lang="sass">

  #sample-selection
    .input-group--select
      .input-group__selections__comma
        font-size: 12px
        padding: 0px 0px 0px 0px
    .input-group
      label
        font-size: 12px
        line-height: 25px
        height: 25px
    .input-group__input
      min-height: 0px
      margin-top: 0px

    .input-group--text-field.input-group--dirty.input-group--select
      label
        -webkit-transform: translate(0, -18px) scale(0.95)
        transform: translate(0, -18px) scale(0.95)

    .input-group--text-field.input-group--dirty:not(.input-group--textarea)
      label
        -webkit-transform: translate(0, -18px) scale(0.95)
        transform: translate(0, -18px) scale(0.95)

  .sample-label
    .chip
      vertical-align: top
      margin-left: 0px
    .switch
      display: inline-block
      width: 100px

</style>
<template>

 <v-layout row wrap class="ml-2 mt-2">
    <v-flex xs12 class="sample-label" >
      <v-chip color="primary" small text-color="white"> {{ modelInfo.relationship }}</v-chip>
      <v-switch  label="Affected" hide-details @change="onIsAffected" v-model="isAffected"></v-switch>
    </v-flex>
    <v-flex xs12  class="ml-3" style="margin-top: -10px">
      <sample-data-file
       :defaultUrl="modelInfo.vcf"
       :defaultIndexUrl="modelInfo.tbi"
       :label="`vcf`"
       :indexLabel="`tbi`"
       :filePlaceholder="filePlaceholder.vcf"
       :fileAccept="fileAccept.vcf"
       :separateUrlForIndex="separateUrlForIndex"
       @url-entered="onVcfUrlEntered"
       @file-selected="onVcfFilesSelected">
      </sample-data-file>
    </v-flex>

    <v-flex xs4 class="ml-3" id="sample-selection">
      <v-select
        v-bind:class="samples == null || samples.length == 0 ? 'hide' : ''"
        label="Sample"
        v-model="sample"
        :items="samples"
        @input="onSampleSelected"
        hide-details
      ></v-select>
    </v-flex>

    <v-flex xs12  class="ml-3" >
      <sample-data-file
       :defaultUrl="modelInfo.bam"
       :defaultIndexUrl="modelInfo.bai"
       :label="`bam`"
        :indexLabel="`bai`"
       :filePlaceholder="filePlaceholder.bam"
       :fileAccept="fileAccept.bam"
       :separateUrlForIndex="separateUrlForIndex"
       @url-entered="onBamUrlEntered"
       @file-selected="onBamFilesSelected">
      </sample-data-file>
    </v-flex>

 </v-layout>


</template>

<script>

import SampleDataFile           from '../partials/SampleDataFile.vue'


export default {
  name: 'sample-data',
  components: {
    SampleDataFile
  },
  props: {
    modelInfo: null,
    separateUrlForIndex: null
  },
  data () {
    return {
        isValid: false,
        filePlaceholder: {
          'vcf': '.vcf.gz and .tbi files',
          'bam': '.bam and .bai files'
        },
        fileAccept: {
          'vcf': '.vcf.gz, .tbi',
          'bam': '.bam, .bai'
        },
        samples: [],
        sample: null,
        isAffected: true

    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    onVcfUrlEntered: function(vcfUrl, tbiUrl) {
      let self = this;
      self.$set(self, "sample", null);
      self.$set(self, "samples", []);

      if (self.modelInfo && self.modelInfo.model) {
        self.modelInfo.model.onVcfUrlEntered(vcfUrl, tbiUrl, function(success, sampleNames) {
          if (success) {
            self.samples = sampleNames;
            if (self.modelInfo.sample) {
              self.sample = self.modelInfo.sample;
              self.modelInfo.model.sampleName  = self.modelInfo.sample;
            }
            self.$emit("samples-available", self.modelInfo.relationship, self.samples);

          }
          self.$emit("sample-data-changed");
        })
      }

    },
    onVcfFilesSelected: function(fileSelection) {
      let self = this;
      self.$set(self, "sample", null);
      self.$set(self, "samples", []);
      self.modelInfo.model.promiseVcfFilesSelected(fileSelection)
      .then(function(data) {
        self.samples = data.sampleNames;
        self.$emit("sample-data-changed");
        self.$emit("samples-available", self.modelInfo.relationship, self.samples);
      })
      .catch(function(error) {
        self.$emit("sample-data-changed");
      })
    },
    onIsAffected: function() {
      this.modelInfo.isAffected = this.isAffected;
    },
    updateSamples: function(samples, sampleToSelect) {
      this.samples = samples;
      if (sampleToSelect) {
        this.sample = sampleToSelect;
      } else {
        this.sample = null;
      }
    },
    onSampleSelected: function() {
      let self = this;
      self.modelInfo.sample = this.sample;
      if (self.modelInfo.model) {
        self.modelInfo.model.sampleName  = this.modelInfo.sample;
        self.modelInfo.model.setName(this.modelInfo.relationship + " " + this.modelInfo.sample);
      }
      self.$emit("sample-data-changed");
    },
    onBamUrlEntered: function(bamUrl, baiUrl) {
      let self = this;
      if (self.modelInfo && self.modelInfo.model) {
        self.modelInfo.model.onBamUrlEntered(bamUrl, baiUrl, function(success) {
          if (success) {
          } else {
          }
          self.$emit("sample-data-changed");
        })
      }
    },
    onBamFilesSelected: function(fileSelection) {
      let self = this;
      self.modelInfo.model.promiseBamFilesSelected(fileSelection)
      .then(function() {
        self.$emit("sample-data-changed");
      })
      .catch(function(error) {
        self.$emit("sample-data-changed");
      })
    },


  },
  created: function() {

  },
  mounted: function() {
    this.samples = this.modelInfo.samples;
    this.isAffected = this.modelInfo.isAffected;
    if (this.modelInfo.vcf) {
      this.onVcfUrlEntered(this.modelInfo.vcf);
    }

  }
}

</script>