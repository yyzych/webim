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
exports.join = function(userId) {
    socket.emit('join', {userId: userId});
};
