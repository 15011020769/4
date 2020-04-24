import Vue from 'vue'
import Router from 'vue-router'
import VueCookie from 'vue-cookie'
import { clearLoginInfo } from '@/utils'
Vue.use(Router)

const router = new Router({
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
    },
    {
      path: '/check', // purchase
      name: 'check',
      component: () => import(/* webpackChunkName: "check" */ './appId/BUY/check.vue'),
      meta: {
        keepAlive: false
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
