class BookmarkModel {
  constructor(geneModel) {
    this.bookmarks = [];
    this.geneModel = geneModel;
  }

  addBookmark(variant, gene) {
    if (!this.exists(variant)) {
      variant.isBookmark = true;
      this.bookmarks.push({'gene': gene, 'variant': variant, 'isFavorite': false});
    }
  }

  removeBookmark(bookmark) {
    var idx = this.getIndex(bookmark.variant);
    if (idx >= 0) {
      bookmark.variant.isBookmark = false;
      this.bookmarks.splice(idx,1);
    }
  }

  exists(variant) {
    let self = this;
    return this.bookmarks.filter(function(bookmark) {
      return self.getKey(bookmark) == self.getKey({'variant': variant});
    }).length > 0;
  }

  getIndex(variant) {
    let self = this;
    var index = null;
    var i = 0;
    this.bookmarks.forEach(function(bookmark) {
      if (index == null && self.getKey(bookmark) == self.getKey({'variant': variant})) {
        index = i;
      }
      i++;
    });
    return index == null ?  -1 : index;
  }

  getKey(bookmark) {
    return bookmark.variant.chrom + ":" + bookmark.variant.start + ":" + bookmark.variant.ref + ":" + bookmark.variant.alt;
  }

  onBookmarkFileSelected(fileSelection, bookmarkFileType) {
    var files = fileSelection.currentTarget.files;
    var me = this;
    // Check for the various File API support.
    if (window.FileReader) {
      var bookmarkFile = files[0];
      var reader = new FileReader();

      reader.readAsText(bookmarkFile);

      // Handle errors load
      reader.onload = function(event) {
        var data = event.target.result;
        me.importBookmarks(bookmarkFileType, data);
        fileSelection.value = null;
      }
      reader.onerror = function(event) {
        alert("Cannot read file. Error: " + event.target.error.name);
        console.log(event.toString())
      }

    } else {
      alert('FileReader are not supported in this browser.');
    }
  }


  importBookmarks(bookmarkFileType, data) {
    var me = this;

    // Prompt user to keep or remove existing bookmarks (if any exist)
    if (me.bookmarks.length > 0) {
      alertify.confirm("",
        "There are " + me.bookmarks.length + " bookmarked variants already loaded.  Do you want to keep these?",
        function (e) {
          // user clicked "keep bookmarks"
          me.importBookmarksImpl(importSource, data);

          alertify.defaults.glossary.ok = 'OK';
          alertify.defaults.glossary.cancel = 'Cancel';
        },
        function() {
          // user clicked 'remove bookmarks'.

          //  clear out the bookmarks
          me.bookmarks = [];

          // Now import the new bookmarks
          me.importBookmarksImpl(bookmarkFileType, data);

          alertify.defaults.glossary.ok = 'OK';
          alertify.defaults.glossary.cancel = 'Cancel';
        }

      ).set('labels', {ok:'Keep bookmarks', cancel:'Clear out existing bookmarks'});
    } else {
      me.importBookmarksImpl(bookmarkFileType, data);
    }
  }



  importBookmarksImpl(bookmarkFileType, data) {
    var me = this;

    var importRecords = VariantImporter.parseRecords(bookmarkFileType, data);

    // If the number of bookmarks exceeds the max gene limit, truncate the
    // bookmarked variants to this max.
    if (global_maxGeneCount && importRecords.length > global_maxGeneCount) {
      var bypassedCount = importRecords.length - global_maxGeneCount;
      importRecords = importRecords.slice(0, global_maxGeneCount);
      alertify.alert("Only first " + global_maxGeneCount + " bookmarks will be imported. " + bypassedCount.toString() + " were bypassed.");
    }


    // We need to make sure each imported record has a transcript.
    // So first, cache all of the gene objects for the imported bookmarks
    var promises = []

    importRecords.forEach( function(ir) {
      if (!ir.transcript || ir.transcript == '') {
        var promise = me.geneModel.promiseGetCachedGeneObject(ir.gene, true);
        promises.push(promise);
      }
    })

    // Now that all of the gene objects have been cached, we can fill in the
    // transcript if necessary and then find load the imported bookmarks
    Promise.all(promises).then(function() {
      importRecords.forEach( function(ir) {
        var geneObject = me.geneModel.geneObjects[ir.gene];
        if (!ir.transcript || ir.transcript == '') {
          var tx = geneObject ? me.geneModel.getCanonicalTranscript(geneObject) : null;
          if (tx) {
            ir.transcript = tx.transcript_id;
          }
        }
        me.bookmarks.push({'gene': geneObject, 'variant': ir, isProxy: true, isFavorite: ir.isFavorite })

      });



    })

  }


}

export default BookmarkModel;