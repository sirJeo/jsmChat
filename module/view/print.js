'use strict';

class Print {

    clean () {
        this._print('\x1b[?47h');
    }

    position (x, y) {
        x = parseInt(x);
        y = parseInt(y);

        this._print('\x1b[' + x + ';' + y + 'H');
    }

    _print (text) {
        process.stdout.write(text);
    }
}

module.exports = Print;