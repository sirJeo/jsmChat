'use strict';

const ALLOWED_COLORS = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'gray', 'white'];

class ServerMessagesManager {
    constructor (clientList) {
        this.clientList = clientList;
        this.introduceTimout = {};
    }

    /**
     * Introduse new connected user to all participants
     * @param client {object}
     * @param timeout {number} timeout in miliseconds
     */
    introduce (client, timeout) {
        timeout = timeout || 1000;

        this.introduceTimout[client.id] = setTimeout(() => {
            this._system("User " + client.name + " joined the chatroom.");
            delete this.introduceTimout[client.id];
        }, timeout);

    }

    /**
     * Execute chat command from user
     * @param client {object} command author
     * @param commandString {string}
     */
    processCommand (client, commandString) {
        let cmdArr = commandString.split(' '),
            params = [];

        if (cmdArr.length > 1) {
            for (let i = 1; i < cmdArr.length; i++) {
                if (cmdArr[i].length) {
                    params.push(cmdArr[i]);
                }
            }
        }
        switch (cmdArr[0].toLowerCase()) {
            case '/name':
                if (!params[0]) {
                    throw '/name command should have one parameter.';
                }
                if (this.clientList.find(params[0])) {
                    throw 'Name "' + params[0] + '" already in used. Please choose another.';
                }

                let oldName = client.name;
                client.name = params[0];


                if (this.introduceTimout[client.id]) {
                    clearTimeout(this.introduceTimout[client.id]);
                    delete this.introduceTimout[client.id];
                    this.introduce(client, 1);
                } else {
                    this._system('User change name from ' + oldName + ' to ' + client.name);
                }
                break;

            case '/ping':
                this._system('Pong - Ping responce', client.id);
                break;

            case '/list':
                this._system(this.clientList.getUsersList(), client.id);
                break;

            case '/color':
                if (!params[0]) {
                    throw '/color command should have one parameter.';
                }
                params[0] = params[0].toLowerCase();
                if (ALLOWED_COLORS.indexOf(params[0]) === -1) {
                    throw 'Color should be one of the allowed colors.';
                }
                client.color = params[0];

                this._system('Your color has changed.', client.id);
                break;

            case '/to':
                if (!params[0]) {
                    throw 'You should type recipient name.';
                }
                let recipient = this.clientList.find(params[0]);
                if (!recipient) {
                    throw 'Recipient does not exist.';
                }
                if (!params[1]) {
                    throw 'You can not send empty message.';
                }
                params.splice(0, 1);

                this._private(recipient.id, client, params.join(' '));
        }
    }

    /**
     * Process message thet comes from users
     * @param client {object}
     * @param data {string}
     */
    processMessage (client, data) {
        data = data.replace(/\r*\n$/, '');

        if (data.match(/^\/[a-z]+/i)) {
            try {
                this.processCommand(client, data);
            } catch (e) {
                this._error(e, client.id);
            }
        } else {
            this._public(client, data);
        }
    }

    /**
     * Error responce. Only personal messages.
     * @param text {string} message to user
     * @param recipientId {number}
     * @private
     */
    _error (text, recipientId) {
        if (!recipientId) {
            return;
        }

        try {
            this._send({type: 'error', text:text}, recipientId);
        } catch (e) {
            console.log('System message exception:', e);
        }
    }

    /**
     * System messages to users (could be private)
     * @param text {string}
     * @param recipientId {number}
     * @private
     */
    _system (text, recipientId) {
        try {
            this._send({type: 'system', text:text}, recipientId);
        } catch (e) {
            console.log('System message exception:', e);
        }
    }

    /**
     * Public message from user to whole chat
     * @param author {client object}
     * @param text {string}
     * @private
     */
    _public (author, text) {
        this._send({type: 'public', author: author, text:text});
    }

    /**
     * Private message from user to user
     * @param recipientId {number}
     * @param author {client object}
     * @param text {string}
     * @private
     */
    _private (recipientId, author, text) {
        try {
            this._send({type: 'private', author: author, text:text}, recipientId);
        } catch (e) {
            this.system(e, author.id);
        }
    }

    /**
     * Method that sends any type of messages to chat room
     * @param msgObj {object} - message description object
     * @param recipientId {number} - recipient id (for private messages)
     * @private
     */
    _send (msgObj, recipientId) {
        msgObj.author = msgObj.author || {};
        let msg = [msgObj.type, msgObj.author.name || '', new Date().toString(), msgObj.author.color || '', msgObj.text].join('::');

        if (recipientId) {
            let client = this.clientList.get(recipientId);
            if (!client) {
                throw 'Recipient is not exist';
            }
            client.connection.write(msg);
        } else {
            this.clientList.forEach((client) => client.connection.write(msg));
        }
    }
}


module.exports = (clientList) => new ServerMessagesManager(clientList);
