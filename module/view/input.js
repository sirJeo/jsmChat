'use strict';
let stream = require('stream');


const MAX_LENGTH = 2000; // max character for one message

class InputTransform extends stream.Transform {
    constructor (maxLength){
        super();
        this.maxLength = maxLength;
        this.message = '';
    }

    _transform (chunk, encoding, callback) {
        let code = chunk.toString().charCodeAt(0);
        switch (code) {
            case 3:
                this.exit();
                break;
            case 27:
                this.message = '';
                this.push(' ');
                this.escape();
                break;
            case 13:
                this.enter(this.message);
                this.message = '';
                this.push(' ');
                break;
        }

        if (this.message.length < MAX_LENGTH) {
            if (code > 31 && code < 127) {
                this.message += chunk;
                let msg = '';
                if (this.message.length > this.maxLength) {
                    msg = '...' + this.message.substring(this.message.length - this.maxLength + 4);
                } else {
                    msg = this.message;
                }
                this.push(msg);
            }
        }
        callback();
    }

    exit () {
        process.exit();
    }

    enter () {}

    escape () {}
}

module.exports = (maxLength) => {
    let input = new InputTransform(maxLength);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.pipe(input);
    return input;
};