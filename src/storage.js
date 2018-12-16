const index = (key) => {
    return JSON.parse(window.localStorage.getItem(key));
};

const store = (key, data) => {
    return window.localStorage.setItem(key, JSON.stringify(data));
};

const destroy = (key) => {
    return window.localStorage.removeItem(key);
};

const clear = () => {
    return window.localStorage.clear();
};

export default {
    index,
    store,
    destroy,
    clear
};
