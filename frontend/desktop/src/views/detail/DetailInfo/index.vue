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
                    placeholder="奖项名"
                    ext-cls="detail-input"
                ></bk-input>
            </bk-form-item>
            <bk-form-item label="接口人">
                <bk-input v-model="awardForm['award_consultant']"
                    :disabled="true"
                    placeholder="接口人"
                    ext-cls="detail-input"
                ></bk-input>
            </bk-form-item>
            <bk-form-item label="奖项级别">
                <bk-input v-model="awardForm['award_level']"
                    :disabled="true"
                    placeholder="奖项级别"
                    ext-cls="detail-input"
                ></bk-input>
            </bk-form-item>
            <bk-form-item label="开始申请时间">
                <bk-input v-model="awardForm['start_time']"
                    :disabled="true"
                    placeholder="开始申请时间"
                    ext-cls="detail-input"
                ></bk-input>
            </bk-form-item>
            <bk-form-item label="截止申请时间">
                <bk-input v-model="awardForm['end_time']"
                    :disabled="true"
                    placeholder="截止申请时间"
                    ext-cls="detail-input"
                ></bk-input>
            </bk-form-item>
            <bk-form-item label="奖项描述">
                <bk-input
                    :type="'textarea'"
                    :rows="3"
                    v-model="awardForm['award_description']"
                    :disabled="true"
                    placeholder="奖项描述"
                    ext-cls="detail-input"
                ></bk-input>
            </bk-form-item>
        </bk-form>
    </div>
</template>

<script>

    export default {
        name: 'detail-info',
        props: {
            awardForm: {
                type: Object,
                default: () => ({
                    award_name: '',
                    award_consultant: '',
                    award_level: '',
                    start_time: '',
                    end_time: '',
                    award_description: ''
                })
            }
        },
        data () {
            return {}
        },
        methods: {
            /**
             * 周期的初始化函数
             * */
            handleInit () {

            }

        }
    }
</script>

<style scoped>
    .detail-form-container {
        .bk-form {
             /deep/ .bk-label {
                 padding: 0 24px 0 24px;
             }
        }
        .detail-input {
            width: 90%;
        }
    }
</style>
