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
import CMfilters from '@/filters/CMfilters.js'

import echarts from 'echarts'
import i18n from './language/i18n.js' // 引入i18n包
import { message } from '@/utils/resetMessage' // 重写element-ui的message方法

import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
Vue.use(codemirror)

// 引入折线图组件
require('echarts/lib/chart/line')
// 引入提示框和title组件，图例
require('echarts/lib/component/tooltip')

// const cslite = document.createElement("script")
// cslite.src= 'https://g.gtimg.cn/CMFE/codingEditor-IDE-dependency/aca16d50/codingEditor.afa8bb24bba15.js'
// document.body.appendChild(cslite)

import './lib/cslite'     // 导入编辑器的代码


Vue.prototype.$echarts = echarts
for (let key in CMfilters) {
  Vue.filter(key, CMfilters[key])
}

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueCookie)
Vue.use(echarts)
Vue.prototype.$message = message // 覆盖原有的message方法

new Vue({
  router,
  // store,
  i18n,
  render: h => h(App)
}).$mount('#app')