import { Client } from 'iobio-api-client';

export default class EndpointCmd {

  constructor(globalApp, launchTimestamp, genomeBuildHelper, getHumanRefNamesFunc) {
    this.globalApp         = globalApp;
    this.launchTimestamp   = launchTimestamp;
    this.genomeBuildHelper = genomeBuildHelper;
    this.getHumanRefNames  = getHumanRefNamesFunc;
    this.helpMsg = "If this error persists, Please email <a href='mailto:iobioproject@gmail.com'>iobioproject@gmail.com</a> for help resolving this issue.";

    // TODO: Should be able to use this.globalApp.IOBIO_SERVICES for new Client(),
    // but the trailing '/' breaks the requests. Probably need to update
    // iobio-api-client to handle that case.
    const httpScheme = this.globalApp.useSSL ? 'https://' : 'http://';

    if (this.globalApp.launchedFromUtahMosaic) {
      this.api = new Client(httpScheme + process.env.IOBIO_BACKEND_MOSAIC);
    }
    else {
      // NOTE:  to point to a different (for example, a dev.backend.iobio.io:9001),
      // don't change it here.  Edit the .env file, setting IOBIO_BACKEND to
      // the dev server.
      //this.api = new Client( 'https://mosaic.chpc.utah.edu/gru-dev-9002');

      this.api = new Client(httpScheme + process.env.IOBIO_BACKEND);
    }

    // iobio services
    this.IOBIO = {};
    this.IOBIO.tabix                   = this.globalApp.IOBIO_SERVICES  + (this.globalApp.useOnDemand ? "od_tabix/" : "tabix/");
    this.IOBIO.snpEff                  = this.globalApp.IOBIO_SERVICES  + "snpeff/";
    this.IOBIO.vt                      = this.globalApp.IOBIO_SERVICES  + "vt/";
    this.IOBIO.af                      = this.globalApp.IOBIO_SERVICES  + "af/";
    this.IOBIO.vep                     = (this.globalApp.launchedFromUtahMosaic === true ? this.globalApp.IOBIO_SERVICES : this.globalApp.GREEN_IOBIO) + "vep/";   // Inside utah mosaic, normal services, else beefy nv-green to accommodate sfari
    this.IOBIO.contigAppender          = this.globalApp.IOBIO_SERVICES  + "ctgapndr/";
    this.IOBIO.bcftools                = this.globalApp.IOBIO_SERVICES  + "bcftools/";
    this.IOBIO.gnomadAnnot             = this.globalApp.DEV_IOBIO       + "gnomad_annot/";
    this.IOBIO.coverage                = this.globalApp.IOBIO_SERVICES  + "coverage/";
    this.IOBIO.samtools                = this.globalApp.IOBIO_SERVICES  +  "samtools/";
    this.IOBIO.samtoolsOnDemand        = this.globalApp.IOBIO_SERVICES  + (this.globalApp.useOnDemand ? "od_samtools/" : "samtools/");
    this.IOBIO.freebayes               = this.globalApp.IOBIO_SERVICES  + "freebayes/";
    this.IOBIO.vcflib                  = this.globalApp.IOBIO_SERVICES  + "vcflib/";
    this.IOBIO.geneCoverage            = this.globalApp.IOBIO_SERVICES  + "genecoverage/";
    this.IOBIO.knownvariants           = this.globalApp.IOBIO_SERVICES  + "knownvariants/";

    this.gruBackend = true;
  }



    getVcfHeader(vcfUrl, tbiUrl) {
        const me = this;
        if (this.gruBackend) {
            let cmd = this.api.streamCommand('variantHeader', {url: vcfUrl, indexUrl: tbiUrl});
            return cmd;
        }
    }

    getChromosomes(vcfUrl, tbiUrl) {
        const me = this
        if (this.gruBackend) {
            let cmd = this.api.streamCommand('getChromosomes', {url: vcfUrl, indexUrl: tbiUrl});

            return cmd;
        }
    }

    /* Returns only the columns of a VCF file which contain fields necessary to create a unique identifier for a variant.
     * These include: POS, REF, ALT and INFO
     * Can be used when determining if a variant exists in two samples across VCF files, for instance.
     * Currently used in Oncogene for COSMIC comparison */
    getVariantIds(vcfSource, refName, regions) {
        const me = this;

        let cmd = null;
        if (me.gruBackend) {
            cmd = me.api.streamCommand('getIdColumns', {vcfUrl: vcfSource.vcfUrl, regions});

            cmd.on('error', function (error) {
              let msg = "Error obtaining sample Ids from vcf file. Make sure your vcf file is properly formatted, and that the provided URL is accessible. <code>" + vcfSource.vcfUrl + "</code>" ;
              alertify.alert("<div class='pb-2 dark-text-important'>"+   msg +  "</div>" + me.helpMsg)
                .setHeader("Fatal Error");
              console.log("error in get vcf header", error)
            });
            return cmd;
        }
    }

