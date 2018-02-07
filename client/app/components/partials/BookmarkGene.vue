<style lang="sass">
@import ../../../assets/sass/variables

.bookmark-gene
  font-size: 12px


</style>

<template>

  <div class="bookmark-gene">
    <div>
      {{ bookmarkGene.gene.gene_name }} {{ bookmarkGene.gene.chr }}
    </div>

    <bookmark-badge
    v-for="bookmark in bookmarkGene.bookmarks"
    :key="bookmarkModel.getKey(bookmark)"
    :bookmark="bookmark"
    :isEditMode="isEditMode"
    @remove-bookmark="onRemoveBookmark"
    @bookmark-selected="onBookmarkSelected"
    >
    </bookmark-badge>

  </div>

</template>

<script>

import BookmarkBadge from '../partials/BookmarkBadge.vue'


export default {
  name: 'bookmark-gene',
  components: {
    BookmarkBadge
  },
  props: {
    bookmarkModel: null,
    bookmarkGene: null,
    isEditMode: null
  },
  data () {
    return {
    }
  },
  methods: {
    onRemoveBookmark: function(bookmark) {
      this.bookmarkModel.removeBookmark(bookmark);
    },
    onBookmarkSelected: function(bookmark) {
      this.$emit("bookmark-selected", bookmark);
    }

  },
  mounted: function() {
  },
  computed: {
  },
  watch: {
  }
}

</script>