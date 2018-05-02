<style lang="sass" >
@import ../../../assets/sass/variables

.scroll-button
  color: $link-color !important
  height: 22px !important
  padding: 0px
  width: 100px
  margin: 0px !important
  margin-left: 10px


  .btn__content
    color: $link-color !important
    padding: 0px
    width: 98px
    background-color: rgba(255, 255, 255, 0.59) !important


  .material-icons
    font-size: 17px

</style>


<template>
  <div style="text-align:center">
      <v-btn flat  small class="scroll-button" v-if="showScrollDown" @click="scroll('down')">
        <v-icon>arrow_downward</v-icon>
        read more
      </v-btn>
      <v-btn flat  small class="scroll-button" v-if="showScrollUp" @click="scroll('up')">
        <v-icon>arrow_upward</v-icon>
        top
      </v-btn>
  </div>
</template>


<script>

import Vue from 'vue'

export default {
  name: 'scroll-button',
  components: {
  },
  props: {
    parentId: null
  },
  data() {
    return {
        showScrollDown: null,
        showScrollUp: null
    }
  },

  mounted: function() {
    this.showScrollButtons();
  },

  updated: function() {
    this.showScrollButtons();
  },

  methods: {
    scroll: function(dir="down") {
      let self = this;

      var topPos = $('#' + self.parentId).scrollTop();
      var scrollHeight = $('#' + self.parentId).innerHeight();
      var multiplier = 1;
      if (dir == "up") {
        multiplier =  -1;
      }
      $('#' + self.parentId).animate({
          scrollTop: (topPos + scrollHeight) * multiplier
      }, 1000, function() {
        self.showScrollButtons();
      });
    },
    showScrollButtons: function() {
      let self = this;
      var pos           = $('#' + self.parentId).scrollTop();
      var contentHeight = $('#' + self.parentId)[0].scrollHeight;
      var scrollHeight  = $('#' + self.parentId).innerHeight();

      if (scrollHeight + pos < contentHeight - 5) {
        self.showScrollDown = true;
      } else {
        self.showScrollDown = false;
      }

      if (pos == 0) {
        self.showScrollUp = false;
      } else {
        self.showScrollUp = true;
      }
    }


  }
}
</script>