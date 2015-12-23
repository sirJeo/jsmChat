'use strict';
let stream = require('stream');
const BORDER = {
    topLeft: '╔',
    topRight: '╗',
    bottomLeft: '╚',
    bottomRight: '╝',
    vertical: '║',
    horizontal: '═',
    innerBorderLeft: '╟',
    innerBorderRight: '╢',
    innerBorderTop: '╤',
    innerBorderBottom: '╧',
    innerHorizontal: '─',
    innerVertical: '│',
    innerTLeft: '├',
    innerTRight: '┤',
    innerTTop: '┬',
    innerTBottom: '┴',
    innerCross: '┼'
},
    MESSAGE_MAX_LENGTH = 2000;

class ChatWindow extends stream.Writable {
    constructor (width, height) {
        super();

        this.width = width;
        this.height = height;
        if (this.width < 80 || this.height < 24) {
            throw 'Minimal terminal size is 80x24';
        }

        this.nameBorder = this.width - parseInt(this.width * 0.20);
        this.inputBorder = this.height - 2;
        this.inputPosition = this.height - 1;

        this.nameStartPosition = this.nameBorder + 1;
        this.nameLength = this.width - this.nameBorder - 2;
        this.nameList = [];

        this.message = '';
    }

    _write(chunk, encoding, callback) {
        let code = chunk.toString().charCodeAt(0);

        switch (code) {
            case 3:
                this.clean();
                process.exit();
            case 127:
                this.message = this.message.substring(0, this.message.length-1);
            break;

        }

        if (this.message.length < MESSAGE_MAX_LENGTH) {
            if (code > 31 && code < 127) {
                this.message += chunk;
            }
        }

        this._printMessage ();
        callback();
    }

    clean () {
        this._print('\x1b[?47h');
    }

    position (x, y) {
        x = parseInt(x);
        y = parseInt(y);

        this._print('\x1b[' + x + ';' + y + 'H');
    }

    createLayout () {
        this.clean();

        for (let width = 2; width < this.width; width++) {
            this.position(1, width);
            this._print(BORDER.horizontal);
            this.position(this.height, width);
            this._print(BORDER.horizontal);

            this.position(this.inputBorder, width);
            this._print(BORDER.innerHorizontal);
        }
        for (let height = 2; height < this.height; height++) {
            this.position(height, 1);
            this._print(BORDER.vertical);
            this.position(height, this.width);
            this._print(BORDER.vertical);

            if(height < this.inputBorder) {
                this.position(height, this.nameBorder);
                this._print(BORDER.innerVertical);
            }
        }

        this.position(1, 1);
        this._print(BORDER.topLeft);
        this.position(1, this.width);
        this._print(BORDER.topRight);
        this.position(this.height, 1);
        this._print(BORDER.bottomLeft);
        this.position(this.height, this.width);
        this._print(BORDER.bottomRight);

        this.position(this.inputBorder, this.nameBorder);
        this._print(BORDER.innerTBottom);
        this.position(1, this.nameBorder);
        this._print(BORDER.innerBorderTop);
        this.position(this.inputBorder, this.width);
        this._print(BORDER.innerBorderRight);
        this.position(this.inputBorder, 1);
        this._print(BORDER.innerBorderLeft);

        this.position(this.inputPosition, 2);
    }

    addName (name) {
        this.nameList.push(name);
        this._printNames();
    }

    _printMessage() {
        this.position(this.inputPosition, 2);

        let msg = this.message,
            wPosition = 0,
            wPositionTmp = 0;
        if (msg.length > this.width - 3) {
            msg = '...' + msg.substring(msg.length - this.width + 6);
        }
        this._print(msg);

        wPosition = msg.length + 2;
        wPositionTmp = wPosition;

        while (wPositionTmp < this.width - 1) {
            wPositionTmp++;
            this._print(' ');
        }
        this.position(this.inputPosition, wPosition);
    }

    _printNames () {
        let names = this.nameList.map((name) => {
                if(name.length > this.nameLength) {
                    return name.substring(0, this.nameLength-2) + '..';
                }

                return name;
            });

        for (let i = 0; i < names.length; i++) {
            this.position(i+2, this.nameStartPosition);
            this._print(names[i]);
        }
        this._restoreCursor();
    }

    _print (text) {
        process.stdout.write(text);
    }

    _restoreCursor () {
        let left = this.message.length >= this.width - 3 ? this.width - 1 : this.message.length + 2;
        this.position(this.inputPosition, left);
    }
}

module.exports = (width, height) => {
    let window = new ChatWindow(width, height);

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.pipe(window);

    return window;
};