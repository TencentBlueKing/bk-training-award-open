/**
 * @file router 配置
 * @author wheel-w
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'
import http from '@/api'
import preload from '@/common/preload'
import { bus } from '@/common/bus'
import {
    AWARD_FORM_ROUTE_PATH,
    AWARD_MANAGER_ROUTE_PATH,
    BAD_404_ROUTE_PATH,
    CANAWARDS_ROUTE_PATH,
    CHECKPAGE_ROUTE_PATH,
    DETAIL_ROUTE_PATH,
    GROUP_MANAGER_ROUTE_PATH,
    HOME_ROUTE_PATH, LOGIN_SUCCESS_ROUTE_PATH,
    MYAPPLY_ROUTE_PATH,
    MYCHECK_ROUTE_PATH,
    POWER_CONTROLLER
} from '@/constants'

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
const AwardForm = () => import(/* webpackChunkName: 'award-form' */'@/views/award-manager/award-form')
// 我的申请
const Myapply = () => import(/* webpackChunkName: 'myapply' */'@/views/myapply')
// 我的审核
const Mycheck = () => import(/* webpackChunkName: 'mycheck' */'@/views/mycheck')
// 奖项细节
const Detail = () => import(/* webpackChunkName: 'detail' */'@/views/detail')
// 审核二级
const Checkpage = () => import(/* webpackChunkName: 'checkpage' */'@/views/checkpage')
// 可申报奖项
const Canawards = () => import(/* webpackChunkName: 'canawards' */'@/views/canawards')
// 登陆成功后重定向
const LoginSucess = { path: HOME_ROUTE_PATH }

// E 自定义页面组件

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

bus['routes'] = setBaseRoutes([
    {
        path: HOME_ROUTE_PATH,
        name: HOME_ROUTE_PATH,
        alias: '',
        component: Home,
        meta: {
            parent_id: '首页',
            title: '首页',
            icon: 'icon-home'
        }
    },
    {
        path: LOGIN_SUCCESS_ROUTE_PATH,
        name: LOGIN_SUCCESS_ROUTE_PATH,
        redirect: LoginSucess,
        meta: {
            title: '首页'
        }
    },
    {
        path: CANAWARDS_ROUTE_PATH,
        name: CANAWARDS_ROUTE_PATH,
        component: Canawards,
        meta: {
            parent_id: '奖项中心',
            title: '可申请奖项',
            icon: 'icon-star'
        }
    },
    {
        path: MYAPPLY_ROUTE_PATH,
        name: MYAPPLY_ROUTE_PATH,
        component: Myapply,
        meta: {
            title: '我的申请'
        }
    },
    {
        path: GROUP_MANAGER_ROUTE_PATH,
        name: GROUP_MANAGER_ROUTE_PATH,
        component: GroupManager,
        meta: {
            parent_id: '管理中心',
            title: '组管理',
            icon: 'icon-sitemap'
        }
    },
    {
        path: AWARD_MANAGER_ROUTE_PATH,
        name: AWARD_MANAGER_ROUTE_PATH,
        component: AwardManager,
        meta: {
            parent_id: '管理中心',
            title: '奖项管理',
            icon: 'icon-data',
            weight: 1000
        }
    },
    {
        path: AWARD_FORM_ROUTE_PATH,
        name: AWARD_FORM_ROUTE_PATH,
        component: AwardForm,
        meta: {
            title: '奖项表单',
            is_hidden: true
        }
    },
    {
        path: MYCHECK_ROUTE_PATH,
        name: MYCHECK_ROUTE_PATH,
        component: Mycheck,
        meta: {
            title: '我的审批'
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
        path: CHECKPAGE_ROUTE_PATH,
        name: CHECKPAGE_ROUTE_PATH,
        component: Checkpage,
        meta: {
            title: '审核页面'
        }
    }
])

const router = new VueRouter({
    mode: 'history',
    routes: bus['routes']
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
    const ident = store.getters.ident
    if (to.name !== BAD_404_ROUTE_PATH && POWER_CONTROLLER[to.name][ident]['is_forbidden']) {
        next({ name: '404' })
    } else {
        next()
    }
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

/**
 * 动态生成侧边栏
 * */
export function generatorNav () {
    const RouteNav = bus['routes'][0].children
    const handler = {
        get () {
            return RouteNav.map(item => {
                const meta = item.meta
                // 获取子节点
                meta._children = RouteNav.filter(_ => {
                    if (_['meta']['parent_id']
                        && _['meta']['title'] !== _['meta']['parent_id']
                        && _['meta']['parent_id'] === item['meta']['title']
                    ) {
                        return true
                    }
                })
                if (meta['parent_id']) {
                    const { ident } = store.getters
                    const itemIsHidden = POWER_CONTROLLER[item['path']][ident]['nav-is-hidden']
                    return {
                        id: item['name'],
                        icon: meta['icon'],
                        pathName: item['path'],
                        name: meta['title'],
                        hidden: !itemIsHidden,
                        children: meta['_children']
                    }
                }
            }).filter(_ => _ && _['hidden'])
        }
    }
    Object.defineProperty(handler, 'nav', handler)
    return handler['nav']
}
