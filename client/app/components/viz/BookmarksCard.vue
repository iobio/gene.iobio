<style lang="sass">
@import ../../../assets/sass/variables

#bookmarks-card
  margin: 10px

  .bookmarks-panel
    margin-top: 10px

  #edit-bookmarks
    color: $text-color
  #done-edit-bookmarks
    color: $text-color

</style>

<template>
  <div id="bookmarks-card">
    Bookmarked Variants

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
      isEditMode: false
    }
  },
  methods: {
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