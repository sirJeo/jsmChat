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

    applyHelper (val) {
        if (val.processMsg && typeof val.processMsg === 'function') {
            this.helpers.push(val);
        }
    }

    appendHelpers (msg) {
        this.helpers.forEach((helper) => helper.processMsg(msg));
        return msg;
    }

    processData (data) {
        let parts = data.toString().split('::'),
            msgObj = {
                type: parts[part_type],
                date: parts[part_date] ? parts[part_date].split(' ')[4] : '',
                author: parts[part_author],
                color: parts[part_color],
                text: parts[part_text] + '\n'
            };

        return this.appendHelpers(msgObj).text;
    }
}

module.exports = (colorMap) => {
    let messageManager = new ClientMessageManager();
    messageManager.applyHelper(colorHelper(colorMap));

    return messageManager;
};