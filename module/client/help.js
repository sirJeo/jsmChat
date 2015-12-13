/**
 * module prints help file
 */
'use strict';
let fs = require('fs');

module.exports = (messages) => (name, callback) => {
    callback = callback || function () {};
    let help = fs.createReadStream(__dirname + '/../../assets/txt/' + name + '.txt', 'utf-8');
    help.on('data', (data) => {
        messages.write(data);
        callback();
    });
};