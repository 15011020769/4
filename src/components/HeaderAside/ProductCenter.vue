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
              <li @click="go('../CVM/index.html#/cloudHost')">云服务器 CVM</li>
              <li @click="go('../CVM/index.html#/cloudDisk')">云硬盘 CBS</li>
              <li @click="go('../TKE/index.html#/overview')">弹性伸缩 AS</li>
              <li @click="go('../AS/index.html#/flexGroup')">容器服务 TKE</li>
            </ul>
            <ul>
              <li class="li-title">管理工具</li>
              <li @click="go('cm')">云监控 CM</li>
              <li>云审计</li>
              <li>访问管理</li>
            </ul>
          </div>
          <div class="box-two">
            <ul>
              <li class="li-title">数据库</li>
              <li @click="go('../MYSQL/index.html#/instancesList')">云数据库MySQL</li>
              <li @click="go('../Redis/index.html#/exampleList')">云数据库Redis</li>
            </ul>
            <ul>
              <li class="li-title">安全</li>
              <li @click="go('cm')">主机安全(云镜)</li>
              <li @click="go('ip')">DDoS 基础防护</li>
              <li>Web 应用防火墙</li>
              <li>高防IP专业版</li>
              <li>密钥管理服务 KMS</li>
            </ul>
          </div>
          <div class="three">
            <ul>
              <li class="li-title">网络</li>
              <li @click="go('../CLB/index.html#/LB')">负载均衡CLB</li>
              <li @click="go('../DC/index.html#/lineAisle')">专线接入 DC</li>
              <li @click="go('../VPC/index.html#/priNetwork')">私有网络 VPC</li>
              <li @click="go('../VPC/index.html#/elaCard')">弹性网卡 ENI</li>
              <li @click="go('../VPC/index.html#/natGateway')">NAT网关</li>
              <li @click="go('../VPC/index.html#/vpnGateway')">VPN连接</li>
              <li @click="go('../CVM/index.html#/elasticityIp')">弹性公网IP</li>
              <li @click="go('../CCN/index.html#/ccnPage')">云联网 CCN</li>
            </ul>
          </div>
          <div class="four">
            <ul>
              <li class="li-title">CDN与加速</li>
              <li @click="go('cdn')">内容分发网络 CDN</li>
              <li @click="go('dsa')">动态加速 DSA</li>
              <li @click="go('gaap')">全球应用加速 GAAP</li>
            </ul>
            <ul>
              <li class="li-title">视频服务</li>
              <li @click="go('vod')">云点播 VOD</li>
              <li>云直播</li>
            </ul>
          </div>
          <div class="five">
            <ul>
              <li class="li-title">互联网中间件</li>
              <li @click="go('ckafka')">消息服务 ckafka</li>
            </ul>
            <ul>
              <li class="li-title">存储</li>
              <li @click="go('cos')">对象存储 COS</li>
            </ul>
            <ul>
              <li class="li-title">Serveless</li>
              <li>云函数 SCF</li>
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
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
        )
      }
    },
    loadAll() {
      return [
        {
          value: '云服务器 CVM',
          url: 'cvm'
        },
        {
          value: '云硬盘 CBS',
          url: 'cbs'
        },
        {
          value: '弹性伸缩 AS',
          url: 'as'
        },
        {
          value: '容器服务 TKE',
          url: 'tke'
        },
        {
          value: '对象存储 COS',
          url: 'cos'
        },
        {
          value: '文件存储 CFS',
          url: 'cfs'
        },
        {
          value: '日志服务 CLS',
          url: 'cls'
        },
        {
          value: '云数据库MySQL',
          url: 'sql'
        },

        {
          value: '云数据库Redis',
          url: 'redis'
        },

        {
          value: '云数据库SQLServer',
          url: 'sqlserver'
        },

        {
          value: 'Elasticsearch Service',
          url: 'es'
        },

        {
          value: '分布式数据库TDSQL',
          url: 'tdsql'
        },

        {
          value: '云数据库PostgreSQL',
          url: 'postsql'
        },

        {
          value: '云数据库MongoDB',
          url: 'mongodb'
        },

        {
          value: '数据传输服务DTS',
          url: 'dts'
        },

        {
          value: '负载均衡CLB',
          url: 'clb'
        },

        {
          value: '私有网络VPC',
          url: 'vpc'
        },

        {
          value: 'VPN连接',
          url: 'vpn'
        },

        {
          value: 'NAT网关',
          url: 'nat'
        },

        {
          value: '对等连接PC',
          url: 'conn'
        },

        {
          value: '专线接入DC',
          url: 'dc'
        },

        {
          value: '短信',
          url: 'mes'
        },

        {
          value: 'DDoS防护',
          url: 'ip'
        },

        {
          value: '网站管家',
          url: 'waf'
        },

        {
          value: '云主机(云镜)',
          url: 'mirror'
        },

        {
          value: '静态内容加速SCD',
          url: 'scd'
        },

        {
          value: '动态加速网络DSA',
          url: 'dsa'
        },

        {
          value: '海外加速GCD',
          url: 'gcd'
        },

        {
          value: '全球应用加速GAAP',
          url: 'gaap'
        },

        {
          value: '消息队列CKAFKA',
          url: 'ckafka'
        },

        {
          value: '云点播',
          url: 'vod'
        },

        {
          value: '活动防刷AA',
          url: 'aa'
        }
      ]
    },
    handleSelect(item) {
      this.$emit('childByValue', 'ok')
      this.$router.push({
        name: item.url
      })
    },
    handleIconClick(ev) {
      console.log(ev)
    },
    go(url) {
      this.$emit('childByValue', 'ok')
      window.location.href = url
    }
  },
  mounted() {
    this.restaurants = this.loadAll()
  }
}
</script>
<style lang="scss" scoped>
.pro-box{
 border:  1px solid #e7e7e7;
}
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

.box-content {
  display: flex;
  div {
    padding: 0 60px;
    ul {
      .li-title {
        font-size: 16px;
        margin: 15px 0;
        font-weight: bold;
        &:hover {
          color: #000000;
        }
      }
      li {
        text-align: left;
        height: 30px;
        line-height: 30px;
        cursor: pointer;
        color: #000000;
        &:hover {
          color: #3e8ef7;
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

