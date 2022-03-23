/**
 * @file 页面公共请求即每切换 router 时都必须要发送的请求
 * @author wheel-w
 */

import store from '@/store'
import { bus } from '@/store/bus'
const config = {
    fromCache: true,
    cancelWhenRouteChange: false
}

/**
 * 获取 user 信息
 *
 * @return {Promise} promise 对象
 */
function getUser () {
    return store.dispatch('userInfo', config)
}
function getGroup () {
    return bus.handleGetGroupList()
    // return store.dispatch('group', config)
}
function getBkInfo () {
    const config = {
        fromCache: true,
        cancelWhenRouteChange: false
    }
    return store.dispatch('bkInfo', config)
}

export default function () {
    return Promise.all([
        getUser(),
        getBkInfo(),
        getGroup()
    ])
}
