<style lang="sass">
    @import '../statics/scss/variable';
    @import '../statics/scss/mixin';
    @import '../statics/scss/form';

</style>

<template>
    <div class="form">
        <form action="">
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
                <input type="submit" class="btn btn-block btn-primary" value="登陆" @click.prevent="onClickSubmit">
            </div>
        </form>

        <div class="btm">
            <a v-link="'sign'">注册</a>
        </div>

        <m-alert :content="alert.content" :show="alert.show"></m-alert>
    </div>
</template>

<script>
    var auth = require('../auth');
    var MAlert = require('../components/alert.vue');


    module.exports = {
        name: 'LoginView',
        components: {
            'm-alert': MAlert
        },
        data: function() {
            return {
                username: '',
                password: '',

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
            onClickSubmit: function() {
                if(!this.username || !this.password) {
                    return;
                }

                this.alert.openFn('请稍等...');

                var cb = function() {
                    var promise = auth.login(this.username, this.password);

                    promise
                        .then(resp => {
                            this.alert.hideFn();
                            this.$route.router.go('./index')
                        })
                        .catch(resp => {
                            this.alert.openFn(resp.message, true);
                        });
                };

                setTimeout(cb.bind(this), 300);
            }
        }
    };
</script>

