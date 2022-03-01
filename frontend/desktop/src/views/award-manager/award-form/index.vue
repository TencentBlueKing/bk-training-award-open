<template>
    <div class="new-award-form-container">
        <div :class="['title', config[formType]['title-clz']]">
            {{ config[formType]['title']}}
        </div>
        <bk-form :label-width="110"
            form-type="vertical"
            :rules="rules"
            ref="Form"
            :model="awardForm"
        >
            <bk-container :col="12"
                ext-cls="award-form-container"
                :gutter="60"
                :flex="true"
            >
                <!-- 奖项基本信息 -->
                <bk-row>
                    <bk-col :span="6">
                        <bk-form-item label="奖项名称"
                            :required="true"
                            :property="'award_name'"
                        >
                            <bk-input placeholder="请输入奖项名称"
                                v-model="awardForm['award_name']"
                                :disabled="config[formType]['disabled']"
                            ></bk-input>
                        </bk-form-item>
                    </bk-col>
                    <bk-col :span="6">
                        <bk-form-item label="接口人"
                            :property="'award_consultant'"
                        >
                            <select-search
                                :value.sync="awardForm['award_consultant']"
                                ext-cls="select-custom"
                                style="width: 100%;"
                                placeholder="请选择接口人"
                                :disabled="config[formType]['disabled']"
                                :multiple="false"
                                :id-key="'username'"
                            >
                            </select-search>
                        </bk-form-item>
                    </bk-col>
                </bk-row>

                <bk-row>
                    <bk-col :span="6">
                        <bk-form-item
                            :label-width="120"
                            label="开始申请时间"
                            :required="true"
                            :property="'start_time'"
                        >
                            <bk-date-picker
                                style="width:100%"
                                v-model="awardForm['start_time']"
                                :placeholder="'请选择开始申请时间'"
                                :disabled="config[formType]['disabled']"
                                :ext-popover-cls="'custom-popover-cls'"
                                type="datetime"
                            ></bk-date-picker>
                        </bk-form-item>
                    </bk-col>
                    <bk-col :span="6">
                        <bk-form-item label="截止申请时间"
                            :required="true"
                            :property="'end_time'"
                        >
                            <bk-date-picker
                                style="width:100%"
                                v-model="awardForm['end_time']"
                                :placeholder="'请选择截止申请时间'"
                                :ext-popover-cls="'custom-popover-cls'"
                                type="datetime"
                                :disabled="config[formType]['disabled']"
                            ></bk-date-picker>
                        </bk-form-item>
                    </bk-col>
                </bk-row>

                <bk-row>
                    <bk-col :span="6">
                        <bk-form-item label="描述信息"
                            :required="true"
                            :property="'award_description'"
                        >
                            <bk-input
                                v-model="awardForm['award_description']"
                                :type="'textarea'"
                                :rows="3"
                                :maxlength="255"
                                placeholder="请输入描述信息"
                                :disabled="config[formType]['disabled']"
                            ></bk-input>
                        </bk-form-item>
                    </bk-col>

                    <bk-col :span="6">
                        <bk-form-item label="图片"
                            :property="'award_a'"
                        >
                            <Uploader :limit="1"
                                theme="picture"
                                v-model="awardForm['award_attach_image']"
                                :multiple="false"
                            >
                            </Uploader>
                        </bk-form-item>
                    </bk-col>
                </bk-row>
                <bk-row>
                    <bk-col :span="6">
                        <bk-form-item label="奖项级别"
                            :required="true"
                            :property="'award_level'"
                        >
                            <bk-select v-model="awardForm['award_level']"
                                placeholder="请选择奖项级别"
                                :disabled="config[formType]['disabled']"
                            >
                                <bk-option v-for="awardLevel in awardLevels"
                                    :key="awardLevel"
                                    :id="awardLevel"
                                    :name="awardLevel">
                                </bk-option>
                            </bk-select>
                        </bk-form-item>
                    </bk-col>
                    <bk-col :span="6">
                        <bk-form-item label="所属组织"
                            :required="true"
                            :property="'award_level'"
                        >
                            <select-search
                                :value.sync="groupInfo"
                                placeholder="请选择奖项所属组织"
                                :multiple="false"
                                :disabled="config[formType]['disabled']"
                                type="secretary"
                            ></select-search>
                        </bk-form-item>
                    </bk-col>
                </bk-row>
                <!-- /奖项基本信息 -->
                <bk-divider></bk-divider>

                <bk-row>
                    <bk-col :span="12">
                        <bk-form-item
                            label-width="auto"
                            label="评审人(*同级审批为[或审批]，异级审批为[与审批])"
                            :required="true"
                        >
                            <div class="form-group mt10"
                                v-for="(item, index) in awardForm['reviewers']"
                                :key="item.uuid"
                            >
                                <select-search
                                    :value.sync="item.value"
                                    style="width:80%"
                                    placeholder="请选择评审人"
                                    :disabled="config[formType]['disabled']"
                                    :id-key="'username'"
                                >
                                </select-search>
                                <div class="ml15">
                                    <bk-button theme="primary"
                                        title="添加同级评审人"
                                        icon="plus-circle-shape"
                                        v-show="index === awardForm['reviewers'].length - 1"
                                        @click="addReviewer(awardForm['reviewers'])"
                                    ></bk-button>
                                    <bk-button theme="danger"
                                        title="移除同级评审人"
                                        icon="minus-circle-shape"
                                        v-show="index !== awardForm['reviewers'].length - 1"
                                        @click="removeReviewer(awardForm['reviewers'],item.uuid)"
                                    ></bk-button>
                                </div>
                            </div>
                        </bk-form-item>
                    </bk-col>
                </bk-row>
            </bk-container>
        </bk-form>
        <div class="center-content">
            <bk-button :theme="'danger'"
                @click="config[formType]['cancel-func']"
                class="mr10"
            >
                取消
            </bk-button>
            <bk-button :theme="config[formType]['button-theme']"
                @click="config[formType]['confirm-func']($event)"
                class="ml10"
                :loading="submitLoading"
            >
                {{config[formType]['button-title']}}
            </bk-button>
        </div>
    </div>
