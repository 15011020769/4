module.exports = {
    menu: {
        x1: '云监控',
        x2: '云服务器',
        x3: '块存储',
        x4: '负载均衡-CLB',
        x5: '云数据库',
        x6: 'MySQL',
        x7: 'Redis',
        x8: '私有网络',
        x9: 'NAT网关',
        x10: 'VPN网关',
        x11: 'VPN通道',
        x12: '弹性公网IP',
        x13: '专线接入',
        x14: '物理专线',
        x15: '专线通道',
        x16: '对象存储'
    },
    CVM: {
        slfz: '实例分组',
        zdyjk: '自定义监控',
        nwang: '内网',
        title: '云服务器',
        sjzx: '事件中心',
        lljk: '流量监控',
        gjls: '告警历史',
        jkgl: '监控概览',
        zxwg: '专线网关',
        cftjmb: '触发条件模板',
        gjpz: '告警配置',
        dxcc: '对象存储',
        ddlj: '对等连接',
        wlzx: '专线接入-物理专线',
        zxtd: '专线接入-专线通道',
        td: 'VPN通道',
        vpnwg: 'VPN网关',
        errorTxt: '请输入正确搜索信息',
        table: {
            x1: 'ID/主机名',
            x2: '监控',
            x3: '状态',
            x4: '网络类型',
            x5: 'IP地址',
            x6: '所属项目',
            x7: '健康状态'
        },
        searchOptions: [{
                value: "project-id",
                label: "项目ID"
            },
            {
                value: "instance-id",
                label: "实例ID"
            },
            {
                value: "instance-name",
                label: "实例名称"
            },
            {
                value: "private-ip-address",
                label: "内网IP"
            },
            {
                value: "public-ip-address ",
                label: "公网IP"
            }
        ],
        instanceStatus: {
            PENDING: "创建中",
            LAUNCH_FAILED: "创建失败",
            RUNNING: "运行中",
            STOPPED: "已关机",
            STARTING: "开机中",
            STOPPING: "关机中",
            REBOOTING: "重启中",
            SHUTDOWN: "待回收",
            TERMINATING: "销毁中"
        },
        RestrictState: {
            NORMAL: "健康",
            EXPIRED: "过期",
            PROTECTIVELY_ISOLATED: "隔离"
        },
        clBload: {
            zs: '注释：Max、Min和Avg数值统计为当前折线图内所有点的最大值、最小值和平均值',
            dcsj: '导出数据',
            zwsj: '暂无数据',
            jqjkzt: '集群健康状态',
            clm: '策略名',
            cllx: '策略类型',
            cftj: '触发条件',
            zjxg: '最近修改',
            glslz: '关联实例组',
            cz: '操作',
            jk: '监控',
            gjcl: '告警策略',
            fhlb: '返回列表',
            fzjh: '负载均衡CLB',
            zjm: 'ID/主机名',
            zt: '状态',
            wllx: '网络类型',
            sswl: '所属网络',
            cjsj: '创建时间',
            txdz: '弹性IP地址',
            slid: '实例id',
            wg: 'NAT网关',
            sywl: '私有网络',
            txgw: '弹性公网IP',
            wglc: '网关类型',
            gg: '规格',
            ddwg: '对端网关',
        },
        cloudDisk: {
            yyp: '云硬盘',
            mc: 'ID/名称',
            dx: '大小(GB)',
            yplx: '硬盘类型',
            glyzj: '关联云主机ID/名称',
        },
        cloudMysql: {
           nw: '内网IP/端口',
           lx: '类型',
           wl: 'VPC 网络',
        },
        objectStorage: {
            dy: '地域',
            bkmc: 'Bucket名称',
        },
        peerConnect: {
            qsrzjm: '请输入IP或主机名',
            bdsywl: '本端私有网络',
            ddsywl: '对端私有网络',
            dksx: '带宽上限',
            wsx: '无上限',
        },
        Physics: {
            dk: '带宽',
            szd: '所在地',
            tdmc: '通道ID/名称',
        }
    },
    COM: require('@/components/language/jt'),
}