<template>
    <div class="">
        <div>
            <span class="depart-name" style="margin-right: 10px">部门名称</span>
            <bk-search-select clearable :show-popover-tag-change="true" placeholder="请输入部门名称" style="display: inline-block;width: 150px;" v-model="value"></bk-search-select>
            <span class="depart-name" style="margin-left: 30px;margin-right: 10px">奖项名称</span>
            <bk-search-select clearable :show-popover-tag-change="true" placeholder="请输入奖项名称" style="display: inline-block;width: 200px;" v-model="value"></bk-search-select>
        </div>
        <div>
            <bk-table style="margin-top: 30px;"
                :data="data"
                :size="size"
                :pagination="pagination"
                @row-mouse-enter="handleRowMouseEnter"
                @row-mouse-leave="handleRowMouseLeave"
                @page-change="handlePageChange"
                @page-limit-change="handlePageLimitChange">
                <bk-table-column label="奖项名称" prop="award_name"></bk-table-column>
                <bk-table-column label="评审周期" prop="period"></bk-table-column>
                <bk-table-column label="奖项级别" prop="class"></bk-table-column>
                <bk-table-column label="开始申请时间" prop="create_time"></bk-table-column>
                <bk-table-column label="截止申请时间" prop="end_time"></bk-table-column>
                <bk-table-column label="操作" width="150">
                    <template slot-scope="props">
                        <bk-button class="mr10" theme="primary" text @click="check(props.row)">评审</bk-button>
                    </template>
                </bk-table-column>
            </bk-table>
        </div>
    </div>
</template>

<script>
    import { bkSearchSelect, bkTable, bkTableColumn, bkButton } from 'bk-magic-vue'
    export default {
        components: {
            bkTable,
            bkTableColumn,
            bkButton,
            bkSearchSelect
        },
        data () {
            return {
                userInfo: null,
                size: 'small',
                departValue: '',
                data: [
                    {
                        award_name: '全国大学生数学建模竞赛',
                        status: '待审核',
                        period: '季度',
                        class: '部门',
                        create_time: '2018-05-25 15:02:24',
                        end_time: '2018-05-25 15:02:24'
                    },
                    {
                        award_name: '全国大学生数学建模竞赛',
                        status: '已通过',
                        period: '季度',
                        class: '部门',
                        create_time: '2018-05-25 15:02:24',
                        end_time: '2018-05-25 15:02:24'
                    },
                    {
                        award_name: '全国大学生数学建模竞赛',
                        status: '不通过',
                        class: '部门',
                        period: '季度',
                        create_time: '2018-05-25 15:02:24',
                        end_time: '2018-05-25 15:02:24'
                    },
                    {
                        award_name: '全国大学生数学建模竞赛',
                        status: '草稿',
                        period: '季度',
                        class: '部门',
                        create_time: '2018-05-25 15:02:24',
                        end_time: '2018-05-25 15:02:24'
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
            remove (item) {
                console.log(item)
            },
            check (item) {
                console.log(item)
                this.$router.push({
                    name: 'checkpage'
                })
            }
        }
    }
</script>

<style scoped>
    @import './index.css';
</style>
