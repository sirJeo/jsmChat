'use strict';
let PrintArea = require('./../area');

class UserArea extends PrintArea {

    remove (name, callback = () => {}) {
        this.messages.splice(this.messages.indexOf(name), 1);
        this._display(callback);
    }

    rename (oldName, newName, callback = () => {}) {
        this.messages[this.messages.indexOf(oldName)] = newName;
        this._display(callback);
    }

    _prepareMessage () {
        let lines = [];

        this.messages.forEach((name) => {
            if(name.length > this.width) {
                lines.push(name.substring(0, this.width - 2) + '..');
            } else {
                while (name.length < this.width) {
                    name += ' ';
                }
                lines.push(name);
            }

        }, this);


        if (lines.length > this.height) {
            lines = lines.slice(0, this.height-1);
            let name = '...';
            while (name.length < this.width) {
                name += ' ';
            }
            lines.push(name);
        }

        while (lines.length < this.height) {
            lines.push(this.emptyLine);
        }
        return lines;
    }
}

module.exports = (w, h, t, l) => new UserArea(w, h, t, l);