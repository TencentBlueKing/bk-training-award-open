<template>
    <div class="new-award-form-container">
        <top-back></top-back>
        <div class="controller-panel mt20 mb15">
            <select-search behavior="simplicity"
                style="width: calc(2*118px + 1*8px);font-size: 15px;"
                :id-key="'group_id'"
                type="group"
                :multiple="false"
                placeholder="请选择需要查看的小组"
                :clearable="false"
                :value.sync="$bus.curGlobalGroupId"
                @change="handleInit($event)"
            ></select-search>
        </div>
        <div class="form-container" v-if="$bus.isCurGroupAdmin">
            <bk-form form-type="vertical"
                ref="award-form"
                :rules="awardFormRules"
                :model="awardForm"
            >
                <bk-container :col="12">
                    <bk-row class="mt15 mb15">
                        <bk-col :span="6">
                            <bk-form-item label="奖项名称"
                                :required="true"
                                :property="'award_name'"
                            >
                                <bk-input placeholder="请输入奖项名称"
                                    v-model="awardForm['award_name']"
                                ></bk-input>
                            </bk-form-item>
                        </bk-col>
                        <bk-col :span="6">
                            <bk-form-item label="奖项申请顾问"
                                :required="true"
                                :property="'award_consultant'"
                            >
                                <select-search
                                    :multiple="false"
                                    :id-key="'username'"
                                    placeholder="请选择申请顾问"
                                    :value.sync="awardForm['award_consultant']"
                                ></select-search>
                            </bk-form-item>
                        </bk-col>
                    </bk-row>
                    <bk-row class="mt15 mb15">
                        <bk-col :span="6">
                            <bk-form-item label="申请要求"
                                :required="true"
                                :property="'award_demand'"
                            >
                                <bk-input placeholder="请输入255个字符以内"
                                    :type="'textarea'"
                                    :rows="3"
                                    :maxlength="255"
                                    v-model="awardForm['award_demand']"
                                ></bk-input>
                            </bk-form-item>
                        </bk-col>
                        <bk-col :span="6">
                            <bk-form-item label="奖项描述"
                                :required="true"
                                :property="'award_description'"
                            >
                                <bk-input placeholder="请输入255个字符以内"
                                    :type="'textarea'"
                                    :rows="3"
                                    :maxlength="255"
                                    v-model="awardForm['award_description']"
                                ></bk-input>
                            </bk-form-item>
                        </bk-col>
                    </bk-row>
                    <bk-row class="mt15 mb15">
                        <bk-col :span="7">
                            <bk-form-item label="开放申请时间"
                                :required="true"
                                :property="'end_time'"
                                :enter-mode="true"
                            >
                                <bk-date-picker :placeholder="'选择日期时间范围'"
                                    :type="'datetimerange'"
                                    style="width: 100%;"
                                    format="yyyy-MM-dd HH:mm"
                                    v-model="awardFormStartEndTime"
                                ></bk-date-picker>
                            </bk-form-item>
                        </bk-col>
                    </bk-row>
                    <bk-row class="mt15 mb15">
                        <bk-col :span="12">
                            <p class="review-divider mt15 mb15">
                                <bk-icon type="info" class="tips" v-bk-tooltips.bottom-end="'同一级中任何有一人通过就表明该级审批通过'" />
                                <span class="title"> 审批步骤: 1.xxx 2.xxx</span>
                            </p>

                            <bk-form-item>
                                <div class="review-container" ref="review-container">
                                    <div class="reviewer-list mt10"
                                        v-for="(item, index) in awardForm['reviewers']"
                                        :key="item.uuid"
                                    >
                                        <span class="mr10 required">第 {{ index + 1 }} 批：</span>
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
                        返回
                    </bk-button>
                    <bk-button v-if="config[formType]['button-theme']"
                        :theme="config[formType]['button-theme']"
                        class="mr10 ml10"
                        @click="config[formType]['confirm-func']()"
                    >
                        {{config[formType]['button-title']}}
                    </bk-button>
                </div>
            </bk-form>
        </div>
        <empty v-else>
            <div slot="description">
                <p class="mb20">不好意思，您不是该组管理员~</p>
                请联系本组（{{ $bus.curGlobalSelectedGroup['full_name'] }}）管理员: <span
                    style="color: #cc1111">
                    {{$bus.curGlobalSelectedGroup['secretary_display_name_for_dispaly'] }}
                </span>
            </div>
        </empty>
    </div>
