<template>
    <div class="example1-wrapper">
        <!-- <div class="inner">
            <div class="item">
                <p>测试ajax get post 请求</p>
                <bk-button type="default" @click="btn1">btn1（get）</bk-button>
                <p>{{btn1Msg}}</p>
                <bk-button type="default" @click="btn2">btn2（post）</bk-button>
                <p>{{btn2Msg}}</p>
            </div>
        </div>
        <div class="inner">
            <div class="item">
                <p>获取 user 信息</p>
                <bk-button type="default" @click="getUser">getUser</bk-button>
            </div>
            <div class="item">
                <p>{{userInfo}}</p>
            </div>
        </div> -->
        <div>
            <!-- <div>
                <bk-button theme="primary" @click="toggleTableSize">修改size</bk-button>
                <span class="ml10">当前尺寸：{{size}}</span>
            </div>
            <div class="mt10 f12">Table 的尺寸, 可用于控制表格显示文本的最大行数——small(1行) / medium(2行) / large(3行)。</div> -->
            <bk-table style="margin-top: 15px;"
                :data="data"
                :size="size"
                :pagination="pagination"
                @row-mouse-enter="handleRowMouseEnter"
                @row-mouse-leave="handleRowMouseLeave"
                @page-change="handlePageChange"
                @page-limit-change="handlePageLimitChange">
                <!-- <bk-table-column type="selection" width="60"></bk-table-column> -->
                <bk-table-column label="奖项名称" prop="award_name"></bk-table-column>
                <bk-table-column label="奖项级别" prop="class"></bk-table-column>
                <bk-table-column label="接口人(可咨询奖项相关信息)" prop="director"></bk-table-column>
                <bk-table-column label="开始申请时间" prop="create_time"></bk-table-column>
                <bk-table-column label="截止申请时间" prop="deadline"></bk-table-column>
                <!-- <bk-table-column type="index" label="序列" width="60"></bk-table-column>
                <bk-table-column label="名称/内网IP" prop="ip"></bk-table-column>
                <bk-table-column label="来源" prop="source"></bk-table-column>
                <bk-table-column label="状态" prop="status"></bk-table-column>
                <bk-table-column label="创建时间" prop="create_time"></bk-table-column> -->
                <bk-table-column label="操作" width="150">
                    <template slot-scope="props">
                        <bk-button class="mr10" theme="primary" text :disabled="props.row.status === '创建中'" @click="apply(props.row)">申请</bk-button>
                        <bk-button class="mr10" theme="primary" text @click="remove(props.row)">详情</bk-button>
                        <bk-popover class="dot-menu" placement="bottom-start" theme="dot-menu light" trigger="click" :arrow="false" offset="15" :distance="0">
                            <!-- <span class="dot-menu-trigger"></span>
                            <ul class="dot-menu-list" slot="content">
                                <li class="dot-menu-item">导入</li>
                                <li class="dot-menu-item">导出</li>
                            </ul> -->
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
                        // ip: '192.168.0.1',
                        // source: 'QQ',
                        // status: '创建中',
                        // create_time: '2018-05-25 15:02:24'
                        // children: [
                        //     {
                        //         name: '用户管理',
                        //         count: '23',
                        //         creator: 'person2',
                        //         create_time: '2017-10-10 11:12',
                        //         desc: '用户管理'
                        //     },
                        //     {
                        //         name: '模块管理',
                        //         count: '2',
                        //         creator: 'person1',
                        //         create_time: '2017-10-10 11:12',
                        //         desc: '无数据测试'
                        //     }
                        // ]
                    },
                    {
                        award_name: '全国大学生数学建模竞赛',
                        class: '部门',
                        director: '奖项负责人',
                        create_time: '2018-05-25 15:02:24',
                        deadline: '2018-05-25 15:02:24'
                        // ip: '192.168.0.1',
                        // source: 'QQ',
                        // status: '创建中',
                        // create_time: '2018-05-25 15:02:24'
                        // children: [
                        //     {
                        //         name: '用户管理',
                        //         count: '23',
                        //         creator: 'person2',
                        //         create_time: '2017-10-10 11:12',
                        //         desc: '用户管理'
                        //     },
                        //     {
                        //         name: '模块管理',
                        //         count: '2',
                        //         creator: 'person1',
                        //         create_time: '2017-10-10 11:12',
                        //         desc: '无数据测试'
                        //     }
                        // ]
                    }
                    // {
                    //     ip: '192.168.0.2',
                    //     source: '微信',
                    //     status: '正常',
                    //     create_time: '2018-05-25 15:02:24',
                    //     children: [
                    //         {
                    //             name: '用户管理',
                    //             count: '23',
                    //             creator: 'person2',
                    //             create_time: '2017-10-10 11:12',
                    //             desc: '用户管理'
                    //         },
                    //         {
                    //             name: '模块管理',
                    //             count: '2',
                    //             creator: 'person1',
                    //             create_time: '2017-10-10 11:12',
                    //             desc: '无数据测试'
                    //         }
                    //     ]
                    // },
                    // {
                    //     ip: '192.168.0.3',
                    //     source: 'QQ',
                    //     status: '创建中',
                    //     create_time: '2018-05-25 15:02:24',
                    //     children: [
                    //         {
                    //             name: '用户管理',
                    //             count: '23',
                    //             creator: 'person2',
                    //             create_time: '2017-10-10 11:12',
                    //             desc: '用户管理'
                    //         },
                    //         {
                    //             name: '模块管理',
                    //             count: '2',
                    //             creator: 'person1',
                    //             create_time: '2017-10-10 11:12',
                    //             desc: '无数据测试'
                    //         }
                    //     ]
                    // }
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
