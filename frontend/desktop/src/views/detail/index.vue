<template>
    <div class="detail-container">
        <top-back></top-back>

        <!-- 待审批悬浮窗-->
        <!--        <div :class="['approval-list']" v-if="formType === pageType['approval_detail']">-->
        <!--            <div class="tip-button" @click="trigglePanel" v-waves>-->
        <!--                {{ panelCutOut ? '展开' : '收起' }}-->
        <!--            </div>-->
        <!--            <div :class="['approval-content',{-->
        <!--                'not_active': panelCutOut-->
        <!--            }]">-->
        <!--                <tabs style="height: 100%"-->
        <!--                    :tab-items="approvalTabItems"-->
        <!--                >-->
        <!--                    <template>-->
        <!--                        <component :is="'approval-list'" ref="approval-list"></component>-->
        <!--                    </template>-->
        <!--                </tabs>-->
        <!--            </div>-->
        <!--        </div>-->

        <div class="board">

            <!-- /编辑部分 -->
            <div>
                <bk-divider style="width: 100%"></bk-divider>
            </div>
            <div class="form-panel">
                <DetailInfo class="detail" ref="award-detail" type="award_detail"></DetailInfo>

                <!-- /详情部分 -->

                <!-- 编辑部分 -->
                <ApplyForm class="form"
                    ref="apply-form"
                ></ApplyForm>
            </div>
        </div>
        <!-- 底部按钮组 -->
        <div class="tc w100  mt15" v-if="formType === pageType['DETAIL_APPROVAL']">
            <!-- 用于申请奖项的按钮 -->
            <div class="button-item">
                <bk-button theme="danger"
                    class="mr20 ml20"
                    @click="toApproval(
                        '拒绝' + $refs['apply-form'].applyForm.application_users + '的申请',
                        approvalType['not_pass']
                    )"
                    ext-cls="button-item"
                >
                    <bk-icon type="close-circle" />
                    <span>不通过</span>
                </bk-button>
                <bk-button theme="success"
                    class="mr20 ml20"
                    @click="toApproval(
                        '通过' + $refs['apply-form'].applyForm.application_users + '的申请',
                        approvalType['pass']
                    )"
                    ext-cls="button-item"
                >
                    <span>通过</span>
                    <bk-icon type="check-circle" />
                </bk-button>
            </div>
            <!-- /用于申请奖项的按钮 -->

            <!-- 用于审批的按钮 -->

            <!-- /用于审批的按钮 -->
        </div>
        <!-- /底部按钮组 -->
        <bk-dialog v-model="approvalForm.approvalVisible"
            :header-position="'left'"
            :loading="approvalForm.approvalLoading"
            @confirm="handlePostApproval(approvalForm)"
            :title="approvalForm.approvalTips">
            <bk-form ref="approval-form"
                :rules="approvalFormRules"
                :model="approvalForm"
            >
                <bk-form-item :property="'approvalText'"
                    :required="true"
                    :label-width="80"
                    label="评语"
                >
                    <bk-input v-model="approvalForm.approvalText"
                        :placeholder="'请输入不超过255字的评语'"
                        :type="'textarea'"
                        :rows="3"
                        :maxlength="255"
                    ></bk-input>
                </bk-form-item>
            </bk-form>
        </bk-dialog>
    </div>
</template>
<script>
    import {
        DETAIL_APPLY,
        DETAIL_APPLY_DETAIL,
        DETAIL_APPROVAL, DETAIL_APPROVAL_RESULT_DETAIL,
        DETAIL_DRAFT_DETAIL, DETAIL_EDIT,
        DETAIL_TYPE_KEYNAME
    } from '@/constants'
    import { postApproval } from '@/api/service/apply-service'

    export default {
        name: 'detail',
        components: {
            // ApprovalList: () => import('./table/approval-list'),
            DetailInfo: () => import('./DetailInfo'),
            ApplyForm: () => import('./ApplyForm')
        },
        props: {
            type: {
                type: String,
                default: () => null
            }

        },
        provide () {
            return {
                awardDetail: () => {
                    return this.$refs['award-detail'].awardForm || {}
                }
            }
        },
        data () {
            return {
                isShow: false,
                applyForm: {},
                panelCutOut: false,
                pageType: {
                    DETAIL_APPLY,
                    DETAIL_APPROVAL,
                    DETAIL_EDIT,
                    DETAIL_APPLY_DETAIL,
                    DETAIL_DRAFT_DETAIL,
                    DETAIL_APPROVAL_RESULT_DETAIL
                },
                approvalForm: {
                    approvalVisible: false,
                    approvalLoading: false,
                    approvalText: '',
                    approvalTips: ''
                },
                approvalFormRules: Object.freeze({
                    approvalText: [
                        {
                            required: true,
                            message: '请填写评语',
                            trigger: 'blur'
                        }
                    ]
                }),
                approvalTabItems: [
                    {
                        'tab-name': '审批列表',
                        'tab-key': 'approval-list'
                    }
                ],
                approvalType: {
                    pass: 1,
                    not_pass: 0
                },
                pendingApprovalRemoteData: []
            }
        },
        computed: {
            /**
             * 用于判断是否为编辑型表格
             * */
            formType (self) {
                return self.$route.query[DETAIL_TYPE_KEYNAME] || DETAIL_APPLY
            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            handleInit () {
                this.applyForm = this.$route.params
            },
            trigglePanel () {
                this.panelCutOut = !this.panelCutOut
            },
            toApproval (tips, type) {
                this.approvalForm.approvalTips = tips
                this.approvalForm.approvalVisible = true
                this.approvalForm.action = type
            },
            async handlePostApproval ({ approvalTips, approvalText, action }) {
                await this.$refs['approval-form'].validate()
                this.approvalForm.approvalLoading = true
                return postApproval({
                    action,
                    id: this.$route.query['record_id'],
                    approval_text: approvalText
                }).then(_ => {
                    this.messageSuccess(approvalTips)
                    this.approvalForm.approvalVisible = false
                    this.approvalForm.approvalLoading = false
                    this.$router.back()
                })
            }
        }
    }
</script>
<style lang="postcss" scoped>
.detail-container {
  width: 80%;
  margin: 0 auto;

  .board {

    margin: 20px auto;
    padding: 20px;
    width: 80%;

    background-color: #FFFFFF;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 20px;

    .form-panel {

      display: flex;
      flex-direction: row;
      justify-content: center;
      flex: 1;

      .detail {
        width: 45%;
      }

      .form {
        width: 45%;
      }
    }

  }

  .approval-list {
    position: absolute;
    overflow: hidden;
    left: 0;

    .tip-button {
      background-color: #FFFFFF;
      width: 3em;
      height: 3em;
      text-align: center;
      line-height: 3em;
      border-radius: 50%;
      box-shadow: 0 0 1px 0 rgba(0, 0, 0, .4);
      cursor: pointer;
    }

    .approval-content {

      width: 200px;
      transition: transform 1s;
      transform-origin: 0 0;

      &.not_active {
        transform: scale(0);
        animation: disappear 1s;
      }
    }

  }
}

@keyframes disappear {
  0%, 100% {
    display: none;
  }
}
</style>
