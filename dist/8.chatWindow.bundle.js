(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[8],{

/***/ "./src/assit.js":
/*!**********************!*\
  !*** ./src/assit.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paramsOfUrl = exports.queryOf = exports.replaceState = exports.pushState = void 0;

var pushState = function pushState(options) {
  options = options || null;
  window.history.pushState(options, null, document.URL);
};

exports.pushState = pushState;

var replaceState = function replaceState(state, title, url) {
  window.history.replaceState(state || null, title || null, url || document.URL);
};

exports.replaceState = replaceState;

var queryOf = function queryOf(obj) {
  var str = '';

  for (var key in obj) {
    var val = obj[key];
    if (val === undefined) continue;
    str += key + '=' + val + '&';
  }

  return str;
};

exports.queryOf = queryOf;

var paramsOfUrl = function paramsOfUrl(url) {
  var vars = {};
  var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
};

exports.paramsOfUrl = paramsOfUrl;

/***/ })

}]);