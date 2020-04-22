const Python2 = {
  type: 'Python 2.7',
  detail: [
    {
      name: 'helloworld',
      language: 'Python 2.7',
      desc: 'helloworld 空白模板函數',
      label: ['Python2.7', 'helloworld'],
      author: '台富雲無伺服器雲函数团队',
      inParams: '{}',
      outParams: '{}',
      notice: '無',
      certificate: '公開',
      url: 'Python2-1.zip'
    },
    {
      name: '圖片轉文字',
      language: 'Python 2.7',
      desc: '本示例使用 API 網關觸發器和雲函數快速構建web後台，實現圖片中文字識別的功能，用戶通過 API 網關上傳圖片文件，上傳後的文件會保存在COS，並調用AI介面實現文字識別，把結果返回前端',
      label: ['apigw', 'Python2.7', 'Word_Recognition'],
      author: '台富雲無伺服器雲函数团队',
      inParams: '{ "event": "", "context": "" }',
      outParams: '{ "response": { "body": "res_text", "headers": { "Access-Control-Allow-Origin": "*", "Content-Type": "text" }, "isBase64Encoded": "False", "statusCode": 200 } }',
      notice: '無',
      certificate: '公開',
      url: 'Python2-2.zip'
    },
    {
      name: 'Ckafka 訊息投遞 COS',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例會根據觸發器配置的最大批量訊息數去觸發雲函數運列，雲函數每次運列都會創建一個以時間戳加隨機數為名字的文本文件，並把拉取到的 Ckafca 訊息換列寫入文本文件。最後把寫好的文件上傳到 COS bucket，並以小時為單位在 COS bucket 中創建文件夾',                // 描述
      label: ['Ckafka', 'Python2.7', 'COS'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-3.zip'                                  // cos的url
    },
    {
      name: 'API 網關返回自定義html頁面',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例主要演示如何配置 API 網關觸發器返回自定義的html頁面',                // 描述
      label: ['API GW', 'Python2.7', 'Custom Html'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{ "response": { "body": "$content", "headers": { "Content-Type": "text/html" }, "isBase64Encoded": "False", "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-4.zip'                                  // cos的url
    },
    {
      name: '從物件儲存獲取文件',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例配置了 COS 觸發器，當有文件上傳到對應的 COS bucket時，會觸發雲函數執列，並把文件下載到本地臨時目錄，用做後續處理',                // 描述
      label: ['API GW', 'Python2.7', 'Custom Html'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-5.zip'                                  // cos的url
    },
    {
      name: 'API網關觸發器基礎範例',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例演示 API 網關使用的基礎方法，主要展示在集成響應下（通過雲函數控制台創建的API網關觸發器預設啟用集成響應），怎樣構造返回值',                // 描述
      label: ['apigw', 'Python2.7', 'basic'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{ "response": { "body": "API GW Test Success", "headers": { "Access-Control-Allow-Origin": "*", "Content-Type": "text" }, "isBase64Encoded": "False", "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-6.zip'                                  // cos的url
    },
    {
      name: 'MySQL基礎使用Demo',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例展示了MySQL的基礎使用方法，用戶可根據實際業務配合觸發器一起使用',                // 描述
      label: ['mysql', 'Python2.7', 'DB'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-7.zip'                                  // cos的url
    },
    {
      name: '圖像壓縮',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例配置了 COS 觸發器，當有文件上傳到對應的 COS bucket時，會觸發雲函數執列，並把文件下載到本地臨時目錄，用做後續處理',                // 描述
      label: ['cos', 'Python2.7', 'thumbnail'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-8.zip'                                  // cos的url
    },
    {
      name: 'ES索引刪除清理',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '通過使用 ElasticSearch curator 庫，實現了 ES 索引的刪除清理。可為其配置定時觸發器後，定時執列並清理 ES 內索引',                // 描述
      label: ['elasticsearchr', 'Python2.7', 'curato', 'timer'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-9.zip'                                  // cos的url
    },
    {
      name: 'Websocket傳輸函數',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例基於 API 網關實現websocket功能，API網關和雲函數一起構成websocket的Server端，由API網關承載和Client端的長連接。websocket一共需要3類函數承載，分別是註冊函數、傳輸函數和清理函數，本函數為傳輸函數',                // 描述
      label: ['apigw', 'Python2.7', 'websocket'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": { "websocket": { "action": "data recv", "dataType": "text", "secConnectionID": "xawexasdfewezdfsdfeasdfffa==", "data": "xxx" } }, "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-10.zip'                                  // cos的url
    },
    {
      name: '通過API網關上傳文件',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例使用 API 網關觸發器和雲函數快速構建web後台，實現從前端通過API上傳文件到雲函數，並下載文件到雲函數的本地目錄/tmp，然後上傳到COS bucket',                // 描述
      label: ['apigw', 'Python2.7', 'upload'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{ "response": { "body": "Upload to COS success", "headers": { "Access-Control-Allow-Origin": "*", "Content-Type": "text" }, "isBase64Encoded": "False", "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-11.zip'                                  // cos的url
    },
    {
      name: '壓縮包解壓',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例通過配置COS觸發，上傳到COS的壓縮包，使用SCF下載並本地解壓，支持中文欄位解壓，並把解壓後的文件上傳到COS另一個targetBucket環境變數指定的儲存桶中，支持如下壓縮格式：ZIP, RAR, 7Z, BZIP2, GZIP, TAR, XZ',                // 描述
      label: ['cos', 'Python2.7', 'unzip', 'archive', 'CosUnpackDemo'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-12.zip'                                  // cos的url
    },
    {
      name: 'Websocket註冊函數',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例基於 API 網關實現websocket功能，API網關和雲函數一起構成websocket的Server端，由API網關承載和Client端的長連接。websocket一共需要3類函數承載，分別是註冊函數、傳輸函數和清理函數，本函數為註冊函數',                // 描述
      label: ['apigw', 'Python2.7', 'websocket'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": { "websocket": { "action": "connecting", "secWebSocketProtocol": "chat,binary", "secWebSocketExtensions": "extension1,extension2", "secConnectionID": "xawexasdfewezdfsdfeasdfffa==" } }, "context": "" }',   // 入参
      outParams: '{ "errNo": 0, "websocket": { "action": "connecting", "secWebSocketProtocol": "chat,binary", "secWebSocketExtensions": "extension1,extension2", "secConnectionID": "xawexasdfewezdfsdfeasdfffa==" }, "errMsg": "ok" }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-13.zip'                                  // cos的url
    },
    {
      name: 'ZIP包解壓',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例通過配置COS觸發，上傳到COS的ZIP包，使用SCF下載並本地解壓，支持帶密碼解壓，支持中文欄位解壓，並把解壓後的文件上傳到COS另一個bucket中，您還可以擴充支持RAR包的解壓',                // 描述
      label: ['cos', 'Python2.7', 'unzip'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-14.zip'                                  // cos的url
    },
    {
      name: '下載URL文件並儲存到COS',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例介紹如何把CDN的日誌拉取並儲存到物件儲存，一共需要創建2個函數，任務分發函數和儲存函數，通過任務分發函數調用儲存函數完成日誌儲存，該函數為日誌儲存函數',                // 描述
      label: ['CDN', 'Python2.7', 'COS'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "cos_region": "ap-chengdu", "url": "https://mat1.gtimg.com/pingjs/ext2020/qqindex2018/dist/img/qq_logo_2x.png", "secret_id": "*********************", "cos_bucket": "bucketname-1251000000", "cos_key": "/demo/logo.png", "secret_key": "*******************" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-15.zip'                                  // cos的url
    },
    {
      name: '身份證識別',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例使用 COS 觸發器，並調用AI介面實現身份證識別',                // 描述
      label: ['detection', 'Python2.7', 'AI'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-16.zip'                                  // cos的url
    },
    {
      name: '定時撥測',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示常式式碼的功能是定時撥測 URL 清單中的地址，並通過郵件發送告警',                // 描述
      label: ['url', 'Python2.7', 'timer'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-17.zip'                                  // cos的url
    },
    {
      name: 'Websocket清理函數',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例基於 API 網關實現websocket功能，API網關和雲函數一起構成websocket的Server端，由API網關承載和Client端的長連接。websocket一共需要3類函數承載，分別是註冊函數、傳輸函數和清理函數，本函數為清理函數',                // 描述
      label: ['apigw', 'Python2.7', 'websocket'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": { "websocket": { "action": "closing", "secConnectionID": "xawexasdfewezdfsdfeasdfffa==" } }, "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-18.zip'                                  // cos的url
    },
    {
      name: 'CDN快取自動重新整理',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例使用 COS 觸發器，完成CDN快取自動重新整理動作',                // 描述
      label: ['CDN', 'Python2.7', 'refresh'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-19.zip'                                  // cos的url
    },
    {
      name: '通過訊息隊列發送郵件',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例通過接收 CMQ 訊息隊列中指定格式的訊息，並根據訊息內容向指定的郵箱發送郵件',                // 描述
      label: ['CMQ', 'Python2.7', 'email'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-20.zip'                                  // cos的url
    },
    {
      name: 'MySQL自動備份',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: 'MySQL數據備份到COS',                // 描述
      label: ['mysql', 'Python2.7', 'backup'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-21.zip'                                  // cos的url
    },
    {
      name: '日誌分析寫數據庫',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例展示了從COS下載日誌文件，使用雲函數分析後寫入MySql',                // 描述
      label: ['log', 'analysis', 'MySql'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-22.zip'                                  // cos的url
    },
    {
      name: 'ES寫入函數',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例通過使用ElasticSearch庫，實現了將隨機數寫入ES。可為其配置定時觸發器後，定時執列',                // 描述
      label: ['elasticsearch', 'Python2.7', 'timer'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-23.zip'                                  // cos的url
    },
    {
      name: 'CDN日誌儲存任務分發函數',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例介紹如何把CDN的日誌拉取並儲存到物件儲存，一共需要創建2個函數，任務分發函數和儲存函數，通過任務分發函數調用「下載URL文件並儲存到COS」函數完成日誌儲存，該函數為任務分發函數',                // 描述
      label: ['CDN', 'Python2.7', 'Log'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-24.zip'                                  // cos的url
    },
    {
      name: 'map_function',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例Demo演示怎麼利用COS來做MapReduce，一共需要2個函數：map_function和reduce_function，3個COS Bucket：srcmr、middlestagebucket 和 destmr',                // 描述
      label: ['MapReduce', 'Python2.7', 'map_function'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-25.zip'                                  // cos的url
    },
    {
      name: 'mongodb_basic_demo',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例演示基於API網關提供博客內的文章查詢和文章內容，您可以擴展函數來實現 Web 後端服務',                // 描述
      label: ['mongodb', 'Python2.7', 'basic'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-26.zip'                                  // cos的url
    },
    {
      name: 'reduce_function',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例Demo演示怎麼利用COS來做MapReduce，一共需要2個函數：map_function和reduce_function，3個COS Bucket：srcmr、middlestagebucket 和 destmr',                // 描述
      label: ['Python2.7', 'MapReduce', 'reduce_function'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-27.zip'                                  // cos的url
    },
    {
      name: 'CKAFKA數據備份到COS--SCHEDULE',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: 'CKAFKA數據備份到COS',                // 描述
      label: ['ckafka', 'Python2.7', 'cos', 'schedule'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-28.zip'                                  // cos的url
    },
    {
      name: 'Ckafka簡單訊息輸出模板',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例會根據觸發器配置的最大批量訊息數去觸發雲函數運列，雲函數每次運列都會創建一個以時間戳加隨機數為名字的文本文件，並把拉取到的 Ckafca 訊息換列寫入文本文件。最後把寫好的文件上傳到 COS bucket，並以小時為單位在 COS bucket 中創建文件夾',                // 描述
      label: ['ckafka', 'Python2.7', 'template'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-29.zip'                                  // cos的url
    },
    {
      name: 'CKAFKA數據備份到COS--CONSUMER',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: 'CKAFKA數據備份到COS',                // 描述
      label: ['ckafka', 'Python2.7', 'cos', 'consumer'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python2-30.zip'                                  // cos的url
    },
  ]
}

export default Python2
