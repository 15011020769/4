import Vue from 'vue'
import Router from 'vue-router'
import VueCookie from 'vue-cookie'
import { clearLoginInfo } from '@/utils'
Vue.use(Router)


const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'deal'
  },
  routes: [
    {
      path: '/',
      redirect: '/deal'
    },
    {
      path: '/deal',          // 订单管理
      name: 'deal',
      component: () => import(/* webpackChunkName: "deal" */ './Deal/Deal.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/overview',      // 账单概览
      name: 'overview',
      component: () => import(/* webpackChunkName: "Overview" */ './Overview/Overview.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/detail',        // 账单明细
      name: 'detail',
      component: () => import(/* webpackChunkName: "Detail" */ './Detail/Detail.vue'),
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
    window.location.href = 'http://60.199.168.20/WEB_TFC2/SitePages/UserLogin.aspx'
  }else{
    next()
  }
  
  
})

export default router
