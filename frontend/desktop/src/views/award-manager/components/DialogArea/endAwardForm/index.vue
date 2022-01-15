<template>
    <div class="end-award-container">
        <bk-button theme="primary" @click="toAddPrizewinner(!visible)" ext-cls="add-button"> 新增获奖人 </bk-button>
        <bk-table :data="tableData">
            <bk-table-column prop="prizewinner" label="获奖人"></bk-table-column>
            <bk-table-column label="评语">
                <template slot-scope="props">
                    <span :title="props.row['committer']" v-bk-overflow-tips>{{props.row['committer']}}文本溢出了怎么办呢，这貌似是一个小问题，那么这个是怎么判断的嫩</span>
                </template>
            </bk-table-column>
            <bk-table-column label="操作">
                <template slot-scope="props">
                    <bk-button :text="true" @click="toDelRow(props.row)">删除</bk-button>
                </template>
            </bk-table-column>
        </bk-table>
        <bk-dialog v-model="visible">
            <bk-form label-width="80">
                <bk-form-item label="获奖人">
                    <bk-select :disabled="false" v-model="value" style="width: 100%;"
                        ext-cls="select-custom"
                        ext-popover-cls="select-popover-custom"
                        placeholder="请选择获奖人"
                        searchable>
                        <bk-option v-for="option in list"
                            :key="option.id"
                            :id="option.id"
                            :name="option.name">
                        </bk-option>
                    </bk-select>
                </bk-form-item>
                <bk-form-item label="评语">
                    <bk-input placeholder="请输入评语"></bk-input>
                </bk-form-item>
            </bk-form>
        </bk-dialog>
    </div>
</template>
<script>

    export default {
        name: 'end-award-form',
        data () {
            return {
                // S 控制区
                visible: false,
                // E 控制区
                remoteData: new Array(10).fill({})
            }
        },
        computed: {
            tableData () {
                const tableData = this.remoteData.map(item => {
                    return {
                        prizewinner: '记得将转表格为虚拟或者其他',
                        committer: '测试评语会很长'
                    }
                })
                return tableData
            }

        },
        methods: {
            // 信息提示二次封装

            toDelRow (props) {
                this.$bkInfo({
                    title: '确认要删除？'
                })
            },
            toAddPrizewinner (visible) {
                this.visible = visible
            }
        }
    }
</script>
<style>
    @import "./index.css";
</style>
