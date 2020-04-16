<template>
  <div>
    <div class="pro-box">
      <div class="nav-main">
        <div class="box-top">
          <input
            type="text"
            v-model="searchName"
            @input="searchProduct"
            placeholder="通過名稱/關鍵字查找產品（例如：雲伺服器、資料庫等）"
          />
          <i class="el-icon-search"></i>
          <div class="product-ul" v-show="chooseProduct.length !== 0">
            <a
              :href="item.url"
              class="product-li"
              v-for="item in chooseProduct"
              :key="item.name"
              >{{ item.name }}</a
            >
          </div>
        </div>

        <div class="box-content">
          <div class="item">
            <ul>
              <li class="li-title">{{ $t("COM.calculate") }}</li>
              <li class="li-sub" @click="go('../CVM/index.html#/cloudHost')">
                {{ $t("COM.cvm") }}
              </li>
              <li class="li-sub" @click="go('../TKE/index.html#/overview')">
                {{ $t("COM.tke") }}
              </li>
              <li class="li-sub" @click="go('../AS/index.html#/flexGroup')">
                {{ $t("COM.as") }}
              </li>
              <li class="li-sub" @click="go('../SCF/index.html#/overView')">
                {{ $t("COM.scf") }}
              </li>
            </ul>
            <ul>
              <li class="li-title">{{ $t("COM.tool") }}</li>
              <li class="li-sub" @click="go('../CM/index.html#/overview')">
                {{ $t("COM.cm") }}
              </li>
              <li class="li-sub" @click="go('../CLA/index.html#/CloudAudit')">
                {{ $t("COM.cloudAudit") }}
              </li>
              <li class="li-sub" @click="go('../CAM/index.html#/UserListNew')">
                {{ $t("COM.cam") }}
              </li>
            </ul>
            <ul>
              <li class="li-title">{{ $t("COM.server") }}</li>
              <li class="li-sub" @click="go('../VOD/index.html#/overview')">
                {{ $t("COM.vod") }}
              </li>
              <li class="li-sub" @click="go('../CSS/index.html#/overview')">
                {{ $t("COM.live") }}
              </li>
            </ul>
          </div>
          <div class="item">
            <ul>
              <li class="li-title">{{ $t("COM.safe") }}</li>
              <li class="li-sub" @click="go('../HS/index.html#/overview')">
                {{ $t("COM.yunjing") }}
              </li>
              <li class="li-sub" @click="go('../CAP/index.html#/appId')">
                {{ $t("COM.captcha") }}
              </li>
              <li class="li-sub" @click="go('../WAF/index.html#/saveOverView')">
                {{ $t("COM.waf") }}
              </li>
              <li
                class="li-sub"
                @click="go('../DDOS/index.html#/ProtectOverview')"
              >
                {{ $t("COM.ddos") }}
              </li>
              <li
                class="li-sub"
                @click="go('../DDOS/index.html#/IpProfessional')"
              >
                {{ $t("COM.bgp") }}
              </li>
              <li class="li-sub" @click="go('../KMS/index.html#/userKms')">
                {{ $t("COM.kms") }}
              </li>
            </ul>
            <ul>
              <li class="li-title">{{ $t("COM.database") }}</li>
              <li
                class="li-sub"
                @click="go('../MYSQL/index.html#/instancesList')"
              >
                {{ $t("COM.database") }} MySQL
              </li>
              <li
                class="li-sub"
                @click="go('../Redis/index.html#/exampleList')"
              >
                {{ $t("COM.database") }} Redis
              </li>
            </ul>
            <ul>
              <li class="li-title">{{ $t("COM.middleware") }}</li>
              <li class="li-sub" @click="go('../CKafka/index.html#/ckafka')">
                {{ $t("COM.ckafka") }}
              </li>
            </ul>
          </div>
          <div class="item">
            <ul>
              <li class="li-title">{{ $t("COM.net") }}</li>
              <li class="li-sub" @click="go('../CLB/index.html#/LB')">
                {{ $t("COM.clb") }}
              </li>
              <li class="li-sub" @click="go('../DC/index.html#/lineAisle')">
                {{ $t("COM.dc") }}
              </li>
              <li class="li-sub" @click="go('../VPC/index.html#/priNetwork')">
                {{ $t("COM.vpc") }}
              </li>
              <li class="li-sub" @click="go('../VPC/index.html#/elaCard')">
                {{ $t("COM.eni") }}
              </li>
              <li class="li-sub" @click="go('../VPC/index.html#/natGateway')">
                {{ $t("COM.nat") }}
              </li>
              <li class="li-sub" @click="go('../VPC/index.html#/vpnGateway')">
                {{ $t("COM.vpn") }}
              </li>
              <li class="li-sub" @click="go('../CVM/index.html#/elasticityIp')">
                {{ $t("COM.eip") }}
              </li>
              <li class="li-sub" @click="go('../CCN/index.html#/ccnPage')">
                {{ $t("COM.ccn") }}
              </li>
            </ul>
            <ul>
              <li class="li-title">{{ $t("COM.cosTitle") }}</li>
              <li class="li-sub" @click="go('../CVM/index.html#/cloudDisk')">
                {{ $t("COM.cbs") }}
              </li>
              <li class="li-sub" @click="go('../COS/index.html#/bucket')">
                {{ $t("COM.cos") }}
              </li>
            </ul>
          </div>
          <div class="item">
            <ul>
              <li class="li-title">{{ $t("COM.cdnTitle") }}</li>
              <!-- <li @click="testFun">{{$t("COM.cdn")}}</li> -->
              <li class="li-sub" @click="go('../CDN/index.html#/domainMan')">
                {{ $t("COM.cdn") }}
              </li>
              <li class="li-sub" @click="go('../DSA/index.html#/overview')">
                {{ $t("COM.dsa") }}
              </li>
              <li class="li-sub" @click="go('../GAAP/index.html#/joinMan')">
                {{ $t("COM.gaap") }}
              </li>
            </ul>
            <ul>
              <li class="li-title">{{ $t("COM.pro") }}</li>
              <li class="li-sub" @click="go('../PRO/index.html#/proManage')">
                {{ $t("COM.pro") }}
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
      state: '',
      searchName: '', // 搜索的关键字
      chooseProduct: [], // 选择的产品对象
      productArr: [
        { // 产品对象
          name: '雲伺服器 CVM',
          url: '../CVM/index.html#/cloudHost'
        }, {
          name: '容器服務 TKE',
          url: '../TKE/index.html#/overview'
        }, {
          name: '彈性伸縮 AS',
          url: '../AS/index.html#/flexGroup'
        }, {
          name: '雲函數 SCF',
          url: '../SCF/index.html#/overView'
        }, {
          name: '雲監控 CM',
          url: '../CM/index.html#/overview'
        }, {
          name: '雲審計 CloudAudit',
          url: '../CLA/index.html#/CloudAudit'
        }, {
          name: '訪問管理 CAM',
          url: '../CAM/index.html#/UserGroup'
        }, {
          name: '雲點播 VOD',
          url: '../COD/index.html#/overview'
        }, {
          name: '雲直播 CSS',
          url: '../CSS/index.html#/overview'
        }, {
          name: '主機安全 CWP',
          url: '../HS/index.html#/overview'
        }, {
          name: '驗證碼 Captcha',
          url: '../CAP/index.html#/appId'
        }, {
          name: 'Web應用防火牆',
          url: '../WAF/index.html#/saveOverView'
        }, {
          name: 'DDoS 基礎防護',
          url: '../DDOS/index.html#/ProtectOverview'
        }, {
          name: 'DDoS 高防IP專業版',
          url: '../DDOS/index.html#/IpProfessional'
        }, {
          name: '金鑰管理服務 KMS',
          url: '../KMS/index.html#/userKms'
        }, {
          name: '雲資料庫 Mysql',
          url: '../MYSQL/index.html#/instancesList'
        }, {
          name: '雲資料庫 Redis',
          url: '../Redis/index.html#/exampleList'
        }, {
          name: '訊息服務 CKafka',
          url: '../CKafka/index.html#/ckafka'
        }, {
          name: '負載均衡 CLB',
          url: '../CLB/index.html#/LB'
        }, {
          name: '專線接入 DC',
          url: '../DC/index.html#/lineAisle'
        }, {
          name: '私有網路 VPC',
          url: '../VPC/index.html#/priNetwork'
        }, {
          name: '彈性網路介面 ENI',
          url: '../VPC/index.html#/elaCard'
        }, {
          name: 'NAT閘道',
          url: '../VPC/index.html#/natGateway'
        }, {
          name: 'VPN連接',
          url: '../VPC/index.html#/vpnGateway'
        }, {
          name: '彈性公網IP',
          url: '../CVM/index.html#/elasticityIp'
        }, {
          name: '雲聯網 CCN',
          url: '../CCN/index.html#/ccnPage'
        }, {
          name: '雲硬碟 CBS',
          url: '../CVM/index.html#/cloudDisk'
        }, {
          name: '物件儲存 COS',
          url: '../COS/index.html#/bucket'
        }, {
          name: '內容傳遞網路 CDN',
          url: '../CDN/index.html#/domainMan'
        }, {
          name: '動態加速 DSA',
          url: '../DSA/index.html#/overview'
        }, {
          name: '全球應用加速 GAAP',
          url: '../GAAP/index.html#/joinMan'
        }, {
          name: '專案管理',
          url: '../PRO/index.html'
        }
      ]
    }
  },
  methods: {

    // 搜索输入框变化时触发的函数
    searchProduct () {
      console.log(this.searchName)
      this.chooseProduct = []
      for (var i = 0; i < this.productArr.length; i++) {
        if (this.productArr[i].name.lastIndexOf(this.searchName) !== -1) {
          this.chooseProduct.push(this.productArr[i])
        }
      }
      if (this.searchName === '' || this.searchName === null || this.searchName === undefined) {
        this.chooseProduct = []
      }
    },

    go (url) {
      window.location.href = url
    },

    testFun () {
      // 内测中，敬请期待！
      this.$message('內測中，敬請期待！')
    }
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
    position: relative;

    input {
      box-sizing: border-box;
      width: 550px;
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
      top: 0;
    }
    .product-ul {
      position: absolute;
      top: 33px;
      width: 550px;
      background-color: #262626;
      border: 1px solid #525151;
      font-size: 12px;
      color: #747474;
      max-height: 300px;
      overflow-y: scroll;
      .product-li {
        height: 35px;
        line-height: 35px;
        border-bottom: 1px solid #646363;
        padding-left: 10px;
        display: block;
        &:last-child {
          border-bottom: 0 solid #646363;
        }
      }
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
          cursor: pointer;
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

        .li-sub {
          color: #3d91ff !important;
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
