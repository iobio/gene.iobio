<style lang="sass">
@import ../../../assets/sass/variables
#sample-data-form
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

    .inform-user-text
      font-weight: bold
      color: red
      font-size: 12px
      font-style: italic
      margin: 25px 0px 25px 30px


  .sample-label
    span
      margin-top: 2px
      margin-bottom: 2px
      vertical-align: top
      margin-left: 0px
      font-size: 15px
      color: $app-color
      display: inline-block
      margin-right: 20px
    .switch
      display: inline-block
      width: 100px
</style>
<template>

 <v-layout id="sample-data-form" row wrap :class="{'ml-2': true,   'mt-3' : modelInfo.relationship != 'proband', 'mt-1' : modelInfo.relationship == 'proband'}">
    <v-flex xs12 class="sample-label" >
      <span> {{ modelInfo.relationship }} </span>

      <div :style="modelInfo.relationship == 'proband' ? 'display: flex;align-items: flex-end;margin-bottom: 20px;' : 'display: flex;align-items: flex-end;margin-bottom:15px'">
        <div style="max-width: 260px;height: 30px">
          <v-switch style="display:inline-block" label="Affected" hide-details @change="onIsAffected" v-model="isAffected">
          </v-switch>
        </div>

        <div style="margin-left:30px;max-width:160px;margin-top: -15px;" >
          <v-select v-show="modelInfo.relationship == 'proband'" 
            label="Sex"
            hide-details
            v-model="sex"
            :items="sexList"
          ></v-select>
        </div>
      </div>
    </v-flex>
    <v-flex xs12  class="ml-3" style="margin-top: -15px">
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

    <v-flex xs8   id="sample-selection">
      <div style="display: grid; grid-template-columns: 2fr 2fr">
        <v-autocomplete
          v-bind:class="samples == null || samples.length == 0 ? 'hide' : ''"
          label="Sample"
          v-model="sample"
          :items="samples"
          @input="onSampleSelected"
          hide-details
        ></v-autocomplete>
        <div class="inform-user-text" v-if="samples != null && samples.length > 0 && sample == null">
          Select a sample from the dropdown
        </div>
      </div>
      <div v-show="showLoadingSamples" style="margin-top: 10px;margin-bottom:10px">
        <span class="loader-label" style="padding-right:4px">Loading samples file vcf</span>
        <img width="20" height="20" src="../../../assets/images/wheel.gif" alt="Loading Wheel">
      </div>
    </v-flex>

    <v-flex xs12  class="ml-3 "  >
      <sample-data-file
       :defaultUrl="modelInfo.bam"
       :defaultIndexUrl="modelInfo.bai"
       :label="`bam or cram`"
       :indexLabel="`bai or crai`"
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
          'bam': '.bam and .bai files, .cram and .crai files'
        },
        fileAccept: {
          'vcf': '.vcf.gz, .tbi',
          'bam': '.bam, .bai, .cram, .crai'
        },
        samples: [],
        sample: null,
        isAffected: true,
        showLoadingSamples: false,
        sex: null,
        sexList: ['', 'male', 'female'],
    
    }
  },
  computed: {
  },
  watch: {
    sex: function() {
      this.modelInfo.sex = this.sex
      this.modelInfo.model.sex = this.sex
    }
  },
  methods: {
    onVcfUrlEntered: function(vcfUrl, tbiUrl) {
      let self = this;
      self.$set(self, "sample", null);
      self.$set(self, "samples", []);
      let tryToLoad = false;
      self.showLoadingSamples = true;

      if (self.separateUrlForIndex) {
        tryToLoad = vcfUrl && vcfUrl.length > 0 && tbiUrl && tbiUrl.length > 0
      } else {
        tryToLoad = vcfUrl && vcfUrl.length > 0
      }
      if (tryToLoad && self.modelInfo && self.modelInfo.model) {
        self.modelInfo.model.promiseLoadVcfUrl(vcfUrl, tbiUrl)
        .then(function(sampleNames) {
            self.samples = sampleNames;
            if (self.modelInfo.sample && self.samples.indexOf(self.modelInfo.sample) >= 0 ) {
              self.sample = self.modelInfo.sample;
              self.modelInfo.model.sampleName  = self.modelInfo.sample;
            } else if (self.samples.length == 1) {
              self.sample = self.samples[0];
              self.modelInfo.sample = self.sample;
              self.modelInfo.model.sampleName = self.sample;
            } else {
              self.sample = null;
              self.modelInfo.sample = null;
              self.modelInfo.model.sampleName =  null;
            }
            self.showLoadingSamples = false;
            self.$emit("samples-available", self.modelInfo.relationship, self.samples);
            self.$emit("sample-data-changed");
        })
        .catch(function(error) {
          self.showLoadingSamples = false;
          self.$emit("sample-data-changed");
          self.$emit("sample-error", error)
        })
      } else {
        self.showLoadingSamples = false;

        if (self.modelInfo && self.modelInfo.model) {
          self.modelInfo.model.promiseLoadVcfUrl(vcfUrl, tbiUrl)
          .then(function(sampleNames) {
            self.sample = null
            self.modelInfo.sample = null;
            self.modelInfo.model.sampleName = null
            self.$emit("sample-data-changed");
          })
          .catch(function(error) {
            self.showLoadingSamples = false;
            self.$emit("sample-data-changed");
            self.$emit("sample-error", error)
          })
        }
      }
    },
    onVcfFilesSelected: function(fileSelection) {
      let self = this;
      self.$set(self, "sample", null);
      self.$set(self, "samples", []);
      self.showLoadingSamples = true;
      self.modelInfo.model.promiseVcfFilesSelected(fileSelection)
      .then(function(data) {
        self.samples = data.sampleNames;
        if (self.modelInfo.sample && self.samples.indexOf(self.modelInfo.sample) >= 0 ) {
          self.sample = self.modelInfo.sample;
          self.modelInfo.model.sampleName  = self.modelInfo.sample;
        } else if (self.samples.length == 1) {
          self.sample = self.samples[0];
          self.modelInfo.sample = self.sample;
          self.modelInfo.model.sampleName = self.sample;
        } else {
          self.sample = null;
          self.modelInfo.sample = null;
          self.modelInfo.model.sampleName =  null;
        }
        self.showLoadingSamples = false;
        self.$emit("sample-data-changed");
        self.$emit("samples-available", self.modelInfo.relationship, self.samples);
      })
      .catch(function(error) {
        self.showLoadingSamples = false;
        self.$emit("sample-data-changed");
        self.$emit("sample-error", error)
      })
    },
    onIsAffected: function() {
      this.modelInfo.isAffected = this.isAffected;
      this.modelInfo.affectedStatus = this.isAffected ? 'affected' : 'unaffected';
      this.modelInfo.model.affectedStatus = this.modelInfo.affectedStatus;
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
        self.modelInfo.model.setName(this.modelInfo.sample);
      }
      self.$emit("sample-data-changed");

    },
    onBamUrlEntered: function(bamUrl, baiUrl) {
      let self = this;
      if (self.modelInfo && self.modelInfo.model) {
        self.modelInfo.model.promiseLoadBamUrl(bamUrl, baiUrl)
        .then(function() {
          self.$emit("sample-data-changed");
        })
        .catch(function(error) {
          self.$emit("sample-data-changed");
          self.$emit('sample-error', error)
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
        self.$emit("sample-error", error)

      })
    },
  },
  created: function() {
  },
  mounted: function() {
    this.samples = this.modelInfo.samples;
    this.isAffected = this.modelInfo.isAffected;
    this.sex = this.modelInfo.sex;
    if (this.modelInfo.vcf) {
      this.onVcfUrlEntered(this.modelInfo.vcf, this.modelInfo.tbi);
    }
  }
}
</script>