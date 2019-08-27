/*  These app.global variables determine which iobio servers the gene.iobio app with interact
    with for a local deployment.  This entire .js can be replaced or modified to suit the
    specific iobio deployment environment.
*/
class GlobalApp {
  constructor() {

    this.cacheHelper           = null;
    this.tour                  = "";
    this.completedTour         = "";

    this.version               = "3.2.1";

    this.DEV_IOBIO             = "nv-dev-new.iobio.io/";
    this.STAGE_IOBIO           = "nv-green.iobio.io/";
    this.GREEN_IOBIO           = "nv-green.iobio.io/";  // Must always stay at green to accommodate VEP service
    this.PROD_IOBIO            = "nv-prod.iobio.io/";

    this.IOBIO_SOURCE          = this.PROD_IOBIO;
    this.HTTP_SOURCE           = this.PROD_IOBIO;


    this.isOffline             = false;          // is there any internet connect to outside services and resources?
    this.isClinvarOffline      = false;          // is clinvar offline?  (Pull from clinvar hosted from URL?)
    this.accessNCBIGeneSummary = true;           // is it okay to access NCBI web resources to obtain the refseq gene summary?  In cases where the server and client are COMPLETELY offline, set this to false.

    this.useOnDemand           = true;           // use on demand tabix and samtools

    this.serverInstance        = "@hostname@/";  // this will be replace with the name of the server used for this deployement
    this.serverCacheDir        = "local_cache/"; // this is the directory from the server instance where resource files (like clinvar vcf) will be served
    this.serverDataDir         = "local_cache/"; // this is the directory from the server instance where data files will be served
    this.offlineUrlTag         = "site:"         // this is the first part if the vcf/bam URL that indicates that a special URL should be constructed to get to files served from the local isntance

    this.useSSL                = true;
    this.useServerCache        = false;


    this.IOBIO_SERVICES        = null;
    this.HTTP_SERVICES         = null;
    this.emailServer           = null;
    this.hpoLookupUrl          = null;


    // config files
    this.siteConfigUrl         =  { 'prod': "https://s3.amazonaws.com/gene.iobio.config/site-config.json",
                                    'dev': "https://s3.amazonaws.com/gene.iobio.config/site-config-dev.json" };
    this.clinvarGenesUrl       =  "https://s3.amazonaws.com/gene.iobio.config/clinvar-counts.txt";

    // Get clinvar annotations from 'eutils' or 'vcf'
    this.clinvarSource         = "vcf";

    // get hgvs, rsid annotation for all variants
    this.getVariantIdsForGene = false;

    // get gnomad extra info
    this.gnomADExtra          = false;

    // How many genes can be analyzed in one session.  Set to null if no limitation.
    this.maxGeneCount         = null;

    // Should vep retrieve allele frequencies (for gnomad, 1000G, ESP)
    this.vepAF                = true ;

    this.vepREVELFile         = './vep-cache/revel_all_chromosomes_for_vep.tsv.gz';

    // What browser cache implementation is used: 'localStorage' or 'indexedDB'
    this.BROWSER_CACHE_LOCAL_STORAGE = 'localStorage';
    this.BROWSER_CACHE_INDEXED_DB    = 'indexedDB';
    this.defaultBrowserCache         = this.BROWSER_CACHE_INDEXED_DB;

    this.BROWSER_CACHE_EXPIRATION    = 3 * 60 * 60 * 1000;  // 3 HOURS



    this.feedbackEmails              = "gene.iobio.feedback@gmail.com";  // what emails should feedback be sent to?   if no emails are provided, the feedback link will be hidden
    this.feedbackAttachScreenCapture = false;          // should the feedback include a screen capture?
    this.feedbackShowURL             = false;         // show the feedback email show the URL that launched gene.iobio?

    this.autocall                    = null       // If only alignments provided, should variants be automatically called when gene is selected?


    this.DEFAULT_BATCH_SIZE          = 10;         // how many genes can be analyzed simultaneously for 'Analyze all'
    this.ignoreAlignments            = false;     // By pass any processing of aligments?

    this.keepLocalStorage            = false; // maintain cache between sessions?
    this.eduModeVariantSize          = 10;

    // Fields
    this.impactFieldToFilter         = 'highestImpactVep';
    this.impactFieldToColor          = 'vepImpact';

  }

  initServices() {

    this.IOBIO_SERVICES        = this.isOffline              ? this.serverInstance : this.IOBIO_SOURCE;

    // End with "/" for IOBIO services
    if (this.IOBIO_SERVICES.indexOf("/", this.IOBIO_SERVICES.length - 1) == -1) {
        this.IOBIO_SERVICES += "/";
    }

    this.HTTP_SERVICES         = (this.useSSL ? "https://" : "http://") + (this.isOffline ? this.serverInstance : this.HTTP_SOURCE);
    this.emailServer           = (this.useSSL ? "wss://" : "ws://") +   this.IOBIO_SOURCE + "email/";
    this.hpoLookupUrl          = this.HTTP_SERVICES + "hpo/hot/lookup/?term=";

  }

  getClinvarUrl(build) {

      var clinvarUrls = {
        'GRCh37': "ftp://ftp.ncbi.nlm.nih.gov/pub/clinvar/vcf_GRCh37/archive_2.0/2018/clinvar_20181202.vcf.gz",
        'GRCh38': "ftp://ftp.ncbi.nlm.nih.gov/pub/clinvar/vcf_GRCh38/archive_2.0/2018/clinvar_20181202.vcf.gz",
      };
      return clinvarUrls[build];

  }

