import Vue from 'vue'
import Router from 'vue-router'
import VueCookie from 'vue-cookie'
import { clearLoginInfo } from '@/utils'
Vue.use(Router)

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'ccnPage'
  },
  routes: [
    {
      path: '/',
      redirect: '/ccnPage'
    },
    {
      path: '/ccnPage', // ccn
      name: 'ccnPage',
      component: () => import(/* webpackChunkName: "ccnDetail" */ './ccnPage/ccnPage.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/ccnDetail', // ccn  详情
      name: 'ccnDetail',
      component: () => import(/* webpackChunkName: "ccnDetail" */ './ccnPage/ccnDetail.vue'),
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
