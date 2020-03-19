let product = {
  SCF: {
    entry: 'src/views/SCF/main.js', // page 的入口
    template: 'src/public/index.html', // 模板来源
    filename: 'index.html', // 在 dist/index.html 的输出
    title: '台富雲-雲函数', // 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    chunks: ['chunk-vendors', 'chunk-common', 'SCF'] // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk。
  },
  CLA: {
    entry: 'src/views/CLA/main.js',
    template: 'src/public/index.html',
    filename: 'index.html',
    title: '台富雲-雲审计',
    chunks: ['chunk-vendors', 'chunk-common', 'CLA']
  },
  CM: {
    entry: 'src/views/CM/main.js',
    template: 'src/public/index.html',
    filename: 'index.html',
    title: '台富雲-雲函数',
    chunks: ['chunk-vendors', 'chunk-common', 'CM']
  },
  'CDN-STAT': {
    entry: 'src/views/CDN-STAT/main.js',
    template: 'src/public/index.html',
    filename: 'index.html',
    chunks: ['chunk-vendors', 'chunk-common', 'CDN-STAT']
  },
  CAM: {
    entry: 'src/views/CAM/main.js', // page 的入口
    template: 'src/public/index.html', // 模板来源
    filename: 'index.html', // 在 dist/index.html 的输出
    title: '台富雲-雲服务器', // 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    chunks: ['chunk-vendors', 'chunk-common', 'CAM']
  }, // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk。
  CCN: {
    entry: 'src/views/CCN/main.js',
    template: 'src/public/index.html',
    filename: 'index.html',
    title: '台富雲-雲联网',
    chunks: ['chunk-vendors', 'chunk-common', 'CCN']
  },
  CAP: {
    entry: 'src/views/CAP/main.js',
    template: 'src/public/index.html',
    filename: 'index.html',
    title: '台富雲-验证码',
    chunks: ['chunk-vendors', 'chunk-common', 'CAP']
  },
  DDOS: {
    entry: 'src/views/DDOS/main.js',
    template: 'src/public/index.html',
    filename: 'index.html',
    title: '台富雲-DDoS防护',
    chunks: ['chunk-vendors', 'chunk-common', 'DDOS']
  },
  BILL: {
    entry: 'src/views/BILL/main.js',
    template: 'src/public/index.html',
    filename: 'index.html',
    title: '台富雲-费用中心',
    chunks: ['chunk-vendors', 'chunk-common', 'BILL']
  },
  WAF: {
    entry: 'src/views/WAF/main.js',
    template: 'src/public/index.html',
    filename: 'index.html',
    title: '台富雲-WEB应用防火墙',
    chunks: ['chunk-vendors', 'chunk-common', 'WAF']
  },
  KMS: {
    entry: 'src/views/KMS/main.js',
    template: 'src/public/index.html',
    filename: 'index.html',
    title: '台富雲-密钥管理系统',
    chunks: ['chunk-vendors', 'chunk-common', 'KMS']
  },
  TKE: {
    entry: 'src/views/TKE/main.js', // page 的入口
    template: 'src/public/index.html', // 模板来源
    filename: 'index.html', // 在 dist/index.html 的输出
    title: '台富雲-容器服务', // 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    chunks: ['chunk-vendors', 'chunk-common', 'TKE'] // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk。
  },
  MGC: {
    entry: 'src/views/MGC/main.js', // page 的入口
    template: 'src/public/index.html', // 模板来源
    filename: 'index.html', // 在 dist/index.html 的输出
    title: '台富雲-訊息中心', // 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    chunks: ['chunk-vendors', 'chunk-common', 'MGC'] // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk。
  },
  CSS: {
    entry: 'src/views/CSS/main.js', // page 的入口
    template: 'src/public/index.html', // 模板来源
    filename: 'index.html', // 在 dist/index.html 的输出
    title: '台富雲-雲直播', // 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    chunks: ['chunk-vendors', 'chunk-common', 'CSS'] // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk。
  }
}
let page = {}
let productName = process.argv[3].substring(2)// 获取执行哪个文件
page[productName] = product[productName]

module.exports = {
  transpileDependencies: [
    'vue-echarts',
    'resize-detector',
  ],
  publicPath: './', // 官方要求修改路径在这里做更改，默认是根目录下，可以自行配置
  outputDir: 'dist/' + productName, // 标识是打包哪个文件
  filenameHashing: true, // 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希。
  pages: page,
  productionSourceMap: false, // 生产环境 sourceMap
  lintOnSave: false,      // 禁用eslint
  devServer: {
    open: true, // 项目构建成功之后，自动弹出页面
    host: '0.0.0.0', // 主机名，也可以127.0.0.0 || 做真机测试时候0.0.0.0
    port: 8081, // 端口号，默认8080
    https: false, // 协议
    hotOnly: false // 没啥效果，热模块，webpack已经做好了
  },
  chainWebpack: config => {
    config.performance
      .maxEntrypointSize(40000000)
      .maxAssetSize(40000000)
  }
}
