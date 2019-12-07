module.exports = {
    menu: {
        title1: '雲監控',
        title2: '雲伺服器',
        title3: '塊存儲',
        title4: '負載均衡-CLB',
        title5: '雲資料庫',
        title6: 'MySQL',
        title7: 'Redis',
        title8: '私有網路',
        title9: 'NAT網關',
        title10: 'VPN網關',
        title11: 'VPN通道',
        title12: '彈性公網IP',
        title13: '專線接入',
        title14: '物理專線',
        title15: '專線通道',
        title16: '對象存儲'
    },
    CVM: {
        title: '雲伺服器',
        errorTxt: '請輸入正確搜索信息',
        table: {
            x1: 'ID/主機名',
            x2: '監控',
            x3: '狀態',
            x4: '網路類型',
            x5: 'IP地址',
            x6: '所屬項目',
            x7: '健康狀態'
        },
        searchOptions: [{
                value: "project-id",
                label: "項目ID"
            },
            {
                value: "instance-id",
                label: "實例ID"
            },
            {
                value: "instance-name",
                label: "實例名稱"
            },
            {
                value: "private-ip-address",
                label: "內網IP"
            },
            {
                value: "public-ip-address ",
                label: "公網IP"
            }
        ],
        instanceStatus: {
            PENDING: "創建中",
            LAUNCH_FAILED: "創建失敗",
            RUNNING: "運行中",
            STOPPED: "已關機",
            STARTING: "開機中",
            STOPPING: "關機中",
            REBOOTING: "重啟中",
            SHUTDOWN: "待回收",
            TERMINATING: "銷毀中"
        },
        RestrictState: {
            NORMAL: "健康",
            EXPIRED: "過期",
            PROTECTIVELY_ISOLATED: "隔離"
        },

    },
    COM: {
        calculate: '計算',
        cvm: '雲伺服器',
        cbs: '雲硬碟',
        tke: '容器服務',
        as: '彈性伸縮',
        tool: '管理工具',
        cm: '雲監控',
        cloudAudit: '雲審計',
        cam: '訪問管理',
        server: '視頻與服務',
        vod: '直播',
        live: '點播',
        safe: '安全',
        yunjing: '主機安全（雲鏡）',
        captcha: '驗證碼服務',
        waf: 'Web應用防火牆',
        ddos: 'DDoS基礎防護',
        bgp: '高防IP專業版',
        kms: '密鑰管理服務',
        database: '雲資料庫',
        middleware: '互聯網中間件',
        ckafka: '消息服務ckafka',
        net: '網路',
        clb: '負載均衡',
        dc: '專線接入',
        vpc: '私有網路',
        eni: '彈性網卡',
        nat: 'NAT 網關',
        vpn: 'VPN 連接',
        eip: '彈性公網IP',
        ccn: '雲聯網CCN',
        cosTitle: '存儲',
        cos: '對象存儲',
        cdnTitle: 'CDN與加速',
        dsa: '動態加速',
        gaap: '全球應用加速',
        scf: '雲函數',
        pro: '項目管理',
        center: '產品中心',
        price: '定價',
        document: '文檔中心',
        console: '控制台',
        login: '登錄',
        register: '免費註冊',
        bill: '費用中心',
        userCenter: '用戶中心',
        info: '消息中心',
        workorder: '我的工單',
        back: '返回',
        h: '退出',
        hintTitle: '提示',
        hintContent: '確定進行[退出]操作?'
    }
}