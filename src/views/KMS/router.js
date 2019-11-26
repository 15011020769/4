import Vue from 'vue'
import Router from 'vue-router'
import userKms from './userKms/userKms'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'userKms'
  },
  routes: [
    {
      path: '/',
      redirect: '/userKms'
    },
    {
      path: '/userKms', // 概览
      name: 'userKms',
      component: userKms,
      meta: {
        keepAlive: true
      }
    }
  ]
})
