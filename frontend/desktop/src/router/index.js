/**
 * @file router 配置
 * @author wheel-w
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'
import http from '@/api'
import preload from '@/common/preload'

import {
    AWARD_FORM_ROUTE_PATH,
    AWARD_MANAGER_ROUTE_PATH,
    BAD_404_ROUTE_PATH,
    DETAIL_ROUTE_PATH,
    GROUP_MANAGER_ROUTE_PATH,
    HOME_ROUTE_PATH, INVITE_ROUTE_PATH,
    MYAPPLY_ROUTE_PATH,
    MYCHECK_ROUTE_PATH
} from '@/constants'
import { bus } from '@/store/bus'

Vue.use(VueRouter)
const MainEntry = () => import(/* webpackChunkName: 'entry' */'@/views')
const NotFound = () => import(/* webpackChunkName: 'none' */'@/views/404')

// S 自定义页面组件
// 首页信息
const Home = () => import(/* webpackChunkName: 'home' */'@/views/home')
// 组管理
const GroupManager = () => import(/* webpackChunkName: 'group-manager' */'@/views/group-manager')
// 奖项管理
const AwardManager = () => import(/* webpackChunkName: 'award-manager' */'@/views/award-manager')
// 奖项申请
const AwardForm = () => import(/* webpackChunkName: 'award-form' */'@/views/award-form')
// 我的申请
const Myapply = () => import(/* webpackChunkName: 'myapply' */'@/views/myapply')
// 我的审核
const Mycheck = () => import(/* webpackChunkName: 'mycheck' */'@/views/mycheck')
// 奖项细节
const Detail = () => import(/* webpackChunkName: 'detail' */'@/views/detail')
// 邀请页面
const Invite = () => import(/* webpackChunkName: 'invite' */'@/views/invite')

function setBaseRoutes (otherRoutes) {
    return [
        {
            path: window.PROJECT_CONFIG.SITE_URL,
            name: 'appMain',
            component: MainEntry,
            alias: HOME_ROUTE_PATH,
            children: [
                ...otherRoutes
            ]
        },
        // 404
        {
            path: '*',
            name: BAD_404_ROUTE_PATH,
            component: NotFound
        }
    ]
}

const routes = setBaseRoutes([
    {
        path: HOME_ROUTE_PATH,
        name: HOME_ROUTE_PATH,
        alias: '',
        component: Home,
        meta: {
            parent_id: '首页',
            title: '首页',
            icon: 'icon-home',
            order: 1
        }
    },
    {
        path: GROUP_MANAGER_ROUTE_PATH,
        name: GROUP_MANAGER_ROUTE_PATH,
        component: GroupManager,
        meta: {
            parent_id: '管理中心',
            title: '我的小组',
            icon: 'icon-sitemap',
            order: 3

        }
    },
    {
        path: MYAPPLY_ROUTE_PATH,
        name: MYAPPLY_ROUTE_PATH,
        component: Myapply,
        meta: {
            parent_id: '我的申请',
            title: '我的申请',
            icon: 'icon-data',
            order: 4
        }
    },
    {
        path: AWARD_MANAGER_ROUTE_PATH,
        name: AWARD_MANAGER_ROUTE_PATH,
        component: AwardManager,
        meta: {
            parent_id: '管理中心',
            title: '奖项列表',
            icon: 'icon-data',
            order: 4
        }
    },
    {
        path: AWARD_FORM_ROUTE_PATH,
        name: AWARD_FORM_ROUTE_PATH,
        component: AwardForm,
        meta: {
            title: '创建奖项',
            is_hidden: true
        }
    },
    {
        path: MYCHECK_ROUTE_PATH,
        name: MYCHECK_ROUTE_PATH,
        component: Mycheck,
        meta: {
            parent_id: '我的审批',
            title: '我的审批',
            icon: 'icon-data',
            order: 4
        }
    },
    {
        path: DETAIL_ROUTE_PATH,
        name: DETAIL_ROUTE_PATH,
        component: Detail,
        meta: {
            title: '奖项信息'
        }
    },
    {
        path: INVITE_ROUTE_PATH,
        name: INVITE_ROUTE_PATH,
        component: Invite,
        meta: {
            title: '邀请链接'
        }
    }
])

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
// TODO: 权限白名单
router.beforeEach(async (to, from, next) => {
    canceling = true
    await cancelRequest()
    canceling = false
   
    next()
})
router.afterEach(async (to, from) => {
    store.commit('setMainContentLoading', true)
    try {
        if (to.query['group_id']) {
            bus.curGlobalGroupId = to.query['group_id']
        }
    } catch (e) {
        console.error(e)
    }
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
