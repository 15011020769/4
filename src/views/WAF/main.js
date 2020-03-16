import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import '@/assets/style/reset.scss'
import '@/utils/axios'
import VueCookie from 'vue-cookie'
import '@/assets/iconfont/iconfont.css'
import filters from '@/filters/filters.js'
import echarts from 'echarts'
import i18n from './language/i18n.js' // 引入i18n包
import { message } from '@/utils/resetMessage' // 重写element-ui的message方法

import { ErrorTips } from "@/components/ErrorTips"
import VueClipboard from 'vue-clipboard2'
import { COMMON_ERROR } from './constants'

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

// 引入基本模板
// const echarts = require('echarts/lib/echarts')
// require("echarts/lib/component/legend")
    // 引入折线图组件
// require('echarts/lib/chart/line')
    // 引入提示框和title组件，图例
// require('echarts/lib/component/tooltip')
Vue.prototype.$echarts = echarts
/**
 * 通用响应处理函数
 * @param {Object} resp 响应对象
 * @param {Function} successCallback 成功回调
 * @param {Object} cusError 错误信息对象
 * @param {String} successMsg 成功提示信息
 * @param {Function} failedCallback 失败回调
 */
Vue.prototype.generalRespHandler = function(
  resp,
  successCallback,
  cusError=COMMON_ERROR,
  successMsg='',
  failedCallback=() => {},
) {
  if (resp.Response.Error) {
    failedCallback && failedCallback(resp.Response)
    let ErrOr = Object.assign(ErrorTips, cusError)
    this.$message({
      message: ErrOr[resp.Response.Error.Code],
      type: 'error',
      showClose: true,
      duration: 0
    })
  } else {
    successCallback && successCallback(resp.Response)
    if (successMsg) {
      this.$message({
        message: successMsg,
        type: 'success',
        showClose: true,
        duration: 0
      })
    }
  }
}
for (let key in filters) {
    Vue.filter(key, filters[key])
}
/**
 * 简转繁
 * @param {String} jt 简体
 * @param {any} t vue-i18n参数
 */
Vue.prototype.t = function(jt, ...t) {
  if (t.length === 0) {
    return jt
  }
  const r = this.$t(...t)
  if (r === t[0]) return jt // 回退到简体
  return r
}

// chinaMap兼容ie11
if (!Float32Array.prototype.slice) {
  Float32Array.prototype.slice = function (begin, end) {
      var target = new Float32Array(end - begin);

      for (var i = 0; i < begin + end; ++i) {
          target[i] = this[begin + i];
      }
      return target;
  };
}

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueCookie)
Vue.use(VueClipboard)
Vue.prototype.$message = message // 覆盖原有的message方法

new Vue({
    router,
    i18n,
    // store,
    render: h => h(App)
}).$mount('#app')