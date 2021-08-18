<style lang="sass" >
  .file-component
    label
      font-size: 12px !important

    .input-group--text-field, .input-group__input
      margin-top: 0px !important

      input
        font-size: 11px !important

    .input-group--text-field.input-group--dirty.input-group--select,
    .input-group__input
      label
        -webkit-transform: translate(0, -18px) scale(0.95)
        transform: translate(0, -18px) scale(0.95)

    .input-group--text-field.input-group--dirty:not(.input-group--textarea),
    .input-group__input.input-group--dirty:not(.input-group--textarea)
      label
        -webkit-transform: translate(0, -18px) scale(0.95)
        transform: translate(0, -18px) scale(0.95)
    .btn--floating.btn--small
        height: 20px
        width: 20px

    #clear-file-button
      color: #82b1ff
      font-size: 12px
      font-style: italic
      margin: 0px



</style>
<template>

  <v-layout row wrap class=" file-component ">
    <v-flex xs9>
      <v-text-field
        v-if="fileType == 'url'"
        v-bind:label="'Enter ' + label +  ' URL' + (label === 'bam/cram' ? ' (optional)' : '')"
        hide-details
        v-model="url"
        @change="onUrlChange"
      ></v-text-field>
      <div>
        <span> {{ fileName }} </span>
        <v-btn small flat id="clear-file-button"
        @click="clearFile"
        v-if="fileName != null && fileName.length > 0">
          Clear
        </v-btn>
      </div>
    </v-flex>
    <v-flex xs3>
      <br>
      or
      <file-chooser  class="ml-1"
      title="Choose files"
      :isMultiple="true"
      :showLabel="false"
      @file-selected="onFileSelected">
      </file-chooser>
    </v-flex>

    <v-flex xs9>
      <v-text-field
        v-if="fileType == 'url' && (separateUrlForIndex || indexUrl)"
        v-bind:label="'Enter ' + indexLabel +  ' URL' + (indexLabel === 'bai/crai' ? ' (optional)' : '')"
        hide-details
        v-model="indexUrl"
        @change="onUrlChange"
      ></v-text-field>
      <div>
        <span> {{ indexFileName }} </span>
        <v-btn small flat id="clear-file-button"
        @click="clearFile"
        v-if="indexFileName != null && indexFileName.length > 0">
          Clear
        </v-btn>
      </div>
    </v-flex>
    <v-flex xs3>
      <br>
      or
      <file-chooser  class="ml-1"
      title="Choose files"
      :isMultiple="true"
      :showLabel="false"
      @file-selected="onIndexFileSelected">
      </file-chooser>
    </v-flex>
  
  </v-layout>


</template>

<script>

import { Typeahead }       from 'uiv'
import FileChooser from '../partials/FileChooser.vue'

export default {
  name: 'sample-data-file',
  components: {
    Typeahead,
    FileChooser
  },
  props: {
    defaultUrl: null,
    defaultIndexUrl: null,
    label: null,
    indexLabel: null,
    filePlaceholder: null,
    fileAccept: null,
    separateUrlForIndex: null
  },
  data () {
    return {
        isValid: false,
        fileType: 'url',
        url: null,
        indexUrl: null,
        fileName: null,
        indexFileName: null
    }
  },
  watch: {
    defaultUrl: function() {
      this.url = this.defaultUrl;
      this.indexUrl = this.defaultIndexUrl;
    }
  },
  methods: {
    onFileSelected: function(event) {
      if (event.target.files.length > 0) {
        this.fileName = event.target.files[0].name;
        this.url = '';
        this.indexUrl = '';
      }
      this.$emit("file-selected", event.target);
    },
    onIndexFileSelected: function(event) {
      if (event.target.files.length > 0) {
        this.indexFileName = event.target.files[0].name;
        this.url = '';
        this.indexUrl = '';
      }
      this.$emit("index-file-selected", event.target);
    },
    onUrlChange: _.debounce(function (newUrl) {
      if (newUrl && newUrl.length > 0) {
        this.fileName = '';
      }
      this.$emit('url-entered', this.url, this.indexUrl);
    }, 100),
    clearFile: function() {
      this.fileName = '';
      this.$emit("file-selected");
    },
    clearIndexFile: function(){
      this.indexFileName = '';
      this.$emit("index-file-selected");
    }
  },
  created: function() {
    this.indexUrl = this.defaultIndexUrl;
    this.url = this.defaultUrl;
  }
}

</script>