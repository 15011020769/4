import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import '@/assets/style/reset.scss'
import '@/utils/axios'
import VueCookie from 'vue-cookie'
import '@/assets/iconfont/iconfont.css'
import filters from '@/filters/filters.js'
import i18n from '@/language/i18n.js'  // 引入i18n包
// 引入基本模板
const echarts = require('echarts/lib/echarts')
    // 引入折线图组件
require('echarts/lib/chart/line')
    // 引入提示框和title组件，图例
require('echarts/lib/component/tooltip')
Vue.prototype.$echarts = echarts
for (let key in filters) {
    Vue.filter(key, filters[key])
}

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueCookie)

//滚动到底部
Vue.directive('loadmore', {
    bind(el, binding) {
        var p = 0;
        var t = 0;
        var down = true;
        var selectWrap = el.querySelector('.el-table__body-wrapper')
        selectWrap.addEventListener('scroll', function() {
            //判断是否向下滚动
            p = this.scrollTop;
            // if ( t < p){down=true}else{down=false}
            if (t < p) {
                down = true;
            } else {
                down = false;
            }
            t = p;
            //判断是否到底
            const sign = 10;
            const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
            if (scrollDistance <= sign && down) {
                binding.value()
            }
        })
    }
})

new Vue({ <<
    <<
    << < HEAD
    router,
    // store,
    i18n,
    render: h => h(App)
}).$mount('#app')

===
===
=
router,
// store,
i18n,
render: h => h(App)
}).$mount('#app') >>>
    >>>
    > 删除垃圾组件