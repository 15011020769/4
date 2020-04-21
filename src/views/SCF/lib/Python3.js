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
      certificate: '公开',                           // 证书
      url: 'Python3-1.zip'                                  // cos的url
    },
    {
      name: 'api_service',                           // 名称
      language: 'Python 3.6',                       // 语言
      desc: '本示例演示基于API网关提供博客内的文章查询和文章内容，您可以扩展函数来實現 Web 後端服務',                // 描述
      label: ['service', 'Python3.6', 'API'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python3-2.zip'                                  // cos的url
    },
    {
      name: '定时拨测',                           // 名称
      language: 'Python 3.6',                       // 语言
      desc: '本示例程式碼的功能是定时拨测 URL 清單中的地址，并通过邮件发送告警',                // 描述
      label: ['url', 'Python3.6', 'timer'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python3-3.zip'                                  // cos的url
    },
    {
      name: 'API 网关返回 Web 页面',                           // 名称
      language: 'Python 3.6',                       // 语言
      desc: '本示例主要通过 SCF 结合 API 网关，快速實現一个對公网服務的 Web 页面',                // 描述
      label: ['API GW', 'Python3.6', 'Web Page'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{ "response": { "body": "$content", "headers": { "Content-Type": "text/html" }, "isBase64Encoded": "False", "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python3-4.zip'                                  // cos的url
    },
    {
      name: '从物件儲存获取文件',                           // 名称
      language: 'Python 3.6',                       // 语言
      desc: '本示例配置了 COS 触发器，当有文件上傳到對应的 COS bucket时，会触发雲函数执列，并把文件下载到本地临时目录，用做後续处理',                // 描述
      label: ['cos', 'Python3.6', 'object'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python3-5.zip'                                  // cos的url
    },
    {
      name: '图片转文字',                           // 名称
      language: 'Python 3.6',                       // 语言
      desc: '本示例使用 API 网关触发器和雲函数快速构建web後台，實現图片中文字识别的功能，用户通过 API 网关上傳图片文件，上傳後的文件会保存在COS，并调用AI介面實現文字识别，把结果返回前端',                // 描述
      label: ['apigw', 'Python3.6', 'AI'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{ "response": { "body": "res_text", "headers": { "Access-Control-Allow-Origin": "*", "Content-Type": "text" }, "isBase64Encoded": "False", "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python3-6.zip'                                  // cos的url
    },
    {
      name: '通过訊息队列发送邮件',                           // 名称
      language: 'Python 3.6',                       // 语言
      desc: '本示例通过接收 CMQ 訊息队列中指定格式的訊息，并根据訊息内容向指定的邮箱发送邮件',                // 描述
      label: ['apigw', 'Python3.6', 'AI'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python3-7.zip'                                  // cos的url
    },
    {
      name: 'API 网关返回自定义html页面',                           // 名称
      language: 'Python 3.6',                       // 语言
      desc: '本示例主要演示如何配置 API 网关触发器返回自定义的html页面',                // 描述
      label: ['API GW', 'Python3.6', 'Custom Html'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{"response":{"body":"$content","headers":{"Content-Type":"text/html"},"isBase64Encoded":"False","statusCode":200}}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python3-8.zip'                                  // cos的url
    }
  ]
}

export default Python3
