/* Copyright 2017-2018, Frameshift Labs, Inc., All rights reserved. */
<template>
  <a
    class="analysis-save-button"
    @click.prevent="toggleSaveModal"
  >
    <i class="material-icons analysis-save-button__icon">{{ iconName }}</i>
    <span class="button-label">{{ buttonLabel }}</span>
  </a>
</template>

<script>

export default {
  name: 'SaveButton',
  props: {
    showingSaveModal: {
      type: Boolean,
      required: true,
    },
    analysis: null
  },
  computed: {
    iconName() {
      return  (this.analysis && this.analysis.id) ? 'edit' : 'add';
    },
    buttonLabel() {
      if (this.analysis && this.analysis.id) {
        return "Mosaic Analysis";
      } else{ 
        return "Add to Mosaic";
      }
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
    top: 13px;
    right: 120px !important;
  width: 150px;
  height: 30px;
  z-index: 9;
  text-align: center;
  background: #007dd4;
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
    line-height: 30px;
    color: #fff;
  }

  i.material-icons {
    font-size: 18px;
  }

  .button-label {
    color: white;
  }
}
</style>
