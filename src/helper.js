let UserAgent;
if (!global.GLOBAL) {
  require('uupaa.useragent.js/lib/WebModule.js');
  global.GLOBAL = global;
}
UserAgent = require('uupaa.useragent.js/lib/UserAgent');

export default class WasmHelper {
  constructor() {
    this.ua = new UserAgent();
  }

  canUseWebAssembly() {
    return window.WebAssembly !== undefined
      && !this.isIgnoreBrowser()
      && WasmHelper.validateSafariWebAssemblyBug();
  }

  // FYI : https://github.com/brion/min-wasm-fail
  static validateSafariWebAssemblyBug() {
    const binary = new Uint8Array([
      0, 97, 115, 109, 1, 0, 0, 0, 1, 6, 1, 96, 1,
      127, 1, 127, 3, 2, 1, 0, 5, 3, 1, 0, 1, 7, 8,
      1, 4, 116, 101, 115, 116, 0, 0, 10, 16, 1, 14,
      0, 32, 0, 65, 1, 54, 2, 0, 32, 0, 40, 2, 0, 11,
    ]);
    const module = new WebAssembly.Module(binary);
    const instance = new WebAssembly.Instance(module, {});
    // test storing to and loading from a non-zero location via a parameter.
    // Safari on iOS 11.2.X returns 0 unexpectedly at non-zero locations
    return instance.exports.test(4) !== 0;
  }

  isIgnoreBrowser() {
    // Android Default Browser is not supported because it will be unexpected behaviour.
    if (this.isAndroidDefaultBrowser()) { return true; }

    // Google Chrome version less or 60 is not supported WebAssembly fully.
    if (this.ua.Chrome && this.browserMajorVersion() <= 60) {
      return true;
    }
    return false;
  }

  browserMajorVersion() {
    const semanticVersion = this.ua.BROWSER_VERSION.split('.');
    if (semanticVersion.length === 3) {
      return parseInt(semanticVersion[0], 10);
    }
    return 0;
  }

  isAndroidDefaultBrowser() {
    const ua = this.ua;
    if (!ua.Android) { return false; }

    return ((/Linux; U;/.test(ua) && !/Chrome/.test(ua))
            || (/Chrome/.test(ua) && /Version/.test(ua))
            || (/Chrome/.test(ua) && /SamsungBrowser/.test(ua)));
  }
}
