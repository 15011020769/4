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
import echarts from 'echarts'
import i18n from './language/i18n.js' // 引入i18n包
import { message } from '@/utils/resetMessage' // 重写element-ui的message方法

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.prototype.$echarts = echarts
for (let key in filters) {
    Vue.filter(key, filters[key])
}
/**
 * 简转繁
 * @param {String} jt 简体
 * @param {any} t vue-i18n参数
 */
Vue.prototype.t = function(jt, ...t) {
  if (t.length === 0) {
    return jt
  }
  const r = this.$t(...t)
  if (r === t[0]) return jt // 回退到简体
  return r
}

// chinaMap兼容ie11
if (!Float32Array.prototype.slice) {
  Float32Array.prototype.slice = function (begin, end) {
      var target = new Float32Array(end - begin);

      for (var i = 0; i < begin + end; ++i) {
          target[i] = this[begin + i];
      }
      return target;
  };
}
// 兼容ie11对象不支持includes
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(valueToFind, fromIndex) {

      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      var len = o.length >>> 0;
      if (len === 0) {
        return false;
      }
      var n = fromIndex | 0;
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }
      while (k < len) {
        if (sameValueZero(o[k], valueToFind)) {
          return true;
        } 
        k++;
      }
      return false;
    }
  });
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