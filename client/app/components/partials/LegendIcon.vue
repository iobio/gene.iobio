<style lang="sass" >
@import ../../../assets/sass/variables


</style>

<template>
  <div>
    <app-icon
     :icon="icon"
     :type="type"
     :clazz="clazz"
     :width="width"
     :height="height"
     :level="level"
     :style="iconStyle">
    </app-icon>
    <span :class="wrapLabel ? 'legend-wrap-text legend-text' : 'legend-text'"
      :style="wrapLabel ? 'width:' + (wrapWidth ? wrapWidth : '60') + 'px' : ''"
    >{{ label }}</span>
  </div>
</template>

<script>

import AppIcon from '../partials/AppIcon.vue'

export default {
  name: 'legend-icon',
  components: {
    AppIcon
  },
  props: {
    icon: null,
    type: null,
    clazz: null,
    width: null,
    height: null,
    level: null,
    label: null,
    wrapLabel: null,
    wrapWidth: null,
    iconStyle: null
  },
  data () {
    return {
    }
  }
}
</script>