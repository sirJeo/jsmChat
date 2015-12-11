'use strict';
const colors = ['black', 'red', 'green',
    'yellow', 'blue', 'magenta', 'cyan',
    'white', 'gray', 'grey'];

class Clients {

    constructor () {
        this.list = {};
        this.cnt = 0;
    }

    create (client) {
        let id = this.generateId();

        this.list[id] = {
            id: id,
            name: id,
            streem: client,
            color: 'white'
        };
        this.cnt++;

        return this.get(id);
    }

    remove (id) {
        if (this.list[id]) {
            delete this.list[id];
            this.cnt--;
            return true;
        } else {
            return false;
        }
    }

    get (id) {
        if (this.list[id]) {
            return this.list[id];
        } else {
            return false;
        }
    }

    generateId () {
        let id;
        do {
            id = Math.round(Math.random() * 10000 * (this.cnt + 1));
        } while (this.list[id]);
        return id;
    }

    forEach (callback) {
        for(let c in this.list) {
            callback(this.list[c]);
        }
    }

    processMessage (author, data) {
        this.global(author, data);
    }

    system (text, recipient) {
        try {
            this._send({type: 'system', text:text}, recipient);
        } catch (e) {
            console.log('System message exception:', e);
        }
    }

    global (author, text) {
        this._send({type: 'global', author: author, text:text});
    }

    personal (recipient, author, text) {
        try {
            this._send({type: 'personal', author: author, text:text});
        } catch (e) {
            this.system(e, author.id);
        }
    }

    _send (msgObj, recipient) {
        msgObj.author = msgObj.author || {};
        let msg = [msgObj.type, msgObj.author.name || '', new Date().toString(), msgObj.author.color || '', msgObj.text].join('::');

        if (recipient) {
            if (!this.list[recipient]) {
                throw 'Recipient is not exist';
            }
            this.list[recipient].streem.write(msg);
        } else {
            for(let c in this.list) {
                this.list[c].streem.write(msg);
            }
        }
    }
}

module.exports = () => new Clients();
