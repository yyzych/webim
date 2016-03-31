var ObjectId = require('mongodb').ObjectId;
var mongoHelper = require('../mongoHelper');


function Record(recordId) {
    this.recordId = recordId;
}

Record.prototype.createMessage = function(messageId, attr) {
    var db = mongoHelper.db;
    
    var promise = new Promise(function(resolve, reject) {
        var collection = db.collection('messages');
        collection.updateOne({
            _id: ObjectId(messageId)
        }, {
            $push: attr
        }, function(err, result) {
            if(err) {
                reject(err);
            }else {
                resolve(result);
            }
        });
    });

    return promise;
};

Record.prototype.createRecord = function(author, contacter) {
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
            collection.insertOne({
                author: author,
                contacter: contacter,
                messageId: messageId
            }, function(err, result) {
                if(err) {
                    reject(err);
                }else {
                    resolve(result.insertedId);
                }
            });
        });

        return p;
    });

    return promise;
};