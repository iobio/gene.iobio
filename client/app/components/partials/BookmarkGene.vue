<style lang="sass">
@import ../../../assets/sass/variables

.bookmark-gene
  font-size: 12px


</style>

<template>

  <div class="bookmark-gene">
    <div>
      {{ bookmarkGene.gene.gene_name }}
    </div>

    <bookmark-badge
    v-for="bookmark in bookmarkGene.bookmarks"
    :key="bookmarkModel.getKey(bookmark)"
    :bookmark="bookmark"
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
    bookmarkGene: null
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
  },
  watch: {
  }
}

</script>