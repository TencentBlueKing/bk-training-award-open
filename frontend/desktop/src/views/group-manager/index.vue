<template>
    <div class="group-manager-container">
        <self-dialog v-model="transferMyGroup"
            @confirm="handleTransferCurGroup"
        >
            <div slot="title">
                <p style="font-size: 18px">
                    移交小组
                </p>
                <p style="font-size: 12px"> 请再次输入小组名 <span class="bk-text-danger" v-bk-copy="$bus.curGlobalSelectedGroup['full_name']">{{ $bus.curGlobalSelectedGroup['full_name'] }}</span> 以确认移交</p>
            </div>
            <bk-form :label-width="100"
                ref="transfer-form"
                :rules="transferFormRules"
                :model="transferFormRules"
            >
                <bk-form-item label="确认小组名"
                    :required="true"
                    :property="'full_name'"
                >
                    <bk-input v-model="transferForm['full_name']"
                        :placeholder="$bus.curGlobalSelectedGroup['full_name']"
                        @click="$refs['popover'].showHandler()"
                    ></bk-input>
                </bk-form-item>
                <bk-form-item label="移交对象"
                    :required="true"
                    :property="'target_username'"
                >
                    <select-search
                        type="self"
                        :data="tableData"
                        :id-key="'username'"
                        :display-key="'display_name_for_display'"
                        :multiple="false"
                        placeholder="请选择组内成员转交权限"
                        :value.sync="transferForm['target_username']"
                    ></select-search>
                </bk-form-item>
            </bk-form>
        </self-dialog>
        <self-dialog v-model="isOutCurGroup"
            @confirm="handleOutCurGroup"
        >
            <div slot="title">
                <p style="font-size: 18px">
                    退出小组
                </p>
                <p style="font-size: 12px">
                    请再次输入小组名
                    <span class="bk-text-danger" v-bk-copy="$bus.curGlobalSelectedGroup['full_name']">
                        {{ $bus.curGlobalSelectedGroup['full_name'] }}
                    </span>
                    以确认移交
                </p>
            </div>
            <bk-form :label-width="100"
                :rules="outCurGroupFormRules"
                :model="outCurGroupForm"
            >
                <bk-form-item label="退出该小组"
                    :required="true"
                >
                    <bk-input v-model="outCurGroupForm['full_name']"
                        :placeholder="$bus.curGlobalSelectedGroup['full_name']"
                    ></bk-input>
                </bk-form-item>
            </bk-form>
        </self-dialog>
        <!--      弹框区-->
        <top-back></top-back>
        <!--      偏上操作栏-->
        <div class="controller-panel mt20 mb15">
            <select-search behavior="simplicity"
                style="width: calc(2*118px + 1*8px);font-size: 15px;"
                :id-key="'group_id'"
                type="group"
                :multiple="false"
                placeholder="请选择需要查看的小组"
                :clearable="false"
                :value.sync="$bus.curGlobalGroupId"
                @change="handleInit($event)"
            ></select-search>
            <div class="button-panel">
                <bk-button theme="success" @click="toJoinGroup()">加入小组</bk-button>
                <bk-button theme="primary" @click="toCreateGroup()">创建小组</bk-button>
                <bk-dropdown-menu ref="dropdown">
                    <div class="dropdown-trigger-btn"
                        slot="dropdown-trigger">
                        <bk-button theme="danger">更多操作 <i :class="['bk-icon icon-angle-down']"></i></bk-button>

                    </div>
                    <ul class="more-action" slot="dropdown-content">
                        <!-- TODO:邀请入组-->
                        <bk-button class="mb10"
                            @click="toTransferGroup()"
                            v-if="$bus.isCurGroupAdmin"
                            :text="true"
                        >移交小组
                        </bk-button>
                        <bk-button class="mb10"
                            @click="toOutCurGroup()"
                            v-else
                            :text="true"
                        >退出小组
                        </bk-button>
                    </ul>
                </bk-dropdown-menu>
            </div>
        </div>
        <!--      操作区域-->
        <tabs>
            <self-table :data="tableData"
                :loading="loading"
            >
                <bk-table-column type="index"
                    label="序号"
                    :width="80"
                ></bk-table-column>

                <bk-table-column
                    label="姓名"
                    :width="200"
                >
                    <template slot-scope="people">
                        <span>{{ people.row['display_name'] }}</span>
                    </template>
                </bk-table-column>
                <bk-table-column
                    label="用户名"
                    :width="200"
                >
                    <template slot-scope="people">
                        <span>{{ people.row['username'] }}</span>
                    </template>
                </bk-table-column>

                <bk-table-column
                    label="手机号"
                >
                    <template slot-scope="people">
                        <span>{{ people.row['phone'] }}</span>
                    </template>
                </bk-table-column>
                <bk-table-column
                    label="邮箱"
                >
                    <template slot-scope="people">
                        <span>{{ people.row['email'] }}</span>

                    </template>
                </bk-table-column>
                <bk-table-column label="操作"
                    fix="right"
                >
                    <template slot-scope="people">
                        <bk-popconfirm trigger="click"
                            width="280"
                            @confirm="toRemoveUser(people.row)"
                            :disabled="!$bus.isCurGroupAdmin || people.row['username'] === $store.state.user['username']"
                        >
                            <div slot="content">
                                <div class="demo-custom">
                                    <i class="bk-icon icon-info-circle-shape pr5 content-icon" style="color: #cc1111"></i>
                                    <span class="content-text">注意: 将会移除该成员</span>
                                </div>
                            </div>
                            <bk-button theme="primary"
                                :outline="true"
                                :text="true"
                                :disabled="!$bus.isCurGroupAdmin || people.row['username'] === $store.state.user['username']"
                            >
                                移除
                            </bk-button>
                        </bk-popconfirm>
                    </template>
                </bk-table-column>
            </self-table>
        </tabs>
    </div>
