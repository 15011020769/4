const Nodejs6 = {
  type: 'Nodejs 6.10',
  detail: [
    {
      name: 'helloworld',                           // 名称
      language: 'Nodejs6.10',                       // 语言
      desc: 'helloworld 空白模板函數',                // 描述
      label: ['Nodejs6.10', 'helloworld'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs6-1.zip'                                  // cos的url
    },
    {
      name: 'API 網關基礎示例',                           // 名称
      language: 'Nodejs6.10',                       // 语言
      desc: '本示例演示 API 網關使用的基礎方法，主要展示在集成響應下（通過雲函數控制台創建的API網關觸發器預設啟用集成響應），怎樣構造返回值',                // 描述
      label: ['Nodejs6.10', 'API GW', 'API'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{ "response": { "body": "$content", "headers": { "Content-Type": "text/html" }, "isBase64Encoded": false, "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs6-2.zip'                                  // cos的url
    },
    {
      name: '從物件儲存獲取文件',                           // 名称
      language: 'Nodejs6.10',                       // 语言
      desc: '本示例配置了 COS 觸發器，當有文件上傳到對應的 COS bucket時，會觸發雲函數執列，並把文件下載到本地臨時目錄，用做後續處理',                // 描述
      label: ['Nodejs6.10', 'cos', 'object'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs6-3.zip'                                  // cos的url
    },
    {
      name: '通過訊息隊列發送郵件',                           // 名称
      language: 'Nodejs6.10',                       // 语言
      desc: '本示例通過接收 CMQ 訊息隊列中指定格式的訊息，並根據訊息內容向指定的郵箱發送郵件',                // 描述
      label: ['Nodejs6.10', 'CMQ', 'email'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs6-4.zip'                                  // cos的url
    },
    {
      name: '圖像壓縮',                           // 名称
      language: 'Nodejs6.10',                       // 语言
      desc: '本示例配置了 COS 觸發器，當有圖片上傳到對應的 COS bucket時，會觸發雲函數執行，並把文件下載到本地臨時目錄進行壓縮處理，壓縮後的圖片會上傳到另外一個bucket中',                // 描述
      label: ['Nodejs6.10', 'cos', 'thumbnail'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs6-5.zip'                                  // cos的url
    },
    {
      name: '定時撥測函數',                           // 名称
      language: 'Nodejs6.10',                       // 语言
      desc: '本示例主要演示定時撥測 URL 列表中的地址，當撥測失敗時，通過郵件發送告警',                // 描述
      label: ['Nodejs6.10', 'url', 'Timer'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs6-6.zip'                                  // cos的url
    },
  ]
}

export default Nodejs6
