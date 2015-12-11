'use strict';

let net = require('net'),
    serverFunc = require('./module/server'),
    server = net.createServer(serverFunc);

server.listen('1100', () => {
    console.log('Server started at port 1100')
});
