class Translator {

  constructor() {


    this.clinvarMap     = {
              'pathogenic'            : {value: 1,   badge: true, examineBadge: true, clazz: 'clinvar_path', symbolFunction: this.showClinVarSymbol},
              'pathogenic/likely_pathogenic' :
                                        {value: 2,   badge: true, examineBadge: true, clazz: 'clinvar_path', symbolFunction: this.showClinVarSymbol},
              'likely_pathogenic'     : {value: 3,   badge: true, examineBadge: true, clazz: 'clinvar_lpath', symbolFunction: this.showClinVarSymbol},
              'uncertain_significance': {value: 4,   badge: true, examineBadge: true, clazz: 'clinvar_uc', symbolFunction: this.showClinVarSymbol},
              'conflicting_interpretations_of_pathogenicity':
                                        {value: 4,   badge: true, examineBadge: true, clazz: 'clinvar_cd', symbolFunction: this.showClinVarSymbol},
              'conflicting_data_from_submitters':
                                        {value: 5,   badge: true,  examineBadge: true, clazz: 'clinvar_cd', symbolFunction: this.showClinVarSymbol},
              'drug_response'         : {value: 131, badge: false, examineBadge: true, clazz: 'clinvar_other', symbolFunction: this.showClinVarSymbol},
              'confers_sensitivity'   : {value: 131, badge: false, examineBadge: true, clazz: 'clinvar_other', symbolFunction: this.showClinVarSymbol},
              'risk_factor'           : {value: 131, badge: false, examineBadge: true, clazz: 'clinvar_other', symbolFunction: this.showClinVarSymbol},
              'other'                 : {value: 131, badge: false, examineBadge: true, clazz: 'clinvar_other', symbolFunction: this.showClinVarSymbol},
              'association'           : {value: 131, badge: false, examineBadge: true, clazz: 'clinvar_other', symbolFunction: this.showClinVarSymbol},
              'protective'            : {value: 131, badge: false, examineBadge: true, clazz: 'clinvar_other', symbolFunction: this.showClinVarSymbol},
              'not_provided'          : {value: 131, badge: false, examineBadge: true, clazz: 'clinvar_other', symbolFunction: this.showClinVarSymbol},
              'likely_benign'         : {value: 141, badge: false, examineBadge: true, clazz: 'clinvar_lbenign', symbolFunction: this.showClinVarSymbol},
              'benign/likely_benign'  : {value: 141, badge: false, examineBadge: true, clazz: 'clinvar_lbenign', symbolFunction: this.showClinVarSymbol},
              'benign'                : {value: 151, badge: false, examineBadge: true, clazz: 'clinvar_benign', symbolFunction: this.showClinVarSymbol},
              'none'                  : {value: 161, badge: false, examineBadge: false, clazz: ''}
                       };
    this.impactMap = {  HIGH:     {value: 1, badge: true, clazz: 'impact_HIGH',     symbolFunction: this.showImpactSymbol},
                        MODERATE: {value: 2, badge: true, clazz: 'impact_MODERATE', symbolFunction: this.showImpactSymbol},
                        MODIFIER: {value: 3, badge: false, clazz: 'impact_MODIFIER', symbolFunction: this.showImpactSymbol},
                        LOW:      {value: 4, badge: false, clazz: 'impact_LOW',      symbolFunction: this.showImpactSymbol},
                        none:     {value: 5, badge: false, clazz: 'impact_none',      symbolFunction: this.showImpactSymbol}
                     };
    this.highestImpactMap = {
                      HIGH:     {value: 1, badge: true, clazz: 'impact_HIGH',     symbolFunction: this.showHighestImpactSymbol},
                        MODERATE: {value: 2, badge: true, clazz: 'impact_MODERATE', symbolFunction: this.showHighestImpactSymbol},
                        MODIFIER: {value: 3, badge: false, clazz: 'impact_MODIFIER', symbolFunction: this.showHighestImpactSymbol},
                        LOW:      {value: 4, badge: false, clazz: 'impact_LOW',      symbolFunction: this.showHighestImpactSymbol}
                     };
    this.siftMap = {
                      deleterious:                 {value: 1, badge: true, clazz: 'sift_deleterious', symbolFunction: this.showSiftSymbol},
                      deleterious_low_confidence:  {value: 2, badge: true, clazz: 'sift_deleterious_low_confidence', symbolFunction: this.showSiftSymbol},
                      tolerated_low_confidence: {value: 3, badge: false, clazz: 'sift_tolerated_low_confidence',symbolFunction: this.showSiftSymbol},
                      tolerated:    {value: 102, badge: false, clazz: 'sift_tolerated',symbolFunction: this.showSiftSymbol},
                      unknown:      {value: 103, badge: false, clazz: ''},
                      none:         {value: 103, badge: false, clazz: ''}
                    };
    this.polyphenMap = {
                      probably_damaging:    {value: 1, badge: true, clazz: 'polyphen_probably_damaging', symbolFunction: this.showPolyPhenSymbol},
                      possibly_damaging:    {value: 2, badge: true, clazz: 'polyphen_possibly_damaging', symbolFunction: this.showPolyPhenSymbol},
                      benign:               {value: 103, badge: false, clazz: 'polyphen_benign',            symbolFunction:this.showPolyPhenSymbol},
                      unknown:              {value: 104, badge: false, clazz: ''},
                      none:                 {value: 104, badge: false, clazz: ''}
                       };
    this.inheritanceMap = {
                      denovo:    {value: 1, badge: true, clazz: 'denovo',    display: 'de novo', symbolFunction: this.showDeNovoSymbol},
                      recessive: {value: 2, badge: true, clazz: 'recessive', display: 'recessive', symbolFunction: this.showRecessiveSymbol},
                      none:      {value: 3, badge: false, clazz: 'noinherit', display: '', symbolFunction: this.showNoInheritSymbol}
                       };
    this.zygosityMap = {
                      HOM:        {value: 1, badge: true,  clazz: 'zyg_hom',        symbolFunction: this.showHomSymbol},
                      HET:        {value: 2, badge: false, clazz: 'het'        },
                      HOMREF:     {value: 3, badge: false, clazz: 'homref'     },
                      gt_unknown: {value: 4, badge: false, clazz: 'gt_unknown' }
                       };
    this.bookmarkMap = {
                      Y: {value: 1, badge: true,  clazz: 'bookmark',  symbolFunction: this.showBookmarkSymbol},
                      N: {value: 2, badge: false, clazz: '',          symbolFunction: this.showBookmarkSymbol}
                       };
    this.unaffectedMap = {
                          present_some:   {value: 104, badge: false, clazz: 'unaffected', symbolFunction: this.showAffectedPresentSymbol},
                          present_all:    {value: 104, badge: false, clazz: 'unaffected', symbolFunction: this.showAffectedPresentSymbol},
                          present_none:   {value: 104, badge: false, clazz: 'unaffected', symbolFunction: this.showAffectedPresentSymbol},
                          none:           {value: 104, badge: false, clazz: 'unaffected', symbolFunction: ''}
                   };
    this.affectedMap = {
                          present_all:    {value: 3,   badge: true,  clazz: 'affected',  symbolFunction: this.showAffectedPresentSymbol},
                          present_some:   {value: 4,   badge: true,  clazz: 'affected',  symbolFunction: this.showAffectedPresentSymbol},
                          present_none:   {value: 104, badge: false, clazz: 'affected',  symbolFunction: this.showAffectedPresentSymbol},
                          none:           {value: 104, badge: false, clazz: 'affected',  symbolFunction: ''}
                   };
      this.harmfulVariantMap = {
                          1:    {value: 1,   badge: true,  clazz: 'harmful1-variant',  symbolFunction: this.showHarmfulVariantSymbol},
                          2:    {value: 2,   badge: true,  clazz: 'harmful2-variant',  symbolFunction: this.showHarmfulVariantSymbol},
                          3:    {value: 3,   badge: true,  clazz: 'harmful3-variant',  symbolFunction: this.showHarmfulVariantSymbol},
                          none: {value: 101, badge: false, clazz: '',                  symbolFunction: ''}
                   };
    // For af range, value must be > min and <= max
    this.afHighestMap = [ {min: -100.1, max: -100,   value: +99, badge: false, clazz: '',    symbolFunction: ''},
                         {min: -1.1,   max: +0,        value: +2,  badge: true, clazz: 'afhighest_rare',    symbolFunction: this.showAfRareSymbol},
                         {min: -1.1,   max: +.0001,    value: +3,  badge: true, clazz: 'afhighest_rare',    symbolFunction: this.showAfRareSymbol},
                         {min: -1.1,   max: +.001,     value: +4,  badge: true, clazz: 'afhighest_rare',    symbolFunction: this.showAfRareSymbol},
                         {min: -1.1,   max: +.01,      value: +5,  badge: true, clazz: 'afhighest_rare',    symbolFunction: this.showAfRareSymbol},
                         {min: -1.1,   max: +.05,      value: +6,  badge: true, clazz: 'afhighest_rare',    symbolFunction: this.showAfRareSymbol},
                         {min: +.05,   max: +1,        value: +7,  badge: false,clazz: '',    symbolFunction: ''},
                        ];

  }


