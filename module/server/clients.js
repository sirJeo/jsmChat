'use strict';

class ClientsManager {

    constructor () {
        this.list = {};
        this.cnt = 0;
    }

    /**
     * Create client reflection object
     * @param connection
     * @returns {*} client object
     */
    create (connection) {
        let id = this._generateId();

        this.list[id] = {
            id: id,
            name: id,
            connection: connection,
            color: 'white'
        };
        this.cnt++;

        return this.get(id);
    }

    /**
     * Remove client reflection from system
     * @param id {number} client id
     * @returns {boolean} success indicator
     */
    remove (id) {
        if (this.list[id]) {
            delete this.list[id];
            this.cnt--;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Get client object by id
     * @param id {number} client id
     * @returns {*} client object
     */
    get (id) {
        if (this.list[id]) {
            return this.list[id];
        } else {
            return false;
        }
    }

    /**
     * Find client by name
     * @param name {string}
     * @returns {*} client object
     */
    find (name) {
        let client = null;
        this.forEach((it) => {
           if (it.name === name) {
               client = it;
           }
        });

        return client;
    }

    /**
     * Generate unique client id
     * @returns {number}
     * @private
     */
    _generateId () {
        let id;
        do {
            id = Math.round(Math.random() * 10000 * (this.cnt + 1));
        } while (this.list[id]);
        return id;
    }

    /**
     * Loop all clients
     * @param callback {function}
     */
    forEach (callback) {
        for(let c in this.list) {
            callback(this.list[c]);
        }
    }

    /**
     * Return list of active users
     * @returns {string}
     */
    getUsersList () {
        let names = [];
        this.forEach(function(it) {
            names.push(it.name);
        });

        return names.join(', ');
    }
}

module.exports = () => new ClientsManager();