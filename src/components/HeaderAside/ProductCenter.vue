<template>
  <div>
    <!-- 导航详情栏 -->
    <div class="pro-box">
      <div class="nav-main">
        <el-autocomplete popper-class="my-autocomplete" v-model="state" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect">
          <i class="el-icon-edit el-input__icon" slot="suffix" @click="handleIconClick">
          </i>
          <template slot-scope="{ item }">
            <div class="name"><a @click="go(item.url)">{{ item.value }}</a></div>

          </template>
        </el-autocomplete>

        <div class="box-content">
          <div class="box-one">

            <ul>
              <li class="li-title">计算</li>
              <li>
                <router-link to='/cvm'>云服务器</router-link>
              </li>
              <li>
                <router-link to='/cbs'>云硬盘</router-link>
              </li>
              <li>
                <router-link to='/tke'>容器服务</router-link>
              </li>
              <li>
                <router-link to='/as'>弹性伸缩</router-link>
              </li>
            </ul>
            <ul>
              <li class="li-title">存储</li>
              <li>
                <router-link to='/cos'>对象存储</router-link>
              </li>
            </ul>
          </div>
          <div class="box-two">

            <ul>
              <li class="li-title">数据库</li>
              <li>
                <router-link to='/sql'>Mysql</router-link>
              </li>
              <li>
                <router-link to='/redis'>Redis</router-link>
              </li>

            </ul>
          </div>
          <div class="three">

            <ul>
              <li class="li-title">网络</li>
              <li>
                <router-link to='/clb'>负载均衡</router-link>
              </li>
              <li>
                <router-link to='/dc'>专线接入</router-link>
              </li>
              <li>
                <router-link to='/vpc'>私有网络</router-link>
              </li>
              <li>
                <router-link to='/'>弹性网卡</router-link>
              </li>
              <li>
                <router-link to='/nat'>NAT 网关</router-link>
              </li>
              <li>
                <router-link to='/vpn'>VPN 连接</router-link>
              </li>
              <li>
                <router-link to='/'>弹性公网IP</router-link>
              </li>
              <li>
                <router-link to='/ccn'>云联网</router-link>
              </li>
              <li>
                <router-link to='/aia'>Anycast 公网加速</router-link>
              </li>
            </ul>
            <ul>
              <li class="li-title">Serveless</li>
              <li>
                <router-link to='/scf'>云函数</router-link>
              </li>
            </ul>

          </div>
          <div class="four">
            <ul>
              <li class="li-title">安全</li>
              <li>
                <router-link to='/cm'>主机安全（云镜）</router-link>
              </li>
              <li>
                <router-link to='/'>主验证码服务</router-link>
              </li>
              <li>
                <router-link to='/ip'>DDoS 基础防护</router-link>
              </li>
              <li>
                <router-link to='/'>Web 应用防火墙</router-link>
              </li>
              <li>
                <router-link to='/'>高防IP专业版</router-link>
              </li>
              <li>
                <router-link to='/'>密钥管理服务</router-link>
              </li>
            </ul>
            <ul>
              <li class="li-title">CDN与加速</li>
              <li>
                <router-link to='/cdn'>内容分发网络CDN</router-link>
              </li>
              <li>
                <router-link to='/dsa'>动态加速</router-link>
              </li>
              <li>
                <router-link to='/gaap'>全球应用加速</router-link>
              </li>
            </ul>

          </div>
          <div class="five">

            <ul>
              <li class="li-title">互联网中间件</li>
              <li>
                <router-link to='/ckafka'>消息服务ckafka</router-link>
              </li>
            </ul>

            <ul>
              <li class="li-title">视频服务</li>
              <li>
                <router-link to='/vod'>云点播</router-link>
              </li>
              <li>
                <router-link to='/'>云直播</router-link>
              </li>
            </ul>

            <ul>
              <li class="li-title">管理工具</li>
              <li>
                <router-link to='/cm'>云监控</router-link>
              </li>
              <li>
                <router-link to='/'>云审计</router-link>
              </li>
              <li>
                <router-link to='/'>访问管理</router-link>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      restaurants: [],
      state: ''
    }
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    loadAll() {
      return [
        {
          value: '云服务器',
          url: '/product/CVM/index.html#/cloudHost'
        },
        { value: '容器服务', url: '/product/TKE/index.html#/overview' },
        { value: '弹性伸缩', url: '/product/AS/index.html#/flexGroup' },
        { value: '对象存储', url: '/product/COS/index.html#/overview' },
        {
          value: '文件存储',
          url: '/product/CFS/index.html#/fileSystem'
        },
        { value: '日志服务', url: '/product/CLS/index.html#/overView' },
        {
          value: 'Mysql',
          url: '/product/MYSQL/index.html#/instancesList'
        },
        {
          value: 'Sqlserver',
          url: '/product/SQLServer/index.html#/serverList'
        },
        {
          value: 'Postgresql',
          url: '/product/PostgreSQL/index.html#/postgreList'
        },
        { value: 'DCDB', url: '/product/DCDB/index.html#/exampleList' },
        { value: 'Redis', url: '/product/Redis/index.html#/exampleList' },
        { value: 'MongoDB', url: '/product/mongoDB/index.html#/copyList' },
        { value: '数据传输服务', url: '/product/DTS/index.html#/overview' },
        { value: '负载均衡', url: '/product/CLB/index.html#/LB' },
        {
          value: '私有网络',
          url: '/product/VPC/index.html#/priNetwork'
        },
        { value: '专线接入', url: '/product/DC/index.html#/lineAisle' },
        { value: '消息服务CMQ', url: '/product/CMQ/index.html#/queue' },
        { value: '消息服务ckafka', url: '/product/CKafka/index.html#/ckafka' },
        { value: '点播', url: '/product/VOD/index.html#/overview' },
        { value: '短信', url: '/product/message/index.html#/message' },
        {
          value: '主机安全（云镜）',
          url: '/product/CM/index.html#/overview'
        },
        { value: '天御活动防刷', url: '/product/tianyu/index.html#/tianyu' },
        {
          value: 'BGP高防IP（属于DDos防护）',
          url: '/product/DDoS/index.html#/defend_ip'
        },
        {
          value: 'WEB防火墙（原网站管家）',
          url: '/product/WAF/index.html#/nodata'
        },
        {
          value: '云监控',
          url: '/product/cloudMonitor/index.html#/cloudServer'
        },
        { value: 'Elasticsearch Service', url: '/product/ES/#/index' },
        { value: 'CDN', url: '/product/CDN/index.html#/domainMan' },
        { value: '海外加速', url: '/product/HWCDN/index.html#/overview' },
        { value: '动态加速', url: '/product/DSA/index.html#/overview' },
        { value: '全球应用加速', url: '/product/GAAP/index.html#/joinMan' }
      ]
    },
    handleSelect(item) {
      if (this.$cookie.get('userType') === '1') {
        window.location.href = window.SITE_CONFIG['consoleUrl'] + item.url
      } else {
        this.$confirm('您无权查看该链接', '提示', {
          showCancelButton: false,
          showConfirmButton: false,
          type: 'warning',
          center: true
        })
      }
    },
    handleIconClick(ev) {
      console.log(ev)
    },
    go(url) {
      if (this.$cookie.get('userType') === '1') {
        window.location.href = window.SITE_CONFIG['consoleUrl'] + url
      } else {
        this.$confirm('您无权查看该链接', '提示', {
          showCancelButton: false,
          showConfirmButton: false,
          type: 'warning',
          center: true
        })
      }
    }
  },
  mounted() {
    this.restaurants = this.loadAll()
  }
}
</script>
<style lang="scss" scoped>
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
.pro-box {
  height: 526px;
}
.box-content {
  display: flex;
  div {
    padding: 0 60px;
    ul {
      .li-title {
        font-size: 16px;
        margin: 20px 0;
        font-weight: bold;
      }
      li {
        text-align: left;
        height: 30px;
        a {
          cursor: pointer;
          color: #000000;
        }
        a:hover {
          color: #facd02;
        }
      }
    }
  }
}
.el-autocomplete {
  display: block;
  margin: 0 60px;
  margin-top: 10px;
}
</style>