  showHarmfulVariantSymbol(selection, options) {
    var width, height, clazz;
    options = options || {};

    var datumAttrs = selection.datum() || {};

    var attrs = {
      width: "13",
      height: "13",
      transform: datumAttrs.rank && datumAttrs.rank == 1 ? "translate(2,3)" : "translate(2,2)",
      clazz: ""
    };


    var cellSizeAttrs = {};
    if (options.cellSize > 18) {
      cellSizeAttrs.width = "16",
      cellSizeAttrs.height = "16",
      cellSizeAttrs.transform = datumAttrs.rank && datumAttrs.rank == 1 ? "translate(2,3)" : "translate(2,2)"
    }

    $.extend(attrs, datumAttrs, cellSizeAttrs, options);

    selection.append("g")
             .attr("transform", attrs.transform)
             .append("use")
             .attr("xlink:href", datumAttrs.rank == 1 ? "#lightning-symbol" : "#error-symbol")
             .attr("class", attrs.clazz)
             .attr("width",  datumAttrs.rank == 1 ? attrs.width - 2  : attrs.width )
             .attr("height", datumAttrs.rank == 1 ? attrs.height - 2 : attrs.height)
             .style("pointer-events", "none");
  };

  showClinVarSymbol(selection, options) {
    var width, height, clazz;
    options = options || {};

    var attrs = {
      width: "14",
      height: "14",
      transform: "translate(2,1)",
      clazz: ""
    };

    var datumAttrs = selection.datum() || {};

    var cellSizeAttrs = {};
    if (options.cellSize > 18) {
      cellSizeAttrs.width = "17",
      cellSizeAttrs.height = "17",
      cellSizeAttrs.transform = "translate(2,2)"
    }

    $.extend(attrs, datumAttrs, cellSizeAttrs, options);

    var colors = {
      clinvar_path: "#ad494A",
      clinvar_lpath: "#FB7737",
      clinvar_uc: "rgba(231,186,82,1)",
      clinvar_benign: "rgba(156,194,49,1)",
      clinvar_lbenign: "rgba(181,207,107,1)",
      clinvar_other: "rgb(189,189,189)",
      clinvar_cd: "rgb(111, 182, 180)"
    };

    selection.append("g")
             .attr("transform", attrs.transform)
             .append("use")
             .attr("xlink:href", "#clinvar-symbol")
             .attr("width", attrs.width)
             .attr("height", attrs.height)
             .style("pointer-events", "none")
             .style("fill", colors[attrs.clazz]);
  };

