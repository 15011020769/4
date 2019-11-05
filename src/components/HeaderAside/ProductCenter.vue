<template>
  <div>
    <!-- 导航详情栏 -->
    <div class="pro-box">
      <div class="nav-main">
        <el-autocomplete popper-class="my-autocomplete"
          v-model="state"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          @select="handleSelect">
          <i class="el-icon-edit el-input__icon"
            slot="suffix"
            @click="handleIconClick">
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
                <a @click="go('cvm')">云服务器 CVM</a>
              </li>
              <li>
                <a @click="go('cbs')">云硬盘 CBS</a>
              </li>
              <li>
                <a @click="go('as')">弹性伸缩 AS</a>
              </li>
              <li>
                <a @click="go('tke')">容器服务 TKE</a>
              </li>
            </ul>
            <ul>
              <li class="li-title">存储</li>
              <li>
                <a @click="go('cos')">对象存储 COS</a>
              </li>
              <li>
                <a @click="go('cfs')">文件存储 CFS</a>
              </li>
              <li>
                <a @click="go('cls')">日志服务 CLS</a>
              </li>
            </ul>
          </div>
          <div class="box-two">

            <ul>
              <li class="li-title">数据库</li>
              <li>
                <a @click="go('sql')">云数据库MySQL</a>
              </li>
              <li>
                <a @click="go('redis')">云数据库Redis</a>
              </li>
              <li>
                <a @click="go('sqlserver')">云数据库SQLServer</a>
              </li>
              <li>
                <a @click="go('es')">Elasticsearch Service</a>
              </li>
              <li>
                <a @click="go('tdsql')">分布式数据库TDSQL</a>
              </li>
              <li>
                <a @click="go('postsql')">云数据库PostgreSQL</a>
              </li>
              <li>
                <a @click="go('mongodb')">云数据库MongoDB</a>
              </li>
              <li>
                <a @click="go('dts')">数据传输服务DTS</a>
              </li>

            </ul>
          </div>
          <div class="three">

            <ul>
              <li class="li-title">网络</li>
              <li>
                <a @click="go('clb')">负载均衡CLB</a>
              </li>
              <li>
                <a @click="go('vpc')">私有网络VPC</a>
              </li>
              <li>
                <a @click="go('vpn')">VPN连接</a>
              </li>
              <li>
                <a @click="go('nat')">NAT网关</a>
              </li>
              <li>
                <a @click="go('conn')">对等连接PC</a>
              </li>
              <li>
                <a @click="go('dc')">专线接入DC</a>
              </li>
            </ul>
            <ul>
              <li class="li-title">基础通信</li>
              <li>
                <a @click="go('mes')">短信</a>
              </li>
            </ul>

          </div>
          <div class="four">
            <ul>
              <li class="li-title">安全</li>
              <li>
                <a @click="go('ip')">DDoS防护</a>
              </li>
              <li>
                <a @click="go('waf')">网站管家</a>
              </li>
              <li>
                <a @click="go('mirror')">云主机(云镜)</a>
              </li>

            </ul>
            <ul>
              <li class="li-title">CDN与加速</li>
              <li>
                <a @click="go('scd')">静态内容加速SCD</a>
              </li>
              <li>
                <a @click="go('dsa')">动态加速网络DSA</a>
              </li>
              <li>
                <a @click="go('gcd')">海外加速GCD</a>
              </li>
              <li>
                <a @click="go('gaap')">全球应用加速GAAP</a>
              </li>
            </ul>

          </div>
          <div class="five">

            <ul>
              <li class="li-title">互联网中间件</li>

              <li>
                <a @click="go('ckafka')">消息队列CKAFKA</a>
              </li>
            </ul>

            <ul>
              <li class="li-title">视频服务</li>
              <li>
                <a @click="go('vod')">云点播</a>
              </li>
            </ul>

            <ul>
              <li class="li-title">营销风控</li>
              <li>
                <a @click="go('aa')">活动防刷AA</a>
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
  data () {
    return {
      restaurants: [],
      state: ''
    }
  },
  methods: {
    querySearch (queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1
        )
      }
    },
    loadAll () {
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
    handleSelect (item) {
      this.$emit('childByValue', 'ok')
      this.$router.push({
        name: item.url
      })
    },
    handleIconClick (ev) {
      console.log(ev)
    },
    go (url) {
      this.$emit('childByValue', 'ok')
      this.$router.push({
        name: url
      })
    }
  },
  mounted () {
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
  height: 460px;
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

