'use strict';

let net = require('net'),
    clients = require('./module/clients')();


let server = net.createServer((c) => {
    let id = clients.add(c);

    clients.forEach((client) => {
        client.streem.write("User " + clients.get(id).name + " connected");
    });

    c.on('end', () => {
        clients.remove(id);

        clients.forEach((client) => {
            client.streem.write("User " + clients.get(id).name + " disconnected");
        });
    });
});

server.listen('1100', () => {
    console.log('Server started at port 1100')
});
