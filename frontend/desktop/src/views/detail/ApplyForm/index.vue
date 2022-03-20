<template>
    <div class="apply-form-container">
        <bk-divider align="center">申请奖项</bk-divider>
        <bk-form :label-width="90" class="form"
            :rules="applyFormRules"
            :model="applyForm"
            ref="apply-form"
        >
            <bk-form-item label="申请人" v-if="false">
                <bk-input></bk-input>
            </bk-form-item>
            <bk-form-item label="申请理由"
                required="true"
                :property="'application_reason'"
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
                @click="handleToSaveApplyForm(applyForm)"
                ext-cls="button-item"
            >
                <bk-icon type="save" />
                <span>保存草稿</span>
            </bk-button>
            <bk-button theme="success"
                class="mr10"
                @click="handleToSendApplyForm(applyForm)"
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
    import { postRecord } from '@/api/service/award-service'

    export default {
        name: 'apply-form',
        components: {
            Uploader: () => import('@/components/uploader')
        },
        inject: ['awardDetail'],
        data (self) {
            return {
                applyForm: {
                    /**
                     * 申请理由
                     * */
                    application_reason: '',
                    /**
                     * 申请附件列表
                     * */
                    application_attachments: []
                },
                applyFormRules: Object.freeze({
                    application_reason: [
                        {
                            required: true,
                            message: '请填写申请理由',
                            trigger: 'blur'
                        }
                    ]
                })

            }
        },
        computed: {
            groupUsers (self) {
                return self.$http.cache.get(GROUP_USERS_KEYNAME) ?? []
            },
            award (self) {
                return self.awardDetail()
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
            validator () {
                if (!this.applyForm.application_attachments?.length) {
                    this.messageWarn('请上传附件')
                    throw new SyntaxError('请上传附件')
                }
                return this.$refs['apply-form'].validate()
            },
            /**
             * 保存草稿
             * */
            async handleToSaveApplyForm (applyForm) {
                await this.validator()
                this.handleToDealWidthApply(true, applyForm).then(res => {
                    this.messageSuccess('保存草稿成功')
                })
            },
            /**
             * 发起申请
             * */
            async handleToSendApplyForm (applyForm) {
                await this.validator()
                this.handleToDealWidthApply(false, applyForm).then(res => {
                    this.messageSuccess('申请成功')
                    return this.$router.back()
                })
            },
            /**
             * 处理奖项的统一入口
             * @param {boolean} isDraft
             * @param {object} applyForm
             * */
            handleToDealWidthApply (isDraft, applyForm) {
                return postRecord(isDraft, {
                    award_department_id: this.award['award_department_id'],
                    award_id: this.award['id'],
                    ...applyForm

                })
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
    height: calc(90% - 80px);
    overflow-y: scroll;
  }

  .button-item {
    display: flex;
    justify-content: center;

  }
}
</style>
