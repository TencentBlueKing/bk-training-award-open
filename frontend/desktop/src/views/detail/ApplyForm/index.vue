<template>
    <div class="apply-form-container">
        <bk-divider align="center">申请奖项</bk-divider>
        <bk-form :label-width="140">
            <bk-form-item label="申请人">
                <select-search
                    :value.sync="applicationUsers"
                    placeholder="请选择申请人"
                    ext-cls="w-90"
                    :id-key="'id'"
                    type="user"
                ></select-search>
            </bk-form-item>
            <bk-form-item label="申请理由">
                <bk-input v-model="applyForm['application_reason']"
                    placeholder="请输入申请理由"
                    ext-cls="w-90"
                ></bk-input>
            </bk-form-item>
            <bk-form-item label="申请材料">
                <Uploader v-model="applyForm['application_attachments']"
                    ext-cls="w-90"
                    :limit="3"
                ></Uploader>
            </bk-form-item>
        </bk-form>
    </div>
</template>
<script>
    import { GROUP_USERS_KEYNAME } from '@/constants'

    export default {
        name: 'apply-form',
        components: {
            SelectSearch: () => import('@/components/select-search'),
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
                    application_users: {},
                    /**
                     * 申请附件列表
                     * */
                    application_attachments: []
                }

            }
        },
        computed: {
            groupUsers (self) {
                return self.$http.cache.get(GROUP_USERS_KEYNAME)
            },
            applicationUsers: {
                get (self) {
                    return Object.keys(self.applyForm.application_users || {})?.map(item => ~~item) ?? []
                },
                set (newValue) {
                    this.applyForm.application_users = this.groupUsers.filter(item => {
                        return newValue.includes(item.id)
                    }).reduce((memo, cur) => {
                        return {
                          ...memo,
                          [cur.id]: cur['display_name']
                        }
                    }, {})
                }
            }

        },
        created () {
            this.handleInit()
        },
        methods: {
            /**
             * 初始化函数
             * */
            handleInit () {
                this.handleSetDefaultInfo()
            },
            handleSetDefaultInfo () {
                console.log(this.$route.params)
                if (this.$route.params) {
                    this.applyForm = this.$route.params
                }
            },
            /**
             * 部分需要手动判断的参数
             * */
            checkEmptyForm (awardForm) {
                let message = ''
                console.log(Object.keys(awardForm['application_users']))
                if (!Object.keys(awardForm['application_users'])?.length) message = '请选择申请人'
                if (!awardForm['application_reason']?.length) message = '请输入申请理由'
                if (!awardForm['application_attachments']?.length) message = '请传入申请材料'
                if (message) {
                    this.messageWarn(message)
                    return
                }
                return true
            },
            handleCancel () {
                this.$emit('cancel')
            },
            handleSave (awardForm) {
                if (this.checkEmptyForm(awardForm)) {
                    this.$emit('save', awardForm)
                }
            },
            handleConfirm (awardForm) {
                if (this.checkEmptyForm(awardForm)) {
                    awardForm['application_attachments'] = awardForm['application_attachments'].map(item => ({
                        url: item.path
                    }))
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
<style lang="postcss" scoped>
/deep/ .w-90 {
  width: 90% !important;
}
</style>
