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
        <m-header title="Someone" page-type="chat" refer="/friend"></m-header>
        <div class="main">
            <div class="gallery">
                <div class="chat-record-list">
                    <m-item v-for="one in messages" :one="one" :author="author" :relate="relate"></m-item>
                </div>
            </div>
            <m-sendbox @sendmsg="onSendMessage"></m-sendbox>
        </div>
    </div>
</template>

<script>
    var auth = require('../auth');
    var userStore = require('../databases/user');
    var recordStore = require('../databases/record');
    var io = require('socket.io-client');

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
                messages: [],
                socket: null
            };
        },
        route: {
            canActivate: function(transition) {
                if(auth.user.authenticated) {
                    return true;
                }else {
                    transition.redirect('./login');
                    return false;
                }
            },
            data: function(transition) {
                var author = auth.user.userId,
                    relate = this.$route.params.relate;
                return {
                    author: userStore.fetch(author),
                    relate: userStore.fetch(relate),
                    messages: recordStore.getMessageList(author, relate)
                }
            }
        },
        methods: {
            getRecordId: function(author, relate) {
                if(this.recordId) 
                    return this.recordId;

                var record = recordStore.getRecord(author, relate);
                if(!record || !record._id) {
                    this.recordId = recordStore.createRecord(author, relate);
                }else {
                    this.recordId = record._id;
                }

                return this.recordId;
            },
            onSendMessage: function(msg) {
                var author = this.author._id,
                    relate = this.relate._id;

                var recordId = this.getRecordId(author, relate);

                var attr = {
                    sender: author,
                    receiver: relate,
                    content: msg
                };

                recordStore.createMessage(recordId, attr);

                this.messages.push(attr);

                this.socket.emit('message', attr);
            }
        },
        created: function() {
            // 会先于route.data执行
            this.socket = io();
            this.socket.on('message', function(data) {
                console.log(data);
            });
        }
    };
</script>

