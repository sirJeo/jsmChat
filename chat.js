'use strict';
let net = require('net'),
    config = require('./assets/config/clientConfig.json'),
    args = require('./module/arguments')(),

    messages = require('./module/client/message')(config.colors),
    dataPreprocessor = require('./module/client/preprocessor')(messages),
    help = require('./module/client/help')(messages),

    port = args.port || config.port || 1100,
    host = args.host || config.host || 'localhost';

help('intro');

let client = net.connect({port: port, host: host}, () => {
    if (config.name) {
        client.write('/name ' + config.name);
    }
});

/**
 * Process messages from server
 */
client.pipe(messages).pipe(process.stdout);

/**
 * Send client message to server
 */
process.stdin.pipe(dataPreprocessor).pipe(client);


client.on('end', function() {
    help('serverTerminated', () => {
        process.end();
    });
});

