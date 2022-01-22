<template>
    <div class="detail-container">
        <bk-sideslider :is-show.sync="isShow"
            :width="800"
            :title="applyForm['award_name'] || '未定义奖项'"
            @hidden="hidden"
        >
            <div v-if="isShow"
                slot="content"
                style="height: 80vh"
            >
                <!-- 编辑部分 -->
                <ApplyForm v-if="isShowApplyForm"
                    ref="applyForm"
                ></ApplyForm>
                <!-- /编辑部分 -->

                <!-- 详情部分 -->
                <Detail :award-form="applyForm"></Detail>
                <!-- /详情部分 -->
            </div>
            <div class="tc w100" style="width: 100%" slot="footer">
                <!-- 用于申请奖项的按钮 -->
                <div v-if="isShowApplyForm"
                    class="button-item"
                >
                    <bk-button theme="warning"
                        class="mr10"
                        @click="handleCancel()"
                        ext-cls="button-item"
                    >
                        <bk-icon type="minus-circle" />
                        <span>取消</span>
                    </bk-button>
                    <bk-button theme="primary"
                        class="mr10"
                        @click="handleToSaveApplyForm($refs['applyForm'])"
                        ext-cls="button-item"
                    >
                        <bk-icon type="save" />
                        <span>保存草稿</span>
                    </bk-button>
                    <bk-button theme="success"
                        class="mr10"
                        @click="handleToSendApplyForm($refs['applyForm'])"
                        ext-cls="button-item"
                    >
                        <bk-icon type="check-circle" />
                        <span>发起申请</span>
                    </bk-button>
                </div>
                <!-- /用于申请奖项的按钮 -->

                <!-- 用于跳转申请奖项的按钮 -->
                <div v-else
                    class="tc mr15 mt15"
                >
                    <bk-button theme="primary"
                        @click="formType = 'apply'"
                    >
                        <span class="m5">前往申请</span>
                        <bk-icon type="arrows-right-circle" />
                    </bk-button>
                </div>
                <!-- /用于跳转申请奖项的按钮 -->
            </div>
        </bk-sideslider>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import { isDef } from './utils'

    export default {
        name: 'detail',
        components: {
            Detail: () => import('./DetailInfo'),
            ApplyForm: () => import('./ApplyForm')
        },
        props: {
            awardInfo: {
                type: Object,
                default: () => ({})
            },
            type: {
                type: String,
                default: () => null
            }
        },
        data () {
            return {
                applyForm: {},
                formType: this.type || 'detail',
                isShow: false
            }
        },
        computed: {
            ...mapGetters(['user']),
            isShowApplyForm () {
                return ['apply', 'edit'].includes(this.formType)
            },
            /**
             * 主要用于拼接一些比如 id 的信息 此类默认信息
             * */
            defaultInfo () {
                return {
                    award_apply_record_id: this.awardForm.award_apply_record_id,
                    award_id: this.awardForm.id
                }
            }
        },
        methods: {
            /**
             * 保存草稿
             * */
            handleToSaveApplyForm (applyForm) {
                this.handleToDealWidthApply(0, applyForm).then(res => {
                    console.log('res', res)
                })
            },
            /**
             * 发起申请
             * */
            handleToSendApplyForm (applyForm) {
                this.handleToDealWidthApply(1, applyForm).then(res => {
                    console.log('res', res)
                })
            },
            /**
             * 处理奖项的统一入口
             * */
            handleToDealWidthApply (operationCode, applyForm) {
                const defaultInfo = this.defaultInfo
                const params = applyForm.getFields()
                console.log('params', params)
                if (!params) {
                    return
                }
                return this.$http.post('deal_with_an_apply/', {
                    operation_code: operationCode,
                    ...applyForm,
                    ...defaultInfo
                })
            },
            /**
             * 取消申请
             * */
            handleCancel () {
                this.hidden()
            },
            show (options) {
                if (typeof options.cb === 'function') {
                    options.cb()
                }
                this.applyForm = Object.assign({ ...options })
                if (!isDef(this.applyForm.id)) {
                    return this.$bkMessage({ theme: 'warning', message: '出错啦' })
                }
                this.isShow = true
            },
            hidden () {
                this.formType = this.type
                this.isShow = false
            }
        }
    }
</script>
<style scoped>
    .button-item {
        display: flex;
        align-items: center;justify-content: center;
    }
</style>
