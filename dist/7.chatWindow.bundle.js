(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[7],{

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

/***/ }),

/***/ "./src/bridge.js":
/*!***********************!*\
  !*** ./src/bridge.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assit = __webpack_require__(/*! ./assit */ "./src/assit.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Bridge =
/*#__PURE__*/
function () {
  function Bridge(options) {
    _classCallCheck(this, Bridge);

    _defineProperty(this, "messageBox", []);

    _defineProperty(this, "iFrame", null);

    _defineProperty(this, "ifWindow", null);

    this.messageCallback = options.messageCallback;
    this.kstUrl = options.kstUrl;
    this.tagText = options.tagText;
  }

  _createClass(Bridge, [{
    key: "makeKstUrl",
    value: function makeKstUrl(create) {
      var ksChatLink = this.kstUrl;
      var params = (0, _assit.paramsOfUrl)(ksChatLink);
      var cas = params['cas'] || '';
      cas = cas !== '' && document.cookie.match(new RegExp('(^| )' + cas + '_KS_' + cas + '=([^;]*)(;|$)'));
      var _params = {
        dp: encodeURIComponent(window.location.href),
        sText: encodeURIComponent(this.tagText || ''),
        vi: cas != null && decodeURI(cas[2]) || '',
        ref: document.referrer || '',
        ism: 1
      };
      ksChatLink += (~ksChatLink.indexOf('?') ? '&' : '?') + (0, _assit.queryOf)(_params);

      if (create) {
        this.createIFrame(ksChatLink);
      }

      return ksChatLink;
    }
  }, {
    key: "createIFrame",
    value: function createIFrame(url) {
      var _this = this;

      var el = $('<iframe>', {
        src: url,
        id: 'y-iframe',
        frameborder: 0,
        style: 'display:none;height:800px;',
        scrolling: 'no'
      });
      el.appendTo($('body'));
      el.on('load', function (evt) {
        _this.saveIframe(evt.target);
      });
      return this;
    }
  }, {
    key: "saveIframe",
    value: function saveIframe(iframe) {
      this.iFrame = iframe;
      this.addMessageEvent();
      this.postMessageToChild({
        start: true,
        messageBox: this.messageBox
      });
    }
  }, {
    key: "postMessageToChild",
    value: function postMessageToChild(data) {
      if (this.iFrame) {
        data.isThisData = true;
        this.iFrame.contentWindow.postMessage(data, '*');
      } else {
        data.sendMessage && this.messageBox.push(data.sendMessage);
      }
    }
  }, {
    key: "addMessageEvent",
    value: function addMessageEvent() {
      var _this2 = this;

      window.addEventListener("message", function (evt) {
        _this2.receiveMessageFromIframePage(evt);
      }, false);
    }
  }, {
    key: "receiveMessageFromIframePage",
    value: function receiveMessageFromIframePage(event) {
      var data = event.data;

      if (!(data && data.isThisData)) {
        return;
      }

      if (data.message) {
        if (!data.message || data.message.length === 0) {
          console.log("Not Change");
        } else {
          this.messageCallback(data.message, event);
          console.log("receive Message :", data.message);
        }
      }
    }
  }]);

  return Bridge;
}();

var _default = Bridge;
exports.default = _default;

/***/ })

}]);