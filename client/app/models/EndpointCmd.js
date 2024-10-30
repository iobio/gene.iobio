import { Client } from 'iobio-api-client';

export default class EndpointCmd {

  constructor(globalApp, launchTimestamp, genomeBuildHelper, getHumanRefNamesFunc, launchedFromMosaic) {
    this.globalApp         = globalApp;
    this.launchTimestamp   = launchTimestamp;
    this.genomeBuildHelper = genomeBuildHelper;
    this.getHumanRefNames  = getHumanRefNamesFunc;
    this.helpMsg = "If this error persists, Please email <a href='mailto:iobioproject@gmail.com'>iobioproject@gmail.com</a> for help resolving this issue.";

    // TODO: Should be able to use this.globalApp.IOBIO_SERVICES for new Client(),
    // but the trailing '/' breaks the requests. Probably need to update
    // iobio-api-client to handle that case.
    const httpScheme = this.globalApp.useSSL ? 'https://' : 'http://';

    if (launchedFromMosaic) {
      // NOTE:  
      // To point to a non-production server when launching gene.iobio from Mosaic, avoid making
      // a hardcoded change here. You have a couple of cleaner options to make sure that all of
      // the backend requests are going to the same iobio backend server.
      //
      // Option 1. When Mosaic launches gene.iobio, a URL parameter called 'source' is set to the
      // Mosaic backend server. In GeneHome.vue setAppMode() the iobio backend source is determined
      // by a lookup map (hubToIobioSources) where the key is the URL parameter 'source'. 
      // Modify this lookup map so that the iobio field is set to the dev server. Here is 
      // example code in GeneHome.vue that points to the dev Mosaic server running on port gru-dev-9002:
      //   hubToIobioSources: {
      //      "https://mosaic.chpc.utah.edu":  {iobio: "mosaic.chpc.utah.edu/gru-dev-9002", batchSize: 10},
      // 
      // Option 2. When Mosaic launches gene.iobio, add a URL parameter 'iobioSource' that points
      // to the dev server.  Example:
      //   http://localhost:4026#access_token=xxxxxxxxxx&iobioSource=mosaic.chpc.utah.edu/gru-dev-9002
      //
      this.api = new Client(globalApp.IOBIO_SERVICES);
    }
    else {
      // NOTE:  To point to a different (for example, a dev.backend.iobio.io:9002),
      // avoid making a hardcoded change here. Instead, a cleaner approach is to edit the .env file, 
      // setting IOBIO_BACKEND to the dev server. Example in .env:
      //    IOBIO_BACKEND=mosaic.chpc.utah.edu/gru-dev-9005
      
      this.api = new Client(globalApp.IOBIO_SERVICES);
    }

    
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
    getClinvarVariants(vcfSource, refName, regions, clinSigFilterPhrase) {
        const me = this;
        const refNames = this.getHumanRefNames(refName).split(" ");
        const genomeBuildName = this.genomeBuildHelper.getCurrentBuildName();
        const refFastaFile = this.genomeBuildHelper.getFastaPath(refName);
        let gnomadMergeAnnots = true;

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

    annotateVariants(vcfSource, refName, regions, vcfSampleNames, annotationEngine, isRefSeq, hgvsNotation, getRsId, useServerCache, serverCacheKey, sfariMode = false, decompose, bypassAnnotate) {
      let me = this;
      if (this.gruBackend) {
          const refNames = this.getHumanRefNames(refName).split(" ");
          if (refNames.indexOf(refName) < 0) {
            refNames.push(refName)
          }
          const genomeBuildName = this.genomeBuildHelper.getCurrentBuildName();
          const refFastaFile = this.genomeBuildHelper.getFastaPath(refName);


          const cmd = this.api.streamCommand('annotateVariantsV3', {
              vcfUrl: vcfSource.vcfUrl,
              tbiUrl: vcfSource.tbiUrl,
              refNames,
              regions,
              vcfSampleNames: vcfSampleNames.split(','),
              refFastaFile,
              genomeBuildName,
              hgvsNotation,
              getRsId,
              vepREVELFile: this.globalApp.getRevelUrl(this.genomeBuildHelper.getCurrentBuildName()),
              decompose,
              bypassAnnotate
          });

          return cmd;
      }
    }

    annotateVariantsV2(vcfSource, refName, regions, vcfSampleNames, annotationEngine, isRefSeq, hgvsNotation, getRsId, useServerCache, serverCacheKey, sfariMode = false, decompose, bypassAnnotate) {
        let me = this;
        if (this.gruBackend) {
            const refNames = this.getHumanRefNames(refName).split(" ");
            const genomeBuildName = this.genomeBuildHelper.getCurrentBuildName();
            const refFastaFile = this.genomeBuildHelper.getFastaPath(refName);
            let gnomadMergeAnnots = true;

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

    freebayesJointCallV2(bamSources, refName, regionStart, regionEnd, isRefSeq, fbArgs, sampleNames, decompose) {
        const me = this;
        if (this.gruBackend) {

            const refFastaFile = this.genomeBuildHelper.getFastaPath(refName);

            const refNames = this.getHumanRefNames(refName).split(" ");
            const genomeBuildName = this.genomeBuildHelper.getCurrentBuildName();
            const clinvarUrl = this.globalApp.getClinvarUrl(genomeBuildName);

            let gnomadUrl = me.globalApp.getGnomADUrl(me.genomeBuildHelper.getCurrentBuildName(), me.globalApp.utility.stripRefName(refName));
            // Prepare args to annotate with gnomAD
            let gnomadRegionStr = refName + "\t" + regionStart + "\t" + regionEnd;


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
                isRefSeq,
                clinvarUrl,
                sampleNames,
                decompose
            });

            return cmd;
        }
    }

    freebayesJointCall(bamSources, refName, regionStart, regionEnd, isRefSeq, fbArgs, sampleNames, decompose) {
      const me = this;
      if (this.gruBackend) {

          const refFastaFile = this.genomeBuildHelper.getFastaPath(refName);

          const refNames = this.getHumanRefNames(refName).split(" ");
          const genomeBuildName = this.genomeBuildHelper.getCurrentBuildName();
          const clinvarUrl = this.globalApp.getClinvarUrl(genomeBuildName);


          let cmd = this.api.streamCommand('freebayesJointCallV3', {
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


