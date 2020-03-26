<template>
  <div>
    <div>
      <el-dialog
        :title="t('Web应用防火墙套餐续费', 'WAF.renew')"
        :visible.sync="isShow"
        width="45%"
        :before-close="handleClose">
        <div class="newClear">
          <div class="newClear renewList">
            <p class="renewListLabel">{{t('套餐类型', 'WAF.tclx')}}</p>
            <p class="renewListCon">{{package.Level && CLB_PACKAGE_CFG_TYPES[package.Level].name}}</p>
          </div>
          <div class="newClear renewList">
            <p class="renewListLabel">域名包</p>
            <p class="renewListCon">{{package.DomainPkg && package.DomainPkg.Count || 0}} {{t('个（包含10个域名防护，仅支持1个一级域名）', 'WAF.ghbym')}}</p>
          </div>
          <div class="newClear renewList">
            <p class="renewListLabel">{{t('安全日志服务包', 'WAF.aqrzfwb')}}</p>
            <p class="renewListCon">{{package.Cls && package.Cls.Count || 0}}{{t('个', 'WAF.g')}}</p>
          </div>
          <div class="newClear renewList">
            <p class="renewListLabel">{{t('QPS扩展包', 'WAF.qpskzb')}}</p>
            <p class="renewListCon">{{package.QPS && package.QPS.Count || 0}}{{t('个', 'WAF.g')}}</p>
          </div>
          <div class="newClear renewList">
            <p class="renewListLabel">{{t('到期时间', 'WAF.dqsj')}}</p>
            <p class="renewListCon">{{package.ValidTime}}</p>
          </div>
          <div class="newClear renewList">
            <p class="renewListLabel">{{t('续费时长', 'WAF.xfsc')}}</p>
            <p class="renewListCon">
              <el-radio-group v-model="month">
                <el-radio-button :label="1">1{{t('个', 'WAF.g')}}月</el-radio-button>
                <el-radio-button :label="2">2{{t('个', 'WAF.g')}}月</el-radio-button>
                <el-radio-button :label="3">3{{t('个', 'WAF.g')}}月</el-radio-button>
                <el-radio-button :label="6">6{{t('个', 'WAF.g')}}月</el-radio-button>
                <el-radio-button :label="12">1年</el-radio-button>
                <el-radio-button :label="24">2年</el-radio-button>
                <el-radio-button :label="36">3年</el-radio-button>
              </el-radio-group>
            </p>
          </div>
          <div class="newClear renewList">
            <p class="renewListLabel">{{t('费用', 'WAF.fy')}}</p>
            <p class="renewListCon">
              <span class="totalMoney">
                <template v-if="loading">计算中...</template>
                <template v-else>NT$ {{cost}}</template>
              </span>
            </p>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button class="buyImmediate" @click="renewImmediate" :disabled="loading">{{t('立即续费', 'WAF.ljxf')}}</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { DESCRIBE_WAF_PRICE } from '@/constants'
