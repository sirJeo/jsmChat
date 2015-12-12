'use strict';
let stream = require('stream'),
    helpBuilder = require('./help'),
    help = () => {};

const ALLOWED_HELPS = ['/list', '/name'],
    ALLOWED_COMMANDS = ['/list', '/name', '/ping', '/quit', '/color', '/help'];

class ClientMessagePreprocessor extends stream.Transform {

    constructor (messages) {
        super();
        help = helpBuilder(messages);
    }

    _transform (data, encoding, callback) {
        let result = this.processData(data);

        if (result) {
            this.push(new Buffer(data));
        }
        callback();
    }

    processData (data) {
        if (data.length < 2) {
            return false;
        }
        data = data.toString().replace(/\r*\n$/, '');

        if (data.match(/^\/[a-z]+/i)) {
            return this.processCommand(data);
        }

        return true;
    }

    processCommand (commandString) {
        let self = this,
            cmdArr = commandString.split(' '),
            command = cmdArr[0].toLowerCase(),
            params = [];

        if (cmdArr.length > 1) {
            for (let i = 1; i < cmdArr.length; i++) {
                if (cmdArr[i].length) {
                    params.push(cmdArr[i]);
                }
            }
        }

        if(ALLOWED_COMMANDS.indexOf(command) === -1) {
            help('commandDoesNotExists');
            return false;
        }

        switch (command) {
            case '/quit':
                help('outro', () => process.exit());
                break;

            case '/help':
                help(command);
                return false;

            default:
                if (params.some((param) => (param === '-h' || param === '--help'))) {
                    if (ALLOWED_HELPS.indexOf(command) === -1) {
                        command = '/emptyHelp';
                    }

                    help(command);
                    return false;
                }
            return true;
        }
    }
}

module.exports = (messages) => new ClientMessagePreprocessor(messages);