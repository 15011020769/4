import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import '@/assets/style/reset.scss'
import '@/assets/TKE/scss/tke.scss' //引入tke所需样式
import '@/utils/axios'
import VueCookie from 'vue-cookie'
import '@/assets/iconfont/iconfont.css'
import filters from '@/filters/filters.js'
import i18n from './language/i18n.js' // 引入i18n包
import {
  codemirror
} from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import store from '@/stores/store.js'
import {
  ErrorTips
} from "@/components/ErrorTips";
// 引入基本模板
const echarts = require('echarts/lib/echarts')
// 引入折线图组件
require('echarts/lib/chart/line')
// 引入提示框和title组件，图例
require('echarts/lib/component/tooltip')
Vue.prototype.$echarts = echarts
Vue.prototype.$ErrorTips = ErrorTips
for (let key in filters) {
  Vue.filter(key, filters[key])
}

// 集群详情子路由新增统一参数clusterId
router.beforeEach((to, from, next) => {
  if (to.query.clusterId) {
    next();
    return;
  };
  if (from.query.clusterId && to.meta.clusterId === true) {
    let toQuery = JSON.parse(JSON.stringify(to.query));
    toQuery.clusterId = from.query.clusterId;
    toQuery.ProjectId = from.query.ProjectId;
    next({
      path: to.path,
      query: toQuery,
    })
  } else {
    next()
  }
});

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueCookie)
Vue.use(codemirror)
new Vue({
  router,
  i18n,
  store,
  // store,
  render: h => h(App)
}).$mount('#app')
