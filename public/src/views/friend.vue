<template>
    <div id="phonebook">
        <m-header :title="'选择联系人'" :page-type="'friend'" refer="index"></m-header>
        <main class="main">
            <div class="friend-list">
                <ul class="friends">
                    <m-item v-for="one in friends" :one="one" :index="$index"></m-item>
                </ul>
            </div>
        </main>
    </div>
</template>

<style>
    
</style>

<script>
    var auth = require('../auth');
    var friendStore = require('../databases/friend');
    var HeaderView = require('../components/header.vue');
    var FriendItemView = require('../components/friend-item.vue');


    module.exports = {
        name: 'FriendView',
        components: {
            'm-item': FriendItemView,
            'm-header': HeaderView
        },
        data: function() {
            return {
                friends: []
            };
        },
        route: {
            canActivate: function(transition) {
                if(auth.user.authenticated) {
                    return true;
                }else {
                    transition.redirect('./login')
                    return false;
                }
            },
            data: function(transition) {
                return {
                    friends: friendStore.fetch(auth.user.userId)
                }
            }
        }
    };
</script>