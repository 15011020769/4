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
      certificate: '公开',
      url: 'Python2-1.zip'
    },
    {
      name: '图片转文字',
      language: 'Python 2.7',
      desc: '本示例使用 API 网关触发器和雲函数快速构建web後台，實現图片中文字识别的功能，用户通过 API 网关上傳图片文件，上傳後的文件会保存在COS，并调用AI介面實現文字识别，把结果返回前端',
      label: ['apigw', 'Python2.7', 'Word_Recognition'],
      author: '台富雲無伺服器雲函数团队',
      inParams: '{ "event": "", "context": "" }',
      outParams: '{ "response": { "body": "res_text", "headers": { "Access-Control-Allow-Origin": "*", "Content-Type": "text" }, "isBase64Encoded": "False", "statusCode": 200 } }',
      notice: '無',
      certificate: '公开',
      url: 'Python2-2.zip'
    },
    {
      name: 'Ckafka 訊息投递 COS',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例会根据触发器配置的最大批量訊息数去触发雲函数运列，雲函数每次运列都会创建一个以時間戳加随机数为名字的文本文件，并把拉取到的 Ckafca 訊息换列写入文本文件。最後把写好的文件上傳到 COS bucket，并以小时为单位在 COS bucket 中创建文件夹',                // 描述
      label: ['Ckafka', 'Python2.7', 'COS'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-3.zip'                                  // cos的url
    },
    {
      name: 'Ckafka 訊息投递 COS',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例会根据触发器配置的最大批量訊息数去触发雲函数运列，雲函数每次运列都会创建一个以時間戳加随机数为名字的文本文件，并把拉取到的 Ckafca 訊息换列写入文本文件。最後把写好的文件上傳到 COS bucket，并以小时为单位在 COS bucket 中创建文件夹',                // 描述
      label: ['Ckafka', 'Python2.7', 'COS'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-3.zip'                                  // cos的url
    },
    {
      name: 'API 网关返回自定义html页面',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例主要演示如何配置 API 网关触发器返回自定义的html页面',                // 描述
      label: ['API GW', 'Python2.7', 'Custom Html'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{ "response": { "body": "$content", "headers": { "Content-Type": "text/html" }, "isBase64Encoded": "False", "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-4.zip'                                  // cos的url
    },
    {
      name: '从物件儲存获取文件',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例配置了 COS 触发器，当有文件上傳到對应的 COS bucket时，会触发雲函数执列，并把文件下载到本地临时目录，用做後续处理',                // 描述
      label: ['API GW', 'Python2.7', 'Custom Html'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-5.zip'                                  // cos的url
    },
    {
      name: 'API网关触发器基础范例',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例演示 API 网关使用的基础方法，主要展示在集成响应下（通过雲函数控制台创建的API网关触发器預設启用集成响应），怎样构造返回值',                // 描述
      label: ['apigw', 'Python2.7', 'basic'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{ "response": { "body": "API GW Test Success", "headers": { "Access-Control-Allow-Origin": "*", "Content-Type": "text" }, "isBase64Encoded": "False", "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-6.zip'                                  // cos的url
    },
    {
      name: 'MySQL基础使用Demo',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例展示了MySQL的基础使用方法，用户可根据实际业务配合触发器一起使用',                // 描述
      label: ['mysql', 'Python2.7', 'DB'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-7.zip'                                  // cos的url
    },
    {
      name: '图像压缩',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例配置了 COS 触发器，当有文件上傳到對应的 COS bucket时，会触发雲函数执列，并把文件下载到本地临时目录，用做後续处理',                // 描述
      label: ['cos', 'Python2.7', 'thumbnail'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-8.zip'                                  // cos的url
    },
    {
      name: 'ES索引删除清理',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '通过使用 ElasticSearch curator 库，實現了 ES 索引的删除清理。可为其配置定时触发器後，定时执列并清理 ES 内索引',                // 描述
      label: ['elasticsearchr', 'Python2.7', 'curato', 'timer'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-9.zip'                                  // cos的url
    },
    {
      name: 'Websocket传输函数',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例基于 API 网关實現websocket功能，API网关和雲函数一起构成websocket的Server端，由API网关承载和Client端的长连接。websocket一共需要3类函数承载，分别是注册函数、传输函数和清理函数，本函数为传输函数',                // 描述
      label: ['apigw', 'Python2.7', 'websocket'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": { "websocket": { "action": "data recv", "dataType": "text", "secConnectionID": "xawexasdfewezdfsdfeasdfffa==", "data": "xxx" } }, "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-10.zip'                                  // cos的url
    },
    {
      name: '通过API网关上傳文件',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例使用 API 网关触发器和雲函数快速构建web後台，實現从前端通过API上傳文件到雲函数，并下载文件到雲函数的本地目录/tmp，然後上傳到COS bucket',                // 描述
      label: ['apigw', 'Python2.7', 'upload'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{ "response": { "body": "Upload to COS success", "headers": { "Access-Control-Allow-Origin": "*", "Content-Type": "text" }, "isBase64Encoded": "False", "statusCode": 200 } }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-11.zip'                                  // cos的url
    },
    {
      name: '压缩包解压',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例通过配置COS触发，上傳到COS的压缩包，使用SCF下载并本地解压，支持中文欄位解压，并把解压後的文件上傳到COS另一个targetBucket环境變數指定的儲存桶中，支持如下压缩格式：ZIP, RAR, 7Z, BZIP2, GZIP, TAR, XZ',                // 描述
      label: ['cos', 'Python2.7', 'unzip', 'archive', 'CosUnpackDemo'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-12.zip'                                  // cos的url
    },
    {
      name: 'Websocket注册函数',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例基于 API 网关實現websocket功能，API网关和雲函数一起构成websocket的Server端，由API网关承载和Client端的长连接。websocket一共需要3类函数承载，分别是注册函数、传输函数和清理函数，本函数为注册函数',                // 描述
      label: ['apigw', 'Python2.7', 'websocket'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": { "websocket": { "action": "connecting", "secWebSocketProtocol": "chat,binary", "secWebSocketExtensions": "extension1,extension2", "secConnectionID": "xawexasdfewezdfsdfeasdfffa==" } }, "context": "" }',   // 入参
      outParams: '{ "errNo": 0, "websocket": { "action": "connecting", "secWebSocketProtocol": "chat,binary", "secWebSocketExtensions": "extension1,extension2", "secConnectionID": "xawexasdfewezdfsdfeasdfffa==" }, "errMsg": "ok" }',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-13.zip'                                  // cos的url
    },
    {
      name: 'ZIP包解压',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例通过配置COS触发，上傳到COS的ZIP包，使用SCF下载并本地解压，支持带密码解压，支持中文欄位解压，并把解压後的文件上傳到COS另一个bucket中，您还可以扩充支持RAR包的解压',                // 描述
      label: ['cos', 'Python2.7', 'unzip'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-14.zip'                                  // cos的url
    },
    {
      name: '下载URL文件并儲存到COS',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例介绍如何把CDN的日志拉取并儲存到物件儲存，一共需要创建2个函数，任务分发函数和儲存函数，通过任务分发函数调用儲存函数完成日志儲存，该函数为日志儲存函数',                // 描述
      label: ['CDN', 'Python2.7', 'COS'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "cos_region": "ap-chengdu", "url": "https://mat1.gtimg.com/pingjs/ext2020/qqindex2018/dist/img/qq_logo_2x.png", "secret_id": "*********************", "cos_bucket": "bucketname-1251000000", "cos_key": "/demo/logo.png", "secret_key": "*******************" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-15.zip'                                  // cos的url
    },
    {
      name: '身份证识别',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例使用 COS 触发器，并调用AI介面實現身份证识别',                // 描述
      label: ['detection', 'Python2.7', 'AI'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-16.zip'                                  // cos的url
    },
    {
      name: '定时拨测',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例程式碼的功能是定时拨测 URL 清單中的地址，并通过邮件发送告警',                // 描述
      label: ['url', 'Python2.7', 'timer'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-17.zip'                                  // cos的url
    },
    {
      name: 'Websocket清理函数',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例基于 API 网关實現websocket功能，API网关和雲函数一起构成websocket的Server端，由API网关承载和Client端的长连接。websocket一共需要3类函数承载，分别是注册函数、传输函数和清理函数，本函数为清理函数',                // 描述
      label: ['apigw', 'Python2.7', 'websocket'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": { "websocket": { "action": "closing", "secConnectionID": "xawexasdfewezdfsdfeasdfffa==" } }, "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-18.zip'                                  // cos的url
    },
    {
      name: 'CDN快取自动重新整理',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例使用 COS 触发器，完成CDN快取自动重新整理动作',                // 描述
      label: ['CDN', 'Python2.7', 'refresh'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-19.zip'                                  // cos的url
    },
    {
      name: '通过訊息队列发送邮件',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例通过接收 CMQ 訊息队列中指定格式的訊息，并根据訊息内容向指定的邮箱发送邮件',                // 描述
      label: ['CMQ', 'Python2.7', 'email'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-20.zip'                                  // cos的url
    },
    {
      name: 'MySQL自动备份',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: 'MySQL數據备份到COS',                // 描述
      label: ['mysql', 'Python2.7', 'backup'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-21.zip'                                  // cos的url
    },
    {
      name: '日志分析写數據库',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例展示了从COS下载日志文件，使用雲函数分析後写入MySql',                // 描述
      label: ['log', 'analysis', 'MySql'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-22.zip'                                  // cos的url
    },
    {
      name: 'ES写入函数',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例通过使用ElasticSearch库，實現了将随机数写入ES。可为其配置定时触发器後，定时执列',                // 描述
      label: ['elasticsearch', 'Python2.7', 'timer'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-23.zip'                                  // cos的url
    },
    {
      name: 'CDN日志儲存任务分发函数',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例介绍如何把CDN的日志拉取并儲存到物件儲存，一共需要创建2个函数，任务分发函数和儲存函数，通过任务分发函数调用“下载URL文件并儲存到COS”函数完成日志儲存，该函数为任务分发函数',                // 描述
      label: ['CDN', 'Python2.7', 'Log'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-24.zip'                                  // cos的url
    },
    {
      name: 'map_function',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例Demo演示怎么利用COS来做MapReduce，一共需要2个函数：map_function和reduce_function，3个COS Bucket：srcmr、middlestagebucket 和 destmr',                // 描述
      label: ['MapReduce', 'Python2.7', 'map_function'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-25.zip'                                  // cos的url
    },
    {
      name: 'map_function',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例Demo演示怎么利用COS来做MapReduce，一共需要2个函数：map_function和reduce_function，3个COS Bucket：srcmr、middlestagebucket 和 destmr',                // 描述
      label: ['MapReduce', 'Python2.7', 'map_function'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-25.zip'                                  // cos的url
    },
    {
      name: 'mongodb_basic_demo',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例演示基于API网关提供博客内的文章查询和文章内容，您可以扩展函数来實現 Web 後端服務',                // 描述
      label: ['mongodb', 'Python2.7', 'basic'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-26.zip'                                  // cos的url
    },
    {
      name: 'reduce_function',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例Demo演示怎么利用COS来做MapReduce，一共需要2个函数：map_function和reduce_function，3个COS Bucket：srcmr、middlestagebucket 和 destmr',                // 描述
      label: ['Python2.7', 'MapReduce', 'reduce_function'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-27.zip'                                  // cos的url
    },
    {
      name: 'CKAFKA數據备份到COS--SCHEDULE',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: 'CKAFKA數據备份到COS',                // 描述
      label: ['ckafka', 'Python2.7', 'cos', 'schedule'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-28.zip'                                  // cos的url
    },
    {
      name: 'Ckafka简单訊息输出模板',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: '本示例会根据触发器配置的最大批量訊息数去触发雲函数运列，雲函数每次运列都会创建一个以時間戳加随机数为名字的文本文件，并把拉取到的 Ckafca 訊息换列写入文本文件。最後把写好的文件上傳到 COS bucket，并以小时为单位在 COS bucket 中创建文件夹',                // 描述
      label: ['ckafka', 'Python2.7', 'template'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{ "event": "", "context": "" }',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-29.zip'                                  // cos的url
    },
    {
      name: 'CKAFKA數據备份到COS--CONSUMER',                           // 名称
      language: 'Python 2.7',                       // 语言
      desc: 'CKAFKA數據备份到COS',                // 描述
      label: ['ckafka', 'Python2.7', 'cos', 'consumer'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公开',                           // 证书
      url: 'Python2-30.zip'                                  // cos的url
    },
  ]
}

export default Python2