    /* Retrieves ClinVar variants from backend to populate ClinVar variants track. Only returns variants with
     * the ClinSig fields matching those described in the provided clinSigFilterObj argument.
     * NOTE: this service only available for gru-1.0.0 and later */
    getClinvarVariants(vcfSource, refName, regions, clinSigFilterPhrase, gnomadExtra) {
        const me = this;
        const refNames = this.getHumanRefNames(refName).split(" ");
        const genomeBuildName = this.genomeBuildHelper.getCurrentBuildName();
        const refFastaFile = this.genomeBuildHelper.getFastaPath(refName);
        let gnomadMergeAnnots = gnomadExtra && me.globalApp.gnomADExtraMethod == me.globalApp.GNOMAD_METHOD_MERGE_ANNOTS 
        
        let vepCustom = null;
        if (gnomadExtra && me.globalApp.gnomADExtraMethod == me.globalApp.GNOMAD_METHOD_CUSTOM_VEP) {
            // Get the info fields in the gnomAD vcf based on the build and genomes vs exomes
            gnomadFieldsGenomes = me.globalApp.getGnomADFields(me.genomeBuildHelper.getCurrentBuildName(),
                "genomes");
            gnomadFieldsExomes  = me.globalApp.getGnomADFields(me.genomeBuildHelper.getCurrentBuildName(),
                "exomes");
            vepCustom = "-custom "
                + me.globalApp.getGnomADUrl(me.genomeBuildHelper.getCurrentBuildName(),
                    me.globalApp.utility.stripRefName(refName),
                    "genomes",
                    false)
                + ',gnomADg,vcf,exact,0,'
                + gnomadFieldsGenomes;
            if (gnomadFieldsExomes) {
                vepCustom += " -custom "
                    + me.globalApp.getGnomADUrl(me.genomeBuildHelper.getCurrentBuildName(),
                        me.globalApp.utility.stripRefName(refName),
                        "exomes",
                        false)
                    + ',gnomADe,vcf,exact,0,'
                    + gnomadFieldsExomes;
            }
        }

        const cmd = this.api.streamCommand('getClinvarVariantsV2', {
            vcfUrl: vcfSource.vcfUrl,
            tbiUrl: vcfSource.tbiUrl,
            refNames,
            regions,
            refFastaFile,
            genomeBuildName,
            gnomadMergeAnnots,
            clinSigFilterPhrase
        });

        return cmd;
    }

    annotateVariants(vcfSource, refName, regions, vcfSampleNames, annotationEngine, isRefSeq, hgvsNotation, getRsId, vepAF, useServerCache, serverCacheKey, sfariMode = false, gnomadExtra, decompose, bypassAnnotate) {
        let me = this;
        if (this.gruBackend) {
            const refNames = this.getHumanRefNames(refName).split(" ");
            const genomeBuildName = this.genomeBuildHelper.getCurrentBuildName();
            const refFastaFile = this.genomeBuildHelper.getFastaPath(refName);
            let gnomadMergeAnnots = gnomadExtra && me.globalApp.gnomADExtraMethod == me.globalApp.GNOMAD_METHOD_MERGE_ANNOTS 
            let vepCustom = null;
            if (gnomadExtra && me.globalApp.gnomADExtraMethod == me.globalApp.GNOMAD_METHOD_CUSTOM_VEP) {

              // Get the info fields in the gnomAD vcf based on the build and genomes vs exomes
              gnomadFieldsGenomes = me.globalApp.getGnomADFields(me.genomeBuildHelper.getCurrentBuildName(),
               "genomes");
              gnomadFieldsExomes  = me.globalApp.getGnomADFields(me.genomeBuildHelper.getCurrentBuildName(),
                "exomes");


              vepCustom = "-custom "
                          + me.globalApp.getGnomADUrl(me.genomeBuildHelper.getCurrentBuildName(),
                                                      me.globalApp.utility.stripRefName(refName),
                                                      "genomes",
                                                      false)
                          + ',gnomADg,vcf,exact,0,'
                          + gnomadFieldsGenomes;


              if (gnomadFieldsExomes) {
                vepCustom += " -custom "
                         + me.globalApp.getGnomADUrl(me.genomeBuildHelper.getCurrentBuildName(),
                                                      me.globalApp.utility.stripRefName(refName),
                                                      "exomes",
                                                      false)
                         + ',gnomADe,vcf,exact,0,'
                         + gnomadFieldsExomes;
              }


              

            }

            const cmd = this.api.streamCommand('annotateVariantsV2', {
                vcfUrl: vcfSource.vcfUrl,
                tbiUrl: vcfSource.tbiUrl,
                refNames,
                regions,
                vcfSampleNames: vcfSampleNames.split(','),
                refFastaFile,
                genomeBuildName,
                isRefSeq,
                hgvsNotation,
                getRsId,
                vepAF,
                sfariMode,
                vepREVELFile: this.globalApp.getRevelUrl(this.genomeBuildHelper.getCurrentBuildName()),
                gnomadMergeAnnots,
                decompose,
                bypassAnnotate
            });

            return cmd;
        }
    }