  showPolyPhenSymbol(selection, options) {
    options = options || {};
    var attrs = {
      transform: "translate(2,2)",
      width: "13",
      height: "13",
      clazz: ""
    };

    var cellSizeAttrs = {};
    if (options.cellSize > 18) {
      cellSizeAttrs.width = "17",
      cellSizeAttrs.height = "17",
      cellSizeAttrs.transform = "translate(2,2)"
    }

    var datumAttrs = selection.datum() || {};

    $.extend(attrs, datumAttrs, options, cellSizeAttrs);

    var colors = {
      polyphen_probably_damaging: "#ad494A",
      polyphen_possibly_damaging: "#FB7737",
      polyphen_benign: "rgba(181, 207, 107,1)"
    };

    selection.append("g")
             .attr("transform", attrs.transform)
             .append("use")
             .attr("xlink:href", "#biohazard-symbol")
             .attr("width", attrs.width)
             .attr("height", attrs.height)
             .style("pointer-events", "none")
             .style("fill", colors[attrs.clazz]);

  };

  showSiftSymbol(selection, options) {
    options = options || {};
    var attrs = {
      transform: "translate(2,2)",
      width: "14",
      height: "14",
      clazz: ""
    };

    var cellSizeAttrs = {};
    if (options.cellSize > 18) {
      cellSizeAttrs.width = "17",
      cellSizeAttrs.height = "17",
      cellSizeAttrs.transform = "translate(2,2)"
    }

    var datumAttrs = selection.datum() || {};

    $.extend(attrs, datumAttrs, options, cellSizeAttrs);

    var colors = {
      sift_deleterious: "#ad494A",
      sift_deleterious_low_confidence: "#FB7737",
      sift_tolerated_low_confidence: "rgba(231,186,82,1)",
      sift_tolerated: "rgba(181, 207, 107,1)"
    };

    selection.append("g")
             .attr("transform", attrs.transform)
             .append("use")
             .attr("xlink:href", "#danger-symbol")
             .attr("width", attrs.width)
             .attr("height", attrs.height)
             .style("pointer-events", "none")
             .style("fill", colors[attrs.clazz]);
  };

