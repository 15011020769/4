import Vue from 'vue'
import Router from 'vue-router'
import VueCookie from 'vue-cookie'
import { clearLoginInfo } from '@/utils'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'CloudAudit'
  },
  routes: [
    {
      path: '/',
      redirect: '/CloudAudit'
    },
    {
      path: '/CloudAudit', // 操作记录
      name: 'CloudAudit',
      component: () => import(/* webpackChunkName: "CloudAudit" */ './CloudAudit/CloudAudit.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/Audit', // 跟踪集
      name: 'Audit',
      component: () => import(/* webpackChunkName: "Audit" */ './Audit/Audit.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/History', // 历史记录导出
      name: 'History',
      component: () => import(/* webpackChunkName: "History" */ './History/History.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/NewAudit', // 跟踪集  新建
      name: 'NewAudit',
      component: () => import(/* webpackChunkName: "NewAudit" */ './Audit/NewAudit.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/DetailAudit', // 跟踪集  详情
      name: 'DetailAudit',
      component: () => import(/* webpackChunkName: "DetailAudit" */ './Audit/DetailAudit.vue'),
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
