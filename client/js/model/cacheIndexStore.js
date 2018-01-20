function CacheIndexStore() {
  this.db = null;
  this.version = 3;
  this.app = "gene.iobio";
  this.objectStores = {'vcfData': null, 'fbData' : null, 'dangerSummary': null, 'geneCoverage': null, 'bamData': null};
}

CacheIndexStore.prototype.promiseInit = function(callback) {
  var me = this;

  return new Promise(function(resolve, reject) {
    window.indexedStore = {};

    // attempt to open the database
    var open = indexedDB.open(me.app, me.version);

    // upgrade/create the database if needed
    open.onupgradeneeded = function(event) {
      me.db = open.result;
      console.log('CacheIndexStore: upgraded needed..');
      me.promiseCreateObjectStores(event)
       .then(function() {
        resolve();
       })
    };

    open.onsuccess = function(ev) {
      // assign the database for access outside
      me.db = open.result;
      resolve();
    };

    open.onerror = function(event) {
      var msg = "Error in CacheIndexStore.promiseInit():  " + event.target.errorCode;
        console.log(msg);
        reject(msg);
    };

  })

}

CacheIndexStore.prototype.promiseCreateObjectStores = function(event) {
  var me = this;

  return new Promise(function(resolve, reject) {
    var existingNames = me.db.objectStoreNames;
    var promises = [];

    for (var dataKind in me.objectStores) {
      if (!existingNames.contains(dataKind)) {
        var store = me.db.createObjectStore(dataKind, {keyPath: "id"});
        var index = store.createIndex("geneIndex", "gene", {unique: false});

        var transaction = event.target.transaction;
        var p = new Promise(function(resolve, reject) {
              transaction.oncomplete = function(event) {
                    // Now store is available to be populated
                    resolve();
                }
                transaction.onerror = function(event) {
            var msg = "Error in CacheIndexStore.promiseCreateObjectStores():  " + event.target.errorCode;
              console.log(msg);
              reject(msg);
            };
        })
        promises.push(p);
      }
    }
    Promise.all(promises).then(function() {
      resolve();
    },
    function(error) {
      reject(error);
    })

  })

}

CacheIndexStore.prototype.promiseSetData = function(dataKind, gene, key, data) {
  var me = this;

  return new Promise(function(resolve, reject) {
    var tx        = me.db.transaction(dataKind, "readwrite");
      var store     = tx.objectStore(dataKind);

    tx.oncomplete = function() {
      resolve();
    }
    tx.onerror = function(event) {
      var msg = "Error in CacheIndexStore.promiseSetData():  " + event.target.errorCode;
        console.log(msg);
        reject(msg);
    }

    store.put({id: key, gene: gene, data: data});
  })


}

CacheIndexStore.prototype.promiseGetData = function(dataKind, key) {
  var me = this;


  return new Promise(function(resolve, reject) {
    var tx        = me.db.transaction(dataKind, "readonly");
      var store     = tx.objectStore(dataKind);

      var getData = store.get(key);

      getData.onsuccess = function() {
        resolve(getData.result && getData.result.hasOwnProperty("data") ? getData.result.data : null);
      };

      getData.onerror = function(event) {
        var msg = "Error in CacheIndexStore.promiseGetData():  " + event.target.errorCode + ". " + dataKind;
        console.log(msg);
        reject(msg);
      }

  })


}

CacheIndexStore.prototype.promiseRemoveData = function(dataKind, key) {
  var me = this;

  return new Promise(function(resolve, reject) {
    var tx        = me.db.transaction(dataKind, "readwrite");
      var store     = tx.objectStore(dataKind);
      var delData   = store.delete(key);

    delData.onsuccess = function(event) {
      resolve();
    }
    delData.onerror = function(event) {
        var msg = "Error in CacheIndexStore.promiseRemoveData():  " + event.target.errorCode + ". " + dataKind;
        console.log(msg);
        reject(msg);
      }
  });

}

CacheIndexStore.prototype.getDataByGene = function(dataKind, gene, callback) {

  var me = this;

  var tx         = me.db.transaction(dataKind, "readonly");
    var store      = tx.objectStore(dataKind);
    var index      = store.index("geneIndex");

    var getData    = index.getAll(gene);

    getData.onsuccess = function() {
      if (callback) {
        callback(getData.result);
      }
    };

}

CacheIndexStore.prototype.getKeys = function(dataKind, callback) {
  var me = this;
  var keys = [];

  var tx         = me.db.transaction(dataKind, "readonly");
    var store      = tx.objectStore(dataKind);

  var getKeys = store.getAllKeys();


    getKeys.onsuccess = function() {
      if (callback) {
        callback(getKeys.result);
      }
    };
}

CacheIndexStore.prototype.promiseGetAllKeys = function() {
  var me = this;

  return new Promise(function(resolve, reject) {

    if (me.hasOwnProperty('db') && me.db) {
      var allKeys = [];
      var count = 0;

      for (var dataKind in me.objectStores) {
        var tx         = me.db.transaction(dataKind, "readonly");
          var store      = tx.objectStore(dataKind);

        var getKeys = store.getAllKeys();
        getKeys.onerror = function(event) {
          var msg = "Error in CacheIndexStore.promiseGetAllKeys():  " + event.target.errorCode + ". " + dataKind;
            console.log(msg);
            reject(msg);
        }

          getKeys.onsuccess = function(event) {
          if (event.target.result != null) {
            event.target.result.forEach(function(key) {
              allKeys.push(key);
            })
          }
            count++;
            if (count == Object.keys(me.objectStores).length) {
              resolve(allKeys);
            }
          };
      }

    } else {
      resolve([]);
    }
  })

}

CacheIndexStore.prototype.showContents = function(dataKind, callback) {
  var me = this;
  var cacheEntries = [];

  var tx         = me.db.transaction(dataKind, "readonly");
    var store      = tx.objectStore(dataKind);

  var openCursor = store.openCursor();
  openCursor.onsuccess = function(ev) {
    var cursor = openCursor.result;
    if (cursor) {
      cacheEntries.push(cursor.value);
      cursor["continue"]();
    } else {
      if (callback) {
        callback(cacheEntries);
      }
    }
  };
}