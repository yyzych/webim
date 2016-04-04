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
                display: block;
                padding: 10px;
                background-color: #fff;
                position: relative;
                z-index: 9;
                left: 0;

                @include transition(left .4s ease);
                @extend %clearfix;

                &.swipe-left {
                    left: -48px;
                }
            }

            .ellipsis {
                @include ellipsis(50%);
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
    <li class="item" :class="{'unread': one.unread}" v-if="one.status != 0">
        <a class="profile"
            v-el:profile
            v-link="{name: 'chat', params: {relate: one.contacter}}"
            v-touch:swipe="onSwipeProfile">
            <img class="avatar" :src="one.contacterInfo.avatar">
            <div class="top">
                <span class="name ellipsis">{{ one.contacterInfo.username }}</span>
                <span class="time">{{ new Date(one.recent.date).toLocaleDateString() }}</span>
            </div>
            <div class="btm">
                <span class="recent ellipsis">{{ one.recent.content }}</span>
            </div>
        </a>
        <div class="operate">
            <a class="delete" @click="onClickDelRecord">删除</a>
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
        methods: {
            onSwipeProfile: function(e) {
                if(e.direction == 2) {
                    this.$els.profile.classList.add('swipe-left');
                }else if(e.direction == 4) {
                    this.$els.profile.classList.remove('swipe-left');
                }
            },
            onClickDelRecord: function(e) {
                this.$dispatch('deleterecord', this.one.author, this.one.contacter, this.index);
            }
        }
    };
</script>