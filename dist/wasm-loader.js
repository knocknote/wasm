(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["WasmLoader"] = factory();
	else
		root["WasmLoader"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helper = __webpack_require__(2);

var _helper2 = _interopRequireDefault(_helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @example
 * const loader = new WasmLoader();
 * loader.load(() => import('module_with_asmjs'), () => import('module_with_wasm'))
 *   .then(module => {
 *     // use module API
 *   });
 * @class WasmLoader
 */
var WasmLoader = function () {
  function WasmLoader() {
    _classCallCheck(this, WasmLoader);

    this.helper = new _helper2.default();
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


  _createClass(WasmLoader, [{
    key: 'load',
    value: function load(asmjsImportCallback, wasmImportCallback) {
      if (!this.helper.canUseWebAssembly()) {
        return this._loadFromAsmJS(asmjsImportCallback);
      }

      return this._loadFromWasm(asmjsImportCallback, wasmImportCallback);
    }
  }, {
    key: '_loadFromWasm',
    value: function _loadFromWasm(asmjsImportCallback, wasmImportCallback) {
      var _this = this;

      if (!wasmImportCallback) {
        return Promise.reject(new Error('required callback for wasm'));
      }

      return wasmImportCallback().then(function (module) {
        return module().asm;
      }).catch(function () {
        // cannot load wasm module. fallback to asm.js
        return _this._loadFromAsmJS(asmjsImportCallback);
      });
    }
  }], [{
    key: '_loadFromAsmJS',
    value: function _loadFromAsmJS(asmjsImportCallback) {
      if (!asmjsImportCallback) {
        return Promise.reject(new Error('required callback for asm.js'));
      }

      return asmjsImportCallback().then(function (module) {
        var loadedModule = module();
        loadedModule.then = null; // remove promise object
        return loadedModule;
      });
    }
  }]);

  return WasmLoader;
}();

exports.default = WasmLoader;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserAgent = void 0;
if (!global.GLOBAL) {
  __webpack_require__(3);
  global.GLOBAL = global;
}
UserAgent = __webpack_require__(4);

var WasmHelper = function () {
  function WasmHelper() {
    _classCallCheck(this, WasmHelper);

    this.ua = new UserAgent();
  }

  _createClass(WasmHelper, [{
    key: 'canUseWebAssembly',
    value: function canUseWebAssembly() {
      return window.WebAssembly !== undefined && !this.isIgnoreBrowser() && WasmHelper.validateSafariWebAssemblyBug();
    }

    // FYI : https://github.com/brion/min-wasm-fail

  }, {
    key: 'isIgnoreBrowser',
    value: function isIgnoreBrowser() {
      // Android Default Browser is not supported because it will be unexpected behaviour.
      if (this.isAndroidDefaultBrowser()) {
        return true;
      }

      // Google Chrome version less or 60 is not supported WebAssembly fully.
      if (this.ua.Chrome && this.browserMajorVersion() <= 60) {
        return true;
      }
      return false;
    }
  }, {
    key: 'browserMajorVersion',
    value: function browserMajorVersion() {
      var semanticVersion = this.ua.BROWSER_VERSION.split('.');
      if (semanticVersion.length === 3) {
        return parseInt(semanticVersion[0], 10);
      }
      return 0;
    }
  }, {
    key: 'isAndroidDefaultBrowser',
    value: function isAndroidDefaultBrowser() {
      var ua = this.ua;
      if (!ua.Android) {
        return false;
      }

      return (/Linux; U;/.test(ua) && !/Chrome/.test(ua) || /Chrome/.test(ua) && /Version/.test(ua) || /Chrome/.test(ua) && /SamsungBrowser/.test(ua)
      );
    }
  }], [{
    key: 'validateSafariWebAssemblyBug',
    value: function validateSafariWebAssemblyBug() {
      var binary = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 6, 1, 96, 1, 127, 1, 127, 3, 2, 1, 0, 5, 3, 1, 0, 1, 7, 8, 1, 4, 116, 101, 115, 116, 0, 0, 10, 16, 1, 14, 0, 32, 0, 65, 1, 54, 2, 0, 32, 0, 40, 2, 0, 11]);
      var module = new WebAssembly.Module(binary);
      var instance = new WebAssembly.Instance(module, {});
      // test storing to and loading from a non-zero location via a parameter.
      // Safari on iOS 11.2.X returns 0 unexpectedly at non-zero locations
      return instance.exports.test(4) !== 0;
    }
  }]);

  return WasmHelper;
}();

exports.default = WasmHelper;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {// http://git.io/WebModule

// --- global variables ------------------------------------
// https://github.com/uupaa/WebModule/wiki/WebModuleIdiom
var GLOBAL = (this || 0).self || global;

// --- environment detection -------------------------------
// https://github.com/uupaa/WebModule/wiki/EnvironmentDetection
(function() {

var hasGlobal     = !!GLOBAL.global;              // Node.js, NW.js, Electron
var processType   = !!(GLOBAL.process || 0).type; // Electron(render and main)
var nativeTimer   = !!/native/.test(setTimeout);  // Node.js, Electron(main)

GLOBAL.IN_BROWSER = !hasGlobal && "document"       in GLOBAL;   // Browser and Worker
GLOBAL.IN_WORKER  = !hasGlobal && "WorkerLocation" in GLOBAL;   // Worker
GLOBAL.IN_NODE    =  hasGlobal && !processType && !nativeTimer; // Node.js
GLOBAL.IN_NW      =  hasGlobal && !processType &&  nativeTimer; // NW.js
GLOBAL.IN_EL      =  hasGlobal &&  processType;                 // Electron(render and main)

})();

// --- validation and assertion functions ------------------
//{@dev https://github.com/uupaa/WebModule/wiki/Validate
GLOBAL.$type   = function(v, types)   { return GLOBAL.Valid ? GLOBAL.Valid.type(v, types)  : true; };
GLOBAL.$keys   = function(o, keys)    { return GLOBAL.Valid ? GLOBAL.Valid.keys(o, keys)   : true; };
GLOBAL.$some   = function(v, cd, ig)  { return GLOBAL.Valid ? GLOBAL.Valid.some(v, cd, ig) : true; };
GLOBAL.$args   = function(api, args)  { return GLOBAL.Valid ? GLOBAL.Valid.args(api, args) : true; };
GLOBAL.$valid  = function(v, api, hl) { return GLOBAL.Valid ? GLOBAL.Valid(v, api, hl)     : true; };
GLOBAL.$values = function(o, vals)    { return GLOBAL.Valid ? GLOBAL.Valid.values(o, vals) : true; };
//}@dev

// --- WebModule -------------------------------------------
GLOBAL.WebModule = {
    CODE:    {},    // source code container.
    VERIFY:  false, // verify mode flag.
    VERBOSE: false, // verbose mode flag.
    PUBLISH: false, // publish flag, module publish to global namespace.
    exports: function(moduleName,      // @arg ModuleNameString
                      moduleClosure) { // @arg JavaScriptCodeString
                                       // @ret ModuleObject
        var wm = this; // GLOBAL.WebModule

        // https://github.com/uupaa/WebModule/wiki/SwitchModulePattern
        var alias = wm[moduleName] ? (moduleName + "_") : moduleName;

        if (!wm[alias]) { // secondary module already exported -> skip
            wm[alias] = moduleClosure(GLOBAL, wm, wm.VERIFY, wm.VERBOSE); // evaluate the module entity.
            wm.CODE[alias] = moduleClosure + ""; // store to the container.

            if (wm.PUBLISH && !GLOBAL[alias]) {
                GLOBAL[alias] = wm[alias]; // module publish to global namespace.
            }
        }
        return wm[alias];
    }
};


/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(0)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

(function moduleExporter(name, closure) {
"use strict";

var entity = GLOBAL["WebModule"]["exports"](name, closure);

if (true) {
    module["exports"] = entity;
}
return entity;

})("UserAgent", function moduleClosure(global /*, WebModule, VERIFY, VERBOSE */) {
"use strict";

// --- technical terms / data structure --------------------
// Microsoft Edge   - https://msdn.microsoft.com/en-us/library/hh869301(v=vs.85).aspx
// Firefox          - https://developer.mozilla.org/ja/docs/Gecko_user_agent_string_reference
// WebView          - https://developer.chrome.com/multidevice/user-agent#webview_user_agent
//                  - https://developer.chrome.com/multidevice/webview/overview#does_the_new_webview_have_feature_parity_with_chrome_for_android_
// Kindle Silk      - http://docs.aws.amazon.com/silk/latest/developerguide/user-agent.html

// --- dependency modules ----------------------------------
// --- import / local extract functions --------------------
// --- define / local variables ----------------------------
var BASE_BROWSERS = {
    "Chrome":           "Chromium",
    "Firefox":          "Firefox",
    "IE":               "IE",
    "Edge":             "Edge",
    "AOSP":             "WebKit",
    "Safari":           "WebKit",
    "WebKit":           "WebKit",
    "Chrome for iOS":   "WebKit",
    "Silk":             "WebKit", // or "Chromium" if version >= 4.4
};

// --- class / interfaces ----------------------------------
function UserAgent(userAgent, // @arg String = navigator.userAgent
                   options) { // @arg Object = {} - { WEB_VIEW, DISPLAY_DPR, DISPLAY_LONG, DISPLAY_SHORT }
    if (UserAgent["DISABLE_CACHE"]) {
        return UserAgent_parse(userAgent, options || {});
    }
    if (!UserAgent["cache"]) {
        UserAgent["cache"] = UserAgent_parse(userAgent, options || {});
    }
    return UserAgent["cache"];
}

UserAgent["DISABLE_CACHE"] = false;
UserAgent["cache"]       = null;
UserAgent["parse"]       = UserAgent_parse; // UserAgent.parse(ua:UserAgent:String = navigator.userAgent, options:Object = {}):Object
UserAgent["repository"]  = "https://github.com/uupaa/UserAgent.js";

// --- implements ------------------------------------------
function UserAgent_parse(userAgent, // @arg String = navigator.userAgent
                         options) { // @arg Object = {} - { WEB_VIEW, DISPLAY_DPR, DISPLAY_LONG, DISPLAY_SHORT }
                                    // @options.WEB_VIEW Boolean = false
                                    // @options.DISPLAY_DPR Number = window.devicePixelRatio || 1.0
                                    // @options.DISPLAY_LONG Number = Math.max(screenWidth, screenHeight)
                                    // @options.DISPLAY_SHORT Number = Math.min(screenWidth, screenHeight)
                                    // @ret Object
    options = options || {};

    var nav                 = global["navigator"] || {};
    var ua                  = userAgent || nav["userAgent"] || "";
    var carrier             = _detectFeaturePhoneCarrier(ua);
    var os                  = _detectOS(ua);
    var osVersion           = _detectOSVersion(ua, os);
    var browser             = _detectBrowser(ua);
    var browserVersion      = _detectBrowserVersion(ua, browser);
    var baseBrowser         = _detectBaseBrowser(browser, parseFloat(osVersion));
    var device              = _detectDevice(ua, os, osVersion, options, carrier);
    var lang                = _detectLanguage(nav);
    var mobile              = carrier ? true : (/Android|iOS/.test(os) || /Windows Phone/.test(ua));
    var iOS                 = os === "iOS";
    var android             = os === "Android";
    var webView             = _isWebView(ua, os, browser, browserVersion, options);
    var touch3D             = /^(iPhone 6s|iPhone 7)/.test(device) ||
                              parseFloat(osVersion) >= 10 && /^iPad Pro/.test(device);
    var es5                 = /native/.test(Object["keys"] + "");
    var es6                 = /native/.test(String["raw"]  + "");

    var result = {
        "OS":               os,                         // OS String.      "iOS", "Mac", "Android", "Windows", "Firefox", "Chrome OS", ""
        "OS_VERSION":       osVersion,                  // Semver String.  "{{Major}},{{Minor}},{{Patch}}"
        "PC":              !mobile,                     // is PC.          Windows, Mac, Chrome OS
        "MOBILE":           mobile,                     // is Mobile.      Android, iOS, WindowsPhone
        "BROWSER":          browser,                    // Browser Name.   "Chrome", "Firefox", "IE", "Edge", "AOSP", "Safari", "WebKit", "Chrome for iOS", "Silk", ""
        "BASE_BROWSER":     baseBrowser,                // Base Name.      "Chromium", "Firefox", "IE", "Edge", "WebKit"
        "BROWSER_VERSION":  browserVersion,             // Semver String.  "{{Major}},{{Minor}},{{Patch}}"
        "USER_AGENT":       ua,                         // UserAgent String.
        "LANGUAGE":         lang,                       // Language String. "en", "ja", ...
        "WEB_VIEW":         webView,                    // is WebView.
        "DEVICE":           device,                     // Device name String.
        "TOUCH_3D":         touch3D,                    // Device has 3D touch function.
        "CARRIER":          carrier,                    // Telecom carrier. "DOCOMO", "KDDI", "SOFTBANK", ""
        "FEATURE_PHONE":  !!carrier,                    // is Feature Phone.
        "ES5":              es5,                        // ES5, support Object.keys
        "ES6":              es6,                        // ES6, support String.raw
        "ES2015":           es6,                        // ES2015, support String.raw [alias]
        // --- OS ---
        "iOS":              iOS,                        // is iOS.      (iPhone, iPad, iPod)
        "Mac":              os === "Mac",               // is Mac OS X. [alias]
        "macOS":            os === "Mac",               // is macOS.
        "Android":          android,                    // is Android.
        "Windows":          os === "Windows",           // is Windows.  (Windows, WindowsPhone)
        // --- browser and flavor ---
        "IE":               browser     === "IE",       // is IE
        "Edge":             browser     === "Edge",     // is Edge
        "Firefox":          browser     === "Firefox",  // is Firefox
        "Chrome":           browser     === "Chrome",   // is Chrome
        "Safari":           browser     === "Safari",   // is Safari
        "Silk":             browser     === "Silk",     // is Kindle Silk Browser. (WebKit or Chromium based browser)
        "AOSP":             browser     === "AOSP",     // is AOSP Stock Browser. (WebKit based browser)
        "WebKit":           baseBrowser === "WebKit",   // is WebKit based browser
        "Chromium":         baseBrowser === "Chromium", // is Chromium based browser
        // --- device ---
        "iPod":             iOS && /iPod/.test(ua),     // is iPod
        "iPad":             iOS && /iPad/.test(ua),     // is iPad
        "iPhone":           iOS && /iPhone/.test(ua),   // is iPhone
        "Kindle":           browser     === "Silk",     // is Kindle
        // --- accessor ---
        "has":              function(k) { return typeof this[k] !== "undefined"; }, // has(key:String):Boolean
        "get":              function(k) { return this[k]; }, // get(key:String):Any
    };
    return result;
}

function _detectLanguage(nav) {
    var lang = nav["language"] || "en";

    if (nav["languages"] && Array.isArray(nav["languages"])) {
        lang = nav["languages"][0] || lang;
    }
    return lang.split("-")[0]; // "en-us" -> "en"
}

function _detectOS(ua) {
    switch (true) {
    case /Android/.test(ua):            return "Android";
    case /iPhone|iPad|iPod/.test(ua):   return "iOS";
    case /Windows/.test(ua):            return "Windows";
    case /Mac OS X/.test(ua):           return "Mac";
    case /CrOS/.test(ua):               return "Chrome OS";
    case /Firefox/.test(ua):            return "Firefox OS";
    }
    return "";
}

function _detectOSVersion(ua, os) {
    switch (os) {
    case "Android":                     return _getVersion(ua, "Android");
    case "iOS":                         return _getVersion(ua, /OS /);
    case "Windows":                     return _getVersion(ua, /Phone/.test(ua) ? /Windows Phone (?:OS )?/
                                                                                : /Windows NT/);
    case "Mac":                         return _getVersion(ua, /Mac OS X /);
    }
    return "0.0.0";
}

function _detectBrowser(ua) {
    var android = /Android/.test(ua);

    switch (true) {
    case /CriOS/.test(ua):              return "Chrome for iOS"; // https://developer.chrome.com/multidevice/user-agent
    case /Edge/.test(ua):               return "Edge";
    case android && /Silk\//.test(ua):  return "Silk"; // Kidle Silk browser
    case /Chrome/.test(ua):             return "Chrome";
    case /Firefox/.test(ua):            return "Firefox";
    case android:                       return "AOSP"; // AOSP stock browser
    case /MSIE|Trident/.test(ua):       return "IE";
    case /Safari\//.test(ua):           return "Safari";
    case /AppleWebKit/.test(ua):        return "WebKit";
    }
    return "";
}

function _detectBrowserVersion(ua, browser) {
    switch (browser) {
    case "Chrome for iOS":              return _getVersion(ua, "CriOS/");
    case "Edge":                        return _getVersion(ua, "Edge/");
    case "Chrome":                      return _getVersion(ua, "Chrome/");
    case "Firefox":                     return _getVersion(ua, "Firefox/");
    case "Silk":                        return _getVersion(ua, "Silk/");
    case "AOSP":                        return _getVersion(ua, "Version/");
    case "IE":                          return /IEMobile/.test(ua) ? _getVersion(ua, "IEMobile/")
                                             : /MSIE/.test(ua)     ? _getVersion(ua, "MSIE ") // IE 10
                                                                   : _getVersion(ua, "rv:");  // IE 11
    case "Safari":                      return _getVersion(ua, "Version/");
    case "WebKit":                      return _getVersion(ua, "WebKit/");
    }
    return "0.0.0";
}

function _detectBaseBrowser(browser, osVer) {
    if (browser === "Silk" && osVer >= 4.4) {
        return "Chromium";
    }
    return BASE_BROWSERS[browser] || "";
}

function _detectDevice(ua, os, osVersion, options, carrier) {
    var screen        = global["screen"] || {};
    var screenWidth   = screen["width"]  || 0;
    var screenHeight  = screen["height"] || 0;
    var dpr           = options["DISPLAY_DPR"]   || global["devicePixelRatio"] || 1.0;
    var long_         = options["DISPLAY_LONG"]  || Math.max(screenWidth, screenHeight);
    var short_        = options["DISPLAY_SHORT"] || Math.min(screenWidth, screenHeight);
    var retina        = dpr >= 2;
    var longEdge      = Math.max(long_, short_); // iPhone 4s: 480, iPhone 5: 568

    switch (os) {
    case "Android":                     return _getAndroidDevice(ua, retina);
    case "iOS":                         return _getiOSDevice(ua, retina, longEdge, osVersion);
    }
    return carrier ? _detectFeaturePhoneDevice(ua, carrier) : "";
}

function _getAndroidDevice(ua, retina) {
    if (/Firefox/.test(ua)) { return ""; } // exit Firefox for Android
    try {
        var result = ua.split("Build/")[0].split(";").slice(-1).join().trim().
                     replace(/^SonyEricsson/, "").
                     replace(/^Sony/, "").replace(/ 4G$/, "");
        if (result === "Nexus 7") {
            return retina ? "Nexus 7 2nd" // Nexus 7 (2013)
                          : "Nexus 7";    // Nexus 7 (2012)
        }
        return result;
    } catch ( o__o ) {
        // ignore
    }
    return "";
}

function _getiOSDevice(ua, retina, longEdge, osVersion) {
    var WebGLDetector = global["WebModule"]["WebGLDetector"] || {};

    if ("detect" in WebGLDetector) {
        WebGLDetector["detect"]();
    }

    // see: https://github.com/uupaa/WebGLDetector.js/wiki/Examples
    var glVersion  = WebGLDetector["WEBGL_VERSION"] || "";
    var glRenderer = WebGLDetector["WEBGL_RENDERER"] || "";
  //var SGX535     = /535/.test(glVersion);         // iPhone 3GS, iPhone 4
    var SGX543     = /543/.test(glVersion);         // iPhone 4s/5/5c, iPad 2/3, iPad mini
    var SGX554     = /554/.test(glVersion);         // iPad 4
    var A7         = /A7 /.test(glVersion);         // iPhone 5s, iPad mini 2/3, iPad Air
    var A8X        = /A8X/.test(glVersion);         // A8X: iPad Air 2
    var A8         = /A8 /.test(glVersion);         // A8:  iPhone 6/6+, iPad mini 4, iPod touch 6
    var A9X        = /A9X/.test(glVersion);         // A9X: iPad Pro, iPad Pro 9.7
    var A9         = /A9 /.test(glVersion);         // A9:  iPhone 6s/6s+/SE, iPad 5
    var Metal      = /Metal/.test(glVersion);       // A10: iPhone 7/7+
    var simulator  = /Software/.test(glRenderer);   // Simulator: "Apple Software Renderer"

    //
    // | UserAgent#DEVICE             | zoomed | longEdge | width x height |
    // |------------------------------|--------|----------|----------------|
    // | iPhone 3/3GS                 |        | 480      |   320 x 480    |
    // | iPhone 4/4s/5/5c/5s/SE       |        | 568      |   320 x 568    |
    // | iPhone 6/6s/7                | YES    | 568      |   320 x 568    |
    // | iPhone 6/6s/7                |        | 667      |   375 x 667    |
    // | iPhone 6+/6s+/7+             | YES    | 667      |   375 x 667    |
    // | iPhone 6+/6s+/7+             |        | 736      |   414 x 736    |
    // | iPad 1/2/mini                |        | 1024     |   768 x 1024   |
    // | iPad 3/4/5/Air/mini2/Pro 9.7 |        | 1024     |   768 x 1024   |
    // | iPad Pro                     |        | 1366     |  1024 x 1366   |

    if (/iPhone/.test(ua)) {

        // | UserAgent#DEVICE | zoomed | detected device width x height |
        // |------------------|--------|--------------------------------|
        // | "iPhone 6"       | YES    | iPhone 6  (320 x 568)          |
        // | "iPhone 6s"      | YES    | iPhone 6s (320 x 568)          |
        // | "iPhone 7"       | YES    | iPhone 7  (320 x 568)          |
        // | "iPhone 6 Plus"  | YES    | iPhone 6  (375 x 667) [!]      |
        // | "iPhone 6s Plus" | YES    | iPhone 6s (375 x 667)          |
        // | "iPhone 7 Plus"  | YES    | iPhone 7  (375 x 667) [!]      |
        if (simulator) {
            return "iPhone Simulator";
        }
        return !retina         ? "iPhone 3GS"
             : longEdge <= 480 ? (SGX543 || osVersion >= 8 ? "iPhone 4s" : "iPhone 4") // iPhone 4 stopped in iOS 7.
             : longEdge <= 568 ? (Metal  ? "iPhone 7"   :            // iPhone 7  (zoomed)
                                  A9     ? "iPhone SE"  :            // iPhone 6s (zoomed) or iPhone SE [!!]
                                  A8     ? "iPhone 6"   :            // iPhone 6  (zoomed)
                                  A7     ? "iPhone 5s"  :            // iPhone 5s
                                  SGX543 ? "iPhone 5"                // iPhone 5   or iPhone 5c
                                         : "iPhone x")               // Unknown device
             : longEdge <= 667 ? (Metal  ? "iPhone 7"   :            // iPhone 7   or iPhone 7+  (zoomed)
                                  A9     ? "iPhone 6s"  :            // iPhone 6s  or iPhone 6s+ (zoomed)
                                  A8     ? "iPhone 6"                // iPhone 6   or iPhone 6+  (zoomed)
                                         : "iPhone x")               // Unknown device
             : longEdge <= 736 ? (Metal  ? "iPhone 7 Plus"  :        // iPhone 7+
                                  A9     ? "iPhone 6s Plus" :        // iPhone 6s+
                                  A8     ? "iPhone 6 Plus"           // iPhone 6+
                                         : "iPhone x")               // Unknown device (maybe new iPhone)
             : "iPhone x";
    } else if (/iPad/.test(ua)) {
        if (simulator) {
            return "iPad Simulator";
        }
        return !retina         ? "iPad 2" // iPad 1/2, iPad mini
             : SGX543          ? "iPad 3"
             : SGX554          ? "iPad 4"
             : A7              ? "iPad mini 2" // iPad mini 3, iPad Air
             : A8X             ? "iPad Air 2"
             : A8              ? "iPad mini 4"
             : A9X             ? (longEdge <= 1024 ? "iPad Pro 9.7" : "iPad Pro")
             : A9              ? "iPad 5"
                               : "iPad x"; // Unknown device (maybe new iPad)
    } else if (/iPod/.test(ua)) {
        if (simulator) {
            return "iPod Simulator";
        }
        return longEdge <= 480 ? (retina ? "iPod touch 4" : "iPod touch 3")
                               : (A8     ? "iPod touch 6" : "iPod touch 5");
    }
    return "iPhone x";
}

function _getVersion(ua, token) { // @ret SemverString - "0.0.0"
    try {
        return _normalizeSemverString( ua.split(token)[1].trim().split(/[^\w\.]/)[0] );
    } catch ( o_O ) {
        // ignore
    }
    return "0.0.0";
}

function _normalizeSemverString(version) { // @arg String - "Major.Minor.Patch"
                                           // @ret SemverString - "Major.Minor.Patch"
    var ary = version.split(/[\._]/); // "1_2_3" -> ["1", "2", "3"]
                                      // "1.2.3" -> ["1", "2", "3"]
    return ( parseInt(ary[0], 10) || 0 ) + "." +
           ( parseInt(ary[1], 10) || 0 ) + "." +
           ( parseInt(ary[2], 10) || 0 );
}

function _isWebView(ua, os, browser, version, options) { // @ret Boolean - is WebView
    switch (os + browser) {
    case "iOSSafari":       return false;
    case "iOSWebKit":       return _isWebView_iOS(options);
    case "AndroidAOSP":     return false; // can not accurately detect
    case "AndroidChrome":   return parseFloat(version) >= 42 ? /; wv/.test(ua)
                                 : /\d{2}\.0\.0/.test(version) ? true // 40.0.0, 37.0.0, 36.0.0, 33.0.0, 30.0.0
                                 : _isWebView_Android(options);
    }
    return false;
}

function _isWebView_iOS(options) { // @arg Object - { WEB_VIEW }
                                   // @ret Boolean
    // Chrome 15++, Safari 5.1++, IE11, Edge, Firefox10++
    // Android 5.0 ChromeWebView 30: webkitFullscreenEnabled === false
    // Android 5.0 ChromeWebView 33: webkitFullscreenEnabled === false
    // Android 5.0 ChromeWebView 36: webkitFullscreenEnabled === false
    // Android 5.0 ChromeWebView 37: webkitFullscreenEnabled === false
    // Android 5.0 ChromeWebView 40: webkitFullscreenEnabled === false
    // Android 5.0 ChromeWebView 42: webkitFullscreenEnabled === ?
    // Android 5.0 ChromeWebView 44: webkitFullscreenEnabled === true
    var document = (global["document"] || {});

    if ("WEB_VIEW" in options) {
        return options["WEB_VIEW"];
    }
    return !("fullscreenEnabled"       in document ||
             "webkitFullscreenEnabled" in document || false);
}

function _isWebView_Android(options) { // @arg Object - { WEB_VIEW }
    // Chrome 8++
    // Android 5.0 ChromeWebView 30: webkitRequestFileSystem === false
    // Android 5.0 ChromeWebView 33: webkitRequestFileSystem === false
    // Android 5.0 ChromeWebView 36: webkitRequestFileSystem === false
    // Android 5.0 ChromeWebView 37: webkitRequestFileSystem === false
    // Android 5.0 ChromeWebView 40: webkitRequestFileSystem === false
    // Android 5.0 ChromeWebView 42: webkitRequestFileSystem === false
    // Android 5.0 ChromeWebView 44: webkitRequestFileSystem === false
    if ("WEB_VIEW" in options) {
        return options["WEB_VIEW"];
    }
    return !("requestFileSystem"       in global ||
             "webkitRequestFileSystem" in global || false);
}

// --- feature phone ---------------------------------------
function _detectFeaturePhoneCarrier(ua) {
    switch (true) {
    case /DoCoMo/.test(ua):             return "DOCOMO";
    case /KDDI/.test(ua):               return "KDDI";
    case /SoftBank|Vodafone/.test(ua):  return "SOFTBANK";
    }
    return "";
}

function _detectFeaturePhoneDevice(ua, carrier) {
    switch (carrier) {
    case "DOCOMO":
        // DoCoMo/2.0 P07A3(c500;TB;W24H15)
        //            ~~~~~
        return ua.split("DoCoMo/2.0 ")[1].split("(")[0];
    case "KDDI":
        // KDDI-TS3H UP.Browser/6.2_7.2.7.1.K.1.400 (GUI) MMP/2.0
        //      ~~~~
        return ua.split("KDDI-")[1].split(" ")[0];
    case "SOFTBANK":
        // Vodafone/1.0/V905SH/SHJ001[/Serial] Browser/VF-NetFront/3.3 Profile/MIDP-2.0 Configuration/CLDC-1.1
        //               ~~~~~
        // SoftBank/1.0/301P/PJP10[/Serial] Browser/NetFront/3.4 Profile/MIDP-2.0 Configuration/CLDC-1.1
        //              ~~~~
        if (/^Vodafone/.test(ua)) {
            return ua.split("/")[2].slice(1); // V905SH -> 905SH
        }
        return ua.split("/")[2];
    }
    return "";
}

return UserAgent; // return entity

});



/***/ })
/******/ ]);
});
//# sourceMappingURL=wasm-loader.js.map