  showMutationTasterSymbol(selection, options) {
    options = options || {};
    var attrs = {
      transform: "translate(2,2)",
      width: "14",
      height: "14",
      clazz: ""
    };

    var cellSizeAttrs = {};
    if (options.cellSize > 18) {
      cellSizeAttrs.width = "17",
      cellSizeAttrs.height = "17",
      cellSizeAttrs.transform = "translate(2,2)"
    }

    var datumAttrs = selection.datum() || {};

    $.extend(attrs, datumAttrs, options, cellSizeAttrs);

    var colors = {
      mt_disease_causing_auto: "#ad494A",
      mt_disease_causing:      "#FB7737",
      mt_polymorphism:         "rgba(231,186,82,1)",
      mt_polymorphism_auto:    "rgba(181, 207, 107,1)"
    };

    selection.append("g")
             .attr("transform", attrs.transform)
             .append("use")
             .attr("xlink:href", "#danger-symbol")
             .attr("width", attrs.width)
             .attr("height", attrs.height)
             .style("pointer-events", "none")
             .style("fill", colors[attrs.clazz]);
  };


  showAfSymbol(selection, options) {
    var symbolDim   = { transform: "translate(2,2)",    size: "12" };
    if (options.cellSize > 18) {
      symbolDim   = { transform: "translate(2,2)",    size: "17" };
    }
    var symbolAttrs = {
      af_unique:    { fill: "rgb(199, 0, 1)",          transform: symbolDim.transform,   size: symbolDim.size},
      af_uberrare:  { fill: "rgba(204, 28, 29, 0.79)", transform: symbolDim.transform,   size: symbolDim.size},
      af_superrare: { fill: "rgba(255, 44, 0, 0.76)",  transform: symbolDim.transform,   size: symbolDim.size},
      af_rare:      { fill: "rgb(247, 138, 31)",       transform: symbolDim.transform,   size: symbolDim.size},
      af_uncommon:  { fill: "rgb(224, 195, 128)",      transform: symbolDim.transform,   size: symbolDim.size},
      af_common:    { fill: "rgb(189,189,189)",        transform: symbolDim.transform,   size: symbolDim.size}
    }
    // For the gene badge, we will display in a smaller size
    if (options && options.hasOwnProperty('transform')) {
      symbolAttrs[selection.datum().clazz].transform = options.transform;
    }
    if (options && options.hasOwnProperty('height')) {
      symbolAttrs[selection.datum().clazz].size = options.height;
    }
    selection.append("g")
      .attr("class", function(d, i)    { return d.clazz; })
      .attr("transform", function(d,i) { return symbolAttrs[d.clazz].transform; })
      .append("use")
      .attr("xlink:href", "#af-symbol")
      .style("pointer-events", "none")
      .style("fill", function(d,i)  { return symbolAttrs[d.clazz].fill; })
      .attr("width", function(d,i)  { return symbolAttrs[d.clazz].size; })
      .attr("height", function(d,i) { return symbolAttrs[d.clazz].size; });
  };

