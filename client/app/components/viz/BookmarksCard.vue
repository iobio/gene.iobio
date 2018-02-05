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

#bookmark-dialog-body
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

</style>

<template>
  <div id="bookmarks-card">
    Bookmarked Variants

    <div>
      <v-btn raised @click="openBookmarkFile = true">
        <v-icon>open_in_browser</v-icon>
        Open
      </v-btn>

      <v-btn v-if="bookmarkGenes && bookmarkGenes.length > 0" raised>
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
      >
      </bookmark-gene>

    </div>

    <v-dialog v-model="openBookmarkFile" max-width="400">
      <v-card>
        <v-card-title>Open bookmarks file</v-card-title>
        <v-card-text id="bookmark-dialog-body">
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
          <v-btn raised @click.native="openBookmarkFile = false">Close</v-btn>
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
      openBookmarkFile: false,
      bookmarkFileType: 'gene'
    }
  },
  methods: {
    onBookmarkFileSelected: function(fileSelection) {
      this.bookmarkModel.onBookmarkFileSelected(fileSelection, this.bookmarkFileType);
      this.openBookmarkFile = false;
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