<template>
    <div id="record">
        <m-header :page-type="'record'" title="最近联系人"></m-header>
        <main class="main">
            <div class="contacter-list">
                <ul class="records">
                    <m-item v-for="one in records" :one="one" :index="$index"></m-item>
                </ul>
            </div>
        </main>        
    </div>
</template>

<script>
    var auth = require('../auth');
    var socket = require('../socket').socket;
    var recordStore = require('../databases/record');
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
        }
    };

</script>