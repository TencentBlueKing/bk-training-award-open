/**
 * @file app store
 * @author couriourc
 */

import http from '@/api'
import { isDef } from '@/common/util'

/**
 * 组内人员模块 评审人选择等地方使用
 * */
export default {
    namespaced: true,
    state: {
        group: [],
        groupUsers: [],
        secretaries: []
    },
    mutations: {
        setUserManageListDpartments (state, group) {
            state.group = group
        },
        setUserManageListUsers (state, groupUsers) {
            if (!isDef(groupUsers)) {
                state.groupUsers = []
                return null
            }
            state.groupUsers = groupUsers
        },
        setSecretary (state, secretaries) {
            state.secretaries = secretaries
        }
    },
    getters: {
        group: (state) => {
            return state['group']
        },
        secretaries: (state) => {
            return state['secretaries']
        },
        groupUsers: (state) => {
            return state['groupUsers'].filter(item => item['display_name']).map(userInfo => {
                return {
                    id: userInfo['id'],
                    username: userInfo['username'],
                    displayName: userInfo['display_name']
                }
            })
        }
    },
    actions: {

        /**
         * 获取群组用户信息
         *
         * @param {Object} state store 上下文对象 { commit, state, dispatch }
         *
         * @return {Promise} promise 对象
         */
        getUserManageListUsers (state) {
            return http.get('/usermanage/list_users/').then(res => {
                state.commit('setUserManageListUsers', res.data.results)
                return res
            })
        },
        /**
         * 获取秘书列表
         *
         * @param {Object} state store 上下文对象 { commit, state, dispatch }
         *
         * @return {Promise} promise 对象
         */
        getSecretary (state) {
            return http.get('/secretary/').then(res => {
                state.commit('setSecretary', res)
            })
        }
    }
}
