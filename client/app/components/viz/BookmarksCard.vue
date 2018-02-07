<style lang="sass">
@import ../../../assets/sass/variables

#bookmarks-card
  margin: 10px

  .bookmarks-panel
    margin-top: 10px

  button
    color: $text-color
    height: 28px
    margin-top: 10px
    margin-bottom: 10px
    margin-left: 0px
    padding-left: 0px
    padding-right: 0px
    padding-top: 0px
    padding-bottom: 0px

    i.material-icons
      font-size: 16px
      padding-right: 4px

  #edit-bookmarks
    color: $text-color
  #done-edit-bookmarks
    color: $text-color

.bookmark-dialog-body
  .card__text
    padding-top: 0px
    padding-bottom: 0px

  .radio-group.radio-group--column
    margin-top: 0px
    padding-top: 0px
    padding-bottom: 0px

    >.input-group__input
      margin-top: 0px

  .input-group--select
    .input-group__selections__comma
      font-size: 14px
      padding: 0px 0px 0px 0px

  .input-group
    label
      font-size: 14px
      line-height: 20px
      height: 20px

  .input-group__input
    min-height: 0px
    margin-top: 10px

  .input-group__input
    .input-group__selections__comma
      font-size: 14px

  .input-group--text-field
    label
      top: 6px

  .input-group.input-group--selection-controls
    height: 20px
    .input-group__input
      .icon--selection-control
        height: 0px

.bookmark-button
  color: $text-color !important
  height: 28px
  margin-top: 10px
  margin-bottom: 10px
  margin-left: 0px
  padding-left: 0px
  padding-right: 0px
  padding-top: 0px
  padding-bottom: 0px
  width: 140px

  i.material-icons
    font-size: 16px
    padding-right: 4px

</style>

<template>
  <div id="bookmarks-card">
    Bookmarked Variants

    <div>
      <v-btn raised @click="showOpenDialog = true">
        <v-icon>open_in_browser</v-icon>
        Open
      </v-btn>

      <v-btn v-if="bookmarkGenes && bookmarkGenes.length > 0" raised
        @click="showSaveDialog = true">
        <v-icon>save</v-icon>
        Save
      </v-btn>
    </div>

    <div
     v-if="bookmarkGenes && bookmarkGenes.length > 0"
     id="edit-bookmarks-box" style="clear:both;text-align:right;clear:both;">
      <a v-if="!isEditMode" href="javascript:void(0)" @click="isEditMode = true" id="edit-bookmarks">
        Edit
      </a>
      <a v-if="isEditMode" href="javascript:void(0)" @click="isEditMode = false" id="done-edit-bookmarks" >
        Done
      </a>
    </div>

    <div class="bookmarks-panel">

      <bookmark-gene
      v-for="bookmarkGene in bookmarkGenes"
      :key="bookmarkGene.gene_name"
      :bookmarkGene="bookmarkGene"
      :bookmarkModel="bookmarkModel"
      :isEditMode="isEditMode"
      @bookmark-selected="onBookmarkSelected"
      >
      </bookmark-gene>

    </div>

    <v-dialog v-model="showOpenDialog" max-width="400">
      <v-card>
        <v-card-title>Open bookmarks file</v-card-title>
        <v-card-text class="bookmark-dialog-body">
          <div id="bookmark-file" >
            <v-radio-group hide-details v-model="bookmarkFileType" >
                  <v-radio label="gene.iobio (comma separated)" value="gene"></v-radio>
                  <v-radio label="gemini (tab delimited)" value="gemini"></v-radio>
                  <v-radio label="Tab delimited" value="tsv"></v-radio>
            </v-radio-group>

            <div v-if="bookmarkFileType == 'gene'">
              <input type="text" readonly=""   placeholder="choose .csv file..." >
              <input type="file"  @change="onBookmarkFileSelected"  accept=".csv">
            </div>

            <div v-if="bookmarkFileType != 'gene'">
              <input type="text" readonly=""    placeholder="choose txt file..." >
              <input type="file"  @change="onBookmarkFileSelected"  accept=".txt, .tsv">
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn raised class="bookmark-button" @click.native="showOpenDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="showSaveDialog" max-width="400">
      <v-card>
        <v-card-title>Save bookmarks file</v-card-title>
        <v-card-text class="bookmark-dialog-body">
          <div id="bookmark-save" >
            <v-radio-group hide-details v-model="exportFormat" >
                  <v-radio label="Comma separated" value="csv"></v-radio>
                  <v-radio label="VCF" value="vcf"></v-radio>
            </v-radio-group>

          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            v-if="!readyToDownload"
            class="bookmark-button" raised @click="onSaveBookmarkFile">
            <v-icon>save</v-icon>
            Save
          </v-btn>
          <a id="download-bookmarks"
          v-bind:class="(!readyToDownload ? 'hide' : '') + ' btn bookmark-button'"
          download="gene-iobio-variants.csv" href="#">
            <i class="material-icons" style="font-size:20px">file_download</i>
            <span>Download file</span>
          </a>
          <v-btn class="bookmark-button" raised @click="showSaveDialog = false;readyToDownload = false;">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>

import BookmarkGene from '../partials/BookmarkGene.vue'

export default {
  name: 'bookmarks-card',
  components: {
    BookmarkGene
  },
  props: {
    bookmarkModel: null
  },
  data () {
    return {
      isEditMode: false,
      showOpenDialog: false,
      showSaveDialog: false,
      exportFormat: 'csv',
      bookmarkFileType: 'gene',
      readyToDownload: false
    }
  },
  methods: {
    onBookmarkFileSelected: function(fileSelection) {
      this.bookmarkModel.onBookmarkFileSelected(fileSelection, this.bookmarkFileType);
      this.showOpenDialog = false;
    },
    onSaveBookmarkFile: function() {
      let self = this;
      this.bookmarkModel.promiseExportBookmarks(self.exportFormats)
      .then(function(output) {
        utility.createDownloadLink("#download-bookmarks",
          output,
          "gene-iobio-bookmarked-variants." + self.exportFormat );
        self.readyToDownload = true;
      })
    },
    onBookmarkSelected: function(bookmark) {
      this.$emit("bookmark-selected", bookmark);
    }
  },
  mounted: function() {

  },
  computed: {
    bookmarkGenes: function() {
      if (this.bookmarkModel && this.bookmarkModel.bookmarks) {
        let genes = {};
        this.bookmarkModel.bookmarks.forEach(function(bookmark) {
          let theGene = genes[bookmark.gene.gene_name];
          if (theGene == null) {
            theGene = {};
            theGene.gene = bookmark.gene;
            theGene.bookmarks = [];
            genes[bookmark.gene.gene_name] = theGene;
          }
          theGene.bookmarks.push(bookmark);
        })
        let geneNames = Object.keys(genes).sort();
        let bookmarkGenes = geneNames.map(function(geneName) {
          return genes[geneName];
        })
        let i = 0;
        bookmarkGenes.forEach(function(bookmarkGene) {
          bookmarkGene.bookmarks.forEach(function(bookmark) {
            bookmark.index = i;
            i++;
          })
        })
        return bookmarkGenes;
      } else {
        return [];
      }

    }
  },
  watch: {
  }
}

</script>