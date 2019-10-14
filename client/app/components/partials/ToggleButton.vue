<style lang="sass" >
@import ../../../assets/sass/variables

#toggle-button-container
  display: flex

  #toggle-button
    padding: 1px

  #toggle-button-label
    padding-right: 4px
    font-size: 12px

  .button-strip
      height: 15px
      border: 1px solid #949494
      border-radius: 2px
      display: flex



  .strip-button
      background-color: white
      width: 50%
      height: 100%
      text-align: center
      vertical-align: middle
      line-height: 14px
      transition: background-color .4s linear, color .2s linear
      cursor: pointer


  .strip-button-text
      color: #636363
      width: 50%
      height: 100%
      text-align: center
      vertical-align: middle
      line-height: 14px
      transition: background-color .4s linear, color .2s linear
      cursor: pointer
      font-size: 12px

  .active-strip-button
      background-color: #618eab
      color: white


  .active-strip-button .strip-button-text
    color: white
    font-weight: 500




</style>



<template>

  <div id="toggle-button-container">
    <span id="toggle-button-label" >{{ label }}</span>
    <div id="toggle-button" :style="toggleButtonStyle" ></div>
  </div>

</template>

<script>

export default {
    name: 'toggle-button',
    props: {
      label: null,
      name1: null,
      name2: null,
      buttonWidth: null
    },
    data() {
      return {
        toggleButton: null
      }
    },
    watch: {
    },
    created() {
    },
    mounted() {
      this.init();
    },
    computed: {
      toggleButtonStyle: function() {
        let self = this;
        if (self.buttonWidth) {
          return {'width': self.buttonWidth + "px"};
        } else {
          return "{}";
        }
      }
    },
    methods: {
      init: function() {
        let self = this;

        self.toggleButton = new ButtonStrip({
          id: 'the-toggle-button'
        });
        self.toggleButton.addButton(self.name1, true, 'click', function(){
          self.$emit("click", self.name1)
        });
        self.toggleButton.addButton(self.name2, false, 'click', function(){
          self.$emit("click", self.name2)
        });
        self.toggleButton.append('#toggle-button');

      }
    }
}

</script>