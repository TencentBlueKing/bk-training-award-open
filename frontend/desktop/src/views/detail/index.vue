<template>
    <div class="detail-container">
        <top-back></top-back>

        <!-- 待审批悬浮窗-->
        <div :class="['approval-list']" v-if="formType === 'approval'">
            <div class="tip-button" @click="trigglePanel" v-waves>
                {{ panelCutOut ? '展开' : '收起' }}
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

        <div class="board">

            <div class="form-panel">

                <DetailInfo class="detail" ref="award-detail"></DetailInfo>
                <!-- /详情部分 -->

                <!-- 编辑部分 -->
                <ApplyForm class="form"
                    v-if="isShowApplyForm"
                    ref="applyForm"
                    :id="applyForm['id']"
                ></ApplyForm>
            </div>
            <!-- /编辑部分 -->
            <bk-steps class="mt20 pt20 pl20 pr20" v-if="$route.query['type'] === 'edit'" :steps="applicationSteps2" size="small"></bk-steps>
            <bk-steps class="mt20 pt20 pl20 pr20" v-else :steps="applicationSteps" size="small"></bk-steps>
        </div>
        <!-- 底部按钮组 -->
        <div class="tc w100  mt15" v-if="$route.query['type'] === 'approval'">
            <!-- 用于申请奖项的按钮 -->
            <div class="button-item">
                <bk-button theme="danger"
                    class="mr20 ml20"
                    @click="handleToPaasApproval()"
                    ext-cls="button-item"
                >
                    <bk-icon type="close-circle" />
                    <span>不通过</span>
                </bk-button>
                <bk-button theme="success"
                    class="mr20 ml20"
                    @click="handleToRejectApproval()"
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
    </div>
</template>
<script>
    export default {
        name: 'detail',
        components: {
            ApprovalList: () => import('./table/approval-list'),
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
                    return this.$refs['award-detail'].awardForm
                }
            }
        },
        data () {
            return {
                formType: 'detail',
                isShow: false,
                applyForm: {},
                panelCutOut: false,
                applicationSteps: [
                    {
                        title: '奖项申请',
                        icon: 1,
                        name: 'apply'
                    },
                    {
                        title: '奖项审批',
                        icon: 2
                    },
                    {
                        title: '得知审批结果',
                        icon: 'success'
                    }
                ],
                applicationSteps2: [
                    {
                        title: '修改草稿',
                        icon: 1,
                        name: 'apply'
                    },
                    {
                        title: '发起申请',
                        icon: 2
                    },
                    {
                        title: '奖项审批',
                        icon: 'success'
                    }
                ],
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
                return ['apply', 'edit', 'apply_detail'].includes(this.formType)
            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            handleInit () {
                this.applyForm = this.$route.params
                this.formType = this.$route.query['type']
            },
            trigglePanel () {
                this.panelCutOut = !this.panelCutOut
            },
            handleToPaasApproval () {

            },
            handleToRejectApproval () {
              
            },
            handleBatchPassApproval () {
              
            },
            handleBatchRejectApproval () {
              
            }
        }
    }
</script>
<style lang="postcss" scoped>
.detail-container {
  width: 80%;
  margin: 0 auto;

  .board {

    margin: 0 auto;
    padding: 20px 0 0 20px;
    width: 1024px;
    height: 544px;

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
