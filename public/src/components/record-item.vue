<style lang="sass">
    @import '../statics/scss/variable';
    @import '../statics/scss/mixin';
    
    .contacter-list {
        .item {
            $item-height: 65px;

            border-bottom: 1px solid #d9d9d9;
            height: $item-height;
            box-sizing: border-box;
            color: $gray-softer;
            overflow: hidden;
            position: relative;

            .operate {
                position: absolute;
                right: 0;
                top: 0;
                height: $item-height;
                line-height: $item-height;
                width: 48px;
                color: #fff;

                .delete {
                    background: red;
                    display: block;
                    text-align: center;
                }
            }

            .profile {
                padding: 10px;
                background-color: #fff;
                position: relative;
                z-index: 9;
                @extend %clearfix;
            }

            .ellipsis {
                @include ellipsis(65%);
                display: inline-block;
            }

            .name {
                color: $gray;
                font-size: 18px;
            }

            .time {
                float: right;
            }

            .avatar {
                height: 45px;
                width: 45px;
                border-radius: 4px;
                float: left;
                margin-right: 10px;
            }
        }

        .item.unread {
            .profile:before {
                content: '';
                position: absolute;
                top: 4px;
                left: 47px;
                border-radius: 50%;
                background-color: red;
                color: #fff;
                height: 14px;
                width: 14px;
                text-align: center;
            }
        }
    }
</style>

<template>
    <li class="item" 
        data-href="{{ one._id }}" 
        v-bind:class="{'unread': one.unread}" 
        v-on:click="onClickContacter">
        <div class="profile">
            <img class="avatar" v-bind:src="one.avatar">
            <div class="top">
                <span class="name ellipsis">{{ one.name }}</span>
                <span class="time">{{ one.time }}</span>
            </div>
            <div class="btm">
                <span class="recent ellipsis">{{ one.recent }}</span>
            </div>
        </div>
        <div class="operate">
            <a class="delete" href="">删除</a>
        </div>
    </li>
</template>

<script>
    module.exports = {
        name: 'RecorditemView',
        props: {
            one: Object,
            index: Number
        },
        computed: {

        },
        methods: {
            onClickContacter: function(e) {
                
            }
        }
    };
</script>