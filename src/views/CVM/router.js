import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'OverView'
  },
  routes: [
    {
      path: '/',
      redirect: '/OverView'
    },
    {
      path: '/OverView', // 概览
      name: 'OverView',
      component: () => import(/* webpackChunkName: "OverView" */ './OverView/OverView.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/Cvm', // 实例
      name: 'Cvm',
      component: () => import(/* webpackChunkName: "Cvm" */ './Cvm/Cvm.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/CvmNew', // 实例-新建
      name: 'CvmNew',
      component: () => import(/* webpackChunkName: "CvmNew" */ './Cvm/CvmNew.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/Image', // 镜像
      name: 'Image',
      component: () => import(/* webpackChunkName: "Image" */ './Image/Image.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/ImageDetails', // 镜像详情
      name: 'ImageDetails',
      component: () => import(/* webpackChunkName: "Image" */ './Image/ImageDetails.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/ImportImage', // 镜像导入镜像
      name: 'ImportImage',
      component: () => import(/* webpackChunkName: "Image" */ './Image/importImage.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/Cbs', // 云硬盘
      name: 'Cbs',
      component: () => import(/* webpackChunkName: "Cbs" */ './Cbs/Cbs.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/Cbs-details', // 云硬盘核对信息
      name: 'Cbs-details',
      component: () => import(/* webpackChunkName: "Cbs" */ './Cbs/model/Cbs-details/details.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/Cbs-check', // 云硬盘核对信息
      name: 'Cbs-check',
      component: () => import(/* webpackChunkName: "Cbs" */ './Cbs/model/check/cbs-check.vue'),
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/Snapshot', // 快照列表
      name: 'Snapshot',
      component: () => import(/* webpackChunkName: "Snapshot" */ './Snapshot/Snapshot.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/shotDetail',
      name: 'shotDetail',
      component: () => import(/* webpackChunkName: "shot.detail" */ './Snapshot/shotDetail.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/Sshkey', // SSH密钥
      name: 'Sshkey',
      component: () => import(/* webpackChunkName: "Sshkey" */ './Sshkey/Sshkey.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/SshkeyDetail', // SSH密钥详情
      name: 'SshkeyDetail',
      component: () => import(/* webpackChunkName: "SshkeyDetail" */ './Sshkey/Detail/Detail.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/SecurityGroup', // 安全组
      name: 'SecurityGroup',
      component: () => import(/* webpackChunkName: "SecurityGroup" */ './SecurityGroup/SecurityGroup.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/SecurityGroupDetail', // 安全组
      name: 'SecurityGroupDetail',
      component: () => import(/* webpackChunkName: "SecurityGroup" */ './SecurityGroup/details/details.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/Eip', // 弹性公网IP
      name: 'Eip',
      component: () => import(/* webpackChunkName: "Eip" */ './Eip/Eip.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/CvmRecycle', // 云服务器回收站
      name: 'CvmRecycle',
      component: () => import(/* webpackChunkName: "CvmRecycle" */ './CvmRecycle/CvmRecycle.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/CbsRecycle', // 云硬盘回收站
      name: 'CbsRecycle',
      component: () => import(/* webpackChunkName: "CbsRecycle" */ './CbsRecycle/CbsRecycle.vue'),
      meta: {
        keepAlive: true
      }
    }
  ]
})
