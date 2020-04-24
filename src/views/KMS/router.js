import Vue from 'vue'
import Router from 'vue-router'
import VueCookie from 'vue-cookie'
import { clearLoginInfo } from '@/utils'
Vue.use(Router)

const router =  new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'userKms'
  },
  routes: [
    {
      path: '/',
      redirect: '/Opening'
    },
    {
      path: '/Opening', // 用户密钥
      name: 'Opening',
      component: () => import('./userKms/Opening.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/userKms', // 用户密钥
      name: 'userKms',
      component: () => import('./userKms/userKms.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/userKmsDetails', // 用户密钥详情页
      name: 'userKmsDetails',
      component: () => import('./userKms/userKmsDetails.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/cloudsKms', // 用户密钥
      name: 'cloudsKms',
      component: () => import('./cloudsKms/cloudsKms'),
      meta: {
        keepAlive: true
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
