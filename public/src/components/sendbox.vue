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
                        <td class="operate-item plus">
                            <a class="btn upload-img">
                                <i class="icon icon-plus"></i>
                                <input type="file" name="" id="" @change="onChangeFileInput">
                            </a>
                        </td>
                        <td class="">
                            <input v-model="input" class="content" type="text" @keyup.enter="onEnterInput">
                        </td>
                        <td class="operate-item face">
                            <a class="btn face">
                                <i class="icon icon-face"></i>
                            </a>
                        </td>
                        <td class="operate-item send">
                            <a class="btn" @click="onClickSend">
                                <i class="icon icon-send"></i>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="extra hide"></div>
    </div>
</template>

<script>
    var globalStore = require('../databases/global');

    module.exports = {
        data: function() {
            return {
                input: ''
            };
        },
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

                this.$dispatch('sendmsg', escape(this.input));
                this.input = '';
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