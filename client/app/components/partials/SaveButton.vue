/* Copyright 2017-2018, Frameshift Labs, Inc., All rights reserved. */
<template>
  <a
    :class="{'analysis-save-button': true, 'dirty': isDirty}"
    @click.prevent="toggleSaveModal"
  >
    <i v-if="iconName != ''" class="material-icons analysis-save-button__icon">{{ iconName }}</i>
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
    analysis: null,
    isDirty: null
  },
  computed: {
    iconName() {
      return '';
    },
    buttonLabel() {
      if (this.analysis && this.analysis.id) {
        return "Save analysis";
      } else{ 
        return "Add analysis";
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
 
  min-width: 140px;
  width: 140px;
  height: 32px;
  z-index: 9;
  text-align: center;
  background: transparent;
  border: thin solid #bfbfbf;
  cursor: pointer;
  user-select: none;
  padding-top: 4px;

  &:hover {
    text-decoration: none;
  }


  &.dirty {
    background-color: #007dd4 !important;
    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, .14),
                0 1px 10px 0 rgba(0, 0, 0, .12),
                0 2px 4px -1px rgba(0, 0, 0, .2);
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
