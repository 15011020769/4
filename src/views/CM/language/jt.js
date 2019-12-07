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
        title: '云服务器',
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
        }
    },
    COM: {
        calculate: '计算',
        cvm: '云服务器',
        cbs: '云硬盘',
        tke: '容器服务',
        as: '弹性伸缩',
        tool: '管理工具',
        cm: '云监控',
        cloudAudit: '云审计',
        cam: '访问管理',
        server: '视频与服务',
        vod: '直播',
        live: '点播',
        safe: '安全',
        yunjing: '主机安全（云镜）',
        captcha: '验证码服务 Captcha',
        waf: 'Web 应用防火墙',
        ddos: 'DDoS 基础防护',
        bgp: '高防IP专业版',
        kms: '密钥管理服务',
        database: '云数据库',
        middleware: '互联网中间件',
        ckafka: '消息服务ckafka',
        net: '网络',
        clb: '负载均衡',
        dc: '专线接入',
        vpc: '私有网络',
        eni: '弹性网卡',
        nat: 'NAT 网关',
        vpn: 'VPN 连接',
        eip: '弹性公网IP',
        ccn: '云联网CCN',
        cosTitle: '存储',
        cos: '对象存储',
        cdnTitle: 'CDN与加速',
        dsa: '动态加速',
        gaap: '全球应用加速',
        scf: '云函数SCF',
        pro: '项目管理',
        center: '产品中心',
        price: '定价',
        document: '文档中心',
        console: '控制台',
        login: '登录',
        register: '免费注册',
        bill: '费用中心',
        userCenter: '用户中心',
        info: '消息中心',
        workorder: '我的工单',
        back: '返回',
        h: '退出',
        hintTitle: '提示',
        hintContent: '確定進行[退出]操作?'
    }
}