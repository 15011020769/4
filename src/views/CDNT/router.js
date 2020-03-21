import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'ULive'
  },
  routes: [
    {
      path: '/',
      redirect: '/report'
    },
    {
      path: '/editor', // 安全概览
      name: 'editor',
      component: () => import(/* webpackChunkName: "ipMan" */ './editor.vue'),
      meta: {
        keepAlive: true,
        leftNav: true
      }
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
export default router
