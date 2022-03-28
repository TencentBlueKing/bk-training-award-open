/**
 * @file 常量信息挂载
 * @author couriourc
 */

import Vue from 'vue'
import * as origin from '@/constants'

const constants = {
    ...origin
}

const install = function (Vue) {
    Vue.prototype.$constants = constants
}

if (window.Vue) {
    window.constants = constants
    Vue.use(install)
}

Vue.use(install)
