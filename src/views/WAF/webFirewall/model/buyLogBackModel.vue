<template>
  <div>
    <div>
      <el-dialog
        :title="t('安全日志服务包', 'WAF.aqrzfwb')"
        :visible.sync="logBackShow"
        width="45%"
        :before-close="handleClose">
        <div class="newClear">
          <div class="newClear dominPackList">
            <p>{{t('购买数量', 'WAF.gmsl')}}</p>
            <p>
              <el-input-number v-model="buyNum" @change="handleChange"></el-input-number> {{t('个', 'WAF.g')}}
            </p>
          </div>
          <div class="newClear dominPackList">
            <p>{{t('到期时间', 'WAF.dqsj')}}</p>
            <p>{{package.Cls && package.Cls.ValidTime || package.ValidTime}}（共{{remainingDays}}天）</p>
          </div>
          <div class="newClear dominPackList">
            <p>{{t('说明', 'WAF.sm')}}</p>
            <p>{{t('一个日志包包含：1T日志服务存储容量（套餐有效期内，日志存储时长为180天）；一次最多购买500个', 'WAF.ygrzbbh')}}</p>
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
          <el-button class="buyImmediate" @click="nowBuy" :disabled="loading">{{t('立即购买', 'WAF.ljgm')}}</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { DESCRIBE_WAF_PRICE } from '@/constants'
import { BUY_LOG_TYPES, ORDER_INFO } from '../../constants'
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
      logBackModel: '', // 弹框
      buyNum: 1, // 购买数量
      remainingDays: 0, // 剩余天数
      cost: 0,
      loading: true,
    }
  },
  watch: {
    buyNum() {
      this.queryPrice()
    },
    isShow(n) {
      if (n) {
        const ValidTime = this.package.Cls && this.package.Cls.ValidTime || this.package.ValidTime
        this.remainingDays = Math.ceil(moment(ValidTime).diff(moment(), 'h')/24)
        this.queryPrice()
      }
    },
  },
  computed:{
    //弹框
    logBackShow(){
      this.logBackModel=this.isShow;
      return this.isShow;
    }
  },
  methods:{
    queryPrice() {
      this.loading = true
      const resInfo = {
        "regionId": 1,
        "projectId": 0,
        "goodsNum": 1,
        "payMode": 1,
        "platform": 1,
      }
      if (this.package.Cls) {
        // 升级
        resInfo.goodsCategoryId = BUY_LOG_TYPES.edit_categoryid
        resInfo.goodsDetail = {
          resourceId: this.package.Cls.ResourceIds,
          curDeadline: this.package.Cls.ValidTime,
          oldConfig: {
            pid: BUY_LOG_TYPES.pid,
            [BUY_LOG_TYPES.pricetype]: this.package.Cls.Count,
            type: BUY_LOG_TYPES.goodstype
          },
          newConfig: {
            pid: BUY_LOG_TYPES.pid,
            [BUY_LOG_TYPES.pricetype]: this.package.Cls.Count + this.buyNum,
            type: BUY_LOG_TYPES.goodstype
          }
        }
      } else {
        // 新购
        resInfo.goodsCategoryId = BUY_LOG_TYPES.first_categoryid
        resInfo.goodsDetail = {
          "pid": BUY_LOG_TYPES.pid, // 1001156,
          "timeSpan": this.remainingDays,
          "timeUnit": "d",
          [BUY_LOG_TYPES.pricetype]: this.buyNum,
          "type": BUY_LOG_TYPES.goodstype,
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
      this.logBackModel=false;
      this.$emit("closeLogBackModel",this.logBackModel)
    },
    //计数器
    handleChange(){

    },
    //立即购买按钮
    nowBuy(){
      let validTime = this.package.ValidTime
      const aqrzfw = this.t('安全日志服务', 'WAF.aqrzfwb')
      let d = Math.ceil(moment(validTime).diff(moment(), 'd', true)) // 到期天数
      let time = d/(365/12) // 到期月数
      let newEdiPrice
      let curEdiPrice
      let price = `${this.cost / d}/天` // 新购时单价 /每天
      let purchaseTime = `${d}天`
      let name = `Web${this.t('应用防火墙', 'WAF.yyfhq')}-${aqrzfw}-CLB${this.t('新购', 'WAF.ng')}`
      let tips
      if (this.package.Cls) { // 变配
        validTime = this.package.Cls.ValidTime
        d = Math.ceil(moment(validTime).diff(moment(), 'd', true)) // 到期天数
        time = d/(365/12) // 到期月数
        newEdiPrice = (this.buyNum + this.package.Cls.Count) * 500
        curEdiPrice = this.package.Cls.Count * 500 
        name = `Web${this.t('应用防火墙', 'WAF.yyfhq')}-${aqrzfw}包-${this.t('变配', 'WAF.bp')}`
        price = '-'
        purchaseTime = `${time.toFixed(2)}${this.t('个', 'WAF.g')}月`,
        tips = [
          `(1).${this.t('变配订单金额', 'WAF.bpddje')}：${this.cost} [${this.t('新配置单价', 'WAF.xpzdj')}${newEdiPrice}*${this.t('时长', 'WAF.sc')}${time.toFixed(8)} - ${this.t('旧配置单价', 'WAF.jpzdj')}${curEdiPrice}*${this.t('时长', 'WAF.sc')}${time.toFixed(8)}]`,
          `(2).${this.t('时长', 'WAF.sc')}:${time.toFixed(8)}月[${this.t('天数', 'WAF.ts')}${d}/(365/12)]`,
        ]
      }
      const order = {
        name,
        config: `${aqrzfw}包：${this.buyNum}T`,
        price, // 单价
        cost: this.cost, // 费用
        purchaseTime,
        tips
      }
      localStorage.setItem(ORDER_INFO, JSON.stringify([order]))
      this.$router.push({
        name: 'pay'
      })
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