var io = require('socket.io-client');

var socket = io();

socket.on('message', (resp)=> {
    console.log('message');
});

socket.on('record', (resp) => {
    console.log('record');
});

socket.on('error', (resp) => {
    console.error(resp.message);
});

exports.socket = socket;

exports.enter = function(author, relate) {
    socket.emit('enter', {
        author: author,
        relate: relate
    });
};

exports.leave = function(author, relate) {
    socket.emit('leave', {
        author: author,
        relate: relate
    });
};

exports.login = function(userId) {
    socket.emit('login', {userId: userId});
};

exports.logout = function(userId) {
    socket.emit('logout', {userId: userId});
};
