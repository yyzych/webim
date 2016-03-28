var fs = require('fs');
var path = require('path');
var express = require('express');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;

var router = express.Router();

var mongoHelper = {
    db: null,
    db_url: 'mongodb://localhost:27017/webim',
    connect: function() {
        var self = this;
        MongoClient.connect(this.db_url, function(err, db) {
            if(err) {
                console.log('db can not connect!');
                process.exit(1);
            }else {
                console.log('db connect success!');
                self.db = db;
            }
        });
    },
    close: function() {
        this.db && this.db.close();
    }
};

mongoHelper.connect();

function User(userId) {
    this.userId = userId;
}

// 根据ID获取个人信息
User.prototype.fetch = function() {
    var db = mongoHelper.db;
    var userId = this.userId;

    var promise = new Promise(function(resolve, reject) {
        var collection = db.collection('users');
        collection.find({_id: ObjectId(userId)}).toArray(function(err, docs) {
            if(err) {
                reject(err);
            }else {
                resolve(docs[0]);
            }
        });
    });

    return promise;
};

// 获取朋友列表
User.prototype.getFriends = function() {
    var db = mongoHelper.db;
    var author = this.userId;
    var friends;

    var promise = new Promise(function(resolve, reject) {
        var collection = db.collection('friends');
        collection.find({author: author}).toArray(function(err, docs) {
            if(err) {
                reject(err);
            }else {
                friends = docs;
                resolve(docs);
            }
        });
    });

    promise = promise
        .then(function(docs) {
            // 立即执行，返回的是不是就是p呢??
            var p = Promise.all(docs.map(function(item) {
                return new User(item.relate).fetch();
            }));
            return p;
        })
        .then(function(profiles) {
            var res = [];
            if(!friends || friends.length<1) 
                return res;

            for(var i=0; i<friends.length; i++) {
                for(var j=0; j<profiles.length; j++) {
                    if(!profiles[j])
                        continue;
                    if(friends[i].relate === profiles[j]._id + '') {
                        var item = {
                            author: author,
                            relate: friends[i].relate,
                            remark: friends[i].remark,
                            avatar: profiles[j].avatar
                        };
                        res.push(item);
                    }
                }
            }

            return res;
        });

    return promise;
}

User.prototype.login = function(u, p) {
    var db = mongoHelper.db;
    var promise = new Promise(function(resolve, reject) {
        var collection = db.collection('users');
        collection.find({username:u, password: p}).toArray(function(err, docs) {
            if(err) {
                reject(err);
            }else {
                resolve(docs);
            }
        });
    });
    return promise;
}

User.prototype.sign = function(u, p, a) {
    var db = mongoHelper.db;
    var promise = new Promise(function(resolve, reject) {
        var collection = db.collection('users');
        collection.insertMany([{
            username: u,
            password: p,
            avatar: a
        }], function(err, result) {
            if(err) {
                reject(err);
            }else {
                resolve(result);
            }
        });
    });
    return promise;
}


function authorize(req, res, next) {
    var sess = req.session;
    if (!sess.userId) {
        res.json({
            code: -1,
            message: '请先登录'
        });
    } else {
        next();
    }
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: '首页'
    });
});

router.get('/chat', function(req, res, next) {
    res.render('chat', {
        title: '聊天界面'
    });
});

router.get('/users', function(req, res) {
    var userId = req.query.userId;

    if(!userId) {
        res.json({
            code: -1
        });
        return;
    }

    var promise = new User(userId).fetch();

    promise.then(function(user) {
        if(!user) {
            res.json({
                code: 2,
                message: '没有该用户'
            });
        }else {
            res.json({
                code: 0,
                data: {
                    user: user
                }
            });
        }
    });
});

router.get('/friends', function(req,res) {
    var userId = req.query.userId;

    if(!userId) {
        res.json({
            code: -1
        });
        return;
    }

    var promise = new User(userId).getFriends();

    promise
        .then(function(docs) {
            res.json({
                code: 0,
                data: {
                    friends: docs
                }
            })
        })
        .catch(function(err) {
            console.log(err);
            res.json({
                code: -1,
                message: '系统出现问题请稍候重试'
            });
        });
});

router.post('/login', function(req, res, next) {
    var username = req.body.username,
        password = req.body.password;

    if (!username || !password) {
        res.json({
            code: 2,
            message: '用户名或密码不能为空'
        });
        return;
    }

    var promise = new User().login(username, password);

    promise
        .then(function(docs) {
            if(docs.length === 1) {
                var user = docs[0];
                req.session.userId = user._id;
                res.json({
                    code: 0,
                    data: {
                        userId: user._id // Mongodb中的_id是一个对象，但是定义了toString()，返回字符传
                    }
                });
            }else {
                res.json({
                    code: 3,
                    message: '用户名或密码不正确'
                });
            }
        })
        .catch(function(err) {
            console.log(err);
            res.json({
                code: -1,
                message: '系统出现问题请稍候重试'
            });
        });
});

router.post('/sign', function(req, res, next) {
    var attr = {};

    // 读取其他字段
    req.busboy.on('field', function(key, value) {
        if((key == 'username' || key == 'password') && !value) {
            res.json({
                code: 2,
                message: '用户名或密码不能为空'
            });
            return;
        }
        attr[key] = value;
    });

    // 读取文件
    req.busboy.on('file', function(filedname, file, filename) {
        var ext = ('.' + filename.split('.')[1]) || '';
        var savename = Date.now() + ext;
        var upload_path = path.join(__dirname, '../public/uploads/');
        var filePath    = path.join(upload_path, savename);
        file.pipe(fs.createWriteStream(filePath));
        attr.avatar = path.join('/uploads', savename);
    });

    req.busboy.on('finish', function() {
        var promise = new User().sign(attr.username, attr.password, attr.avatar);

        promise
            .then(function(result) {
                var user = result.ops[0];
                req.session.userId = user._id;
                res.json({
                    code: 0,
                    data: {
                        userId: user._id
                    }
                });
            })
            .catch(function(err) {
                console.log(err);
                res.json({
                    code: -1,
                    message: '系统出现问题请稍候重试'
                });
            });
    });

    req.pipe(req.busboy);
});

module.exports = router;