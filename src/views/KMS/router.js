import Vue from 'vue'
import Router from 'vue-router'
import userKms from './userKms/userKms'
import userKmsDetails from './userKms/userKmsDetails'
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
      path: '/userKmsDetails', // 用户密钥详情页
      name: 'userKmsDetails',
      component: userKmsDetails,
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
