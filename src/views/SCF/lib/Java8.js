const Java8 = {
  type: 'Java8',
  detail: [
    {
      name: 'helloworld',                           // 名称
      language: 'Java8',                       // 语言
      desc: 'helloworld 空白模板函數',                // 描述
      label: ['Java8', 'helloworld'],           // 标签
      author: '台富雲無伺服器雲函数团队',               // 作者
      inParams: '{}',   // 入参
      outParams: '{}',    // 出参
      notice: '無',                                  // 注意
      certificate: '公開',                           // 证书
      handler: 'example.Hello::mainHandler',
      url: 'Java8-1.zip'                                  // cos的url
    },
  ]
}

export default Java8
