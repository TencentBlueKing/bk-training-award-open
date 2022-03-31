<template>
    <div class="detail-form-container">
        <bk-container :col="12">
            <bk-row class="mt15">

                <bk-col :span="6">
                    <span>奖项名称:</span>
                    <bk-input v-model="awardForm['award_name']"
                        :disabled="true"
                        style="width: auto"
                        placeholder="奖项名"
                        ext-cls="detail-input"
                        :title="awardForm['award_name']"
                    ></bk-input>
                </bk-col>

                <bk-col :span="6">
                    <span>接口人:</span>
                    <bk-input v-model="awardForm['award_consultant_displayname']"
                        ext-cls="detail-input"
                        placeholder="接口人"
                        style="width: auto"
                        :disabled="true"
                        :title="awardForm['award_consultant_displayname']"
                    >
                    </bk-input>
                </bk-col>
            </bk-row>
            <bk-row class="mt15">

                <bk-col :span="6">
                    <span>所属组织:</span>
                    <bk-input v-model="awardForm['award_department_fullname']"
                        :disabled="true"
                        placeholder="所属组织"
                        style="width: auto"
                        ext-cls="detail-input"
                        :title="awardForm['award_department_fullname']"
                    ></bk-input>
                </bk-col>
            </bk-row>
            <bk-row class="mt15">
                <bk-col :span="6">
                    <span>奖项要求:</span>
                </bk-col>
                <bk-col :span="6">
                    <span>奖项描述:</span>
                </bk-col>
            </bk-row>
            <bk-row class="mt15">
                <bk-col :span="6">
                    <bk-input
                        :type="'textarea'"
                        :rows="3"
                        v-model="awardForm['award_demand']"
                        :disabled="true"
                        placeholder="奖项要求"
                        ext-cls="detail-input"
                        style="width: calc(2*118px + 8px)"
                        :title="awardForm['award_demand']"
                    ></bk-input>
                </bk-col>
                <bk-col :span="6">
                    <bk-input
                        :type="'textarea'"
                        :rows="3"
                        v-model="awardForm['award_description']"
                        :disabled="true"
                        placeholder="奖项描述"
                        ext-cls="detail-input"
                        style="width: calc(2*118px + 8px)"
                        :title="awardForm['award_description']"
                    ></bk-input>
                </bk-col>
            </bk-row>

            <bk-row class="mt15">
                <bk-col :span="12">
                    <span>开放申请时间段:</span>
                </bk-col>
            </bk-row>
            <bk-row class="mt15">
                <bk-col :span="6">
                    <bk-input v-model="awardForm['time_range']"
                        :disabled="true"
                        placeholder="开放申请时间段"
                        ext-cls="detail-input"
                        style="width: calc(2*118px + 8px)"
                        :title="awardForm['time_range']"
                    ></bk-input>
                </bk-col>
            </bk-row>
            <bk-row class="mt15">
                <bk-col :span="12">
                    <span class="title"> 审批轮次: 1.xxx 2.xxx</span>
                </bk-col>
            </bk-row>
            <bk-row class="review-container mt15"
            >
                <bk-col :span="12">
                    <ul class="reviewer-list">
                        <li v-for="(item,index) in awardForm['reviewers']"
                            :key="item.uuid"
                            class="item mb15"
                        >
                            <span class="mr10"> 第 {{ index + 1 }} 轮</span>
                            <select-search
                                :value.sync="item.value"
                                placeholder="请选择评审人"
                                :disabled="true"
                                :id-key="'username'"
                                :title="item.value.join(',')"
                            >
                            </select-search>
                        </li>
                    </ul>
                </bk-col>
            </bk-row>

        </bk-container>
    </div>
</template>

<script>

    import { getAwardById } from '@/api/service/award-service'
    import { formatDate } from '@/common/util'

    let uuid = 0
    export default {
        name: 'detail-info',
        data () {
            return {
                awardForm: {
                    id: '',
                    award_name: '',
                    award_description: '',
                    award_department_id: '',
                    award_department_fullname: '',
                    award_reviewers: '',
                    award_consultant: '',
                    award_consultant_displayname: '',
                    award_demand: '',
                    start_time: '',
                    end_time: '',
                    approval_state: ''
                }
            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            /**
             * 周期的初始化函数
             * */
            handleInit () {
                const detailAwardId = this.$route.query['award_id']
                this.handleGetAwardDetailById(detailAwardId)
            },
            handleGetAwardDetailById (awardId) {
                if (awardId) {
                    return getAwardById(awardId).then(awardDetail => {
                        const detail = awardDetail.data
                        try {
                            detail['time_range'] = `${formatDate(detail['start_time'])}~${formatDate(detail['end_time'])}`
                            detail['reviewers'] = detail['award_reviewers'].map(item => {
                                return {
                                    uuid: uuid++,
                                    value: item
                                }
                            })
                            detail['award_consultant_displayname'] = `${detail['award_consultant']}（${detail['award_consultant_displayname']}）`
                        } catch (e) {
                            console.error(e)
                        }
                        this.awardForm = detail
                    })
                }
            }
        }
    }
</script>

<style scoped>
.detail-form-container {
  padding: 2px;
}

.review-container {
  overflow-y: scroll;
  height: 200px;

   &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-thumb {
        height: 5px;
        border-radius: 2px;
        background-color: #e6e9ea;
    }
  .reviewer-list {
    .item {
      display: flex;
      align-items: center;
    }
  }
}
</style>
