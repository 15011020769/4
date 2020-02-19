import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import '@/assets/style/reset.scss'
import '@/utils/axios'
import VueCookie from 'vue-cookie'
import '@/assets/iconfont/iconfont.css'
import filters from '@/filters/filters.js'
import echarts from 'echarts'
import i18n from './language/i18n.js' // 引入i18n包
import { ErrorTips } from "@/components/ErrorTips"
import { COMMON_ERROR } from './constants'

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
    failedCallback && failedCallback()
    let ErrOr = Object.assign(ErrorTips, cusError)
    this.$message({
      message: ErrOr[resp.Response.Error.Code],
      type: 'error',
      showClose: true,
      duration: 0
    })
  } else {
    successCallback && successCallback()
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

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueCookie)

new Vue({
    router,
    i18n,
    // store,
    render: h => h(App)
}).$mount('#app')