</template>
<script>
    import { tableMixins } from '@/common/mixins/tableMixins'
    import { deleteGroupManage, deleteGroupUser, getGroupUser, putGroupManage } from '@/api/service/group-service'
    import { APP_GROUP_DIALOG, GROUP_MANAGER_ROUTE_PATH } from '@/constants'
    import { formatUsernameAndDisplayName, setTitle } from '@/common/util'

    export default {
        name: GROUP_MANAGER_ROUTE_PATH,
        mixins: [tableMixins],
        data (self) {
            return {
                remoteData: [],
                groupTabItems: [],
                groupCurIndexStatus: '',
                // 移交小组表单及配置
                transferMyGroup: false,
                transferForm: {
                    full_name: '',
                    target_username: ''
                },
                transferFormRules: Object.freeze({
                    full_name: [
                        {
                            required: true,
                            message: '请输入您想移交的小组名',
                            trigger: 'blur'
                        },
                        {
                            message: '请正确输入您想移交的小组名',
                            trigger: 'blur',
                            validator () {
                                return self.$bus.curGlobalSelectedGroup['full_name'] === self.transferForm['full_name']
                            }
                        }
                    ],
                    target_username: [
                        {
                            required: true,
                            message: '请选择你想转交给的用户',
                            trigger: 'blur'
                        }
                    ]
                }),
                // 退出当前组表单
                isOutCurGroup: false,
                outCurGroupForm: {},
                outCurGroupFormRules: Object.freeze({
                    full_name: [
                        {
                            required: true,
                            message: '请输入您想退出的小组名',
                            trigger: 'blur'
                        },
                        {
                            message: '请正确输入您想退出的小组名',
                            trigger: 'blur',
                            validator () {
                                return self.$bus.curGlobalSelectedGroup['full_name'] === self.outCurGroupForm['full_name']
                            }
                        }
                    ]
                }),
                //    邀请入组表单
                isInviteUser: false,
                isInviteUserForm: {}
            }
        },
        computed: {
            tableData (self) {
                const remoteData = self.remoteData
                return remoteData?.map?.((rawData) => {
                    const username = rawData['username']
                    const displayName = rawData['display_name']
                    return {
                        display_name: rawData['display_name'],
                        email: rawData['email'],
                        phone: rawData['phone'],
                        user_id: rawData['user_id'],
                        username: rawData['username'],
                        display_name_for_display: formatUsernameAndDisplayName(username, displayName)
                    }
                }) ?? []
            }
        },
        created () {
            this.handleInit()
        },
        methods: {
            /**
             *  初始化函数
             * */
            handleInit () {
                Promise.all(
                    [
                        this.handleGetPageData()
                    ]
                )
                setTitle('我的小组')
            },
            /**
             * @param target 需要移交的对象
             * @return {any}
             * */
            toRemoveUser (target) {
                const { username } = target
                const params = {
                    username,
                    group_id: this.$bus.curGlobalGroupId
                }
                this.loading = true
                return deleteGroupManage(params).then(_ => {
                    this.handleInit()
                    this.messageSuccess('移除成功')
                })
            },
            handleGetPageData () {
                if (this.loading) return
                this.loading = true
                const curGlobalGroupId = this.$bus.curGlobalGroupId
                const params = {
                    groupId: curGlobalGroupId
                }
                if (!curGlobalGroupId) return
                return getGroupUser(params).then(res => {
                    this.remoteData = res.data
                }).finally(_ => {
                    this.loading = false
                })
            },
            // 做弹出型
            toJoinGroup () {
                this.$bus.$emit(APP_GROUP_DIALOG, [true, true, 'join'])
            },
            toCreateGroup () {
                this.$bus.$emit(APP_GROUP_DIALOG, [true, true, 'create'])
            },
            toTransferGroup () {
                this.transferMyGroup = true
            },
            toOutCurGroup () {
                this.isOutCurGroup = true
            },

            async transferValidator () {
                const transferValidator = this.$refs['transfer-form']
                return transferValidator.validate()
            },
            async handleTransferCurGroup () {
                const validator = await this.transferValidator()
                if (!validator) {
                    return
                }
                const params = this.transferForm
                const action = await putGroupManage({
                    group_id: this.$bus.curGlobalGroupId,
                    username: params['target_username']
                }).then(_ => {
                    this.transferMyGroup = true
                    this.messageSuccess('转让组 ' + this.$bus.curGlobalSelectedGroup['full_name'] + ' 给' + params['target_username'] + '成功')
                    setTimeout(() => this.$router.go(0), 100)
                    return true
                })
                return action
            },
            handleOutCurGroup () {
                const curGroupName = this.$bus.curGlobalGroupId
                const params = {
                    group_id: curGroupName
                }
                return deleteGroupUser(params).then(_ => {
                    this.messageSuccess('退出成功')
                    this.isOutCurGroup = false
                    setTimeout(() => this.$router.go(0), 100)
                    return true
                })
            }
        }
    }
</script>

<style lang="postcss" scoped>
.group-manager-container {
  margin: 0 auto;
  width: 80%;

  .controller-panel {
    display: flex;
    justify-content: space-between;
  }

  .more-action {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}
</style>
