/*  These app.global variables determine which iobio servers the gene.iobio app with interact
    with for a local deployment.  This entire .js can be replaced or modified to suit the
    specific iobio deployment environment.
*/
var globalApp = {};

globalApp.cacheHelper           = null;
globalApp.tour                  = "";
globalApp.completedTour         = "";
globalApp.utility               = new Util();

globalApp.version               = "3.0";

globalApp.DEV_IOBIO             = "nv-dev-new.iobio.io/";
globalApp.STAGE_IOBIO           = "nv-purple.iobio.io/";
globalApp.PROD_IOBIO            = "nv-blue.iobio.io/";
globalApp.CURRENT_IOBIO         = globalApp.PROD_IOBIO;


globalApp.isOffline             = false;          // is there any internet connect to outside services and resources?
globalApp.isClinvarOffline      = false;          // is clinvar offline?  (Pull from clinvar hosted from URL?)
globalApp.accessNCBIGeneSummary = true;           // is it okay to access NCBI web resources to obtain the refseq gene summary?  In cases where the server and client are COMPLETELY offline, set this to false.

globalApp.useOnDemand           = true;           // use on demand tabix and samtools

globalApp.serverInstance        = "@hostname@/";  // this will be replace with the name of the server used for this deployement
globalApp.serverCacheDir        = "local_cache/"; // this is the directory from the server instance where resource files (like clinvar vcf) will be served
globalApp.serverDataDir         = "local_cache/"; // this is the directory from the server instance where data files will be served
globalApp.offlineUrlTag         = "site:"         // this is the first part if the vcf/bam URL that indicates that a special URL should be constructed to get to files served from the local isntance

globalApp.useSSL                = true;
globalApp.useServerCache        = false;



globalApp.IOBIO_SERVICES        = globalApp.isOffline              ? globalApp.serverInstance : globalApp.CURRENT_IOBIO;
globalApp.HTTP_SERVICES         = (globalApp.useSSL ? "https://" : "http://") + (globalApp.isOffline ? globalApp.serverInstance : globalApp.CURRENT_IOBIO);
globalApp.emailServer           = (globalApp.useSSL ? "wss://" : "ws://") +   globalApp.IOBIO_SERVICES + "email/";




// config files
globalApp.siteConfigUrl         =  "https://s3.amazonaws.com/gene.iobio.config/site-config.json";
globalApp.clinvarGenesUrl       =  "https://s3.amazonaws.com/gene.iobio.config/clinvar-counts.txt";

// Get clinvar annotations from 'eutils' or 'vcf'
globalApp.clinvarSource         = "vcf";


// get hgvs, rsid annotation for all variants
globalApp.getVariantIdsForGene = false;

// How many genes can be analyzed in one session.  Set to null if no limitation.
globalApp.maxGeneCount         = 100;

// Should vep retrieve allele frequencies (for gnomad, 1000G, ESP)
globalApp.vepAF                = true ;

// What browser cache implementation is used: 'localStorage' or 'indexedDB'
globalApp.BROWSER_CACHE_LOCAL_STORAGE = 'localStorage';
globalApp.BROWSER_CACHE_INDEXED_DB    = 'indexedDB';
globalApp.browserCache                = globalApp.BROWSER_CACHE_INDEXED_DB;


globalApp.feedbackEmails              = "gene.iobio.feedback@gmail.com";  // what emails should feedback be sent to?   if no emails are provided, the feedback link will be hidden
globalApp.feedbackAttachScreenCapture = false;          // should the feedback include a screen capture?
globalApp.feedbackShowURL             = false;         // show the feedback email show the URL that launched gene.iobio?

globalApp.autocall                    = null       // If only alignments provided, should variants be automatically called when gene is selected?


globalApp.DEFAULT_BATCH_SIZE          = 10;              // how many genes can be analyzed simultaneously for 'Analyze all'

globalApp.keepLocalStorage            = false; // maintain cache between sessions?
globalApp.eduModeVariantSize          = 10;

// Fields
globalApp.impactFieldToFilter         = 'highestImpactVep';
globalApp.impactFieldToColor          = 'vepImpact';
