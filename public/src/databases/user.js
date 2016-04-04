var EventEmitter = require('events');
var $ = require('../statics/js/zepto.ajax');


// 数据的维护都是Vue帮你做的，自己只要操作后台就行
// 不用像Backbone自己维护Model

var userStore = Object.assign(EventEmitter);

userStore.fetch = function(userId) {
    var promise = new Promise(function(resolve, reject) {
        $.get('/users', {userId: userId}, function(resp) {
            resolve(resp.data.user);
        });
    });
    return promise;
};

userStore.deleteRecord = function(author, contacter) {
    var data = {
        author: author
    };

    if(contacter) {
        data.contacter = contacter;
    }

    var promise = new Promise(function(resolve, reject) {
        $.post('/record', data, function(resp) {
            resolve(~resp.code);
        });
    });

    return promise;
};

module.exports = userStore;



