<style lang="sass">
@import ../../../assets/sass/variables

#bookmarks-card
  margin: 10px

  .bookmarks-panel
    margin-top: 10px
</style>

<template>
  <div id="bookmarks-card">
    Bookmarked Variants

    <div class="bookmarks-panel">

      <bookmark-gene
      v-for="bookmarkGene in bookmarkGenes"
      :key="bookmarkGene.gene_name"
      :bookmarkGene="bookmarkGene"
      :bookmarkModel="bookmarkModel"
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