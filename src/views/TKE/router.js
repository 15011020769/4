import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'Cloudapi'
  },
  routes: [{
      path: '/',
      redirect: '/overview'
    },
    {
      path: '/overview', // 概览
      name: 'overview',
      component: () => import( /* webpackChunkName: "overview" */ './overview/overview.vue'),
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
      path: '/colonyMonitor', // 集群监控
      name: 'colonyMonitor',
      component: () => import('./colony/openMonitor.vue'),
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
            clusterId: true,
            ProjectId: true
          }
        },
        { // 节点列表
          path: '/colony/sub/list/nodeManage/node',
          name: 'colonyNodeManageNode',
          component: () => import('./colony/sub/list/nodeManage/node.vue'),
          meta: {
            keepAlive: true,
            clusterId: true,
            ProjectId: true
          }
        },
        { // Master&Etcd列表
          path: '/colony/sub/list/nodeManage/masteretcd',
          name: 'colonyNodeManageMasteretcd',
          component: () => import('./colony/sub/list/nodeManage/masteretcd.vue'),
          meta: {
            keepAlive: true,
            clusterId: true,
            ProjectId: true
          }
        },
        { // 伸缩组列表
          path: '/colony/sub/list/nodeManage/asg',
          name: 'colonyNodeManageAsg',
          component: () => import('./colony/sub/list/nodeManage/asg.vue'),
          meta: {
            keepAlive: true,
            clusterId: true,
            ProjectId: true
          }
        },
        { // 命名空间
          path: '/colony/sub/list/namespace',
          name: 'colonyNamespace',
          component: () => import('./colony/sub/list/namespace/index.vue'),
          meta: {
            keepAlive: true,
            clusterId: true,
            ProjectId: true
          }
        },
        { // 工作负载-Deployment
          path: '/colony/sub/list/resource/deployment',
          name: 'colonyResourceDeployment',
          component: () => import('./colony/sub/list/resource/deployment.vue'),
          meta: {
            keepAlive: true,
            clusterId: true,
            ProjectId: true
          }
        },
        { // 工作负载-StatefulSet
          path: '/colony/sub/list/resource/statefulSet',
          name: 'colonyResourceStatefulSet',
          component: () => import('./colony/sub/list/resource/statefulSet.vue'),
          meta: {
            keepAlive: true,
            clusterId: true,
            ProjectId: true
          }
        },
        { // 工作负载-DaemonSet
          path: '/colony/sub/list/resource/daemonSet',
          name: 'colonyResourceDaemonSet',
          component: () => import('./colony/sub/list/resource/daemonSet.vue'),
          meta: {
            keepAlive: true,
            clusterId: true,
            ProjectId: true
          }
        },
        { // 工作负载-Job
          path: '/colony/sub/list/resource/job',
          name: 'colonyResourceJob',
          component: () => import('./colony/sub/list/resource/job.vue'),
          meta: {
            keepAlive: true,
            clusterId: true,
            ProjectId: true
          }
        },
        { // 工作负载-CronJob
          path: '/colony/sub/list/resource/cronJob',
          name: 'colonyResourceCronJob',
          component: () => import('./colony/sub/list/resource/cronJob.vue'),
          meta: {
            keepAlive: true,
            clusterId: true,
            ProjectId: true
          }
        },
        { // 自动伸缩
          path: '/colony/sub/list/hpa',
          name: 'colonyHpa',
          component: () => import('./colony/sub/list/hpa/index.vue'),
          meta: {
            keepAlive: true,
            clusterId: true,
            ProjectId: true
          }
        },
        { // 服务-Service
          path: '/colony/sub/list/service/svc',
          name: 'colonyServiceSvc',
          component: () => import('./colony/sub/list/service/svc.vue'),
          meta: {
            keepAlive: true,
            clusterId: true,
            ProjectId: true
          }
        },
        { // 服务-Ingress
          path: '/colony/sub/list/service/ingress',
          name: 'colonyServiceIngress',
          component: () => import('./colony/sub/list/service/ingress.vue'),
          meta: {
            keepAlive: true,
            clusterId: true,
            ProjectId: true
          }
        },
        { // 配置管理-ConfigMap
          path: '/colony/sub/list/config/configmap',
          name: 'colonyConfigConfigmap',
          component: () => import('./colony/sub/list/config/configMap.vue'),
          meta: {
            keepAlive: true,
            clusterId: true,
            ProjectId: true
          }
        },
        { // 配置管理-Secret
          path: '/colony/sub/list/config/secret',
          name: 'colonyConfigSecret',
          component: () => import('./colony/sub/list/config/secret.vue'),
          meta: {
            keepAlive: true,
            clusterId: true,
            ProjectId: true
          }
        },
        { // 储存-PersistentVolume
          path: '/colony/sub/list/storage/pv',
          name: 'colonyStoragePv',
          component: () => import('./colony/sub/list/storage/pv.vue'),
          meta: {
            keepAlive: true,
            clusterId: true,
            ProjectId: true
          }
        },
        { // 储存-PersistentVolumeClaim
          path: '/colony/sub/list/storage/pvc',
          name: 'colonyStoragePvc',
          component: () => import('./colony/sub/list/storage/pvc.vue'),
          meta: {
            keepAlive: true,
            clusterId: true,
            ProjectId: true
          }
        },
        { // 储存-StorageClass
          path: '/colony/sub/list/storage/sc',
          name: 'colonyStorageSc',
          component: () => import('./colony/sub/list/storage/sc.vue'),
          meta: {
            keepAlive: true,
            clusterId: true,
            ProjectId: true
          }
        },
        { // 日志
          path: '/colony/sub/list/log',
          name: 'colonyLog',
          component: () => import('./colony/sub/list/log/index.vue'),
          meta: {
            keepAlive: true,
            clusterId: true,
            ProjectId: true
          }
        },
        { // 事件
          path: '/colony/sub/list/event',
          name: 'colonyEvent',
          component: () => import('./colony/sub/list/event/index.vue'),
          meta: {
            keepAlive: true,
            clusterId: true,
            ProjectId: true
          }
        },

      ]
    },
    { // 监控按钮页面monitor
      path: '/colony/sub/list/components/openMonitor',
      name: 'colonyOpenMonitor',
      component: () => import('./colony/sub/list/components/openMonitor.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/expand', // 集群-新建节点
      name: 'clusterExpand',
      component: () => import('./colony/expand.vue'),
      meta: {
        keepAlive: true

      }
    },
    {
      path: '/colony/addExist', // 集群-添加已有节点
      name: 'clusterAddExist',
      component: () => import('./colony/addExist.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/create/nodeManage/asg', // 集群-新建节点
      name: 'asgCreate',
      component: () => import('./colony/sub/create/nodeManage/asg.vue'),
      meta: {
        keepAlive: true

      }
    },
    {
      path: '/colony/sub/create/namespace', // 集群-新建Namespace
      name: 'namespaceCreate',
      component: () => import('./colony/sub/create/namespace/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/create/resource/workload', // 集群-新建Workload(Deployment、StatefulSet、DaemonSet、Job、CronJob)
      name: 'workloadCreate',
      component: () => import('./colony/sub/create/resource/workload.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/create/hpa', // 集群-新建Service
      name: 'hpaCreate',
      component: () => import('./colony/sub/create/hpa/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/create/service/svc', // 集群-新建Service
      name: 'svcCreate',
      component: () => import('./colony/sub/create/service/svc.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/update/service/svc', // 集群-Service--更新
      name: 'svcUpdate',
      component: () => import('./colony/sub/update/service/svc.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/update/service/svcYaml/yaml', // 集群-Service--编辑yaml
      name: 'svcUpdateYaml',
      component: () => import('./colony/sub/update/service/svcYaml/yaml.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/update/resource/updatePod', // 集群-pod--更新pod数量
      name: 'podUpdate',
      component: () => import('./colony/sub/update/resource/updatePod.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/update/resource/updatePodConfig', // 集群-pod--更新pod配置
      name: 'podConfigUpdate',
      component: () => import('./colony/sub/update/resource/updatePodConfig.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/update/resource/setStrategy', //设置更新策略
      name: 'setStrategy',
      component: () => import('./colony/sub/update/resource/setStrategy.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/update/resource/updateStrategy', //更新调度策略
      name: 'updateStrategy',
      component: () => import('./colony/sub/update/resource/updateStrategy.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/update/resource/editYaml', //编辑YAML
      name: 'updateYamlWorkLoad',
      component: () => import('./colony/sub/update/resource/editYaml.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/create/service/ingress', // 集群-新建Ingress
      name: 'ingressCreate',
      component: () => import('./colony/sub/create/service/ingress.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/create/config/configmap', // 集群-新建ConfigMap
      name: 'configmapCreate',
      component: () => import('./colony/sub/create/config/configmap.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/modify/service/ingress', // 集群-Service--编辑yaml
      name: 'ingressUpdateYaml',
      component: () => import('./colony/sub/modify/service/ingress.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/create/config/secret', // 集群-新建Secret
      name: 'secretCreate',
      component: () => import('./colony/sub/create/config/secret.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/create/storage/pv', // 集群-新建PersistentVolume
      name: 'pvCreate',
      component: () => import('./colony/sub/create/storage/pv.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/update/storage/pvYaml', // 集群-更新PersistentVolume yaml
      name: 'pvUpdate',
      component: () => import('./colony/sub/update/storage/pvYaml.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/create/yaml', // 集群详情 --创建yaml
      name: 'createYaml',
      component: () => import('./colony/sub/create/yaml/yaml.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/create/storage/pvc', // 集群-新建PersistentVolumeClaim
      name: 'pvcCreate',
      component: () => import('./colony/sub/create/storage/pvc.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/update/storage/pvcYaml', // 集群-更新PersistentVolumeClaim yaml
      name: 'pvcUpdate',
      component: () => import('./colony/sub/update/storage/pvcYaml.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/create/storage/sc', // 集群-新建StorageClass
      name: 'scCreate',
      component: () => import('./colony/sub/create/storage/sc.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/update/storage/scYaml', // 集群-更新StorageClass yaml
      name: 'scUpdate',
      component: () => import('./colony/sub/update/storage/scYaml.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/detail/nodeManage/node', // 节点管理-节点-详情
      name: 'nodeDetail',
      component: () => import('./colony/sub/detail/nodeManage/node/index.vue'),
      redirect: '/colony/sub/detail/nodeManage/node/pod', // 默认子路由
      meta: {
        keepAlive: true
      },
      children: [ // 子路由
        { // pod管理
          path: '/colony/sub/detail/nodeManage/node/pod',
          name: 'nodeDetailPod',
          component: () => import('./colony/sub/detail/nodeManage/node/pod.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 详情
          path: '/colony/sub/detail/nodeManage/node/info',
          name: 'nodeDetailInfo',
          component: () => import('./colony/sub/detail/nodeManage/node/info.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 事件
          path: '/colony/sub/detail/nodeManage/node/event',
          name: 'nodeDetailEvent',
          component: () => import('./colony/sub/detail/nodeManage/node/event.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // yaml
          path: '/colony/sub/detail/nodeManage/node/yaml',
          name: 'nodeDetailYaml',
          component: () => import('./colony/sub/detail/nodeManage/node/yaml.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/colony/sub/detail/nodeManage/node/openMonitor', // 节点管理-Master&Etcd-详情
      name: 'nodeMonitor',
      component: () => import('./colony/sub/detail/nodeManage/node/openMonitor.vue'),
      meta: {
        keepAlive: true
      },
    },
    {
      path: '/colony/sub/detail/nodeManage/masteretcd', // 节点管理-Master&Etcd-详情
      name: 'masteretcdDetail',
      component: () => import('./colony/sub/detail/nodeManage/masteretcd/index.vue'),
      redirect: '/colony/sub/detail/nodeManage/masteretcd/pod', // 默认子路由
      meta: {
        keepAlive: true
      },
      children: [ // 子路由
        { // pod管理
          path: '/colony/sub/detail/nodeManage/masteretcd/pod',
          name: 'masteretcdDetailPod',
          component: () => import('./colony/sub/detail/nodeManage/masteretcd/pod.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 详情
          path: '/colony/sub/detail/nodeManage/masteretcd/info',
          name: 'masteretcdDetailInfo',
          component: () => import('./colony/sub/detail/nodeManage/masteretcd/info.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 事件
          path: '/colony/sub/detail/nodeManage/masteretcd/event',
          name: 'masteretcdDetailEvent',
          component: () => import('./colony/sub/detail/nodeManage/masteretcd/event.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // yaml
          path: '/colony/sub/detail/nodeManage/masteretcd/yaml',
          name: 'masteretcdDetailYaml',
          component: () => import('./colony/sub/detail/nodeManage/masteretcd/yaml.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/colony/sub/detail/nodeManage/masteretcd/openMonitor', // 节点管理-Master&Etcd-详情
      name: 'masteretcdMonitor',
      component: () => import('./colony/sub/detail/nodeManage/masteretcd/openMonitor.vue'),
      meta: {
        keepAlive: true
      },
    },
    {
      path: '/colony/sub/detail/hpa', // 命名空间-详情
      name: 'namespaceDetail',
      component: () => import('./colony/sub/detail/namespace/index.vue'),
      redirect: '/colony/sub/detail/namespace/info', // 默认子路由
      meta: {
        keepAlive: true
      },
      children: [ // 子路由
        { // 详情
          path: '/colony/sub/detail/namespace/info',
          name: 'namespaceDetailInfo',
          component: () => import('./colony/sub/detail/namespace/info.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // yaml
          path: '/colony/sub/detail/namespace/yaml',
          name: 'namespaceDetailYaml',
          component: () => import('./colony/sub/detail/namespace/yaml.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/colony/sub/detail/resource/deployment', // 工作负载-Deployment-详情
      name: 'deploymentDetail',
      component: () => import('./colony/sub/detail/resource/deployment/index.vue'),
      redirect: '/colony/sub/detail/resource/deployment/pod', // 默认子路由
      meta: {
        keepAlive: true
      },
      children: [ // 子路由
        { // Pod管理
          path: '/colony/sub/detail/resource/deployment/pod',
          name: 'deploymentDetailPod',
          component: () => import('./colony/sub/detail/resource/deployment/pod.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 修订历史
          path: '/colony/sub/detail/resource/deployment/history',
          name: 'deploymentDetailHistory',
          component: () => import('./colony/sub/detail/resource/deployment/history.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 事件
          path: '/colony/sub/detail/resource/deployment/event',
          name: 'deploymentDetailEvent',
          component: () => import('./colony/sub/detail/resource/deployment/event.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 日志
          path: '/colony/sub/detail/resource/deployment/log',
          name: 'deploymentDetailLog',
          component: () => import('./colony/sub/detail/resource/deployment/log.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 详情
          path: '/colony/sub/detail/resource/deployment/info',
          name: 'deploymentDetailInfo',
          component: () => import('./colony/sub/detail/resource/deployment/info.vue'),
          meta: {
            keepAlive: true
          }
        },

        { // yaml
          path: '/colony/sub/detail/resource/deployment/yaml',
          name: 'deploymentDetailYaml',
          component: () => import('./colony/sub/detail/resource/deployment/yaml.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/colony/sub/detail/resource/statefulSet', // 工作负载-StatefulSet-详情
      name: 'statefulSetDetail',
      component: () => import('./colony/sub/detail/resource/statefulSet/index.vue'),
      redirect: '/colony/sub/detail/resource/statefulSet/pod', // 默认子路由
      meta: {
        keepAlive: true
      },
      children: [ // 子路由
        { // Pod管理
          path: '/colony/sub/detail/resource/statefulSet/pod',
          name: 'statefulSetDetailPod',
          component: () => import('./colony/sub/detail/resource/statefulSet/pod.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 事件
          path: '/colony/sub/detail/resource/statefulSet/event',
          name: 'statefulSetDetailEvent',
          component: () => import('./colony/sub/detail/resource/statefulSet/event.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 日志
          path: '/colony/sub/detail/resource/statefulSet/log',
          name: 'statefulSetDetailLog',
          component: () => import('./colony/sub/detail/resource/statefulSet/log.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 详情
          path: '/colony/sub/detail/resource/statefulSet/info',
          name: 'statefulSetDetailInfo',
          component: () => import('./colony/sub/detail/resource/statefulSet/info.vue'),
          meta: {
            keepAlive: true
          }
        },

        { // yaml
          path: '/colony/sub/detail/resource/statefulSet/yaml',
          name: 'statefulSetDetailYaml',
          component: () => import('./colony/sub/detail/resource/statefulSet/yaml.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/colony/sub/detail/resource/daemonSet', // 工作负载-DaemonSet-详情
      name: 'daemonSetDetail',
      component: () => import('./colony/sub/detail/resource/daemonSet/index.vue'),
      redirect: '/colony/sub/detail/resource/daemonSet/pod', // 默认子路由
      meta: {
        keepAlive: true
      },
      children: [ // 子路由
        { // Pod管理
          path: '/colony/sub/detail/resource/daemonSet/pod',
          name: 'daemonSetDetailPod',
          component: () => import('./colony/sub/detail/resource/daemonSet/pod.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 事件
          path: '/colony/sub/detail/resource/daemonSet/event',
          name: 'daemonSetDetailEvent',
          component: () => import('./colony/sub/detail/resource/daemonSet/event.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 日志
          path: '/colony/sub/detail/resource/daemonSet/log',
          name: 'daemonSetDetailLog',
          component: () => import('./colony/sub/detail/resource/daemonSet/log.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 详情
          path: '/colony/sub/detail/resource/daemonSet/info',
          name: 'daemonSetDetailInfo',
          component: () => import('./colony/sub/detail/resource/daemonSet/info.vue'),
          meta: {
            keepAlive: true
          }
        },

        { // yaml
          path: '/colony/sub/detail/resource/daemonSet/yaml',
          name: 'daemonSetDetailYaml',
          component: () => import('./colony/sub/detail/resource/daemonSet/yaml.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/colony/sub/detail/resource/job', // 工作负载-Job-详情
      name: 'jobDetail',
      component: () => import('./colony/sub/detail/resource/job/index.vue'),
      redirect: '/colony/sub/detail/resource/job/pod', // 默认子路由
      meta: {
        keepAlive: true
      },
      children: [ // 子路由
        { // Pod管理
          path: '/colony/sub/detail/resource/job/pod',
          name: 'jobDetailPod',
          component: () => import('./colony/sub/detail/resource/job/pod.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 事件
          path: '/colony/sub/detail/resource/job/event',
          name: 'jobDetailEvent',
          component: () => import('./colony/sub/detail/resource/job/event.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 日志
          path: '/colony/sub/detail/resource/job/log',
          name: 'jobDetailLog',
          component: () => import('./colony/sub/detail/resource/job/log.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 详情
          path: '/colony/sub/detail/resource/job/info',
          name: 'jobDetailInfo',
          component: () => import('./colony/sub/detail/resource/job/info.vue'),
          meta: {
            keepAlive: true
          }
        },

        { // yaml
          path: '/colony/sub/detail/resource/job/yaml',
          name: 'jobDetailYaml',
          component: () => import('./colony/sub/detail/resource/job/yaml.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/colony/sub/detail/resource/cronJob', // 工作负载-CronJob-详情
      name: 'cronJobDetail',
      component: () => import('./colony/sub/detail/resource/cronJob/index.vue'),
      redirect: '/colony/sub/detail/resource/cronJob/event', // 默认子路由
      meta: {
        keepAlive: true
      },
      children: [ // 子路由
        { // 事件
          path: '/colony/sub/detail/resource/cronJob/event',
          name: 'cronJobDetailEvent',
          component: () => import('./colony/sub/detail/resource/cronJob/event.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 详情
          path: '/colony/sub/detail/resource/cronJob/info',
          name: 'cronJobDetailInfo',
          component: () => import('./colony/sub/detail/resource/cronJob/info.vue'),
          meta: {
            keepAlive: true
          }
        },

        { // yaml
          path: '/colony/sub/detail/resource/cronJob/yaml',
          name: 'cronJobDetailYaml',
          component: () => import('./colony/sub/detail/resource/cronJob/yaml.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/colony/sub/detail/hpa', // 自动伸缩-详情
      name: 'hpaDetail',
      component: () => import('./colony/sub/detail/hpa/index.vue'),
      redirect: '/colony/sub/detail/hpa/info', // 默认子路由
      meta: {
        keepAlive: true
      },
      children: [ // 子路由
        { // 详情
          path: '/colony/sub/detail/hpa/info',
          name: 'hpaDetailInfo',
          component: () => import('./colony/sub/detail/hpa/info.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 事件
          path: '/colony/sub/detail/hpa/event',
          name: 'hpaDetailEvent',
          component: () => import('./colony/sub/detail/hpa/event.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // yaml
          path: '/colony/sub/detail/hpa/yaml',
          name: 'hpaDetailYaml',
          component: () => import('./colony/sub/detail/hpa/yaml.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/colony/sub/update/hpa', // 自动伸缩-编辑
      name: 'updateHpa',
      component: () => import('./colony/sub/update/hpa/updatePz.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/update/hpa/editYaml', // 自动伸缩-编辑yaml
      name: 'updateHpaYaml',
      component: () => import('./colony/sub/update/hpa/editYaml.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/detail/service/svc', // 服务-Service-详情
      name: 'svcDetail',
      component: () => import('./colony/sub/detail/service/svc/index.vue'),
      redirect: '/colony/sub/detail/service/svc/info', // 默认子路由
      meta: {
        keepAlive: true
      },
      children: [ // 子路由
        { // 详情
          path: '/colony/sub/detail/service/svc/info',
          name: 'svcDetailInfo',
          component: () => import('./colony/sub/detail/service/svc/info.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 事件
          path: '/colony/sub/detail/service/svc/event',
          name: 'svcDetailEvent',
          component: () => import('./colony/sub/detail/service/svc/event.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // yaml
          path: '/colony/sub/detail/service/svc/yaml',
          name: 'svcDetailYaml',
          component: () => import('./colony/sub/detail/service/svc/yaml.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/colony/sub/detail/service/ingress', // 服务-ingress-详情
      name: 'ingressDetail',
      component: () => import('./colony/sub/detail/service/ingress/index.vue'),
      redirect: '/colony/sub/detail/service/ingress/info', // 默认子路由
      meta: {
        keepAlive: true
      },
      children: [ // 子路由
        { // 详情
          path: '/colony/sub/detail/service/ingress/info',
          name: 'ingressDetailInfo',
          component: () => import('./colony/sub/detail/service/ingress/info.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 事件
          path: '/colony/sub/detail/service/ingress/event',
          name: 'ingressDetailEvent',
          component: () => import('./colony/sub/detail/service/ingress/event.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // yaml
          path: '/colony/sub/detail/service/ingress/yaml',
          name: 'ingressDetailYaml',
          component: () => import('./colony/sub/detail/service/ingress/yaml.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/colony/sub/detail/config/configmap', // 配置管理-ConfigMap-详情
      name: 'configmapDetail',
      component: () => import('./colony/sub/detail/config/configmap/index.vue'),
      redirect: '/colony/sub/detail/config/configmap/info', // 默认子路由
      meta: {
        keepAlive: true
      },
      children: [ // 子路由
        { // 详情
          path: '/colony/sub/detail/config/configmap/info',
          name: 'configmapDetailInfo',
          component: () => import('./colony/sub/detail/config/configmap/info.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // yaml
          path: '/colony/sub/detail/config/configmap/yaml',
          name: 'configmapDetailYaml',
          component: () => import('./colony/sub/detail/config/configmap/yaml.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    { // 配置管理更新配置configmap
      path: '/colony/sub/update/config/configMap',
      name: 'updateConfigMap',
      component: () => import('./colony/sub/update/config/configMap.vue'),
      meta: {
        keepAlive: true
      }
    },
    { // 配置管理更新配置configmap yaml
      path: '/colony/sub/update/config/yaml',
      name: 'updateYaml',
      component: () => import('./colony/sub/update/config/yaml.vue'),
      meta: {
        keepAlive: true
      }
    },
    { // 更新命名空间 yaml
      path: '/colony/sub/update/namespace/yaml',
      name: 'updateNameSpace',
      component: () => import('./colony/sub/update/namespace/yaml.vue'),
      meta: {
        keepAlive: true
      }
    },
    { // 更新工作负载statefulSet yaml
      path: '/colony/sub/update/resource/statefulSet',
      name: 'updateStatefulSet',
      component: () => import('./colony/sub/update/resource/statefulSet/yaml.vue'),
      meta: {
        keepAlive: true
      }
    },
    { // 更新工作负载deployment yaml
      path: '/colony/sub/update/resource/deployment',
      name: 'updateDeployment',
      component: () => import('./colony/sub/update/resource/deployment/yaml.vue'),
      meta: {
        keepAlive: true
      }
    },
    { // 更新工作负载deployment yaml
      path: '/colony/sub/update/resource/cronJob',
      name: 'updateCronJob',
      component: () => import('./colony/sub/update/resource/cronJob/yaml.vue'),
      meta: {
        keepAlive: true
      }
    },
    { // 更新工作负载daemonSet yaml
      path: '/colony/sub/update/resource/daemonSet',
      name: 'updateDaemonSet',
      component: () => import('./colony/sub/update/resource/daemonSet/yaml.vue'),
      meta: {
        keepAlive: true
      }
    },
    { // 更新工作负载job yaml
      path: '/colony/sub/update/resource/job',
      name: 'updateJob',
      component: () => import('./colony/sub/update/resource/job/yaml.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/colony/sub/detail/config/secret', // 配置管理-secret-详情
      name: 'secretDetail',
      component: () => import('./colony/sub/detail/config/secret/index.vue'),
      redirect: '/colony/sub/detail/config/secret/info', // 默认子路由
      meta: {
        keepAlive: true
      },
      children: [ // 子路由
        { // 详情
          path: '/colony/sub/detail/config/secret/info',
          name: 'secretDetailInfo',
          component: () => import('./colony/sub/detail/config/secret/info.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // yaml
          path: '/colony/sub/detail/config/secret/yaml',
          name: 'secretDetailYaml',
          component: () => import('./colony/sub/detail/config/secret/yaml.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/colony/sub/detail/storage/pv', // 存储-PersistentVolume-详情
      name: 'pvDetail',
      component: () => import('./colony/sub/detail/storage/pv/index.vue'),
      redirect: '/colony/sub/detail/storage/pv/info', // 默认子路由
      meta: {
        keepAlive: true
      },
      children: [ // 子路由
        { // 详情
          path: '/colony/sub/detail/storage/pv/info',
          name: 'pvDetailInfo',
          component: () => import('./colony/sub/detail/storage/pv/info.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 事件
          path: '/colony/sub/detail/storage/pv/event',
          name: 'pvDetailEvent',
          component: () => import('./colony/sub/detail/storage/pv/event.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // yaml
          path: '/colony/sub/detail/storage/pv/yaml',
          name: 'pvDetailYaml',
          component: () => import('./colony/sub/detail/storage/pv/yaml.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/colony/sub/detail/storage/pvc', // 存储--PersistentVolumeClaim-详情
      name: 'pvcDetail',
      component: () => import('./colony/sub/detail/storage/pvc/index.vue'),
      redirect: '/colony/sub/detail/storage/pvc/info', // 默认子路由
      meta: {
        keepAlive: true
      },
      children: [ // 子路由
        { // 详情
          path: '/colony/sub/detail/storage/pvc/info',
          name: 'pvcDetailInfo',
          component: () => import('./colony/sub/detail/storage/pvc/info.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 事件
          path: '/colony/sub/detail/storage/pvc/event',
          name: 'pvcDetailEvent',
          component: () => import('./colony/sub/detail/storage/pvc/event.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // yaml
          path: '/colony/sub/detail/storage/pvc/yaml',
          name: 'pvcDetailYaml',
          component: () => import('./colony/sub/detail/storage/pvc/yaml.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },
    {
      path: '/colony/sub/detail/storage/sc', // 存储--StorageClass-详情
      name: 'scDetail',
      component: () => import('./colony/sub/detail/storage/sc/index.vue'),
      redirect: '/colony/sub/detail/storage/sc/info', // 默认子路由
      meta: {
        keepAlive: true
      },
      children: [ // 子路由
        { // 详情
          path: '/colony/sub/detail/storage/sc/info',
          name: 'scDetailInfo',
          component: () => import('./colony/sub/detail/storage/sc/info.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // 事件
          path: '/colony/sub/detail/storage/sc/event',
          name: 'scDetailEvent',
          component: () => import('./colony/sub/detail/storage/sc/event.vue'),
          meta: {
            keepAlive: true
          }
        },
        { // yaml
          path: '/colony/sub/detail/storage/sc/yaml',
          name: 'scDetailYaml',
          component: () => import('./colony/sub/detail/storage/sc/yaml.vue'),
          meta: {
            keepAlive: true
          }
        }
      ]
    },

    {
      path: '/helm', // helm应用
      name: 'helm',
      component: () => import( /* webpackChunkName: "helm" */ './helm/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/helmDetail', // helm详情
      name: 'helmDetail',
      component: () => import( /* webpackChunkName: "helm" */ './helm/helmDetail/index.vue'),
      meta: {
        keepAlive: true
      },
      children: [{
          path: 'detail', // 应用详情
          name: 'helmDetailDetail',
          component: () => import( /* webpackChunkName: "myMirror" */ './helm/helmDetail/detail.vue'),
          meta: {
            keepAlive: true,
            flag: true
          }
        },
        {
          path: 'history', // 版本命名
          name: 'helmDetailHistory',
          component: () => import( /* webpackChunkName: "myMirror" */ './helm/helmDetail/history.vue'),
          meta: {
            keepAlive: true,
            flag: false
          }
        }
      ]
    },
    {
      path: '/helmCreate', // helm应用
      name: 'helmCreate',
      component: () => import( /* webpackChunkName: "helm" */ './helmCreate/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/myMirror', // 我的镜像
      name: 'myMirror',
      component: () => import( /* webpackChunkName: "myMirror" */ './myMirror/index.vue'),
      redirect: '/myMirror/user',
      meta: {
        keepAlive: true
      },
      children: [{
          path: 'user', // 我的镜像
          name: 'myMirrorUser',
          component: () => import( /* webpackChunkName: "myMirror" */ './myMirror/user.vue'),
          meta: {
            keepAlive: true,
            flag: true
          }
        },
        {
          path: 'local', // 命名空间
          name: 'myMirrorLocal',
          component: () => import( /* webpackChunkName: "myMirror" */ './myMirror/local.vue'),
          meta: {
            keepAlive: true,
            flag: false
          }
        }
      ]
    },
    {
      path: '/mirrorDetail', // 镜像详情
      name: 'mirrorDetail',
      component: () => import( /* webpackChunkName: "myFavorite" */ './mirrorDetail/index.vue'),
      redirect: '/mirrorDetail/info',
      meta: {
        keepAlive: true
      },
      children: [{
          path: 'info', // 镜像信息
          name: 'mirrorDetailInfo',
          component: () => import( /* webpackChunkName: "myMirror" */ './mirrorDetail/info.vue'),
          meta: {
            keepAlive: true,
            flag: 1
          }
        },
        {
          path: 'detail', // 镜像详情
          name: 'mirrorDetailDetail',
          component: () => import( /* webpackChunkName: "myMirror" */ './mirrorDetail/detail.vue'),
          meta: {
            keepAlive: true,
            flag: 2
          }
        },
        {
          path: 'build', // 镜像构建
          name: 'mirrorDetailBuild',
          component: () => import( /* webpackChunkName: "myMirror" */ './mirrorDetail/build/build.vue'),
          meta: {
            keepAlive: true,
            flag: 3
          }
        },
        {
          path: 'touch', // 触发器
          name: 'mirrorDetailTouch',
          component: () => import( /* webpackChunkName: "myMirror" */ './mirrorDetail/touch.vue'),
          meta: {
            keepAlive: true,
            flag: 4
          }
        }
      ]
    },
    {
      path: '/config', // 构建配置
      name: 'mirrorDetailConfig',
      component: () => import( /* webpackChunkName: "myMirror" */ './mirrorDetail/build/config.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/myFavorite', // 我的收藏
      name: 'myFavorite',
      component: () => import( /* webpackChunkName: "myFavorite" */ './myFavorite/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/DockerHub', // DockerHub
      name: 'DockerHub',
      component: () => import( /* webpackChunkName: "DockerHub" */ './DockerHub/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/DockerHubDetail', // DockerHubDetail
      name: 'DockerHubDetail',
      component: () => import( /* webpackChunkName: "DockerHub" */ './DockerHubDetail/index.vue'),
      meta: {
        keepAlive: true
      },
      children: [{
          path: 'info', // 基本信息
          name: 'DockerHubDetailInfo',
          component: () => import( /* webpackChunkName: "myMirror" */ './DockerHubDetail/info.vue'),
          meta: {
            keepAlive: true,
            flag: true
          }
        },
        {
          path: 'detail', // 详情描述
          name: 'DockerHubDetailDetail',
          component: () => import( /* webpackChunkName: "myMirror" */ './DockerHubDetail/detail.vue'),
          meta: {
            keepAlive: true,
            flag: false
          }
        }
      ]
    },
    {
      path: '/totalMirror', // 共有镜像
      name: 'totalMirror',
      component: () => import( /* webpackChunkName: "totalMirror" */ './totalMirror/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/totalMirrorDetail', // DockerHubDetail
      name: 'totalMirrorDetail',
      component: () => import( /* webpackChunkName: "DockerHub" */ './totalMirrorDetail/index.vue'),
      meta: {
        keepAlive: true
      },
      children: [{
          path: 'version', // 镜像版本
          name: 'totalMirrorDetailVersion',
          component: () => import( /* webpackChunkName: "myMirror" */ './totalMirrorDetail/version.vue'),
          meta: {
            keepAlive: true,
            flag: true
          }
        },
        {
          path: 'info', // 镜像信息
          name: 'totalMirrorDetailInfo',
          component: () => import( /* webpackChunkName: "myMirror" */ './totalMirrorDetail/info.vue'),
          meta: {
            keepAlive: true,
            flag: false
          }
        }
      ]
    },
    {
      path: '/logCollection', // 日志采集
      name: 'logCollection',
      component: () => import( /* webpackChunkName: "logCollection" */ './logCollection/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/logCreate', // 日志新建
      name: 'logCreate',
      component: () => import( /* webpackChunkName: "logCreate" */ './logCreate/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/logDetail', // 日志详情
      name: 'logDetail',
      component: () => import( /* webpackChunkName: "logCreate" */ './logCollection/detail.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/warnings', // 告警设置
      name: 'warnings',
      component: () => import( /* webpackChunkName: "warnings" */ './warnings/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/warningDetail', // 告警设置
      name: 'warningDetail',
      component: () => import( /* webpackChunkName: "warnings" */ './warnings/detail.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/warningCreate',
      name: 'warningCreate',
      component: () => import( /* webpackChunkName: "warningCreate" */ './warningCreate/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/warningUpdate',
      name: 'warningUpdate',
      component: () => import( /* webpackChunkName: "warningCreate" */ './warningCreate/update.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/warningCopy',
      name: 'warningCopy',
      component: () => import( /* webpackChunkName: "warningCreate" */ './warningCreate/copy.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/persistence', // 事件持久化
      name: 'persistence',
      component: () => import( /* webpackChunkName: "persistence" */ './persistence/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/persistenceSetting/:uid', // 设置事件持久化
      props: true,
      name: 'persistenceSetting',
      component: () => import( /* webpackChunkName: "persistenceSetting" */ './persistenceSetting/index.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/editYaml/:rid', // 更新调度策略
      name: 'editYaml',
      component: () => import('./colony/sub/update/resource/editYaml.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/configure/:rid', // 更新调度策略
      name: 'configure',
      component: () => import('./colony/sub/update/service/configure.vue'),
      meta: {
        keepAlive: true
      }
    }
  ]
})
