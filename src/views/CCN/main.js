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
import { message } from '@/utils/resetMessage' // 重写element-ui的message方法
import CMfilters from '@/filters/CMfilters.js'
import echarts from 'echarts'
import '@/utils/timeout' //超时退出登录
Vue.prototype.$echarts = echarts
for (let key in filters) {
  Vue.filter(key, filters[key])
}

for (let key in CMfilters) {
  Vue.filter(key, CMfilters[key])
}

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueCookie)
Vue.prototype.$message = message // 覆盖原有的message方法
new Vue({
  router,
  i18n,
  // store,
  render: h => h(App)
}).$mount('#app')
