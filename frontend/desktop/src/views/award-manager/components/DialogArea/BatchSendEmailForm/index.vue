<template>
    <div class="batch-send-email-container">
        <!-- 表单主体 -->
        <bk-container :col="12" ext-cls="form-container" :gutter="4">
            <bk-row>
                <bk-col :span="2">
                    <label class="input-label">日期</label>
                </bk-col>
                <bk-col :span="10">
                    <bk-date-picker v-model="initDateTime"
                        style="width: 100%;"
                        :placeholder="'选择日期时间'"
                        :type="'datetime'"
                    ></bk-date-picker>
                </bk-col>
            </bk-row>

            <bk-row>
                <bk-col :span="2">
                    <label class="input-label">知会人</label>
                </bk-col>
                <bk-col :span="10">
                    <bk-tag-input
                        v-model="tags"
                        :list="remainData"
                        placeholder="请选择知会人"
                        :trigger="'focus'"
                        :allow-next-focus="false"
                        :has-delete-icon="true"
                        save-key="$index"
                        search-key="awardName"
                        display-key="awardName"
                    >
                    </bk-tag-input>
                </bk-col>
            </bk-row>
            <bk-row>
                <bk-col :span="2">
                    <label class="input-label">邮件主题</label>
                </bk-col>
                <bk-col :span="10">
                    <bk-input v-model="formData.name"
                        placeholder="请输入邮件主题"
                    >
                    </bk-input>
                </bk-col>
            </bk-row>
            <bk-row>
                <bk-col :span="2">
                    <label class="input-label">协同编辑人</label>
                </bk-col>
                <bk-col :span="10">
                    <bk-tag-input
                        v-model="tags"
                        :list="remainData"
                        placeholder="请选择协同编辑人"
                        :trigger="'focus'"
                        :allow-next-focus="false"
                        :has-delete-icon="true"
                        save-key="$index"
                        search-key="awardName"
                        display-key="awardName"
                    >
                    </bk-tag-input>
                </bk-col>
            </bk-row>
            <bk-row>
                <bk-col :span="3">
                    <label class="input-label em">邮件正文</label>
                </bk-col>
            </bk-row>
            <bk-row>
                <bk-col :span="12">
                    <Editor :content="formData.emailText"></Editor>
                </bk-col>
            </bk-row>
        </bk-container>
    <!-- /表单主体 -->
    </div>
</template>
<script>
    import { getRawTable } from '../../CustomTable/utils'
    export default {
        name: 'notification-form',
        components: {
            Editor: () => import('../../Editor')
        },
        props: {
            selectData: {
                type: Array,
                default: []
            }
        },
        data () {
            return {
                theadList: [
                    { label: '奖项名称', prop: 'awardName' },
                    { label: '评审周期', prop: 'bonus' },
                    { label: '导向', prop: 'committer' },
                    { label: '接口人', prop: 'interface' }
                ],
                formData: {
                    name: '',
                    content: '',
                    emailText: ''
                }
            }
        },
        computed: {
            externalData () {
                const selectData = this.selectData
                const theadList = this.theadList

                return getRawTable(theadList, selectData)
            }
        },
        beforeMount () {
            this.formData.emailText = this.externalData
            console.log('externalData', this.externalData)
        }
    }
</script>
<style>
@import "./index.css";
</style>
