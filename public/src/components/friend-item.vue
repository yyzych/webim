<style lang="sass">
    @import '../statics/scss/variable';
    @import '../statics/scss/mixin';
    
    .friend-list {
        .item {
            $item-height: 44px;

            border-bottom: 1px solid #d9d9d9;
            line-height: $item-height;
            box-sizing: border-box;
            color: $gray-softer;
            overflow: hidden;
            position: relative;

            .avatar {
                height: 30px;
                width: 30px;
                margin-right: 10px;
            }

            .profile {
                padding: 0 10px;
                background-color: #fff;
                position: relative;
                z-index: 9;
                @extend %clearfix;
            }

            .operate {
                position: absolute;
                right: 0;
                top: 0;
                height: $item-height;
                line-height: $item-height;
                width: 48px;
                color: #fff;

                .remark {
                    background: #B9B9B9;
                    display: block;
                    text-align: center;
                }
            }
        }
    }
</style>

<template>
    <li class="item" 
        data-href="{{ one.relate }}">
        <div class="profile" v-link="{name: 'chat', params: {relate: one.relate}}">
            <img class="avatar" :src="one.avatar">
            <span class="remark">{{ one.remark }}</span>
        </div>
        <div class="operate">
            <a class="remark" href="">备注</a>
        </div>
    </li>
</template>

<script>
    module.exports = {
        name: 'FriendItemView',
        props: {
            one: Object,
            index: Number
        }
    };
</script>