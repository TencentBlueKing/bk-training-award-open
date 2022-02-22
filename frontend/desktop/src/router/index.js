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
// 奖项申请
const AwardForm = () => import(/* webpackChunkName: 'award-form' */'@/views/award-manager/award-form')
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
// 登陆成功后重定向

const LoginSucess = { path: 'home' }
// 申请奖项表格
const routes = [
    {
        path: window.PROJECT_CONFIG.SITE_URL,
        name: 'appMain',
        component: MainEntry,
        alias: 'home',
        children: [
            {
                path: 'home',
                name: 'home',
                alias: '',
                component: Home,
                meta: {
                    title: '首页'
                }
            },
            {
                path: 'account/login_success/',
                name: 'login_success',
                redirect: LoginSucess,
                meta: {
                    title: '首页'
                }
            },
            {
                path: 'group-manager',
                name: 'group-manager',
                component: GroupManager,
                meta: {
                    title: '组管理'
                }
            },
            {
                path: 'award-manager',
                name: 'award-manager',
                component: AwardManager,
                meta: {
                    title: '奖项管理'
                }
            },
            {
                path: 'award-manager/award-form/:type',
                name: 'award-form',
                component: AwardForm,
                meta: {
                    title: '奖项管理'
                }
            },
            {
                path: 'canawards',
                name: 'canawards',
                component: Canawards,
                meta: {
                    title: '可申请奖项'
                }
            },
            {
                path: 'myapply',
                name: 'myapply',
                component: Myapply,
                meta: {
                    title: '我的申请'
                }
            },
            {
                path: 'mycheck',
                name: 'mycheck',
                component: Mycheck,
                meta: {
                    title: '我的审批'
                }
            },
            {
                path: 'detail/:type',
                name: 'detail',
                component: Detail,
                meta: {
                    title: '奖项信息'
                }
            },
            {
                path: 'checkpage',
                name: 'checkpage',
                component: Checkpage,
                meta: {
                    title: '审核页面'
                }
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
