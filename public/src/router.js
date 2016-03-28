var LoginView = require('./views/login.vue');
var SignView = require('./views/sign.vue');
var RecordView = require('./views/record.vue');
var ChatView = require('./views/chat.vue');
var FriendView = require('./views/friend.vue');

module.exports = function(router) {
    router.map({
        '/index': {
            component: RecordView
        },
        '/chat/:relate': {
            name: 'chat',
            component: ChatView
        },
        '/login': {
            component: LoginView
        },
        '/sign': {
            component: SignView
        },
        '/friend': {
            component: FriendView
        }
    });
};