<template>
    <div id="record">
        <m-header :page-type="'record'" title="最近联系人"></m-header>
        <main class="main">
            <div class="contacter-list">
                <ul class="records">
                    <m-item v-for="one in records" :one="one" :index="$index" @deleterecord="onDeleteRecord"></m-item>
                </ul>
            </div>
        </main>        
    </div>
</template>

<script>
    var auth = require('../auth');
    var socket = require('../socket').socket;
    var recordStore = require('../databases/record');
    var userStore = require('../databases/user');
    var HeaderView = require('../components/header.vue');
    var RecordItemView = require('../components/record-item.vue');


    module.exports = {
        name: 'RecordView',
        components: {
            'm-header': HeaderView,
            'm-item': RecordItemView
        },
        data: function() {
            return {
                records: []
            }
        },
        route: {
            canActivate: function(transition) {
                if(auth.user.authenticated) {
                    // 这里一定要返回值或者调用next, redirect, abort之一
                    // http://vuejs.github.io/vue-router/zh-cn/pipeline/hooks.html
                    return true; // 同步 resolve
                }else {
                    transition.redirect('./login');
                    return false;
                }
            },
            // 用于加载和设置当前组件的数据。
            // data在每次路由变动时都会被调用
            data: function(transition) {
                // return recordStore.fetch('1001').then(function(list) {
                //     // vue应该是在返回的promise上调用了then，将前面传回来的数据那去设置组件的值
                //     return {
                //         records: list
                //     }
                // });
                // or
                // recordStore.fetch('1001').then(function(list) {
                //     transition.next({records: list});
                // });
                // or
                return {
                    records: recordStore.fetch(auth.user.userId)
                };
            }
        },
        methods: {
            onCreateRecord: function(resp) {
                var attr = resp.data.attr;
                var p = recordStore.fetch(attr.receiver, attr.sender);
                p.then((records) => {
                    var record = records[0];
                    // 如果record中没有unread这个属性，在后续直接赋值(item.unread = true;)修改这个属性，他不会被监听
                    record.unread = true;
                    record && this.records.push(record);
                });
            },
            onReceiveMessage: function(resp) {
                this.records.forEach(function(item) {
                    if(item.messageId === resp.data.messageId) {
                        item.unread = true;
                        item.status = 1;
                        item.recent = resp.data.attr;
                    }
                });
            },
            onDeleteRecord: function(author, contacter, index) {
                var self = this;
                var p = userStore.deleteRecord(author, contacter);
                p.then(function(isOk) {
                    if(isOk) {
                        var record = self.records[index];
                        // self.records.$remove(record);
                        record.status = 0;
                        self.records.$set(index, record);
                    }
                });
            }
        },
        // 因为使用keep-alive所以，created和destroyed只会执行一次
        attached: function() {
            socket.on('message', this.onReceiveMessage.bind(this));
            socket.on('record', this.onCreateRecord.bind(this));
        },
        detached: function() {
            socket.removeListener('message');
            socket.removeListener('record');
        }
    };

</script>