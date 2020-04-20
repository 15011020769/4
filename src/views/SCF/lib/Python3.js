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
    }
  ]
}

export default Python3