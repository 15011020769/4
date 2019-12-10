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
        slfz: '實例分組',
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
        clBload: {
            zs: '注釋：Max、Min和Avg數值統計為當前折線圖內所有點的最大值、最小值和平均值',
            dcsj: '導出數據',
            zwsj: '暫無數據',
            jqjkzt: '集群健康狀態',
            clm: '策略名',
            cllx: '策略類型',
            cftj: '觸發條件',
            zjxg: '最近修改',
            glslz: '關聯實例組',
            cz: '操作',
            jk: '監控',
            gjcl: '告警策略',
            fhlb: '返回列表',
            fzjh: '負載均衡CLB',
            zjm: 'ID/主機名',
            zt: '狀態',
            wllx: '網路類型',
            sswl: '所屬網路',
            cjsj: '創建時間',
        },
        cloudDisk: {
            yyp: '雲硬碟',
            mc: 'ID/名稱',
            dx: '大小(GB)',
            yplx: '硬碟類型',
            glyzj: '關聯雲主機ID/名稱',
        }

    },
    COM: require('@/components/language/ft'),
}