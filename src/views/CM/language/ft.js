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
    COM: require('@/components/language/ft'),
}