</template>
<script>
    import { formatDate, setTitle } from '@/common/util'
    import {
        AWARD_LEVEL_MAP,
        AWARD_MANAGER_ROUTE_PATH, AWARD_TYPE_CREATE, AWARD_TYPE_DETAIL,
        AWARD_TYPE_EDIT,
        AWARD_TYPE_ROUTE_KEY
    } from '@/constants'
    import { getAwardById, postAwards, putAward } from '@/api/service/award-service'
    import moment from 'moment'
    import { uuid } from '@/common/uuid'
    /**
     * 全局临时叠加的唯一值
     * */

    export default {
        name: 'new-award-form',
        components: {
            SelectSearch: () => import('@/components/select-search')
        },
        props: {
            awardFormType: {
                type: String,
                default: 'create'
            }
        },
        data (self) {
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
                    award_demand: '',
                    start_time: null,
                    end_time: null,
                    award_description: '',
                    award_level: '',
                    award_department_id: '',
                    award_department_fullname: '',
                    award_reviewers: '',
                    reviewers: [{
                        uuid: uuid.get(),
                        value: []
                    }]
                },
                awardFormRules: Object.freeze({
                    award_name: [
                        {
                            message: '请填写奖项名',
                            required: true,
                            trigger: 'blur'
                        }
                    ],
                    award_consultant: [
                        {
                            message: '请选择咨询人',
                            required: true,
                            trigger: 'blur'
                        }
                    ],
                    award_demand: [
                        {
                            message: '请填写奖项需求',
                            required: true,
                            trigger: 'blur'
                        }
                    ],

                    end_time: [
                        {
                            message: '请补充奖项时间',
                            trigger: 'blur',
                            validator () {
                                return self.awardForm['end_time']
                            }
                        },
                        {
                            message: '截止时间应该比现在更晚',
                            trigger: 'blur',
                            validator () {
                                const selectedTime = moment(self.awardForm['end_time'])
                                const nowTime = moment()
                                return nowTime.diff(selectedTime, 'seconds')
                            }
                        }

                    ],
                    award_description: [
                        {
                            message: '请填写奖项描述',
                            required: true,
                            trigger: 'blur'
                        }
                    ],
                    reviewers: [
                        {
                            message: '请选择评审人',
                            required: true,
                            trigger: 'blur'
                        },
                        {
                            message: '请选择评审人',
                            validator () {
                                return self.awardForm['reviewers']?.[0]?.value
                            },
                            trigger: 'blur'
                        }
                    ]
                }),
                awardLevels: AWARD_LEVEL_MAP,
                submitLoading: false,
                config: {
                    
                    [AWARD_TYPE_CREATE]: {
                        'title': '新增奖项',
                        'title-clz': 'new',
                        'button-title': '确认新增',
                        'button-theme': 'success',
                        'confirm-func': this.handleConfirmAddNewAward,
                        'cancel-func': () => {
                            this.$router.go(-1)
                        },
                        init () {
                            setTitle('创建奖项')
                        }
                    },
                    [AWARD_TYPE_EDIT]: {
                        'title': '编辑奖项',
                        'title-clz': 'edit',
                        'button-title': '提交修改',
                        'button-theme': 'warning',
                        'confirm-func': this.handleConfirmModifyAward,
                        'cancel-func': () => {
                            this.$router.replace({
                                name: AWARD_MANAGER_ROUTE_PATH
                            })
                        },
                        init () {
                            self.handleGetAwardDetailById()
                            setTitle('编辑奖项')
                        }
                    },
                    [AWARD_TYPE_DETAIL]: {
                        'title': '奖项详情',
                        'title-clz': '',
                        'button-title': '',
                        'button-theme': '',
                        'confirm-func': () => {},
                        'cancel-func': () => {
                            this.$router.go(-1)
                        },
                        init () {
                            self.handleGetAwardDetailById()
                            setTitle('奖项详情')
                        }
                    }
                }
            }
        },
        computed: {
            formType (self) {
                return self.$route.query[AWARD_TYPE_ROUTE_KEY] || AWARD_TYPE_CREATE
            },
            groupInfo: {
                get (self) {
                    return self.awardForm.award_department_fullname
                },
                set (newValue) {
                    const formData = this.awardForm
                    formData.award_department_fullname = newValue
                }
            },
            awardFormStartEndTime: {
                get () {
                    return [this.awardForm.start_time, this.awardForm.end_time]
                },
                set (newValue) {
                    if (newValue.every(item => item)) {
                        if (moment(newValue[0]).diff(moment(newValue[1]), 'seconds') < 0) {
                            this.awardForm.start_time = newValue[0]
                            this.awardForm.end_time = newValue[1]
                        } else {
                            this.awardForm.start_time = newValue[1]
                            this.awardForm.end_time = newValue[0]
                        }
                    }
                }
            }
        },
        beforeCreate () {
            this.$once('hook:deactivated', () => uuid.clear())
            this.$once('hook:beforeDestroy', () => uuid.clear())
        },
        created () {
            this.handleInit()
        },
        methods: {
            /**
             * 初始化信息
             * */
            handleInit () {
                this.config[this.formType]?.init()
            },
            handleGetAwardDetailById () {
                const awardId = this.$route.query['award_id']
                if (awardId) {
                    return getAwardById(awardId).then(awardDetail => {
                        const detail = awardDetail.data
                        try {
                            console.log(detail)
                            detail['reviewers'] = detail['reviewers'] = detail['award_reviewers'].map(item => {
                                return {
                                    uuid: uuid.get(),
                                    value: item
                                }
                            })
                            this.$bus.curGlobalGroupId = detail['award_department_id']
                        } catch (e) {
                            console.error(e)
                        }
                        this.$nextTick(item => {
                            this.awardForm = detail
                        })
                    })
                }
            },
            /**
             * 用于检查表单信息
             * */
            validator () {
                const awardForm = this.awardForm
                let flag = true
                return this.$refs['award-form'].validate().then(res => {
                    if (!(awardForm['reviewers'] && awardForm['reviewers'][0].value.length)) {
                        this.messageWarn('至少有一级评审人')
                        flag = false
                    }
                    awardForm['award_reviewers'] = awardForm['reviewers'].map(item => item.value).filter(item => item.length)
                    return Promise.resolve(flag)
                }).catch(_ => {
                    return Promise.resolve(false)
                })
            },
            /**
             * 获取这个组件中的表单信息
             * */
            async getFields () {
                const valid = await this.validator()
                if (valid) {
                    const awardForm = this.awardForm
                    awardForm.start_time = formatDate(awardForm.start_time)
                    awardForm.end_time = formatDate(awardForm.end_time)
                    console.log(this.$bus.curGroupUsers)
                    this.awardForm['award_department_id'] = this.$bus.curGlobalGroupId
                    this.awardForm['award_consultant_displayname'] = this.$bus.curGroupUsers.find(item => item['username'] === awardForm['award_consultant'])['display_name']
                    this.awardForm['award_department_fullname'] = this.$bus.curGlobalSelectedGroup['full_name']
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
                if (!reviewerList.slice(-1)[0]?.value.length) {
                    return this.messageWarn('请不要留下空白')
                }
                reviewerList.push({
                    uuid: uuid.get(),
                    value: []
                })
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
                    this.messageSuccess('创建成功')
                    this.$router.replace({
                        name: AWARD_MANAGER_ROUTE_PATH
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

                return putAward(this.$route.query['award_id'], form).then(_ => {
                    this.messageSuccess('修改成功')
                }).catch(_ => {
                    this.messageWarn('修改失败')
                }).finally(_ => {
                    this.submitLoading = false
                })
            }
        }
    }
</script>
<style lang="postcss" scoped>
@import "./index.css";

.required {
  &::before {
    content: "*";
    color: #cc1111;
  }
}
</style>
