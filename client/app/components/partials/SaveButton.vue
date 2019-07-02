/* Copyright 2017-2018, Frameshift Labs, Inc., All rights reserved. */
<template>
  <a
    class="analysis-save-button"
    @click.prevent="toggleSaveModal"
  >
    <i class="material-icons analysis-save-button__icon">{{ iconName }}</i>
  </a>
</template>

<script>

export default {
  name: 'SaveButton',
  props: {
    showingSaveModal: {
      type: Boolean,
      required: true,
    }
  },
  computed: {
    iconName() {
      return this.showingSaveModal ? 'keyboard_arrow_down' : 'launch';
    },
  },
  methods: {
    toggleSaveModal() {
      this.showingSaveModal ? this.$emit('save-modal:set-visibility', false) : this.$emit('save-modal:set-visibility', true);
    },
  },
};
</script>

<style lang="scss" scoped>
.analysis-save-button {
  position: fixed;
    bottom: 50px;
    right: 50px;
  width: 70px;
  height: 70px;
  border-radius: 35px;
  z-index: 9;
  background-image: linear-gradient(to right top, #0f56bb, #007dd4, #009cce, #00b7b2, #2bcd8f);
  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, .14),
              0 1px 10px 0 rgba(0, 0, 0, .12),
              0 2px 4px -1px rgba(0, 0, 0, .2);
  cursor: pointer;
  user-select: none;

  &:hover {
    text-decoration: none;
  }

  &:active {
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .14),
                0 3px 1px -2px rgba(0, 0, 0, .2),
                0 1px 5px 0 rgba(0, 0, 0, .12);
  }

  &__icon {
    display: block;
    width: 100%;
    line-height: 70px;
    text-align: center;
    color: #fff;
  }
}
</style>
