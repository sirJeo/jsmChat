'use strict';

class ClientsManager {

    constructor () {
        this.list = new Map();
    }

    /**
     * Create client reflection object
     * @param connection
     * @returns {*} client object
     */
    create (connection) {
        let id = this._generateId();

        this.list.set(id, {
            id: id,
            name: id,
            connection: connection,
            color: 'white'
        });

        return this.get(id);
    }

    /**
     * Remove client reflection from system
     * @param id {number} client id
     * @returns {boolean} success indicator
     */
    remove (id) {
        if (this.list.has(id)) {
            this.list.delete(id);
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
        if (this.list.has(id)) {
            return this.list.get(id);
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
        for(let client of this.list.values()) {
            if (client.name === name) {
                return client;
            }
        }

        return false;
    }

    /**
     * Generate unique client id
     * @returns {number}
     * @private
     */
    _generateId () {
        let id;
        do {
            id = Math.round(Math.random() * 10000 * (this.list.size + 1));
        } while (this.list.has(id));
        return id;
    }

    /**
     * Loop all clients
     * @param callback {function}
     */
    forEach (callback) {
        for(let client of this.list.values()) {
            callback(client);
        }
    }

    /**
     * Return list of active users
     * @returns {string}
     */
    getUsersList () {
        let names = [];

        for(let client of this.list.values()) {
            names.push(client.name);
        }

        return names.join(', ');
    }
}

module.exports = () => new ClientsManager();