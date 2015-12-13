'use strict';
let stream = require('stream'),
    colorHelper = require('./colorHelper');

const
    part_type = 0,
    part_author = 1,
    part_date = 2,
    part_color = 3,
    part_text = 4;

class ClientMessageManager extends stream.Transform {

    constructor (oprions) {
        super(oprions);
        this.helpers = [];
    }

    _transform (data, encoding, callback) {
        this.push(new Buffer(this.processData(data)));
        callback();
    }

    /**
     * Add new message helper to system
     * @param val
     */
    appendHelper (val) {
        if (val.processMsg && typeof val.processMsg === 'function') {
            this.helpers.push(val);
        }
    }

    /**
     * Apply all helpers to message
     * @param msg {object} received message description object
     * @returns {object} changed message object
     */
    applyHelpers (msg) {
        this.helpers.forEach((helper) => helper.processMsg(msg));
        return msg;
    }

    /**
     * Process incoming data;
     * @param data {string} - encoded string
     * @returns {string} - prepared user message
     */
    processData (data) {
        let parts = data.toString().split('::'),
            msgObj = {
                type: parts[part_type],
                date: parts[part_date] ? parts[part_date].split(' ')[4] : '',
                author: parts[part_author],
                color: parts[part_color],
                text: parts[part_text] + '\n'
            };

        return this.applyHelpers(msgObj).text;
    }
}

module.exports = (colorMap) => {
    let messageManager = new ClientMessageManager();
    messageManager.appendHelper(colorHelper(colorMap));

    return messageManager;
};