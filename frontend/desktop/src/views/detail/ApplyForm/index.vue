<template>
    <div class="apply-form-container">
        <bk-form :label-width="90" class="form"
            :rules="applyFormRules"
            :model="applyForm"
            ref="apply-form"
            style="height: 400px"
        >
            <bk-form-item label="申请人" v-show="!config[formType]['is_editor']">
                <bk-input :disabled="!config[formType]['is_editor']" v-model="applyForm.application_users"></bk-input>
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
                    :disabled="!config[formType]['is_editor']"
                >
                </bk-input>
            </bk-form-item>
            <bk-form-item label="申请材料"
            >
                <Uploader v-model="applyForm['application_attachments']"
                    :limit="2"
                    :readonly="!config[formType]['is_editor']"
                    style="max-height: 300px;overflow-y: scroll;"
                    class="mb20"
                ></Uploader>
            </bk-form-item>
        </bk-form>
        <!-- 用于申请奖项的按钮 -->
        <div class="button-item" v-show="!config[formType]['hidden_button']">
            <bk-button theme="danger"
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
                v-if="formType === 'apply'"
            >
                <bk-icon type="check-circle" />
                <span>发起申请</span>
            </bk-button>
            <bk-button theme="warning"
                v-else-if="formType === configType['draft_detail']"
                class="mr10"
                @click="handleToSendApplyForm(applyForm)"
                ext-cls="button-item"
            >
                <bk-icon type="check-circle" />
                <span>重新申请</span>
            </bk-button>
            <!-- /用于申请奖项的按钮 -->

            <!-- 用于审批的按钮 -->

            <!-- /用于审批的按钮 -->
        </div>

    </div>
</template>
<script>
    import {
        DETAIL_APPLY,
        DETAIL_APPLY_DETAIL,
        DETAIL_APPROVAL_DETAIL,
        DETAIL_DRAFT_DETAIL,
        DETAIL_TYPE_KEYNAME,
        GROUP_USERS_KEYNAME,
        MYAPPLY_ROUTE_PATH
    } from '@/constants'
    import { postRecord } from '@/api/service/award-service'
    import { getApplicationById } from '@/api/service/apply-service'
    import { formatUsernameAndDisplayName } from '@/common/util'

    export default {
        name: 'apply-form',
        components: {
            Uploader: () => import('@/components/uploader')
        },
        inject: ['awardDetail'],
        data (self) {
            return {
                config: {
                    [DETAIL_APPLY]: {
                        hidden_button: false,
                        is_editor: true,
                        init () {
                        }
                    },
                    [DETAIL_APPLY_DETAIL]: {
                        hidden_button: true,
                        is_editor: false,
                        init () {
                            self.handleGetRecord()
                        }
                    },
                    [DETAIL_DRAFT_DETAIL]: {
                        hidden_button: false,
                        is_editor: true,
                        init () {
                        }
                    },
                    [DETAIL_APPROVAL_DETAIL]: {
                        hidden_button: true,
                        is_editor: false,
                        init () {
                            self.handleGetRecord()
                        }
                    }
                },
                configType: {
                    apply: DETAIL_APPLY,
                    apply_detail: DETAIL_APPLY_DETAIL,
                    draft_detail: DETAIL_DRAFT_DETAIL,
                    approval_detail: DETAIL_APPROVAL_DETAIL
                },
                applyForm: {
                    /**
                     * 申请理由
                     * */
                    application_users: '',
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
            },
            formType (self) {
                return self.$route.query[DETAIL_TYPE_KEYNAME] || DETAIL_APPLY
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
                this.config[this.$route.query[DETAIL_TYPE_KEYNAME]]?.init()
            },
            handleSetDefaultInfo () {
              
            },
            validator () {
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
                    return this.$router.replace({
                        name: MYAPPLY_ROUTE_PATH
                    })
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
            },
            handleGetRecord () {
                return getApplicationById(this.$route.query['record_id']).then(response => {
                    const reponseData = response.data
                    this.applyForm.application_users = formatUsernameAndDisplayName(
                        reponseData.application_users[0]['username'],
                        reponseData.application_users[0]['display_name']
                    )
                    this.applyForm.application_reason = reponseData.application_reason
                    this.applyForm.application_attachments = reponseData.application_attachments
                })
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
