(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[9],{

/***/ "./src/yuandown.js":
/*!*************************!*\
  !*** ./src/yuandown.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var escape = function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  str = div.innerHTML;
  div = undefined;
  return str;
};

var YuanDown =
/*#__PURE__*/
function () {
  function YuanDown(rules) {
    _classCallCheck(this, YuanDown);

    this.rules = rules;
  }

  _createClass(YuanDown, [{
    key: "parseString",
    value: function parseString(str) {
      var rules = this.rules;

      for (var key in rules) {
        str = rules[key].handle(str);
      }

      return str;
    }
  }]);

  return YuanDown;
}();

var _default = YuanDown;
exports.default = _default;

/***/ })

}]);