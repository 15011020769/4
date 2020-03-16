<template>
  <div>
    <div>
      <el-dialog
        :title="t('扩展域名包', 'WAF.kzymb')"
        :visible.sync="buyDominPack"
        width="45%"
        :before-close="handleClose">
        <div class="newClear">
          <div class="newClear dominPackList">
            <p>{{t('购买数量', 'WAF.gmsl')}}</p>
            <p>
              <el-input-number v-model="buyNum" :max="500" :min="1"></el-input-number> {{t('个', 'WAF.g')}}
            </p>
          </div>
          <div class="newClear dominPackList">
            <p>{{t('到期时间', 'WAF.dqsj')}}</p>
            <p>{{package.DomainPkg && package.DomainPkg.ValidTime || package.ValidTime}}</p>
          </div>
          <div class="newClear dominPackList">
            <p>{{t('说明', 'WAF.sm')}}</p>
            <p>{{t('每个域名包包含：10个域名防护，仅支持1个一级域名；一次最多购买500个', 'WAF.mhymbbh')}}。</p>
          </div>
          <div class="newClear dominPackList">
            <p>{{t('费用', 'WAF.fy')}}</p>
            <p class="totalMoney">
              <template v-if="loading">计算中...</template>
              <template v-else>NT$ {{cost}}</template>
            </p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="buyImmediate" @click="buyImmediate" :disabled="loading">{{t('立即购买', 'WAF.ljgm')}}</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { DESCRIBE_WAF_PRICE } from '@/constants'
