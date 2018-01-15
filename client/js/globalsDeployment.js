/*  These global variables determine which iobio servers the gene.iobio app with interact
    with for a local deployment.  This entire .js can be replaced or modified to suit the
    specific iobio deployment environment.
*/
var version               = "2.6";

var isOffline             = false;          // is there any internet connect to outside services and resources?
var isClinvarOffline      = false;          // is clinvar offline?  (Pull from clinvar hosted from URL?)
var accessNCBIGeneSummary = true;           // is it okay to access NCBI web resources to obtain the refseq gene summary?  In cases where the server and client are COMPLETELY offline, set this to false.

var useOnDemand           = true;           // use on demand tabix and samtools

var serverInstance        = "@hostname@/";  // this will be replace with the name of the server used for this deployement
var serverCacheDir        = "local_cache/"; // this is the directory from the server instance where resource files (like clinvar vcf) will be served
var serverDataDir         = "local_cache/"; // this is the directory from the server instance where data files will be served
var offlineUrlTag         = "site:"         // this is the first part if the vcf/bam URL that indicates that a special URL should be constructed to get to files served from the local isntance

var useSSL                = true;
var useServerCache        = false;

// config files
var global_siteConfigUrl    =  "https://s3.amazonaws.com/gene.iobio.config/site-config.json";
var global_clinvarGenesUrl  =  "https://s3.amazonaws.com/gene.iobio.config/clinvar-counts.txt";

// Get clinvar annotations from 'eutils' or 'vcf'
var clinvarSource         = "vcf";

// Allow freebayes runtime args to be set by user
var allowFreebayesSettings  = false;

// get hgvs, rsid annotation for all variants
var global_getVariantIdsForGene = false;

// How many genes can be analyzed in one session.  Set to null if no limitation.
var global_maxGeneCount         = 100;

// Should vep retrieve allele frequencies (for gnomad, 1000G, ESP)
var global_vepAF                = true ;

// What browser cache implementation is used: 'localStorage' or 'indexedDB'
var BROWSER_CACHE_LOCAL_STORAGE = 'localStorage';
var BROWSER_CACHE_INDEXED_DB    = 'indexedDB';
var global_browserCache         = BROWSER_CACHE_INDEXED_DB;

/*
* This variable controls special behavior for running gene.iobio education edition, with
* a simplified interface and logic.
* See @import statements for levelEdu  in css/assets/sass.
*/
var isLevelEdu            = false;   // is gene.iobio educational version, simplified version of app

/*
* These variables control special behavior for running gene.iobio basic mode, with
* a simplified interface and logic.  For running the Mygene2 gene.iobio basic mode,
* TURN ON BOTH isLevelBasic and isMygene2.  For running Mygene2 gene.iobio advanced mode,
* TURN ON only isMygene2.
* See @import statements for levelEdu and levelEduTour in css/assets/sass.
*/
var isLevelBasic          = false;    // is gene.iobio basic mode?
var isMygene2             = false;    // show the mygene2 intro panel?

var feedbackEmails              = "gene.iobio.feedback@gmail.com";  // what emails should feedback be sent to?   if no emails are provided, the feedback link will be hidden
var feedbackAttachScreenCapture = false;          // should the feedback include a screen capture?
var feedbackShowURL             = false;         // show the feedback email show the URL that launched gene.iobio?

var autocall              = null       // If only alignments provided, should variants be automatically called when gene is selected?


var siteGeneSource        = isMygene2 ? "refseq" : "gencode";      // what should the gene source default to: refseq or gencode?
var DEFAULT_BATCH_SIZE    = 5;              // how many genes can be analyzed simultaneously for 'Analyze all'
