'use strict';

let
    stream = require('stream'),
    windowArea = require('./view/window'),
    messageArea = require('./view/area/message'),
    userArea = require('./view/area/user'),
    inputArea = require('./view/area/input');

const NAME_WIDTH = 0.2; // % of width for name area


class WindowView extends stream.Writable{
    constructor (width, height) {
        super();
        /**
         * coordinates:
         * top = 1, top = height, left = 1, left = width - outer borders
         */
        this.width = width;
        this.height = height;


        this.window = null;
        this.messages = null;
        this.users = null;
        this.input = null;

        /**
         * Inner border for visual input area.
         * Height - 1 - line for input area
         * @type {number}
         */
        this.inputBorder = height - 2;

        /**
         * Inner border for names area
         * @type {number}
         */
        this.nameBorder = width - parseInt(width * NAME_WIDTH);

        this._createWindow();
        this._createAreas();
    }

    addMessage (message) {
        this.messages.add(message, () => this.input.restoreCursor());
    }

    addUser (name) {
        this.users.add(name, () => this.input.restoreCursor());
    }

    removeUser (name) {
        this.users.remove(name, () => this.input.restoreCursor());
    }

    renameUser (oldName, newName) {
        this.users.rename(oldName, newName, () => this.input.restoreCursor());
    }


    _createWindow () {
        if (!this.window) {
            this.window = windowArea(this.width, this.height);
        }

        this.window.createLayout();
        this.window.createInnerStructure(this.inputBorder, this.nameBorder);

    }

    _createAreas () {

        let usersWidth = this.width - this.nameBorder - 2,
            usersHeight = this.inputBorder - 2,
            usersLeft = this.nameBorder + 1,
            messagesWidth = this.nameBorder-2,
            messagesHeight = this.inputBorder - 2,
            inputTop = this.inputBorder + 1,
            inputWidth = this.getInputWidth();

        this.messages = messageArea(messagesWidth, messagesHeight, 2, 2);
        this.users = userArea(usersWidth, usersHeight, 2, usersLeft);
        this.input = inputArea(inputWidth, 1, inputTop, 2);
    }

    getInputWidth () {
        return this.width - 2;
    }

    _write (chunk, encoding, callback) {
        this.input.add(chunk);
        callback();
    }

}

module.exports = () => {
    let width = process.stdout.columns,
        height = process.stdout.rows;

    return new WindowView(width, height);
};