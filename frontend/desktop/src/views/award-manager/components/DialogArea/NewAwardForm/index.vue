<template>
    <div class="new-award-form-container">
        <bk-form :label-width="110"
            form-type="vertical"
            :rules="rules"
            ref="NewAwardForm"
            :model="awardForm"
        >
            <bk-container :col="12"
                ext-cls="award-form-container"
                flex
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
                            ></bk-input>
                        </bk-form-item>
                    </bk-col>
                    <bk-col :span="6">
                        <bk-form-item label="接口人"
                            :property="'award_consultant'"
                        >
                            <bk-select :disabled="false"
                                v-model="awardForm['award_consultant']"
                                style="width: 100%;"
                                ext-cls="select-custom"
                                ext-popover-cls="select-popover-custom"
                                placeholder="请选择接口人"
                                searchable
                            >
                                <bk-option v-for="option in list"
                                    :key="option.id"
                                    :id="option.id"
                                    :name="option.name">
                                </bk-option>
                            </bk-select>
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
                                :ext-popover-cls="'custom-popover-cls'"
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
                            ></bk-input>
                        </bk-form-item>
                        <bk-form-item label="奖项级别"
                            :required="true"
                            :property="'award_level'"
                        >
                            <bk-select multiple
                                display-tag
                                v-model="awardForm['award_level']"
                                placeholder="请选择奖项级别"
                            >
                                <bk-option v-for="option in list"
                                    :key="option.id"
                                    :id="option.id"
                                    :name="option.name">
                                </bk-option>
                            </bk-select>
                        </bk-form-item>
                    </bk-col>

                    <bk-col :span="6">
                        <bk-form-item label="图片"
                            :property="'award_level'"
                        >
                            <Uploader :limit="5"
                                theme="picture"
                            >
                            </Uploader>
                        </bk-form-item>
                    </bk-col>
                </bk-row>
                <!-- /奖项基本信息 -->
                <bk-divider></bk-divider>

                <bk-row>
                    <bk-col :span="12">
                        <bk-form-item v-for="(item, index) in awardForm['reviewer']"
                            label-width="auto"
                            :key="item.uuid"
                            label="评审人(*同级审批为[或审批]，异级审批为[与审批])"
                            :required="true"
                        >
                            <div class="form-group">
                                <bk-select style="width:80%"
                                    multiple
                                    display-tag
                                    v-model="item.value"
                                    placeholder="请选择评审人"
                                >
                                    <bk-option v-for="option in list"
                                        :key="option.id"
                                        :id="option.id"
                                        :name="option.name">
                                    </bk-option>
                                </bk-select>
                                <div class="ml15">
                                    <bk-button theme="primary"
                                        title="添加同级评审人"
                                        icon="plus-circle-shape"
                                        v-show="index === awardForm['reviewer'].length - 1"
                                        @click="addReviewer(awardForm['reviewer'])"
                                    ></bk-button>
                                    <bk-button theme="danger"
                                        title="移除同级评审人"
                                        icon="minus-circle-shape"
                                        v-show="index !== awardForm['reviewer'].length - 1"
                                        @click="removeReviewer(awardForm['reviewer'],item.uuid)"
                                    ></bk-button>
                                </div>
                            </div>
                        </bk-form-item>
                    </bk-col>
                </bk-row>

            </bk-container>
        </bk-form>
    </div>
</template>
<script>
    let uuid = 0
    export default {
        name: 'new-award-form',
        components: {
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
            this.rules = {
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
                reviewer: [
                    {
                        validator: (val) => {
                            return val.length >= 1 && val[0].length
                        },
                        message: '评审人至少有一个'
                    }
                ]
            }
            return {
                /**
                 * 创建奖项表
                 * */
                awardForm: {
                    award_name: '',
                    award_consultant: '',
                    start_time: '',
                    end_time: '',
                    award_description: '',
                    award_level: '',
                    reviewer: [{
                        uuid: uuid++,
                        value: ['couriourc']
                    }]
                }
            }
        },
        computed: {
        },
        methods: {

            /**
             * 部分预计可抽离信息
             * */
            handleErrorTips (message) {
                this.handleTips('error', message)
            },
            handleSuccessTips (message) {
                this.handleTips('success', message)
            },
            handleTips (theme, message) {
                this.$bkMessage({
                    theme,
                    message
                })
            },
            /**
             * 用于检查表单信息
             * */
            validator () {
                const awardStartTime = new Date(this.awardForm['award_start_time']).getTime()
                const awardEndTime = new Date(this.awardForm['award_end_time']).getTime()
                if (awardStartTime >= awardEndTime) {
                    this.$bkNotify({
                        theme: 'warning',
                        message: '开始时间应该早于截止时间'
                    })
                    return null
                }
                return this.$refs['NewAwardForm'].validate()
            },
            /**
             * 获取这个组件中的表单信息
             * */
            async getFields () {
                const valid = await this.validator()
                console.log('valid', valid)
                if (valid) {
                    return this.awardForm
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
            }

        }
    }
</script>
<style>
    @import "./index.css";
</style>
