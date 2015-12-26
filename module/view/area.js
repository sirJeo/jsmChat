'use strict';
let Print = require('./print');

class PrintArea extends Print {
    constructor (w, h, t, l) {
        super();
        this.width = w;
        this.height = h;
        this.top = t;
        this.left = l;

        this.messages = [];

        this.emptyLine = '';
        while (this.emptyLine.length < this.width) {
            this.emptyLine += ' ';
        }

    }

    add (name, callback = () => {}) {
        this.messages.push(name);
        this._display(callback);
    }

    _display (callback) {
        let lines = this._prepareMessage();
        lines.forEach((line, i) => {
            this.position(i + this.top, this.left);
            this._print(line);
        }, this);

        callback();
    }

    _prepareMessage () {
        return this.messages;
    }

}

module.exports = PrintArea;