import('../css/index.less');



const app = {};
let rules = {
    linkLine    : {
        regex: /(?:#!)\s*(.*?)\s*#*\s*(?:!#)/m,
        handle(str) {
            let strArr;
            while ((strArr = this.regex.exec(str)) !== null) {
                console.log("strArr[1] :", strArr[ 1 ]);
                str = str.replace(strArr[ 0 ], '<span class="yuan-link-line-message" style="display: inline-block;color: #3184ff;padding-top: 5px;" >' + strArr[ 1 ].trim() + '</span>')
                         .trim();
            }
            return str;
        }
    },
    keyWord     : {
        regex: /(\${kw})/gm,
        handle(str) {
            return str.replace(this.regex, window.result);
        }
    },
    addAttribute: {
        regex: /(!\[(.*?):(.*?)])\((.*?)\)/m,
        handle(str) {
            let strArr;
            while ((strArr = this.regex.exec(str)) !== null) {
                str = str.replace(strArr[ 0 ], '<span style="' + strArr[ 2 ] + ':' + strArr[ 3 ] + '" >' + strArr[ 4 ].trim() + '</span>')
                         .trim();
            }
            return str;
        }
    },
    breakWord   : {
        regex: /\r\n?|\n/g,
        handle(str) {
            return str.replace(this.regex, '<br />');
        }
    },
};

const importApp = () => {
    import('./yuandown.js').then((val) => {
        console.log("yuandown :",val);
        app.YuanDown = val.default;
    });
    import('./bridge.js').then((val) => {
        console.log("bridge :",val);
        app.Bridge = val.default;
    });
    import('moment').then((val) => {
        console.log("moment:",val);
        app.moment = val.default;
    });
    import('./assit.js').then((val) => {
        app.pushState    = val.pushState;
        app.replaceState = val.replaceState;
    });
};

class ChatWindow {
    main              = null;
    header            = null;
    mainContent       = null;
    form              = null;
    input             = null;
    footer            = null;
    template          = null;
    templateContainer = null;
    responseMessage   = null;

    bridge        = null;
    iframeUrl     = '';
    iframeLoading = false;

    prevTime  = null;
    prevEnter = null;
    submitted = false;
    firstSend = true;
    yuanDown = null;

    loadMessage = {
        type : 'left',
        value: '好的,我们正在为您选择最合适的专家.请稍等...'
    };

    constructor(options) {
        if (!options.user || !options.kstUrl || !options.result) {
            throw new Error('Params can not Null');
        }

        this.user     = options.user;
        this.kstUrl   = options.kstUrl;
        this.result   = options.result === '1' ? options.defaultResult : options.result;
        this.apiUrl   = options.api || 'https://yuan.西安画美.com/api/domainSetting';
        this.fullUrl  = options.testHref || window.location.href;
        this.tagText  = options.tag || '6666';
        this.cacheKey = options.cacheKey || 'YUAN_LOG_';

        /**
         * Url Attribute.
         */
        this.urlArr = this.fullUrl.split('/');
        this.baseUrl = this.urlArr[ 2 ];
        this.ztName  = this.urlArr[ 4 ] || '';

        this._init();
        return this;
    }

    _init() {
        window.CL_data = window.CL_data || {};
        this._getMessage();
        return this;
    }

    _getMessage() {
        let url = `${this.apiUrl}?i=${this.user}&u=${this.baseUrl}&kw=${this.result}&zt=${this.ztName}`;
        importApp();
        $.get(url)
         .then((data, res, d) => {
             if (d.status === 200) {
                 this.responseMessage = this._parseResponseMessage(data.message);
                 if (data.template) {
                     this.template = data.template;
                     this._createTemplate(data.template);
                 }
             }
         })
         .catch((res) => {
             let response = res.responseJSON;
             if (response.status && response.status === 400) {
                 console.log(message);
             }
         });

    }

    _parseResponseMessage(message) {
        message.forEach(function (item) {
            item.duration = item.duration || 500;
            item.type     = item.type || 'left';
        });
        return message;
    }

    _createTemplate(template) {
        this.templateContainer = $('<div id="y-chat-container">');

        this.main        = $(template.main);
        this.header      = $(template.header);
        this.footer      = $(template.footer);
        this.form        = this.footer.find('.y-footer-form');
        this.input       = this.footer.find('.y-footer-form-value');
        this.mainContent = this.main.find('.y-main-wrapper');

        app.replaceState({ chat: true });
        app.pushState();
        this._monitorPopState();

        this.templateContainer.append(this.header).append(this.main).append(this.footer);
        this.templateContainer.appendTo($('body'));
        this._formSubmitEvent();
        this._mainResize();
        this._inputEvent();

        this._innerMessage(this.responseMessage, true);
    }

    _formSubmitEvent() {
        this.form.on('submit', (evt) => {
            evt.preventDefault();
            let value = this.input.val();
            if (!value) {
                return;
            }

            this._handlePostMessage(value);
            this.submitted = true;
            this.input.val('');
            this._inputStatus('');
        })
    }

    _checkEnter() {
        let m    = app.moment();
        let time = this.prevEnter;
        if (time) {
            if (m.diff(time) < 1000) {
                return false;
            }
        }

        this.prevEnter = m;
        return true;
    }

    _handlePostMessage(text) {
        if (!this.bridge) {
            this._createBridge(text);
        }

        if (!this._checkEnter()) {
            this.input.blur();
            alert('输入太频繁');
            return;
        }

        let data = {
            sendMessage: text,
        };
        this.bridge.postMessageToChild(data);

        data.type  = 'right';
        data.time  = this._setTime();
        data.value = text;
        this._appendMessage(data);

        if (this.firstSend) {
            this.firstSend = !this.firstSend;
            this._appendMessage(this.loadMessage);
        }

    }

    _inputStatus(value) {
        if (!this.bridge) {
            return;
        }

        this.bridge.postMessageToChild({
            inputDataChange: value,
        });
    }

    _createBridge(value) {
        let tag = `${this.tagText}_${this.ztName}_${this.result}_${value}`;

        this.bridge        = new app.Bridge({
            tagText        : tag,
            context        : value,
            kstUrl         : this.kstUrl,
            messageCallback: (message) => {
                console.log("message :", message);
                this._filterMessage(message);
            },
            errorCallback  : (message) => {
                console.log("message :", message);
            }
        });
        this.iframeLoading = true;
        this.iframeUrl     = this.bridge.makeKstUrl(true);
    }

    _filterMessage(message) {
        let newMessage = [];
        message.forEach((item) => {
            if (!item || item.type === 'right') {
                return;
            }

            if (item.type === 'center') {
                item.type = 'tip';
            }
            item.time     = this._setTime();
            item.duration = 0;
            newMessage.push(item);
        });
        this._innerMessage(newMessage);
    }

    _innerMessage(message, parse) {
        let time = 0;
        message.forEach((item) => {
            time += (item.duration || 0);

            if (parse && item.type !== 'custom') {
                if(!this.yuanDown) {
                    this.yuanDown = new app.YuanDown(rules);
                }
                item.value = this.yuanDown.parseString(item.value)
            }

            setTimeout(() => {
                this._appendMessage(item);
            }, time);
        })
    }

    _appendMessage(item) {
        let tmp = this.template[ item.type ];

        if (!tmp) {
            console.log("Not Template  :" + item.type);
            return;
        }

        let el = $(tmp);

        if (el.hasClass('text-content')) {
            el.html(item.value);
        }
        else {
            el.find('.text-content').html(item.value);
        }
        this._contentAddEvent(el);

        item.time && this._createTime(item.time);
        el.appendTo(this.mainContent);
        this._elScrollBottom(this.main);
    }

    _createTime(time) {
        $('<div class="y-pop-wrap y-pop-time"><p>' + time.format("H:mm:ss") + '</p></div>').appendTo(this.mainContent);
    }

    _contentAddEvent(el) {
        let linkLine = el.find('.yuan-link-line-message');
        linkLine.length > 0 && this._addLinkLineEvent(linkLine);
    }

    _monitorPopState() {
        $(window).on('popstate', (evt) => {
            let state = evt.originalEvent.state;
            if (state.chat) {
                this._closeTemplate();
            }
        })
    };

    _addLinkLineEvent(el) {
        el.on('click', (evt) => {
            evt.preventDefault();
            let context = $(evt.target).text();

            this._handlePostMessage(context);
        });
    }

    _mainResize() {
        $(window).on('resize', () => {
            setTimeout(() => {
                super.$elScrollBottom(this.main);
            }, 30);
        })
    }

    _inputEvent() {
        this.input.on('input', (evt) => {
            evt.preventDefault();
            let el = $(evt.target);
            this._inputStatus(el.val());

            if (el.hasClass('y-footer-input')) {
                el.height('6.5vw');
                let height = el.height();

                let scrollHeight = el.prop('scrollHeight');
                el.height((scrollHeight / height < 3 ? scrollHeight : 3 * height));
            }
        })
    }

    _elScrollBottom(el, speed) {
        el.animate({
            scrollTop: el.prop("scrollHeight")
        }, speed || 0);
    }

    _setTime() {
        let m         = app.moment();
        let time      = this.prevTime;
        this.prevTime = m;

        if (time) {
            if (m.diff(time, 'seconds') < 60) {
                return null;
            }
        }

        return m;
    }

    _closeTemplate() {
        this.templateContainer.css('display', 'none');
    }

    openTemplate() {
        this.templateContainer.css('display', 'block');
    }

}

window.ChatWindow = ChatWindow;
