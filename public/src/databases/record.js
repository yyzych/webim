var $ = require('../statics/js/zepto.ajax');
var _ = require('underscore');
var userStore = require('./user');

var LS = localStorage;

const ls_key_records = 'records';
const ls_key_messages = 'messages';
var records = JSON.parse(LS.getItem(ls_key_records)) || [];
var messages = JSON.parse(LS.getItem(ls_key_messages)) || [];

var recordStore = {};

recordStore.createMessage = function(recordId, attr) {
    if(!recordId || !attr.sender || !attr.receiver) {
        return;
    }
    
    var messageId = _.uniqueId('message_');
    attr.date = Date.now();
    attr._id = messageId;
    attr.recordId = recordId;
    messages.push(attr);

    var str = JSON.stringify(messages);
    LS.setItem(ls_key_messages, str);
    return messageId;
};

recordStore.createRecord = function(author, contacter) {
    var recordId = _.uniqueId('record_');
    var attr = {
        _id: recordId,
        author: author,
        contacter: contacter
    };
    records.push(attr);
    
    var str = JSON.stringify(records);
    LS.setItem(ls_key_records, str);
    return recordId;
};

recordStore.getRecordList = function(author) {
    var attr = {
        author: author
    };
    return _.where(records, attr);
};

recordStore.getRecord = function(author, contacter) {
    var attr = {
        author: author,
        contacter: contacter
    };
    return _.where(records, attr)[0];
};


recordStore.getMessageList = function(author, contacter) {
    var query = {
        author: author,
        contacter: contacter
    };

    var promise = new Promise(function(resolve, reject) {
        $.getJSON('/messages', query, function(resp) {
            resolve(resp.data.messages);
        });
    });

    return promise;
};

/**
 * 获取用户的所有聊天记录列表／获取用户与特定联系人的聊天记录信息
 * @param  {string} author 用户id
 * @param  {string} relate 联系人id
 * @return {Promise}
 */
recordStore.fetch = function(author, relate) {
    var query = {userId: author};
    relate && (query.relate = relate);
    var promise = new Promise(function(resolve, reject) {
        $.get('/records', query, function(resp) {
            resolve(resp.data.records);
        });
    });
    return promise;
};

module.exports = recordStore;



