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

                img {
                    max-width: 180px;
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
                <p>
                    {{{ finalContent }}}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
    var qqface = {
        '微笑': 'qqface0',
        '撇嘴': 'qqface1',
        '色': 'qqface2',
        '发呆': 'qqface3',
        '得意': 'qqface4',
        '流泪': 'qqface5',
        '害羞': 'qqface6',
        '闭嘴': 'qqface7',
        '睡': 'qqface8',
        '大哭': 'qqface9',
        '尴尬': 'qqface10',
        '发怒': 'qqface11',
        '调皮': 'qqface12',
        '呲牙': 'qqface13',
        '惊讶': 'qqface14',
        '难过': 'qqface15',
        '酷': 'qqface16',
        '冷汗': 'qqface17',
        '抓狂': 'qqface18',
        '吐': 'qqface19',
        '偷笑': 'qqface20',
        '愉快': 'qqface21',
        '白眼': 'qqface22',
        '傲慢': 'qqface23',
        '饥饿': 'qqface24',
        '困': 'qqface25'
    };

    module.exports = {
        props: ['one', 'author', 'relate'],
        computed: {
            finalContent: function() {
                var res = this.one.content.replace(/\[(.+?)\]/g, function(all, g1) {
                    var css = qqface[g1];
                    if(css) {
                        return '<span title="'+g1+'" class="qqface '+css+'"></span>';
                    }else {
                        return g1;
                    }
                });
                return res;
            }
        }
    };
</script>

