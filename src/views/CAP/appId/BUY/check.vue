<template>
  <div class="container">
    <div class="head" id="head">
      <NavHeader></NavHeader>
    </div>
    <el-row>
      <el-col :span="16" :offset="4">
        <table class="table-div">
          <thead>
            <tr class="t-head">
              <th class="first-txt">{{$t('CAP.cpmc')}}</th>
              <th>{{$t('CAP.pzxx')}}</th>
              <th>{{$t('CAP.dj')}}</th>
              <th>{{$t('CAP.sl')}}</th>
              <th>{{$t('CAP.ff')}}</th>
              <th>{{$t('CAP.gm')}}</th>
              <th>{{$t('CAP.yh')}}</th>
              <th>{{$t('CAP.fy')}}</th>
            </tr>
          </thead>
          <tbody>
            <tr class="t-body" colspan="0" aria-rowspan="0">
              <td class="first-txt">
                <span>{{$t('CAP.yzmllbxg')}}</span>
              </td>
              <td>
                <p><span>{{$t('CAP.fw')}}</span></p>
                <p><span>{{$t('CAP.csb')}} : {{quantity}}{{$t('CAP.wn')}}</span></p>
                <p><span>{{$t('CAP.yxq')}}</span></p>
              </td>
              <td>
                <span>NT$ {{totalCost}}</span>
              </td>
              <td>
                <span>1</span>
              </td>
              <td>
                <span>{{$t('CAP.yff')}}</span>
              </td>
              <td>
                <span>{{$t('CAP.ycxgm')}}</span>
              </td>
              <td>
                <span>{{$t('CAP.w')}}</span>
              </td>
              <td>
                <span class="tableTdLast">NT$ {{totalCost}}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <table>
        </table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="16" :offset="4" class="btn-wrap">
        <span class="allTotal">{{$t('CAP.zjjfy')}}：<span class="allMoneySpan"> NT$ {{totalCost}}</span></span>
        <el-button class="payBtnTwo" :disabled="loading" @click="pay">{{$t('CAP.ljgm')}}</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import NavHeader from "@/components/HeaderAside/Header"
import { PAY_DEALS } from '@/constants'
import { ErrorTips } from "@/components/ErrorTips"

export default{
  components: {
    NavHeader
  },
  data(){
    return {
      totalCost: 0,
      quantity: 0,
      orderId: '',
      loading: false,
    }
  },
  created() {
    if (!this.$route.params.totalCost || !this.$route.params.quantity || !this.$route.params.orderId) {
      this.$router.go(-1)
    } else {
      this.totalCost = this.$route.params.totalCost
      this.quantity = this.$route.params.quantity
      this.orderId = this.$route.params.orderId
    }
  },
  methods:{
    pay() {
      this.loading = true
      this.axios.post(PAY_DEALS, {
        Version: '2018-07-09',
        'OrderIds.0': this.orderId
      }).then(res => {
        if (res.Response.Error === undefined) {
          this.$message({
            message: '购买成功',
            type: "success",
            showClose: true,
            duration: 0
          });
          this.$router.replace('/appId')
        } else {
          let ErrTips = {
             "FailedOperation":'操作失败',
             "FailedOperation.AgentPayDealCannotDown":'代理支付设备不能降配',
             "FailedOperation.BalanceInsufficient":'余额不足',
             "FailedOperation.InvalidDeal":'订单状态有误，只有未支付订单才能支付',
             "FailedOperation.InvalidVoucher": '代金券不可用',
             "FailedOperation.NeedPayTogeter": '一起购买的订单必须同时支付',
             "FailedOperation.PayPriceError": '支付失敗，請聯繫台富雲工作人員處理',
             'FailedOperation.PaySuccDeliverFailed': '支付成功但發貨失敗，請聯繫台富雲工作人員處理',
             'UnauthorizedOperation.CertificationNeedUpgrade': '因賬號安全升級，支付失敗',
             'UnauthorizedOperation.NotFinanceAuth': '賬號沒有財務授權，支付失敗'
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      }).then(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss">
.container {
  height: 100%;
  background: #f0f2f5;
  .table-div {
    background: #fff;
    width: 100%;
    margin-top: 50px;
    border-collapse:collapse;
    .first-txt {
      padding-left: 30px;
    }
    thead {
      font-size: 14px;
      tr {
        border-bottom: 1px solid #d1d5de;
        th {
          height: 40px;
          color: #454951;
          text-align: left;
        }
      }
    }
    tbody {
      td {
        font-size: 14px;
        padding: 20px 0;
      }
    }
  }
  .btn-wrap {
    text-align: right;
    margin-top: 30px;
    padding: 15px;
    background: #fff;
    font-size: 14px;
    .allMoneySpan {
      color: #ed711f;
      font-size: 26px;
      font-weight: 500;
    }
    .payBtnTwo {
      margin-left: 20px;
      background: #fa7821;
      border-color: #e36d1f;
      color: #fff;
    }
  }
}
</style>