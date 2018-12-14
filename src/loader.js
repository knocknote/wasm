import WasmHelper from './helper';

/**
 * @example
 * const loader = new WasmLoader();
 * loader.load(
 *   () => import('./hello-wasm'),
 *   () => import('./hello')
 * ).then(module => {
 *   console.log('loaded module', module);
 *   module.hello();
 * });
 * @class WasmLoader
*/
export default class WasmLoader {
  constructor() {
    this.helper = new WasmHelper();
  }

  /**
   * Load call dynamic import statement for loading wasm module.  
   * First, try to call dynamic import callback for **`wasm`** module. 
   * But if your browser doesn't support to `WebAssembly`,
   * this try to call dynamic import callback for **`asm.js`** module.
   *
   * @memberof WasmLoader
   * @param {Function} - returns Promise by dynamic import for wasm
   * @param {Function} - returns Promise by dynamic import for asm.js
   * @return {Promise}
   */
  load(wasmImportCallback, asmjsImportCallback) {
    if (!this.helper.canUseWebAssembly()) {
      return this._loadFromAsmJS(asmjsImportCallback);
    }

    return this._loadFromWasm(wasmImportCallback, asmjsImportCallback);
  }

  static _loadFromAsmJS(asmjsImportCallback) {
    if (!asmjsImportCallback) {
      return Promise.reject(new Error('required callback for asm.js'));
    }

    return asmjsImportCallback().then((module) => {
      const loadedModule = module();
      loadedModule.then  = null; // remove promise object
      return loadedModule;
    });
  }

  _loadFromWasm(wasmImportCallback, asmjsImportCallback) {
    if (!wasmImportCallback) {
      return Promise.reject(new Error('required callback for wasm'));
    }

    return wasmImportCallback().then(module => module().asm)
      .catch(() => {
        // cannot load wasm module. fallback to asm.js
        return this._loadFromAsmJS(asmjsImportCallback);
      });
  }
}
