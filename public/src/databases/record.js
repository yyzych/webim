var $ = require('../statics/js/zepto.ajax');

// var LS = localStorage;

// const ls_key_records = 'records';
// const ls_key_messages = 'messages';
// var records = JSON.parse(LS.getItem(ls_key_records)) || [];
// var messages = JSON.parse(LS.getItem(ls_key_messages)) || [];

var recordStore = {};


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



