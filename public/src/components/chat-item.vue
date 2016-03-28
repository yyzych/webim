<style lang="sass">
    @import '../statics/scss/variable';
    @import '../statics/scss/mixin';

    .gallery {
        .item {
            @include clearfix;

            padding: 10px 0;

            .avatar {
                height: 40px;
                width: 40px;
                float: left;
                margin-right: 10px;
            }

            .content {
                overflow: hidden;
                padding-right: 40px;

                .inner {
                    float: left;
                    background-color: #fff;
                    border: 1px solid #d1d1d1;
                    padding: 12px;
                    border-radius: 4px;
                }
            }
        }

        .item.mine {
            .avatar {
                float: right;
                margin-left: 10px;
                margin-right: 0;
            }

            .content {
                padding-left: 40px;
                padding-right: 0;

                .inner {
                    float: right;
                    background-color: #a0e75a;

                }
            }
        }
    }

</style>

<template>
    <div class="item" :class="{'mine': one.sender === author._id}" :messageid="one._id">
        <a>
            <img :src="one.sender === author._id ? author.avatar : relate.avatar" class="avatar">
        </a>
        <div class="content">
            <div class="inner">
                <p>{{ one.content }}</p>
            </div>
        </div>
    </div>
</template>

<script>
    module.exports = {
        props: ['one', 'author', 'relate']
    };
</script>

