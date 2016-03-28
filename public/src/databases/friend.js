var EventEmitter = require('events');
var $ = require('../statics/js/zepto.ajax');

// var friendStore = Object.assign(EventEmitter);
var friendStore = {};

friendStore.fetch = function(author) {
    var url = '/friends';

    var promise = new Promise(function(resolve, reject) {
        $.get(url, {userId: author}, function(resp) {
            if(resp.code == 0) {
                resolve(resp.data.friends);
            }else {
                resolve([]);
            }
        });
    });

    return promise;
};

module.exports = friendStore;



