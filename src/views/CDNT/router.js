import Vue from 'vue'
import Router from 'vue-router'
import VueCookie from 'vue-cookie'
import { clearLoginInfo } from '@/utils'
Vue.use(Router)

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/report'
    },
    {
      path: '/report', // 运营月报
      name: 'cdnreport',
      component: () =>
        import(/* webpackChunkName: "ipMan" */ './report/index.vue'),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: '/statistics/analysis', // 数据分析
      name: 'cdnstatisticsanalysis',
      component: () =>
        import(
          /* webpackChunkName: "ipMan" */ './statistics/analysis/index.vue'
        ),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: '/global', // 全网状态监控
      name: 'cdnglobal',
      component: () =>
        import(/* webpackChunkName: "ipMan" */ './global/index.vue'),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  // Message.closeAll()      // 关闭所有的alert
  // 如果没有uuid说明用户没有登录 则需要跳转到登录界面
  if(VueCookie.get('uuid') === '' || VueCookie.get('uuid') === undefined || VueCookie.get('uuid') === null){
    clearLoginInfo()
    window.location.href = process.env.VUE_APP_loginUrl
  }else{
    next()
  }


})
export default router
