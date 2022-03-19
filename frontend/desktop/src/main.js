/**
 * @file main entry
 * @author wheel-w
 */

import './public-path'
import Vue from 'vue'

import App from '@/App'
import router from '@/router'
import store from '@/store'
import { injectCSRFTokenToHeaders } from '@/api'
import auth from '@/common/auth'
import Img403 from '@/images/403.png'
import Exception from '@/components/exception'
import { bus } from '@/store/bus'
import '@/common/bkmagic'

// 一些自定义的组件或者指令
import waves from '@/common/directives'
Vue.use(waves)

Vue.component('top-back', () => import('@/components/top-back'))
Vue.component('tabs', () => import('@/components/Tabs'))
Vue.component('self-table', () => import('@/components/self-table'))
Vue.component('select-search', () => import('@/components/select-search'))
Vue.component('empty', () => import('@/components/empty'))

Vue.component('app-exception', Exception)

auth.requestCurrentUser().then(user => {
    injectCSRFTokenToHeaders()
    if (user.isAuthenticated) {
        global.bus = bus
        Vue.prototype.$bus = bus
        global.mainComponent = new Vue({
            el: '#app',
            router,
            store,
            components: { App },
            template: '<App/>'
        })
    }
}, err => {
    let message
    if (err.status === 403) {
        message = 'Sorry，您的权限不足!'
        if (err.data && err.data.msg) {
            message = err.data.msg
        }
    } else {
        message = '无法连接到后端服务，请稍候再试。'
    }

    const divStyle = ''
        + 'text-align: center;'
        + 'width: 400px;'
        + 'margin: auto;'
        + 'position: absolute;'
        + 'top: 50%;'
        + 'left: 50%;'
        + 'transform: translate(-50%, -50%);'

    const h2Style = 'font-size: 20px;color: #979797; margin: 32px 0;font-weight: normal'

    const content = ``
        + `<div class="bk-exception bk-exception-center" style="${divStyle}">`
        + `<img src="${Img403}"><h2 class="exception-text" style="${h2Style}">${message}</h2>`
        + `</div>`

    document.write(content)
})
