const Nodejs6 = {
  type: 'Nodejs 6.10',
  detail: [
    {
      name: 'helloworld',                           // 名称
      language: 'Nodejs6.10',                       // 语言
      desc: 'helloworld 空白模板函数',                // 描述
      label: ['Nodejs6.10', 'helloworld'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs6-1.zip'                                  // cos的url
    },
    {
      name: 'API 网关基础示例',                           // 名称
      language: 'Nodejs6.10',                       // 语言
      desc: '本示例演示 API 网关使用的基础方法，主要展示在集成响应下（通过雲函数控制台创建的API网关触发器預設启用集成响应），怎样构造返回值',                // 描述
      label: ['Nodejs6.10', 'API GW', 'API'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{ "response": { "body": "$content", "headers": { "Content-Type": "text/html" }, "isBase64Encoded": false, "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs6-2.zip'                                  // cos的url
    },
    {
      name: '从物件儲存获取文件',                           // 名称
      language: 'Nodejs6.10',                       // 语言
      desc: '本示例配置了 COS 触发器，当有文件上傳到對应的 COS bucket时，会触发雲函数执列，并把文件下载到本地临时目录，用做後续处理',                // 描述
      label: ['Nodejs6.10', 'cos', 'object'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs6-3.zip'                                  // cos的url
    },
    {
      name: '通过訊息队列发送邮件',                           // 名称
      language: 'Nodejs6.10',                       // 语言
      desc: '本示例通过接收 CMQ 訊息队列中指定格式的訊息，并根据訊息内容向指定的邮箱发送邮件',                // 描述
      label: ['Nodejs6.10', 'CMQ', 'email'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs6-4.zip'                                  // cos的url
    },
    {
      name: '图像压缩',                           // 名称
      language: 'Nodejs6.10',                       // 语言
      desc: '本示例配置了 COS 触发器，当有图片上传到对应的 COS bucket时，会触发云函数执行，并把文件下载到本地临时目录进行压缩处理，压缩后的图片会上传到另外一个bucket中',                // 描述
      label: ['Nodejs6.10', 'cos', 'thumbnail'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs6-5.zip'                                  // cos的url
    },
    {
      name: '定时拨测函数',                           // 名称
      language: 'Nodejs6.10',                       // 语言
      desc: '本示例主要演示定时拨测 URL 列表中的地址，当拨测失败时，通过邮件发送告警',                // 描述
      label: ['Nodejs6.10', 'url', 'Timer'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs6-6.zip'                                  // cos的url
    },
  ]
}

export default Nodejs6
