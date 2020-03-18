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

// 引入基本模板
const cloudstudio = require('cloudstudio-lite/lib')
Vue.prototype.$cloudstudio = cloudstudio
// 引入折线图组件
require('echarts/lib/chart/line')
// 引入提示框和title组件，图例
require('echarts/lib/component/tooltip')
// const cloudStudio = document.createElement('script')
// cloudStudio.src = 'https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js'
// document.body.appendChild(cloudStudio)

// const onlineEdit = document.createElement("script")
// onlineEdit.src= 'https://g.gtimg.cn/CMFE/codingEditor-IDE-dependency/aca16d50/codingEditor.afa8bb24bba15.js'
// document.body.appendChild(onlineEdit)
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