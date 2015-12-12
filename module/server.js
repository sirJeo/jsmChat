'use strict';

let clientList = require('./server/clients')(),
    messages = require('./server/message')(clientList),
    introduceTimout = null;



module.exports = (connection) => {
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
        messages.processMessage(client, data);
    });

    connection.on('end', () => {
        clientList.remove(client.id);
        messages._system("User " + client.name + " connected");
    });
};