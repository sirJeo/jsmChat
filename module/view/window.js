'use strict';
let Print = require('./print');

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
    HORIZONTAL = 'horisontal',
    VERTICAL = 'vertical';

/*
class TreeNode {
    type;
    left;
    right;

}
*/

class Window extends Print {
    constructor (width, height) {
        super();
        this.width = width;
        this.height = height;
        this.startNodeType = HORIZONTAL;

    }

    _createBorder () {
        for (let width = 2; width < this.width; width++) {
            this.position(1, width);
            this._print(BORDER.horizontal);
            this.position(this.height, width);
            this._print(BORDER.horizontal);
        }

        for (let height = 2; height < this.height; height++) {
            this.position(height, 1);
            this._print(BORDER.vertical);
            this.position(height, this.width);
            this._print(BORDER.vertical);
        }

        this.position(1, 1);
        this._print(BORDER.topLeft);
        this.position(1, this.width);
        this._print(BORDER.topRight);
        this.position(this.height, 1);
        this._print(BORDER.bottomLeft);
        this.position(this.height, this.width);
        this._print(BORDER.bottomRight);
    }

    createInnerStructure(inputBorder, nameBorder) {
        for (let width = 2; width < this.width; width++) {
            this.position(inputBorder, width);
            this._print(BORDER.innerHorizontal);
        }

        for (let height = 2; height < inputBorder; height++) {
            this.position(height, nameBorder);
            this._print(BORDER.innerVertical);
        }

        this.position(inputBorder, nameBorder);
        this._print(BORDER.innerTBottom);
        this.position(1, nameBorder);
        this._print(BORDER.innerBorderTop);
        this.position(inputBorder, this.width);
        this._print(BORDER.innerBorderRight);
        this.position(inputBorder, 1);
        this._print(BORDER.innerBorderLeft);
    }

    createLayout () {
        this.clean();
        this._createBorder();
    }


}

module.exports = (width, height) => new Window(width, height);