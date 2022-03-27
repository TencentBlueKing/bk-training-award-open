/**
 * @file main store
 * @author wheel-w
 */

import Vue from 'vue'
import Vuex from 'vuex'

import { unifyObjectStyle } from '@/common/util'
import {
    APP_AUTH_NEWER,
    GROUP_KEYNAME,
    GROUP_MANAGER_ROUTE_PATH,
    IDENT_COMMON,
    MYCHECK_ROUTE_PATH,
    POWER_CONTROLLER,
    ROUTE_TABLE
} from '@/constants'
import { getUserInfo } from '@/api/service/user-service'
import { bus } from '@/store/bus'
import http from '@/api'
import { getGroup, getUsermanageRetrieveUser } from '@/api/service/group-service'

Vue.use(Vuex)

const store = new Vuex.Store({
    // 模块
    modules: {},
    // 公共 store
    state: {
        mainContentLoading: false,
        // 系统当前登录用户
        user: {},
        // bk 上的用户信息
        bkInfo: {},
        groupList: [],
        curGlobalSelectGroup: null,
        ROUTE_TABLE: Object.freeze(ROUTE_TABLE),
        /**
         * 根据用户细节调整部分系统部分控件的
         * */
        powerConfig: Object.freeze(POWER_CONTROLLER),
        // 当前用户信息
        user_ident: {
            is_admin: false,
            is_secretary: false,
            ident: IDENT_COMMON
        }
    },
    // 公共 getters
    getters: {
        mainContentLoading: state => state.mainContentLoading,
        user: state => state.user,
        groupMap: state => {
            const map = {}
            const groups = http.cache.get(GROUP_KEYNAME)
            groups?.forEach(group => {
                map[group['group_id']] = group
            })
            return map
        },
        ident: state => state.user_ident.ident,
        // 将权限转移到对应的页面，这样会更合适一些
        groupPowerConfig: state => {
            const ident = state.user_ident['ident']
            return POWER_CONTROLLER[GROUP_MANAGER_ROUTE_PATH][ident]
        },
        checkpagePowerConfig: state => {
            const ident = state.user_ident['ident']
            return POWER_CONTROLLER[MYCHECK_ROUTE_PATH][ident]
        }

    },
    // 公共 mutations
    mutations: {
        /**
         * 设置内容区的 loading 是否显示
         *
         * @param {Object} state store state
         * @param {boolean} loading 是否显示 loading
         */
        setMainContentLoading (state, loading) {
            state.mainContentLoading = loading
        },

        /**
         * 更新当前用户 user
         *
         * @param {Object} state store state
         * @param {Object} user user 对象
         */
        updateUser (state, user) {
            state.user = { ...user }
        },
        updateBkInfo (state, data) {
            state.bkInfo = data
        }
    },
    actions: {
        /**
         * 获取用户信息
         *
         * @param {Object} context store 上下文对象 { commit, state, dispatch }
         *
         * @param { object } config
         * @return {Promise} promise 对象
         */
        userInfo (context, config = {}) {
            return getUserInfo(config).then(response => {
                const userData = response.data || {}
                context.commit('updateUser', userData)
                return Promise.resolve(userData)
            }).then(userData => {
                if (userData['is_newer']) {
                    bus.isNewer = true
                    bus.$emit(APP_AUTH_NEWER, true)
                }
                return Promise.resolve(userData)
            })
        },
        /**
         * @param context
         * @param config
         * @return {Array | Promise | any}
         * */
        group (context, config = {}) {
            const groupUsers = http.cache.get(GROUP_KEYNAME)
            if (groupUsers) {
                context.commit('curGlobalSelectGroup', groupUsers[0]['group_id'])
                return groupUsers
            }
            return getGroup(config).then(async response => {
                await http.cache.set(GROUP_KEYNAME, response.data)
                context.commit('curGlobalSelectGroup', response.data[0]['group_id'])
                return Promise.resolve(response.data)
            })
        },
        /**
         * @param context
         * @param config
         * @return {any}
         * */
        bkInfo (context, config) {
            return getUsermanageRetrieveUser(config).then(response => {
                const bkInfo = response.data || {}
                context.commit('updateBkInfo', bkInfo)
                return Promise.resolve(bkInfo)
            })
        }

    }
})

/**
 * hack vuex dispatch, add third parameter `config` to the dispatch method
 *
 * @param {Object|string} _type vuex type
 * @param {Object} _payload vuex payload
 * @param {Object} config config 参数，主要指 http 的参数，详见 src/api/index initConfig
 *
 * @return {Promise} 执行请求的 promise
 */
store.dispatch = function (_type, _payload, config = {}) {
    const { type, payload } = unifyObjectStyle(_type, _payload)

    const action = { type, payload, config }
    const entry = store._actions[type]
    if (!entry) {
        if (NODE_ENV !== 'production') {
            console.error(`[vuex] unknown action type: ${type}`)
        }
        return
    }

    store._actionSubscribers.forEach(sub => {
        return sub(action, store.state)
    })

    return entry.length > 1
        ? Promise.all(entry.map(handler => handler(payload, config)))
        : entry[0](payload, config)
}

export default store
