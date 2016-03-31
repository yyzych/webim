var assert = require('chai').assert;

var User = require('../models/user');
var mongoHelper = require('../mongoHelper');

/* globals describe, before, after, it */
describe('model - user', function() {

    before(function(done) {
        mongoHelper.on('connected', () => {
            done();
        });
    });

    after(function() {
        mongoHelper.close();
    });

    describe('#fetch', function() {
        before(function(done) {
            mongoHelper.once('droped', () => {
                done();
            });
            mongoHelper.drop('users');
        });

        it('输入用户id，返回用户的基本信息', function(done) {
            var p = User.createUser('ych', '123456', '/uploads/ych.jpg');
            p.then(function(user) {
                    assert.isDefined(user._id);
                    var p = new User(user._id).fetch();
                    return p;
                })
                .then(function(user) {
                    assert.equal(user.username, 'ych');
                    assert.equal(user.avatar, '/uploads/ych.jpg');
                    done();
                })
                .catch(function(err) {
                    console.log(err);
                });
        });
    });

    describe('#createUser', function() {
        before(function(done) {
            mongoHelper.once('droped', () => {
                done();
            });
            mongoHelper.drop('users');
        });

        it('输入用户名，密码，图像返回promise', function(done) {
            var p = User.createUser('lihua', '123456');
            assert.isTrue(typeof p.then === 'function');
            p.then(function(user) {
                    assert.isDefined(user._id);
                    assert.equal(user.username, 'lihua');
                    done();
                })
                .catch(function(err) {
                    console.log(err);
                });
        });
    });
    
});