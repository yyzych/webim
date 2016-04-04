<style lang="sass">
    #chat {
        .main {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            padding-top: 44px;
            background-color: #ebebeb;
        }

        .gallery {
            overflow-y: auto;
            -webkit-overflow-scrolling : touch;  
            height: 100%;

            .chat-record-list {
                padding: 15px 10px 65px;
            }
            
        }
    }

</style>
    
<template>
    <div id="chat">
        <m-header title="Someone" page-type="chat" :refer="refer" :title="relate.username"></m-header>
        <div class="main">
            <div class="gallery" v-el:gallery>
                <div class="chat-record-list">
                    <m-item v-for="one in messages.list" :one="one" :author="author" :relate="relate"></m-item>
                </div>
            </div>
            <m-sendbox @sendmsg="onSendMessage"></m-sendbox>
        </div>
    </div>
</template>

<script>
    var Vue = require('vue');
    var auth = require('../auth');
    var socketHepler = require('../socket');
    var userStore = require('../databases/user');
    var recordStore = require('../databases/record');

    module.exports = {
        name: 'ChatView',
        components: {
            'm-header': require('../components/header.vue'),
            'm-item': require('../components/chat-item.vue'),
            'm-sendbox': require('../components/sendbox.vue')
        },
        data: function() {
            return {
                author: {},
                relate: {},
                messages: {
                    messageId: '',
                    list: []
                },
                
                refer: ''
            };
        },
        route: {
            canActivate: function(transition) {
                if(auth.user.authenticated) {
                    return true;
                }else {
                    transition.redirect('/login');
                    return false;
                }
            },
            data: function(transition) {
                // data在每次路由变动时都会被调用
                var author = auth.user.userId,
                    relate = this.$route.params.relate;

                return {
                    refer: transition.from.path || '/index', // 设置回退按钮的URL

                    author: userStore.fetch(author),
                    relate: userStore.fetch(relate),
                    messages: recordStore.getMessageList(author, relate)
                }
            }
        },
        watch: {
            '$loadingRouteData': function(val, oldval) {
                // $loadingRouteData: true - 正在加载 false － 完成加载
                if(!val) {
                    setTimeout(function() {
                        this.toChatBtm();
                    }.bind(this), 420); // 直接调用了this.toChatBtm没有效果，是因为从其他组件切换进来有过渡效果，这是为什么？？！
                }
            }
        },
        methods: {
            onSendMessage: function(msg) {
                var author = this.author._id,
                    relate = this.relate._id;

                var attr = {
                    sender: author,
                    receiver: relate,
                    content: msg,
                    date: Date.now()
                };

                if(this.messages.messageId) {
                    socketHepler.socket.emit('message', attr, this.messages.messageId);
                }else {
                    socketHepler.socket.emit('record', attr);
                }
            },
            onCreateRecord: function(resp) {
                this.messages.messageId = resp.data.messageId;
                this.messages.list.push(resp.data.attr);

                this.toChatBtm();
            },
            onReceiveMessage: function(resp) {
                if(this.messages.messageId !== resp.data.messageId) {
                    return;
                }
                this.messages.list.push(resp.data.attr);

                this.toChatBtm();
            },
            toChatBtm: function() {
                // 等待下一帧渲染界面时再更新界面
                // 因为新的消息还没有渲染，现在更新的话scrollHeight这些没有变化
                Vue.nextTick(()=>{
                    var el = this.$els.gallery;
                    el.scrollTop = el.scrollHeight - el.clientHeight;
                });
            }
        },
        attached: function() {
            // 会先于route.data执行
            socketHepler.socket.on('message', this.onReceiveMessage.bind(this));
            socketHepler.socket.on('record', this.onCreateRecord.bind(this));

            var author = auth.user.userId,
                relate = this.$route.params.relate;

            socketHepler.enter(author, relate);
        },
        detached: function() {
            socketHepler.socket.removeListener('message');
            socketHepler.socket.removeListener('record');

            socketHepler.leave(this.author._id, this.relate._id);
        }
    };
</script>

