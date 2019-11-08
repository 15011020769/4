import Vue from 'vue'
import Router from 'vue-router'
import appId from './appId/appId'
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
    }
  ]
})
