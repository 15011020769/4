import Vue from 'vue'
import Router from 'vue-router'
import ProtectOverview from './ProtectOverview/ProtectOverview'
import basicProtection from './basicProtection/basicProtection'
import basicProteDetail from './basicProtection/basicProteDetail'
import IpProfessional from './IpProfessional/IpProfessional'
import ProtectionConfig from './IpProfessional/ProtectionConfig'
import AccessConfig from './IpProfessional/AccessConfig'
import AssetList from './IpProfessional/AssetList'
import unBlocking from './unBlocking/unBlocking'
import UnblockingRecord from './unBlocking/UnblockingRecord'
import choose from './buy/choose'
import pay from './buy/pay'


Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'ProtectOverview'
  },
  routes: [
    {
      path: '/',
      redirect: '/ProtectOverview'
    },
    {
      path: '/ProtectOverview', // 防护概览
      name: 'ProtectOverview',
      component: ProtectOverview,
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/basicProtection', // 基础防护
      name: 'basicProtection',
      component: basicProtection,
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/basicProteDetail', // 基础防护详情
      name: 'basicProteDetail',
      component: basicProteDetail,
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/IpProfessional', // 统计报表
      name: 'IpProfessional',
      component: IpProfessional,
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/ProtectionConfig', // 防护配置
      name: 'ProtectionConfig',
      component: ProtectionConfig,
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/AccessConfig', // 接入配置
      name: 'AccessConfig',
      component: AccessConfig,
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/AssetList', // 资产列表
      name: 'AssetList',
      component: AssetList,
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/unBlocking', // 解封操作
      name: 'unBlocking',
      component: unBlocking,
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/UnblockingRecord', // 解封操作记录
      name: 'UnblockingRecord',
      component: UnblockingRecord,
      meta: {
        keepAlive: true,
        leftNav:true
      }
    },
    {
      path: '/choose', // 新购
      name: 'choose',
      component: choose,
      meta: {
        keepAlive: true,
        leftNav:false
      }
    },
    {
      path: '/pay', // 支付
      name: 'pay',
      component: pay,
      meta: {
        keepAlive: true,
        leftNav:false
      }
    }
  ]
})
