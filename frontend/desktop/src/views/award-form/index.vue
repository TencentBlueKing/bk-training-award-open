<template>
    <div class="new-award-form-container">
        <top-back></top-back>
        <div class="form-container">
            <bk-form form-type="vertical">

                <bk-container :col="12">
                    <bk-row class="mt15 mb15">
                        <bk-col :span="6">
                            <bk-form-item label="奖项名称" required>
                                <bk-input></bk-input>
                            </bk-form-item>
                        </bk-col>
                        <bk-col :span="6">
                            <bk-form-item label="奖项申请顾问" required>
                                <select-search></select-search>
                            </bk-form-item>
                        </bk-col>
                    </bk-row>
                    <bk-row class="mt15 mb15">
                        <bk-col :span="6">
                            <bk-form-item label="申请要求" required>
                                <bk-input placeholder="请输入255个字符以内"
                                    :type="'textarea'"
                                    :rows="3"
                                    :maxlength="255"></bk-input>
                            </bk-form-item>
                        </bk-col>
                        <bk-col :span="6">
                            <bk-form-item label="奖项描述" required>
                                <bk-input placeholder="请输入255个字符以内"
                                    :type="'textarea'"
                                    :rows="3"
                                    :maxlength="255"></bk-input>
                            </bk-form-item>
                        </bk-col>
                    </bk-row>
                    <bk-row class="mt15 mb15">
                        <bk-col :span="6">
                            <bk-form-item label="开放申请时间" required>
                                <bk-date-picker v-model="initDateTimeRange" :placeholder="'选择日期时间范围'"
                                    :type="'datetimerange'"
                                    style="width: 100%;"
                                    format="yyyy-MM-DD hh:mm"
                                ></bk-date-picker>
                            </bk-form-item>
                        </bk-col>
                        <bk-col :span="6">
                            <bk-form-item label="所属组织" required>
                                <bk-input></bk-input>
                            </bk-form-item>
                        </bk-col>
                    </bk-row>
                    <bk-row class="mt15 mb15">
                        <bk-col :span="12">
                            <p class="review-divider mt15 mb15">
                                <bk-icon type="info" class="tips" v-bk-tooltips.bottom-end="'同一级中任何有一人通过就表明该级审批通过'" />
                                <span class="title"> 审批步骤: 1.xxx 2.xxx</span>
                            </p>

                            <bk-form-item
                                label-width="auto"
                            >
                                <div class="review-container" ref="review-container">
                                    <div class="reviewer-list mt10"
                                        v-for="(item, index) in awardForm['reviewers']"
                                        :key="item.uuid"
                                    >
                                        <span class="mr10">第 {{ index + 1 }} 批：</span>
                                        <select-search
                                            :value.sync="item.value"
                                            style="width:80%"
                                            placeholder="请选择评审人"
                                            :disabled="config[formType]['disabled']"
                                            :id-key="'username'"
                                        >
                                        </select-search>
                                        <div class="ml15">
                                            <bk-button theme="danger"
                                                title="移除同级评审人"
                                                icon="minus-circle-shape"
                                                v-show="awardForm['reviewers'].length > 1"
                                                @click="removeReviewer(awardForm['reviewers'],item.uuid)"
                                            ></bk-button>
                                            <bk-button theme="primary"
                                                title="添加同级评审人"
                                                icon="plus-circle-shape"
                                                v-show="index === awardForm['reviewers'].length - 1"
                                                @click="addReviewer(awardForm['reviewers'],$refs['review-container'])"
                                            ></bk-button>
                                        </div>
                                    </div>

                                </div>
                            </bk-form-item>
                        </bk-col>
                    </bk-row>
                </bk-container>
                <div class="footer center-content mt20">
                    <bk-button theme="danger" class="mr10 ml10"
                        @click="config[formType]['cancel-func']"
                    >
                        取消
                    </bk-button>
                    <bk-button :theme="config[formType]['button-theme']" class="mr10 ml10"
                        @click="config[formType]['confirm-func']"
                    >确认新增</bk-button>
                </div>
            </bk-form>
        </div>
    </div>
