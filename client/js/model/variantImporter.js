function VariantImporter() {



}

VariantImporter.geminiFields = ['chrom', 'start', 'end', 'ref', 'alt', 'gene', 'transcript'];

VariantImporter.fields = {
  'chrom':      {required: true},
  'start':      {required: true},
  'end':        {required: false},
  'ref':        {required: true},
  'alt':        {required: true},
  'gene':       {required: true},
  'transcript': {required: false}

}

VariantImporter.fieldMap = {
  'chromosome':      'chrom',
  'final_positions': 'start',
  'ref_allele':      'ref',
  'alt_allele':      'alt',
  'gene_name':       'gene'
}

VariantImporter.parseRecords = function(importSource, data) {
  if (importSource == 'gene') {
    return VariantImporter.parseRecordsCSV(data);
  } else if (importSource == 'gemini') {
    return VariantImporter.parseRecordsGemini(data);
  } else if (importSource == 'tsv') {
    return VariantImporter.parseRecordsTSV(data);
  }
}

VariantImporter.parseRecordsCSV = function(data) {
  var recCount = 0;
  var fieldNames = [];
  var importRecords = [];
  data.split(/[\r\n]+/g).forEach( function(rec) {
    /*
      Validate a CSV string having single, double or un-quoted values.
      ^                                   # Anchor to start of string.
      \s*                                 # Allow whitespace before value.
      (?:                                 # Group for value alternatives.
        '[^'\\]*(?:\\[\S\s][^'\\]*)*'     # Either Single quoted string,
      | "[^"\\]*(?:\\[\S\s][^"\\]*)*"     # or Double quoted string,
      | [^,'"\s\\]*(?:\s+[^,'"\s\\]+)*    # or Non-comma, non-quote stuff.
      )                                   # End group of value alternatives.
      \s*                                 # Allow whitespace after value.
      (?:                                 # Zero or more additional values
        ,                                 # Values separated by a comma.
        \s*                               # Allow whitespace before value.
        (?:                               # Group for value alternatives.
          '[^'\\]*(?:\\[\S\s][^'\\]*)*'   # Either Single quoted string,
        | "[^"\\]*(?:\\[\S\s][^"\\]*)*"   # or Double quoted string,
        | [^,'"\s\\]*(?:\s+[^,'"\s\\]+)*  # or Non-comma, non-quote stuff.
        )                                 # End group of value alternatives.
        \s*                               # Allow whitespace after value.
      )*                                  # Zero or more additional values
      $                                   # Anchor to end of string.
    */
    var regexp = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g
    var match = regexp.exec(rec);

    var importRec = {};
    var idx = 0;
    while (match != null) {
      // matched text: match[0]
      // match start: match.index
      // capturing group n: match[n]
      if (recCount == 0) {
        fieldNames.push(match[2]);
      } else {
        importRec[fieldNames[idx]] = match[2];
      }
      match = regexp.exec(rec);
      idx++;
    }
    if (recCount > 0 && Object.keys(importRec).length > 0) {
      importRec.importSource = "gene"
      importRec.importFormat = "csv";
      importRecords.push(importRec);
    }
    recCount++;
  });
  return importRecords;
}

VariantImporter.parseRecordsGemini = function(data) {
  var fieldNames = VariantImporter.geminiFields;
  var importRecords = [];

  var recs = data.split(/[\r\n]+/g);
  recs.forEach( function(rec) {
    var fields = rec.split(/\s+/);
    if (fields.length == 0 || fields[0] == "chrom" || fields[0] == '') {
      // Ignore the header line or a blank link
    } else {
      // Parse the tab separate record into fields
      var importRec = {};
      for (var i = 0; i < fields.length; i++) {
        importRec[fieldNames[i]] = fields[i];
      }
      importRec.importSource = "gemini"
      importRec.importFormat = "tsv";
      importRecords.push(importRec);
    }
  });
  return importRecords;
}

VariantImporter.parseRecordsTSV = function(data) {
  var idxMap = {};
  var properFieldNames = {};
  var importRecords = [];

  var recs = data.split(/[\r\n]+/g);

  if (recs.length > 0) {
    var fieldNames = recs[0].split(/\s+/);
    var idx = 0;
    fieldNames.forEach(function(fieldName) {
      var properFieldName = null;
      if (VariantImporter.fields[fieldName]) {
        properFieldName = fieldName;
      } else if (VariantImporter.fieldMap[fieldName]) {
        properFieldName = VariantImporter.fieldMap[fieldName];
      }

      if (properFieldName) {
        idxMap[idx] = properFieldName;
        properFieldNames[properFieldName] = true;
      }

      idx++;
    })
  }

  var isParsable = true;
  for (var key in VariantImporter.fields) {
    var fieldInfo = VariantImporter.fields[key];
    if (fieldInfo.required && !properFieldNames[key]) {
      isParsable = false;
    }
  }

  if (isParsable) {
    // Now parse the data records based on the field names provided in
    // the first record
    for (var i = 1; i < recs.length; i++) {
      var rec = recs[i];

      if (rec.trim().length > 0) {

        var fields = rec.split(/\s+/);

        // Parse the tab separate record into fields
        var importRec = {};
        for (var x = 0; x < fields.length; x++) {
          var properFieldName = idxMap[x];
          if (properFieldName) {
            var value = fields[x];

            // Replace - with . (for alt and ref)
            if (properFieldName == 'alt' || properFieldName == 'ref') {
              if (value == '-') {
                value = '.';
              }
            }

            importRec[properFieldName] = value;
          }
        }
        importRecords.push(importRec);
      }

    };

  }
  return importRecords;
}
