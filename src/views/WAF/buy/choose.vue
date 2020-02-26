<template>
  <div>
    <div class="topHedaer">
      <div class="mainHedaer">
        Web{{t('应用防火墙', 'WAF.yyfhq')}}
      </div>
    </div>
    <div class="wrapper">
      <div class="wrapperCont">
        <p class="pTip">包年包月</p>
        <div class="chooseList newClear bodertOP">
          <div class="listLabel">地域</div>
          <div class="listCon">
            <el-button class="taibei">{{t('台湾台北', 'WAF.tb')}}</el-button>
          </div>
        </div>
        <div class="chooseList newClear">
          <div class="listLabel">套餐</div>
          <div class="listCon">
            <el-button-group class="btnGroup">
              <el-button @click="taocan(2)" :class="thisType===2?'addColor':''">{{t('高级版', 'WAF.gjb')}}</el-button>
              <el-button @click="taocan(3)" :class="thisType===3?'addColor':''">{{t('企业版', 'WAF.qyb')}}</el-button>
              <el-button @click="taocan(4)" :class="thisType===4?'addColor':''">{{t('旗舰版', 'WAF.qjb')}}</el-button>
            </el-button-group>
            <div v-if="thisType=='1'" class="pList">
              <p class="tipColr">{{t('适用于中小非业务网站的标准防护，', 'WAF.tt0')}}{{t('基于AI + 规则双引擎防护；', 'WAF.ttjyaijgz1')}}</p>
              <p>{{t('支持常见的Web攻击防护，包括SQL注入、XSS、Webshell上传、目录遍历等；', 'WAF.tt01')}}</p>
              <p>{{t('云端自动更新Web 0 day漏洞的防护规则；', 'WAF.tt02')}}</p>
              <p>{{t('支持HTTP(80、8080端口)、HTTPS(443、8443端口)的业务防护；', 'WAF.tt03')}}</p>
              <p>{{t('支持高级CC攻击防护，过滤垃圾访问；', 'WAF.tt04')}}</p>
              <p>{{t('支持网页防篡改，敏感数据防泄漏；', 'WAF.tt05')}}</p>
              <p>{{t('支持按地域细粒度封禁；', 'WAF.tt06')}}</p>
              <p>{{t('正常业务请求QPS:2500；', 'WAF.tt07')}}</p>
              <p>{{t('CC防护峰值QPS:30000；', 'WAF.tt08')}}</p>
              <p>{{t('支持一级域名个数：2；', 'WAF.tt09')}}</p>
              <p>{{t('支持二级域名个数：20；', 'WAF.tt010')}}</p>
              <p>{{t('业务宽带（云外/云内）', 'WAF.ywkp')}}：10Mbps/200Mbps；</p>
            </div>
            <div v-if="thisType=='2'" class="pList">
              <p class="tipColr">{{t('适用于中小型普通业务站点及中大型官网站点定制化防护服务，', 'WAF.syyzxqy')}}{{t('基于AI + 规则双引擎防护；', 'WAF.ttjyaijgz1')}}</p>
              <p>{{t('包含高级版所有功能；', 'WAF.tt1')}}</p>
              <p>{{t('支持链路劫持检测（5个）；', 'WAF.tt12')}}</p>
              <p>{{t('支持高级BOT行为管理；', 'WAF.tt13')}}</p>
              <p>{{t('支持非标准端口（不限于80,8080,443，8443）定制（10个）；', 'WAF.tt14')}}</p>
              <p>{{t('支持HTTP协议级别自定义规则；', 'WAF.tt15')}}</p>
              <p>{{t('独享IP防护；', 'WAF.tt16')}}</p>
              <p>{{t('支持防御规则优化专家服务；', 'WAF.tt17')}}</p>
              <p>{{t('支持1对1售前售后支持；', 'WAF.tt18')}}</p>
              <p>{{t('正常业务请求QPS:5000；', 'WAF.tt19')}}</p>
              <p>{{t('CC防护峰值QPS:150000；', 'WAF.tt110')}}</p>
              <p>{{t('支持一级域名个数:3；', 'WAF.tt111')}}</p>
              <p>{{t('支持二级域名个数:30；', 'WAF.tt112')}}</p>
              <p>{{t('业务宽带（云外/云内）', 'WAF.ywkp')}}：30Mbps/200Mbps；</p>
            </div>
            <div v-if="thisType=='3'" class="pList">
              <p class="tipColr">{{t('适用于大型及超大型业务网站及复杂业务站点定制化防护服务，', 'WAF.syydxjcdxqy')}}{{t('基于AI + 规则双引擎防护；', 'WAF.ttjyaijgz1')}}</p>
              <p>{{t('包含企业版所有功能；', 'WAF.tt2')}}</p>
              <p>{{t('支持链路劫持检测（10个）；', 'WAF.tt21')}}</p>
              <p>{{t('支持高级BOT行为管理；', 'WAF.tt22')}}</p>
              <p>{{t('支持非标准端口（不限于80,8080,443，8443）定制（20个）；', 'WAF.tt23')}}</p>
              <p>{{t('支持泛域名定制；', 'WAF.tt24')}}</p>
              <p>{{t('独享IP防护；', 'WAF.tt25')}}</p>
              <p>{{t('支持1对1售前售后支持；', 'WAF.tt26')}}</p>
              <p>{{t('正常业务请求QPS:10000；', 'WAF.tt27')}}</p>
              <p>{{t('CC防护峰值QPS:500000；', 'WAF.tt28')}}</p>
              <p>{{t('支持一级域名个数:4；', 'WAF.tt29')}}</p>
              <p>{{t('支持二级域名个数:40；', 'WAF.tt210')}}</p>
              <p>{{t('业务宽带（云外/云内）', 'WAF.ywkp')}}：50Mbps/200Mbps；</p>
            </div>
          </div>
        </div>
        <div class="chooseList newClear">
          <div class="listLabel">{{t('扩展域名包', 'WAF.kzymb')}}</div>
          <div class="listCon">
            <el-input-number size="mini" v-model="domainPackageCount" :min="0" :max="500"></el-input-number>
            <p class="Ptext">{{t('每个域名包包含: 10个域名防护，仅支持1个一级域名；一次最多购买500个）', 'WAF.mhymbbh')}}</p>
          </div>
        </div>
        <div class="chooseList newClear">
          <div class="listLabel">{{t('QPS扩展包', 'WAF.qpskzb')}}</div>
          <div class="listCon">
            <el-input-number size="mini" v-model="qpsPackageCount" :min="0" :max="500"></el-input-number>
            <p class="Ptext">{{t('一个QPS扩展包包含：1000QPS（套餐有效期内，一次最多可购买500个）', 'WAF.ygqpskzbbh')}}</p>
          </div>
        </div>
        <div class="chooseList newClear">
          <div class="listLabel">{{t('安全日志服务包', 'WAF.aqrzfwb')}}</div>
          <div class="listCon">
            <el-input-number size="mini" v-model="clsPackageCount" :min="0" :max="500"></el-input-number>
            <p class="Ptext">{{t('一个日志服务包包含：1T日志服务存储容量（套餐有效期内，日志存储时长为180天，一次最多可购买500个）', 'WAF.ygrzbbh')}}</p>
          </div>
        </div>
        <div class="chooseList newClear">
          <div class="borderTop">
            <div class="listLabel">{{t('购买时长', 'WAF.gmsc')}}</div>
            <div class="listCon">
              <el-button-group class="btnGroup">
                <el-button @click="mounth(1)" :class="mounthType===1?'addColor':''">1{{t('个', 'WAF.g')}}月</el-button>
                <el-button @click="mounth(2)" :class="mounthType===2?'addColor':''">2{{t('个', 'WAF.g')}}月</el-button>
                <el-button @click="mounth(3)" :class="mounthType===3?'addColor':''">3{{t('个', 'WAF.g')}}月</el-button>
                <el-button @click="mounth(6)" :class="mounthType===6?'addColor':''">半年</el-button>
                <el-button @click="mounth(12)" :class="mounthType==12?'addColor':''">1年</el-button>
                <el-button @click="mounth(24)" :class="mounthType==24?'addColor':''">2年</el-button>
                <el-button @click="mounth(36)" :class="mounthType==36?'addColor':''">3年</el-button>
              </el-button-group>
            </div>
          </div>
        </div>
        <div class="bottomTotal newClear">
          <p class="totaoLabel">{{t('总计费用', 'WAF.zjfy')}}:</p>
          <p class="totalMoney">
            <span class="money">
              <template v-if="loading">计算中...</template>
              <template v-else>NT$ {{price}}</template>
            </span><br/>
            <el-button size="mini" class="immePay" @click="pay">立即支付</el-button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DESCRIBE_WAF_PRICE } from '@/constants'
