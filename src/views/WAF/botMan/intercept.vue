<template>
  <div>
    <div class="topTitle">
      BOT{{t('管理功能简介', 'WAF.glgnjj')}}
    </div>
    <el-card class="content">
      <p>{{t('目前该功能仅开放给企业版及以上客户，', 'WAF.nqggnjkf')}}<el-button type="text" @click="packageUpModelShow=true">{{t('立即升级', 'WAF.ljsj')}}</el-button></p>
      <p>{{t('台富云Web应用防火墙独家提供基于AI + 规则的BOT程序管理功能，可以应用于以下业务场景。', 'WAF.tfyyyfhq')}}</p>
      <div class="items">
        <h3>{{t('数据泄露', 'WAF.sjxl')}}</h3>
        <p>{{t('恶意BOT所有者通过爬虫抓取并利用站点对外公开数据，如用户数据，商品数据，订单数据等，造成数据泄露风险；', 'WAF.eybot')}}</p>
        <h3>{{t('业务风险', 'WAF.ywfx')}}</h3>
        <p>{{t('恶意爬虫抓取价格，库存信息等，影响营销策略有效性；站点内容被未授权抓取，转载，降低站点内容竞争力；接口烂刷，刷票，羊毛党，短信接口，垃圾注册等带来业务风险；', 'WAF.eypczq')}}</p>
        <h3>{{t('攻击程序', 'WAF.gjcx')}}</h3>
        <p>{{t('黑客利用BOT程序实现撞库攻击，漏洞嗅探，DDoS攻击，CC攻击，发送垃圾邮件等攻击，给业务带来安全威胁；', 'WAF.hklycx')}}</p>
        <h3>{{t('站点负载', 'WAF.zdfz')}}</h3>
        <p>{{t('站点流量30%-70%来自BOT机器人程序，大量的机器人程序流量占用站点负载，影响正常用户的访问速度与体验；', 'WAF.zdll')}}</p>
      </div>
    </el-card>
    <packageUpgradeModel :package="package" :isShow="packageUpModelShow" @packageUpModelClose="packageUpModelClose"/>
  </div>
</template>
<script>
import packageUpgradeModel from '../webFirewall/model/packageUpgradeModel'
import { DESCRIBE_USER_INFO } from '@/constants'
export default {
  data() {
    return {
      packageUpModelShow: false,
      package: {},
    }
  },
  components: {
    packageUpgradeModel:packageUpgradeModel,//升级
  },
  mounted() {
    this.getPackage()
  },
  methods: {
    //升级弹框关闭按钮
    packageUpModelClose(isShow){
      this.packageUpModelShow = isShow
    },
    getPackage() {
      this.axios.post(DESCRIBE_USER_INFO, {
        Version: '2018-01-25'
      }).then(resp => {
        this.generalRespHandler(resp, ({ Data }) => {
          this.package = Data
        })
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.topTitle{
  width:100%;
  height:50px;
  line-height:50px;
  border-bottom:1px solid #ddd;
  padding:0 20px;
  font-size:16px;
  font-weight:600;
  color:#000;
  background-color:#fff;
}
.content {
  margin: 20px 30px;
  font-size: 12px;
  p {
    &:first-of-type {
      margin-bottom: 10px;
    }
    line-height: 25px;
  }
  .items {
    margin-left: 20px;
    h3 {
      margin-top: 15px;
    }
  }
}
</style>