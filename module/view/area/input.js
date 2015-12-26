'use strict';
let PrintArea = require('./../area');

class InputArea extends PrintArea {

    add (text, callback = ()=>{}) {

        this.textLength = text.length;
        while (text.length < this.width) {
            text += ' ';
        }

        this.messages[0] = text;
        this._display(callback);
        this.restoreCursor();
    }

    restoreCursor () {
        let leftPosition = this.left + this.textLength || 0;
        this.position(this.top, leftPosition);
    }
}

module.exports = (w, h, t, l) => new InputArea(w, h, t, l);