const Nodejs8 = {
  type: 'Nodejs 8.9',
  detail: [
    {
      name: 'ES寫入函數',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通過使用ElasticSearch庫，實現了將隨機數寫入ES。可為其配置定時觸發器後，定時執列',                // 描述
      label: ['elasticsearch', 'Nodejs8.9', 'timer'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-1.zip'                                  // cos的url
    },
    {
      name: 'helloworld',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: 'helloworld 空白模板函數',                // 描述
      label: ['Nodejs8.9', 'helloworld'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-2.zip'                                  // cos的url
    },
    {
      name: 'API 網關基礎示例',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例主要演示當配置 API 網關觸發器的時候，怎樣去構造返回的 json 數據結構',                // 描述
      label: ['Nodejs8.9', 'API GW', 'API'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{ "response": { "body": "$content", "headers": { "Content-Type": "text/html" }, "isBase64Encoded": false, "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-3.zip'                                  // cos的url
    },
    {
      name: '操作Mysql',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通過mysql Node客戶端，操作雲Mysql',                // 描述
      label: ['Nodejs8.9', 'Mysql'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-4.zip'                                  // cos的url
    },
    {
      name: 'API 網關返回 Web 頁面',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例主要通過 SCF 結合 API 網關，快速實現一個對公網服務的 Web 頁面',                // 描述
      label: ['Nodejs8.9', 'API GW', 'Web Page'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{ "response": { "body": "$content", "headers": { "Content-Type": "text/html" }, "isBase64Encoded": "False", "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-5.zip'                                  // cos的url
    },
    {
      name: 'API 網關返回自定義html頁面',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例主要演示如何配置 API 網關觸發器返回自定義的html頁面',                // 描述
      label: ['Nodejs8.9', 'API GW', 'Custom Html'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{ "response": { "body": "$content", "headers": { "Content-Type": "text/html" }, "isBase64Encoded": "False", "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-6.zip'                                  // cos的url
    },
    {
      name: 'API 網關搭建hexo靜態站點',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例主要通過 SCF 結合 API 網關，快速實現一個基於hexo的靜態站點',                // 描述
      label: ['Nodejs8.9', 'API GW', 'Hexo'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{ "response": { "body": "$content", "headers": { "Content-Type": "text/html" }, "isBase64Encoded": "False", "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-7.zip'                                  // cos的url
    },
    {
      name: 'websocket傳輸函數',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例基於 API 網關實現websocket功能，API網關和雲函數一起構成websocket的Server端，由API網關承載和Client端的長連接。websocket一共需要3類函數承載，分別是註冊函數、傳輸函數和清理函數，本函數為傳輸函數。',                // 描述
      label: ['Nodejs8.9', 'apigateway', 'webscoket'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-8.zip'                                  // cos的url
    },
    {
      name: '從物件儲存獲取文件',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例配置了 COS 觸發器，當有文件上傳到對應的 COS bucket時，會觸發雲函數執列，並把文件下載到本地臨時目錄，用做後續處理',                // 描述
      label: ['Nodejs8.9', 'apigateway', 'webscoket'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-9.zip'                                  // cos的url
    },
    {
      name: '操作Redis',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通過redis node客戶端，操作credis數據庫',                // 描述
      label: ['Nodejs8.9', 'CRedis'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-10.zip'                                  // cos的url
    },
    {
      name: '文字識別',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通過配置COS觸發或API網關觸發，利用優圖提供的能力，進列文字識別',                // 描述
      label: ['Nodejs8.9', 'WordRecognition'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-11.zip'                                  // cos的url
    },
    {
      name: 'mongodb_basic_demo',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例演示基於API網關提供博客內的文章查詢和文章內容，您可以擴展函數來實現 Web 後端服務',                // 描述
      label: ['Nodejs8.9', 'mongodb', 'basic'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-12.zip'                                  // cos的url
    },
    {
      name: '定時撥測函數',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例主要演示定時撥測 URL 清單中的地址，當撥測失敗時，通過郵件發送告警',                // 描述
      label: ['Nodejs8.9', 'url', 'Timer'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-13.zip'                                  // cos的url
    },
    {
      name: 'websocket註冊函數',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例基於 API 網關實現websocket功能，API網關和雲函數一起構成websocket的Server端，由API網關承載和Client端的長連接。websocket一共需要3類函數承載，分別是註冊函數、傳輸函數和清理函數，本函數為註冊函數。',                // 描述
      label: ['Nodejs8.9', 'apigateway', 'webscoket'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-14.zip'                                  // cos的url
    },
    {
      name: '國慶 SCF 運營推廣活動 Demo',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例主要演示如何配置 API 網關觸發器返回自定義 html 頁面',                // 描述
      label: ['Nodejs8.9', 'Vscode'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-15.zip'                                  // cos的url
    },
    {
      name: '圖像壓縮',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例配置了 COS 觸發器，當有文件上傳到對應的 COS bucket時，會觸發雲函數執列，並把文件下載到本地臨時目錄，用做後續處理',                // 描述
      label: ['Nodejs8.9', 'cos', 'thumbnail'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-16.zip'                                  // cos的url
    },
    {
      name: '影片轉碼',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通過配置COS觸發器，當你在通過上傳影片文件到cos時，通過雲點播提供的介面，進列影片轉碼，並寫入目標bucket中',                // 描述
      label: ['Nodejs8.9', 'Ckafka', 'Transcode'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-17.zip'                                  // cos的url
    },
    {
      name: 'websocket清理函數',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例基於 API 網關實現websocket功能，API網關和雲函數一起構成websocket的Server端，由API網關承載和Client端的長連接。websocket一共需要3類函數承載，分別是註冊函數、傳輸函數和清理函數，本函數為清理函數。',                // 描述
      label: ['Nodejs8.9', 'apigateway', 'webscoket'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-18.zip'                                  // cos的url
    },
    {
      name: '解壓壓縮包',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通過配置COS觸發，上傳到COS的ZIP包，使用SCF下載並本地解壓，支持帶密碼解壓，支持中文欄位解壓，並把解壓後的文件上傳到COS另一個bucket中，您還可以擴充支持RAR包的解壓',                // 描述
      label: ['Nodejs8.9', 'COS', 'Unzip'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-19.zip'                                  // cos的url
    },
    {
      name: '給kafka發訊息',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通過從源bucket下載多個小文件，合併之後，上傳到另一個bucket',                // 描述
      label: ['Nodejs8.9', 'Ckafka'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-20.zip'                                  // cos的url
    },
    {
      name: '通過訊息隊列發送郵件',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通過接收 CMQ 訊息隊列中指定格式的訊息，並根據訊息內容向指定的郵箱發送郵件',                // 描述
      label: ['Nodejs8.9', 'CMQ', 'email'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-21.zip'                                  // cos的url
    },
    {
      name: 'zip格式文件解壓',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通過從源bucket下載zip格式文件，解壓之後，上傳到另一個bucket',                // 描述
      label: ['Nodejs8.9', 'Unzip', 'unzip file'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-22.zip'                                  // cos的url
    },
    {
      name: 'kafka訊息上傳到cos',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通過配置kafka觸發器，從kafka接收到訊息後，寫入文件並上傳到cos中',                // 描述
      label: ['Nodejs8.9', 'Ckafka', 'Cos'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-23.zip'                                  // cos的url
    },
    {
      name: '文件合併',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通過從源bucket下載多個小文件，合併之後，上傳到另一個bucket',                // 描述
      label: ['Nodejs8.9', 'Ckafka', 'send message'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-24.zip'                                  // cos的url
    },
    {
      name: '刪除ES索引',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通過使用ElasticSearch庫，刪除ES索引',                // 描述
      label: ['Nodejs8.9', 'elasticsearch'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Nodejs8-25.zip'                                  // cos的url
    },
  ]
}

export default Nodejs8