import { CLB_PACKAGE_CFG_TYPES, BUY_LOG_TYPES, CLB_BUY_DOMAIN_TYPES, CLB_BUY_QPS_TYPES, ORDER_INFO } from '../../constants'
export default {
  props:{
    isShow: Boolean,
    package: Object
  },
  data(){
    return{
      CLB_PACKAGE_CFG_TYPES,
      month: 0,
      dialogModel:'',//弹框
      thisType:'1',//默认选中
      loading: true,
      costInfo: undefined,
      cost: 0,
    }
  },
  watch: {
    month() {
      this.queryPrice()
    },
    isShow(n) {
      if (n) {
        this.month = 1
      }
    }
  },
  methods:{
    queryPrice() {
      this.loading = true
      const commonParam = {
          "regionId": 1,
          "projectId": 0,
          "goodsNum": 1,
          "payMode": 1,
          "platform": 1,
      }
      const resInfo = [{
        goodsCategoryId: CLB_PACKAGE_CFG_TYPES[this.package.Level].categoryid,
        ...commonParam,
        goodsDetail: {
          "timeSpan": this.month,
          "timeUnit": "m",
          "pid": CLB_PACKAGE_CFG_TYPES[this.package.Level].pid, // WAF的pid,
          [CLB_PACKAGE_CFG_TYPES[this.package.Level].pricetype]: 1,
        }
      }]
      if (this.package.Cls) {
        resInfo.push({
          goodsCategoryId: BUY_LOG_TYPES.categoryid,
          ...commonParam,
          goodsDetail: {
            "timeSpan": this.month,
            "timeUnit": "m",
            "type": BUY_LOG_TYPES.goodstype,
            [BUY_LOG_TYPES.pricetype]: this.package.Cls.Count,
            "pid": BUY_LOG_TYPES.pid,
          }
        })
      }
      if (this.package.QPS) {
        resInfo.push({
          goodsCategoryId: CLB_BUY_QPS_TYPES.categoryid,
          ...commonParam,
          goodsDetail: {
            "timeSpan": this.month,
            "timeUnit": "m",
            "type": CLB_BUY_QPS_TYPES.goodstype,
            [CLB_BUY_QPS_TYPES.pricetype]: this.package.QPS.Count,
            "pid": CLB_BUY_QPS_TYPES.pid,
          }
        })
      }
      if (this.package.DomainPkg) {
        resInfo.push({
          goodsCategoryId: CLB_BUY_DOMAIN_TYPES.categoryid,
          ...commonParam,
          goodsDetail: {
            "timeSpan": this.month,
            "timeUnit": "m",
            "type": CLB_BUY_DOMAIN_TYPES.goodstype,
            [CLB_BUY_DOMAIN_TYPES.pricetype]: this.package.DomainPkg.Count,
            "pid": CLB_BUY_DOMAIN_TYPES.pid,
          }
        })
      }
      this.axios.post(DESCRIBE_WAF_PRICE, {
        Version: '2018-01-25',
        ResInfo: resInfo }).then(resp => {
        this.generalRespHandler(resp, ({ CostInfo }) => {
          const costInfo = {}
          let cost = 0
          CostInfo.forEach(info => {
            costInfo[info.Pid] = info
            cost += info.RealTotalCost // RealTotalCost
          })
          this.costInfo = costInfo
          this.cost = cost
          this.loading = false
        })
      })
    },
    //关闭按钮
    handleClose(){
      this.dialogModel=false;
      this.$emit("renewModelClose",this.dialogModel)
    },
    //立即购买按钮
    renewImmediate(){
      const orders = [{
        name: `Web${this.t('应用防火墙', 'WAF.yyfhq')}-${CLB_PACKAGE_CFG_TYPES[this.package.Level].name}-CLB${this.t('续费', 'WAF.xf')}`,
        config: `Web${this.t('应用防火墙', 'WAF.yyfhq')}：${CLB_PACKAGE_CFG_TYPES[this.package.Level].name}`,
        price: `${this.costInfo[CLB_PACKAGE_CFG_TYPES[this.package.Level].pid].RealTotalCost}元/月`, // 单价
        cost: this.costInfo[CLB_PACKAGE_CFG_TYPES[this.package.Level].pid].RealTotalCost, // 费用
        purchaseTime: `${this.month}${this.t('个', 'WAF.g')}月`,
      }]
      if (this.package.Cls) {
        orders.push({
          name: `Web${this.t('应用防火墙', 'WAF.yyfhq')}-${this.t('安全日志服务续费', 'WAF.aqrzfwxf')}`,
          config: `${this.t('全量日志服务包', 'WAF.qlrzfwb')}：1T`,
          price: `${this.costInfo[BUY_LOG_TYPES.pid].RealTotalCost}元/月`, // 单价
          cost: this.costInfo[BUY_LOG_TYPES.pid].RealTotalCost, // 费用
          purchaseTime: `${this.month}${this.t('个', 'WAF.g')}月`,
        })
      }
      if (this.package.QPS) {
        orders.push({
          name: `Web${this.t('应用防火墙', 'WAF.yyfhq')}-${this.t('QPS扩展包', 'WAF.QPS扩展包')}-CLB`,
          config: `${this.t('QPS扩展包', 'WAF.QPS扩展包')}：${this.package.QPS.Count}QPS`,
          price: `${this.costInfo[CLB_BUY_DOMAIN_TYPES.pid].RealTotalCost}元/月`, // 单价
          cost: this.costInfo[CLB_BUY_DOMAIN_TYPES.pid].RealTotalCost, // 费用
          purchaseTime: `${this.month}${this.t('个', 'WAF.g')}月`,
        })
      }
      if (this.package.DomainPkg) {
        orders.push({
          name: `Web${this.t('应用防火墙', 'WAF.yyfhq')}-域名包-CLB續費`,
          config: `域名包：${this.package.DomainPkg.Count}${this.t('个', 'WAF.g')}`,
          price: `${this.costInfo[CLB_BUY_QPS_TYPES.pid].RealTotalCost}元/月`, // 单价
          cost: this.costInfo[CLB_BUY_QPS_TYPES.pid].RealTotalCost, // 费用
          purchaseTime: `${this.month}${this.t('个', 'WAF.g')}月`,
        })
      }
      localStorage.setItem(ORDER_INFO, JSON.stringify({
        orders,
        dealParam: this.getDealParam()
      }))
      this.$router.push({
        name: 'pay'
      })
    },
    getDealParam() {
      const { Level, ValidTime, ResourceIds, Cls, DomainPkg, QPS } = this.package
      const { categoryid, name, pricetype, pid, } = CLB_PACKAGE_CFG_TYPES[Level]
      let index = 0
      const param = {
        Version: '2018-07-09',
        'Goods.0.GoodsCategoryId': categoryid,
        'Goods.0.RegionId': 1,
        'Goods.0.ZoneId': 0,
        'Goods.0.GoodsNum': 1,
        'Goods.0.ProjectId': 0,
        'Goods.0.PayMode': 1,
        'Goods.0.Platform': 1,
        'Goods.0.GoodsDetail': {
           productInfo: [{
            name: `Web${this.t('应用防火墙', 'WAF.yyfhq')}`,
            value: name
          }],
          curDeadline: ValidTime,
          timeSpan: this.month,
          timeUnit: 'm',
          resourceId: ResourceIds,
          pid: pid,
          [pricetype]: 1,
          Currency: 'CNY'
        }
      }
      let clsParam = {}
      let domainParam = {}
      let qpsParam = {}
      if (Cls) {
        index += 1
        const { ValidTime: clsValidTime, ResourceIds: clsResourceIds, Count: clsCount } = Cls
        clsParam = {
          // 日志包产品
          [`Goods.${index}.GoodsCategoryId`]: BUY_LOG_TYPES.categoryid,
          [`Goods.${index}.RegionId`]: 1,
          [`Goods.${index}.ZoneId`]: 0,
          [`Goods.${index}.GoodsNum`]: 1,
          [`Goods.${index}.ProjectId`]: 0,
          [`Goods.${index}.PayMode`]: 1,
          [`Goods.${index}.Platform`]: 1,
          [`Goods.${index}.GoodsDetail`]: {
            productInfo: [{
              name: `${this.t('全量日志服务包', 'WAF.qlrzfwb')}`,
              value: `${clsCount}T`
            }],
            curDeadline: clsValidTime,
            timeSpan: this.month,
            timeUnit: 'm',
            resourceId: clsResourceIds,
            pid: BUY_LOG_TYPES.pid,
            [BUY_LOG_TYPES.pricetype]: 1,
            Currency: 'CNY'
          }
        }
      }
      if (DomainPkg) {
        index += 1
        const { ValidTime: domainValidTime, ResourceIds: domainResourceIds, Count: domainCount } = DomainPkg
        domainParam = {
          // 域名包产品
          [`Goods.${index}.GoodsCategoryId`]: CLB_BUY_DOMAIN_TYPES.categoryid,
          [`Goods.${index}.RegionId`]: 1,
          [`Goods.${index}.ZoneId`]: 0,
          [`Goods.${index}.GoodsNum`]: 1,
          [`Goods.${index}.ProjectId`]: 0,
          [`Goods.${index}.PayMode`]: 1,
          [`Goods.${index}.Platform`]: 1,
          [`Goods.${index}.GoodsDetail`]: {
            productInfo: [{
              name: `${this.t('扩展', 'WAF.kz')}域名包`,
              value: `${domainCount}${this.t('个', 'WAF.g')}`
            }],
            curDeadline: domainValidTime,
            timeSpan: this.month,
            timeUnit: 'm',
            resourceId: domainResourceIds,
            pid: CLB_BUY_DOMAIN_TYPES.pid,
            [CLB_BUY_DOMAIN_TYPES.pricetype]: 1,
            Currency: 'CNY'
          }
        }
      }
      if (QPS) {
        index += 1
        const { ValidTime: qpsValidTime, ResourceIds: qpsResourceIds, Count: qpsCount } = QPS
        qpsParam = {
          // 日志包产品
          [`Goods.${index}.GoodsCategoryId`]: CLB_BUY_QPS_TYPES.categoryid,
          [`Goods.${index}.RegionId`]: 1,
          [`Goods.${index}.ZoneId`]: 0,
          [`Goods.${index}.GoodsNum`]: 1,
          [`Goods.${index}.ProjectId`]: 0,
          [`Goods.${index}.PayMode`]: 1,
          [`Goods.${index}.Platform`]: 1,
          [`Goods.${index}.GoodsDetail`]: {
            productInfo: [{
              name: `${this.t('扩展', 'WAF.kz')}域名包`,
              value: `${qpsCount}QPS`
            }],
            curDeadline: qpsValidTime,
            timeSpan: this.month,
            timeUnit: 'm',
            resourceId: qpsResourceIds,
            pid: CLB_BUY_QPS_TYPES.pid,
            [CLB_BUY_QPS_TYPES.pricetype]: 1,
            Currency: 'CNY'
          }
        }
      }
      return JSON.stringify({
        ...param,
        ...clsParam,
        ...domainParam,
        ...qpsParam,
      })
    },
    //点击续费时长按钮
    checkType(type){
      this.thisType=type;
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
.renewList{
  margin-bottom:20px;
  p:nth-child(1).renewListLabel{
    font-size:12px;
    color:#999;
    width:100px;
    float:left;
  }
  p:nth-child(2).renewListCon{
    float:left;
    width:calc(100% - 100px);
    color:#000;
    font-size:12px;
    .totalMoney{
      font-size:24px;
      color:#ff7800;
    }
    .packageTypeBtn{
      width:68px;
      padding:0;
      text-align:center;
      margin-right:0;
      font-size:12px;
    }
    .addBoderC{
      border:1px solid #006eff;
      color:#006eff;
    }
  }
}
</style>