'use strict';

const ALLOWED_COLORS = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'gray', 'white'];

class ServerMessagesManager {
    constructor (clientList) {
        this.clientList = clientList;
        this.introduceTimout = {};
    }

    introduce (client, timeout) {
        timeout = timeout || 1000;

        this.introduceTimout[client.id] = setTimeout(() => {
            this._system("User " + client.name + " joined to conversation.");
            delete this.introduceTimout[client.id];
        }, timeout);

    }

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
                break
        }
    }

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

    _error (text, recipient) {
        if (!recipient) {
            return;
        }

        try {
            this._send({type: 'error', text:text}, recipient);
        } catch (e) {
            console.log('System message exception:', e);
        }
    }

    _system (text, recipient) {
        try {
            this._send({type: 'system', text:text}, recipient);
        } catch (e) {
            console.log('System message exception:', e);
        }
    }

    _public (author, text) {
        this._send({type: 'public', author: author, text:text});
    }

    _private (recipient, author, text) {
        try {
            this._send({type: 'private', author: author, text:text});
        } catch (e) {
            this.system(e, author.id);
        }
    }

    _send (msgObj, recipient) {
        msgObj.author = msgObj.author || {};
        let msg = [msgObj.type, msgObj.author.name || '', new Date().toString(), msgObj.author.color || '', msgObj.text].join('::');

        if (recipient) {
            let client = this.clientList.get(recipient);
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
