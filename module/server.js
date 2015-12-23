'use strict';

let net = require('net'),
    clientList = require('./server/clients')(),
    messages = require('./server/message')(clientList),


    server = net.createServer((connection) => {
        let client = clientList.create(connection);
        connection.setEncoding('utf-8');

        /**
         * Introduce new connected client to all users
         */
        messages.introduce(client);


        /**
         * Introduce new connected client to all users
         */
        connection.on('data', (data) => {
            console.log(data);
            messages.processMessage(client, data);
        });

        connection.on('end', () => {
            clientList.remove(client.id);
            messages._system("User " + client.name + " leave the chatroom.");
        });
    });


module.exports = (port) => {
    server.listen(port, () => {
        console.log('Server started at port:', port);
    });
};