# Component hierarchy

## Advanced Mode

1. GeneHome
   1. Navigation
      1. TypeAhead (gene search)
      2. GenesMenu (copy/paste multiple genes)
      3. PhenotypeSearch
      4. FilesDialog
         1. SampleData
            1. SampleDataFile (variants)
            2. SampleDataFile (alignments)
      5. ImportVariants
      6. ExportVariants
      7. SettingsDialog
      8. Dialogs for disclaimer, terms of service, publications, citations
      9. NavigationDrawer (left side panel, tabs)
         1. GenePanel
         2. FlaggedVariantsCard
      10. NavigationDrawer (right side panel)
          1. LegendPanel
      11. NavigationDrawer (right side panel)
          1. AlertPanel
   2. Welcome
   3. Main content
      1. GeneVariantsCard
         1. GeneLinksMenu
         2. GeneOMIMTable
         3. GenePubMedTable
      2. TranscriptCard
         1. TranscriptsMenu
         2. GeneViz
      3. VariantAllCard
         1. VariantToggle (filter by inheritance)
         2. VariantViz (called variants)
         3. VariantViz (loaded variants)
         4. BamTrack (alignment depth)
         5. GeneViz (selected transcript)
         6. OptionalTracksMenu
         7. VariantViz (mother)
         8. DepthViz (mother)
         9. VariantViz (father)
         10. DepthViz (father)
         11. VariantViz (clinvar)
         12. StackedBarChartViz (clinvar)
      4. VariantInspectCard
         1. VariantLinksMenu&#x20;
         2. VariantAliasesMenu&#x20;
         3. VariantInterpretation&#x20;
         4. GeneAssociationsDialog&#x20;
         5. VariantAfPopMenu&#x20;
         6. VariantInspectRow&#x20;
         7. VariantInspectQualityRow&#x20;
         8. VariantInspectInheritanceRow&#x20;
         9. DepthViz&#x20;
         10. GeneViz&#x20;
         11. PedigreeGenotypeViz&#x20;
         12. ConservationScoresViz&#x20;
         13. MultialignSeqViz
   4. VariantAssessment
      1. VariantNotesDialog
   5. SaveAnalyisPopup
   6. AppTour

