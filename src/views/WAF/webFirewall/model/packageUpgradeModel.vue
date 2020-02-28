<template>
  <div>
    <div>
      <el-dialog
        :title="t('Web应用防火墙套餐升级', 'WAF.wafupgrade')"
        :visible.sync="packageUpModelShow"
        width="45%"
        :before-close="handleClose">
        <div>
          <div class="newClear packageType">
            <div class="packpageLabel">{{t('套餐类型', 'WAF.tclx')}}</div>
            <div>
              <el-button-group>
                <el-button class="packageTypeBtn" v-if="package.Level < 3" @click="checkType(3)" :class="type === 3 ?'addBoderC':''">企业版</el-button>
                <el-button class="packageTypeBtn" v-if="package.Level < 4" @click="checkType(4)" :class="type === 4 ?'addBoderC':''">旗舰版</el-button>
              </el-button-group>
              <p class="orangeTip">{{t('基于AI + 规则双引擎防护；', 'WAF.ttjyaijgz1')}}</p>
              <div v-if="type === 3">
                <p class="pList">{{t('包含高级版所有功能；', 'WAF.tt1')}}</p>
                <p class="pList">{{t('支持链路劫持检测（5个）；', 'WAF.tt12')}}</p>
                <p class="pList">{{t('支持高级BOT行为管理；', 'WAF.tt13')}}</p>
                <p class="pList">{{t('支持非标准端口（不限于80,8080,443，8443）定制（10个）；', 'WAF.tt14')}}</p>
                <p class="pList">{{t('支持HTTP协议级别自定义规则；', 'WAF.tt15')}}</p>
                <p class="pList">{{t('独享IP防护；', 'WAF.tt16')}}</p>
                <p class="pList">{{t('支持防御规则优化专家服务；', 'WAF.tt17')}}</p>
                <p class="pList">{{t('支持1对1售前售后支持；', 'WAF.tt18')}}</p>
                <p class="pList">{{t('正常业务请求QPS:5000；', 'WAF.tt19')}}</p>
                <p class="pList">{{t('CC防护峰值QPS:150000；', 'WAF.tt110')}}</p>
                <p class="pList">{{t('支持一级域名个数:3；', 'WAF.tt111')}}</p>
                <p class="pList">{{t('支持二级域名个数:30；', 'WAF.tt112')}}</p>
              </div>
              <div v-if="type === 4">
                <p class="pList">{{t('包含企业版所有功能；', 'WAF.tt2')}}</p>
                <p class="pList">{{t('支持链路劫持检测（10个）；', 'WAF.tt21')}}</p>
                <p class="pList">{{t('支持高级BOT行为管理；', 'WAF.tt22')}}</p>
                <p class="pList">{{t('支持非标准端口（不限于80,8080,443，8443）定制（20个）；', 'WAF.tt23')}}</p>
                <p class="pList">{{t('支持泛域名定制；', 'WAF.tt24')}}</p>
                <p class="pList">{{t('独享IP防护；', 'WAF.tt25')}}</p>
                <p class="pList">{{t('支持1对1售前售后支持；', 'WAF.tt26')}}</p>
                <p class="pList">{{t('正常业务请求QPS:10000；', 'WAF.tt27')}}</p>
                <p class="pList">{{t('CC防护峰值QPS:500000；', 'WAF.tt28')}}</p>
                <p class="pList">{{t('支持一级域名个数:4；', 'WAF.tt29')}}</p>
                <p class="pList">{{t('支持二级域名个数:40；', 'WAF.tt210')}}</p>
              </div>
            </div>
          </div>
          <div class="newClear packageType">
            <div class="packpageLabel">
              {{t('费用', 'WAF.fy')}}
            </div>
            <div class="totalMoney">
              <template v-if="loading">计算中...</template>
              <template v-else>NT$ {{price}}</template>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="upgradeImmediately" @click="upgradeImmediately">{{t('立即升级', 'WAF.ljsj')}}</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { DESCRIBE_WAF_PRICE } from '@/constants'
import { CLB_PACKAGE_CFG_TYPES } from '../../constants'
export default {
  props:{
    isShow: Boolean,
    package: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data(){
    return{
      dialogModel: '', // 弹框
      type: '',
      price: 0,
      loading: true,
    }
  },
  watch: {
    isShow(n) {
      if (n) {
        this.type = this.package.Level + 1
        this.queryPrice()
      }
    }
  },
  computed:{
    packageUpModelShow(){
      this.dialogModel = this.isShow;
      return this.isShow;
    }
  },
  methods:{
    queryPrice() {
      this.loading = true
      this.axios.post(DESCRIBE_WAF_PRICE, {
        Version: '2018-01-25',
        ResInfo: [{
          "goodsCategoryId": CLB_PACKAGE_CFG_TYPES[this.package.Level].edit_categoryid,
          "regionId":1,
          "projectId":0,
          "goodsNum":1,
          "payMode":1,
          "platform":1,
          "goodsDetail":{
            "resourceId": this.package.ResourceIds,
            "curDeadline": this.package.ValidTime,
            "oldConfig": {
              "pid": CLB_PACKAGE_CFG_TYPES[this.package.Level].pid, // 1001152,
              "type": CLB_PACKAGE_CFG_TYPES[this.package.Level].key, // "sp_wsm_waf_enterprise_clb",
              [CLB_PACKAGE_CFG_TYPES[this.package.Level].pricetype]: 1
            },
            "newConfig": {
              "pid": CLB_PACKAGE_CFG_TYPES[this.type].pid, // 1001154,
              "type": CLB_PACKAGE_CFG_TYPES[this.type].key, // "sp_wsm_waf_ultimate_clb",
              [CLB_PACKAGE_CFG_TYPES[this.type].pricetype]: 1
            }
          }
        }]
      }).then(resp => {
        this.generalRespHandler(resp, ({ CostInfo }) => {
          this.price = CostInfo[0].RealTotalCost // RealTotalCost
          this.loading = false
        })
      })
    },
    //关闭按钮
    handleClose(){
      this.dialogModel=false;
      this.$emit("packageUpModelClose",this.dialogModel)
    },
    //立即升级按钮
    upgradeImmediately(){
      this.$emit("packageUpModelClose",this.dialogModel)
    },
    checkType(type){
      this.type = type
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  content:'';
  display:block;
  clear:both;
}
::v-deep .el-dialog__title{
  font-size:14px;
  font-weight:600;
}
::v-deep .el-dialog__footer{
  text-align:center;
}

::v-deep button{
  height:30px;
  line-height:30px;
  border-radius: 0;
  border:1px solid #ddd!important;
}
::v-deep button.upgradeImmediately{
  background-color:#ff9700;
  color:#fff;
  border:none;
}
.packageType{
  div:nth-child(1).packpageLabel{
    float:left;
    width:100px;
    color:#999;
    font-size:12px;
  }
  div:nth-child(2){
    float:left;
    width:calc(100% - 100px);
    font-size:12px;
    .packageTypeBtn{
      width:68px;
      padding:0;
      text-align:center;
      margin-right:0;
      font-size:12px;
    }
    .addBoderC{
      border:1px solid #006eff!important;
      color:#006eff;
    }
  }
  .orangeTip{
    color:#FF9D00;
    margin:16px 0;
  }
  p.pList{
    margin-bottom:7px;
  }
  .totalMoney{
    font-size:24px !important;
    color:#ff7800;
  }
}
</style>