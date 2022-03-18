/**
 * @file 引入 bk-magic-vue 组件
 * @author wheel-w
 */

import Vue from 'vue'
import waves from '@/common/directives'
// 全量引入
import './fully-import'

// 按需引入
// import './demand-import'

const Message = Vue.prototype.$bkMessage

let messageInstance = null

export const messageError = (message, delay = 3000) => {
    messageInstance && messageInstance.close()
    messageInstance = Message({
        message,
        delay,
        theme: 'error'
    })
}

export const messageSuccess = (message, delay = 3000) => {
    messageInstance && messageInstance.close()
    messageInstance = Message({
        message,
        delay,
        theme: 'success'
    })
}

export const messageInfo = (message, delay = 3000) => {
    messageInstance && messageInstance.close()
    messageInstance = Message({
        message,
        delay,
        theme: 'primary'
    })
}

export const messageWarn = (message, delay = 3000) => {
    messageInstance && messageInstance.close()
    messageInstance = Message({
        message,
        delay,
        theme: 'warning',
        hasCloseIcon: true
    })
}
Vue.prototype.messageError = messageError
Vue.prototype.messageSuccess = messageSuccess
Vue.prototype.messageInfo = messageInfo
Vue.prototype.messageWarn = messageWarn

// 一些自定义的组件或者指令
Vue.use(waves)
Vue.component('top-back', () => import('@/components/top-back'))
Vue.component('tabs', () => import('@/components/Tabs'))
Vue.component('self-table', () => import('@/components/self-table'))
