module.exports = {
  KMS: {
    total: {
      title: '密鑰管理系統',
      subMenu: '用戶密鑰',
      kmsList: '密鑰列表',
      newCreate: '新建',
      startKms: '啟用密鑰',
      stopKms: '禁用密鑰',
      newCreateKms: '新建密鑰',
      kmsName: '密鑰名稱',
      tip1: '最長可輸入60個字元，不可為空，請使用字母、數字及字元「_」和「-」，首字元必須為字母或者數字，且不能用 KMS- 開頭。',
      descriptInfo: '描述訊息',
      tip2: '最長可輸入1024個字元',
      oulCon: '外部',
      modelClose: '取消',
      modelSure: '確定',
      placeholder1: '支持密鑰ID、名稱搜索',
      label1: '密鑰ID/密鑰名稱',
      status: '狀態',
      createTime: '創建時間',
      kmsOrigin: '密鑰來源',
      kmsChange: '密鑰輪換',
      startChange: '啟用輪換',
      stopChange: '禁用輪換',
      action: '操作',
      planDelete: '計畫刪除',
      closeDelete: '取消刪除',
      planDeleteKms: '計畫刪除密鑰',
      tip3: '請先對密鑰進行禁用操作！',
      kmsInfo: '密鑰訊息',
      name: '名稱',
      changeKmsName: '修改密鑰名稱',
      oldName: '原名稱',
      newName: '新名稱',
      tip4: '最長可輸入60個字元，不可為空，請使用字母、數字及字元「_」和「-」，首字元必須為字母或者數字，且不能用 KMS- 開頭。',
      address: '地區',
      createUser: '創建者',
      changeStatus: '輪換狀態',
      alredayStop: '已禁用',
      alredayStart: '已啟用',
      autoChange: '每年自動輪換',
      changeKmsInfo: '修改密鑰描述訊息',
      oldDescript: '原描述訊息',
      newDescript: '新描述訊息',
      kmsMaterial: '密鑰材料',
      importKmsM: '導入密鑰材料',
      reImport: '重新導入',
      deleteKmsM: '刪除密鑰材料',
      outTime: '過期時間',
      kmsParamsDownload: '密鑰參數下載',
      kmsImport: '密鑰導入',
      importStatus: '導入狀態',
      tip5: '溫馨提示：密鑰材料需要通過加密公鑰加密後才可以導入，請選擇一個用於加密密鑰材料的演算法，生成的密鑰導入參數將在24小時後過期，請及時下載！',
      algorithmType: '演算法類型',
      EncryptionAlgorithm: '加密演算法',
      downLoad: '下載',
      next: '下一步',
      CryptographicKeyMaterial: '加密密鑰材料',
      ImportToken: '導入令牌',
      nofileChoose: '還未選擇文件',
      kmsMoutTime: '密鑰材料過期時間',
      foverNoTime: '永不過期',
      setTimeOut: '設置過期時間',
      chooseTime: '選擇日期',
      tip6: '若您已訂閱產品訊息，您將在密鑰材料過期前三天收到告警訊息',
      prev: '上一步',
      impoetKms: '導入密鑰',
      kmsImportSuccess: '密鑰成功導入',
      tip7: '秘鑰導入失敗，請返回上一步重試！',
      tip8: '溫馨提示：密鑰材料將從KMS中刪除，請確保您已經保管該密鑰材料副本！',
      tip9: '確定刪除該密鑰材料么？',
      onlineTool: '在線工具',
      encryption: '加密',
      Decrypt: '解密',
      placeholder2: '請輸入明文',
      action1: '執行',
      enterText: '請輸入密文',
      tip10: '啟用後，選中的密鑰將每年自動輪換一次。',
      tip11: '禁用後，選中的密鑰將停止每年自動輪換。',
      chooseAl: '您已選',
      oneKmsSer: '1個密鑰服務',
      kmsserver: '個密鑰服務',
      lookDetail: '查看詳情',
      canStart: '可啟用',
      canStop: '可禁用',
      question1: '啟用選中的密鑰服務？',
      question2: '禁用選中的密鑰服務？',
      tip12: '溫馨提示：計畫刪除天數可選範圍為7-30天。密鑰刪除後將無法恢復，此密鑰下的所有加密數據也將無法解密。為避免誤刪除行為，KMS服務將對以下操作進行自動告警:',
      tip13: '1.密鑰被徹底刪除前，對嘗試調用此密鑰的行為進行提示告警',
      tip14: '2.密鑰被徹底刪除前3天，每天提示告警',
      kmswill: '該密鑰將於',
      dayDisplay: '天后消失',
      closeDeleteKms: '取消刪除密鑰',
      tip15: '取消刪除選中的密鑰服務? 確認取消刪除後，密鑰重置為「已禁用」狀態',
      tip16: '啟用後，選中的密鑰將每年自動輪換一次。',
      tip17: '禁用後，選中的密鑰將停止每年自動輪換。',
      tip18: '溫馨提示：計畫刪除天數可選範圍為7-30天。密鑰刪除後將無法恢復，此密鑰下的所有加密數據也將無法解密。為避免誤刪除行為，KMS服務將對以下操作進行自動告警:',
      tip19: '1.密鑰被徹底刪除前，對嘗試調用此密鑰的行為進行提示告警',
      tip20: '2.密鑰被徹底刪除前3天，每天提示告警',
      tip21: '取消刪除選中的密鑰服務? 確認取消刪除後，密鑰重置為「已禁用」狀態',
      kmsMOrigin: '密鑰材料來源',
      startKmsChange: '啟用密鑰輪換',
      stopKmsChange: '禁用密鑰輪換',
      startKmsServer: '啟用密鑰服務',
      stopKmsServer: '禁用密鑰服務',
      startSuccess: '啟用成功',
      startError: '啟用失敗',
      stopSuccess: '禁用成功',
      stopError: '禁用失敗',
      noStartData: '請選擇已禁用的數據',
      noStartDataK: '請選擇已啟用的數據',
      noRules: '別名不符合規則',
      willImport: '待導入',
      yu: '於',
      allDelete: '徹底刪除',
      noTimeout: '不過期',
      chooseFile: '選擇文件',
      zwsj: '暫無數據',
      tiao: '條',
      xclhsj: '下次輪換時間',
      jhsc: '計畫刪除',
    }
  },
  COM: require('@/components/language/ft'),
}