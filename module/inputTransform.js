'use strict';

let stream = require('stream');


class InputTransform extends stream.Transform {
    constructor (){
        super();
        this.message = '';
    }

    _transform (chunk, encoding, callback) {
        let code = chunk.toString().charCodeAt(0);
        if (code === 3) {
            process.exit();
        }

        if (code > 31 && code < 127) {
            this.message += chunk;
            let msg = '';
            if (this.message.length > 4) {
                msg = '...' + this.message.substring(this.message.length - 4);
            } else {
                msg = this.message;
            }
            this.push (msg);
        }
        callback();
    }
}

module.exports = (stdin) => {
    let input = new InputTransform();
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    stdin.pipe(input);
    return input;
};