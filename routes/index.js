var fs = require('fs');
var path = require('path');
var express = require('express');
var User = require('../models/user');
var Busboy = require('busboy');

var router = express.Router();

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

router.get('/messages', function(req, res) {
    var author = req.query.author,
        contacter = req.query.contacter;

    if(!author || !contacter) {
        res.json({
            code: -1
        });
        return;
    }

    var user = new User(author);

    var promise = user.getRecords(contacter);

    promise.then(function(records) {
        if (records.length > 0) {
            return user.getMessages(records[0]._id);
        }else {
            return {list: []}; 
        }
    }).then(function(messages) {
        res.json({
            code: 0,
            data: {
                messages: messages
            }
        });
    });

});

router.get('/records', function(req, res) {
    var userId = req.query.userId;

    if(!userId) {
        res.json({
            code: -1
        });
        return;
    }

    var promise = new User(userId).getRecords();

    promise.then(function(records) {
        res.json({
            code: 0,
            data: {
                records: records
            }
        });
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

router.post('/friend',function(req, res) {
    var friendName = req.body.friendName,
        author = req.body.author;

    if(!friendName || !author) {
        res.json({
            code: -1
        });
        return;
    }

    var promise = new User(author).createFriend(friendName);

    promise.then(function(friend) {
        if(friend) {
            res.json({
                code: 0,
                data: {
                    friend: friend
                }
            });
        }else {
            res.json({
                code: -1,
                message: '系统出现问题请稍候重试'
            });
        }
    }).catch(function(error) {
        res.json({
            code: -1,
            message: error.message
        });
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

    var promise = User.login(username, password);

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

function writeFile(file, oriFileName, saveFileName) {
    var ext = ('.' + oriFileName.split('.')[1]) || '';
    var savename = saveFileName + ext;
    var filePath = path.join(__dirname, '../public/uploads/', savename);
    file.pipe(fs.createWriteStream(filePath));
    return path.join('/uploads', savename);
}

router.post('/sign', function(req, res) {
    var body = {};

    var busboy = new Busboy({
        headers: req.headers
    });

    busboy.on('field', function(fieldname, val) {
        body[fieldname] = val;
    });

    busboy.on('file', function(filedname, file, filename) {
        body[filedname] = {
            filename: filename,
            file: file
        };
        // file.resume();

        if(!body.username || !body.password) {
            res.json({
                code: 2,
                message: '用户名或密码不能为空'
            });
            return;
        }

        var promise = User.exist(body.username);

        promise
            .then(function(notExist) {
                if(notExist) {
                    body.avatar = writeFile(body.avatar.file, body.avatar.filename, body.username);
                    var p = User.createUser(body.username, body.password, body.avatar);
                    return p;
                }else {
                    res.json({
                        code: 1,
                        message: '用户名已存在'
                    });
                }
            })
            .then(function(user) {
                if(user) {
                    req.session.userId = user._id;
                    res.json({
                        code: 0,
                        data: {
                            userId: user._id
                        }
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

    // busboy.on('finish', function() {
    //     if(!body.username || !body.password) {
    //         res.json({
    //             code: 2,
    //             message: '用户名或密码不能为空'
    //         });
    //         return;
    //     }

    //     var promise = User.exist(body.username);

    //     promise
    //         .then(function(notExist) {
    //             if(notExist) {
    //                 body.avatar = writeFile(body.avatar.file, body.avatar.filename, body.username);
    //                 var p = User.createUser(body.username, body.password, body.avatar);
    //                 return p;
    //             }else {
    //                 res.json({
    //                     code: 1,
    //                     message: '用户名已存在'
    //                 });
    //             }
    //         })
    //         .then(function(user) {
    //             if(user) {
    //                 req.session.userId = user._id;
    //                 res.json({
    //                     code: 0,
    //                     data: {
    //                         userId: user._id
    //                     }
    //                 });
    //             }
    //         })
    //         .catch(function(err) {
    //             console.log(err);
    //             res.json({
    //                 code: -1,
    //                 message: '系统出现问题请稍候重试'
    //             });
    //         });
    // });

    req.pipe(busboy);
});

module.exports = router;
