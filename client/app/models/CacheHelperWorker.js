if( 'function' === typeof importScripts) {

  let self = this;
  console.log("hit CacheHelperWorker");

  self.addEventListener('message', function(e) {
    var data = e.data;
    importScripts('./lz-string.min.js');

    switch (data.cmd) {
      case 'start':
        var dataString = null;
        try {
           dataString = LZString.decompressFromUTF16(data.compressedData);
           var uncompressedData =  JSON.parse(dataString);
           postMessage({data: uncompressedData, keyObject: data.keyObject});
        } catch(e) {

        }
        break;
      case 'stop':
        self.postMessage('stopped');
        self.close(); // Terminates the worker.
        break;
      default:
        self.postMessage('unknown');
    };
  }, false);

}
