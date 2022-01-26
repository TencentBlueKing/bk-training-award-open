<template>
    <div class="dialog-area-container">
        <bk-sideslider
            v-if="$slots.custom"
            :is-show.sync="visible"
            :quick-close="true"
            :width="600"
            :title="title"
            :before-close="handleClose"
        >
            <template slot="content" v-if="visible">
                <div class="pt10" style="height: 80vh;">
                    <slot name="custom"></slot>
                </div>
            </template>

            <div slot="footer" class="footer-panel">
                <div v-if="!$slots.footer">
                    <bk-button @click="$emit('confirm')" class="footer-button ok-button" theme="primary">确认</bk-button>
                    <bk-button @click="$emit('cancel')" class="footer-button cancel-button" theme="danger">取消</bk-button>
                </div>
                <div v-else>
                    <slot name="footer"></slot>
                </div>
            </div>
        </bk-sideslider>
    </div>
</template>
<script>
    export default {
        name: 'dialog-area',
        components: {},
        props: {
            options: {
                type: Object,
                default () {
                    return {
                        width: '70%',
                        headerPosition: 'left',
                        position: {
                            left: '50%',
                            top: '50%'
                        }
                    }
                }
            },
            title: {
                type: String,
                default () {
                    return '标题'
                }
            }
        },
        data () {
            return {
                visible: false,
                formData: {}
            }
        },
        mounted () {
            this.handleInit()
        },
        methods: {
            handleInit () {
            },
            show (options = {}) {
                if (options.data) {
                    this.formData = { ...options.data }
                }
                this.visible = true
            },
            hidden () {
                this.visible = false
            },
            handleInfo () {
                return new Promise((resolve, reject) => {
                    this.$bkInfo({
                        type: 'warning',
                        title: '退出将不会保留表单信息',
                        confirmFn: () => resolve(true),
                        cancelFn: () => resolve(false)
                    })
                })
            },
            triggerSaveStatus () {
                // TODO: 修改当前表单信息切换存储状态-> 如果有必要的话
            },
            async handleClose () {
                const confirmStatus = await this.handleInfo()
                return confirmStatus
            }
        }
    
    }
</script>
<style>
    @import "./index.css";
</style>
