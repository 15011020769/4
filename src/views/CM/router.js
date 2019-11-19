import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    redirect: {
        name: 'CVM'
    },
    routes: [{
            path: '/',
            redirect: '/overview'
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
            path: '/cloudMysql', // 云数据库
            name: 'cloudMysql',
            component: () =>
                import ( /* webpackChunkName: "cloudMysql" */ './cloudMysql/index.vue'),
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/CMMysqldetails', // 云数据库详情
            name: 'CMMysqldetails',
            component: () =>
                import ( /* webpackChunkName: "cloudMysql" */ './cloudMysql/details.vue'),
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
                import ( /* webpackChunkName: "objectStorage" */ './overview/overview.vue'),
            meta: {
                keepAlive: true
            }
        },
        // -----------------------------------------------------
        {
            path: '/Template', //  触发条件模板
            name: 'Template',
            component: () =>
                import ( /* webpackChunkName: "objectStorage" */ './Template/Template.vue'),
            meta: {
                keepAlive: true
            }
        },
        // -----------------------------------------------------
        {
            path: '/Toconfigure', //     告警配置
            name: 'Toconfigure',
            component: () =>
                import ( /* webpackChunkName: "objectStorage" */ './Toconfigure/Toconfigure.vue'),
            meta: {
                keepAlive: true
            }
        },
        // -----------------------------------------------------
        {
            path: '/History', //       告警历史
            name: 'History',
            component: () =>
                import ( /* webpackChunkName: "objectStorage" */ './History/History.vue'),
            meta: {
                keepAlive: true
            }
        },
        // -----------------------------------------------------
        {
            path: '/flow', //       流量监控
            name: 'flow',
            component: () =>
                import ( /* webpackChunkName: "objectStorage" */ './flow/flow.vue'),
            meta: {
                keepAlive: true
            }
        },
        // -----------------------------------------------------
        {
            path: '/EventCenter', //       事件中心
            name: 'EventCenter',
            component: () =>
                import ( /* webpackChunkName: "objectStorage" */ './EventCenter/EventCenter.vue'),
            meta: {
                keepAlive: true
            }
        },
        // -----------------------------------------------------
        {
            path: '/Dashboard', //       Dashboard
            name: 'Dashboard',
            component: () =>
                import ( /* webpackChunkName: "objectStorage" */ './Dashboard/Dashboard.vue'),
            meta: {
                keepAlive: true
            }
        },
        // -----------------------------------------------------
        {
            path: '/Custom', //       自定义监控
            name: 'Custom',
            component: () =>
                import ( /* webpackChunkName: "objectStorage" */ './Custom/Custom.vue'),
            meta: {
                keepAlive: true
            }
        },
        // -----------------------------------------------------
        {
            path: '/Casegrouping', //           实例分组
            name: 'Casegrouping',
            component: () =>
                import ( /* webpackChunkName: "objectStorage" */ './Casegrouping/Casegrouping.vue'),
            meta: {
                keepAlive: true
            }
        },
    ]
})