</template>
<script>
    import { formatDate } from '@/common/util'
    import { AWARD_LEVEL_MAP, GROUP_SECRETARY_KEYNAME } from '@/constants'
    import { postAwards, putAward } from '@/api/service/award-service'
    import { bus } from '@/common/bus'

    /**
     * 全局临时叠加的唯一值
     * */
    let uuid = 0

    export default {
        name: 'new-award-form',
        components: {
            SelectSearch: () => import('@/components/select-search'),
            Uploader: () => import('@/components/uploader')
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
                    'edit': {
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
                    'detail': {
                        'title': '奖项详情',
                        'title-clz': 'detail',
                        'button-title': '前往修改',
                        'button-theme': 'primary',
                        'confirm-func': this.toModify,
                        'disabled': true,
                        'cancel-func': () => {
                            this.$router.back()
                        }
                    },
                    'new': {
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
                console.log(self.$route.type)
                return self.$route.query.type
            },
            groupInfo: {
                get (self) {
                    return self.awardForm.award_department_id
                },
                set (newValue) {
                    const formData = this.awardForm
                    const totalDepartment = this.$http.cache.get(GROUP_SECRETARY_KEYNAME)
                    formData.award_department_id = newValue
                    formData.award_department_fullname = totalDepartment.find(item => item.id === newValue)['full_name']
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
                    console.log(awardForm.award_attach_image)

                    awardForm.award_image = awardForm.award_attach_image && awardForm.award_attach_image.slice(-1)[0]['path']
                    return awardForm
                }
                return null
            },
            /**
             * @description 添加评审人
             * @param {array} reviewerList 评审人列表，直接链接至 awardForm
             * */
            addReviewer (reviewerList) {
                reviewerList.push({
                    uuid: uuid++,
                    value: []
                })
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
                    path: `award-manager/award-form`,
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
