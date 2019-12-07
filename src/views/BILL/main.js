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
import i18n from './language/i18n.js' // 引入i18n包

const echarts = require('echarts/lib/echarts')  // 引入基本模板
require('echarts/lib/chart/line')   // 引入折线图组件
require('echarts/lib/component/tooltip')  // 引入提示框和title组件，图例
Vue.prototype.$echarts = echarts
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