import { CLB_PACKAGE_CFG_TYPES, PACKAGE_CFG_TYPES, BUY_LOG_TYPES, CLB_BUY_DOMAIN_TYPES } from '../constants'
export default {
  data(){
    return{
      thisType: 2,//套餐
      domainPackageCount: 1,//扩展域名包
      qpsPackageCount: 0,//QPS扩展包
      clsPackageCount: 0,//安全日志服务包
      mounthType: 1,//购买时长
      loading: true,
      price: 0,
    }
  },
  watch: {
    domainPackageCount() {
      this.queryPrice()
    },
    qpsPackageCount() {
      this.queryPrice()
    },
    clsPackageCount() {
      this.queryPrice()
    },
    mounthType() {
      this.queryPrice()
    },
  },
  mounted() {
    this.queryPrice()
  },
  methods:{
    //套餐选择
    taocan(thisType){
      this.thisType=thisType;
    },
    //购买时长
    mounth(mounthType){
      this.mounthType = mounthType;
    },
    queryPrice() {
      this.axios.post(DESCRIBE_WAF_PRICE, {
        Version: '2018-01-25',
        ResInfo: [{
          goodsCategoryId: PACKAGE_CFG_TYPES[this.thisType].first_categoryid,
          "regionId": 1,
          "projectId": 0,
          "goodsNum": 1,
          "payMode": 1,
          "platform": 1,
          goodsDetail: {
            "timeSpan": this.mounthType,
            "timeUnit": "m",
            "type": 'wsm_waf',
            "pid": 11416, // 1001156,
            [PACKAGE_CFG_TYPES[this.thisType].key]: 1,
          }
        }, 
        {
          goodsCategoryId: CLB_BUY_DOMAIN_TYPES.first_categoryid,
          "regionId": 1,
          "projectId": 0,
          "goodsNum": 1,
          "payMode": 1,
          "platform": 1,
          goodsDetail: {
            "pid": CLB_BUY_DOMAIN_TYPES.pid, // 1001156,
            "timeSpan": this.mounthType,
            "timeUnit": "m",
            [CLB_BUY_DOMAIN_TYPES.pricetype]: this.domainPackageCount,
            "type": CLB_BUY_DOMAIN_TYPES.goodstype,
          }
        }
        ]
      }).then(resp => {
        this.generalRespHandler(resp, ({ RealTotalCost }) => {
          this.price = RealTotalCost
          this.loading = false
        })
      })
    },
    //跳转支付页面
    pay(){
      this.$router.push({
        name:'pay'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  content: "";
  clear:both;
  display:block;
}
.topHedaer{
  width:100%;
  height:62px;
  background-color:#fff;
  margin-bottom: 20px;
  .mainHedaer{
    width:1120px;
    margin:0 auto;
    line-height: 62px;
    font-size:20px;
    font-weight: 600;
    color:#000;
  }
}
.wrapper{
  width:100%;
  .wrapperCont{
    width:1120px;
    margin:0 auto;
    .pTip{
      font-size:14px;
      color:#006eff;
      font-weight:600;
      height:30px;
      line-height: 30px;
      width:100px;
      text-align: center;
      background-color:#fff;
    }
    .chooseList{
      padding:20px;
      background-color:#fff;
    }
    .bodertOP{
      border-top:1px solid #ddd;
    }
    .borderTop{
      border-top:1px solid #ddd;
      padding-top:20px;
    }
    .listLabel{
      float:left;
      width:100px;
      font-size:12px;
      color:#888;
    }
    .listCon{
      float:left;
      width:calc(100% - 100px);
    }
    ::v-deep button{
      height:30px;
      line-height: 30px;
      padding:0 20px;
    }
    .taibei{
      background-color:#d7e6f8;
      color:#6fa4ff;
      border:1px solid #00a4ff;
    }
    .addColor{
      background-color:#d7e6f8;
      color:#6fa4ff;
      border:1px solid #00a4ff;
    }
    .btnGroup{
      ::v-deep button{
        margin-right:0;
        position:relative;
        span.scale{
          position:absolute;
          top:0;
          right:0;
          height:15px;
          line-height: 15px;
          padding:0 3px;
          color:#fff;
          font-size:10px;
          background-color:#ff7300;
        }
      }
    }
    .pList{
      p{
        color:#999;
        line-height: 20px;
      }
      .tipColr{
        color:#ff9d00;
        font-size: 12px;
        line-height: 20px;
      }
    }
    .Ptext{
      color:#999;
      font-size:12px;
      line-height: 20px;
    }
    .bottomTotal{
      width:100%;
      border-top:1px solid #ddd;
      padding:20px 20px 10px 20px;
      box-shadow: inset top 0 0 10px #CCC;
      background-color: #fff;
      margin-bottom:20px;
      .totaoLabel{
        float:left;
        width:105px;
        font-size:12px;
        color:#999;
      }
      .totalMoney{
        float:left;
        width:calc(100%- 105px);
        .money{
          font-size:18px;
          color:#fa7821;
          i{
            font-style: normal;
            font-size: 12px;
          }
        }
        ::v-deep button{
          background-color:#fa7821;
          color:#fff;
          margin-top:12px;
        }
      }
    }
  }
}
::v-deep input{
  height:30px;
  line-height: 20px;
}
</style>