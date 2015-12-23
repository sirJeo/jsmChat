'use strict';

/*
let window = require('./module/window')(process.stdout.columns, process.stdout.rows);
//let input = require('./module/inputTransform')(process.stdin);
window.createLayout();
window.addName('name 1');

setTimeout(() => {
    window.addName('name 2');
},3000);
*/

let width = process.stdout.columns,
    height = process.stdout.rows,
    window = require('./module/view/window')(width, height);


let inputBorder = height - 2,
    nameBorder = width - parseInt(width * 0.20);

window.createLayout();
window.createInnerStructure(inputBorder, nameBorder);














//input.pipe(process.stdout);

//window.position(2,4);
//window._write('lalala');
//out.write('\x1b[?47h');
//console.log(80/100 * 25);
//console.log('\x0c');
//out.write('\x1b[8;24H');
//out.write('Test here');
//out.write('\x1b[H');
//out.write('\x1b[?25l');

//console.log('\x1b[?47h');
//
//console.log('\x1b[?47l');
//console.log('\x1b[?47l');