<template>
    <div class="detail-container m20" :show-head="false">
        <div>
            <Detail :award-form="applyForm"></Detail>
            <!-- /详情部分 -->

            <!-- 编辑部分 -->
            <ApplyForm v-if="isShowApplyForm"
                ref="applyForm"
                :id="applyForm['id']"
            ></ApplyForm>
            <!-- /编辑部分 -->

        </div>
        <!-- 底部按钮组 -->
        <div class="tc w100  mt15">
            <!-- 用于申请奖项的按钮 -->
            <div v-if="isShowApplyForm"
                class="button-item"
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

            <!-- 用于跳转申请奖项的按钮 -->
            <div v-else
                class="tc mr15 mt15"
            >
                <bk-button theme="primary"
                    class="mr10"
                    @click="formType = 'apply'"
                    icon-right="arrows-right-circle"
                >
                    <span class="m5">前往申请</span>
                </bk-button>
                <bk-button theme="warning"
                    class="ml10"
                    @click="$router.back()"
                    icon-right="close-circle"
                >
                    <span class="m5">取消</span>
                </bk-button>

            </div>
            <!-- /用于跳转申请奖项的按钮 -->
        </div>
    <!-- /底部按钮组 -->
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import { postRecord } from '@/api/service/award-service'

    export default {
        name: 'detail',
        components: {
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
                applyForm: {}
            }
        },
        computed: {
    ...mapGetters(['user']),
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
            console.log(this.$route.params)
            this.applyForm = this.$route.params
            this.formType = this.$route.params['type']
        },
        methods: {
            /**
             * 保存草稿
             * */
            handleToSaveApplyForm (applyForm) {
                this.handleToDealWidthApply(true, applyForm).then(res => {
                    console.log('res', res)
                })
            },
            /**
             * 发起申请
             * */
            handleToSendApplyForm (applyForm) {
                this.handleToDealWidthApply(false, applyForm).then(res => {
                    console.log('res', res)
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
            }
        }
    }
</script>
<style>
@import "@/css/mixins/scroll.css";
.monitor-navigation-content {
  @mixin scroller;
  overflow-y: scroll;
}
</style>
