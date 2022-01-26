<template>
    <div class="">
        <bk-dialog v-model="exampleSetting1.primary.visible"
            theme="primary"
            :mask-close="false"
            :header-position="exampleSetting1.primary.headerPosition"
            :title="exampleSetting1.primary.title"
            @confirm="clickconfirm"
            @cancel="cancel"
        >
            <template style="height: 30px;">
                <textarea rows="3" cols="45" style="margin-bottom: 15px;" :placeholder="exampleSetting1.primary.notify"></textarea>
            </template>
            {{exampleSetting1.primary.message}}
        </bk-dialog>
        <div>
            <span class="depart-name" style="margin-right: 10px">奖项名称</span>
            <span class="depart-name" style="margin-right: 10px;font-size: 17px">{{awardName}}</span>
        </div>
        <div>
            <bk-table style="margin-top: 15px;"
                :data="tableData"
                :size="size"
                :pagination="pagination"
                @page-change="handlePageChange"
                @page-limit-change="handlePageLimitChange">
                <bk-table-column type="index" label="序列" width="150"></bk-table-column>
                <bk-table-column label="申请人" prop="apply_user" width="200"></bk-table-column>
                <bk-table-column label="申报理由" prop="source" width="350"></bk-table-column>
                <bk-table-column label="申请材料" prop="materials" width="250">
                    <template slot-scope="props">
                        <bk-button class="mr10" theme="primary" text @click="reset(props.row)">{{props.row.materials}}</bk-button>
                    </template>
                </bk-table-column>
                <bk-table-column label="评审操作" width="150">
                    <template slot-scope="props">
                        <bk-button class="mr10" theme="primary" text :disabled="props.row.source === '创建中'" @click="consent(props.row)">通过</bk-button>
                        <bk-button class="mr10" theme="primary" text @click="disconsent(props.row)">不通过</bk-button>
                    </template>
                </bk-table-column>
            </bk-table>
        </div>
    </div>
</template>

<script>
    export default {
        components: {},
        data () {
            return {
                userInfo: null,
                size: 'small',
                departValue: '',
                awardName: '全国大学生数学建模大赛',
                remoteData: [
                    {
                        apply_user: '边成',
                        source: '公司',
                        materials: '材料1、材料二',
                        class: '部门',
                        create_time: '2018-05-25 15:02:24',
                        end_time: '2018-05-25 15:02:24',
                        text: ''
                    }
                ],
                pagination: {
                    current: 1,
                    count: 0,
                    limit: 10
                },
                mystyle: {
                    height: '15px',
                    width: '100%'
                },
                exampleSetting1: {
                    primary: {
                        visible: false,
                        headerPosition: 'left',
                        title: '',
                        message: '',
                        notify: '',
                        data: null
                    }
                }
            }
        },
        computed: {
            tableData () {
                const remoteData = this.remoteData
                if (!remoteData.map) {
                    return []
                }
                return remoteData.map(item => {
                    return {

                    }
                })
            }
        },
        created () {
        },
        methods: {
            /**
             * getUser
             */
            async getUser () {
                try {
                    const data = await this.$store.dispatch('userInfo', {}, { fromCache: true })
                    this.userInfo = Object.assign({}, data)
                } catch (e) {
                    console.error(e)
                }
            },
            handlePageLimitChange () {
                console.log('handlePageLimitChange', arguments)
            },
            toggleTableSize () {
                const size = ['small', 'medium', 'large']
                const index = (size.indexOf(this.size) + 1) % 3
                this.size = size[index]
            },
            handlePageChange (page) {
                this.pagination.current = page
            },
            /**
             * 点击评审通过
             */
            consent (item) {
                console.log(item)
                this.exampleSetting1.primary.data = item
                this.exampleSetting1.primary.title = '通过评审'
                this.exampleSetting1.primary.message = '请问是否确定评审通过?'
                this.exampleSetting1.primary.notify = ''
                this.exampleSetting1.primary.visible = true
            },
            /**
             * 点击评审不通过
             */
            disconsent (item) {
                console.log(item)
                this.exampleSetting1.primary.data = item
                this.exampleSetting1.primary.title = '不通过评审'
                this.exampleSetting1.primary.notify = '请输入审核失败的原因'
                this.exampleSetting1.primary.message = '请问是否确定评审不通过?'
                this.exampleSetting1.primary.visible = true
            },
            listChange (list) {
                console.log(list)
            },
            /**
             * 弹框确认键
             */
            clickconfirm () {

                // this.exampleSetting3.custom1.loading = true
                // this.exampleSetting3.custom1.timer = setInterval(() => {
                //     this.exampleSetting3.custom1.countdown -= 1
                //     if (this.exampleSetting3.custom1.countdown === 0) {
                //         this.exampleSetting3.custom1.visible = false
                //         this.exampleSetting3.custom1.loading = false
                //         clearInterval(this.exampleSetting3.custom1.timer)
                //     }
                // }, 1000)
            },
            /**
             * 弹框取消后
             */
            cancel () {
                console.log('cancel')
            }
        }
    }
</script>

<style scoped>
    @import './index.css';
    .number-virtual-scroll {
        height: 300px;
        width: 100%;
        color: #ffffff;
        font-family: Consolas, "Courier New", monospace;
        font-weight: normal;
        cursor: text;
        white-space: nowrap;
        letter-spacing: 0px;
        font-size: 12px;
        line-height: 16px;
        .item-txt {
            padding: 0 20px;
        }
    }
</style>
