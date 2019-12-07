import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
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
      component: () => import ('./userKms/userKms.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/userKmsDetails', // 用户密钥详情页
      name: 'userKmsDetails',
      component: () => import ('./userKms/userKmsDetails.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/cloudsKms', // 用户密钥
      name: 'cloudsKms',
      component: () => import ('./cloudsKms/cloudsKms'),
      meta: {
        keepAlive: true
      }
    }
  ]
})
