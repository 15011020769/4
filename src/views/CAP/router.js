import Vue from 'vue'
import Router from 'vue-router'
import appId from './appId/appId'
import appIdDetail from './appId/appIdDetail'
Vue.use(Router)

export default new Router({
  mode: 'history',
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
      component: appId,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/appIdDetail', // appIdDetail
      name: 'appIdDetail',
      component: appIdDetail,
      meta: {
        keepAlive: true
      }
    }
  ]
})
