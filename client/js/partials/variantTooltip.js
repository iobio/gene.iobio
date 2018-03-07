class VariantTooltip {

  constructor(genericAnnotation, glyph, translator, annotationScheme, genomeBuildHelper) {
    this.genericAnnotation = genericAnnotation;
    this.glyph = glyph;
    this.translator = translator;
    this.annotationScheme = annotationScheme;
    this.genomeBuildHelper = genomeBuildHelper;

    this.WIDTH_LOCK             = 680;
    this.WIDTH_EXTRA_WIDE       = 840;
    this.WIDTH_HOVER            = 360;
    this.WIDTH_SIMPLE           = 280;
    this.WIDTH_SIMPLE_WIDER     = 500;
    this.ARROW_OFFSET           = 10;
    this.ARROW_WIDTH            = 10;
    this.SIDE_TOOLTIP_HORZ_OFFSET = 35;
    this.SIDE_TOOLTIP_VERT_OFFSET = 30;

    this.VALUE_EMPTY        = "-";

  }


  fillAndPositionTooltip(tooltip, variant, geneObject, theTranscript, lock, coord, relationship, affectedInfo, cohortMode, maxAlleleCount, html) {
    var me = this;

    tooltip.style("z-index", 1032);
    tooltip.transition()
     .duration(1000)
     .style("opacity", .9)
     .style("pointer-events", "all");

    if (isLevelEdu || isLevelBasic) {
      tooltip.classed("level-edu", "true");
    }

    tooltip.classed("tooltip-wide", lock && !isLevelEdu);

    var extraWide = lock && !isLevelEdu && variant.genericAnnots && Object.keys(variant.genericAnnots).length > 0;
    tooltip.classed("tooltip-extra-wide", extraWide);

    if (html == null) {
      if (lock) {
        html = me.formatContent(variant, null, 'tooltip-wide', geneObject, theTranscript, relationship, lock);
      } else {
        var pinMessage = "click on variant for more details";
        html = me.formatContent(variant, pinMessage, 'tooltip', geneObject, theTranscript, relationship, lock);
      }
    }
    tooltip.html(html);
    me.injectVariantGlyphs(tooltip, variant, lock ? '.tooltip-wide' : '.tooltip');





    if (lock && !isLevelEdu) {
      me.showScrollButtons($(tooltip[0]));
    }


    var hasLongText = $(tooltip[0]).find('.col-sm-8').length > 0  || $(tooltip[0]).find('.col-sm-9').length > 0;
    var w = isLevelEdu || isLevelBasic ? (hasLongText ? me.WIDTH_SIMPLE_WIDER : me.WIDTH_SIMPLE) : (lock ? (extraWide ? me.WIDTH_EXTRA_WIDE : me.WIDTH_LOCK) : me.WIDTH_HOVER);
    var h = d3.round(tooltip[0][0].offsetHeight);

    // We use css variables to place the tooltip chevron in the middle, center of the tooltip
    var middlePos = (h/2);
    tooltip.style("--tooltip-middle", middlePos  + "px");
    tooltip.style("--tooltip-middle-before", (middlePos - 3) + "px");
    var centerPos = (w/2);
    tooltip.style("--tooltip-center", centerPos + "px");
    tooltip.style("--tooltip-center-before", (centerPos - 3) + "px");
    tooltip.classed("chevron", false);
    tooltip.classed("chevron-vertical", false);
    tooltip.classed("chevron-horizontal", false);
    tooltip.classed("chevron-top", false);
    tooltip.classed("chevron-bottom", false);
    tooltip.classed("chevron-middle", false);
    tooltip.classed("chevron-left", false);
    tooltip.classed("chevron-right", false);
    tooltip.classed("chevron-center", false);

    var x = coord.x;
    var y = coord.y;
    var yScroll = window.pageYOffset;

    var tooltipPos = {
      top: null,
      left: null,
      arrowClasses: []
    }

    if (lock) {
      tooltipPos.left = $('#gene-track')[0].offsetLeft - 300;
      tooltipPos.top  = $('#gene-track')[0].offsetTop + 300;
      var footerClass = "left-footer";
      tooltip.selectAll('.' + footerClass + " .tooltip-control-button").classed("hide", false);
    } else {
      me.findBestTooltipPosition(tooltipPos, coord, x, y, h, w, yScroll);
    }

    if (tooltipPos.left && tooltipPos.top) {
      tooltipPos.arrowClasses.forEach(function(arrowClass) {
        tooltip.classed(arrowClass, true);
      })
      tooltip.style("width", w + "px")
             .style("left", tooltipPos.left + "px")
             .style("text-align", 'left')
             .style("top", tooltipPos.top + "px");
    }

  }

  findBestTooltipPosition(tooltipPos, coord, x, y, h, w, yScroll ) {
    var me = this;
    var availSpace = {
      'top':    {allowed: false},
      'bottom': {allowed: false},
      'middle': {allowed: false},
      'right':  {allowed: false},
      'left':   {allowed: false},
      'center': {allowed: false},
    };

    // If the tooltip sits above the element, is the top of the tooltip
    // below the top of the window?
    if ( (y - h) - yScroll >= 0) {
      availSpace.top.allowed = true;
      availSpace.top.tooltipTop = y - h;
      availSpace.top.sideTooltipVertOffset = me.SIDE_TOOLTIP_VERT_OFFSET;

    }
    // If the tooltip sits below the elements, is the bottom of the tooltip
    // above the bottom of the window?
    if ( (y + coord.height + h) - yScroll < utility.visibleHeight($('body'))) {
      availSpace.bottom.allowed = true;
      availSpace.bottom.tooltipTop = y + coord.height;
      availSpace.bottom.sideTooltipVertOffset = -1 * me.SIDE_TOOLTIP_VERT_OFFSET;
    }
    // If the tooltip sits in the center (either to the left or right) of the element,
    // are both top and bottom edges within the window?
    if ((y + coord.height/2) - (h/2) - yScroll >= 0
      && ((y + coord.height/2) + (h/2) - yScroll < utility.visibleHeight($('body')))) {
      availSpace.middle.allowed = true;
      availSpace.middle.tooltipTop = y + (coord.height/2);
      availSpace.middle.sideTooltipVertOffset = -1 * (h/2);
    }
    // If the tooltip sits to the right of the element, is the right
    // edge of the tooltip inside the window?
    if (x > 0 && (x+w) < coord.parentWidth) {
      availSpace.right.allowed = true;
      availSpace.right.tooltipLeft = x;
      availSpace.right.tooltipLeftOffset = -1 * (me.ARROW_OFFSET + me.ARROW_WIDTH);
      availSpace.right.sideTooltipHorzOffset = me.SIDE_TOOLTIP_HORZ_OFFSET;
    }
    // If the tooltip sits to the left of the element, is the left
    // edge of the tooltip within the window?
    if (x - w > 0 ) {
      availSpace.left.allowed = true;
      availSpace.left.tooltipLeft = (x - w);
      availSpace.left.tooltipLeftOffset = me.ARROW_OFFSET + me.ARROW_WIDTH;
      availSpace.left.sideTooltipHorzOffset = -1 * me.SIDE_TOOLTIP_HORZ_OFFSET;
    }
    // If the tooltip sits in the center (either above or below) of the element,
    // are both left and right edges within the window?
    if (x - (w/2) > 0 && x + (w/2) < coord.parentWidth) {
      availSpace.center.allowed = true;
      availSpace.center.tooltipLeft = x - (w/2);
      availSpace.center.tooltipLeftOffset =  me.ARROW_WIDTH;
      availSpace.center.sideTooltipHorzOffset = 0;
    }

    var found = false;
    var assignTooltip = function(key1, key2, force=false) {
      found = false;
      tooltipPos.top = null;
      tooltipPos.left = null;
      tooltipPos.arrowClasses = ['chevron'];

      tooltipPos.top  = availSpace[key1].tooltipTop  ? availSpace[key1].tooltipTop  : availSpace[key2].tooltipTop;
      tooltipPos.left = availSpace[key1].tooltipLeft ? availSpace[key1].tooltipLeft + availSpace[key1].tooltipLeftOffset : availSpace[key2].tooltipLeft + availSpace[key2].tooltipLeftOffset;
      found = (tooltipPos.top && tooltipPos.left) || force;

      if (found) {
        if (key1 == 'top' || key1 == 'bottom') {
          tooltipPos.arrowClasses.push('chevron-vertical');
        } else {
          tooltipPos.arrowClasses.push('chevron-horizontal');
          tooltipPos.left += availSpace[key1].sideTooltipHorzOffset;
          tooltipPos.top  += availSpace[key2].sideTooltipVertOffset;
        }
        tooltipPos.arrowClasses.push("chevron-" + key1);
        tooltipPos.arrowClasses.push("chevron-" + key2);
      }
    }

    coord.preferredPositions.forEach(function(preferredPos) {
      for (var key1 in preferredPos) {
        if (!found && availSpace[key1].allowed) {
          preferredPos[key1].forEach(function(key2) {
            if (!found && availSpace[key2].allowed) {
              assignTooltip(key1, key2);
            }
          })
        }
      }
    })

    // If we can't find enough space, just choose first preferred position.
    if (!found) {
      var pp = coord.preferredPositions[0];
      var key1 = Object.keys(pp)[0];
      var key2 = pp[key1][0];
      assignTooltip(key1, key2, true)
    }
  }


  injectVariantGlyphs(tooltip, variant, selector) {
    var me = this;
    var tooltipNode = $(tooltip.node());

    var injectClinvarBadge = function(clinsig, key, translate) {
      clinsig.split(",").forEach( function(clinsigToken) {
        if (me.translator.clinvarMap.hasOwnProperty(clinsigToken)) {
            var clazz = me.translator.clinvarMap[clinsigToken].clazz;
            var badge = me.translator.clinvarMap[clinsigToken].examineBadge;

            var linkSelector =  ".tooltip-clinsig-link" + key;
            if (badge && tooltipNode.find(linkSelector).length > 0) {
              var div = tooltipNode.find(linkSelector);
            $(div).prepend("<svg class=\"clinvar-badge\" style=\"float:left\"  height=\"12\" width=\"14\">");
            var svg = d3.select($(div).find("svg.clinvar-badge")[0]);
            var selection = svg.data([{width:10, height:10, transform: (translate ? translate : 'translate(0,1)'), clazz: clazz}]);
            me.glyph.showClinVarSymbol(selection);
            }

        }

      })
    }


    var translate = variant.type.toLowerCase() == "snp" || variant.type.toLowerCase() == "mnp" ? 'translate(1,2)' : 'translate(5,6)';

    var impactList =  (me.annotationScheme == null || me.annotationScheme.toLowerCase() == 'snpeff' ? variant.impact : variant[IMPACT_FIELD_TO_COLOR]);
    var impactDivSelector = selector == '.tooltip-wide' ? '.tooltip-value' : '.tooltip-title';
    var impactStyle       = selector == '.tooltip-wide' ? " style='float:left' "             : " style='padding-top:2px;float:none' ";
    for (var impact in impactList) {
      var theClazz = 'impact_' + impact;
      if (tooltipNode.find(impactDivSelector  + '.impact-badge').length > 0) {
        tooltipNode.find(impactDivSelector  + '.impact-badge').prepend("<svg class=\"impact-badge\" height=\"12\" width=\"14\" " + impactStyle + ">" );
        var selection = tooltip.select(impactDivSelector + '.impact-badge svg.impact-badge ').data([{width:10, height:10,clazz: theClazz,  transform: translate, type: variant.type}]);
        me.glyph.showImpactBadge(selection);
      }
    }

    if ($(selector + ' ' + impactDivSelector + '.highest-impact-badge').length > 0) {
      var highestImpactList =  (me.annotationScheme == null || me.annotationScheme.toLowerCase() == 'snpeff' ? variant.highestImpact : variant.highestImpactVep);
      for (var impact in highestImpactList) {
        var theClazz = 'impact_' + impact;
        if (tooltipNode.find(impactDivSelector  + '.highest-impact-badge').length > 0) {
          tooltipNode.find(impactDivSelector  + '.highest-impact-badge').prepend("<svg class=\"impact-badge\" height=\"12\" width=\"14\" " + impactStyle + ">");
          var selection = tooltip.select(impactDivSelector + '.highest-impact-badge svg.impact-badge').data([{width:10, height:10,clazz: theClazz, transform: translate, type: variant.type}]);
          me.glyph.showImpactBadge(selection);
        }
      }
    }


    if (selector == ".tooltip") {

      for (var key in variant.vepSIFT) {
        if (me.translator.siftMap[key]) {
          var clazz = me.translator.siftMap[key].clazz;
          if (clazz) {
            if (!tooltip.select(".sift").empty()) {
              $(tooltip[0]).find(".sift").prepend("<svg class=\"sift-badge\" height=\"12\" width=\"13\">");
              var selection = tooltip.select('.sift-badge').data([{width:11, height:11, transform: 'translate(0,1)', clazz: clazz }]);
              me.glyph.showSiftSymbol(selection);
            }
          }
        }

      }

      for (var key in variant.vepPolyPhen) {
        if (me.translator.polyphenMap[key]) {
          var clazz = me.translator.polyphenMap[key].clazz;
          if (clazz) {
            if (!tooltip.select(".polyphen").empty()) {
              $(tooltip[0]).find(".polyphen").prepend("<svg class=\"polyphen-badge\" height=\"12\" width=\"12\">");
              var selection = tooltip.select('.polyphen-badge').data([{width:10, height:10, transform: 'translate(0,2)', clazz: clazz }]);
              me.glyph.showPolyPhenSymbol(selection);
            }
          }
        }
      }

      if (variant.clinvarSubmissions && variant.clinvarSubmissions.length > 0) {
        var clinsigUniq = {};
        variant.clinvarSubmissions.forEach(function(submission) {
          submission.clinsig.split(",").forEach(function(clinsig) {
            clinsigUniq[clinsig] = "";
          })
        })
        for (let clinsig in clinsigUniq) {
          injectClinvarBadge(clinsig, clinsig, 'translate(0,0)');
        }
      } else if (variant.clinVarClinicalSignificance) {
          for (let clinsig in variant.clinVarClinicalSignificance) {
            var key = variant.clinVarClinicalSignificance[clinsig];
            injectClinvarBadge(clinsig, key);
        }
      }

    } else {



      if (variant.clinvarSubmissions && variant.clinvarSubmissions.length > 0) {
        for (var idx = 0; idx < variant.clinvarSubmissions.length; idx++) {
          var submission = variant.clinvarSubmissions[idx];
          injectClinvarBadge(submission.clinsig, idx.toString());
        }
      } else if (variant.clinVarClinicalSignificance) {
          for (let clinsig in variant.clinVarClinicalSignificance) {
            var key = variant.clinVarClinicalSignificance[clinsig];
            injectClinvarBadge(clinsig, key);
        }
      }

    }






    for (var key in variant.vepSIFT) {
      if (me.translator.siftMap[key]) {
        var clazz = me.translator.siftMap[key].clazz;
        if (clazz && tooltipNode.find(".tooltip-value.sift-glyph").length > 0) {
          tooltipNode.find(".tooltip-value.sift-glyph").prepend("<svg class=\"sift-badge\" style=\"float:left\"  height=\"12\" width=\"13\">");
          var selection = tooltip.select('.sift-badge').data([{width:11, height:11, transform: 'translate(0,1)', clazz: clazz }]);
          me.glyph.showSiftSymbol(selection);
        }
      }

    }

    for (var key in variant.vepPolyPhen) {
      if (me.translator.polyphenMap[key]) {
        var clazz = me.translator.polyphenMap[key].clazz;
        if (clazz && tooltipNode.find(".tooltip-value.polyphen-glyph").length > 0) {
          tooltipNode.find(".tooltip-value.polyphen-glyph").prepend("<svg class=\"polyphen-badge\" style=\"float:left\"   height=\"12\" width=\"12\">");
          var selection = tooltip.select('.polyphen-badge').data([{width:10, height:10, transform: 'translate(0,2)', clazz: clazz }]);
          me.glyph.showPolyPhenSymbol(selection);
        }
      }
    }



    if (variant.inheritance && variant.inheritance != '') {
      var clazz = me.translator.inheritanceMap[variant.inheritance].clazz;
      var symbolFunction = me.translator.inheritanceMap[variant.inheritance].symbolFunction;
      if (tooltipNode.find(".tooltip-title:contains('inheritance')").length > 0) {
        tooltipNode.find(".tooltip-title:contains('inheritance')").prepend("<svg class=\"inheritance-badge\"  height=\"15\" width=\"16\">");
        var options = {width:15, height:15, transform: 'translate(0,0)'};
        var selection = tooltip.select('.inheritance-badge').data([{clazz: clazz}]);
        symbolFunction(selection, options);
      }
    }



  }


  formatContent(variant, pinMessage, tooltipClazz, geneObject, theTranscript, relationship, lock) {
    var me = this;

    var info = utility.formatDisplay(variant, me.translator);


    var calledVariantRow = "";
    if (variant.hasOwnProperty("fbCalled") && variant.fbCalled == "Y") {
      var calledGlyph = '<i id="gene-badge-called" class="material-icons glyph" style="display: inline-block;font-size: 15px;vertical-align: top;float:initial">check_circle</i>';
      var marginTop = tooltipClazz == 'tooltip-wide' ? ';margin-top: 1px;' : ';margin-top: 3px;';
      calledGlyph    += '<span style="display: inline-block;vertical-align: top;margin-left:3px' + marginTop + '">Called variant</span>';
      calledVariantRow = me._tooltipMainHeaderRow(calledGlyph, '', '', '');
    }


    var clinvarSimpleRow1 = '';
    var clinvarSimpleRow2 = '';
    if (isLevelEdu) {
      if (info.clinvarSig != "") {
        clinvarSimpleRow1 = me._tooltipWideHeadingRow('Known from research', info.clinvarSig, '6px');
        if (phenotypeDisplay) {
          clinvarSimpleRow2 = me._tooltipWideHeadingSecondRow('', info.phenotype, null, 'tooltip-clinvar-pheno');
        }
      }
    }

    if (info.clinvarSig != "") {
      if (variant.clinVarUid != null && variant.clinVarUid != '') {
        clinvarSimpleRow1 = me._tooltipWideHeadingSecondRow('ClinVar', '<span class="tooltip-clinsig-link0">' + info.clinvarSig + '</span>', null);
        if (info.phenotype) {
          clinvarSimpleRow2 = me._tooltipWideHeadingSecondRow('&nbsp;', info.phenotype, null, 'tooltip-clinvar-pheno');
        }

      } else if (variant.clinvarSubmissions != null && variant.clinvarSubmissions.length > 0) {
        clinvarSimpleRow1 = me._tooltipSimpleClinvarSigRow('ClinVar', info.clinvarSigSummary );
        clinvarSimpleRow2 = me._tooltipHeaderRow(info.phenotypeSimple, '', '', '', '', null, 'style=padding-top:0px');
      } else {
        clinvarLink = info.clinvarSig;
      }
    }


    var vepHighestImpactRow = "";
    var vepHighestImpactRowSimple = "";
    if (info.vepHighestImpact.length > 0) {
      vepHighestImpactRow       = me._tooltipRow('Most severe impact', info.vepHighestImpact, null, true, 'highest-impact-badge');
      vepHighestImpactRowSimple = me._tooltipHeaderRow(info.vepHighestImpactSimple, '', '', '', 'highest-impact-badge');
    }

    var inheritanceModeRow =  variant.inheritance == null || variant.inheritance == '' || variant.inheritance == 'none'
                              ? ''
                    : me._tooltipHeaderRow('<span class="tooltip-inheritance-mode-label">' + me.translator.getInheritanceLabel(variant.inheritance) + ' inheritance</span>', '', '', '', null, 'padding-top:0px;');


    var siftLabel = info.sift != ''  && info.sift  != 'unknown'
                    ? 'SIFT ' + info.sift
                    : "";
    var polyphenLabel = info.polyphen  != '' && info.polyphen != 'unknown'
                        ? 'PolyPhen ' + info.polyphen
                        : "";
    var sep = siftLabel != '' && polyphenLabel != '' ? '&nbsp;&nbsp;&nbsp;&nbsp;' : ''
    var siftPolyphenRow = '';
    if (siftLabel || polyphenLabel) {
      siftPolyphenRow = me._tooltipClassedRow(polyphenLabel + sep, 'polyphen', siftLabel, 'sift', 'padding-top:3px;');
    }


    var polyphenRowSimple = info.polyphen != "" ? me._tooltipWideHeadingRow('Predicted effect', info.polyphen + ' to protein', '3px') : "";

    var genotypeRow = isLevelEdu && eduTourNumber == 2 ? me._tooltipHeaderRow('Genotype', utility.switchGenotype(variant.eduGenotype), '','')  : "";


    var formatPopAF = function(afObject) {
      var popAF = "";
      if (afObject['AF'] != ".") {
        for (var key in afObject) {
          if (key != "AF") {
            var label = key.split("_")[0];
            if (popAF.length > 0) {
              popAF += ", ";
            }
            popAF += label + " " + (afObject[key] == "." ? "0%" : utility.percentage(afObject[key]));
          }
        }
      }
      return popAF;
    }

    var gnomADAfRow = "";
    var gnomADAfRowWide = "";
    var exacAfRow = "";
    var exacAfRowWide = "";
    if (global_vepAF && me.genomeBuildHelper.getCurrentBuildName() == "GRCh37" && variant.vepAf.gnomAD.hasOwnProperty("AF")) {
      gnomADAfRow = me._tooltipLabeledRow('Allele Freq gnomAD', (variant.vepAf.gnomAD.AF == "." ? "0%" : utility.percentage(variant.vepAf.gnomAD.AF)), '6px');
      var af   =  variant.vepAf.gnomAD.AF == "." ? "0%" : utility.percentage(variant.vepAf.gnomAD.AF);
      var link =  "<a target='_gnomad' href='http://gnomad.broadinstitute.org/variant/" + variant.chrom + "-" + variant.start + "-" + variant.ref + "-" + variant.alt + "'>" + af + "</a>";
      var popAF = formatPopAF(variant.vepAf.gnomAD);
      gnomADAfRowWide  = me._tooltipRow('Allele Freq gnomAD', '<span style="float:left">' + (variant.vepAf.gnomAD.AF == "." ? af : link) + '</span>', null, true, null, '0px');
      if (popAF.length > 0) {
        gnomADAfRowWide += me._tooltipRow('&nbsp;', '<span style="float:left">' + popAF + '</span>', null, true, null, '0px');
      }

    }

    exacAfRow = me._tooltipLabeledRow('Allele Freq ExAC', (variant.afExAC == -100 ? "n/a" : utility.percentage(variant.afExAC)),  '0px' );
    exacAfRowWide = me._tooltipRow('Allele Freq ExAC', '<span style="float:left">' + (variant.afExAC == -100 ? "n/a" : utility.percentage(variant.afExAC) + '</span>'), null, true, null, '0px');

    var popAf1000GRow = "";
    var af1000GRow = "";
    if (global_vepAF && variant.vepAf['1000G']) {
      popAF = formatPopAF(variant.vepAf['1000G']);
      if (variant.af1000G) {
        af1000GRow    = me._tooltipRow('Allele Freq 1000G', '<span style="float:left">' + utility.percentage(variant.af1000G) + '</span>', null, true, null, popAF.length > 0 ? '0px' : null);
        if (popAF.length > 0) {
          popAf1000GRow = me._tooltipRow('&nbsp;', '<span style="float:left">' + popAF + '</span>');
        }
      } else {
        popAf1000GRow =  me._tooltipRow('Allele Freq 1000G', '<span style="float:left">' + popAF + '</span>');

      }
    }

    var flaggedBadge = '';
    if (lock && variant.isFlagged) {
      flaggedBadge = '<svg class="bookmark-badge" height="14" width="14" style="padding-top:2px" ><g class="bookmark" transform="translate(0,0)"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#bookmark-symbol" width="14" height="14"></use></g></svg>';
    }

    var loadingGlyph = '<img class="gene-badge-loader glyph" style="width: 12px;height: 12px;" src="assets/images/wheel.gif"><span style="font-style:italic;margin-left:4px">loading</span>';


    if (isLevelEdu) {
      return (
        genotypeRow
        + me._tooltipMainHeaderRow('Severity - ' + info.vepImpact , '', '', '')
        + inheritanceModeRow
        + polyphenRowSimple
        + clinvarSimpleRow1
        + clinvarSimpleRow2 );
    } else if (tooltipClazz == 'tooltip') {
      return (
        me._tooltipMainHeaderRow(geneObject ? geneObject.gene_name : "", variant.type ? variant.type.toUpperCase() : "", info.refalt + " " + info.coord, info.dbSnpLink, 'ref-alt')
        + calledVariantRow
        + me._tooltipMainHeaderRow(info.vepImpact, info.vepConsequence, '', '', 'impact-badge')
        + vepHighestImpactRowSimple
        + inheritanceModeRow
        + siftPolyphenRow
        + gnomADAfRow
        + exacAfRow
        + me._tooltipLabeledRow('Allele Freq 1000G', utility.percentage(variant.af1000G), null)
        + (relationship == 'known-variants' ? me._tooltipRow('&nbsp;', info.clinvarLinkKnownVariants, '6px')  : clinvarSimpleRow1)
        + (relationship == 'known-variants' ? clinvarSimpleRow2 : '')
        + me._linksRow(variant, pinMessage, relationship, lock)
      );

    } else if (tooltipClazz == 'tooltip-wide') {

      var leftDiv =
          '<div class="tooltip-left-column">'
          +   me._tooltipRow('VEP Consequence', info.vepConsequence)
        +   me._tooltipRow('VEP Impact', ' '  + info.vepConsequence, null, true, 'impact-badge')
        +   vepHighestImpactRow
        +   me._tooltipRow('ClinVar', '<span style="float:left">' + (info.clinvarLink != '' ? info.clinvarLink : me.VALUE_EMPTY) + '</span>', null, true)
        +   me._tooltipRow('&nbsp;', info.phenotype, null, false, 'tooltip-clinvar-pheno')
        +   me._tooltipRow('HGVSc', info.HGVScLoading ? loadingGlyph : info.HGVSc, null, true)
        +   me._tooltipRow('HGVSp', info.HGVSpLoading ? loadingGlyph : info.HGVSp, null, true)
        +   me._tooltipRow('PolyPhen', info.polyphen, null, true, 'polyphen-glyph')
        +   me._tooltipRow('SIFT', info.sift, null, true, 'sift-glyph')
        +   me._tooltipRowURL('Regulatory', info.regulatory, null, true)
        + "</div>";

      var rightDiv =
        '<div class="tooltip-right-column">'
        + gnomADAfRowWide
        + exacAfRowWide
        + af1000GRow
        + popAf1000GRow
        + me._tooltipRowAlleleCounts()
        +   me._tooltipRow('Qual', variant.qual, null, true)
        +   me._tooltipRow('VCF filter status', (variant.recfilter == '.' ? '. (unassigned)' : variant.recfilter), null, true)
        + "</div>";


      var clazzMap = {container: 'tooltip-info-column', row: 'tooltip-row', label: 'tooltip-header', value: 'tooltip-value'};
      var otherDiv = me.genericAnnotation.formatContent(variant, clazzMap, this.VALUE_EMPTY);


      var div =
          '<div class="tooltip-wide">'
        + me._tooltipMainHeaderRow(flaggedBadge + (geneObject ? geneObject.gene_name : ""), variant.type ? variant.type.toUpperCase() : "", info.refalt + " " + info.coord + " " + info.exon, info.dbSnpLink , 'ref-alt')
        + calledVariantRow
        + inheritanceModeRow
        + '<div id="tooltip-body" class="row">'
          + leftDiv
          + rightDiv
          + otherDiv
        + '</div>'
        + me._linksRow(variant, null, relationship, lock)
        + "</div>";

      return div;

    }




  }



  variantTooltipMinimalHTML(variant) {
    var me = this;

    var zygosity = "";
    if (variant.zygosity.toLowerCase() == 'het') {
      zygosity = "Heterozygous";
    } else if (variant.zygosity.toLowerCase() == 'hom') {
      zygosity = "Homozygous";
    }


    return (
      me._tooltipRow('Zygosity',  zygosity)
      + me._tooltipRow('Qual &amp; Filter', variant.qual + ', ' + variant.filter)
      );


  }


  _linksRow(variant, pinMessage, relationship, lock) {
    if (pinMessage == null) {
      pinMessage = 'Click on variant for more details';
    }
    var scrollUpButton = '<button id="tooltip-scroll-up" class="tooltip-button  btn btn-raised btn-default" ><i class="material-icons">arrow_upward</i>scroll</button>'
    var scrollDownButton = '<button id="tooltip-scroll-down" class="tooltip-button btn btn-raised btn-default" ><i class="material-icons">arrow_downward</i>scroll</button>'

    var flaggedBadge = '<svg class="bookmark-badge" height="14" width="14" style="padding-top:2px" ><g class="bookmark" transform="translate(0,0)"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#bookmark-symbol" width="14" height="14"></use></g></svg>';

    var flagVariantLink =  '<button id="flag-variant"  class="hide tooltip-button tooltip-control-button btn btn-raised btn-default" ><i class="material-icons">bookmark_border</i>flag variant</button>';

    var removeFlaggedVariant  =  '<button id="remove-flagged-variant" class="hide tooltip-control-button tooltip-button btn btn-raised btn-default">remove<i class="material-icons">bookmark</i></button>';

    var unpin =  '<button id="unpin"  class="hide tooltip-control-button tooltip-button btn btn raised btn-default"><i class="material-icons">close</i></button>'

    if (lock) {
      if (variant.isFlagged) {
        return '<div class="row tooltip-footer">'
          + '<div class="col-sm-4 left-footer" id="bookmarkLink" style="text-align:left;">'  + unpin + removeFlaggedVariant  + '</div>'
          + '<div class="col-sm-4 center-footer"  style="text-align:center;">'  +  removeFlaggedVariant  +  unpin + (relationship == 'known-variants' ? '' : scrollUpButton + scrollDownButton) + '</div>'
          + '<div class="col-sm-4 right-footer" style="text-align:right;">' + removeFlaggedVariant + unpin + '</div>'
          + '</div>';

      } else {
        return '<div class="row tooltip-footer" style="">'
          + '<div class="col-sm-4 left-footer" style="text-align:left;">' + unpin + flagVariantLink + '</div>'
          + '<div class="col-sm-4 center-footer"  style="text-align:center;">'   +   flagVariantLink + unpin  + (relationship == 'known-variants' ? '' : scrollUpButton + scrollDownButton) + '</div>'
          + '<div class="col-sm-4 right-footer" style="text-align:right;">' + flagVariantLink + unpin + '</div>'
          + '</div>';

      }

    } else {
      return '<div class="row tooltip-footer">'
        + '<div class="col-md-12 " style="text-align:right;">' +  '<em>' + pinMessage + '</em>' + '</div>'
        + '</div>';
    }
  }

  _tooltipBlankRow() {
    return '<div class="row">'
      + '<div class="col-md-12">' + '  ' + '</div>'
      + '</div>';
  }

  _tooltipHeaderRow(value1, value2, value3, value4, clazz, style) {
    var theStyle = style ? style : '';
    var clazzList = "col-md-12 tooltip-title";
    if (clazz) {
      clazzList += " " + clazz;
    }
    return '<div class="row" style="' + theStyle + '">'
          + '<div class="' + clazzList + '" style="text-align:center">' + value1 + ' ' + value2 + ' ' + value3 +  ' ' + value4 + '</div>'
          + '</div>';
  }
  _tooltipMainHeaderRow(value1, value2, value3, value4, clazz) {
    var theClass = "col-md-12 tooltip-title main-header";
    if (clazz) {
      theClass += " " + clazz;
    }
    return '<div class="row">'
          + '<div class="' + theClass + '" style="text-align:center">' + value1 + ' ' + value2 + ' ' + value3 +  ' ' + value4 + '</div>'
          + '</div>';
  }
  _tooltipLowQualityHeaderRow() {
    return '<div class="row">'
          + '<div class="col-md-12 tooltip-title danger" style="text-align:center">' + 'FLAGGED FOR NOT MEETING FILTERING CRITERIA' + '</div>'
          + '</div>';
  }

  _tooltipHeaderLeftJustifyRow(value1, value2, value3, value4) {
    return '<div class="row">'
          + '<div class="col-md-12 tooltip-title" style="text-align:left">' + value1 + ' ' + value2 + ' ' + value3 +  ' ' + value4 + '</div>'
          + '</div>';
  }

  _tooltipHeaderLeftJustifySimpleRow(value1) {
    return '<div class="row">'
          + '<div class="col-md-12 tooltip-title" style="text-align:left">' + value1 + '</div>'
          + '</div>';
  }

  _tooltipClassedRow(value1, class1, value2, class2, style) {
    var theStyle = style ? style : '';
    return '<div class="row" style="' + theStyle + '">'
          +  '<div class="col-md-12 tooltip-title" style="text-align:center">'
          +    "<span class='" + class1 + "'>" + value1 + '</span>'
          +    "<span class='" + class2 + "'>" + value2 + '</span>'
          +  '</div>'
          + '</div>';
  }

  _tooltipLabeledRow(value1, value2, paddingTop, paddingBottom) {
    var thePaddingTop    = paddingTop    ? "padding-top:"    + paddingTop    + ";" : "";
    var thePaddingBottom = paddingBottom ? "padding-bottom:" + paddingBottom + ";" : "";
    return '<div class="row" style="' + thePaddingTop + thePaddingBottom + '">'
          + '<div class="col-sm-6 tooltip-title"  style="text-align:right;word-break:normal">' + value1  +'</div>'
          + '<div class="col-sm-6 tooltip-title" style="text-align:left;word-break:normal">' + value2 + '</div>'
          + '</div>';
  }

  _tooltipWideHeadingRow(value1, value2, paddingTop) {
    var thePaddingTop = paddingTop ? "padding-top:" + paddingTop + ";" : "";
    return '<div class="row" style="padding-bottom:5px;' + thePaddingTop + '">'
          + '<div class="col-sm-4 tooltip-title"  style="text-align:right;word-break:normal">' + value1  +'</div>'
          + '<div class="col-sm-8 tooltip-title" style="text-align:left;word-break:normal">' + value2 + '</div>'
          + '</div>';
  }
  _tooltipWideHeadingSecondRow(value1, value2, paddingTop, valueClazz) {
    var thePaddingTop = paddingTop ? "padding-top:" + paddingTop + ";" : "";
    return '<div class="row" style="padding-bottom:5px;' + thePaddingTop + '">'
          + '<div class="col-sm-4 tooltip-title" style="text-align:right;word-break:normal">' + value1  +'</div>'
          + '<div class="col-sm-8 tooltip-title' + (valueClazz ? ' ' + valueClazz : '') + '" style="text-align:left;word-break:normal">' + value2 + '</div>'
          + '</div>';
  }
  _tooltipSimpleClinvarSigRow(value1, value2) {
    return '<div class="row" style="padding-bottom:0px;padding-top: 5px">'
          + '<div class="col-sm-4 tooltip-title" style="text-align:right;word-break:normal">' + value1  +'</div>'
          + '<div class="col-sm-8 tooltip-title style="text-align:left;word-break:normal">' + value2 + '</div>'
          + '</div>';
  }

  _tooltipLongTextRow(value1, value2, paddingTop) {
    var thePaddingTop = paddingTop ? "padding-top:" + paddingTop + ";" : "";
    return '<div class="row" style="' + thePaddingTop + '">'
          + '<div class="col-sm-3 tooltip-title" style="text-align:left;word-break:normal">' + value1  +'</div>'
          + '<div class="col-sm-9 tooltip-title" style="text-align:left;word-break:normal">' + value2 + '</div>'
          + '</div>';
  }
  _tooltipShortTextRow(value1, value2, value3, value4, paddingTop) {
    var thePaddingTop = paddingTop ? "padding-top:" + paddingTop + ";" : "";

    return '<div class="row" style="padding-bottom:5px;' + thePaddingTop + '">'
          + '<div class="col-sm-4 tooltip-label" style="text-align:right;word-break:normal;padding-right:5px;">' + value1  +'</div>'
          + '<div class="col-sm-2 " style="text-align:left;word-break:normal;padding-left:0px;">' + value2 + '</div>'
          + '<div class="col-sm-4 tooltip-label" style="text-align:right;word-break:normal;padding-right:5px;">' + value3  +'</div>'
          + '<div class="col-sm-2 " style="text-align:left;word-break:normal;padding-left:0px">' + value4 + '</div>'
          + '</div>';

  }



  _tooltipRow(label, value, paddingTop, alwaysShow, valueClazz, paddingBottom) {
    if (alwaysShow || (value && value != '')) {
      var style = paddingTop || paddingBottom ?
                    (' style="'
                     + (paddingTop    ? 'padding-top:'    + paddingTop + ';'  : '' )
                     + (paddingBottom ? 'padding-bottom:' + paddingBottom + ';' : '')
                     + '"') : '';
      var valueClazzes = "tooltip-value";
      if (valueClazz) {
        valueClazzes += " " + valueClazz;
      }
      if (value == "") {
        value = this.VALUE_EMPTY;
      }
      return '<div class="tooltip-row"' + style + '>'
            + '<div class="tooltip-header" style="text-align:right">' + label + '</div>'
            + '<div class="' + valueClazzes + '">' + value + '</div>'
            + '</div>';
    } else {
      return "";
    }
  }

  _tooltipRowURL(label, value, paddingTop, alwaysShow) {
    if (alwaysShow || (value && value != '')) {
      var style = paddingTop ? ' style="padding-top:' + paddingTop + '" '  : '';
      if (value == "") {
        value = this.VALUE_EMPTY;
      }
      return '<div class="tooltip-row"' + style + '>'
            + '<div class="tooltip-header" style="text-align:right">' + label + '</div>'
            + '<div class="tooltip-value">' + value + '</div>'
            + '</div>';
    } else {
      return "";
    }
  }

  _tooltipRowAF(label, afExAC, af1000g) {
    return '<div class="tooltip-row">'
            + '<div class="tooltip-header" style="text-align:right">' + label + '</div>'
            + '<div class="tooltip-value">' + 'ExAC: ' + afExAC  + '    1000G: ' + af1000g + '</div>'
       + '</div>';
  }

  _tooltipRowAlleleCounts(label) {
    return '<div  id="coverage-svg" style="padding-top:0px">'
       + '</div>';
  }

  scroll(dir="down", parentContainerSelector) {
    var me = this;

    var topPos = $(parentContainerSelector + ' #tooltip-body').scrollTop();
    var scrollHeight = $(parentContainerSelector + ' #tooltip-body').innerHeight();
    var multiplier = 1;
    if (dir == "up") {
      multiplier =  -1;
    }
    $(parentContainerSelector + ' #tooltip-body').animate({
        scrollTop: (topPos + scrollHeight) * multiplier
    }, 1000, function() {
      me.showScrollButtons($(parentContainerSelector));
    });
  }

  showScrollButtons(parentNode) {
      var pos = parentNode.find('#tooltip-body').scrollTop();
      var contentHeight = parentNode.find('#tooltip-body')[0].scrollHeight - parentNode.find('.tooltip-wide .tooltip-row').css('padding-bottom').split("px")[0];
      var scrollHeight = parentNode.find('#tooltip-body').innerHeight();

      if (scrollHeight + pos < contentHeight - 5) {
        parentNode.find('#tooltip-scroll-down').removeClass("hide");
      } else {
        parentNode.find('#tooltip-scroll-down').addClass("hide");
      }

      if (pos == 0) {
        parentNode.find('#tooltip-scroll-up').addClass("hide");
      } else {
        parentNode.find('#tooltip-scroll-up').removeClass("hide");
      }
  }
}


