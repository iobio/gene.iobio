<style lang="sass" >
  .file-component
    label
      font-size: 12px !important

    .input-group--text-field
      margin-top: 0px !important

      input
        font-size: 11px !important

    .input-group--text-field.input-group--dirty.input-group--select
      label
        -webkit-transform: translate(0, -18px) scale(0.95)
        transform: translate(0, -18px) scale(0.95)

    .input-group--text-field.input-group--dirty:not(.input-group--textarea)
      label
        -webkit-transform: translate(0, -18px) scale(0.95)
        transform: translate(0, -18px) scale(0.95)
</style>
<template>

  <v-layout row wrap class=" file-component ">
    <v-flex xs9>
      <v-text-field
        v-if="fileType == 'url'"
        v-bind:label="'Enter ' + label +  ' URL'"
        hide-details
        v-model="url"
        @change="onUrlChange"
      ></v-text-field>
    </v-flex>

    <v-flex xs3 class="mt-2" >
      or
      <upload-button title="Browse" :selectedCallback="onFileSelected">
      </upload-button>
    </v-flex>

    <v-flex xs12 >
      <span> {{ fileName }} </span>
    </v-flex>
  </v-layout>


</template>

<script>

import { Typeahead }       from 'uiv'
import UploadButton from '../partials/UploadButton.vue'

export default {
  name: 'sample-data-file',
  components: {
    Typeahead,
    UploadButton
  },
  props: {
    defaultUrl: null,
    label: null,
    filePlaceholder: null,
    fileAccept: null
  },
  data () {
    return {
        isValid: false,
        fileType: 'url',
        url: null,
        fileName: null
    }
  },
  watch: {
    defaultUrl: function() {
      this.url = this.defaultUrl;
    }
  },
  methods: {
    onFileSelected: function(event) {
      if (event.target.files.length > 0) {
        this.fileName = event.target.files[0].name;
        this.url = '';
      }
      this.$emit("file-selected", event.target);
    },
    onUrlChange: _.debounce(function (newUrl) {
      if (newUrl && newUrl.length > 0) {
        this.fileName = '';
      }
      this.$emit('url-entered', newUrl);
    }, 100)
  },
  created: function() {
    this.url = this.defaultUrl;
  }
}

</script>