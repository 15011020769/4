let product = {
  CVM: {
    entry: 'src/views/CVM/main.js', // page 的入口
    template: 'src/public/index.html', // 模板来源
    filename: 'index.html', // 在 dist/index.html 的输出
    title: '台富云-云服务器', // 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    chunks: ['chunk-vendors', 'chunk-common', 'CVM'] // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk。
  },
  MySQL: {
    entry: 'src/views/MySQL/main.js',
    template: 'src/public/index.html',
    filename: 'index.html',
    title: '台富云-关系型数据库',
    chunks: ['chunk-vendors', 'chunk-common', 'MySQL']
  },
  SCF: {
    entry: 'src/views/SCF/main.js', // page 的入口
    template: 'src/public/index.html', // 模板来源
    filename: 'index.html', // 在 dist/index.html 的输出
    title: '台富云-云函数', // 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    chunks: ['chunk-vendors', 'chunk-common', 'SCF'] // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk。
  },
  CLA: {
    entry: 'src/views/CLA/main.js',
    template: 'src/public/index.html',
    filename: 'index.html',
    title: '台富云-云审计',
    chunks: ['chunk-vendors', 'chunk-common', 'CLA']
  },
  CM: {
    entry: 'src/views/CM/main.js',
    template: 'src/public/index.html',
    filename: 'index.html',
    title: '台富云-云函数',
    chunks: ['chunk-vendors', 'chunk-common', 'CM']
  },
  CAM: {
    entry: 'src/views/CAM/main.js', // page 的入口
    template: 'src/public/index.html', // 模板来源
    filename: 'index.html', // 在 dist/index.html 的输出
    title: '台富云-云服务器', // 当使用 title 选项时，template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    chunks: ['chunk-vendors', 'chunk-common', 'CAM']
  }, // 在这个页面中包含的块，默认情况下会包含,提取出来的通用 chunk 和 vendor chunk。
  CCN: {
    entry: 'src/views/CCN/main.js',
    template: 'src/public/index.html',
    filename: 'index.html',
    title: '台富云-云联网',
    chunks: ['chunk-vendors', 'chunk-common', 'CCN']
  },
  CAP: {
    entry: 'src/views/CAP/main.js',
    template: 'src/public/index.html',
    filename: 'index.html',
    title: '台富云-验证码',
    chunks: ['chunk-vendors', 'chunk-common', 'CAP']
  },
  DDOS: {
    entry: 'src/views/DDOS/main.js',
    template: 'src/public/index.html',
    filename: 'index.html',
    title: '台富云-DDoS防护',
    chunks: ['chunk-vendors', 'chunk-common', 'DDOS']
  },
  BILL: {
    entry: 'src/views/BILL/main.js',
    template: 'src/public/index.html',
    filename: 'index.html',
    title: '台富云-费用中心',
    chunks: ['chunk-vendors', 'chunk-common', 'BILL']
  },
  WAF: {
    entry: 'src/views/WAF/main.js',
    template: 'src/public/index.html',
    filename: 'index.html',
    title: '台富云-WEB应用防火墙',
    chunks: ['chunk-vendors', 'chunk-common', 'WAF']
  }
}
let page = {}
let productName = process.argv[3].substring(2)// 获取执行哪个文件
page[productName] = product[productName]

module.exports = {
  publicPath: './', // 官方要求修改路径在这里做更改，默认是根目录下，可以自行配置
  outputDir: 'dist/' + productName, // 标识是打包哪个文件
  filenameHashing: true, // 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希。
  pages: page,
  productionSourceMap: false, // 生产环境 sourceMap
  devServer: {
    open: true, // 项目构建成功之后，自动弹出页面
    host: 'localhost', // 主机名，也可以127.0.0.0 || 做真机测试时候0.0.0.0
    port: 8081, // 端口号，默认8080
    https: false, // 协议
    hotOnly: false // 没啥效果，热模块，webpack已经做好了
  }
}
