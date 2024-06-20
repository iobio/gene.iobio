
<style lang="sass">



@import ../../../assets/sass/variables

textarea#copy-paste-genes
  font-size: 14px

.menu__content
  .expansion-panel__header
    padding-left: 10px

#show-genes-button
  min-width: 120px
  margin: 0px
  margin-top: 10px


  .btn__content, .v-btn__content
    padding: 0px
    margin: 0px
    color: $text-color
    font-size: 16px
#enter-genes-input
  .v-messages__message
    width: 500px

#show-genes-button.icon
  min-width: 20px
  margin: 0px
  padding: 0px

  .btn__content, .v-btn__content
    padding: 0px
    margin: 0px
    color: $text-color
    font-size: 16px

    .button-label
      display: inline-block
      vertical-align: bottom

    .v-badge__badge
      background-color: $nav-badge-color !important
      left: 38px
      height: 14px
      width: 65px
      top: -17px
      border-radius: 4px

      span
        font-size: 12px !important
        color: white !important
        font-weight: 500 !important
        font-style: italic !important


#acmg-genes-button, #cancel-button,  #apply-button
  height: 30px !important

#enter-genes-input, #phenotype-input
  label
    font-weight: normal
  .success--text
    color: #FFB300 !important
    caret-color: #FFB300 !important

#acmg-genes-button
  margin-bottom: -10px
  .v-btn__content
    color:  $app-button-color
    .material-icons
      font-size: 18px
      padding-right: 2px
      color:  $app-button-color

.gene-warning-error, .gene-warning-info
  font-size: 13px
  line-height: 14px
  width:  440px
  color:  #595959
  align-items: flex-start

  pre
    display: inline-block
    vertical-align: middle
    padding-top: 0px
    padding-bottom: 0px
    font-size: 12px
    color: black
    margin-bottom: 0px
    padding-left: 2px
    padding-right: 2px
    white-space: normal

.gene-warning-error
  .v-icon
    color: #cd0c0c
    font-size: 20px
    margin-right: 10px
    max-width: 10px
.gene-warning-info
  margin-top: 10px
  margin-bottom: 5px
  .v-icon
    color: #0664b3
    font-size: 20px
    margin-right: 10px
    max-width: 10px

</style>
<style scoped>
h3 {
  margin: 40px 0 0;
}

li {
  text-align: left
}

a {
  color: #42b983;
}

.myinput {
  height: 40px;
  width: auto;
  margin: 30px;
  background-color: #e2e1ee
}

.npminstall {
  margin-left: 40px;
  margin-right: 40px;
  background-color: black;
  background-color: #f2f1fe;
  width: auto;
}

[data-placeholder]:empty:before{
  content: attr(data-placeholder);
  color: #888;
  font-style: italic;
}

#container {
    width: 640px; /*can be in percentage also.*/
    height: auto;
    margin: 0 auto;
    padding: 10px;
    position: relative;
}

