var $ = require('../statics/js/zepto.ajax');
var _ = require('underscore');
var userStore = require('./user');

const ls_key_records = 'records';
const ls_key_messages = 'messages';

var LS = localStorage;
var records = JSON.parse(LS.getItem(ls_key_records)) || [];
var messages = JSON.parse(LS.getItem(ls_key_messages)) || [];

var recordStore = {};

recordStore.createMessage = function(recordId, attr) {
    if(!recordId || !attr.sender || !attr.receiver) 
        return;
    
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
    var record = this.getRecord(author, contacter);

    if(!record)
        return [];

    return _.where(messages, {recordId: record._id});
};

// recordStore.fetch = function(author) {
//     var promise = new Promise(function(resolve, reject) {
//         $.get('/records', {userId: author}, function(resp) {
//             resolve(resp.data.records);
//         });
//     });
//     return promise;
// }

recordStore.fetch = function(author) {
    var records = this.getRecordList(author);
    // 这么写的话每一个item都得会有有个请求
    var promise = Promise.all(records.map(function(item) {
        return userStore.fetch(item.author);
    }));
    promise = promise.then(function(contacters) {
        var res = [];
        var len = records.length;
        for(var i = 0; i<len; i++) {
            var record = records[i];
            for(var j = 0; j<len; j++) {
                var contacter = contacters[j];
                if(record.contacter === contacters._id) {
                    res.push(_.extend({}, record, contacter));
                    break;
                }
            }
        }
        return res;
    });
    return promise;
};

module.exports = recordStore;



