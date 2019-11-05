import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
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
    }
    // {
    //   path: '/NewAudit', // 跟踪集  新建
    //   name: 'NewAudit',
    //   component: () => import(/* webpackChunkName: "NewAudit" */ './Audit/NewAudit.vue'),
    //   meta: {
    //     keepAlive: true
    //   }
    // },
    // {
    //   path: '/DetailAudit', // 跟踪集  详情
    //   name: 'DetailAudit',
    //   component: () => import(/* webpackChunkName: "DetailAudit" */ './Audit/DetailAudit.vue'),
    //   meta: {
    //     keepAlive: true
    //   }
    // }
  ]
})
