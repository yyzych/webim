var EventEmitter = require('events');
var $ = require('../statics/js/zepto.ajax');


var globalStore = Object.assign(EventEmitter);

globalStore.upload = function(file) {
    var fd = new FormData();
    fd.append('file', file);

    var promise = new Promise(function(resolve, reject) {
        $.ajax({
            url: '/g/upload',
            type: 'post',
            dataType: 'json',
            data: fd,
            contentType: false,
            processData: false,
            success: function(resp) {
                resolve(resp); 
            }
        });
    });

    return promise;
};

module.exports = globalStore;



