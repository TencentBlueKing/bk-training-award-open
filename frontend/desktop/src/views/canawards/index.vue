<template>
    <div class="example1-wrapper">
        <div>
            <bk-table style="margin-top: 15px;"
                :data="data"
                :size="size"
                :pagination="pagination"
                @row-mouse-enter="handleRowMouseEnter"
                @row-mouse-leave="handleRowMouseLeave"
                @page-change="handlePageChange"
                @page-limit-change="handlePageLimitChange">
                <bk-table-column label="奖项名称" prop="award_name"></bk-table-column>
                <bk-table-column label="奖项级别" prop="class"></bk-table-column>
                <bk-table-column label="接口人(可咨询奖项相关信息)" prop="director"></bk-table-column>
                <bk-table-column label="开始申请时间" prop="create_time"></bk-table-column>
                <bk-table-column label="截止申请时间" prop="deadline"></bk-table-column>
                <bk-table-column label="操作" width="150">
                    <template slot-scope="props">
                        <bk-button class="mr10" theme="primary" text :disabled="props.row.status === '创建中'" @click="apply(props.row)">申请</bk-button>
                        <bk-button class="mr10" theme="primary" text @click="remove(props.row)">详情</bk-button>
                        <bk-popover class="dot-menu" placement="bottom-start" theme="dot-menu light" trigger="click" :arrow="false" offset="15" :distance="0">
                        </bk-popover>
                    </template>
                </bk-table-column>
            </bk-table>
        </div>
    </div>
</template>

<script>
    import { bkTable, bkTableColumn, bkButton, bkPopover } from 'bk-magic-vue'
    export default {
        components: {
            bkTable,
            bkTableColumn,
            bkButton,
            bkPopover
        },
        data () {
            return {
                btn1Msg: '',
                btn2Msg: '',
                userInfo: null,
                size: 'small',
                data: [
                    {
                        award_name: '全国大学生数学建模竞赛',
                        class: '部门',
                        director: '奖项负责人',
                        create_time: '2018-05-25 15:02:24',
                        deadline: '2018-05-25 15:02:24'
                    },
                    {
                        award_name: '全国大学生数学建模竞赛',
                        class: '部门',
                        director: '奖项负责人',
                        create_time: '2018-05-25 15:02:24',
                        deadline: '2018-05-25 15:02:24'
                    }
                ],
                pagination: {
                    current: 1,
                    count: 500,
                    limit: 20
                }
            }
        },
        created () {
        },
        methods: {
            /**
             * 获取页面数据
             *
             * @return {Promise} promise 对象
             */
            fetchPageData () {
            },

            /**
             * btn1
             */
            async btn1 () {
                this.$http.get('/test_get_or_post/').then(res => {
                    if (res.result) {
                        this.btn1Msg = res
                    }
                })
            },

            /**
             * btn2
             */
            async btn2 () {
                this.$http.post('/test_get_or_post/').then(res => {
                    if (res.result) {
                        this.btn2Msg = res
                    }
                })
            },
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
            apply (awardInfo) {
                console.log(awardInfo)
                this.$router.push({
                    name: 'detail'
                })
            }
        }
    }
</script>

<style scoped>
    @import './index.css';
</style>
