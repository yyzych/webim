<style lang="sass">
    @import '../statics/scss/variable';
    @import '../statics/scss/mixin';
    
    .header {
        height: 44px;
        line-height: 44px;
        background-color: #39393d;
        color: #fff;
        text-align: center;
        font-size: 18px;
        padding: 0 20px;
        position: relative;
        z-index: 99;

        .opt {
            padding: 0 10px;
            font-size: 16px;
        }

        .icon-plus {
            height: 18px;
            width: 18px;
        }

        .icon-back {
            height: 12px;
            width: 12px;
        }

        .left,
        .right {
            position: absolute;
            top: 50%;
            @include translateY(-50%);
        }

        .left {
            left: 15px;

            &.opt {
                left: 5px;
            }
        }

        .right {
            right: 15px;

            &.opt{
                right: 5px;
            }
        }
    }

    .dropmenu {
        position: fixed;
        right: 7px;
        top: 57px;
        border-radius: 4px;
        background-color: #4F4F54;
        z-index: 100;
        text-align: center;

        &:before {
            content: '';
            display: inline-block;
            @include triangle(top, 8px, #4F4F54);
            position: absolute;
            top: -8px;
            right: 8px;
        }

        .menu-item {
            padding: 8px 15px;
            border-top: 1px solid #646467;
            color: #fff;
            font-size: 14px;
            line-height: 1;
            margin: 0 10px;

            &:first-child {
                border-top: none;
            }
        }
    }

    .mask {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 99;
        background-color: rgba(0,0,0,0);
    }
</style>

<template>
    <template v-if="pageType === 'record'">
        <header class="header">
            <span class="title">{{ title || 'WEB-IM' }}</span>
            <a class="opt right plus" href="./chat" @click.prevent="onClickPlus">
                <i class="icon icon-plus"></i>
            </a>
        </header>
        <div class="dropmenu" v-show="open">
            <ul class="menus">
                <li class="menu-item" v-link="'friend'">
                    <a>新建聊天</a>
                </li>
                <li class="menu-item" @click='onClickAddFri'>
                    <a>添加朋友</a>
                </li>
                <li class="menu-item" @click='onClickLogout'>
                    <a>退出</a>
                </li>
            </ul>
        </div>
        <div class="mask" @click="onClickMask" v-show="open"></div>
        <m-modal :show.sync="modal.show" title="添加朋友" @modal-sure="onModalSure" :popup-tip.sync="modal.popupTip">
            <div class="field-row">
                <input class="form-control" v-model="modal.friendName" v-focus="modal.show" type="text" placeholder="输入用户名称">
            </div>
        </m-modal>
    </template>

    <template v-if="pageType === 'friend'">
        <header class="header">
            <a class="opt left cancel" @click='onClickCancel'>
                取消
            </a>
            <span class="title">{{ title || 'WEB-IM' }}</span>
        </header>
    </template>

    <template v-if="pageType === 'chat'">
        <header class="header">
            <a class="opt left back" v-link="refer">
                <i class="icon icon-back"></i>返回
            </a>
            <span class="title">{{ title || 'WEB-IM' }}</span>
        </header>
    </template>
</template>

<script>
    var Vue = require('vue');
    var auth = require('../auth');
    var friendStore = require('../databases/friend');

    module.exports = {
        name: 'Header',
        props: {
            title: String,
            pageType: String,
            refer: String
        },
        components: {
            'm-modal': require('./modal.vue')
        },
        data: function() {
            return {
                open: false,

                modal: {
                    show: false,
                    friendName: '',
                    popupTip: ''
                }
            }
        },
        methods: {
            onClickPlus: function() {
                this.open = !this.open;
            },
            onClickLogout: function() {
                auth.logout();
                this.$route.router.go('./login');
            },
            onClickMask: function() {
                this.open = false;
            },
            onClickCancel: function() {
                this.$route.router.go(this.refer);
            },
            onClickAddFri: function() {
                this.open = false;
                this.modal.show = true;
            },
            onModalSure: function() {
                if(!this.modal.friendName) 
                    return;
                var p = friendStore.createFriend(auth.user.userId, this.modal.friendName);
                p
                    .then((resp) => this.$route.router.go('./friend'))
                    .catch((resp) => {
                        this.modal.popupTip = resp.message;
                    });
            }
        },
        detached: function() {
            this.open = false;
            this.modal.show = false;
        },
        
        // 自定义指令提供一种机制将数据的变化映射为 DOM 行为。
        directives: {
            focus: function(value) {
                if(value) {
                    Vue.nextTick(()=>{
                        this.el.focus();
                    });
                }
            }
        }
    };
</script>

