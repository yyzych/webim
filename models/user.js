var ObjectId = require('mongodb').ObjectId;
var mongoHelper = require('../mongoHelper');


function User(userId) {
    this.userId = userId;
}

/**
 * 获取某聊天记录的所有消息列表
 * @param  {string} recordId 记录id
 * @return {promise} 
 */
User.prototype.getMessages = function(recordId) {
    var db = mongoHelper.db;
    var query = {
        _id: ObjectId(recordId)
    };

    var promise = new Promise(function(resolve, reject) {
        var collection = db.collection('records');
        collection.aggregate([{
            $match: query
        }, {
            $lookup: {
                from: 'messages',
                localField: 'messageId',
                foreignField: '_id',
                as: 'messages'
            }
        }]).toArray(function(err, docs) {
            if (err) {
                reject(err);
            } else {
                docs.forEach(function(item) {
                    item.list = item.messages[0].list;
                });
                resolve(docs[0]);
            }
        });
    });

    return promise;
};

/**
 * 获取默认用户的所有聊天记录列表或与特定用户的聊天列表
 * @param  {string} contacter 特定用户id
 * @return {promise}          
 */
User.prototype.getRecords = function(contacter) {
    var db = mongoHelper.db;
    var query = {
        author: ObjectId(this.userId)
    };

    if (contacter) {
        query.contacter = ObjectId(contacter);
    }

    var promise = new Promise(function(resolve, reject) {
        var collection = db.collection('records');
        collection.aggregate([{
            $match: query
        }, {
            $lookup: {
                from: 'users',
                localField: 'contacter',
                foreignField: '_id',
                as: 'contacterInfo'
            }
        }]).toArray(function(err, docs) {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        });
    });

    promise = promise.then(function(docs) {
        docs.map(function(item) {
            item.contacterInfo = item.contacterInfo[0];
        });
        return docs;
    });

    return promise;
};

/**
 * 根据ID获取个人信息
 * @return {promise}
 */
User.prototype.fetch = function() {
    var db = mongoHelper.db;
    var userId = this.userId;

    var promise = new Promise(function(resolve, reject) {
        var collection = db.collection('users');
        collection.find({
            _id: ObjectId(userId)
        }).toArray(function(err, docs) {
            if (err) {
                reject(err);
            } else {
                resolve(docs[0]);
            }
        });
    });

    return promise;
};

/**
 * 创建朋友
 * @param  {string} friendName 朋友的username
 * @return {promise}          
 */
User.prototype.createFriend = function(friendName) {
    var db = mongoHelper.db;
    var author = ObjectId(this.userId);
    var relate;

    var promise = new Promise(function(resolve, reject) {
        var collection = db.collection('users');
        collection.find({
            username: friendName
        }).toArray(function(err, docs) {
            if(err) {
                reject(err);
            }else {
                resolve(docs[0]);
            }
        });
    });

    promise = promise.then(function(user) {
        if(user) {
            relate = user._id;
            if(String(relate) === String(author)) {
                throw new Error('不能添加自己');
            }
            var p = new Promise(function(resolve, reject) {
                var collection = db.collection('friends');
                collection.find({
                    author: author,
                    relate: relate
                }).toArray(function(err, docs) {
                    if(err) {
                        reject(err);
                    }else {
                        resolve(docs[0]);
                    }
                });
            });
            return p;
        }else {
            throw new Error('用户不存在');
        }
    });

    promise = promise.then(function(already) {
        if(already) {
            return already;
        }else {
            var p = new Promise(function(resolve, reject) {
                var collection = db.collection('friends');
                collection.insertMany([{
                    author: author,
                    relate: relate
                }, {
                    author: relate,
                    relate: author
                }], function(err, result) {
                    if(err) {
                        reject(err);
                    }else {
                        var fir = result.ops[0];
                        var sec = result.ops[1];
                        resolve(String(fir.author) === String(author) ? fir : sec);
                    }
                });
            });
            return p;
        }
    });

    return promise;
};

/**
 * 获取朋友列表
 * @return {promise}
 */
User.prototype.getFriends = function() {
    var db = mongoHelper.db;
    var query = {
        author: ObjectId(this.userId)
    };

    var promise = new Promise(function(resolve, reject) {
        var collection = db.collection('friends');
        collection.aggregate([{
            $match: query
        }, {
            $lookup: {
                from: 'users',
                localField: 'relate',
                foreignField: '_id',
                as: 'friendInfo'
            }
        }]).toArray(function(err, docs) {
            if(err) {
                reject(err);
            }else {
                docs.forEach(function(item) {
                    item.friendInfo = item.friendInfo[0];
                });
                resolve(docs);
            }
        });
    });
    return promise;
};


/**
 * 创建用户
 * @param  {string} u 用户名
 * @param  {string} p password
 * @param  {string} a 头像地址
 * @return {promise}   
 */
User.createUser = function(u, p, a) {
    var db = mongoHelper.db;

    var promise = new Promise(function(resolve, reject) {
        var collection = db.collection('users');

        collection.insertOne({
            username: u,
            password: p,
            avatar: a
        }, function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result.ops[0]);
            }
        });
    });

    return promise;
};


User.login = function(u, p) {
    var db = mongoHelper.db;
    var promise = new Promise(function(resolve, reject) {
        var collection = db.collection('users');
        collection.find({
            username: u,
            password: p
        }).toArray(function(err, docs) {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        });
    });
    return promise;
};

User.exist = function(u) {
    var db = mongoHelper.db;
    var promise = new Promise(function(resolve, reject) {
        var collection = db.collection('users');

        collection.find({
            username: u
        }).toArray(function(err, docs) {
            if(err) {
                reject(err);
            }else {
                resolve(docs.length === 0);
            }
        });
    });

    return promise;
};


module.exports = User;