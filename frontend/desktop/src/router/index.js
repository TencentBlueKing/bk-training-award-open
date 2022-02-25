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
const LoginSucess = { path: 'home' }

// E 自定义页面组件

function setBaseRoutes (otherRoutes) {
    return [
        {
            path: window.PROJECT_CONFIG.SITE_URL,
            name: 'appMain',
            component: MainEntry,
            alias: 'home',
            children: [
                ...otherRoutes
            ]
        },
        // 404
        {
            path: '*',
            name: '404',
            component: NotFound
        }
    ]
}

bus['routes'] = setBaseRoutes([
    {
        path: 'home',
        name: 'home',
        alias: '',
        component: Home,
        meta: {
            parent_id: '首页',
            title: '首页',
            icon: 'icon-home'
        }
    },
    {
        path: 'account/login_success',
        name: 'login_success',
        redirect: LoginSucess,
        meta: {
            title: '首页'
        }
    },
    {
        path: 'canawards',
        name: 'canawards',
        component: Canawards,
        meta: {
            parent_id: '奖项中心',
            title: '可申请奖项',
            icon: 'icon-star'
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
        path: 'group-manager',
        name: 'group-manager',
        component: GroupManager,
        meta: {
            parent_id: '管理中心',
            title: '组管理',
            icon: 'icon-sitemap'
        }
    },
    {
        path: 'award-manager',
        name: 'award-manager',
        component: AwardManager,
        meta: {
            parent_id: '管理中心',
            title: '奖项管理',
            icon: 'icon-data',
            weight: 1000
        }
    },
    {
        path: 'award-manager/award-form',
        name: 'award-form',
        component: AwardForm,
        meta: {
            title: '奖项表单',
            is_hidden: true
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
])

const router = new VueRouter({
    mode: 'hash',
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
/**
 * 调整 router
 *
 * */
const IDENTIFY_MAP = {
    'is_admin': [],
    'is_secretary': [
        {
            path: 'group-manager',
            name: 'group-manager',
            component: GroupManager,
            meta: {
                parent_id: '管理中心',
                title: '组管理',
                icon: 'icon-sitemap'
            }
        }

    ]
}

function generatorRouter (identifyInfo) {
    const resRouter = []
    if (identifyInfo?.['is_admin']) {
        resRouter.push(IDENTIFY_MAP['is_admin'])
    }
    if (identifyInfo?.['is_secretary']) {
        resRouter.push(IDENTIFY_MAP['is_secretary'])
    }
    bus['routes'] = setBaseRoutes(resRouter)
}

bus.$on('user-router', generatorRouter)

/**
 * 动态生成侧边栏
 * */
export function generatorNav () {
    const RouteNav = bus['routes'][0].children
    return RouteNav.map(item => {
        const meta = item.meta
        meta._children = RouteNav.filter(_ => {
            if (_['meta']['parent_id']
                && _['meta']['title'] !== _['meta']['parent_id']
                && _['meta']['parent_id'] === item['meta']['title']
            ) {
                return true
            }
        })
        if (meta['parent_id']) {
            return {
                id: item['name'],
                icon: meta['icon'],
                pathName: item['path'],
                children: meta['_children'],
                name: meta['title']
            }
        }
    }).filter(_ => _)
}
