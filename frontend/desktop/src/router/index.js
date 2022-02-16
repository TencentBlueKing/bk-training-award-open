/**
 * @file router 配置
 * @author wheel-w
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'
import http from '@/api'
import preload from '@/common/preload'

Vue.use(VueRouter)

const MainEntry = () => import(/* webpackChunkName: 'entry' */'@/views')
const NotFound = () => import(/* webpackChunkName: 'none' */'@/views/404')

// 首页信息
const Home = () => import(/* webpackChunkName: 'home' */'@/views/home')
// 组管理
const GroupManager = () => import(/* webpackChunkName: 'group-manager' */'@/views/group-manager')
// 奖项管理
const AwardManager = () => import(/* webpackChunkName: 'award-manager' */'@/views/award-manager')
// 我的申请
const Myapply = () => import(/* webpackChunkName: 'myapply' */'@/views/myapply')
// 我的审核
const Mycheck = () => import(/* webpackChunkName: 'myapply' */'@/views/mycheck')
// 奖项细节
const Detail = () => import(/* webpackChunkName: 'myapply' */'@/views/detail')
// 审核二级
const Checkpage = () => import(/* webpackChunkName: 'myapply' */'@/views/checkpage')
// 可申报奖项
const Canawards = () => import(/* webpackChunkName: 'example1' */'@/views/canawards')
// 申请奖项表格
const routes = [
    {
        path: window.PROJECT_CONFIG.SITE_URL,
        name: 'appMain',
        component: MainEntry,
        alias: '',
        children: [
            {
                path: '',
                name: '',
                component: Home
            },
            {
                path: 'group-manager',
                name: 'group-manager',
                component: GroupManager
            },
            {
                path: 'award-manager',
                name: 'award-manager',
                component: AwardManager,
                meta: {
                    keepAlive: true
                }
            },
            {
                path: 'canawards',
                alias: '',
                name: 'canawards',
                component: Canawards
            },
            {
                path: 'myapply',
                name: 'myapply',
                component: Myapply
            },
            {
                path: 'mycheck',
                name: 'mycheck',
                component: Mycheck
            },
            {
                path: 'detail',
                name: 'detail',
                component: Detail
            },
            {
                path: 'checkpage',
                name: 'checkpage',
                component: Checkpage
            }
        ]
    },
    // 404
    {
        path: '*',
        name: '404',
        component: NotFound
    }
]

const router = new VueRouter({
    mode: 'history',
    routes: routes
})

const cancelRequest = async () => {
    const allRequest = http.queue.get()
    const requestQueue = allRequest.filter(request => request.cancelWhenRouteChange)
    await http.cancel(requestQueue.map(request => request.requestId))
}

let preloading = true
let canceling = true
let pageMethodExecuting = true

router.beforeEach(async (to, from, next) => {
    canceling = true
    await cancelRequest()
    canceling = false
    next()
})

router.afterEach(async (to, from) => {
    store.commit('setMainContentLoading', true)

    preloading = true
    await preload()
    preloading = false

    const pageDataMethods = []
    const routerList = to.matched
    routerList.forEach(r => {
        Object.values(r.instances).forEach(vm => {
            if (typeof vm.fetchPageData === 'function') {
                pageDataMethods.push(vm.fetchPageData())
            }
            if (typeof vm.$options.preload === 'function') {
                pageDataMethods.push(vm.$options.preload.call(vm))
            }
        })
    })

    pageMethodExecuting = true
    await Promise.all(pageDataMethods)
    pageMethodExecuting = false

    if (!preloading && !canceling && !pageMethodExecuting) {
        store.commit('setMainContentLoading', false)
    }
})

export default router
