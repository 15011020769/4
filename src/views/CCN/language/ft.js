module.exports = {
    CCN: {
        total: {
            title: '雲聯網',
            btn: '新建',
            link: '雲聯網幫助文檔',
            tr1: '名稱/ID',
            tr2: '狀態',
            tr3: '服務質量',
            tr4: '關聯實例',
            tr5: '備註',
            tr6: '計費模式',
            tr7: '限速方式',
            tr8: '創建時間',
            tr9: '操作',
            td1: '管理實例',
            td2: '編輯標籤',
            td3: '刪除',
            tdno: '暫無數據',
            sure: '確定',
            new: '新建雲聯網實例',
            new1: '名稱',
            new2: '計費模式',
            mode1: '預付費',
            mode2: '月95後付費(先使用再付費)',
            mode3: '為了便於測試連通性，地域間默認享有免費10Kbps頻寬',
            new3: '限速方式',
            way1: '地域出口限速',
            way2: '地域間限速',
            new4: '描述',
            desc: '選填',
            new5: '服務質量',
            ser1: '白金',
            ser2: '金',
            ser3: '銀',
            new6: '關聯實例',
            vpc1: '私有網路',
            vpc2: '專線網關',
            region: '台灣台北',
            select: '搜索VPC名稱或ID',
            editname: '修改名稱',
            editname2: '名稱',
            editdesc: '修改備註',
            editdesc1: '備註',
            edit: '您已經選擇1個雲資源',
            edit0: '新增標籤',
            edit1: '標籤鍵',
            edit2: '標籤值',
            edit3: '刪除',
            del: '您確認要刪除該雲聯網嗎？',
            del1: '名稱 ',
            del2: '狀態',
            del3: '關聯實例',
            eWay: '變更限速方式',
            eWay1: '限速方式',
            eWay2: '地域間頻寬',
            eWay3: '地域出頻寬',
            eWay4: '注意：變更後，原有限速配置將刪除， 頻寬將設置為 1Gbps（默認），如需更大默認頻寬，請提工單申請',
            newCreate: '新建',
            run: '運行中',
            glz: '隔離中（欠費停服）',
            newClose: '關閉',
            bjnew: '白金',
            jinnew: '金',
            yinnew: '銀',
            mouthPay: '月95後付費',
            addressS: '地域出口限速',
            addressJS: '地域間限速',
            gongN: '共',
            tioaN: '條',
        },
        tabs: {
            tab1: '關聯實例',
            tab1new: '新增實例',
            tab1new1: '同地域頻寬免費，點擊查看詳情',
            tab1new2: '私有網路',
            tab1new3: '專線網關',
            tab1new4: '請選擇',
            region: '港澳台地區(台灣台北)',
            select: '搜索VPC名稱或ID',
            tab1newc: '關閉',
            tab1del: '您確認要解除該實例與雲聯網的關聯嗎',
            tab1del1: '解除關聯後，該實例與雲聯網內其他實例的連接將立刻中斷，請您務必確認影響後再操作',
            tab1tr1: 'ID/名稱',
            tab1tr2: '狀態',
            tab1tr3: '實例類型',
            tab1tr4: '所屬帳號',
            tab1tr5: '關聯時間',
            tab1tr6: '所在地域',
            tab1tr7: '操作',
            tab1no: '記錄為空',
            tab2: '監控',
            tab2tag: '單地域監控',
            tab2R: '港澳臺地區(中國臺北)',
            tab2D: '註釋：Max、Min和Avg數值統計為當前折線圖內所有點的最大值、最小值和平均值',
            tab2out: '導出數據',
            tab3: '頻寬管理',
            tab3tit: '地域出口頻寬限速',
            tab3tit1: '地域間頻寬限速',
            tab3tit2: '變更',
            tab3tr1: '地域',
            tab3tr2: '頻寬上限（Mbps）',
            tab3btn: '調整頻寬限速',
            tab3btnD: '添加地域出口限速',
            tab3btnC: '已選擇',
            tab3R: '台灣台北',
            tab4: '路由表',
            tab4tr1: '目的端',
            tab4tr2: '狀態',
            tab4tr3: '下一跳',
            tab4tr4: '下一跳所屬地域',
            tab4tr5: '更新時間',
            tab4tr6: '啟用路由',
            hasCon: '已連接',
            hasAp: '申請中',
            hasOu: '已過期',
            hasJ: '已拒絕',
            hasDel: '已刪除',
            error1: '失敗的（2小時後將非同步強制解關聯）',
            con1: '關聯中',
            uncon1: '解關聯中',
            unconer: '解關聯失敗（2小時後將非同步強制解關聯）',
            sywl: '私有網路',
            zxwl: '專線網關',
            myId: '我的帳號',
            gz: '廣州',
            twtb: '台灣台北',
            cd: '成都',
            bj: '北京',
            sh: '上海',
            unc: '解關聯',
            tipN1: '注釋：Max、Min和Avg數值統計為當前折線圖內所有點的最大值、最小值和平均值',
            exportDta: '導出數據',
            nodata: '暫無數據',
            title1: '集群健康狀態',
            placeh1: '請選擇'
        },
        menu: {
            title: '雲聯網'
        },

    },
    COM: require('@/components/language/ft'),
}