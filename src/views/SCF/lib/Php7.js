const Php7 = {
  type: 'Php 7.2',
  detail: [
    {
      name: 'helloworld',                           // 名称
      language: 'Php7',                       // 语言
      desc: 'helloworld 空白模板函数',                // 描述
      label: ['Php7', 'helloworld'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Php7-1.zip'                                  // cos的url
    },
    {
      name: 'API 网关返回自定义html页面',                           // 名称
      language: 'Php7',                       // 语言
      desc: '本示例主要演示如何配置 API 网关触发器返回自定义的html页面',                // 描述
      label: ['Php7', 'API GW', 'Custom Html'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{"response":{"body":"$content","headers":{"Content-Type":"text/html"},"isBase64Encoded":"False","statusCode":200}}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Php7-2.zip'                                  // cos的url
    },
    {
      name: 'API 网关基础示例',                           // 名称
      language: 'Php7',                       // 语言
      desc: '本示例演示 API 网关使用的基础方法，主要展示在集成响应下（通过雲函数控制台创建的API网关触发器預設启用集成响应），怎样构造返回值',                // 描述
      label: ['Php7', 'API GW', 'API'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{ "response": { "body": "$content", "headers": { "Content-Type": "text/html" }, "isBase64Encoded": false, "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Php7-3.zip'                                  // cos的url
    },
    {
      name: 'API 网关返回 Web 页面',                           // 名称
      language: 'Php7',                       // 语言
      desc: '本示例主要通过 SCF 结合 API 网关，快速实现一个对公网服务的 Web 页面。',                // 描述
      label: ['Php7', 'API GW', 'Web Page'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{"response":{"body":"$content","headers":{"Content-Type":"text/html"},"isBase64Encoded":"False","statusCode":200}}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Php7-4.zip'                                  // cos的url
    },
    {
      name: '获取数据生成二维码并结合API网关示例',                           // 名称
      language: 'Php7',                       // 语言
      desc: '本示例主要展示在SCF中对各种资源的引用方法，包括include php文件、调用上传到SCF中的非php文件、使用/tmp临时目录，同时展示了SCF中3种获取用户提交数据的方法，最后演示如何返回一个网页或文件',                // 描述
      label: ['Php7', 'API GW', 'API', '$_POST', '$_GET', 'path', 'QRcode'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{"response":{"body":"$content","headers":{"Content-Type":"text/html"},"isBase64Encoded":false,"statusCode":200}}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Php7-5.zip'                                  // cos的url
    },
    {
      name: 'API 网关返回 Web 页面',                           // 名称
      language: 'Php7',                       // 语言
      desc: '本示例主要通过 SCF 结合 API 网关，快速实现一个对公网服务的 Web 页面。',                // 描述
      label: ['Php7.2', 'API GW', 'Web Page'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{"response":{"body":"$content","headers":{"Content-Type":"text/html"},"isBase64Encoded":"False","statusCode":200}}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Php7-6.zip'                                  // cos的url
    },
    {
      name: '定时拨测函数',                           // 名称
      language: 'Php7',                       // 语言
      desc: '本示例主要演示定时拨测 URL 清單中的地址，当拨测失败时，通过邮件发送告警',                // 描述
      label: ['Php7', 'url', 'Timer'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Php7-7.zip'                                  // cos的url
    },
    {
      name: 'API 网关返回自定义html页面',                           // 名称
      language: 'Php7.2',                       // 语言
      desc: '本示例主要通过 SCF 结合 API 网关，快速实现一个对公网服务的 Web 页面。',                // 描述
      label: ['Php7.2', 'API GW', 'Web Page'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{"response":{"body":"$content","headers":{"Content-Type":"text/html"},"isBase64Encoded":"False","statusCode":200}}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Php7-8.zip'                                  // cos的url
    },
    {
      name: '通过訊息队列发送邮件',                           // 名称
      language: 'Php7.2',                       // 语言
      desc: '本示例通过接收 CMQ 訊息队列中指定格式的訊息，并根据訊息内容向指定的邮箱发送邮件',                // 描述
      label: ['CMQ', 'Php7', 'email'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": { "body": "email content to send", "fromAddr": "xxx@qq.com", "toAddr": "xxx@qq.com", "title": "hello from scf & cmq" }, "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Php7-9.zip'                                  // cos的url
    },
    {
      name: 'COS 文件备份',                           // 名称
      language: 'Php7.2',                       // 语言
      desc: '此示例使用COS作为触发器，在用户上传文件到指定bucket时，将该文件复制到另一个用于备份的bucket存储',                // 描述
      label: ['Backup', 'Php7', 'COS'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{"event":"","context":""}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Php7-10.zip'                                  // cos的url
    },
    {
      name: 'onedrive with SCF',                           // 名称
      language: 'Php7.2',                       // 语言
      desc: '获取onedrive信息并结合API网关展示',                // 描述
      label: ['Php7', 'API GW', 'onedrive'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{"response":{"body":"$content","headers":{"Content-Type":"text/html"},"isBase64Encoded":false,"statusCode":200}}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Php7-11.zip'                                  // cos的url
    },
  ]
}

export default Php7
