module.exports = {
  menu: {
    title1: '雲監控',
    title2: '雲伺服器',
    title3: '塊儲存',
    title4: '負載均衡-CLB',
    title5: '雲資料庫',
    title6: 'MySQL',
    title7: 'Redis',
    title8: '私有網路',
    title9: 'NAT閘道',
    title10: 'VPN連接',
    title11: 'VPN通道',
    title12: '彈性公網IP',
    title13: '專線接入',
    title14: '物理專線',
    title15: '專線通道',
    title16: '對象儲存'
  },
  CVM: {
    strip: '條',
    slfz: '實例分組',
    zdyjk: '自定義監控',
    nwang: '內網',
    title: '雲伺服器',
    sjzx: '事件中心',
    lljk: '流量監控',
    gjls: '告警歷史',
    jkgl: '監控概覽',
    zxwg: '專線閘道',
    cftjmb: '觸發條件模板',
    gjpz: '告警配置',
    dxcc: '對象儲存',
    ddlj: '對等連接',
    wlzx: '專線接入-物理專線',
    zxtd: '專線接入-專線通道',
    td: 'VPN通道',
    vpnwg: 'VPN連接',
    errorTxt: '請輸入正確搜索訊息',
    table: {
      x1: 'ID/主機名',
      x2: '監控',
      x3: '狀態',
      x4: '網路類型',
      x5: 'IP地址',
      x6: '所屬專案',
      x7: '健康狀態'
    },
    searchOptions: [{
      value: "project-id",
      label: "專案ID"
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
      fhlb: '返回清單',
      fzjh: '負載均衡CLB',
      zjm: 'ID/主機名',
      zt: '狀態',
      wllx: '網路類型',
      sswl: '所屬網路',
      cjsj: '創建時間',
      txdz: '彈性IP地址',
      slid: '實例id',
      wg: 'NAT閘道',
      sywl: '私有網路',
      txgw: '彈性公網IP',
      wglc: '網關類型',
      gg: '規格',
      ddwg: '對端網關',
    },
    cloudDisk: {
      yyp: '雲硬碟',
      mc: 'ID/名稱',
      dx: '大小(GB)',
      yplx: '硬碟類型',
      glyzj: '關聯雲主機ID/名稱',
    },
    cloudMysql: {
      nw: '內網IP/端口',
      lx: '類型',
      wl: 'VPC 網路',
    },
    objectStorage: {
      dy: '地域',
      bkmc: 'Bucket名稱',
    },
    peerConnect: {
      qsrzjm: '請輸入IP或主機名',
      bdsywl: '本端私有網路',
      ddsywl: '對端私有網路',
      dksx: '頻寬上限',
      wsx: '無上限',
    },
    Physics: {
      dk: '頻寬',
      szd: '所在地',
      tdmc: '通道ID/名稱',
    },
    Casegrouping: {
      slfz: '實例分組',
      slfztgnl: '實例分組功能提供對跨地域、跨專案組的雲產品資源進行分組管理的能力',
      xj: '新建',
      qsrslzm: '請輸入實例組名搜索',
      slzmc: '實例組名稱',
      fzlx: '分組類型',
      sls: '實例數',
      bdgjcls: '綁定告警策略數',
      zhxg: '最後修改',
      fz: '複製',
      sc: '刪除',
    },
    Dashboard:{
      qxz: '請選擇',
      tjjkmb: '添加監控面板',
      jhtjsj: '現已支持配置和檢視一批資源的聚合統計數據，請在新建圖表配置中選擇“聚合視圖”。',
      zcbbdc: '現已支持檢視曲線中所有實例的排序列表，原hover展示實例數據改為點擊曲線圖檢視該時刻數據明細與排序結果，並支持報表導出。',
      tjjktb: '添加監控圖表',
      zdcxzl: '自動重新整理',
      zting: '暫停',
      zk: '展開',
      dc: '導出',
      ygsl: '共2個實例',
      dctp: '導出圖片',
      bj: '編輯',
      fztb: '複製圖表',
      mx: '明細',
      fzhong: '分鐘',
      cjjkmb: '創建監控面板',
      mcheng: '名稱',
      qd: '確 定',
      cmmjkmb: '重命名監控面板',
      zjklbz: '在監控面板中添加監控圖表，讓您更便捷查看指標監控！'
    },
    overview: {
      syysy: '剩餘1000條/已使用0條',
      zdyxx: '自定義訊息',
      zdyjkgj: '自定義監控告警',
      ybcgj: '雲撥測告警',
      jcgj: '基礎告警',
      gmdx: '購買簡訊',
      mfpe: '免費配額每個月1號重置為1000條。',
      dxpe: '用完後再扣除用戶已購簡訊配額。',
      gjdx: '告警簡訊發送優先扣除每月免費簡訊配額，免費配額',
      dxtj: '當月已使用簡訊統計',
      jksjz: '近7天監控時間軸',
      yxdxs: '影響對象數',
      dqzt: '當前狀態',
      fwlx: '服務類型',
      fwjkzt: '近24小時服務健康狀態',
      ymck: '頁面檢視',
      gwlljksj: '公網流量監控數據請到',
      hyty: '歡迎前往體驗更豐富的監控面板自定義功能',
      wgzd: '我關注的指標]模塊已遷移至',
      pzljgd: '配置了解更多',
      zdjk: '站點監控全新升級，前往',
      sqncty: '申請內測體驗',
      xbysx: '新版自定義監控已恢復上線，目前處於內測階段，如需使用可', 
      zjfy: '總計費用',
      mswz: '描述文字',
      dxin: '簡訊',
      sslx: '所屬類型',
      myqx: '所購簡訊配額沒有使用限時，用完為止',
    }
  },
  COM: require('@/components/language/ft'),
}