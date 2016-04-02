var ObjectId = require('mongodb').ObjectId;
var mongoHelper = require('../mongoHelper');


function Record(recordId) {
    this.recordId = recordId;
}

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
                messageId: messageId
            }, {
                author: ObjectId(contacter),
                contacter: ObjectId(author),
                messageId: messageId
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