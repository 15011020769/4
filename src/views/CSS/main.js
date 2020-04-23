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
import i18n from './language/i18n.js' // 引入i18n包
import { message } from '@/utils/resetMessage' // 重写element-ui的message方法
import locale from 'element-ui/lib/locale/lang/zh-TW'
import VueClipboard from 'vue-clipboard2'
import '@/utils/timeout' //超时退出登录
// 引入基本模板
const echarts = require('echarts/lib/echarts')
// 引入折线图组件
require('echarts/lib/chart/line')
// 引入提示框和title组件，图例
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')

const player = document.createElement('script')
player.src = 'https://imgcache.qq.com/open/qcloud/video/vcplayer/TcPlayer-2.3.2.js'

document.body.appendChild(player)
Vue.prototype.$echarts = echarts
for (let key in filters) {
    Vue.filter(key, filters[key])
}

Vue.config.productionTip = false
Vue.use(ElementUI, { locale })
Vue.use(VueCookie)
Vue.use(VueClipboard)
Vue.prototype.$message = message // 覆盖原有的message方法

new Vue({
    router,
    i18n,
    // store,
    render: h => h(App)
}).$mount('#app')
