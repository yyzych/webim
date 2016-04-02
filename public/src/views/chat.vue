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
            <div class="gallery">
                <div class="chat-record-list">
                    <m-item v-for="one in messages.list" :one="one" :author="author" :relate="relate"></m-item>
                </div>
            </div>
            <m-sendbox @sendmsg="onSendMessage"></m-sendbox>
        </div>
    </div>
</template>

<script>
    var auth = require('../auth');
    var socket = require('../socket').socket;
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
                    socket.emit('message', attr, this.messages.messageId);
                }else {
                    socket.emit('record', attr);
                }
            },
            onCreateRecord: function(resp) {
                this.messages.messageId = resp.data.messageId;
                this.messages.list.push(resp.data.attr);
            },
            onReceiveMessage: function(resp) {
                if(this.messages.messageId !== resp.data.messageId) {
                    return;
                }
                this.messages.list.push(resp.data.attr);
            }
        },
        created: function() {
            // 会先于route.data执行
            socket.on('message', this.onReceiveMessage.bind(this));
            socket.on('record', this.onCreateRecord.bind(this));
        },
        destroyed: function() {
            socket.removeListener('message');
            socket.removeListener('record');
        }
    };
</script>

