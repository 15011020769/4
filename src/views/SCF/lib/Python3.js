const Python3 = {
  type: 'Python 3.6',                               // 类型
  detail: [
    {
      name: 'helloworld',                           // 名称
      language: 'Python 3.6',                       // 语言
      desc: 'helloworld 空白模板函數',                // 描述
      label: ['Python3.6', 'helloworld'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{ "response": { "body": "res_text", "headers": { "Access-Control-Allow-Origin": "*", "Content-Type": "text" }, "isBase64Encoded": "False", "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python3-1.zip'                                  // cos的url
    },
    {
      name: 'api_service',                           // 名称
      language: 'Python 3.6',                       // 语言
      desc: '本示例演示基於API網關提供博客內的文章查詢和文章內容，您可以擴展函數來實現 Web 後端服務',                // 描述
      label: ['service', 'Python3.6', 'API'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python3-2.zip'                                  // cos的url
    },
    {
      name: '定時撥測',                           // 名称
      language: 'Python 3.6',                       // 语言
      desc: '本示常式式碼的功能是定時撥測 URL 清單中的地址，並通過郵件發送告警',                // 描述
      label: ['url', 'Python3.6', 'timer'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python3-3.zip'                                  // cos的url
    },
    {
      name: 'API 網關返回 Web 頁面',                           // 名称
      language: 'Python 3.6',                       // 语言
      desc: '本示例主要通過 SCF 結合 API 網關，快速實現一個對公網服務的 Web 頁面',                // 描述
      label: ['API GW', 'Python3.6', 'Web Page'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{ "response": { "body": "$content", "headers": { "Content-Type": "text/html" }, "isBase64Encoded": "False", "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python3-4.zip'                                  // cos的url
    },
    {
      name: '從物件儲存獲取文件',                           // 名称
      language: 'Python 3.6',                       // 语言
      desc: '本示例配置了 COS 觸發器，當有文件上傳到對應的 COS bucket時，會觸發雲函數執列，並把文件下載到本地臨時目錄，用做後續處理',                // 描述
      label: ['cos', 'Python3.6', 'object'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python3-5.zip'                                  // cos的url
    },
    {
      name: '圖片轉文字',                           // 名称
      language: 'Python 3.6',                       // 语言
      desc: '本示例使用 API 網關觸發器和雲函數快速構建web後台，實現圖片中文字識別的功能，用戶通過 API 網關上傳圖片文件，上傳後的文件會保存在COS，並調用AI介面實現文字識別，把結果返回前端',                // 描述
      label: ['apigw', 'Python3.6', 'AI'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{ "response": { "body": "res_text", "headers": { "Access-Control-Allow-Origin": "*", "Content-Type": "text" }, "isBase64Encoded": "False", "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python3-6.zip'                                  // cos的url
    },
    {
      name: '通過訊息隊列發送郵件',                           // 名称
      language: 'Python 3.6',                       // 语言
      desc: '本示例通過接收 CMQ 訊息隊列中指定格式的訊息，並根據訊息內容向指定的郵箱發送郵件',                // 描述
      label: ['apigw', 'Python3.6', 'AI'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python3-7.zip'                                  // cos的url
    },
    {
      name: 'API 網關返回自定義html頁面',                           // 名称
      language: 'Python 3.6',                       // 语言
      desc: '本示例主要演示如何配置 API 網關觸發器返回自定義的html頁面',                // 描述
      label: ['API GW', 'Python3.6', 'Custom Html'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{"response":{"body":"$content","headers":{"Content-Type":"text/html"},"isBase64Encoded":"False","statusCode":200}}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      url: 'Python3-8.zip'                                  // cos的url
    }
  ]
}

export default Python3
