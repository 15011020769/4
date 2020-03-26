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
// import FileSaver from 'file-saver'
// import XLSX from 'xlsx'
import i18n from './language/i18n.js' // 引入i18n包
import { message } from '@/utils/resetMessage' // 重写element-ui的message方法
import echarts from 'echarts'
import locale from 'element-ui/lib/locale/lang/zh-TW'

Vue.prototype.$echarts = echarts

for (let key in CMfilters) {
  Vue.filter(key, CMfilters[key])
}


Vue.config.productionTip = false
Vue.use(ElementUI, { locale })
Vue.use(VueCookie)
Vue.prototype.$message = message // 覆盖原有的message方法
// Vue.use(FileSaver)
// Vue.use(XLSX)

new Vue({
  router,
  i18n,
  // store,
  render: h => h(App)
}).$mount('#app')
