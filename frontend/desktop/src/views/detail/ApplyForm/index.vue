<template>
    <div class="apply-form-container">
        <bk-divider align="center">申请奖项</bk-divider>
        <bk-form :label-width="90" class="form"
        >
            <bk-form-item label="申请人" v-if="false">

            </bk-form-item>
            <bk-form-item label="申请理由"
                required="true"
            >
                <bk-input
                    placeholder="请输入255字以内的申请理由"
                    :type="'textarea'"
                    :rows="3"
                    :maxlength="255"
                    v-model="applyForm['application_reason']"
                >
                </bk-input>
            </bk-form-item>
            <bk-form-item label="申请材料"
                required="true"
            >
                <Uploader v-model="applyForm['application_attachments']"
                    :limit="2"
                    :readonly="false"
                ></Uploader>
            </bk-form-item>
        </bk-form>
        <!-- 用于申请奖项的按钮 -->
        <div class="button-item" v-if="$route.query['type'] !== 'approval'">
            <bk-button theme="warning"
                class="mr10"
                @click="$router.back()"
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
            <!-- /用于申请奖项的按钮 -->

            <!-- 用于审批的按钮 -->

            <!-- /用于审批的按钮 -->
        </div>

    </div>
</template>
<script>
    import { GROUP_USERS_KEYNAME } from '@/constants'

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
                return self.$http.cache.get(GROUP_USERS_KEYNAME) ?? []
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
            },
            handleOnlyGroup (value) {
                const department = value['departments'].map(item => item['full_name'])
                const awardDepartmentFullname = this.$route.params['award_department_fullname']
                return department.includes(awardDepartmentFullname)
            }
        }
    }
</script>
<style lang="postcss" scoped>
  .apply-form-container {
    padding: 2px;
    position: relative;
    .form {
      height:calc(90% - 80px) ;
      overflow-y: scroll;
    }
    .button-item {
      display: flex;
      justify-content: center;

    }
  }
</style>
