<style lang="sass">
    @import '../statics/scss/variable';
    @import '../statics/scss/mixin';

    .collapse-transition {
        transition: all .4s ease;
        overflow: hidden;
        height: 14px;
        margin: 10px 0 5px;
    }

    .collapse-enter,
    .collapse-leave {
        height: 0;
        margin: 0;
        opacity: 0;
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 99;
        background-color: rgba(0,0,0,0.5);
        text-align: center;

        .inner {
            width: 65%;
            text-align: center;
            background-color: rgb(255, 255, 255);
            color: #666;
            border-radius: 4px;
            font-size: 14px;
            padding: 15px;
            position: absolute;
            left: 50%;
            top: 35%;
            @include translate(-50%, -50%);
        }

        .form {
            padding: 0;

            .hd {
                font-size: 16px;
            }

            .bd {
                margin: 15px 0;
            }

            .field-row {
                margin: 10px 0;
            }

            .form-control {
                padding: 6px;
                border: 1px solid #eee;
                border-radius: 3px;
                outline: none;
                width: 100%;
                box-sizing: border-box;
            }

            .popup-tip {
                font-size: 12px;
                color: #E6A00F;
            }
        }
    }

</style>

<template>
    <div class="modal" transition="fade" v-show="show" @click.self="onClickBg">
        <div class="inner">
            <div class="form">
                <div class="hd">
                    {{ title }}
                </div>
                <div class="popup-tip" transition="collapse" v-show="!!popupTip">{{popupTip}}</div>
                <div class="bd">
                    <slot></slot>
                </div>
                <div class="fot">
                    <button class="btn btn-primary sure" @click="onClickSure">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    module.exports = {
        props: ['show', 'title', 'popupTip'],
        methods: {
            onClickBg: function() {
                this.show = false;
            },
            onClickSure: function() {
                this.$dispatch('modal-sure');
            }
        },
        watch: {
            popupTip: function(value) {
                if(this.popupTipTimer) {
                    clearTimeout(this.popupTipTimer);
                }
                this.popupTipTimer = setTimeout(()=>{
                    this.popupTip = '';
                }, 3500);
            }
        }
    };
</script>