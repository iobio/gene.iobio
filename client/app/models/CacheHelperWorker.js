if( 'function' === typeof importScripts) {

  self.addEventListener('message', function(e) {
    var data = e.data;
    importScripts('./lz-string.min.js');

    console.log("data");

    switch (data.cmd) {
      case 'start':
        var dataString = null;
        try {
           dataString = LZString.decompressFromUTF16(data.compressedData);
           var uncompressedData =  JSON.parse(dataString);
           postMessage({data: uncompressedData, keyObject: data.keyObject});
        } catch(e) {
        console.log("catch e", e )
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
