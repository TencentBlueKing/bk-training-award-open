/**
 * @file event bus
 * @author wheel-w
 */

import Vue from 'vue'
import http from '@/api'
import store from '@/store/index'

import { getGroup, getGroupUser } from '@/api/service/group-service'
import { GROUP_KEYNAME, GROUP_USERS_KEYNAME } from '@/constants'
import { formatUsernameAndDisplayName } from '@/common/util'

// Use a bus for components communication,
// see https://vuejs.org/v2/guide/components.html#Non-Parent-Child-Communication
export const bus = new Vue({
    data () {
        return {
            curGlobalGroupId: null,
            groupList: [],
            // header 状态
            headerName: '',
            isNewer: false,
            count: -1
        }
    },
    computed: {
        curGlobalSelectedGroup: {
            get (self) {
                const map = {}
                const groups = self.groupList
                groups?.forEach(group => {
                    group['secretary_display_name_for_dispaly'] = formatUsernameAndDisplayName(group['secretary'], group['secretary_display_name'])
                    map[group['group_id']] = group
                })
                return map?.[self.curGlobalGroupId] ?? {}
            }
        },
        isCurGroupAdmin (self) {
            return self.curGlobalSelectedGroup?.['secretary'] === store.state.user['username']
        },
        curGroupUsers (self) {
            const groupId = self.curGlobalGroupId

            return self.$http.cache.get(GROUP_USERS_KEYNAME + groupId)
        }
    },
    watch: {
        curGlobalGroupId () {
            this.handleGetGroupUserList()
        }
    },
    async created () {
        await this.handleGetGroupList()
    },
    methods: {
        // 获取组列表
        handleGetGroupList (config = {}) {
            return getGroup(config).then(response => {
                const groupList = response.data
                this.groupList = groupList
                this.curGlobalGroupId = groupList?.[0]?.['group_id']
                http.cache.set(GROUP_KEYNAME, groupList)
                return Promise.resolve(groupList)
            })
        },
        handleGetGroupUserList () {
            const groupId = this.curGlobalGroupId
            return getGroupUser({ groupId }).then(response => {
                const responseData = response.data
                if (!responseData) {
                    this.messageWarn('出错啦')
                    return
                }
                responseData.forEach(item => {
                    item['display_name_for_display'] = formatUsernameAndDisplayName(
                        item['username'],
                        item['display_name']
                    )
                })
                http.cache.set(GROUP_USERS_KEYNAME + groupId, responseData)
            })
        }
    }
})
