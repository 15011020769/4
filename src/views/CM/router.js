import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'CVM'
  },
  routes: [
    {
      path: '/',
      redirect: '/CVM'
    },
    {
      path: '/CVM', // 云服务器
      name: 'CVM',
      component: () => import(/* webpackChunkName: "CVM" */ './CVM/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/cloudDisk', // 云硬盘
      name: 'cloudDisk',
      component: () => import(/* webpackChunkName: "cloudDisk" */ './cloudDisk/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/cloudMysql', // 云数据库
      name: 'cloudMysql',
      component: () => import(/* webpackChunkName: "cloudMysql" */ './cloudMysql/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/NATgateway', // nat
      name: 'NATgateway',
      component: () => import(/* webpackChunkName: "NATgateway" */ './NATgateway/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/peerConnect', // 对等
      name: 'peerConnect',
      component: () => import(/* webpackChunkName: "peerConnect" */ './peerConnect/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/VPNgateway', // vpn
      name: 'VPNgateway',
      component: () => import(/* webpackChunkName: "VPNgateway" */ './VPNgateway/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/VPNchannel', // vpn
      name: 'VPNchannel',
      component: () => import(/* webpackChunkName: "VPNchannel" */ './VPNchannel/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/objectStorage', // 对象存储
      name: 'objectStorage',
      component: () => import(/* webpackChunkName: "objectStorage" */ './objectStorage/index.vue'),
      meta: {
        keepAlive: true
      }
    }
  ]
})
