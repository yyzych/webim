<style lang="sass">
    @import '../statics/scss/variable';
    @import '../statics/scss/mixin';
    @import '../statics/scss/form';
    
    .avatar-upload {
        background-color: #bc3d1e;
        border-radius: 50%;
        height: 90px;
        width: 90px;
        position: relative;
        display: block;
        margin: auto;
        overflow: hidden;

        input[type=file] {
            position: absolute;
            height: 100%;
            width: 100%;
            left: 0;
            top: 0;
            z-index: 2;
            @include opacity(0);
        }

        img {
            height: 100%;
            width: 100%;
            position: relative;
            z-index: 1;
            border-radius: 50%;
        }
    }
</style>

<template>
    <div class="form">
        <form action="">
            <div class="field-row">
                <div class="field-title hide">
                    <label for="">头像</label>
                </div>
                <div class="field-value">
                    <span class="avatar-upload">
                        <input type="file" name="" id="" @change="onChangeFileInput">
                        <!-- 
                            src="{{ avatarDataUrl }}" // 如果找不到会报错
                            :src="avatarDataUrl"  // 如果是用指令的话就不用再使用插值写法了
                         -->
                        <img v-if="avatarDataUrl" :src="avatarDataUrl" alt="">
                    </span>
                </div>
            </div>
            <div class="field-row">
                <div class="field-title">
                    <label for="">用户名</label>
                </div>
                <div class="field-value">
                    <input type="text" name="username" v-model="username">
                </div>
            </div>
            <div class="field-row">
                <div class="field-title">
                    <label for="">密码</label>
                </div>
                <div class="field-value">
                    <input type="password" name="password" v-model="password">
                </div>
            </div>
            <div class="field-row">
                <input type="submit" class="btn btn-block btn-primary" value="注册" @click.prevent="onClickSubmit">
            </div>
        </form>

        <div class="btm">
            <a v-link="'login'">登录</a>
        </div>

        <m-alert :content="alert.content" :show="alert.show"></m-alert>
    </div>
</template>

<script>
    var auth = require('../auth');
    var MAlert = require('../components/alert.vue');

    module.exports = {
        name: 'SignView',
        components: {
            'm-alert': MAlert
        },
        data: function() {
            return {
                username: '',
                password: '',
                avatar: null,
                avatarDataUrl: null,

                alert: {
                    content: '',
                    show: false,
                    openFn: function(txt, autoHide) {
                        this.content = txt;
                        this.show = true;
                        if(autoHide) {
                            this.hideFn();
                        }
                    },
                    hideFn: function(duration) {
                        clearTimeout(this.timer);
                        this.timer = setTimeout(() => {
                            this.show = false;
                        }, duration || 1500);
                    }
                }
            }
        },
        methods: {
            onChangeFileInput: function(e) {
                var files = e.target.files;
                if(!files || files.length < 1) return;

                var self = this;
                var file = files[0];
                var filefilers = /^(image\/gif|image\/jpeg|image\/png)$/i;
                var fileReader = new FileReader();
                fileReader.onload = function(fe) { 
                    self.avatarDataUrl = fe.target.result;
                };
                if(!filefilers.test(file.type)) {
                    alert('只支持.gif, .jpeg, .png');
                    return;
                }
                fileReader.readAsDataURL(file);
                this.avatar = file;
            },
            onClickSubmit: function() {
                if(!this.username || !this.password) {
                    return;
                }

                this.alert.openFn('请稍等...');

                var cb = function() {
                    var promise = auth.sign(this.username, this.password, this.avatar);

                    promise.then(resp => {
                        if(resp.code != 0) {
                            this.alert.openFn(resp.message, true);
                        }else {
                            this.alert.hideFn();
                            this.$route.router.go('./index')
                        }
                    });
                };

                setTimeout(cb.bind(this), 300);
            }
        }
    };
</script>

