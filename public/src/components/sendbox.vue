<style lang="sass">
    @import '../statics/scss/variable';
    @import '../statics/scss/mixin';


    #chat {
        .input {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            border-top: 1px solid #d9d9d9;
            border-bottom: 1px solid #d9d9d9;
            background-color: #f5f5f7;

            table {
                width: 100%;

                td {
                    padding: 8px 5px;
                }

                .btn {
                    display: inline-block;
                    border: 1px solid #d9d9d9;
                    border-radius: 50%;
                    padding: 4px;
                    min-width: 0;
                }

                .btn.upload-img {
                    position: relative;

                    input[type=file] {
                        position: absolute;
                        height: 100%;
                        width: 100%;
                        left: 0;
                        top: 0;
                        z-index: 2;
                        @include opacity(0);
                    }
                }

                .icon {
                    background-size: contain;
                }

                .icon-plus:before, .icon-plus:after {
                    background-color: #7f8389;
                }

                .icon-sound {
                    background-image: url($img-url-root + '/sound.png');
                    background-position-x: 1px;
                }

                .icon-send {
                    background-image: url($img-url-root + '/sound.png');
                    background-position: 2px 0;
                    @include rotate(-90deg);

                }

                .icon-face {
                    background-image: url($img-url-root + '/face.png');
                }

                .operate-item {
                    width: 1px;
                }

                .content {
                    border: 1px solid #d9d9d9;
                    border-radius: 4px;
                    width: 100%;
                    height: 32px;
                    outline: none;
                    padding: 5px;
                    box-sizing: border-box;
                    -webkit-appearance:none;
                    line-height: 20px;
                }

            }
        }

        .extra {
            height: 0;
            overflow: hidden;
            transition: all .25s;

            &.faceOpen {
                height: 100px;
            }

            .face-panel {
                a {
                    text-indent: -9999px;
                    float: left;
                    font-size: 0;
                }
            }
        }
    }

</style>

<template>
    <div class="input">
        <div class="basic">
            <table>
                <tbody>
                    <tr>
                        <td class="operate-item">
                            <a class="btn upload-img">
                                <i class="icon icon-plus"></i>
                                <input type="file" name="" id="" @change="onChangeFileInput">
                            </a>
                        </td>
                        <td class="">
                            <input v-model="input" class="content" type="text" @keyup.enter="onEnterInput">
                        </td>
                        <td class="operate-item">
                            <a class="btn face" @click="onClickShowFacePanel">
                                <i class="icon icon-face"></i>
                            </a>
                        </td>
                        <td class="operate-item">
                            <a class="btn" @click="onClickSend">
                                <i class="icon icon-send"></i>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="extra" :class="{faceOpen: openExtraPanel}">
            <div class="face-panel" @click="onClickQQFace">
                <a title="微笑" type="qq" class="qqface qqface0">微笑</a>
                <a title="撇嘴" type="qq" class="qqface qqface1">撇嘴</a>
                <a title="色" type="qq" class="qqface qqface2">色</a>
                <a title="发呆" type="qq" class="qqface qqface3">发呆</a>
                <a title="得意" type="qq" class="qqface qqface4">得意</a>
                <a title="流泪" type="qq" class="qqface qqface5">流泪</a>
                <a title="害羞" type="qq" class="qqface qqface6">害羞</a>
                <a title="闭嘴" type="qq" class="qqface qqface7">闭嘴</a>
                <a title="睡" type="qq" class="qqface qqface8">睡</a>
                <a title="大哭" type="qq" class="qqface qqface9">大哭</a>
                <a title="尴尬" type="qq" class="qqface qqface10">尴尬</a>
                <a title="发怒" type="qq" class="qqface qqface11">发怒</a>
                <a title="调皮" type="qq" class="qqface qqface12">调皮</a>
                <a title="呲牙" type="qq" class="qqface qqface13">呲牙</a>
                <a title="惊讶" type="qq" class="qqface qqface14">惊讶</a>
                <a title="难过" type="qq" class="qqface qqface15">难过</a>
                <a title="酷" type="qq" class="qqface qqface16">酷</a>
                <a title="冷汗" type="qq" class="qqface qqface17">冷汗</a>
                <a title="抓狂" type="qq" class="qqface qqface18">抓狂</a>
                <a title="吐" type="qq" class="qqface qqface19">吐</a>
                <a title="偷笑" type="qq" class="qqface qqface20">偷笑</a>
                <a title="愉快" type="qq" class="qqface qqface21">愉快</a>
                <a title="白眼" type="qq" class="qqface qqface22">白眼</a>
                <a title="傲慢" type="qq" class="qqface qqface23">傲慢</a>
                <a title="饥饿" type="qq" class="qqface qqface24">饥饿</a>
                <a title="困" type="qq" class="qqface qqface25">困</a>
            </div>
        </div>
    </div>
</template>

<script>
    var globalStore = require('../databases/global');

    var escapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '`': '&#x60;'
    };

    // Functions for escaping and unescaping strings to/from HTML interpolation.
    var createEscaper = function(map) {
      var escaper = function(match) {
        return map[match];
      };
      // Regexes for identifying a key that needs to be escaped
      var source = '(?:' + Object.keys(map).join('|') + ')';
      var testRegexp = RegExp(source);
      var replaceRegexp = RegExp(source, 'g');
      return function(string) {
        string = string == null ? '' : '' + string;
        return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
      };
    };

    var _escape = createEscaper(escapeMap);

    module.exports = {
        data: function() {
            return {
                input: ''
            };
        },
        props: ['openExtraPanel'],
        methods: {
            onClickSend: function() {
                this.sendMsg();
            },
            onEnterInput: function() {
                this.sendMsg();
            },
            sendMsg: function() {
                if(!this.input.trim()) 
                    return;

                this.$dispatch('sendmsg', _escape(this.input)); // 浏览器提供的escape函数会把汉字也转义
                this.input = '';
            },
            onClickShowFacePanel: function(e) {
                // 双向绑定了openExtraPanel
                // 双向绑定虽然是数据的变化不确定（子，父组件都有可能改变），但这里的确是子，父组件都需要操作子组件的状态。比起事件方式，这个简单点吧
                this.openExtraPanel = !this.openExtraPanel;
                // this.$dispatch('toggleextra', 'facePanel', true);
            },
            onClickQQFace: function(e) {
                var tar = e.target;
                var txt = '['+tar.getAttribute('title')+']';
                this.input += txt;
            },
            onChangeFileInput: function(e) {
                var files = e.target.files;
                if(!files || files.length < 1) return;

                var self = this;
                var file = files[0];
                var filefilers = /^(image\/gif|image\/jpeg|image\/png)$/i;

                if(!filefilers.test(file.type)) {
                    alert('只支持.gif, .jpeg, .png');
                    return;
                }

                var p = globalStore.upload(file);

                p.then((resp) => {
                    if(resp.code == 0) {
                        var msg = '<img src="'+resp.data.imgPath+'">';
                        this.$dispatch('sendmsg', msg);            
                    }
                });
            }
        }
    }
</script>