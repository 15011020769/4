import Vue from 'vue'
import Router from 'vue-router'
import VueCookie from 'vue-cookie'
import { clearLoginInfo } from '@/utils'
Vue.use(Router)

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'message'
  },
  routes: [
    {
      path: '/',
      redirect: '/message'
    },
    {
      path: '/message', // 概览
      name: 'message',
      component: () => import(/* webpackChunkName: "message" */ './message/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/mesgdetils', // 站内信详情
      name: 'mesgdetils',
      component: () => import(/* webpackChunkName: "message" */ './message/mesgdetils.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/newsFeeds', // 概览
      name: 'newsFeeds',
      component: () => import(/* webpackChunkName: "newsFeeds" */ './newsFeeds/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/newsdetils', // 通知公告详情
      name: 'newsdetils',
      component: () => import(/* webpackChunkName: "newsFeeds" */ './newsFeeds/newsdetils.vue'),
      meta: {
        keepAlive: true
      }
    },
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
