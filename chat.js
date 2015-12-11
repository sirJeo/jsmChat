'use strict';
let net = require('net'),
    colors = require('colors');

let client = net.connect({port:1100}, () => {
    console.log('connected');
});

const part_type = 0,
    part_author = 1,
    part_date = 2,
    part_color = 3,
    part_text = 4;


client.on('data', function(data) {
    let parts = data.toString().split('::'),
        date = new Date(parts[part_date]),
        message = '[' + date.getTime() + '] ',
        color = [];


    switch (parts[part_type]) {
        case 'system':
            color.push('gray');
            color.push('italic');
            break;
        case 'personal':
            message += parts[part_author] + ': ';
            color.push(parts[part_color]);
            color.push('bold');
            break;
        case 'global':
            message += parts[part_author] + ': '
            color.push(parts[part_color]);
            color.push('reset');
            break;
    }
    message += parts[part_text];

    colors.setTheme({custom: color});
    console.log(message.custom);
});

process.stdin.on('readable', function() {
    process.stdin.pipe(client);
});


process.stdin.on('end', function() {
    process.stdout.write('end');
});
