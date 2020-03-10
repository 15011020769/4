<template>
  <div>
    <div class="topTitle">
      <div class="topTitleMain newClear">
        <div class="tit">{{t('核对信息', 'WAF.hdxx')}}</div>
      </div>
    </div>
    <div class="wrapper">
      <div class="wrapperCon">
        <div class="payTable">
          <el-table
            :data="tableData">
            <el-table-column prop="name" :label="t('产品名称', 'WAF.cpmc')"></el-table-column>
            <el-table-column prop="config" label="配置信息"></el-table-column>
            <el-table-column prop="price" :label="t('单价', 'WAF.dj')"></el-table-column>
            <el-table-column prop="num" :label="t('数量', 'WAF.sl')">1</el-table-column>
            <el-table-column prop="payMethods" :label="t('付费方式', 'WAF.fffs')">
              <el-tooltip effect="dark" :content="t('先购买再使用', 'WAF.xgmzsy')" placement="top">
                <span style="border-bottom: dashed #454a51 1px;">{{t('预付费', 'WAF.yff')}}</span>
              </el-tooltip>
            </el-table-column>
            <el-table-column prop="purchaseTime" :label="t('购买时长', 'WAF.gmsc')"></el-table-column>
            <el-table-column prop="total" :label="t('费用', 'WAF.fy')">
              <template slot-scope="scope">
                <span>{{scope.row.cost}}</span>&nbsp;
                <el-tooltip v-if="scope.row.tips" effect="dark" placement="top">
                  <div slot="content" v-for="tip in scope.row.tips">{{tip}}</div>
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </template> 
            </el-table-column>
          </el-table>
        </div>
        <div class="payBot">
          <div class="btnGroup">
            <span class="totalMo">总计费用：</span><span class="totaoMoneyO"><i>NT$ {{tableData.map(data => data.cost).reduce((a, b) => a + b, 0)}}</i></span>
            &nbsp;<el-button @click="pay" size="mini" class="selfPay" :disabled="!orderIds || orderIds.length === 0">自行支付</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  ORDER_INFO,
  CLB_PACKAGE_CFG_TYPES,
  CLB_BUY_DOMAIN_TYPES,
  BUY_LOG_TYPES,
  CLB_BUY_QPS_TYPES,
} from '../constants'
import { GENERATE_DEALS, PAY_DEALS } from '@/constants'
import { flatObj } from '@/utils'
export default {
  data(){
    return{
      active: 0,//第一步
      tableData:[],//表格
      useCard:false,//使用代金券
      orderIds: [],
    }
  },
  mounted() {
    const orderStr = localStorage.getItem(ORDER_INFO)
    if (orderStr) {
      const order = JSON.parse(orderStr)
      this.tableData = order.orders
      this.generateDeal(JSON.parse(order.dealParam))
    }
  },
  methods:{
    pay() {
      this.loading = true
      this.axios.post(PAY_DEALS, flatObj({
        Version: '2018-07-09',
        OrderIds: this.orderIds
      })).then(resp => {
        let ErrTips = {
          "FailedOperation":'操作失败',
          "FailedOperation.AgentPayDealCannotDown":'代理支付设备不能降配',
          "FailedOperation.BalanceInsufficient":'余额不足',
          "FailedOperation.InvalidDeal":'订单状态有误，只有未支付订单才能支付',
          "FailedOperation.InvalidVoucher": '代金券不可用',
          "FailedOperation.NeedPayTogeter": '一起购买的订单必须同时支付',
          "FailedOperation.PayPriceError": '支付失敗，請聯繫台富雲工作人員處理',
          'FailedOperation.PaySuccDeliverFailed': '支付成功但發貨失敗，請聯繫台富雲工作人員處理',
          'UnauthorizedOperation.CertificationNeedUpgrade': '因帳號安全升級，支付失敗',
          'UnauthorizedOperation.NotFinanceAuth': '帳號沒有財務授權，支付失敗'
        }
        this.generalRespHandler(resp, () => {
          this.$router.push('/')
        }, ErrTips, '支付成功')
      })
    },
    generateDeal(param) {
      this.axios.post(GENERATE_DEALS, param)
      .then(resp => {
        this.generalRespHandler(resp, ({ OrderIds }) => {
          this.orderIds = OrderIds
        })
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  display: block;
  content:'';
  clear:both;
}
.topTitle{
  width:100%;
  height:90px;
  background-color:#fff;
  box-shadow: 0 2px 3px #e2e9ee;
  .topTitleMain{
    width:1120px;
    margin:0 auto;
    .tit{
      float:left;
      font-size: 26px;
      font-weight: 400;
      line-height: 90px;
      color: #000;
    }
    .step{
      float:right;
      width:500px;
      padding-top:20px;
    }
  }
}
.wrapper{
  width:100%;
  .wrapperCon{
    width:1120px;
    margin:0 auto;
    .payTable{
      background-color:#fff;
      margin:20px 0;
      .feeColor{
        color:#fa7821;
      }
    }
    .payBot{
      background-color:#fff;
      padding:20px;
      .noneTip{
        color:#999;
        margin-left:10px;
        font-size:14px;
      }
      .duihaun{
        color:#006eff;
        float:right;
      }
      .btnGroup{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .totalMo{
          font-size:14px;
          color:#666;
        }
        .totaoMoneyO{
          color:#fa7821;
          i{
            font-style: normal;
            font-size:30px;
          }
        }
        .agentPay{
          margin-left:10px;
          color:#0071ce;
        }
        .selfPay{
          background-color:#fa7821;
          color:#fff;
          &.is-disabled {
            background: #ccc;
            &:hover {
              color: #f5f7fa;
            }
          }
        }
      }
    }
  }
}
</style>