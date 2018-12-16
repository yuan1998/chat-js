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

    function testOf(reg, href) {
        href = href || window.location.href;
        return reg.test(href);
    }

    try {
        var result = checkReferrer();

        if (!!result) {
            window.result = result;

            $.getScript('../dist/chatWindow.bundle.js')
             .then(function () {
                 var options = {
                     api          : 'https://yuan.西安画美.com/api/domainSetting',
                     user         : 8,
                     result       : result,
                     kstUrl       : 'https://vipk16-hztk11.kuaishang.cn/bs/im.htm?cas=116432___982318&fi=118952',
                     testHref     : 'http://vip1.kq120.vip/zt/R640101-02/index.html',
                     defaultResult: '口腔问题',
                 };
                 var test    = new ChatWindow(options);
             })
        }
    } catch (e) {
        console.log(e);
    }

})();
