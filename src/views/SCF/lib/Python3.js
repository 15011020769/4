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
      url: '1.zip'                                  // cos的url
    }
  ]
}

export default Python3