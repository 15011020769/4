import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'Cloudapi'
  },
  routes: [
    {
      path: '/',
      redirect: '/overview'
    },
    {
      path: '/overview', // 概览
      name: 'overview',
      component: () => import(/* webpackChunkName: "overview" */ './overview/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony', // 集群
      name: 'colony',
      component: () => import('./colony/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/create', // 创建集群
      name: 'clusterCreate',
      component: () => import('./colony/create.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub', // 集群详情
      name: 'colonySub',
      component: () => import('./colony/sub/list/index.vue'),
      redirect: '/colony/sub/list/basic', // 默认子路由
      meta: {
        keepAlive: true,
        clusterId: true
      },
      children: [ // 子路由-列表页
        { // 基本信息
          path: '/colony/sub/list/basic',
          name: 'colonyBasic',
          component: () => import('./colony/sub/list/basic/index.vue'),
          meta: {
            keepAlive: true,
            clusterId: true
          }
        },
        { // 节点列表
          path: '/colony/sub/list/nodeManage/node',
          name: 'colonyNodeManageNode',
          component: () => import('./colony/sub/list/nodeManage/node.vue'),
          meta: {
            keepAlive: true,
            clusterId: true
          }
        },
        { // Master&Etcd列表
          path: '/colony/sub/list/nodeManage/masteretcd',
          name: 'colonyNodeManageMasteretcd',
          component: () => import('./colony/sub/list/nodeManage/masteretcd.vue'),
          meta: {
            keepAlive: true,
            clusterId: true
          }
        },
        { // 伸缩组列表
          path: '/colony/sub/list/nodeManage/asg',
          name: 'colonyNodeManageAsg',
          component: () => import('./colony/sub/list/nodeManage/asg.vue'),
          meta: {
            keepAlive: true,
            clusterId: true
          }
        },
        { // 命名空间
          path: '/colony/sub/list/namespace',
          name: 'colonyNamespace',
          component: () => import('./colony/sub/list/namespace/index.vue'),
          meta: {
            keepAlive: true,
            clusterId: true
          }
        },
        { // 工作负载-Deployment
          path: '/colony/sub/list/resource/deployment',
          name: 'colonyResourceDeployment',
          component: () => import('./colony/sub/list/resource/deployment.vue'),
          meta: {
            keepAlive: true,
            clusterId: true
          }
        },
        { // 工作负载-StatefulSet
          path: '/colony/sub/list/resource/statefulSet',
          name: 'colonyResourceStatefulSet',
          component: () => import('./colony/sub/list/resource/statefulSet.vue'),
          meta: {
            keepAlive: true,
            clusterId: true
          }
        },
        { // 工作负载-DaemonSet
          path: '/colony/sub/list/resource/daemonSet',
          name: 'colonyResourceDaemonSet',
          component: () => import('./colony/sub/list/resource/daemonSet.vue'),
          meta: {
            keepAlive: true,
            clusterId: true
          }
        },
        { // 工作负载-Job
          path: '/colony/sub/list/resource/job',
          name: 'colonyResourceJob',
          component: () => import('./colony/sub/list/resource/job.vue'),
          meta: {
            keepAlive: true,
            clusterId: true
          }
        },
        { // 工作负载-CronJob
          path: '/colony/sub/list/resource/cronJob',
          name: 'colonyResourceCronJob',
          component: () => import('./colony/sub/list/resource/cronJob.vue'),
          meta: {
            keepAlive: true,
            clusterId: true
          }
        },
        { // 自动伸缩
          path: '/colony/sub/list/hpa',
          name: 'colonyHpa',
          component: () => import('./colony/sub/list/hpa/index.vue'),
          meta: {
            keepAlive: true,
            clusterId: true
          }
        },
        { // 服务-Service
          path: '/colony/sub/list/service/svc',
          name: 'colonyServiceSvc',
          component: () => import('./colony/sub/list/service/svc.vue'),
          meta: {
            keepAlive: true,
            clusterId: true
          }
        },
        { // 服务-Ingress
          path: '/colony/sub/list/service/ingress',
          name: 'colonyServiceIngress',
          component: () => import('./colony/sub/list/service/ingress.vue'),
          meta: {
            keepAlive: true,
            clusterId: true
          }
        },
        { // 配置管理-ConfigMap
          path: '/colony/sub/list/config/configMap',
          name: 'colonyConfigConfigMap',
          component: () => import('./colony/sub/list/config/configMap.vue'),
          meta: {
            keepAlive: true,
            clusterId: true
          }
        },
        { // 配置管理-Secret
          path: '/colony/sub/list/config/secret',
          name: 'colonyConfigSecret',
          component: () => import('./colony/sub/list/config/secret.vue'),
          meta: {
            keepAlive: true,
            clusterId: true
          }
        },
        { // 储存-PersistentVolume
          path: '/colony/sub/list/storage/pv',
          name: 'colonyStoragePv',
          component: () => import('./colony/sub/list/storage/pv.vue'),
          meta: {
            keepAlive: true,
            clusterId: true
          }
        },
        { // 储存-PersistentVolumeClaim
          path: '/colony/sub/list/storage/pvc',
          name: 'colonyStoragePvc',
          component: () => import('./colony/sub/list/storage/pvc.vue'),
          meta: {
            keepAlive: true,
            clusterId: true
          }
        },
        { // 储存-StorageClass
          path: '/colony/sub/list/storage/sc',
          name: 'colonyStorageSc',
          component: () => import('./colony/sub/list/storage/sc.vue'),
          meta: {
            keepAlive: true,
            clusterId: true
          }
        },
        { // 日志
          path: '/colony/sub/list/log',
          name: 'colonyLog',
          component: () => import('./colony/sub/list/log/index.vue'),
          meta: {
            keepAlive: true,
            clusterId: true
          }
        },
        { // 事件
          path: '/colony/sub/list/event',
          name: 'colonyEvent',
          component: () => import('./colony/sub/list/event/index.vue'),
          meta: {
            keepAlive: true,
            clusterId: true
          }
        }
      ]
    },
    {
      path: '/colony/expand', // 集群-新建节点
      name: 'clusterExpand',
      component: () => import('./colony/expand.vue'),
      meta: {
        keepAlive: true,
        clusterId: true
      }
    },
    {
      path: '/colony/addExist', // 集群-添加已有节点  
      name: 'clusterAddExist',
      component: () => import('./colony/addExist.vue'),
      meta: {
        keepAlive: true,
        clusterId: true
      }
    },

    {
      path: '/helm', // helm应用
      name: 'helm',
      component: () => import(/* webpackChunkName: "helm" */ './helm/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/helmCreate', // helm应用
      name: 'helmCreate',
      component: () => import(/* webpackChunkName: "helm" */ './helmCreate/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/myMirror', // 我的镜像
      name: 'myMirror',
      component: () => import(/* webpackChunkName: "myMirror" */ './myMirror/index.vue'),
      redirect: '/myMirror/user',
      meta: {
        keepAlive: true
      },
      children: [
        {
          path: 'user', // 我的镜像
          name: 'myMirrorUser',
          component: () => import(/* webpackChunkName: "myMirror" */ './myMirror/user.vue'),
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'local', // 命名空间
          name: 'myMirrorLocal',
          component: () => import(/* webpackChunkName: "myMirror" */ './myMirror/local.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/mirrorDetail', // 镜像详情
      name: 'mirrorDetail',
      component: () => import(/* webpackChunkName: "myFavorite" */ './mirrorDetail/index.vue'),
      redirect: '/mirrorDetail/info',
      meta: {
        keepAlive: true
      },
      children: [
        {
          path: 'info', // 镜像信息
          name: 'mirrorDetailInfo',
          component: () => import(/* webpackChunkName: "myMirror" */ './mirrorDetail/info.vue'),
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'detail', // 镜像详情
          name: 'mirrorDetailDetail',
          component: () => import(/* webpackChunkName: "myMirror" */ './mirrorDetail/detail.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/myFavorite', // 我的收藏
      name: 'myFavorite',
      component: () => import(/* webpackChunkName: "myFavorite" */ './myFavorite/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/DockerHub', // DockerHub
      name: 'DockerHub',
      component: () => import(/* webpackChunkName: "DockerHub" */ './DockerHub/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/DockerHubDetail', // DockerHubDetail
      name: 'DockerHubDetail',
      component: () => import(/* webpackChunkName: "DockerHub" */ './DockerHubDetail/index.vue'),
      meta: {
        keepAlive: true
      },
      children: [
        {
          path: 'info', // 基本信息
          name: 'DockerHubDetailInfo',
          component: () => import(/* webpackChunkName: "myMirror" */ './DockerHubDetail/info.vue'),
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'detail', // 详情描述
          name: 'DockerHubDetailDetail',
          component: () => import(/* webpackChunkName: "myMirror" */ './DockerHubDetail/detail.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/totalMirror', // 共有镜像
      name: 'totalMirror',
      component: () => import(/* webpackChunkName: "totalMirror" */ './totalMirror/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/totalMirrorDetail', // DockerHubDetail
      name: 'totalMirrorDetail',
      component: () => import(/* webpackChunkName: "DockerHub" */ './totalMirrorDetail/index.vue'),
      meta: {
        keepAlive: true
      },
      children: [
        {
          path: 'version', // 镜像版本
          name: 'totalMirrorDetailVersion',
          component: () => import(/* webpackChunkName: "myMirror" */ './totalMirrorDetail/version.vue'),
          meta: {
            keepAlive: true
          }
        },
        {
          path: 'info', // 镜像信息
          name: 'totalMirrorDetailInfo',
          component: () => import(/* webpackChunkName: "myMirror" */ './totalMirrorDetail/info.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/logCollection', // 日志采集
      name: 'logCollection',
      component: () => import(/* webpackChunkName: "logCollection" */ './logCollection/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/warnings', // 告警设置
      name: 'warnings',
      component: () => import(/* webpackChunkName: "warnings" */ './warnings/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/warningCreate',
      name: 'warningCreate',
      component: () => import(/* webpackChunkName: "warningCreate" */ './warningCreate/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/persistence', // 事件持久化
      name: 'persistence',
      component: () => import(/* webpackChunkName: "persistence" */ './persistence/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/persistenceSetting/:uid', // 设置事件持久化
      props: true,
      name: 'persistenceSetting',
      component: () => import(/* webpackChunkName: "persistenceSetting" */ './persistenceSetting/index.vue'),
      meta: {
        keepAlive: true
      }
    }
  ]
})
