var $ = require('../statics/js/zepto.ajax');

var friendStore = {};

friendStore.fetch = function(author) {
    var url = '/friends';

    var promise = new Promise(function(resolve, reject) {
        $.get(url, {
            userId: author
        }, function(resp) {
            if (resp.code == 0) {
                resolve(resp.data.friends);
            } else {
                resolve([]);
            }
        });
    });

    return promise;
};

// friendStore.findFriend = function(username) {
//     var promise = new Promise(function(resolve, reject) {
//         $.getJSON('/friend', {
//             username: username
//         }, function(resp) {
//             if (resp.code == 0) {
//                 resolve(resp.data.friend);
//             } else {
//                 reject();
//             }
//         });
//     });

//     return promise;
// };

friendStore.createFriend = function(author, friendName) {
    var promise = new Promise(function(resolve, reject) {
        $.post('/friend', {
            author: author,
            friendName: friendName
        }, function(resp) {
            if (resp.code == 0) {
                resolve(resp.data.friend);
            } else {
                reject(resp);
            }
        });
    });

    return promise;
};

module.exports = friendStore;