  getGnomADUrl(build, chrom) {

    var gnomADSource = {
      'GRCh37': 'http://storage.googleapis.com/gnomad-public/release/2.1.1/vcf/exomes/gnomad.exomes.r2.1.1.sites.CHROM-ALIAS.vcf.bgz',
      'GRCh38': 'ftp://ftp.ensembl.org/pub/data_files/homo_sapiens/GRCh38/variation_genotype/gnomad/r2.1/exomes/gnomad.exomes.r2.1.sites.grch38.chrCHROM-ALIAS_noVEP.vcf.gz'
    }
    var theUrl = gnomADSource[build];
    theUrl = theUrl.replace(/CHROM-ALIAS/g, chrom);
    return theUrl;
  }

  getGnomADHeader() {

    var hdrRecs = [
      "##INFO=<ID=AC,Number=A,Type=Integer,Description=\"Alternate allele count for samples\">",
      "##INFO=<ID=AN,Number=1,Type=Integer,Description=\"Total number of alleles in samples\">",
      "##INFO=<ID=AF,Number=A,Type=Float,Description=\"Alternate allele frequency in samples\">",
      "##INFO=<ID=nhomalt_raw,Number=A,Type=Integer,Description=\"Count of homozygous individuals in samples, before removing low-confidence genotypes\">",
      "##INFO=<ID=AF_popmax,Number=A,Type=Float,Description=\"Maximum allele frequency across populations (excluding samples of Ashkenazi, Finnish, and indeterminate ancestry)\">",
      "##INFO=<ID=AC_fin,Number=A,Type=Integer,Description=\"Alternate allele count for samples of Finnish ancestry\">",
      "##INFO=<ID=AN_fin,Number=1,Type=Integer,Description=\"Total number of alleles in samples of Finnish ancestry\">",
      "##INFO=<ID=AF_fin,Number=A,Type=Float,Description=\"Alternate allele frequency in samples of Finnish ancestry\">",
      "##INFO=<ID=AC_nfe,Number=A,Type=Integer,Description=\"Alternate allele count for samples of Non-Finnish European ancestry\">",
      "##INFO=<ID=AN_nfe,Number=1,Type=Integer,Description=\"Total number of alleles in samples of Non-Finnish European ancestry\">",
      "##INFO=<ID=AF_nfe,Number=A,Type=Float,Description=\"Alternate allele frequency in samples of Non-Finnish European ancestry\">",
      "##INFO=<ID=AC_oth,Number=A,Type=Integer,Description=\"Alternate allele count for samples of Other ancestry\">",
      "##INFO=<ID=AN_oth,Number=1,Type=Integer,Description=\"Total number of alleles in samples of Other ancestry\">",
      "##INFO=<ID=AF_oth,Number=A,Type=Float,Description=\"Alternate allele frequency in samples of Other ancestry\">",
      "##INFO=<ID=AC_amr,Number=A,Type=Integer,Description=\"Alternate allele count for samples of Latino ancestry\">",
      "##INFO=<ID=AN_amr,Number=1,Type=Integer,Description=\"Total number of alleles in samples of Latino ancestry\">",
      "##INFO=<ID=AF_amr,Number=A,Type=Float,Description=\"Alternate allele frequency in samples of Latino ancestry\">",
      "##INFO=<ID=AC_afr,Number=A,Type=Integer,Description=\"Alternate allele count for samples of African-American/African ancestry\">",
      "##INFO=<ID=AN_afr,Number=1,Type=Integer,Description=\"Total number of alleles in samples of African-American/African ancestry\">",
      "##INFO=<ID=AF_afr,Number=A,Type=Float,Description=\"Alternate allele frequency in samples of African-American/African ancestry\">",
      "##INFO=<ID=AC_asj,Number=A,Type=Integer,Description=\"Alternate allele count for samples of Ashkenazi Jewish ancestry\">",
      "##INFO=<ID=AN_asj,Number=1,Type=Integer,Description=\"Total number of alleles in samples of Ashkenazi Jewish ancestry\">",
      "##INFO=<ID=AF_asj,Number=A,Type=Float,Description=\"Alternate allele frequency in samples of Ashkenazi Jewish ancestry\">",
      "##INFO=<ID=AC_eas,Number=A,Type=Integer,Description=\"Alternate allele count for samples of East Asian ancestry\">",
      "##INFO=<ID=AN_eas,Number=1,Type=Integer,Description=\"Total number of alleles in samples of East Asian ancestry\">",
      "##INFO=<ID=AF_eas,Number=A,Type=Float,Description=\"Alternate allele frequency in samples of East Asian ancestry\">",
      "##INFO=<ID=AC_sas,Number=A,Type=Integer,Description=\"Alternate allele count for samples of South Asian ancestry\">",
      "##INFO=<ID=AN_sas,Number=1,Type=Integer,Description=\"Total number of alleles in samples of South Asian ancestry\">",
      "##INFO=<ID=AF_sas,Number=A,Type=Float,Description=\"Alternate allele frequency in samples of South Asian ancestry\">",
    ];
    var buf = "";
    hdrRecs.forEach(function(hdrRec) {
        buf += hdrRec;
    })
    return buf;
  }




}

export default GlobalApp

