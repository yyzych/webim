<style lang="sass">
    @import '../statics/scss/variable';
    @import '../statics/scss/mixin';

    .alert {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 99;
        background-color: rgba(0,0,0,0);
        text-align: center;

        .inner {
            text-align: center;
            background-color: rgba(49, 49, 49, 0.8);
            color: #fff;
            border-radius: 6px;
            font-size: 14px;
            padding: 18px 25px;
            word-break: break-all;
            display: inline-block;
            margin: 0 auto;
            margin-top: 65%;
        }
    }
</style>

<template>
    <div class="alert" transition="fade" v-show="show">
        <div class="inner">
            {{content}}
        </div>
    </div>
</template>

<script>
    // 最后暴露出去的只是组织好的配置对象，而不是Vue实例或着继承Vue的类
    module.exports = {
        replace: true,
        props: ['content', 'show']
    };
</script>