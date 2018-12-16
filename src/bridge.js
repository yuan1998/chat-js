import { paramsOfUrl, queryOf } from './assit';

class Bridge {
    messageBox = [];

    iFrame   = null;
    ifWindow = null;

    constructor(options) {
        this.messageCallback = options.messageCallback;
        this.kstUrl          = options.kstUrl;
        this.tagText         = options.tagText;
    }

    makeKstUrl(create) {
        let ksChatLink = this.kstUrl;

        let params = paramsOfUrl(ksChatLink);

        let cas = params[ 'cas' ] || '';
        cas     = cas !== '' && document.cookie.match(new RegExp('(^| )' + cas + '_KS_' + cas + '=([^;]*)(;|$)'));

        let _params = {
            dp   : encodeURIComponent(window.location.href),
            sText: encodeURIComponent(this.tagText || ''),
            vi   : (cas != null && decodeURI(cas[ 2 ])) || '',
            ref  : document.referrer || '',
            ism  : 1,
        };

        ksChatLink += (~ksChatLink.indexOf('?') ? '&' : '?') + queryOf(_params);

        if (create) {
            this.createIFrame(ksChatLink);
        }

        return ksChatLink;
    }

    createIFrame(url) {
        let el = $('<iframe>', {
            src        : url,
            id         : 'y-iframe',
            frameborder: 0,
            style      : 'display:none;height:800px;',
            scrolling  : 'no'
        });

        el.appendTo($('body'));

        el.on('load', (evt) => {
            this.saveIframe(evt.target);
        });
        return this;
    }

    saveIframe(iframe) {
        this.iFrame = iframe;
        this.addMessageEvent();
        this.postMessageToChild({ start: true, messageBox: this.messageBox });
    }

    postMessageToChild(data) {
        if (this.iFrame) {
            data.isThisData = true;
            this.iFrame.contentWindow.postMessage(data, '*');
        }
        else {
            data.sendMessage && this.messageBox.push(data.sendMessage);
        }
    }

    addMessageEvent() {
        window.addEventListener("message", (evt) => {
            this.receiveMessageFromIframePage(evt);
        }, false);
    }

    receiveMessageFromIframePage(event) {
        let data = event.data;
        if (!(data && data.isThisData)) {
            return;
        }

        if (data.message) {
            if (!data.message || data.message.length === 0) {
                console.log("Not Change");
            }
            else {
                this.messageCallback(data.message, event);
                console.log("receive Message :", data.message);
            }
        }
    }

}

export default Bridge;

