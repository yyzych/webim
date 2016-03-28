var $ = require('./statics/js/zepto.ajax');

var LS = localStorage;
const login_url = '/login';
const sign_url = '/sign';
const id_token_key = 'id_token';

module.exports = {
    user: {
        authenticated: false
    },

    checkAuth: function() {
        var id = LS.getItem(id_token_key);
        if(id) {
            this.user.authenticated = true;
            this.user.userId = id;
        }else {
            this.user.authenticated = false;
            this.user.userId = '';
        }
    },

    login: function(u, p) {
        var self = this;
        var data = {
            username: u,
            password: p
        };
        var promise = new Promise(function(resolve, reject) {
            if(!data.username || !data.password) {
                reject({
                    code: 2,
                    message: '用户名或密码为空'
                });
            }

            $.ajax({
                url: login_url,
                type: 'post',
                data: data,
                dataType: 'json',
                success: function(resp) {
                    if(resp.code != 0) {
                        reject(resp);
                    }else {
                        LS.setItem(id_token_key, resp.data.userId);

                        self.user.authenticated = true;
                        self.user.userId = resp.data.userId;

                        resolve(resp);
                    }
                }
            });
            
        });
        return promise;
    },

    logout: function() {
        this.user.authenticated = false;
        this.user.userId = '';
        LS.removeItem(id_token_key);  
    },

    sign: function(u, p, a) {
        var self = this;
        var data = {
            username: u,
            password: p,
            avatar: a
        };

        var fd = new FormData();
        fd.append('username', u);
        fd.append('password', p);
        fd.append('avatar', a);

        var promise = new Promise(function(resolve, reject) {
            if(!data.username || !data.password) {
                reject({
                    code: 2,
                    message: '用户名或密码为空'
                });
            }

            $.ajax({
                url: sign_url,
                type: 'post',
                dataType: 'json',
                data: fd,
                contentType: false,
                processData: false,
                success: function(resp) {
                    if(resp.code == 0) {
                        LS.setItem(id_token_key, resp.data.userId);

                        self.user.authenticated = true;
                        self.user.userId = resp.data.userId;
                    }
                    resolve(resp); 
                }
            });
        });

        return promise;
    },

    getAuthHeader: function() {
        return {
            Authorization: 'CurUser' + LS.getItem(id_token_key)
        };
    }
};