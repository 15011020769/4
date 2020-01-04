import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'appId'
  },
  routes: [
    {
      path: '/',
      redirect: '/appId'
    },
    {
      path: '/appId', // appId
      name: 'appId',
      component: () => import(/* webpackChunkName: "appId" */ './appId/appId.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/appIdDetail', // appIdDetail
      name: 'appIdDetail',
      component: () => import(/* webpackChunkName: "appId" */ './appId/appIdDetail.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/purchase', // purchase
      name: 'purchase',
      component: () => import(/* webpackChunkName: "appId" */ './appId/BUY/purchase.vue'),
      meta: {
        keepAlive: false
      }
    }
  ]
})
