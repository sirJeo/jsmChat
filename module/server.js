'use strict';

let colors = require('colors'),
    clientList = require('./clients')();

module.exports = (streem) => {
    let client = clientList.create(streem);
    streem.setEncoding('utf-8');

    clientList.system("User " + client.name + " connected");


    streem.on('data', (data) => {
        clientList.processMessage(client, data);
    });

    streem.on('end', () => {
        clientList.remove(client.id);
        clientList.system("User " + client.name + " connected");
    });
};