</style>
<template>
    <v-menu
    offset-y
    :close-on-click="false"
    :close-on-content-click="false"
    :nudge-width="isEduMode ? 450 : 400"
    bottom
    :nudge-bottom="isEduMode ? 20 : 0"
    v-model="showGenesMenu">
      <v-btn id="show-genes-button"
       v-bind:class="clazz"
       v-bind:raised="isEduMode"
       v-bind:flat="!isEduMode"
       v-bind:small="buttonIcon != null"
       slot="activator"
       @mouseover="onMouseOver()"
       @mouseleave="onMouseLeave()"
       v-tooltip.bottom-left="{content: tooltipContent, show: showTooltipFlag, trigger: 'manual'}">
        <v-badge right  >
          <span class="button-label">
            Gene list
          </span>
          <span v-if="selectedGenePanelName"
            slot="badge">{{ selectedGenePanelShortName }}</span>
        </v-badge>
      </v-btn>
        <div  v-if="isEduMode" class="full-width" style="padding:20px">
          <div id="phenolyzer-panel" slot="header">Search by Phenotype</div>
          <div style="margin-bottom:15px;margin-left:16px;">
              <phenotype-search
              v-if="isEduMode"
              :isNav="false"
              :defaultTopGenes="isEduMode ? '6' : '30'"
              :phenotypeLabel="isEduMode ? 'Disorder' : 'Phenotype'"
              :geneModel="geneModel"
              :phenotypeLookupUrl="phenotypeLookupUrl"
              @on-search-genes="onSearchPhenolyzerGenes">
              </phenotype-search>
          </div>
        </div>
      <div class="full-width" style="padding: 10px 20px 10px 20px">
        <div v-if="!isEduMode" style="justify-content:flex-end;display:flex">
          <v-select
            :items="genePanelNames"
            :clearable="true"
            v-model="selectedGenePanelName"
            @change="onGenePanelSelected"
            label="Gene panels">
          </v-select>
        </div>
          <div id="enter-genes-input">
            <v-textarea
              id="copy-paste-genes"
              multi-line
              rows="12"
              :label="STARTING_INPUT"
              v-model="genesToApply"
              :rules="geneRules"
              :success="showWarning"
              :success-messages="warningMessage">
            </v-textarea>

            <div class="v-text-field__details" style="margin-top: -18px">
              <div class="v-messages theme--light">
                <div class="v-messages__wrapper" style="float: right">
                  {{ geneCount }}
                </div>
              </div>
            </div>
          </div>
          <div style="min-height:60px">
            <div  v-for="msg in validateMessages"  :key="msg.text"  :class="`d-flex gene-warning-` + msg.type">
              <v-icon>{{ msg.type }}</v-icon>
              <div v-html="msg.text"></div>
            </div>
          </div>

          <div v-if="isEduMode" style="display:flex;justify-content:flex-end">
                <v-btn color="#30638e" :dark="!disableApplyBtn" id="search-button" :disabled="disableApplyBtn" @click="onApplyGenes({isFromClin: false, phenotypes: searchTermPhenolyzer})">
                 Search
                </v-btn>
          </div>
          <div v-if="!isEduMode" style="display:flex;justify-content:flex-end">
                <v-btn color="#30638e" :dark="!disableApplyBtn" id="apply-button" :disabled="disableApplyBtn" @click="onApplyGenes">
                 Apply
                </v-btn>
                <v-btn id="cancel-button"  @click="onCancel">
                 Cancel
                </v-btn>
          </div>
      </div>
    </v-menu>
</template>

<script>

import PhenotypeSearch from '../partials/PhenotypeSearch.vue'
import AppIcon from '../partials/AppIcon.vue'

