'use strict';

let net = require('net'),
    serverFunc = require('./module/server'),
    args = require('./module/arguments')(),
    config = require('./assets/config/serverConfig.json'),

    port = args.port || config.port || 1100,

    server = net.createServer(serverFunc);

server.listen(port, () => {
    console.log('Server started at port:', port);
});