    normalizeVariants(vcfUrl, tbiUrl, refName, regions, vcfSampleNames=null, decompose=false) {
        const me = this;
        if (this.gruBackend) {
            let refFastaFile = me.genomeBuildHelper.getFastaPath(refName);
            // do with annotateVariants
            let contigStr = "";
            me.getHumanRefNames(refName).split(" ").forEach(function (ref) {
                contigStr += "##contig=<ID=" + ref + ">\n";
            });
            let cmd = this.api.streamCommand('normalizeVariants', {
                vcfUrl,
                tbiUrl,
                refName,
                regions,
                contigStr,
                refFastaFile,
                vcfSampleNames: vcfSampleNames ? vcfSampleNames.split(',') : '',
                decompose
            });
            return cmd;
        }
    }

    getCountsForGene(url, refName, geneObject, binLength, regions, annotationMode, requiresVepService = false) {
        const me = this;
        if (this.gruBackend) {
            let vepArgs = '';
            if (requiresVepService) {
                vepArgs += " --assembly " + this.genomeBuildHelper.getCurrentBuildName();
                vepArgs += " --format vcf";
                vepArgs += " --allele_number";
            }

            let cmd = this.api.streamCommand('clinvarCountsForGene', {
                clinvarUrl: url,
                region: {
                    refName,
                    start: geneObject.start,
                    end: geneObject.end,
                },
                binLength,
                regions,
                annotationMode: annotationMode,
                requiresVepService: requiresVepService,
                vepArgs: vepArgs
            });

            return cmd;
        }
    }



    getClinvarPhenotypesForGene(url, refName, geneObject, regions) {
        const me = this;
        if (this.gruBackend) {

            let cmd = this.api.streamCommand('clinvarCountsForGene', {
                clinvarUrl: url,
                region: {
                    refName,
                    start: geneObject.start,
                    end: geneObject.end,
                },
                annotationMode: 'phenotype'
            });

            return cmd;
        }
    }


    getBamHeader(bamUrl, baiUrl) {
        const me = this;
        if (this.gruBackend) {
            let cmd = this.api.streamCommand('alignmentHeader', {url: bamUrl});
            return cmd;
        }
    }

    getBamCoverage(bamSource, refName, regionStart, regionEnd, regions, maxPoints, useServerCache, serverCacheKey) {
      const me = this;
        if (this.gruBackend) {
            const url = bamSource.bamUrl;
            const samtoolsRegion = {refName, start: regionStart, end: regionEnd};
            const indexUrl = bamSource.baiUrl;
            maxPoints = maxPoints ? maxPoints : 0;

            let cmd = this.api.streamCommand('alignmentCoverage', {
                url,
                indexUrl,
                samtoolsRegion,
                maxPoints,
                coverageRegions: regions
            });
            
            return cmd;
        }
    }

    freebayesJointCall(bamSources, refName, regionStart, regionEnd, isRefSeq, fbArgs, vepAF, sampleNames, gnomadExtra, decompose) {
        const me = this;
        if (this.gruBackend) {

            const refFastaFile = this.genomeBuildHelper.getFastaPath(refName);

            const refNames = this.getHumanRefNames(refName).split(" ");
            const genomeBuildName = this.genomeBuildHelper.getCurrentBuildName();
            const clinvarUrl = this.globalApp.getClinvarUrl(genomeBuildName);

            let gnomadUrl = null;
            let gnomadRegionStr = null;

            if (gnomadExtra) {
              // Get the gnomad vcf based on the genome build
              gnomadUrl = me.globalApp.getGnomADUrl(me.genomeBuildHelper.getCurrentBuildName(), me.globalApp.utility.stripRefName(refName));
              // Prepare args to annotate with gnomAD
              gnomadRegionStr = refName + "\t" + regionStart + "\t" + regionEnd;

            }

            let cmd = this.api.streamCommand('freebayesJointCallV2', {
                alignmentSources: bamSources,
                refFastaFile,
                region: {
                    refName,
                    start: regionStart,
                    end: regionEnd,
                },
                fbArgs,
                refNames,
                genomeBuildName,
                vepREVELFile: this.globalApp.getRevelUrl(this.genomeBuildHelper.getCurrentBuildName()),
                vepAF,
                isRefSeq,
                clinvarUrl,
                sampleNames,
                decompose
            });

            return cmd;
        }
    }

    getGeneCoverage(bamSources, refName, geneName, regionStart, regionEnd, regions) {
        const me = this;
        if (this.gruBackend) {
            const url = bamSources[0].bamUrl;
            const indexUrl = bamSources[0].baiUrl;

            let cmd = this.api.streamCommand('geneCoverage', {
                url,
                indexUrl,
                refName,
                geneName,
                regionStart,
                regionEnd,
                regions
            });

            return cmd;
        }
    }
}


