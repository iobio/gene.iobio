class Translator {

  constructor() {


    this.clinvarMap     = {
              'pathogenic'            : {value: 1,   badge: true, examineBadge: true, clazz: 'clinvar_path', symbolFunction: glyph.showClinVarSymbol},
              'pathogenic/likely_pathogenic' :
                                        {value: 2,   badge: true, examineBadge: true, clazz: 'clinvar_path', symbolFunction: glyph.showClinVarSymbol},
              'likely_pathogenic'     : {value: 3,   badge: true, examineBadge: true, clazz: 'clinvar_lpath', symbolFunction: glyph.showClinVarSymbol},
              'uncertain_significance': {value: 4,   badge: true, examineBadge: true, clazz: 'clinvar_uc', symbolFunction: glyph.showClinVarSymbol},
              'conflicting_interpretations_of_pathogenicity':
                                        {value: 4,   badge: true, examineBadge: true, clazz: 'clinvar_cd', symbolFunction: glyph.showClinVarSymbol},
              'conflicting_data_from_submitters':
                                        {value: 5,   badge: true,  examineBadge: true, clazz: 'clinvar_cd', symbolFunction: glyph.showClinVarSymbol},
              'drug_response'         : {value: 131, badge: false, examineBadge: true, clazz: 'clinvar_other', symbolFunction: glyph.showClinVarSymbol},
              'confers_sensitivity'   : {value: 131, badge: false, examineBadge: true, clazz: 'clinvar_other', symbolFunction: glyph.showClinVarSymbol},
              'risk_factor'           : {value: 131, badge: false, examineBadge: true, clazz: 'clinvar_other', symbolFunction: glyph.showClinVarSymbol},
              'other'                 : {value: 131, badge: false, examineBadge: true, clazz: 'clinvar_other', symbolFunction: glyph.showClinVarSymbol},
              'association'           : {value: 131, badge: false, examineBadge: true, clazz: 'clinvar_other', symbolFunction: glyph.showClinVarSymbol},
              'protective'            : {value: 131, badge: false, examineBadge: true, clazz: 'clinvar_other', symbolFunction: glyph.showClinVarSymbol},
              'not_provided'          : {value: 131, badge: false, examineBadge: true, clazz: 'clinvar_other', symbolFunction: glyph.showClinVarSymbol},
              'likely_benign'         : {value: 141, badge: false, examineBadge: true, clazz: 'clinvar_lbenign', symbolFunction: glyph.showClinVarSymbol},
              'benign/likely_benign'  : {value: 141, badge: false, examineBadge: true, clazz: 'clinvar_lbenign', symbolFunction: glyph.showClinVarSymbol},
              'benign'                : {value: 151, badge: false, examineBadge: true, clazz: 'clinvar_benign', symbolFunction: glyph.showClinVarSymbol},
              'none'                  : {value: 161, badge: false, examineBadge: false, clazz: ''}
                       };
    this.impactMap = {  HIGH:     {value: 1, badge: true, clazz: 'impact_HIGH',     symbolFunction: glyph.showImpactSymbol},
                        MODERATE: {value: 2, badge: true, clazz: 'impact_MODERATE', symbolFunction: glyph.showImpactSymbol},
                        MODIFIER: {value: 3, badge: false, clazz: 'impact_MODIFIER', symbolFunction: glyph.showImpactSymbol},
                        LOW:      {value: 4, badge: false, clazz: 'impact_LOW',      symbolFunction: glyph.showImpactSymbol},
                        none:     {value: 5, badge: false, clazz: 'impact_none',      symbolFunction: glyph.showImpactSymbol}
                     };
    this.highestImpactMap = {
                      HIGH:     {value: 1, badge: true, clazz: 'impact_HIGH',     symbolFunction: glyph.showHighestImpactSymbol},
                        MODERATE: {value: 2, badge: true, clazz: 'impact_MODERATE', symbolFunction: glyph.showHighestImpactSymbol},
                        MODIFIER: {value: 3, badge: false, clazz: 'impact_MODIFIER', symbolFunction: glyph.showHighestImpactSymbol},
                        LOW:      {value: 4, badge: false, clazz: 'impact_LOW',      symbolFunction: glyph.showHighestImpactSymbol}
                     };
    this.siftMap = {
                      deleterious:                 {value: 1, badge: true, clazz: 'sift_deleterious', symbolFunction: glyph.showSiftSymbol},
                      deleterious_low_confidence:  {value: 2, badge: true, clazz: 'sift_deleterious_low_confidence', symbolFunction: glyph.showSiftSymbol},
                      tolerated_low_confidence: {value: 3, badge: false, clazz: 'sift_tolerated_low_confidence',symbolFunction: glyph.showSiftSymbol},
                      tolerated:    {value: 102, badge: false, clazz: 'sift_tolerated',symbolFunction: glyph.showSiftSymbol},
                      unknown:      {value: 103, badge: false, clazz: ''},
                      none:         {value: 103, badge: false, clazz: ''}
                    };
    this.polyphenMap = {
                      probably_damaging:    {value: 1, badge: true, clazz: 'polyphen_probably_damaging', symbolFunction: glyph.showPolyPhenSymbol},
                      possibly_damaging:    {value: 2, badge: true, clazz: 'polyphen_possibly_damaging', symbolFunction: glyph.showPolyPhenSymbol},
                      benign:               {value: 103, badge: false, clazz: 'polyphen_benign',            symbolFunction:glyph.showPolyPhenSymbol},
                      unknown:              {value: 104, badge: false, clazz: ''},
                      none:                 {value: 104, badge: false, clazz: ''}
                       };
    this.inheritanceMap = {
                      denovo:    {value: 1, badge: true, clazz: 'denovo',    display: 'de novo', symbolFunction: glyph.showDeNovoSymbol},
                      recessive: {value: 2, badge: true, clazz: 'recessive', display: 'recessive', symbolFunction: glyph.showRecessiveSymbol},
                      none:      {value: 3, badge: false, clazz: 'noinherit', display: '', symbolFunction: glyph.showNoInheritSymbol}
                       };
    this.zygosityMap = {
                      HOM:        {value: 1, badge: true,  clazz: 'zyg_hom',        symbolFunction: glyph.showHomSymbol},
                      HET:        {value: 2, badge: false, clazz: 'het'        },
                      HOMREF:     {value: 3, badge: false, clazz: 'homref'     },
                      gt_unknown: {value: 4, badge: false, clazz: 'gt_unknown' }
                       };
    this.bookmarkMap = {
                      Y: {value: 1, badge: true,  clazz: 'bookmark',  symbolFunction: glyph.showBookmarkSymbol},
                      N: {value: 2, badge: false, clazz: '',          symbolFunction: glyph.showBookmarkSymbol}
                       };
    this.unaffectedMap = {
                          present_some:   {value: 104, badge: false, clazz: 'unaffected', symbolFunction: glyph.showAffectedPresentSymbol},
                          present_all:    {value: 104, badge: false, clazz: 'unaffected', symbolFunction: glyph.showAffectedPresentSymbol},
                          present_none:   {value: 104, badge: false, clazz: 'unaffected', symbolFunction: glyph.showAffectedPresentSymbol},
                          none:           {value: 104, badge: false, clazz: 'unaffected', symbolFunction: ''}
                   };
    this.affectedMap = {
                          present_all:    {value: 3,   badge: true,  clazz: 'affected',  symbolFunction: glyph.showAffectedPresentSymbol},
                          present_some:   {value: 4,   badge: true,  clazz: 'affected',  symbolFunction: glyph.showAffectedPresentSymbol},
                          present_none:   {value: 104, badge: false, clazz: 'affected',  symbolFunction: glyph.showAffectedPresentSymbol},
                          none:           {value: 104, badge: false, clazz: 'affected',  symbolFunction: ''}
                   };
      this.harmfulVariantMap = {
                          1:    {value: 1,   badge: true,  clazz: 'harmful1-variant',  symbolFunction: glyph.showHarmfulVariantSymbol},
                          2:    {value: 2,   badge: true,  clazz: 'harmful2-variant',  symbolFunction: glyph.showHarmfulVariantSymbol},
                          3:    {value: 3,   badge: true,  clazz: 'harmful3-variant',  symbolFunction: glyph.showHarmfulVariantSymbol},
                          none: {value: 101, badge: false, clazz: '',                  symbolFunction: ''}
                   };
    // For af range, value must be > min and <= max
    this.afHighestMap = [ {min: -100.1, max: -100,   value: +99, badge: false, clazz: '',    symbolFunction: ''},
                         {min: -1.1,   max: +0,        value: +2,  badge: true, clazz: 'afhighest_rare',    symbolFunction: glyph.showAfRareSymbol},
                         {min: -1.1,   max: +.0001,    value: +3,  badge: true, clazz: 'afhighest_rare',    symbolFunction: glyph.showAfRareSymbol},
                         {min: -1.1,   max: +.001,     value: +4,  badge: true, clazz: 'afhighest_rare',    symbolFunction: glyph.showAfRareSymbol},
                         {min: -1.1,   max: +.01,      value: +5,  badge: true, clazz: 'afhighest_rare',    symbolFunction: glyph.showAfRareSymbol},
                         {min: -1.1,   max: +.05,      value: +6,  badge: true, clazz: 'afhighest_rare',    symbolFunction: glyph.showAfRareSymbol},
                         {min: +.05,   max: +1,        value: +7,  badge: false,clazz: '',    symbolFunction: ''},
                        ];

  }

  getInheritanceLabel(inheritance) {
    var map = this.inheritanceMap[inheritance];
    return map ? map.display : inheritance;
  }



}

