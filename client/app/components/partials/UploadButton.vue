
<style scoped>
  .jbtn-file {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background-color: white !important;
    color: #717171 !important;
    height: 26px;
    font-size: 12px;
    font-weight: 600 !important;
    text-transform: uppercase !important;
  }
  .jbtn-file .btn__content {
    font-size: 12px !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
  }
  .jbtn-file input[type=file] {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    min-height: 100%;
    font-size: 100px;
    text-align: right;
    filter: alpha(opacity=0);
    opacity: 0;
    outline: none;
    cursor: inherit;
    display: block;
  }

</style>

<template>
  <v-btn dark class="btn--dark-flat-focused jbtn-file">
    {{ title }}<input id="selectFile" multiple type="file" v-on:change="fileSelected">
  </v-btn>
</template>

<script>
  export default {
    name: 'upload-button',
    props: {
      selectedCallback: Function,
      title: String
    },
    methods: {
      fileSelected(e) {
        if (this.selectedCallback) {
          if (e.target.files[0]) {
            this.selectedCallback(e);
          } else {
            this.selectedCallback(null);
          }
        }
      }
    }
  }
</script>
