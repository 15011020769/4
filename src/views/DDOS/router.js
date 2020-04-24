/* eslint-disable space-in-parens */
/* eslint-disable indent */
import Vue from 'vue'
import Router from 'vue-router'
// import ProtectOverview from './ProtectOverview/ProtectOverview'
// import basicProtection from './basicProtection/basicProtection'
// import basicProteDetail from './basicProtection/basicProteDetail'
// import IpProfessional from './IpProfessional/IpProfessional'
// import ProtectionConfig from './IpProfessional/ProtectionConfig'
// import AccessConfig from './IpProfessional/AccessConfig'
// import AssetList from './IpProfessional/AssetList'
// import unBlocking from './unBlocking/unBlocking'
// import UnblockingRecord from './unBlocking/UnblockingRecord'
// import choose from './buy/choose'
// import pay from './buy/pay'
import VueCookie from 'vue-cookie'
import { clearLoginInfo } from '@/utils'
Vue.use(Router)

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'ProtectOverview'
  },
  routes: [{
      path: '/',
      redirect: '/ProtectOverview'
    },
    {
      path: '/ProtectOverview', // 防护概览
      name: 'ProtectOverview',
      component: () =>
        import(
          /* webpackChunkName: "ProtectOverview" */
          './ProtectOverview/ProtectOverview'
        ),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: '/basicProtection', // 基础防护
      name: 'basicProtection',
      component: () =>
        import(
          /* webpackChunkName: "basicProtection" */
          './basicProtection/basicProtection'
        ),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: '/basicProteDetail', // 基础防护详情
      name: 'basicProteDetail',
      component: () =>
        import(
          /* webpackChunkName: "basicProteDetail" */
          './basicProtection/basicProteDetail'
        ),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: '/IpProfessional', // 统计报表
      name: 'IpProfessional',
      component: () =>
        import(
          /* webpackChunkName: "IpProfessional" */
          './IpProfessional/IpProfessional'
        ),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: '/ProtectionConfig', // 防护配置
      name: 'ProtectionConfig',
      component: () =>
        import(
          /* webpackChunkName: "ProtectionConfig" */
          './IpProfessional/ProtectionConfig'
        ),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: '/AccessConfig', // 接入配置
      name: 'AccessConfig',
      component: () => import(
        /* webpackChunkName: "AccessConfig" */
        './IpProfessional/AccessConfig'
      ),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: '/AssetList', // 资产列表
      name: 'AssetList',
      component: () =>
        import(
          /* webpackChunkName: "AssetList" */
          './IpProfessional/AssetList'
        ),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: '/unBlocking', // 解封操作
      name: 'unBlocking',
      component: () =>
        import( /* webpackChunkName: "unBlocking" */ './unBlocking/unBlocking'),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: '/UnblockingRecord', // 解封操作记录
      name: 'UnblockingRecord',
      component: () =>
        import(
          /* webpackChunkName: "UnblockingRecord" */
          './unBlocking/UnblockingRecord'
        ),
      meta: {
        keepAlive: true,
        leftNav: true
      }
    },
    {
      path: '/choose', // 新购
      name: 'choose',
      component: () => import( /* webpackChunkName: "choose" */ './buy/choose'),
      meta: {
        keepAlive: true,
        leftNav: false
      }
    },
    {
      path: '/pay', // 支付
      name: 'pay',
      component: () => import( /* webpackChunkName: "pay" */ './buy/pay'),
      meta: {
        keepAlive: true,
        leftNav: false
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
