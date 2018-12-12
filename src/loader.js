import WasmHelper from './helper';

/**
 * @example
 * const loader = new WasmLoader();
 * loader.load(() => import('module_with_asmjs'), () => import('module_with_wasm'))
 *   .then(module => {
 *     // use module API
 *   });
 * @class WasmLoader
 */
export default class WasmLoader {
  constructor() {
    this.helper = new WasmHelper();
  }

  /**
   * Load Module from wasm file.
   * If it cannot load from wasm, try to load from asm.js version
   *
   * @memberof WasmLoader
   * @param {Promise} - dynamic imported value for asm.js
   * @param {Promise} - dynamic imported value for wasm
   * @return {Promise}
   */
  load(asmjsImportCallback, wasmImportCallback) {
    if (!this.helper.canUseWebAssembly()) {
      return this._loadFromAsmJS(asmjsImportCallback);
    }

    return this._loadFromWasm(asmjsImportCallback, wasmImportCallback);
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

  _loadFromWasm(asmjsImportCallback, wasmImportCallback) {
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
