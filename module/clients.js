'use strict';

class Clients {
    constructor () {
        this.list = {};
    }

    add (client) {
        let id = this.generateId();

        this.list[id] = {
            id: id,
            name: id,
            streem: client,
            color: 'white'
        };
        return id;
    }

    remove (id) {
        if (this.list[id]) {
            delete this.list[id];
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
            id = Math.random();
        } while (this.list[id]);
        return id;
    }

    forEach (callback) {
        for(let c in this.list) {
            callback(this.list[c]);
        }
    }

}

module.exports = () => new Clients();
