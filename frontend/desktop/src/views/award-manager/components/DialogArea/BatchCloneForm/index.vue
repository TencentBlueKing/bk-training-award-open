<template>
    <!-- TODO: 与批量发送邮件代码抽离处理 -->
    <div class="batch-clone-container">
        <bk-container :col="12" flex :gutter="2">
            <bk-form :label-width="120">
                <bk-form-item label="已选奖项">
                    <bk-tag-input
                        v-model="tags"
                        :list="remainData"
                        :placeholder="placeholder"
                        :trigger="'focus'"
                        :allow-next-focus="false"
                        :has-delete-icon="true"
                        save-key="$index"
                        search-key="awardName"
                        display-key="awardName"
                    >
                    </bk-tag-input>
                </bk-form-item>
                <div style="height: 20px"></div>
                <bk-row>
                    <bk-col :span="6">
                        <bk-form-item :label-width="120" label="申请开始时间">
                            <bk-date-picker
                                style="width: 99.8%"
                                :placeholder="'选择日期时间'"
                                :type="'datetime'"
                            ></bk-date-picker>
                        </bk-form-item>
                    </bk-col>
                    <bk-col :span="6">
                        <bk-form-item :label-width="120" label="申请截止时间">
                            <bk-date-picker
                                style="width: 99.8%"
                                :placeholder="'选择日期时间'"
                                :type="'datetime'"
                            ></bk-date-picker>
                        </bk-form-item>
                    </bk-col>
                </bk-row>
                <div style="height: 20px"></div>

                <bk-form-item
                    v-for="row in selectedData"
                    :key="row.$index"
                    :label="row.awardName"
                >
                    <bk-input
                        v-model="row.modifyName"
                        width="auto"
                        :placeholder="'输入新的' + row.awardName + '的名称'"
                    ></bk-input>
                </bk-form-item>
            </bk-form>
        </bk-container>
    </div>
</template>
<script>
    export default {
        name: 'batch-clone',
        props: {
            formData: {
                type: Array,
                default () {
                    return []
                }
            },
            totalData: {
                type: Array,
                default () {
                    return []
                }
            }
        },
        data () {
            return {
                placeholder: '请选择奖项',
                selectedData: []
            }
        },
        computed: {
            tags: {
                get () {
                    return this.selectedData.map((item) => {
                        return item['$index']
                    })
                },
                set (newValue) {
                    this.selectedData = this.totalData.filter((item) => {
                        return newValue.includes(item['$index'])
                    })
                }
            },
            remainData () {
                const selectedData = this.selectedData
                const totalData = this.totalData
                const remainData = totalData.filter((item) => {
                    return !selectedData.includes(item['$index'])
                })
                return remainData
            }
        },
        mounted () {
            this.selectedData = [...this.formData]
        },
        methods: {
            selectToModify () {}
            // TODO: 转为点击追加
            // renderMemberTag (node, ctx, highlightKeyword) {
            //     return this.$createElement('bk-tag', {
            //         class: 'bk-selector-node bk-selector-member',
            //         domProps: { innerHTML: node.awardName },
            //         attrs: {
            //             checkable: true
            //         },
            //         checkable: true,
            //         checked: false,
            //         style: {
            //             margin: 0,
            //             padding: 0
            //         },
            //         on: {
            //             change () {
            //                 alert('as')
            //             }
            //         },
            //         nativeOn: {
            //             click: () => {
            //                 console.log('this->', node.$index)
            //             }
            //         }
            //     })
            // }
        }
    }
</script>
<style lang="postcss" scoped>
    @import "./index.css";
</style>
