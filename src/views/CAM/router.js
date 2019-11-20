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
      redirect: '/UserGroup'
    },
    {
      path: '/UserGroup', // 用户组
      name: 'UserGroup',
      component: () => import(/* webpackChunkName: "Cam" */ './UserGroup/UserGroup.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/UserList', // 用户列表
      name: 'UserList',
      component: () => import(/* webpackChunkName: "Cam" */ './UserList/UserList.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/NewUser', // 新建用户
      name: 'NewUser',
      component: () => import(/* webpackChunkName: "Cam" */ './UserList/NewUser.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/custormCreate', // 自定义用户创建
      name: 'custormCreate',
      component: () => import(/* webpackChunkName: "Cam" */ './UserList/custormCreate.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/weChatImp', // 自定义用户创建
      name: 'weChatImp',
      component: () => import(/* webpackChunkName: "Cam" */ './UserList/weChatImp.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/create', // 新建协作者
      name: 'create',
      component: () => import(/* webpackChunkName: "Cam" */ './UserList/create.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/messageCreate', // 新建消息接收人
      name: 'messageCreate',
      component: () => import(/* webpackChunkName: "Cam" */ './UserList/messageCreate.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/NewUserGroup', // 新建用户组
      name: 'NewUserGroup',
      component: () => import(/* webpackChunkName: "Cam" */ './UserGroup/NewUserGroup.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/Strategy', // 策略
      name: 'Strategy',
      component: () => import(/* webpackChunkName: "Cam" */ './Strategy/Strategy.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/StrategyDetail', // 策略详情
      name: 'StrategyDetail',
      component: () => import(/* webpackChunkName: "Cam" */ './Strategy/StrategyDetail.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/Role', // 角色
      name: 'Role',
      component: () => import(/* webpackChunkName: "Cam" */ './Role/Role.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/IdentityProvider', // 身份提供商
      name: 'IdentityProvider',
      component: () => import(/* webpackChunkName: "Cam" */ './IdentityProvider/IdentityProvider.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/ApiKeyManager', // API密钥管理
      name: 'ApiKeyManager',
      component: () => import(/* webpackChunkName: "CvmRecycle" */ './AccessKey/ApiKeyManager/ApiKeyManager.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/ProgrameKey', // 项目密钥管理
      name: 'ProgrameKey',
      component: () => import(/* webpackChunkName: "CbsRecycle" */ './AccessKey/ProgrameKey/ProgrameKey.vue'),
      meta: {
        keepAlive: true
      }
    }
  ]
})
