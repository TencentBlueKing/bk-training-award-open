/**
 * @file event bus
 * @author wheel-w
 */

import Vue from 'vue'
import http from '@/api'
import { GROUP_KEYNAME, GROUP_USERS_KEYNAME } from '@/constants'
import { getGroup } from '@/api/service/group-service'
import store from '@/store/index'

// Use a bus for components communication,
// see https://vuejs.org/v2/guide/components.html#Non-Parent-Child-Communication
export const bus = new Vue({
    data () {
        return {
            curGlobalGroupId: '',
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
                    group['secretary_display_name_for_dispaly'] = group['secretary'] + '（' + group['secretary_display_name'] + '）'
                    map[group['group_id']] = group
                })
                return map?.[self.curGlobalGroupId] || {}
            }
        },
        isCurGroupAdmin (self) {
            return self.curGlobalSelectedGroup['secretary'] === store.state.user['username']
        },
        curGroupUsers (self) {
            const groupId = self.curGlobalGroupId
            return self.$http.cache.get(GROUP_USERS_KEYNAME + groupId)
        }
    },
    created () {
        this.handleGetGroupList()
    },
    methods: {
        // 获取组列表
        handleGetGroupList (config = {}) {
            const groupUsers = http.cache.get(GROUP_KEYNAME)
            if (groupUsers) {
                this.curGlobalGroupId = groupUsers?.[0]?.['group_id']
            }
            return getGroup(config).then(response => {
                http.cache.set(GROUP_KEYNAME, response.data)
                this.curGlobalGroupId = response.data?.[0]?.['group_id']
                this.groupList = response.data
                return Promise.resolve(response.data)
            })
        }
    }
})
