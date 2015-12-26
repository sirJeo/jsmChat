'use strict';
let PrintArea = require('./../area');

class MessageArea extends PrintArea {

    constructor (w, h, t, l) {
        super(w, h, t, l);
        for (let i = 0; i < this.height; i++) {
            this.messages.push(' ');
        }
    }

    add (text, callback = ()=>{}) {

        this._addMessage(text);

        if (this.messages.length > this.height) {
            this.messages = this.messages.slice(this.messages.length - this.height);
        }
        this._display(callback);
    }

    _addMessage(text) {
        if (text.length <= this.width) {
            this.messages.push(text);
        } else {
            for (let i = this.width; i >= 0; i--) {
                if (text[i] === ' ') {
                    this.messages.push(text.substr(0, i));

                    this._addMessage('    ' + text.substr(i+1, text.length - i - 1));
                    break;
                }
            }
        }
    }
}

module.exports = (w, h, t, l) => new MessageArea(w, h, t, l);