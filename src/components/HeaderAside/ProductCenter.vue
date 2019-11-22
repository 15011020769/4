<template>
  <div>
    <div class="pro-box">
      <div class="nav-main">
        <div class="box-top">
          <input type="text" placeholder="通過名稱/關鍵字查找產品（例如：雲伺服器、資料庫等）">
          <i class="el-icon-search"></i>
        </div>

        <div class="box-content">
          <div class="item">
            <ul>
              <li class="li-title">{{$t("COM.COM.calculate")}}</li>
              <li @click="go('../CVM/index.html#/cloudHost')">{{$t("COM.COM.cvm")}}</li>
              <li @click="go('../CVM/index.html#/cloudDisk')">{{$t("COM.COM.cbs")}}</li>
              <li @click="go('../TKE/index.html#/overview')">{{$t("COM.COM.as")}}</li>
              <li @click="go('../AS/index.html#/flexGroup')">{{$t("COM.COM.tke")}}</li>
            </ul>
            <ul>
              <li class="li-title">{{$t("COM.COM.tool")}}</li>
              <li @click="go('cm')">{{$t("COM.COM.cm")}}</li>
              <li>{{$t("COM.COM.cloudAudit")}}</li>
              <li>{{$t("COM.COM.cam")}}</li>
            </ul>
            <ul>
              <li class="li-title">{{$t("COM.COM.server")}}</li>
              <li @click="go('vod')">{{$t("COM.COM.vod")}}</li>
              <li>{{$t("COM.COM.live")}}</li>
            </ul>
          </div>
          <div class="item">
            <ul>
              <li class="li-title">{{$t("COM.COM.safe")}}</li>
              <li @click="go('cm')">{{$t("COM.COM.yunjing")}}</li>
              <li @click="go('ip')">{{$t("COM.COM.ddos")}}</li>
              <li>{{$t("COM.COM.waf")}}</li>
              <li>{{$t("COM.COM.bgp")}}</li>
              <li>{{$t("COM.COM.kms")}}</li>
            </ul>
            <ul>
              <li class="li-title">{{$t("COM.COM.database")}}</li>
              <li @click="go('../MYSQL/index.html#/instancesList')">{{$t("COM.COM.database")}}MySQL</li>
              <li @click="go('../Redis/index.html#/exampleList')">{{$t("COM.COM.database")}}Redis</li>
            </ul>
            <ul>
              <li class="li-title">{{$t("COM.COM.middleware")}}</li>
              <li @click="go('ckafka')">{{$t("COM.COM.ckafka")}}</li>
            </ul>
          </div>
          <div class="item">
            <ul>
              <li class="li-title">{{$t("COM.COM.net")}}</li>
              <li @click="go('../CLB/index.html#/LB')">{{$t("COM.COM.clb")}}</li>
              <li @click="go('../DC/index.html#/lineAisle')">{{$t("COM.COM.dc")}}</li>
              <li @click="go('../VPC/index.html#/priNetwork')">{{$t("COM.COM.vpc")}}</li>
              <li @click="go('../VPC/index.html#/elaCard')">{{$t("COM.COM.eni")}}</li>
              <li @click="go('../VPC/index.html#/natGateway')">{{$t("COM.COM.nat")}}</li>
              <li @click="go('../VPC/index.html#/vpnGateway')">{{$t("COM.COM.vpn")}}</li>
              <li @click="go('../CVM/index.html#/elasticityIp')">{{$t("COM.COM.eip")}}</li>
              <li @click="go('../CCN/index.html#/ccnPage')">{{$t("COM.COM.ccn")}}</li>
            </ul>
            <ul>
              <li class="li-title">{{$t("COM.COM.cosTitle")}}</li>
              <li @click="go('cos')">{{$t("COM.COM.cos")}}</li>
            </ul>
          </div>
          <div class="item">
            <ul>
              <li class="li-title">{{$t("COM.COM.cdnTitle")}}</li>
              <li @click="go('cdn')">CDN</li>
              <li @click="go('dsa')">{{$t("COM.COM.dsa")}}</li>
              <li @click="go('gaap')">{{$t("COM.COM.gaap")}}</li>
            </ul>
            <ul>
              <li class="li-title">Serveless</li>
              <li>{{$t("COM.COM.scf")}}</li>
            </ul>
            <ul>
              <li class="li-title">{{$t("COM.COM.pro")}}</li>
              <li>{{$t("COM.COM.pro")}}</li>
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
.pro-box {
  padding: 44px 50px;
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
  .box-top {
    text-align: left;
    font-size: 14px;
    input {
      box-sizing: border-box;
      width: 70%;
      height: 28px;
      line-height: 28px;
      border: 1px solid #484848;
      background-color: #2c303a;
      outline: 0;
      color: #fff;
      padding-left: 10px;
    }

    .el-icon-search {
      position: absolute;
      height: 28px;
      width: 28px;
      line-height: 26px;
      padding-left: 5px;
      border: 1px solid #484848;
      border-left: none;
      top: 44px;
    }
  }
  .box-content {
    display: flex;
    margin-top: 40px;
    .item {
      width: 180px;
      float: left;
      ul {
        margin-bottom: 20px;
        li:not(:first-child) {
          text-align: left;
          font-size: 12px;
          line-height: 25px;
          color: #888;
        }
        .li-title {
          font-size: 14px;
          color: rgb(238, 227, 227);
          /* font-weight: 500; */
          padding-bottom: 5px;
          cursor: default;
          line-height: 20px;
          text-align: left;
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

