<template>
    <div class="apply-form-container">
        <bk-divider align="center">申请奖项</bk-divider>
        <bk-form :label-width="140">
            <bk-form-item label="申请人">
                <bk-select style="width:80%"
                    multiple
                    display-tag
                    v-model="applyForm['application_users']"
                    placeholder="请选择申请人"
                    ext-cls="w-90"
                >
                    <bk-option v-for="user in groupUsers"
                        :key="user.username"
                        :id="user.username"
                        :name="user.displayName">
                    </bk-option>
                </bk-select>
            </bk-form-item>
            <bk-form-item label="申请理由">
                <bk-input v-model="applyForm['application_reason']"
                    placeholder="申请理由"
                    ext-cls="w-90"
                ></bk-input>
            </bk-form-item>
            <bk-form-item label="申请材料">
                <Uploader v-model="applyForm.application_attachments"
                    ext-cls="w-90"
                ></Uploader>
            </bk-form-item>
        </bk-form>
    </div>
</template>
<script>
    import { mapActions, mapGetters } from 'vuex'

    export default {
        name: 'apply-form',
        components: {
            Uploader: () => import('@/components/uploader')
        },
        data () {
            return {
                applyForm: {
                    /**
                     * 申请理由
                     * */
                    application_reason: '',
                    /**
                     * 申请人列表
                     * */
                    application_users: ['3234853521Q'],
                    /**
                     * 申请附件列表
                     * */
                    application_attachments: []
                }

            }
        },
        computed: {
            ...mapGetters('groupModule', [
                'groupUsers'
            ])
        },
        mounted () {
            this.handleInit()
        },
        methods: {
            ...mapActions('groupModule', [
                'getUserManageListUsers'
            ]),
            /**
             * 初始化函数
             * */
            handleInit () {
                this.getUserManageListUsers()
            },
            /**
             * 部分需要手动判断的参数
             * */
            checkEmptyForm (awardForm) {
                if (awardForm.application_users.length < 1) {
                    this.messageWarn('请选择申请人')
                    return false
                }
                return true
            },
            handleCancel () {
                /**
                 * TODO: 取消前的确认
                 * */
                this.$emit('cancel')
            },
            handleSave (awardForm) {
                if (this.checkEmptyForm(awardForm)) {
                    this.$emit('save', awardForm)
                }
            },
            handleConfirm (awardForm) {
                if (this.checkEmptyForm(awardForm)) {
                    this.$emit('confirm', awardForm)
                }
            },
            /**
             *  获取这个表单的信息
             * */
            getFields () {
                const awardForm = this.applyForm
                if (this.checkEmptyForm(awardForm)) {
                    return JSON.parse(JSON.stringify(awardForm))
                }
                return null
            }
        }
    }
</script>
<style scoped>
    /deep/ .w-90 {
        width: 90% !important;
    }
</style>
