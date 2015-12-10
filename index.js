'use strict';
let net = require('net');

let client = net.connect({port:1100}, () => {
    console.log('connected');

});

client.on('data', function(data) {
    console.log(data.toString());
    //client.end();
});

process.stdin.on('readable', function() {

    var chunk = process.stdin.read();
    if (chunk !== null) {
        //process.stdout.write('data: ' + chunk);
    }
});

process.stdin.on('end', function() {
    process.stdout.write('end');
});
