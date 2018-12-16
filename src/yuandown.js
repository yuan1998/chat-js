const escape = (str) => {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    str = div.innerHTML;
    div = undefined;
    return str;
};

class YuanDown {
    constructor(rules) {
        this.rules = rules
    }

    parseString(str) {
        let rules = this.rules;

        for (let key in rules) {
            str = rules[ key ].handle(str);
        }
        return str;
    }
}

export default YuanDown;

