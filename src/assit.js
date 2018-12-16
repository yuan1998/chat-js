const pushState = (options) => {
    options = options || null;
    window.history.pushState(options, null, document.URL);
};

const replaceState = (state, title, url) => {
    window.history.replaceState(state || null, title || null, url || document.URL);
};

const queryOf = (obj) => {
    let str = '';
    for (let key in obj) {
        let val = obj[ key ];
        if (val === undefined)
            continue;

        str += key + '=' + val + '&';
    }
    return str;
};

const paramsOfUrl = (url) => {
    let vars  = {};
    let parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[ key ] = value;
    });
    return vars;
};

export {
    pushState,
    replaceState,
    queryOf,
    paramsOfUrl
}