  showAfRareSymbol(selection, options) {
    var symbolDim   = { transform: "translate(2,2)",    size: "12" };
    if (options.cellSize > 18) {
      symbolDim   = { transform: "translate(2,2)",    size: "17" };
    }
    var symbolAttrs = {
      afhighest_rare:  { fill: "rgba(204, 28, 29, 0.79)", transform: symbolDim.transform,   size: symbolDim.size}
    }
    // For the gene badge, we will display in a smaller size
    if (options && options.hasOwnProperty('transform')) {
      symbolAttrs[selection.datum().clazz].transform = options.transform;
    }
    if (options && options.hasOwnProperty('height')) {
      symbolAttrs[selection.datum().clazz].size = options.height;
    }
    selection.append("g")
      .attr("class", function(d, i)    { return d.clazz; })
      .attr("transform", function(d,i) { return symbolAttrs[d.clazz].transform; })
      .append("use")
      .attr("xlink:href", "#af-symbol")
      .style("pointer-events", "none")
      .style("fill", function(d,i)  { return symbolAttrs[d.clazz].fill; })
      .attr("width", function(d,i)  { return symbolAttrs[d.clazz].size; })
      .attr("height", function(d,i) { return symbolAttrs[d.clazz].size; });
  };

  showHomSymbol(selection, options) {
    var symbolOptions = {x: 0, y: 7, fontSize: "6.5px", width: 15, height: 10};
    if (options.cellSize > 18) {
      symbolOptions = {x: 0, y: 10, fontSize: "9px",  width: 19, height: 14};
    }
    var g = selection.append("g")
                     .attr("transform", "translate(1,4)");

    g.append("rect")
     .attr("width", symbolOptions.width)
     .attr("height", symbolOptions.height)
     .attr("class", "zyg_hom " + selection.datum().clazz)
     .style("pointer-events", "none");

    g.append("text")
     .attr("x", symbolOptions.x)
     .attr("y", symbolOptions.y)
     .style("fill", "white")
     .style("font-weight", "bold")
     .style("font-size", symbolOptions.fontSize)
     .text("Hom");
  };

  showRecessiveSymbol(selection, options) {
    options = options || {};
    var width = (options.cellSize > 18) ? "19" : (options.width || "16");

    selection.append("g")
             .attr("transform", options.transform || "translate(1,2)")
             .append("use")
             .attr("xlink:href", '#recessive-symbol')
             .attr("width", width)
             .attr("height", width)
             .style("pointer-events", "none");
  };

  showDeNovoSymbol(selection, options) {
    options = options || {};

    var width = (options.cellSize > 18) ? "19" : (options.width || "16");

    var transform = (options.cellSize > 18) ? "translate(1,2)" : (options.transform || "translate(1,0)");

    selection.append("g")
             .attr("transform", transform)
             .append("use")
             .attr("xlink:href", '#denovo-symbol')
             .attr("width", width)
             .attr("height", width)
             .style("pointer-events", "none");

  };


  showTextSymbol(selection, options) {
    var translate = options.cellSize > 18 ? "translate(3,0)" : "translate(0,0)";
    var text =  selection.append("g")
                   .attr("transform", translate)
                   .append("text")
                   .attr("class", function(d,i) {
                      if (selection.datum().clickFunction) {
                        return "clickable";
                      } else {
                        return "";
                      }
                   })
                   .attr("x", 0)
                   .attr("y", isLevelBasic ? 14 : 11)
                   .attr("dy", "0em")
                   .text(selection.datum().value)

    MatrixCard.wrap(text, options.cellSize, 3);
  };

  showNumericSymbol(selection, options) {
    var translate = options.cellSize > 18 ? "translate(0,4)" : "translate(0,0)";
    var text =  selection.append("g")
                   .attr("transform", translate)
                   .append("text")
                   .attr("class", function(d,i) {
                    if (selection.datum().clickFunction) {
                      return "clickable";
                    } else {
                      return "";
                    }
                 })
                   .attr("x", 0)
                   .attr("y", isLevelBasic ? 14 : 11)
                   .attr("dy", "0em")
                   .text(selection.datum().value);
    MatrixCard.wrap(text, options.cellSize, 3, options.cellSize - 1);
  };


