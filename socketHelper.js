var Record = require('./models/record');
var User = require('./models/user');

var persons = {};

var log = function() {
    console.log.apply(console, arguments);
};

log.color = function() {
    var args = [].slice.call(arguments);
    args.unshift('\033[35m');
    args.push('\033[39m');
    console.log.apply(console, args);
};

var joinRoom = function(socket, messageId) {
    var rooms = socket.rooms;
    messageId = String(messageId);
    if(!rooms[messageId]) {
        socket.join(messageId);
    }
};

var searchFriend = function(userId) {
    return persons[userId];
};

var onMessage = function(data, messageId, io) {
    var socket = this;

    var promise;

    if(true) {
        promise = Record.activateRecord(messageId);
        promise = promise.then(function() {
            return Record.createMessage(messageId, data);
        });
    }else {
        promise = Record.createMessage(messageId, data);
    }

    // var promise = Record.createMessage(messageId, data);

    promise.then(function(messageId) {
        var resp = {
            code: 0,
            data: {
                messageId: messageId,
                attr: data
            }
        };

        var friSocket = searchFriend(data.receiver);
        if(friSocket) {
            friSocket.emit('message', resp);
        }else {
            Record.setMsgUnRead(data.receiver, data.sender);
        }

        socket.emit('message', resp);
    }).catch(function(err) {
        log.color(err);
        socket.emit('error', {
            code: -1,
            message: err.message
        });
    });
};

var onRecord = function(data, io) {
    var socket = this;
    var author = data.sender,
        contacter = data.receiver;

    var promise = new User(author).getRecords(contacter);

    promise.then(function(records) {
        if(records.length>0) {
            var record = records[0];
            var messageId = record.messageId;
            var p = Record.createMessage(messageId, data);
            return p;
        }else {
            var p = Record.createRecord(author, contacter);
            p = p.then(function(doc) {
                var messageId = doc.messageId;
                var p = Record.createMessage(messageId, data);
                return p;
            });
            return p;
        }
    }).then(function(messageId) {
        var resp = {
            code: 0,
            data: {
                messageId: messageId,
                attr: data
            }
        };

        var friSocket = searchFriend(data.receiver);
        if(friSocket) {
            friSocket.emit('record', resp);

            if(false) {
                // 没有进入特定的房间
                Record.setMsgUnRead(data.receiver, data.sender);    
            }
        }else {
            Record.setMsgUnRead(data.receiver, data.sender); // 不需要依赖或等待
        }

        socket.emit('record', resp);
    }).catch(function(err) {
        socket.emit('error', {
            code: -1,
            message: err.message
        });
    });
};

var onEnterRoom = function(data, io) {
    Record.setMsgRead(data.author, data.relate);
};

var onLeaveRoom = function(data, io) {
    // Record.setMsgUnRead(data.author, data.relate);
};


// 使用devtool运行程序会有问题，有很多套接字链接。好像是devtool也使用了socket一样!!!
exports.onConnection = function(socket) {
    var io = this;

    console.log('a user connected!');

    socket.on('login', function(data) {
        console.log('a user login!');
        socket.userId = data.userId;
        persons[data.userId] = socket;
    });

    socket.on('enter', function(data) {
        console.log('user enter: ', data.author, data.relate);
        onEnterRoom.call(socket, data, io);
    });

    socket.on('leave', function(data) {
        console.log('user leave: ', data.author, data.relate);
        onLeaveRoom.call(socket, data, io);
    });

    socket.on('message', function(data, messageId) {
        onMessage.call(socket, data, messageId, io);
    });

    socket.on('record', function(data) {
        onRecord.call(socket, data, io);
    });

    socket.on('logout', function() {
        console.log('a user logout!');
        persons[socket.userId] = null;
    });

    socket.on('disconnect', function() {
        console.log('a user disconnect!');
        persons[socket.userId] = null;
    });

};