module.exports = {
  el: {
    colorpicker: {
      confirm: '確認',
      clear: '清空'
    },
    datepicker: {
      now: '現在',
      today: '今天',
      cancel: '取消',
      clear: '清空',
      confirm: '確認',
      selectDate: '選擇日期',
      selectTime: '選擇時間',
      startDate: '開始日期',
      startTime: '開始時間',
      endDate: '結束日期',
      endTime: '結束時間',
      prevYear: '前一年',
      nextYear: '後一年',
      prevMonth: '上個月',
      nextMonth: '下個月',
      year: '年',
      month1: '1 月',
      month2: '2 月',
      month3: '3 月',
      month4: '4 月',
      month5: '5 月',
      month6: '6 月',
      month7: '7 月',
      month8: '8 月',
      month9: '9 月',
      month10: '10 月',
      month11: '11 月',
      month12: '12 月',
      // week: '周次',
      weeks: {
        sun: '日',
        mon: '一',
        tue: '二',
        wed: '三',
        thu: '四',
        fri: '五',
        sat: '六'
      },
      months: {
        jan: '一月',
        feb: '二月',
        mar: '三月',
        apr: '四月',
        may: '五月',
        jun: '六月',
        jul: '七月',
        aug: '八月',
        sep: '九月',
        oct: '十月',
        nov: '十一月',
        dec: '十二月'
      }
    },
    select: {
      loading: '加載中',
      noMatch: '無匹配資料',
      noData: '無資料',
      placeholder: '請選擇'
    },
    cascader: {
      noMatch: '無匹配資料',
      loading: '加載中',
      placeholder: '請選擇',
      noData: '無資料'
    },
    pagination: {
      goto: '前往',
      pagesize: '項/頁',
      total: '共 {total} 項',
      pageClassifier: '頁'
    },
    messagebox: {
      title: '提示',
      confirm: '確定',
      cancel: '取消',
      error: '輸入的資料不符規定!'
    },
    upload: {
      deleteTip: '按 delete 鍵可刪除',
      delete: '刪除',
      preview: '查看圖片',
      continue: '繼續上傳'
    },
    table: {
      emptyText: '暫無資料',
      confirmFilter: '篩選',
      resetFilter: '重置',
      clearFilter: '全部',
      sumText: 'Sum' // to be translated
    },
    tree: {
      emptyText: '暫無資料'
    },
    transfer: {
      noMatch: '無匹配資料',
      noData: '無資料',
      titles: ['List 1', 'List 2'], // to be translated
      filterPlaceholder: 'Enter keyword', // to be translated
      noCheckedFormat: '{total} items', // to be translated
      hasCheckedFormat: '{checked}/{total} checked' // to be translated
    },
    image: {
      error: '加載失敗'
    },
    pageHeader: {
      title: '返回'
    },
    popconfirm: {
      confirmButtonText: 'Yes', // to be translated
      cancelButtonText: 'No' // to be translated
    }
  },
  CAM: {
    strip: '條',
    userList: {
      policyPlaceholder: '支持搜索策略名稱/描述',
      listTitle: '用戶清單',
      listText: '如何查看更多訊息?',
      listContext: '訪問管理對您的敏感訊息進行安全升級保護，您可以點擊清單中【詳情】列下拉按鈕【▶】查看用戶的身份安全狀態、已加入組以及消息訂閱等更多訊息。您也可以點擊用戶名進入用戶詳細訊息中查看或編輯。',
      listAdduser: '新增用戶',
      listAddMoreuser: '批量添加用戶',
      listdeleteuser: '批量刪除',
      searchUser: '支持搜索用戶名',
      userDetils: '詳情',
      userGroup: '用戶組',
      APISecret: 'API秘鑰管理',
      userName: '用戶名稱',
      userNamePlaceholder: '請輸入用戶名稱',
      userId: '帳號ID',
      userChose: '用戶類型',
      userText: '關聯訊息',
      userStrage: '授權',
      userAddGroup: '添加到組',
      userSubscribeNotice: '訂閱訊息',
      userdep: '訂閱訊息',
      userMore: '更多',
      userDel: '刪除用戶',
      strategyTitle: '策略清單',
      search: '搜索',
      strategyNames: '策略名',
      strategyChose: '策略類型',
      strategySelf: '自定義策略',
      ysStrategy: '預設策略',
      choose: '已選擇',
      userCz: '操作',
      userRemove: '移除',
      suerAdd: '確 定',
      handClose: '取 消',
      removeText: '以下用戶存在刪除前置處理項 禁用並刪除 API 密鑰：',
      removeContext: '需要您注意的是， API 密鑰刪除後無法恢復，請您確認清楚再進行刪除。用戶被刪除後，該用戶無法登錄台富雲以及接收消息通知，同時會解除關聯許可權。',
      myId: '密鑰ID',
      createTime: '創建時間',
      userZt: '狀態',
      removeMore: '批量刪除',
      suerRemove: '確定批量刪除用戶?',
      userDetil: '用戶詳情',
      updataUser: '編輯',
      userRemark: '備註',
      userRemarkPlaceholder: '請輸入備註',
      userWay: '訪問方式',
      userPhone: '手機',
      userPhonePlaceholder: '請輸入手機號',
      userEmail: '郵箱',
      userEmailPlaceholder: '請輸入郵箱',
      userWeChat: '微信',
      weChatGet: '是否允許微信接收通知',
      fastToDo: '快捷操作',
      strategyTitles: '關聯策略以獲取策略包含的操作許可權。解除策略將失去策略包含的操作許可權。特別的，解除隨組關聯類型的策略是通過將用戶從關聯該策略的用戶組中移出',
      RelatedPolicies: '關聯策略',
      RemoveStrategy: '解除策略',
      AssociationTypes: '關聯類型',
      AssociationTime: '關聯時間',
      Remove: '解除',
      RemoveGroups: '移出組',
      GroupName: '組名稱',
      RoleManagement: '角色管理',
      compensation: '定時任務補償',
      program: '程序',
      StrategyExplain: '解除策略將失去策略包含的操作許可權。特別的，解除隨組關聯類型的策略是通過將用戶從關聯該策略的用戶組中移出。',
      StrategyExplains: '是否確定將該用戶移出用戶組來解除此隨組關聯策略？移出用戶組後該用戶將無法獲得該策略所描述的相關許可權。',
      delRowUser: '移出後將無法接收到該組的站內信通知',
      delUserTitle: '您將永久刪除以下用戶，刪除的用戶數據無法恢復。您確定要刪除以下用戶？',
      upDataUsers: '編輯子用戶',
      addUsertoStrag: '添加策略清單',
      permissions: '設置用許可權',
      review: '審閱用戶許可權',
      descs: '描述',
      prev: '上一步',
      next: '下一步',
      complete: '完成',
      chooseStrage: '從策略清單中選取策略關聯',
      searchStarge: '請輸入策略名稱',
      useNum: '引用次數',
      clType: '策略類型',
      userPolicies: '復用現有用戶策略',
      userToGroup: '添加至組獲得隨組許可權',
      userGropList: '用戶組清單',
      searchUserGroup: '請輸入用戶組名稱',
      setGroup: '設置用戶組',
      reviewUserGroup: '審閱用戶組',
      createUser: '新建子用戶',
      chooserType: '選擇類型',
      userMesgs: '填寫用戶訊息',
      setStrage: '設置用戶許可權',
      userMesg: '審閱訊息和許可權',
      setUserMesg: '設置用戶訊息',
      askWay: '訪問方式',
      Programmatic: '編程訪問',
      prigMesg: '啟用SecretId和SecretKey，支持台富雲API、SDK和其他開發工具訪問',
      access: '台富雲控制台訪問',
      password: '啟用密碼，允許用戶登錄到台富雲控制台',
      ConsolePassword: '控制台密碼',
      generation: '自動生成密碼',
      Custom: '自定義密碼',
      passAgin: '用戶必須在下次登錄時重置密碼',
      open: '啟用虛擬 MFA 設備校驗',
      doOpne: '不開啟',
      resetPassword: '需要重置密碼',
      protect: '登錄保護',
      Operation: '操作保護',
      mesgPeople: '消息接收人創建流程已移至',
      selfCreate: '自定義創建',
      selfCreates: '中，請選擇類型為「僅用於接收消息」進行消息接收人的創建',
      addEvery: '添加一位子用戶，允許其訪問您的雲上資源',
      heckYourSelf: '請檢查您設置的訊息，訪問管理將按照如下訊息為您創建用戶。',
      userMessage: '用戶訊息',
      askMesg: '訪問訊息',
      consoleAsk: '編程訪問，控制台訪問',
      noWayAsk: '無法登錄控制台',
      passType: '控制台密碼類型',
      policyMesg: '許可權訊息',
      policyMS: '策略描述',
      choosepolicy: '選擇策略',
      searchUserName: '支持搜索用戶名',
      cjly: '創建來源',
      gllx: '關聯類型',
      scyh: '刪除用戶',
      qsrzqdsjh: '請輸入正確的手機號',
      qsrzqdyx: '請輸入正確的郵箱',
      sjhyw: '手機號輸入有誤',
      yxsryw: '郵箱輸入有誤',
      cdzf: '長度為8-32個字元',
      bhzf: '包含數字，特殊字元，小寫字母，大寫字母',
      mmbnyyhmxt: '密碼不能與當前用戶名相同',
      xzyhz: '選擇用戶組',
      mrmm: '默認密碼'
    },
    userGroup: {
      title: '用戶組',
      createBtn: '添加用戶',
      createNext: '下一步',
      createWrite: '填寫組訊息',
      createRelevance: '關聯策略',
      createCheck: '審閱',
      addBtn: '新建用戶組',
      delBtn: '刪除',
      colNmae: '用戶組名稱',
      colRemark: '備註',
      colCreTime: '創建時間',
      colHandle: '操作',
      custom: '自定義清單字段',
      placeholder: '支持搜索用戶組名稱',
      addTitle: '添加用戶',
      selection: '選擇添加的用戶',
      Star: '已選擇',
      selSearch: '請輸入用戶名稱搜索',
      selConfirmBtn: '確 定',
      selCancelBtn: '取 消',
      delHint: '刪除該組將不會刪除組內的用戶，但組內用戶將無法接收到該組的站內信通知',
      delTitle: '刪除分組',
      delInfo: '刪除成功',
      delConfirmBtn: '確定',
      delCancelBtn: '取消',
      successInfo: '執行成功',
      setDelete: '刪除',
      setAddUser: '新增用戶',
      addTenUser: '(單次最多創建10個用戶)',
      getWeChat: '接收微信消息',
      weChatContent: '郵箱將收到一封包含二維碼的郵件，微信掃碼並關注公眾號即可接收通知',
      fields: '自定義清單欄位',
      chooseMesg: '請選擇您想顯示的清單詳細訊息',
      user: '用戶',
      childUser: '子用戶',
      testApi: '測試介面組',
      groupTest: '組訊息',
      polictTitle: '策略被關聯後，該用戶組內的所有用戶都將獲得策略所描述的許可權',
      getPolicy: '關聯策略',
      choosepolicy: '選擇策略',
      searchUserName: '支持搜索用戶名',
      removeUser: '移除用戶',
      removeGrop: '移出該組',
      ge: '個',
      xxdy: '消息訂閱',
      ckyhxq: '查看用戶詳情',
      userGroupPlaceholder: '請輸入用戶組名',
      userRemarkPlaceholder: '請輸入備註'
    },
    Role: {
      roleNameInvalid: '1-128個英文字母、數字和+=,.@_-',
      cancelSessionTitle1: '為有效保障您的賬戶安全，CAM 支持您立即撤銷角色當前所有活動會話。如果您選擇撤消所有會話, 當前角色將被附加名為',
      cancelSessionTitle2: '的自定義策略。此策略將更新當前時間戳，並立即拒絕該角色當前所有會話的編程訪問和控制台訪問。您可以繼續通過這個角色創建新的會話，新的會話將不受影響可正常訪問。如果您稍後需要撤消此操作，您可以移除自定義策略。',
      title: '角色',
      addBtn: '新建角色',
      delBtn: '刪除',
      roleName: '角色名稱',
      roleCarrier: '角色載體',
      roleDesc: '角色描述',
      colHandle: '操作',
      selConfirmBtn: '確 定',
      selCancelBtn: '取 消',
      delHint: '此操作將刪除該角色，同時解除該服務角色已關聯的策略以及授權關係。您確定要刪除該角色嗎？',
      delTitle: '刪除角色',
      delInfo: '刪除成功',
      delConfirmBtn: '確定',
      delCancelBtn: '取消',
      roleTitle1: '為什麼我的賬戶出現了新角色？',
      roleTitle2: '在服務中完成特定操作(如授權創建服務角色)時，服務可能為您創建服務相關角色。或者，如果您在某項服務開始支持服務相關角色之前已在使用該服務，則該服務可能自動在您的賬戶中創建角色。',
      selectCarrier: '選擇角色載體',
      tencentProductService: '台富雲產品服務',
      tencentCard: '台富雲賬戶',
      identityProvider: '身份提供商',
      tencentProductServiceTitle: '授權雲服務通過角色使用您的雲資源',
      tencentCardTitle: '授權主帳號或者其他主帳號通過角色使用您的雲資源',
      identityProviderTitle: '授權台富雲外部用戶身份（如企業用戶目錄）使用您的資源',
      top_text: '新建自定義角色',
      step_titile1: '輸入角色載體訊息',
      step_titile2: '配置角色策略',
      step_titile3: '審閱',
      cloudCardType: '雲帳號類型',
      currentMainAccount: '當前主帳號',
      otherMainAccount: '其他主帳號',
      cardId: '帳號ID',
      policyList: '策略清單',
      policyName: '策略名',
      switchUserGroup: '切換成用戶組',
      hasChosen: '已選擇',
      strategy: '策略',
      strategyType: '策略類型',
      inputRoleName: '請輸入角色名稱',
      isNotNullRoleName: '角色名稱不能為空',
      strategyName: '策略名稱',
      desc: '描述',
      goBack: '返回',
      toStep: '下一步',
      complete: '完成',
      customPolicy: '自定義策略',
      defaultPolicy: '預設策略',
      all: '全部',
      allRol: '全部策略',
      rolTitle: '用戶或者用戶組與策略關聯後，即可獲得策略所描述的操作許可權。',
      searchRole: '支持搜索策略名稱',
      service: '產品服務',
      item: '項',
      account: '雲帳號',
      Authorized: '已授權策略',
      failure: '失效時間',
      Management: '管理載體',
      Cancel: '撤銷會話',
      cancelNo: '您無法撤銷服務角色的活躍會話',
      cancelAll: '撤銷所有會話',
      Risk: '風險提醒',
      notUsed: '該角色為您授權的服務角色，擅自更改角色內容（角色關聯策略或者角色載體）可能導致您授權的服務無法正確使用該角色。',
      Unblock: '解除用戶/組',
      createServe: '新建自定義角色',
      Enter: '輸入角色載體訊息',
      Configuring: '配置角色策略',
      reviewCheck: '審閱',
      support: '支持角色的服務',
      empty: '角色名稱不能為空',
      serveRole: '服務',
      selectedStar: '已選策略',
      kztfw: '控制台訪問',
      sytj: '使用條件',
      zwkxsftgs: '請選擇可選身份提供商',
      yxjsfwkzt: '允許當前角色訪問控制台',
      jian: '鍵',
      qxz: '請選擇',
      tj: '條件',
      xzsytj: '新增使用條件',
      sqtfy: '授權台富雲外部用戶身份(如企業用戶目錄)使用您的資源',
      jsxx: '角色訊息',
      gljszt: '管理角色載體',
      wfscwydzt: '無法刪除唯一的載體',
      jcjszt: '解除角色載體',
      jcclts: '是否確定為該角色解除此策略？解除後該角色將無法獲得該策略所描述的相關許可權。',
      jcjsztts: '是否確定為當前角色解除此角色載體？解除後，此角色載體將無法繼續通過扮演該角色，以訪問該角色被授權訪問的資源？',
      rgnxzcx: '如果您選擇撤消所有會話, 當前角色將被附加包含會話失效時刻的一個自定義策略。該策略將拒絕該角色在會話失效時刻時所有會話的編程訪問和控制台訪問。'
    },
    strategy: {
      straGroup: '關聯用戶/組',
      chooseStra: '已選',
      inputContent: '請輸入內容',
      starLangu: '策略語法',
      outBindUser: '解除用戶/用戶組',
      userBind: '用戶關聯',
      userGroupBind: '用戶組關聯',
      outBind: '解除此用戶',
      team: '組',
      straTitle: '後，將不具備該策略對應的許可權，是否確認？',
      sureOubind: '確定解除',
      suerStr: '確 定',
      overChoose: '已選擇的用戶/組',
      lookDetils: '查看詳情',
      okDel: '確認是否解除',
      removeStra: '解除後，以上策略關聯的用戶或用戶組將失去對應的許可權。',
      strUsers: '關聯用戶',
      switch: '切換成用戶組',
      nameAndGroup: '用戶組/用戶名',
      type: '類型',
      identity: '新建身份提供商',
      Configuration: '配置提供商訊息',
      completes: '審閱並完成',
      supplier: '供應商類型',
      supplierName: '供應商名稱',
      dataFile: '元數據文件',
      chooseFile: '選擇文件',
      newAdd: '新建供應商',
      peopleName: '提供商名稱',
      peopleType: '提供商類型',
      lastCreateTime: '最後更新時間',
      qr: '確認',
      pztgsxx: '配置提供商訊息',
      zwsj: '暫無數據',
      fwlx: '服務類型',
      ye: '頁',
      jbxx: '基本訊息',
      clxq: '策略詳情',
      searchUserName: '支持搜索用戶名',
      dqyhybgl: '當前用戶已被關聯，如需解除關聯請前往詳情頁操作',
      dqyhzybgl: '當前用戶組已被關聯，如需解除關聯請前往詳情頁操作'
    },
    provider: {
      delTip: '此操作將刪除該身份提供商，同時該身份提供商將解除與相關角色的關聯，無法以該身份提供商申請使用相關角色。您確定要刪除該身份提供商嗎？'
    },
    noticeSubscriptionDialog: {
      close: '關 閉',
      confirm: '確 定',
      expand: '展開',
      unexpand: '收起',
      xxlx: '訊息類型',
      znx: '站內信',
      cz: '操作',
      subscriber: '訊息接收人',
      subscribeType: '訂閱訊息類型',
      subscription: '訂閱訊息'
    },
    subscriptionType: {
      0: '財務讯息',
      1: '帳務欠費通知',
      2: '賬戶預警通知',
      3: '賬單出帳通知',
      4: '賬戶提現通知',
      5: '產品讯息',
      6: '產品到期、回收通知',
      7: '產品自動續費通知',
      8: 'CDM雲數據遷移讯息通知',
      9: 'CDN相關通知',
      10: '產品服務相關通知',
      11: '產品變更通知',
      12: 'DNSPod郵件通知',
      13: 'HTTPDNS相關通知',
      14: '工單服務通知',
      15: '產品告警通知',
      16: '天御業務安全防護相關通知',
      17: '雲市場服務通知',
      18: '證書兩碼發放',
      19: '渠道服務通知',
      20: 'URL安全解決方案',
      21: '官網服務通知',
      22: 'SSL證書相關通知',
      23: '安全讯息',
      24: '安全事件通知',
      25: '內容違規通知',
      26: '台富雲動態',
      27: '雲+社區相關通知',
      28: '活動通知'
    }
  },
  COM: require('@/components/language/ft')
}
