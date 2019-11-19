import Vue from 'vue'
import Router from 'vue-router'
import deal from './Deal/Deal'
Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'deal'
  },
  routes: [
    {
      path: '/',
      redirect: '/deal'
    },
    {
      path: '/deal',          // 订单管理
      name: 'deal',
      component: deal,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/overview',      // 账单概览
      name: 'overview',
      component: () => import(/* webpackChunkName: "Overview" */ './Overview/Overview.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/detail',        // 账单明细
      name: 'detail',
      component: () => import(/* webpackChunkName: "Detail" */ './Detail/Detail.vue'),
      meta: {
        keepAlive: true
      }
    }
  ]
})