import { CLB_BUY_DOMAIN_TYPES, ORDER_INFO } from '../../constants'
export default {
  props:{
    isShow:Boolean,
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
      buyNum: 1, // 购买数量
      remainingDays: 0, // 剩余天数
      cost: 0,
      loading: true,
      exchange: 0,
    }
  },
  computed:{
    buyDominPack(){
      this.dialogModel = this.isShow;
      return this.isShow;
    }
  },
  watch: {
    buyNum() {
      this.queryPrice()
    },
    isShow(n) {
      if (n) {
        const ValidTime = this.package.ValidTime
        this.remainingDays = Math.ceil(moment(ValidTime).diff(moment(), 'h')/24)
        this.queryPrice()
      }
    },
  },
  methods:{
    queryPrice() {
      if (!this.exchange) {
        this.axios({
          method: 'get',
          baseURL: process.env.VUE_APP_adminUrl,
          url: 'taifucloud/texchangerate/getExchange'
        }).then(({ taxRate, usd2twd, cny2usd }) => {
          this.exchange = taxRate * usd2twd * cny2usd
        })
      }
      this.loading = true
      const resInfo = {
        "regionId": 1,
        "projectId": 0,
        "goodsNum": 1,
        "payMode": 1,
        "platform": 1,
      }
      if (this.package.DomainPkg) {
        // 升级
        resInfo.goodsCategoryId = CLB_BUY_DOMAIN_TYPES.edit_categoryid
        resInfo.goodsDetail = {
          resourceId: this.package.DomainPkg.ResourceIds,
          curDeadline: this.package.DomainPkg.ValidTime,
          oldConfig: {
            pid: CLB_BUY_DOMAIN_TYPES.pid,
            [CLB_BUY_DOMAIN_TYPES.pricetype]: this.package.DomainPkg.Count,
            type: CLB_BUY_DOMAIN_TYPES.goodstype
          },
          newConfig: {
            pid: CLB_BUY_DOMAIN_TYPES.pid,
            [CLB_BUY_DOMAIN_TYPES.pricetype]: this.package.DomainPkg.Count + this.buyNum,
            type: CLB_BUY_DOMAIN_TYPES.goodstype
          }
        }
      } else {
        // 新购
        resInfo.goodsCategoryId = CLB_BUY_DOMAIN_TYPES.first_categoryid
        resInfo.goodsDetail = {
          "pid": CLB_BUY_DOMAIN_TYPES.pid, // 1001156,
          "timeSpan": this.remainingDays,
          "timeUnit": "d",
          [CLB_BUY_DOMAIN_TYPES.pricetype]: this.buyNum,
          "type": CLB_BUY_DOMAIN_TYPES.goodstype,
        }
      }
      this.axios.post(DESCRIBE_WAF_PRICE, {
        Version: '2018-01-25',
        ResInfo: [resInfo]
      }).then(resp => {
        this.generalRespHandler(resp, ({ CostInfo }) => {
          this.cost = CostInfo[0].RealTotalCost // RealTotalCost
          this.loading = false
        })
      })
    },
    //关闭按钮
    handleClose(){
      this.dialogModel=false;
      this.$emit("buyDominPacModelClose",this.dialogModel)
    },
    //立即购买按钮
    buyImmediate(){
      let validTime = this.package.ValidTime
      let d = Math.ceil(moment(validTime).diff(moment(), 'd', true)) // 到期天数
      let time = Math.ceil(moment(this.package.ValidTime).diff(moment(), 'month', true)) // 到期月数
      let time1 = time
      let newEdiPrice
      let curEdiPrice
      let price = `${this.cost / d}/天` // 新购时单价 /每天
      let purchaseTime = `${d}天`
      let name = `Web${this.t('应用防火墙', 'WAF.yyfhq')}-域名包-CLB${this.t('新购', 'WAF.ng')}`
      let tips
      if (this.package.DomainPkg) { // 变配
        validTime = this.package.DomainPkg.ValidTime
        d = Math.ceil(moment(validTime).diff(moment(), 'd', true)) // 到期天数
        time = Math.ceil(moment(this.package.ValidTime).diff(moment(), 'month', true)) // 到期天数
        time1 = time
        if (Math.ceil(time) !== time) {
          time = time.toFixed(2)
          time1 = time.toFixed(8)
        }
        newEdiPrice = (this.buyNum + this.package.DomainPkg.Count) * 2000 * this.exchange
        curEdiPrice = this.package.DomainPkg.Count * 2000 * this.exchange
        name = `Web${this.t('应用防火墙', 'WAF.yyfhq')}-域名包-${this.t('变配', 'WAF.bp')}`
        price = '-'
        purchaseTime = `${time}${this.t('个', 'WAF.g')}月`,
        tips = [
          `(1).${this.t('变配订单金额', 'WAF.bpddje')}：${this.cost} [${this.t('新配置单价', 'WAF.xpzdj')}${newEdiPrice}*${this.t('时长', 'WAF.sc')}${time1} - ${this.t('旧配置单价', 'WAF.jpzdj')}${curEdiPrice}*${this.t('时长', 'WAF.sc')}${time1}]`,
          `(2).${this.t('时长', 'WAF.sc')}:${time1}月[${this.t('天数', 'WAF.ts')}${d}/(365/12)]`,
        ]
      }
      const order = {
        name,
        config: `${this.t('扩展', 'WAF.kz')}域名包：${this.buyNum}个`,
        price, // 单价
        cost: this.cost, // 费用
        purchaseTime,
        tips
      }
      localStorage.setItem(ORDER_INFO, JSON.stringify({
        orders: [order],
        dealParam: this.getDealParam()
      }))
      this.$router.push({
        name: 'pay'
      })
    },
    getDealParam() {
      const { DomainPkg } = this.package
      const param = {
        Version: '2018-07-09',
        'Goods.0.RegionId': 1,
        'Goods.0.ZoneId': 0,
        'Goods.0.GoodsNum': 1,
        'Goods.0.ProjectId': 0,
        'Goods.0.PayMode': 1,
        'Goods.0.Platform': 1,
      }
      if (DomainPkg) {
        return JSON.stringify({
          'Goods.0.GoodsCategoryId': CLB_BUY_DOMAIN_TYPES.edit_categoryid,
          ...param,
          'Goods.0.GoodsDetail': JSON.stringify({
            productInfo: [{
              name: `${this.t('扩展', 'WAF.kz')}域名包`,
              value: `${this.buyNum}${this.t('个', 'WAF.g')}`
            }],
            curDeadline: DomainPkg.ValidTime,
            resourceId: DomainPkg.ResourceIds,
            oldConfig: {
              pid: CLB_BUY_DOMAIN_TYPES.pid,
              [CLB_BUY_DOMAIN_TYPES.pricetype]: DomainPkg.Count,
              type: CLB_BUY_DOMAIN_TYPES.goodstype
            },
            newConfig: {
              pid: CLB_BUY_DOMAIN_TYPES.pid,
              [CLB_BUY_DOMAIN_TYPES.pricetype]: DomainPkg.Count + this.buyNum,
              type: CLB_BUY_DOMAIN_TYPES.goodstype
            }
          }),
        })
      }
      return JSON.stringify({
        'Goods.0.GoodsCategoryId': CLB_BUY_DOMAIN_TYPES.first_categoryid,
        ...param,
        'Goods.0.GoodsDetail': {
          productInfo: [{
            name: `${this.t('扩展', 'WAF.kz')}域名包`,
            value: `${this.buyNum}${this.t('个', 'WAF.g')}`
          }],
          timeSpan: this.remainingDays,
          timeUnit: 'd',
          pid: CLB_BUY_DOMAIN_TYPES.pid,
          type: CLB_BUY_DOMAIN_TYPES.goodstype,
          [CLB_BUY_DOMAIN_TYPES.pricetype]: this.buyNum,
          Currency: 'CNY'
        }
      })
    },
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
::v-deep button.buyImmediate{
  background-color:#ff9700;
  color:#fff;
  border:none;
  &.is-disabled {
    background: #ccc;
    &:hover {
      color: #f5f7fa;
    }
  }
}
::v-deep button{
  height:30px;
  line-height:30px;
  border-radius: 0;
}
::v-deep .el-input__inner{
  height:32px;
}
::v-deep .el-input-number{
  line-height: 30px;
}
.dominPackList{
  margin-bottom:20px;
  p:nth-child(1){
    float:left;
    width:68px;
    font-size:12px;
    color:#999;
  }
  p:nth-child(2){
    float:left;
    width:calc(100% - 68px);
  }
  .totalMoney{
    font-size:24px;
    color:#ff7800;
  }
}
</style>