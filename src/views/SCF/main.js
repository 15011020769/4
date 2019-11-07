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
import search from '@/components/Tools/search' // 公共组件搜索
import City from '@/components/Tools/RegionBtn' // 公共组件城市列表
import Duration from '@/components/Tools/Duration' // 购买时长组件
import DatePicker from '@/components/Tools/DatePicker' // 日期选择器控件
import filters from '@/filters/filters.js'
import echarts from 'echarts'
// 引入基本模板
//const echarts = require('echarts/lib/echarts')
// 引入折线图组件
require('echarts/lib/chart/line')
// 引入提示框和title组件，图例
require('echarts/lib/component/tooltip')
Vue.prototype.$echarts = echarts
for (let key in filters) {
  Vue.filter(key, filters[key])
}

Vue.config.productionTip = false
Vue.component('City', City)
Vue.component('search', search)
Vue.component('Duration', Duration)
Vue.component('DatePicker', DatePicker)
Vue.use(ElementUI)
Vue.use(VueCookie)
Vue.use(echarts)

new Vue({
  router,
  // store,
  render: h => h(App)
}).$mount('#app')
