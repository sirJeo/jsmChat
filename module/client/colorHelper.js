'use strict';

const STYLE_MAP = {
    console:        0,
    bold:           1,
    italic:         3,
    underline:      4,
    strike:         9,

    black:          30,
    red:            31,
    green:          32,
    yellow:         33,
    blue:           34,
    magenta:        35,
    cyan:           36,
    gray:           37,
    white:          38,

    bgWhite:        7,
    bgBlack:        40,
    bgRed:          41,
    bgGreen:        42,
    bgYellow:       43,
    bgBlue:         44,
    bgMagenta:      45,
    bgCyan:         46,
    bgGray:         47
};


class ColorHelper {

    constructor (colorConfig) {
        this.colorConfig = colorConfig || {};

        if (colorConfig.background) {
            this.background = this.getStyle(colorConfig.background);
        }
    }

    getStyle (name) {
        if (STYLE_MAP[name] !== undefined) {
            return '\x1b[' + STYLE_MAP[name] + 'm'
        }
        return '';
    }

    applyStyle (text) {
        let styles = [];
        if (arguments.length > 1) {
            for (let i = 1; i < arguments.length; i++) {
                styles.push(arguments[i]);
            }
        }

        return this.background +
            styles.map((name) => this.getStyle(name)) +
            text +
            this.getStyle('console') +
            this.background;
    }

    processMsg (msgObj) {
        if (this['_' + msgObj.type] && typeof this['_' + msgObj.type] == 'function') {
            this['_' + msgObj.type](msgObj);
        }
    }

    _help (msgObj) {
        msgObj.text = this.applyStyle(msgObj.text, this.colorConfig.help);
    }

    _system (msgObj) {
        msgObj.text = this.applyStyle(msgObj.text, this.colorConfig.system);
    }

    _private (msgObj) {
        let date = '[' + msgObj.date + '] ',
            author = msgObj.author + ': ';

        msgObj.text = this.applyStyle(date, this.colorConfig.date, 'bold') +
            this.applyStyle('{private} ' + author, this.colorConfig.private) +
            this.applyStyle(msgObj.text, msgObj.color);

    }

    _public (msgObj) {
        let date = '[' + msgObj.date + '] ',
            author = msgObj.author + ': ';

        msgObj.text = this.applyStyle(date, this.colorConfig.date) +
                      this.applyStyle(author, this.colorConfig.author) +
                      this.applyStyle(msgObj.text, msgObj.color);
    }

    _error (msgObj) {
        msgObj.text = this.applyStyle("SYSTEM ERROR: " + msgObj.text, this.colorConfig.error, 'bold')

    }
}

module.exports = (colorConfig) => new ColorHelper(colorConfig);