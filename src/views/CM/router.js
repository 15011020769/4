import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    redirect: {
        name: 'CVM'
    },
    routes: [{
            path: '/',
            redirect: '/CVM'
        },
        {
            path: '/CVM', // 云服务器
            name: 'CVM',
            component: () =>
                import ( /* webpackChunkName: "CVM" */ './CVM/index.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/CMCVMdetails', // 云服务器详情监控
            name: 'CMCVMdetails',
            component: () =>
                import ( /* webpackChunkName: "CVM" */ './CVM/details.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/cloudDisk', // 云硬盘
            name: 'cloudDisk',
            component: () =>
                import ( /* webpackChunkName: "cloudDisk" */ './cloudDisk/index.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/Diskdetails', // 云硬盘详情
            name: 'Diskdetails',
            component: () =>
                import ( /* webpackChunkName: "cloudDisk" */ './cloudDisk/details.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/CLBload', // 负载均衡
            name: 'CLBload',
            component: () =>
                import ( /* webpackChunkName: "CLBload" */ './CLBload/index.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/CLBloaddetails', // 负载均衡详情监控
            name: 'CLBloaddetails',
            component: () =>
                import ( /* webpackChunkName: "CLBload" */ './CLBload/details.vue'),
            meta: {
                keepAlive: true
            }
        },


        {
            path: '/cloudMysql', // Mysql
            name: 'cloudMysql',
            component: () =>
                import ( /* webpackChunkName: "cloudMysql" */ './cloudMysql/index.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/CMMysqldetails', // Mysql详情
            name: 'CMMysqldetails',
            component: () =>
                import ( /* webpackChunkName: "cloudMysql" */ './cloudMysql/details.vue'),
            meta: {
                keepAlive: true
            }
        },



        {
            path: '/Redis', // redis
            name: 'Redis',
            component: () =>
                import ( /* webpackChunkName: "Redis" */ './redis/index.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/Redisdetails', //  redis详情监控
            name: 'Redisdetails',
            component: () =>
                import ( /* webpackChunkName: "Redis" */ './redis/details.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/networkIP', // 弹性公网IP
            name: 'networkIP',
            component: () =>
                import ( /* webpackChunkName: "networkIP" */ './network/index.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/networkdetails', //  弹性公网IP详情监控
            name: 'networkdetails',
            component: () =>
                import ( /* webpackChunkName: "networkIP" */ './network/details.vue'),
            meta: {
                keepAlive: true
            }
        },


        {
            path: '/Private', // 专线通道
            name: 'Private',
            component: () =>
                import ( /* webpackChunkName: "Private" */ './Private/index.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/Privatedetails', //  专线通道详情监控
            name: 'Privatedetails',
            component: () =>
                import ( /* webpackChunkName: "Private" */ './Private/details.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/Physics', // 物理专线
            name: 'Physics',
            component: () =>
                import ( /* webpackChunkName: "Physics" */ './Physics/index.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/Physicsdetails', //  物理专线详情监控
            name: 'Physicsdetails',
            component: () =>
                import ( /* webpackChunkName: "Physics" */ './Physics/details.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/NATgateway', // nat
            name: 'NATgateway',
            component: () =>
                import ( /* webpackChunkName: "NATgateway" */ './NATgateway/index.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/NATdetails', // nat详情
            name: 'NATdetails',
            component: () =>
                import ( /* webpackChunkName: "NATgateway" */ './NATgateway/details.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/PrivateGateway', // 专线网关
            name: 'NATgateway',
            component: () =>
                import ( /* webpackChunkName: "PrivateGateway" */ './PrivateGateway/index.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/PrivateGatewaydetails', // 专线网关详情
            name: 'NATdetails',
            component: () =>
                import ( /* webpackChunkName: "PrivateGatewaydetails" */ './PrivateGateway/details.vue'),
            meta: {
                keepAlive: true
            }
        },






        {
            path: '/peerConnect', // 对等链接
            name: 'peerConnect',
            component: () =>
                import ( /* webpackChunkName: "peerConnect" */ './peerConnect/index.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/CMpeerdetails', // 对等链接详情
            name: 'CMpeerdetails',
            component: () =>
                import ( /* webpackChunkName: "peerConnect" */ './peerConnect/details.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/VPNgateway', // vpn网关
            name: 'VPNgateway',
            component: () =>
                import ( /* webpackChunkName: "VPNgateway" */ './VPNgateway/index.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/CMVPNdetails', // vpn网关详情
            name: 'CMVPNdetails',
            component: () =>
                import ( /* webpackChunkName: "VPNgateway" */ './VPNgateway/details.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/VPNchannel', // vpn通道
            name: 'VPNchannel',
            component: () =>
                import ( /* webpackChunkName: "VPNchannel" */ './VPNchannel/index.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/CMVPNTdetails', // vpn通道详情
            name: 'CMVPNTdetails',
            component: () =>
                import ( /* webpackChunkName: "VPNchannel" */ './VPNchannel/details.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/objectStorage', // 对象存储
            name: 'objectStorage',
            component: () =>
                import ( /* webpackChunkName: "objectStorage" */ './objectStorage/index.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/CMobjdetails', // 对象存储
            name: 'CMobjdetails',
            component: () =>
                import ( /* webpackChunkName: "objectStorage" */ './objectStorage/details.vue'),
            meta: {
                keepAlive: true
            }
        },
        // -----------------------------------------------------
        {
            path: '/overview', // 监控概览
            name: 'overview',
            component: () =>
                import ( /* webpackChunkName: "overview" */ './overview/overview.vue'),
            meta: {
                keepAlive: true
            }
        },
        // -----------------------------------------------------
        {
            path: '/Template', //  触发条件模板
            name: 'Template',
            component: () =>
                import ( /* webpackChunkName: "Template" */ './Template/Template.vue'),
            meta: {
                keepAlive: true
            }
        },
        // -----------------------------------------------------
        {
            path: '/Toconfigure', //     告警配置
            name: 'Toconfigure',
            component: () =>
                import ( /* webpackChunkName: "Toconfigure" */ './Toconfigure/Toconfigure.vue'),
            meta: {
                keepAlive: true
            }
        },
        // -----------------------------------------------------
        {
            path: '/History', //       告警历史
            name: 'History',
            component: () =>
                import ( /* webpackChunkName: "History" */ './History/History.vue'),
            meta: {
                keepAlive: true
            }
        },
        // -----------------------------------------------------
        {
            path: '/flow', //       流量监控
            name: 'flow',
            component: () =>
                import ( /* webpackChunkName: "flow" */ './flow/flow.vue'),
            meta: {
                keepAlive: true
            }
        },
        // -----------------------------------------------------
        {
            path: '/EventCenter', //       事件中心
            name: 'EventCenter',
            component: () =>
                import ( /* webpackChunkName: "EventCenter" */ './EventCenter/EventCenter.vue'),
            meta: {
                keepAlive: true
            }
        },
        // -----------------------------------------------------
        {
            path: '/Dashboard', //       Dashboard
            name: 'Dashboard',
            component: () =>
                import ( /* webpackChunkName: "Dashboard" */ './Dashboard/Dashboard.vue'),
            meta: {
                keepAlive: true
            }
        },
        // -----------------------------------------------------
        {
            path: '/Custom', //       自定义监控
            name: 'Custom',
            component: () =>
                import ( /* webpackChunkName: "Custom" */ './Custom/Custom.vue'),
            meta: {
                keepAlive: true
            }
        },
        // -----------------------------------------------------
        {
            path: '/Casegrouping', //           实例分组
            name: 'Casegrouping',
            component: () =>
                import ( /* webpackChunkName: "Casegrouping" */ './Casegrouping/Casegrouping.vue'),
            meta: {
                keepAlive: true
            }
        },
    ]
})