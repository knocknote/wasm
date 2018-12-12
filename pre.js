Module['TOTAL_MEMORY'] = 65536;
Module['TOTAL_STACK']  = 32768;

Module['preInit'] = function() {
  ASMJS_PAGE_SIZE  = 65536;
  MIN_TOTAL_MEMORY = 65536;
};

Module['instantiateWasm'] = function(imports, successCallback) {
  function downloadWasm(url) {
    return new Promise(function(resolve, reject) {
      var wasmXHR = new XMLHttpRequest();
      wasmXHR.open('GET', url, true);
      wasmXHR.responseType = 'arraybuffer';
      wasmXHR.onload = function() { resolve(wasmXHR.response); };
      wasmXHR.onerror = function() { reject('error '  + wasmXHR.status); };
      wasmXHR.send(null);
    });
  };
  return downloadWasm('/{{ .Name }}.wasm?v={{ .Version }}').
    then(function(wasmBinary) {
      return WebAssembly.instantiate(new Uint8Array(wasmBinary), imports).
        then(function(output) {
          successCallback(output.instance);
          imports.parent.then = null;
          return Promise.resolve(imports.parent);
        });
    }).catch(function(err) {
      removeRunDependency('wasm-instantiate');
      throw err;
    });
};
