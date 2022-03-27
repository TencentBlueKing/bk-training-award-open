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
    Vue.use(install); // eslint-disable-line
}

Vue.use(install)
