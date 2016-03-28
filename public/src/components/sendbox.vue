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
                            <a class="btn">
                                <i class="icon icon-plus"></i>
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

                this.$dispatch('sendmsg', this.input);
                this.input = '';
            }
        }
    }
</script>