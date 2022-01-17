<template>
    <div class="">
        <div>
            <bk-table style="margin-top: 15px;"
                :data="data"
                :size="size"
                :pagination="pagination"
                @row-mouse-enter="handleRowMouseEnter"
                @row-mouse-leave="handleRowMouseLeave"
                @page-change="handlePageChange"
                @page-limit-change="handlePageLimitChange">
                <bk-table-column label="奖项名称" prop="award_name" width="350"></bk-table-column>
                <bk-table-column label="申请时间" prop="create_time" width="350"></bk-table-column>
                <bk-table-column label="状态">
                    <template slot-scope="props">
                        <span class="status" style="background-color: rgb(86, 137, 203)" v-if="props.row.status === '待审核'">{{props.row.status}}</span>
                        <span class="status" style="background-color: rgb(80, 176, 122)" v-if="props.row.status === '已通过'">{{props.row.status}}</span>
                        <span class="status" style="background-color: rgb(234, 81, 81)" v-if="props.row.status === '不通过'">{{props.row.status}}</span>
                        <span class="status" style="background-color: rgb(255, 149, 181)" v-if="props.row.status === '草稿'">{{props.row.status}}</span>
                    </template>
                </bk-table-column>
                <bk-table-column label="操作">
                    <template slot-scope="props">
                        <bk-button class="mr10" v-if="props.row.status === '待审核'" theme="primary" text @click="reset(props.row)">撤回申请</bk-button>
                        <bk-button class="mr10" v-if="props.row.status === '草稿'" theme="primary" text @click="remove(props.row)">发起申请</bk-button>
                        <bk-button class="mr10" v-if="props.row.status === '草稿'" theme="primary" text @click="remove(props.row)">编辑申请</bk-button>
                        <bk-button class="mr10" v-if="props.row.status === '已通过'" theme="primary" text @click="remove(props.row)" :disabled="true" style="color: black;">--</bk-button>
                        <bk-button class="mr10" v-if="props.row.status === '不通过'" theme="primary" text @click="remove(props.row)">重新申请</bk-button>
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
                userInfo: null,
                size: 'small',
                departValue: '',
                data: [
                    {
                        award_name: '全国大学生数学建模竞赛',
                        status: '待审核',
                        create_time: '2018-05-25 15:02:24'
                    },
                    {
                        award_name: '全国大学生数学建模竞赛',
                        status: '已通过',
                        create_time: '2018-05-25 15:02:24'
                    },
                    {
                        award_name: '全国大学生数学建模竞赛',
                        status: '不通过',
                        create_time: '2018-05-25 15:02:24'
                    },
                    {
                        award_name: '全国大学生数学建模竞赛',
                        status: '草稿',
                        create_time: '2018-05-25 15:02:24'
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
            reset (item) {
                console.log(item)
            }
        }
    }
</script>

<style scoped>
    @import './index.css';
</style>
