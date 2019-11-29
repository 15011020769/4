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
      path: '/addPolicyToUser', // 用户添加到策略
      name: 'addPolicyToUser',
      component: () => import(/* webpackChunkName: "Cam" */ './UserList/addPolicyToUser.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/addTeamUser', // 添加到用户组
      name: 'addTeamUser',
      component: () => import(/* webpackChunkName: "Cam" */ './UserList/addTeamUser.vue'),
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
      path: '/adduser',//添加用户组
      name: 'adduser',
      component: () => import(/*webpackChunkName:"Cam"*/'./UserList/adduser.vue'),
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
      path: '/Interfacedetails',//接口详情
      name: 'Interfacedetails',
      component: () => import(/*webpackChunkName:"Cam"*/'./UserGroup/Interfacedetails.vue'),
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
      path: '/details',//用户详情
      name: 'details',
      component: () => import(/*webpackChunkName:"Cam"*/'./UserList/details.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/adduser',//添加用户组
      name: 'adduser',
      component: () => import(/*webpackChunkName:"Cam"*/'./UserList/adduser.vue'),
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
      path: '/RoleDetail', // 角色
      name: 'RoleDetail',
      component: () => import(/* webpackChunkName: "Cam" */ './Role/RoleDetail.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/createServe', // 新建角色产品服务
      name: 'createServe',
      component: () => import(/* webpackChunkName: "Cam" */ './Role/createServe.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/createAccount', // 新建腾讯云账户
      name: 'createAccount',
      component: () => import(/* webpackChunkName: "Cam" */ './Role/createAccount.vue'),
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/createProvider', // 新建身份提供商
      name: 'createProvider',
      component: () => import(/* webpackChunkName: "Cam" */ './Role/createProvider.vue'),
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
      path: '/NewIdentityProvider',//新建身份提供商
      name: 'NewIdentityProvider',
      component: () => import(/*webpackChunkName:"Cam"*/'./IdentityProvider/NewIdentityProvider.vue'),
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
