import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  redirect: {
    name: 'UserGroup'
  },
  routes: [{
    path: '/',
    redirect: '/UserListNew'
  },
  {
    path: '/serviceAuthority', // 服务授权
    name: 'serviceAuthority',
    component: () => import( /* webpackChunkName: "UserGroup" */ './Role/serviceAuthority.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/apisecretkey', // API密钥管理
    name: 'apisecretkey',
    component: () => import( /* webpackChunkName: "UserGroup" */ './apisecretkey/apisecretkey.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/UserGroup', // 用户组
    name: 'UserGroup',
    component: () => import( /* webpackChunkName: "UserGroup" */ './UserGroup/UserGroup.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/carrier', // 角色关联载体
    name: 'carrier',
    component: () => import( /* webpackChunkName: "carrier" */ './Role/component/carrier.vue'),
    meta: {
      keepAlive: true
    }
  },
  //新用户列表
  {
    path: '/UserListNew',
    name: 'UserListNew',
    component: () => import( /* webpackChunkName: "UserListNew" */ './UserListNew/UserListNew.vue'),
    meta: {
      keepAlive: true
    }
  },
  //新新建用户
  {
    path: '/adduserNew',
    name: 'adduserNew',
    component: () => import( /* webpackChunkName: "UserListNew" */ './UserListNew/addUser'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/adduserlist',
    name: 'adduserList',
    component: () => import( /* webpackChunkName: "adduserNew" */ './UserListNew/addUser/adduserList'),
    meta: {
      keepAlive: true
    }
  },
  //新用户详情
  {
    path: '/detailsUser',
    name: 'detailsUser',
    component: () => import( /* webpackChunkName: "UserListNew" */ './UserListNew/detailsUser'),
    meta: {
      keepAlive: true
    }
  },
  //新策略添加到用户
  {
    path: "/addPolicyToUser",
    name: "addPolicyToUser",
    component: () => import( /* webpackChunkName: "detailsUser" */ './UserListNew/module/addPolicyToUser'),
    meta: {
      keepAlive: true
    }
  },
  //新用户添加到用户组
  {
    path: "/addGroup",
    name: "addGroup",
    component: () => import( /* webpackChunkName: "detailsUser" */ './UserListNew/module/addGroup'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/UserList', // 用户列表
    name: 'UserList',
    component: () => import( /* webpackChunkName: "UserList" */ './UserList/UserList.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/addTeamUser', // 添加到用户组
    name: 'addTeamUser',
    component: () => import( /* webpackChunkName: "addTeamUser" */ './UserList/addTeamUser.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/NewUser', // 新建用户
    name: 'NewUser',
    component: () => import( /* webpackChunkName: "NewUser" */ './UserList/NewUser.vue'),
    meta: {
      keepAlive: true
    }
  },
  // {
  //   path: '/adduser', //添加用户组
  //   name: 'adduser',
  //   component: () => import( /* webpackChunkName:"adduser" */ './UserList/adduser.vue'),
  //   meta: {
  //     keepAlive: true
  //   }
  // },
  {
    path: '/custormCreate', // 自定义用户创建
    name: 'custormCreate',
    component: () => import( /* webpackChunkName: "custormCreate" */ './UserList/custormCreate.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/weChatImp', // 自定义用户创建
    name: 'weChatImp',
    component: () => import( /* webpackChunkName: "weChatImp" */ './UserList/weChatImp.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/create', // 新建协作者
    name: 'create',
    component: () => import( /* webpackChunkName: "create" */ './UserList/create.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/Interfacedetails', //接口详情
    name: 'Interfacedetails',
    component: () => import( /* webpackChunkName:"UserGroup" */ './UserGroup/Interfacedetails.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/messageCreate', // 新建消息接收人
    name: 'messageCreate',
    component: () => import( /* webpackChunkName: "messageCreate" */ './UserList/messageCreate.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/NewUserGroup', // 新建用户组
    name: 'NewUserGroup',
    component: () => import( /* webpackChunkName: "UserGroup" */ './UserGroup/NewUserGroup.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/adduser', //添加用户组
    name: 'adduser',
    component: () => import( /*webpackChunkName:"adduser"*/ './UserList/adduser.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/Strategy', // 策略
    name: 'Strategy',
    component: () => import( /* webpackChunkName: "Strategy" */ './Strategy/Strategy.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/StrategyDetail', // 策略详情
    name: 'StrategyDetail',
    component: () => import( /* webpackChunkName: "Strategy" */ './Strategy/StrategyDetail.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/Role', // 角色
    name: 'Role',
    component: () => import( /* webpackChunkName: "Role" */ './Role/Role.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/RoleDetail', // 角色
    name: 'RoleDetail',
    component: () => import( /* webpackChunkName: "Role" */ './Role/RoleDetail.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/createServe', // 新建角色产品服务
    name: 'createServe',
    component: () => import( /* webpackChunkName: "Role" */ './Role/createServe.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/createAccount', // 新建腾讯雲账户
    name: 'createAccount',
    component: () => import( /* webpackChunkName: "Role" */ './Role/createAccount.vue'),
    meta: {
      keepAlive: true
    }
  },
  // {
  //   path: '/createProvider', // 新建身份提供商
  //   name: 'createProvider',
  //   component: () => import( /* webpackChunkName: "Role" */ './Role/createProvider.vue'),
  //   meta: {
  //     keepAlive: true
  //   }
  // },
  // {
  //   path: '/IdentityProvider', // 身份提供商
  //   name: 'IdentityProvider',
  //   component: () => import( /* webpackChunkName: "IdentityProvider" */ './IdentityProvider/IdentityProvider.vue'),
  //   meta: {
  //     keepAlive: true
  //   }
  // },
  // {
  //   path: '/IdentityProviderDetail/:name', // 身份提供商详情
  //   name: 'IdentityProviderDetail',
  //   component: () => import( /* webpackChunkName: "IdentityProvider" */ './IdentityProvider/ProviderDetail.vue'),
  //   meta: {
  //     keepAlive: true
  //   }
  // },
  // {
  //   path: '/NewIdentityProvider', //新建身份提供商
  //   name: 'NewIdentityProvider',
  //   component: () => import( /*webpackChunkName:"IdentityProvider"*/ './IdentityProvider/NewIdentityProvider.vue'),
  //   meta: {
  //     keepAlive: true
  //   }
  // },
  {
    path: '/ApiKeyManager', // API密钥管理
    name: 'ApiKeyManager',
    component: () => import( /* webpackChunkName: "ApiKeyManager" */ './AccessKey/ApiKeyManager/ApiKeyManager.vue'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/ProgrameKey', // 项目密钥管理
    name: 'ProgrameKey',
    component: () => import( /* webpackChunkName: "ProgrameKey" */ './AccessKey/ProgrameKey/ProgrameKey.vue'),
    meta: {
      keepAlive: true
    }
  }
  ]
})
