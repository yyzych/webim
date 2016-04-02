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

    var promise = Record.createMessage(messageId, data);

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
            friSocket.emit('record', resp);
        }else {
            // Record.offlineMessage(data.receiver, data.sender, data);
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
        }

        socket.emit('record', resp);
    }).catch(function(err) {
        socket.emit('error', {
            code: -1,
            message: err.message
        });
    });
};


// 使用devtool运行程序会有问题，有很多套接字链接。好像是devtool也使用了socket一样!!!
exports.onConnection = function(socket) {
    var io = this;

    console.log('a user connected!');

    socket.on('join', function(data) {
        // persons[socket.id] = data.userId;
        persons[data.userId] = socket;
    });

    socket.on('message', function(data, messageId) {
        onMessage.call(socket, data, messageId, io);
    });

    socket.on('record', function(data) {
        onRecord.call(socket, data, io);
    });

    socket.on('disconnect', function() {
        
    });

};