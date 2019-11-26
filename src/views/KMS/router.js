import Vue from 'vue'
import Router from 'vue-router'
import userKms from './userKms/userKms'
import cloudsKms from './cloudsKms/cloudsKms'


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
      path: '/userKms', // 用户密钥
      name: 'userKms',
      component: userKms,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/cloudsKms', // 用户密钥
      name: 'cloudsKms',
      component: cloudsKms,
      meta: {
        keepAlive: true
      }
    }
  ]
})
