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
import { bus } from '@/store/bus'
// 蓝鲸组件库
import '@/common/bkmagic'
// 自定义的一些全局组件
import '@/common/self-components'
// 一些自定义的组件或者指令
import '@/common/directives'
// 挂载常量
import '@/common/constants'
/**
 * 生产环境重写 info 级别的信息，不输出
 * */
if (process.env.NODE_ENV !== 'production') {
    window.console.log = () => {}
}

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
