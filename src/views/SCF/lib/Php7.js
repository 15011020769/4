const Php7 = {
  type: 'PHP7.2',
  detail: [
    {
      name: 'helloworld',                           // 名称
      language: 'Php7.2',                       // 语言
      desc: 'helloworld 空白模板函數',                // 描述
      label: ['Php7', 'helloworld'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Php7-1.zip'                                  // cos的url
    },
    {
      name: 'API 網關返回自定義html頁面',                           // 名称
      language: 'Php7.2',                       // 语言
      desc: '本示例主要演示如何配置 API 網關觸發器返回自定義的html頁面',                // 描述
      label: ['Php7', 'API GW', 'Custom Html'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{"response":{"body":"$content","headers":{"Content-Type":"text/html"},"isBase64Encoded":"False","statusCode":200}}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Php7-2.zip'                                  // cos的url
    },
    {
      name: 'API 網關基礎示例',                           // 名称
      language: 'Php7.2',                       // 语言
      desc: '本示例演示 API 網關使用的基礎方法，主要展示在集成響應下（通過雲函數控制台創建的API網關觸發器預設啟用集成響應），怎樣構造返回值',                // 描述
      label: ['Php7', 'API GW', 'API'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{ "response": { "body": "$content", "headers": { "Content-Type": "text/html" }, "isBase64Encoded": false, "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Php7-3.zip'                                  // cos的url
    },
    {
      name: 'API 網關返回 Web 頁面',                           // 名称
      language: 'Php7.2',                       // 语言
      desc: '本示例主要通過 SCF 結合 API 網關，快速實現一個對公網服務的 Web 頁面。',                // 描述
      label: ['Php7', 'API GW', 'Web Page'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{"response":{"body":"$content","headers":{"Content-Type":"text/html"},"isBase64Encoded":"False","statusCode":200}}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Php7-4.zip'                                  // cos的url
    },
    {
      name: '獲取數據生成二維碼並結合API網關示例',                           // 名称
      language: 'Php7.2',                       // 语言
      desc: '本示例主要展示在SCF中對各種資源的引用方法，包括include php文件、調用上傳到SCF中的非php文件、使用/tmp臨時目錄，同時展示了SCF中3種獲取用戶提交數據的方法，最後演示如何返回一個網頁或文件',                // 描述
      label: ['Php7', 'API GW', 'API', '$_POST', '$_GET', 'path', 'QRcode'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{"response":{"body":"$content","headers":{"Content-Type":"text/html"},"isBase64Encoded":false,"statusCode":200}}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Php7-5.zip'                                  // cos的url
    },
    {
      name: 'API 網關返回 Web 頁面',                           // 名称
      language: 'Php7.2',                       // 语言
      desc: '本示例主要通過 SCF 結合 API 網關，快速實現一個對公網服務的 Web 頁面。',                // 描述
      label: ['Php7.2', 'API GW', 'Web Page'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{"response":{"body":"$content","headers":{"Content-Type":"text/html"},"isBase64Encoded":"False","statusCode":200}}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Php7-6.zip'                                  // cos的url
    },
    {
      name: '定時撥測函數',                           // 名称
      language: 'Php7.2',                       // 语言
      desc: '本示例主要演示定時撥測 URL 清單中的地址，當撥測失敗時，通過郵件發送告警',                // 描述
      label: ['Php7', 'url', 'Timer'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Php7-7.zip'                                  // cos的url
    },
    {
      name: 'API 網關返回自定義html頁面',                           // 名称
      language: 'Php7.2',                       // 语言
      desc: '本示例主要通過 SCF 結合 API 網關，快速實現一個對公網服務的 Web 頁面。',                // 描述
      label: ['Php7.2', 'API GW', 'Web Page'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{"response":{"body":"$content","headers":{"Content-Type":"text/html"},"isBase64Encoded":"False","statusCode":200}}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Php7-8.zip'                                  // cos的url
    },
    {
      name: '通過訊息隊列發送郵件',                           // 名称
      language: 'Php7.2',                       // 语言
      desc: '本示例通過接收 CMQ 訊息隊列中指定格式的訊息，並根據訊息內容向指定的郵箱發送郵件',                // 描述
      label: ['CMQ', 'Php7', 'email'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": { "body": "email content to send", "fromAddr": "xxx@qq.com", "toAddr": "xxx@qq.com", "title": "hello from scf & cmq" }, "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Php7-9.zip'                                  // cos的url
    },
    {
      name: 'COS 文件備份',                           // 名称
      language: 'Php7.2',                       // 语言
      desc: '此示例使用COS作為觸發器，在用戶上傳文件到指定bucket時，將該文件複製到另一個用於備份的bucket存儲',                // 描述
      label: ['Backup', 'Php7', 'COS'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{"event":"","context":""}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Php7-10.zip'                                  // cos的url
    },
    {
      name: 'onedrive with SCF',                           // 名称
      language: 'Php7.2',                       // 语言
      desc: '獲取onedrive信息並結合API網關展示',                // 描述
      label: ['Php7', 'API GW', 'onedrive'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{"response":{"body":"$content","headers":{"Content-Type":"text/html"},"isBase64Encoded":false,"statusCode":200}}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Php7-11.zip'                                  // cos的url
    },
  ]
}

export default Php7
