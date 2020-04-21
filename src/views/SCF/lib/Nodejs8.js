const Nodejs8 = {
  type: 'Nodejs 8.9',
  detail: [
    {
      name: 'ES写入函数',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通过使用ElasticSearch库，實現了将随机数写入ES。可为其配置定时触发器後，定时执列',                // 描述
      label: ['elasticsearch', 'Nodejs8.9', 'timer'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-1.zip'                                  // cos的url
    },
    {
      name: 'helloworld',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: 'helloworld 空白模板函数',                // 描述
      label: ['Nodejs8.9', 'helloworld'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-2.zip'                                  // cos的url
    },
    {
      name: 'API 网关基础示例',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例主要演示当配置 API 网关触发器的时候，怎样去构造返回的 json 數據结构',                // 描述
      label: ['Nodejs8.9', 'API GW', 'API'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{ "response": { "body": "$content", "headers": { "Content-Type": "text/html" }, "isBase64Encoded": false, "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-3.zip'                                  // cos的url
    },
    {
      name: '操作Mysql',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通过mysql Node客户端，操作雲Mysql',                // 描述
      label: ['Nodejs8.9', 'Mysql'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-4.zip'                                  // cos的url
    },
    {
      name: 'API 网关返回 Web 页面',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例主要通过 SCF 结合 API 网关，快速實現一个對公网服務的 Web 页面',                // 描述
      label: ['Nodejs8.9', 'API GW', 'Web Page'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{ "response": { "body": "$content", "headers": { "Content-Type": "text/html" }, "isBase64Encoded": "False", "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-5.zip'                                  // cos的url
    },
    {
      name: 'API 网关返回自定义html页面',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例主要演示如何配置 API 网关触发器返回自定义的html页面',                // 描述
      label: ['Nodejs8.9', 'API GW', 'Custom Html'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{ "response": { "body": "$content", "headers": { "Content-Type": "text/html" }, "isBase64Encoded": "False", "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-6.zip'                                  // cos的url
    },
    {
      name: 'API 网关搭建hexo静态站点',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例主要通过 SCF 结合 API 网关，快速實現一个基于hexo的静态站点',                // 描述
      label: ['Nodejs8.9', 'API GW', 'Hexo'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{ "response": { "body": "$content", "headers": { "Content-Type": "text/html" }, "isBase64Encoded": "False", "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-7.zip'                                  // cos的url
    },
    {
      name: 'websocket传输函数',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例基于 API 网关實現websocket功能，API网关和雲函数一起构成websocket的Server端，由API网关承载和Client端的长连接。websocket一共需要3类函数承载，分别是注册函数、传输函数和清理函数，本函数为传输函数。',                // 描述
      label: ['Nodejs8.9', 'apigateway', 'webscoket'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-8.zip'                                  // cos的url
    },
    {
      name: '从物件儲存获取文件',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例配置了 COS 触发器，当有文件上傳到對应的 COS bucket时，会触发雲函数执列，并把文件下载到本地临时目录，用做後续处理',                // 描述
      label: ['Nodejs8.9', 'apigateway', 'webscoket'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-9.zip'                                  // cos的url
    },
    {
      name: '操作Redis',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通过redis node客户端，操作credis數據库',                // 描述
      label: ['Nodejs8.9', 'CRedis'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-10.zip'                                  // cos的url
    },
    {
      name: '文字识别',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通过配置COS触发或API网关触发，利用优图提供的能力，进列文字识别',                // 描述
      label: ['Nodejs8.9', 'WordRecognition'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-11.zip'                                  // cos的url
    },
    {
      name: 'mongodb_basic_demo',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例演示基于API网关提供博客内的文章查询和文章内容，您可以扩展函数来實現 Web 後端服務',                // 描述
      label: ['Nodejs8.9', 'mongodb', 'basic'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-12.zip'                                  // cos的url
    },
    {
      name: '定时拨测函数',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例主要演示定时拨测 URL 清單中的地址，当拨测失败时，通过邮件发送告警',                // 描述
      label: ['Nodejs8.9', 'url', 'Timer'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-13.zip'                                  // cos的url
    },
    {
      name: 'websocket注册函数',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例基于 API 网关實現websocket功能，API网关和雲函数一起构成websocket的Server端，由API网关承载和Client端的长连接。websocket一共需要3类函数承载，分别是注册函数、传输函数和清理函数，本函数为注册函数。',                // 描述
      label: ['Nodejs8.9', 'apigateway', 'webscoket'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-14.zip'                                  // cos的url
    },
    {
      name: '国庆 SCF 运营推广活动 Demo',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例主要演示如何配置 API 网关触发器返回自定义 html 页面',                // 描述
      label: ['Nodejs8.9', 'Vscode'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-15.zip'                                  // cos的url
    },
    {
      name: '图像压缩',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例配置了 COS 触发器，当有文件上傳到對应的 COS bucket时，会触发雲函数执列，并把文件下载到本地临时目录，用做後续处理',                // 描述
      label: ['Nodejs8.9', 'cos', 'thumbnail'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-16.zip'                                  // cos的url
    },
    {
      name: '影片转码',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通过配置COS触发器，当你在通过上傳影片文件到cos时，通过雲点播提供的介面，进列影片转码，并写入目标bucket中',                // 描述
      label: ['Nodejs8.9', 'Ckafka', 'Transcode'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-17.zip'                                  // cos的url
    },
    {
      name: 'websocket清理函数',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例基于 API 网关實現websocket功能，API网关和雲函数一起构成websocket的Server端，由API网关承载和Client端的长连接。websocket一共需要3类函数承载，分别是注册函数、传输函数和清理函数，本函数为清理函数。',                // 描述
      label: ['Nodejs8.9', 'apigateway', 'webscoket'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-18.zip'                                  // cos的url
    },
    {
      name: '解压压缩包',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通过配置COS触发，上傳到COS的ZIP包，使用SCF下载并本地解压，支持带密码解压，支持中文欄位解压，并把解压後的文件上傳到COS另一个bucket中，您还可以扩充支持RAR包的解压',                // 描述
      label: ['Nodejs8.9', 'COS', 'Unzip'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-19.zip'                                  // cos的url
    },
    {
      name: '给kafka发訊息',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通过从源bucket下载多个小文件，合并之後，上傳到另一个bucket',                // 描述
      label: ['Nodejs8.9', 'Ckafka'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-20.zip'                                  // cos的url
    },
    {
      name: '通过訊息队列发送邮件',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通过接收 CMQ 訊息队列中指定格式的訊息，并根据訊息内容向指定的邮箱发送邮件',                // 描述
      label: ['Nodejs8.9', 'CMQ', 'email'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-21.zip'                                  // cos的url
    },
    {
      name: 'zip格式文件解压',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通过从源bucket下载zip格式文件，解压之後，上傳到另一个bucket',                // 描述
      label: ['Nodejs8.9', 'Unzip', 'unzip file'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-22.zip'                                  // cos的url
    },
    {
      name: 'kafka訊息上傳到cos',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通过配置kafka触发器，从kafka接收到訊息後，写入文件并上傳到cos中',                // 描述
      label: ['Nodejs8.9', 'Ckafka', 'Cos'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-23.zip'                                  // cos的url
    },
    {
      name: '文件合并',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通过从源bucket下载多个小文件，合并之後，上傳到另一个bucket',                // 描述
      label: ['Nodejs8.9', 'Ckafka', 'send message'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-24.zip'                                  // cos的url
    },
    {
      name: '删除ES索引',                           // 名称
      language: 'Nodejs8.9',                       // 语言
      desc: '本示例通过使用ElasticSearch库，删除ES索引',                // 描述
      label: ['Nodejs8.9', 'elasticsearch'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Nodejs8-25.zip'                                  // cos的url
    },
  ]
}

export default Nodejs8
