<template>
    <div class="detail-container">
        <top-back></top-back>

        <!-- 待审批悬浮窗-->
        <div :class="['approval-list']" v-if="formType === 'approval'">
            <div class="tip-button" @click="trigglePanel" v-waves>
                {{panelCutOut ? '展开' : '收起'}}
            </div>
            <div :class="['approval-content',{
                'not_active': panelCutOut
            }]">
                <tabs style="height: 100%"
                    :tab-items="approvalTabItems"
                >
                    <template>
                        <component :is="'approval-list'"></component>
                    </template>
                </tabs>
            </div>
        </div>
        <div class="form-panel">
            <Detail class="detail" :award-form="applyForm"></Detail>
            <!-- /详情部分 -->

            <!-- 编辑部分 -->
            <ApplyForm class="form" v-if="isShowApplyForm"
                ref="applyForm"
                :id="applyForm['id']"
            ></ApplyForm>
            <!-- /编辑部分 -->
        </div>
        <!-- 底部按钮组 -->
        <div class="tc w100  mt15">
            <!-- 用于申请奖项的按钮 -->
            <div class="button-item"
            >
                <bk-button theme="success"
                    class="mr10"
                    @click="handleToSendApplyForm($refs['applyForm'])"
                    ext-cls="button-item"
                >
                    <bk-icon type="check-circle" />
                    <span>发起申请</span>
                </bk-button>
                <bk-button theme="primary"
                    class="mr10"
                    @click="handleToSaveApplyForm($refs['applyForm'])"
                    ext-cls="button-item"
                >
                    <bk-icon type="save" />
                    <span>保存草稿</span>
                </bk-button>
                <bk-button theme="warning"
                    class="mr10"
                    @click="$router.back()"
                    ext-cls="button-item"
                >
                    <bk-icon type="minus-circle" />
                    <span>取消</span>
                </bk-button>
            </div>
            <!-- /用于申请奖项的按钮 -->
            <!-- 用于审批的按钮 -->

            <!-- /用于审批的按钮 -->
        </div>
        <!-- /底部按钮组 -->
    </div>
</template>
<script>
    import { postRecord } from '@/api/service/award-service'

    export default {
        name: 'detail',
        components: {
            ApprovalList: () => import('./table/approval-list'),
            Detail: () => import('./DetailInfo'),
            ApplyForm: () => import('./ApplyForm')
        },
        props: {
            type: {
                type: String,
                default: () => null
            }

        },
        data () {
            return {
                formType: 'detail',
                isShow: false,
                applyForm: {},
                panelCutOut: false,
                approvalTabItems: [
                    {
                        'tab-name': '审批列表',
                        'tab-key': 'approval-list'
                    }
                ]
            }
        },
        computed: {
            /**
             * 用于判断是否为编辑型表格
             * */
            isShowApplyForm () {
                return ['apply', 'edit'].includes(this.formType)
            },
            /**
             * 主要用于拼接一些比如 id 的信息 此类默认信息
             * */
            defaultInfo () {
                return {
                    award_apply_record_id: this.applyForm.award_apply_record_id,
                    award_id: this.applyForm.id
                }
            }
        },
        created () {
            this.applyForm = this.$route.params
            this.formType = this.$route.query['type']
        },
        methods: {
            /**
             * 保存草稿
             * */
            handleToSaveApplyForm (applyForm) {
                this.handleToDealWidthApply(true, applyForm).then(res => {
                    this.messageSuccess('保存草稿成功')
                })
            },
            /**
             * 发起申请
             * */
            handleToSendApplyForm (applyForm) {
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
                const defaultInfo = this.defaultInfo
                const params = applyForm.getFields()
                if (!params) {
                    return
                }
                return postRecord(isDraft, {
                ...params,
                ...defaultInfo
                })
            },
            trigglePanel () {
                this.panelCutOut = !this.panelCutOut
            }
        }
    }
</script>
<style lang="postcss" scoped>
.detail-container {
  width: 80%;
  margin: 0 auto;

  .form-panel {
    background-color: #FFFFFF;

    display: flex;
    flex-direction: row;
    justify-content: center;
    flex: 1;

    padding: 20px 0 0 20px;
    width: 1024px;
    height: 544px;

    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 20px;
    margin: 0 auto;

    .detail {
      width: 45%;
    }

    .form {
      width: 45%;
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
      box-shadow: 0 0 1px 0  rgba(0,0,0,.4);
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
  0%,100% {
    display: none;
  }
}
</style>