export default {
  name: 'genes-menu',
  components: {
    PhenotypeSearch,
    AppIcon
  },
  props: {
    geneModel: null,
    isEduMode: null,
    isBasicMode: null,
    buttonIcon: null,
    phenotypeLookupUrl: null,
    attention: null
  },
  data () {
    return {
      REC_GENE_NUMBER: 50,
      STARTING_INPUT: 'Enter gene names (<50 recommended)',
      showGenesMenu: null,
      openPhenolyzerPanel: this.isEduMode,
      genesToApply: null,
      showTooltipFlag: false,
      tooltipContent: null,
      selectedGenePanelName: null,
      validateMessages: [],
      validGenesMap: {},
      showWarning: false,
      disableApplyBtn: false,
      geneCount: 0,
      geneRules: [
        v => {
          this.disableApplyBtn = false;
          let numGenes = v ? v.toUpperCase().split(/[\s,\n]+/).filter((v, i, a) => a.indexOf(v) === i).length : 0;
          let isRec = numGenes <= this.REC_GENE_NUMBER;
          this.showWarning = !isRec;
          return isRec;
        },
        v => {
          let numGenes = v ? v.toUpperCase().split(/[\s,\n]+/).filter((v, i, a) => a.indexOf(v) === i).length : 0;
          let isValid = numGenes <= 200;
          if (!isValid) {
            this.showWarning = false;
            this.disableApplyBtn = true;
          }
          return isValid || 'Error: maximum number of genes is 200';
        }
      ],


    }
  },
  methods: {
    handleNewHighlights () {
        // Ugly hack because chrome is stupid
        // https://stackoverflow.com/questions/26962323/what-is-this-insane-space-character-google-chrome
        var h = this.customHighlight.replace(new RegExp(String.fromCharCode(32),"g"),String.fromCharCode(160));
        if (h.length > 0)
          this.highlight.unshift(h)
        this.customHighlight = ""
    },

    promiseValidateGenes: function() {
      const self = this;
      if (self.validateInProgress) {
        Promise.resolve();
      } else {

        return new Promise(function(resolve, reject) {
          self.validateInProgress = true;
          self.validateMessages = [];
          let genes = self.genesToApply ? self.genesToApply.toUpperCase().split(/[\s,\n]+/).filter((v, i, a) => a.indexOf(v) === i) : [];
          let invalids = [];
          let aliases = [];
          let promises = []
          genes.forEach((gene) => {
            if (gene && gene != "" && gene.length >= 3) {
              let p = self.promiseValidateGene(gene.toUpperCase())
              .then(function(lookupObject){
                if (!lookupObject) {
                  let item = {'geneName': gene.toUpperCase()}
                  invalids.push(item);
                } else if (lookupObject.hasOwnProperty('gene_alias')) {
                  aliases.push(lookupObject)
                }
              })
              promises.push(p)

            }
          });
          Promise.all(promises)
          .then(function() {
            let isValid = invalids.length === 0;
            let invalidMsg = ""
            if (!isValid) {
              self.showWarning = false;
              self.disableApplyBtn = true;
              invalids.forEach(function(item) {
                if (invalidMsg.length == 0) {
                  invalidMsg +=  'Correct or remove the following invalid gene names: ';
                } else {
                  invalidMsg += ", "
                }
                invalidMsg += '<pre>' + item.geneName + '</pre>';
              })
              self.validateMessages.push({'title': 'Invalid gene', 'type': 'error', 'icon': 'warning', 'text': invalidMsg})
            }
            if (aliases.length > 0) {
              let aliasMsg = "";
              aliasMsg += 'The following gene symbols will be used:  ';
              let i = 0;
              aliases.forEach(function(alias) {
                if (i > 0) {
                  aliasMsg += ", "
                }
                aliasMsg +=  '<pre>' + alias.gene_name + '</pre>' +
                            " instead of " + '<pre>' + alias.gene_alias + '</pre>';
                i++;
              })
              aliasMsg += "."
              self.validateMessages.push({'title': 'Gene alias', 'type': 'info', 'icon': 'info', 'text': aliasMsg})
            }
            self.validateInProgress = false;
            resolve(isValid)

          })
          .catch(function(error) {
            self.validateInProgress = false;
            console.log(error)
            reject(error)
          })

        })

      }
    },
    promiseValidateGene: function(geneName) {
      let self = this;
      return new Promise(function(resolve, reject) {
        let theGeneName = geneName.toUpperCase();
        let lookupObject = self.validGenesMap[theGeneName]
        if (lookupObject) {
          resolve(lookupObject)
        } else {
          self.geneModel.promiseLookupGene(theGeneName)
          .then(function(lookupObject) {
            let match = null;
            if (lookupObject && typeof(lookupObject) == 'string' && lookupObject.toUpperCase() == theGeneName) {
              match = lookupObject;
              self.validGenesMap[theGeneName] = theGeneName;
            } else if (lookupObject && lookupObject.hasOwnProperty('gene_alias') && lookupObject.gene_alias.toUpperCase() == theGeneName) {
              match = lookupObject;
              self.validGenesMap[theGeneName] = lookupObject;
            }
            if (match == null) {
              self.validGenesMap[theGeneName] = false;
            }
            resolve(match)
          })
          .catch(function(error) {
            console.log("problem validating gene")
            console.log(error)
            reject(error)
          })

        }
      })
    },

    onApplyGenes: function(options) {
      let self = this;
      if (options == null) {
        options = {isFromClin: false, phenotypes: self.phenotypeTermEntered};
      }
      self.checkForDirtyGenePanel()
      if (self.selectedGenePanelName && self.selectedGenePanelName.length > 0) {
        options.genePanel = self.selectedGenePanelName
      }
      self.$emit("apply-genes", self.replaceGeneAliases(self.genesToApply), options);
      self.showGenesMenu = false;
    },
    replaceGeneAliases: function(genesString) {
      let self = this;
      let genes = genesString ? genesString.toUpperCase().split(/[\s,\n]+/).filter((v, i, a) => a.indexOf(v) === i) : [];
      return genes.map(function(geneName) {
        let theGeneName = geneName;
        let lookupObject = self.validGenesMap[geneName.toUpperCase()];
        if (lookupObject && lookupObject.hasOwnProperty('gene_alias')) {
          theGeneName = lookupObject['gene_name']
        }
        return theGeneName;
      }).join(", ")
    },
    checkForDirtyGenePanel: function() {
      let self = this;
      function difference(setA, setB) {
        const _difference = new Set(setA);
        for (const elem of setB) {
          if (_difference.has(elem)) {
            _difference.delete(elem);
          } else {
            _difference.add(elem);
          }
        }
        return _difference;
      }
      if (self.selectedGenePanelName) {
        let v = self.genesToApply;
        let newGeneList = v ? v.toUpperCase().split(/[\s,\n]+/).filter((v, i, a) => a.indexOf(v) === i && v.trim() != "") : [];
        let genesInPanel = self.geneModel.getGenePanelGenes(self.selectedGenePanelName)
        let newGeneSet = new Set(newGeneList);
        let oldGeneSet = new Set(genesInPanel);
        if (difference(newGeneSet, oldGeneSet).size > 0) {
          self.selectedGenePanelName = null;
        }
      }
    },
    onCancel: function() {
      let self = this;
      self.showGenesMenu = false;
    },
    onACMGGenes: function() {
      this.genesToApply = this.geneModel.getGenePanelGenes("ACMG 59").join(", ")
    },
    onGenePanelSelected: function() {
      let genes = this.geneModel.getGenePanelGenes(this.selectedGenePanelName);
      if (genes && genes.length > 0) {
        this.genesToApply = genes.join(", ");
      }
    },
    onSearchPhenolyzerGenes: function(searchTerm) {
      let self = this;
      self.selectedGenePanelName = null;
      self.searchTermPhenolyzer = searchTerm;
      if (searchTerm) {
        var geneCount = self.geneModel.phenolyzerGenes.filter(function(gene) {
          return gene.selected;
        }).length;
        self.genesToApply = self.geneModel.phenolyzerGenes
        .filter(function(gene) {
          return gene.selected;
        })
        .map( function(gene) {
          return gene.geneName;
        })
        .join(", ");

      }
    },
    onClearAllGenes: function() {
      this.$emit("clear-all-genes");
    },
    onMouseOver: function() {
      if (!this.isEduMode ) {
        this.showTooltipFlag = true;
        this.tooltipContent = "Click this button to add / edit the list of genes to be analyzed.  You can add the list of ACMG genes here."
      }
    },
    onMouseLeave: function() {
      this.showTooltipFlag = false;
    },
    showTooltip: function(tooltip) {
      const self = this;
      self.showTooltipFlag = true;
      self.tooltipContent = tooltip;
    },
    hideTooltip: function() {
      this.showTooltipFlag = false;
    }
  },
  created: function() {
  },
  mounted: function() {
  },
  computed: {
    clazz: function() {
      let clazz = ""
      if (this.buttonIcon) {
        clazz += 'icon ';
      }
      if (this.attention) {
        clazz += "attention"
      }
      return clazz;
    },
    genePanelNames: function() {
      return this.geneModel.getGenePanelNames();
    },
    selectedGenePanelShortName: function() {
      if (this.selectedGenePanelName) {
        return this.geneModel.getGenePanelShortName(this.selectedGenePanelName)
      } else {
        return ""
      }
    },
    warningMessage: function() {
      if (this.showWarning) {
        return 'Warning: recommended gene count is <' + this.REC_GENE_NUMBER + ' for optimal performance';
      } else {
        return '';
      }
    }
  },
  watch: {
    showGenesMenu: function() {
      let self = this;
      if (self.showGenesMenu) {
        this.genesToApply = self.geneModel.geneNames.join(", ");
        this.hideTooltip()
      }
    },
    genesToApply: function () {
      if (this.genesToApply === this.STARTING_INPUT || this.genesToApply === '') {
        this.geneCount = 0;
      } else {
        this.geneCount = this.genesToApply.toUpperCase().split(/[\s,\n]+/).filter((v, i, a) => a.indexOf(v) === i).length;
        this.promiseValidateGenes();
      }
    }
  }
}
</script>
