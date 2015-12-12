'use strict';

class ClientsManager {

    constructor () {
        this.list = {};
        this.cnt = 0;
    }

    create (connection) {
        let id = this.generateId();

        this.list[id] = {
            id: id,
            name: id,
            connection: connection,
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

    getUsersList () {
        let names = [];
        this.forEach(function(it) {
            names.push(it.name);
        });

        return names.join(', ');
    }

}

module.exports = () => new ClientsManager();
