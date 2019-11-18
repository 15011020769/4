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
        // {
        //     path: '/NATdetails', // nat详情
        //     name: 'NATdetails',
        //     component: () =>
        //         import ( /* webpackChunkName: "NATgateway" */ './NATdetails/details.vue'),
        //     meta: {
        //         keepAlive: true
        //     }
        // },
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
        }
    ]
})