  showAffectedPresentSymbol(selection, options) {
    var symbolLink = null;
    var id = "thumbs-grey-symbol";

    if ( selection.datum().clazz == "affected") {
      if (selection.datum().value == "present_all") {
        symbolLink = '#thumbs-up-symbol';
        id = "thumbs-green-symbol";
      } else if (selection.datum().value == "present_some") {
        symbolLink = '#question-mark-symbol';
      } else if (selection.datum().value == "present_none") {
        symbolLink = '#thumbs-down-symbol';
      }
    } else if (selection.datum().clazz == "unaffected") {
      if (selection.datum().value == "present_all") {
        symbolLink = '#thumbs-down-symbol';
      } else if (selection.datum().value == "present_some") {
        symbolLink = '#question-mark-symbol';
      } else if (selection.datum().value == "present_none") {
        symbolLink = '#thumbs-up-symbol';
        id = "thumbs-green-symbol";
      }
    }

    selection.append("g")
                     .attr("id", id)
                 .attr("transform",  "translate(1,2)")
                 .append("use")
                 .attr("xlink:href", symbolLink)
                 .attr("width",   options && options.cellSize > 18 ? "16" : "14")
                 .attr("height",  options && options.cellSize > 18 ? "16" : "14")
                 .style("pointer-events", "none");


  };

  showNoInheritSymbol(selection) {

  };

  showBookmarkSymbol(selection, options) {
    var optionsSize = options && options.cellSize && options.cellSize > 18 ? 16 : 11;
    if (selection.datum().clazz) {
      selection.append("g")
         .attr("class", selection.datum().clazz)
             .attr("transform", selection.datum().translate || "translate(2,2)")
             .append("use")
             .attr("xlink:href", '#bookmark-symbol')
             .attr("width",  selection.datum().width || optionsSize)
             .attr("height", selection.datum().height || optionsSize)
             .style("pointer-events", "none")
             .style("cursor", "pointer");

    }
  }

  showPhenotypeSymbol(selection) {
    if (selection.datum().clazz) {
      selection.append("g")
         .attr("class", selection.datum().clazz)
             .attr("transform", selection.datum().translate || "translate(0,-1)")
             .append("use")
             .attr("xlink:href", '#phenotype-symbol')
             .attr("width",  selection.datum().width || 13)
             .attr("height", selection.datum().width || 13);

    }
  }

  showImpactSymbol(selection, options) {
    options = options || {};
    var me = this;
    var type = d3.select(selection.node().parentNode).datum().type;
    var symbolScale = d3.scale.ordinal()
                      .domain([3,4,5,6,7,8,9])
                      .range([9,15,25,38,54,58,98]);
    var symbolScaleCircle = d3.scale.ordinal()
                          .domain([3,4,5,6,7,8,9])
                          .range([9,15,25,58,68,78,128]);

    var symbolSize = symbolScale(options.cellSize > 18 ? 9 : 6);
    var symbolSizeCircle = symbolScaleCircle(options.cellSize > 18 ? 9 : 6);

    var translate       = options.cellSize > 18 ?  "translate(4,4)" : "translate(4,4)";
    var translateSymbol = options.cellSize > 18 ?  "translate(10,10)" : "translate(8,8)";
    var width           = options.cellSize > 18 ? 12 : 8;
    var height          = width;

    if (type.toUpperCase() == 'SNP' || type.toUpperCase() == 'MNP') {
      selection.append("g")
               .attr("transform", translate)
               .append("rect")
               .attr("width", width)
               .attr("height", height)
               .attr("class", "filter-symbol " + selection.datum().clazz + " snp")
               .style("pointer-events", "none");
    } else {
      selection
        .append("g")
        .attr("transform", translateSymbol)
        .append('path')
            .attr("d", function(d,i) {
              return d3.svg
                       .symbol()
                       .size( function(d,i) {
                        if (type.toUpperCase() == 'INS') {
                          return symbolSizeCircle;

                        } else {
                          return symbolSize;
                        }
                       })
                       .type( function(d,i) {
                        if (type.toUpperCase() == 'DEL') {
                  return 'triangle-up';
              } else if (type.toUpperCase() == 'INS') {
                  return  'circle';
              } else if (type.toUpperCase() == 'COMPLEX') {
                  return 'diamond';
              } else {
                return 'square';
              }
                       })();
            })
            .attr("class", "filter-symbol " + selection.datum().clazz + " " + type);
    }
  }

  showHighestImpactSymbol(selection, options) {
    var variant = d3.select(selection.node().parentNode).datum();
    var vepHighestImpacts = VariantModel.getNonCanonicalHighestImpactsVep(variant);
    if (Object.keys(vepHighestImpacts).length > 0) {
      matrixCard.showImpactSymbol(selection, options);
    }
  }




}

