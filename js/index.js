;(function () {
    'use strict';
    var items = [
        {
            url  : /baidu.com.+\?/,
            query: 'word',
            prev : 'oq'
        },
        {
            url  : /google.com.+\?/,
            query: 'q',
            prev : null
        },
        {
            url  : /so.com.+\?/,
            query: 'q',
            prev : null
        },
        {
            url  : /sogou.com.+\?/,
            query: 'keyword',
            prev : null
        },
        {
            url  : /sm.cn.+\?/,
            query: 'q',
            prev : null
        },

    ];


    function getUrlVars(url) {
        var vars  = {};
        var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[ key ] = value;
        });
        return vars;
    }

    function checkReferrer() {
        var referrer = document.referrer,
            result   = '';

        if (!referrer) {
            return;
        }

        var breakEach = false;
        items.forEach(function (item, index) {
            if (item[ 'url' ].test(referrer) && !breakEach) {
                var obj   = getUrlVars(referrer);
                result    = decodeURIComponent((obj[ item[ 'query' ] ] || '1').replace(/\+/g, ' '));
                breakEach = !breakEach;
            }
        });

        return result;
    }

    function getAttribute(prefix) {
        return {
            user  : $('meta[name=' + prefix + 'user-id]').attr('content'),
            kstUrl: $('meta[name=' + prefix + 'kst-url]').attr('content'),
            api   : $('meta[name=' + prefix + 'default-api]').attr('content') || 'https://yuan.西安画美.com/api/domainSetting',
            result: $('meta[name=' + prefix + 'default-result]') || checkReferrer(),
        }
    }

    try {
        var attribute = getAttribute('yuan-');
        console.log("attribute :",attribute);
        if (!attribute['user'] || !attribute['kstUrl'] || !attribute['api'] || !attribute['result']){
            return;
        }
        console.log("Start !!! ");

        window.result = result;

        $.getScript('../dist/chatWindow.bundle.js')
         .then(function () {
             var options = {
                 api   : 'https://yuan.西安画美.com/api/domainSetting',
                 user  : 8,
                 result: result,
                 kstUrl: 'https://vipk16-hztk11.kuaishang.cn/bs/im.htm?cas=116432___982318&fi=118952',
             };
             var test    = new ChatWindow(options);
         })
    } catch (e) {
        console.log(e);
    }

})();
