import iobiocmd from '../third-party/iobio.js'
import { Client } from 'iobio-api-client';

export default class EndpointCmd {

  constructor(globalApp, launchTimestamp, genomeBuildHelper, getHumanRefNamesFunc) {
    this.globalApp         = globalApp;
    this.launchTimestamp   = launchTimestamp;
    this.genomeBuildHelper = genomeBuildHelper;
    this.getHumanRefNames  = getHumanRefNamesFunc;

    if (this.globalApp.launchedFromUtahMosaic) {
      this.api = new Client(process.env.IOBIO_BACKEND_MOSAIC, { secure: this.globalApp.useSSL });
    }
    else {
      // NOTE:  to point to a different (for example, a dev.backend.iobio.io:9001),
      // don't change it here.  Edit the .env file, setting IOBIO_BACKEND to
      // the dev server.
      this.api = new Client(process.env.IOBIO_BACKEND, { secure: this.globalApp.useSSL });
    }

    // iobio services
    this.IOBIO = {};
    this.IOBIO.tabix                   = this.globalApp.IOBIO_SERVICES  + (this.globalApp.useOnDemand ? "od_tabix/" : "tabix/");
    this.IOBIO.vcfReadDepther          = this.globalApp.IOBIO_SERVICES  + "vcfdepther/";
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
            let header = this.api.streamCommand('variantHeader', {url: vcfUrl, indexUrl: tbiUrl});
            header.on('error', function(error){
              let msg = "Error obtaining vcf header for file: " + vcfUrl + "\n Make sure your vcf file is properly formatted, and that the provided URL is accessible.";
              alertify.alert("<div class='pb-2 dark-text-important'>"+   msg +  "</div>  <div class='pb-2' font-italic>Please email <a href='mailto: iobioproject@gmail.com'>iobioproject@gmail.com</a> for help resolving this issue.</div><code>" + error + "</code>").setHeader("Fatal Error");
               console.log("error in get vcf header", error)
            })

            return header;
        }
    }

    getVcfDepth(vcfUrl, tbiUrl) {
        let me = this
        if (this.gruBackend) {
            if (!tbiUrl) {
                tbiUrl = vcfUrl + '.tbi';
            }
            let cmd = this.api.streamCommand('vcfReadDepth', {url: tbiUrl});

            cmd.on('error', function(error){
                if(error.includes("Expected compressed file")){

                  let msg = "Vcf or vcf index file is not compressed. This will prevent variants from being annotated.  Check to make sure your vcf files are properly compressed in gzip format " + vcfUrl;
                  alertify.alert("<div class='pb-2 dark-text-important'>"+   msg +  "</div>  <div class='pb-2' font-italic>Please email <a href='mailto: iobioproject@gmail.com'>iobioproject@gmail.com</a> for help resolving this issue.</div><code>" + error + "</code>")
                    .setHeader("Fatal Error");
                }
                else{
                  let msg = "Could not get vcf depth.  Make sure that your vcf.gz and gz.tbi files are accessible and properly formated" + vcfUrl;
                  alertify.alert("<div class='pb-2 dark-text-important'>"+   msg +  "</div>  <div class='pb-2' font-italic>Please email <a href='mailto: iobioproject@gmail.com'>iobioproject@gmail.com</a> for help resolving this issue.</div><code>" + error + "</code>")
                    .setHeader("Fatal Error");
                }
            })
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

              let msg = "Error obtaining sample Ids from vcf file " + vcfUrl + "\n Make sure your vcf file is properly formatted, and that the provided URL is accessible.";
              alertify.alert("<div class='pb-2 dark-text-important'>"+   msg +  "</div>  <div class='pb-2' font-italic>Please email <a href='mailto: iobioproject@gmail.com'>iobioproject@gmail.com</a> for help resolving this issue.</div><code>" + error + "</code>")
                .setHeader("Fatal Error");
              console.log("error in get vcf header", error)
            });
            return cmd;
        }
    }

    annotateVariants(vcfSource, refName, regions, vcfSampleNames, annotationEngine, isRefSeq, hgvsNotation, getRsId, vepAF, useServerCache, serverCacheKey, sfariMode = false, gnomadExtra, decompose) {
        let me = this;
        if (this.gruBackend) {
            const refNames = this.getHumanRefNames(refName).split(" ");
            const genomeBuildName = this.genomeBuildHelper.getCurrentBuildName();
            const refFastaFile = this.genomeBuildHelper.getFastaPath(refName);

            let gnomadUrl = null;
            let gnomadRegionStr = null;

            if (gnomadExtra) {

              // Get the gnomad vcf based on the genome build
              gnomadUrl = me.globalApp.getGnomADUrl(me.genomeBuildHelper.getCurrentBuildName(), me.globalApp.utility.stripRefName(refName));

              // Prepare args to annotate with gnomAD
              gnomadRegionStr = "";
              regions.forEach(function(region) {
                gnomadRegionStr += refName + "\t" + region.start + "\t" + region.end + "\n";
              })
            }

            const cmd = this.api.streamCommand('annotateVariants', {
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
                vepREVELFile: this.globalApp.vepREVELFile,
                gnomadUrl: gnomadUrl ? gnomadUrl : '',
                gnomadRegionStr: gnomadRegionStr ? gnomadRegionStr : '',
                decompose
            });

            cmd.on('error', function(error){
                let msg = "Could not annotate variants.  This is likely an error with the gene.iobio.io backend. The server may be under a heavy load. Please try again"
                alertify.alert("<div class='pb-2 dark-text-important'>"+   msg +  "</div>  <div class='pb-2' font-italic>Please email <a href='mailto: iobioproject@gmail.com'>iobioproject@gmail.com</a> for help resolving this issue.</div><code>" + error + "</code>")
                .setHeader("Non-fatal Error");
            })
            return cmd;
        }
    }

    normalizeVariants(vcfUrl, tbiUrl, refName, regions) {
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
                refFastaFile
            });
            cmd.on('error', function(error) {
              let msg = "Could not normalize variants.  This is likely an error with the gene.iobio.io backend. The server may be under a heavy load. Please try again"
              alertify.alert("<div class='pb-2 dark-text-important'>"+   msg +  "</div>  <div class='pb-2' font-italic>Please email <a href='mailto: iobioproject@gmail.com'>iobioproject@gmail.com</a> for help resolving this issue.</div><code>" + error + "</code>")
                .setHeader("Non-fatal Error");
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

            cmd.on('error', function(error) {
              let msg = "Could not get variant counts from clinVar."
              alertify.alert("<div class='pb-2 dark-text-important'>"+   msg +  "</div>  <div class='pb-2' font-italic>Please email <a href='mailto: iobioproject@gmail.com'>iobioproject@gmail.com</a> for help resolving this issue.</div><code>" + error + "</code>")
                .setHeader("Non-fatal Error");
            });
            return cmd;
        }
    }

    getBamHeader(bamUrl, baiUrl) {
        if (this.gruBackend) {
            let cmd = this.api.streamCommand('alignmentHeader', {url: bamUrl});
            cmd.on('error', function(error) {

              let msg = "Could not interpret Bam file.  Make sure that the bam file is properly formatted and accessible\n" + bamUrl;
              alertify.alert("<div class='pb-2 dark-text-important'>"+   msg +  "</div>  <div class='pb-2' font-italic>Please email <a href='mailto: iobioproject@gmail.com'>iobioproject@gmail.com</a> for help resolving this issue.</div><code>" + error + "</code>")
                .setHeader("Fatal Error");
                console.log(error);
            });
            return cmd;
        }
    }

    getBamCoverage(bamSource, refName, regionStart, regionEnd, regions, maxPoints, useServerCache, serverCacheKey) {
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

            cmd.on('error', function(error) {
              let msg = "Could not get get coverage from region: \n" + refName + ':' + regionStart + '-' + regionEnd + "\n Bam index file may be invalid";
              alertify.alert("<div class='pb-2 dark-text-important'>"+   msg +  "</div>  <div class='pb-2' font-italic>Please email <a href='mailto: iobioproject@gmail.com'>iobioproject@gmail.com</a> for help resolving this issue.</div><code>" + error+ "</code>")
                .setHeader("Fatal Error");
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

            let cmd = this.api.streamCommand('freebayesJointCall', {
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
                vepREVELFile: this.globalApp.vepREVELFile,
                vepAF,
                isRefSeq,
                clinvarUrl,
                sampleNames,
                gnomadUrl: gnomadUrl ? gnomadUrl : '',
                gnomadRegionStr: gnomadRegionStr ? gnomadRegionStr : '',
                decompose
            });

            cmd.on('error', function(error) {
              let msg = "Could not perform freebayes joint calling for region:\n" + refName + ':' + regionStart + '-' + regionEnd;
              alertify.alert("<div class='pb-2 dark-text-important'>"+   msg +  "</div>  <div class='pb-2' font-italic>Please email <a href='mailto: iobioproject@gmail.com'>iobioproject@gmail.com</a> for help resolving this issue.</div><code>" + error+ "</code>")
                .setHeader("Non-fatal Error");
            });
            return cmd;
        }
    }

    getGeneCoverage(bamSources, refName, geneName, regionStart, regionEnd, regions) {
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

            cmd.on('error', function(error) {
              let msg = "Could not get gene coverage from region: \n" + refName + ':' + regionStart + '-' + regionEnd + "\n Bam index file may be invalid";
              alertify.alert("<div class='pb-2 dark-text-important'>"+   msg +  "</div>  <div class='pb-2' font-italic>Please email <a href='mailto: iobioproject@gmail.com'>iobioproject@gmail.com</a> for help resolving this issue.</div><code>" + error+ "</code>")
                .setHeader("Fatal Error");
            });
            return cmd;
        }
    }
}


