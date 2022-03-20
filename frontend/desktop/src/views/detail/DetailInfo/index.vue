<template>
    <div class="detail-form-container">
        <bk-divider align="center">基本信息</bk-divider>
        <bk-form :label-width="140"
            form-type="horizontal"
            ext-cls="detail-form"
        >
            <bk-form-item label="奖项名">
                <bk-input v-model="awardForm['award_name']"
                    :disabled="true"
                    style="width: auto"
                    placeholder="奖项名"
                    ext-cls="detail-input"
                    :title="awardForm['award_name']"
                ></bk-input>
            </bk-form-item>
            <bk-form-item label="所属组织">
                <bk-input v-model="awardForm['award_department_fullname']"
                    :disabled="true"
                    style="width: auto"
                    placeholder="所属组织"
                    ext-cls="detail-input"
                    :title="awardForm['award_department_fullname']"
                ></bk-input>
            </bk-form-item>
            <bk-form-item label="接口人">
                <bk-input v-model="awardForm['award_consultant_displayname']"
                    ext-cls="detail-input"
                    style="width: auto"
                    placeholder="接口人"
                    :disabled="true"
                    :title="awardForm['award_consultant_displayname']"
                >
                </bk-input>
            </bk-form-item>
            <!--            <bk-form-item label="奖项级别">-->
            <!--                <bk-input v-model="awardForm['award_level']"-->
            <!--                    :disabled="true"-->
            <!--                    placeholder="奖项级别"-->
            <!--                    ext-cls="detail-input"-->
            <!--                ></bk-input>-->
            <!--            </bk-form-item>-->
            <bk-form-item label="开放申请时间段"
                :label-width="140"
            >
                <bk-input v-model="awardForm['time_range']"
                    :disabled="true"
                    placeholder="开放申请时间段"
                    ext-cls="detail-input"
                    style="width: calc(2*118px + 8px)"
                    :title="awardForm['time_range']"
                ></bk-input>
            </bk-form-item>
            <bk-form-item label="奖项描述">
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
            </bk-form-item>
            <bk-form-item label="奖项要求">
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
            </bk-form-item>
        </bk-form>
    </div>
</template>

<script>

    import { getAwardById } from '@/api/service/award-service'
    import { formatDate } from '@/common/util'
    export default {
        name: 'detail-info',
        components: { },
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
</style>
