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
      <bookmark-badge
      v-for="(bookmark, index) in bookmarkModel.bookmarks"
      :key="bookmarkModel.getKey(bookmark)"
      :bookmark="bookmark"
      :index="index"
      >
      </bookmark-badge>
    </div>
  </div>
</template>

<script>

import BookmarkBadge from '../partials/BookmarkBadge.vue'

export default {
  name: 'bookmarks-card',
  components: {
    BookmarkBadge
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
    }
  },
  watch: {
  },
  computed: {
  }
}

</script>