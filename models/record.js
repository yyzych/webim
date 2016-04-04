var ObjectId = require('mongodb').ObjectId;
var mongoHelper = require('../mongoHelper');


function Record(recordId) {
    this.recordId = recordId;
}

Record.setMsgReadStatus = function(author, contacter, isRead) {
    var db = mongoHelper.db;

    var promise = new Promise(function(resolve, reject) {
        var collection = db.collection('records');
        collection.updateOne({
            author: ObjectId(author),
            contacter: ObjectId(contacter)
        }, {
            $set: { // 如果少了$set修饰符，会整个替换
                unread: isRead
            }
        }, function(err, result) {
            if(err) {
                reject(err);
            }else {
                resolve(!!result.modifiedCount);
            }
        });
    });

    promise = promise.then(function(isOk) {
        console.log('Did unread change: ', isOk);
    }).catch(function(err) {
        console.log(err);
    });

    return promise;
};

Record.setMsgRead = function(author, contacter) {
    this.setMsgReadStatus(author, contacter, false);
};

Record.setMsgUnRead = function(author, contacter) {
    this.setMsgReadStatus(author, contacter, true);
};

Record.activateRecord = function(messageId) {
    var db = mongoHelper.db;
    var query = {
        messageId: ObjectId(messageId)
    };

    var promise = new Promise(function(resolve, reject) {
        var collection = db.collection('records');
        collection.updateMany(query, {
            $set: {
                status: 1 // 删除
            }
        }, function(err, result) {
            if(err) {
                reject(err);
            }else {
                resolve(!!result.modifiedCount);
            }
        });
    });

    return promise;
};

Record.createMessage = function(messageId, attr) {
    var db = mongoHelper.db;
    
    var promise = new Promise(function(resolve, reject) {
        var collection = db.collection('messages');
        collection.updateOne({
            _id: ObjectId(messageId)
        }, {
            $push: {
                list: attr
            }
        }, function(err, result) {
            if(err) {
                reject(err);
            }else {
                !!result.modifiedCount ? resolve(messageId) : reject(new Error('更新message.list时失败'));
            }
        });
    });

    return promise;
};

Record.createRecord = function(author, contacter) {
    var db = mongoHelper.db;

    var promise = new Promise(function(resolve, reject) {
        var collection = db.collection('messages');
        collection.insertOne({list: []}, function(err, result) {
            if(err) {
                reject(err);
            }else {
                resolve(result.insertedId);
            }
        });
    });

    promise = promise.then(function(messageId) {
        var p = new Promise(function(resolve, reject) {
            var collection = db.collection('records');
            collection.insertMany([{
                author: ObjectId(author),
                contacter: ObjectId(contacter),
                messageId: messageId,
                unread: false
            }, {
                author: ObjectId(contacter),
                contacter: ObjectId(author),
                messageId: messageId,
                unread: true
            }], function(err, result) {
                if(err) {
                    reject(err);
                }else {
                    var fir = result.ops[0],
                        sec = result.ops[1];
                    resolve(String(fir.id) === String(author) ? fir : sec);
                }
            });
        });

        return p;
    });

    return promise;
};


module.exports = Record;