</template>
<script>
    import { formatDate } from '@/common/util'
    import { AWARD_LEVEL_MAP } from '@/constants'
    import { postAwards, putAward } from '@/api/service/award-service'
    import { bus } from '@/common/bus'

    /**
     * 全局临时叠加的唯一值
     * */
    let uuid = 0

    export default {
        name: 'new-award-form',
        components: {
            SelectSearch: () => import('@/components/select-search')
        },
        data () {
            const checkToMustItem = (message) => {
                return {
                    required: true,
                    message,
                    trigger: 'blur'
                }
            }
            /**
             * 合法性校验
             * */
            return {
                /**
                 * 创建奖项表
                 * */
                awardForm: {
                    award_name: '',
                    award_consultant: '',
                    start_time: new Date(),
                    end_time: new Date(),
                    award_description: '',
                    award_level: '',
                    award_department_fullname: '',
                    award_department_id: '',
                    award_attach_image: [],
                    award_image: '',
                    reviewers: [{
                        uuid: uuid++,
                        value: []
                    }]
                },
                rules: Object.freeze({
                    award_name: [
                        checkToMustItem('请输入奖项名称')
                    ],
                    award_consultant: [
                        checkToMustItem('请选择接口人')
                    ],
                    start_time: [
                        checkToMustItem('请输入开始时间')
                    ],
                    end_time: [
                        checkToMustItem('请输入截止时间')
                    ],
                    award_description: [
                        checkToMustItem('请输入奖项描述信息')
                    ],
                    award_level: [
                        checkToMustItem('请选择奖项等级信息')
                    ],
                    award_image: [
                        checkToMustItem('请传入图片')
                    ]
                }),
                awardLevels: AWARD_LEVEL_MAP,

                submitLoading: false,
                config: {
                    edit: {
                        'title': '编辑奖项',
                        'title-clz': 'edit',
                        'button-title': '提交修改',
                        'button-theme': 'warning',
                        'confirm-func': this.handleConfirmModifyAward,
                        'cancel-func': () => {
                            this.$router.replace({
                                name: 'award-manager'
                            })
                        }
                    },
                    create: {
                        'title': '新增奖项',
                        'title-clz': 'new',
                        'button-title': '确认新增',
                        'button-theme': 'success',
                        'confirm-func': this.handleConfirmAddNewAward,
                        'cancel-func': () => {
                            this.$router.back()
                        }
                    }
                }
            }
        },
        computed: {
            formType (self) {
                console.log(self.$route.query)
                return self.$route.query['type']
            },
            groupInfo: {
                get (self) {
                    return self.awardForm.award_department_fullname
                },
                set (newValue) {
                    const formData = this.awardForm
                    formData.award_department_fullname = newValue
                }
            }
        },
        created () {
            uuid = 0
            this.$once('hook:beforeDestroy', () => {
                // 清除全局临时叠加得变量
                uuid = null
            })
            this.handleInit()
        },
        methods: {
            /**
             * 初始化信息
             * */
            handleInit () {
                this.handleSetDefaultInfo()
            },
            /**
             * 设置初始信息
             * */
            handleSetDefaultInfo () {
                const defaultInfo = this.$route.params
                if (defaultInfo.hasOwnProperty('id')) {
                    defaultInfo['award_attach_image'] = [{
                        name: defaultInfo['award_name'],
                        url: defaultInfo['award_image']
                    }]
                    defaultInfo['reviewers'] = defaultInfo['award_reviewers'] && defaultInfo['award_reviewers'].map(item => {
                        return {
                            uuid: uuid++,
                            value: item
                        }
                    })
                    this.awardForm = defaultInfo
                }
            },
            /**
             * 用于检查表单信息
             * */
            validator () {
                return new Promise((resolve) => {
                    const awardForm = this.awardForm
                    let flag = true

                    this.$refs['Form'].validate().then(res => {
                        const awardStartTime = awardForm['start_time'].getTime()
                        const awardEndTime = awardForm['end_time'].getTime()
                        if (awardStartTime >= awardEndTime) {
                            this.messageWarn('开始时间应该早于截止时间')
                            flag = false
                        }
                        if (!(awardForm['reviewers'] && awardForm['reviewers'][0].value.length)) {
                            this.messageWarn('至少有一级评审人')
                            flag = false
                        }
                        if (!(awardForm?.award_attach_image?.slice?.(-1)[0]?.['path'])) {
                            this.messageWarn('请上传图片')
                            flag = false
                        }
                        return resolve(flag)
                    }).catch(_ => {
                        flag = false
                        return resolve(flag)
                    })
                })
            },
            /**
             * 获取这个组件中的表单信息
             * */
            async getFields () {
                const valid = await this.validator()
                if (valid) {
                    const awardForm = this.awardForm
                    awardForm.award_reviewers = awardForm.reviewers.map(item => item['value']).filter(item => item.length)
                    awardForm.start_time = formatDate(awardForm.start_time).format('YYYY-MM-DD hh:mm:ss')
                    awardForm.end_time = formatDate(awardForm.end_time).format('YYYY-MM-DD hh:mm:ss')

                    awardForm.award_image = awardForm.award_attach_image && awardForm.award_attach_image.slice(-1)[0]['path']
                    return awardForm
                }
                return null
            },
            /**
             * @description 添加评审人
             * @param {array} reviewerList 评审人列表，直接链接至 awardForm
             * @param event
             * */
            addReviewer (reviewerList, event) {
                reviewerList.push({
                    uuid: uuid++,
                    value: []
                })
                console.log(event.scrollHeight)
                console.log(event.scrollTop)
                if (event.scrollHeight > event.clientHeight) {
                    setTimeout(function () {
                        event.scrollTop = event.scrollHeight
                    })
                }
            },
            /**
             * @description 添加评审人
             * @param {array} reviewerList 评审人列表，直接链接至 awardForm
             * @param {number} uuid 全局自增生长的数字，作为传入时候的唯一标识
             * */
            removeReviewer (reviewerList, uuid) {
                const clickIdx = reviewerList.findIndex(item => item.uuid === uuid)
                reviewerList.splice(clickIdx, 1)
            },
            // S 确认按钮对应的事件
            async handleConfirmAddNewAward () {
                const form = await this.getFields()
                if (!form) return null
                if (this.submitLoading) return null
                this.submitLoading = true
                return postAwards(form).then(_ => {
                    bus.$emit('set-award-manager-init')
                    this.messageSuccess('创建成功')
                    this.$router.replace({
                        name: 'award-manager'
                    })
                }).catch(_ => {
                    this.messageWarn('创建失败')
                }).finally(_ => {
                    this.submitLoading = false
                })
            },
            async handleConfirmModifyAward () {
                const form = await this.getFields()
                if (!form) return null
                if (this.submitLoading) return null
                this.submitLoading = true
                return putAward(this.$route.params['id'], form).then(_ => {
                    bus.$emit('set-award-manager-init')
                    this.messageSuccess('修改成功')
                }).catch(_ => {
                    this.messageWarn('修改失败')
                }).finally(_ => {
                    this.submitLoading = false
                })
            },
            toModify () {
                return this.$router.push({
                    name: 'award-form',
                    query: {
                        type: 'edit'
                    },
                    params: {
          ...this.$route.params
                    }
                })
            }
        }
    }
</script>
<style lang="postcss" scoped>
@import "./index.css";
</style>
