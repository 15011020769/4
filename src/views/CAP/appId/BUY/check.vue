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
              <th class="first-txt">产品名称</th>
              <th>配置信息</th>
              <th>单价</th>
              <th>数量</th>
              <th>付费方式</th>
              <th>购买时长</th>
              <th>优惠</th>
              <th>费用</th>
            </tr>
          </thead>
          <tbody>
            <tr class="t-body" colspan="0" aria-rowspan="0">
              <td class="first-txt">
                <span>验证码流量包新购</span>
              </td>
              <td>
                <p><span>服务 : 验证码服务</span></p>
                <p><span>次数包 : {{quantity}}万次</span></p>
                <p><span>有效期 : 1年</span></p>
              </td>
              <td>
                <span>NT$ {{totalCost}}</span>
              </td>
              <td>
                <span>1</span>
              </td>
              <td>
                <span>预付费</span>
              </td>
              <td>
                <span>一次性购买</span>
              </td>
              <td>
                <span>无</span>
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
        <span class="allTotal">总计费用：<span class="allMoneySpan"> NT$ {{totalCost}}</span></span>
        <el-button class="payBtnTwo" :disabled="loading" @click="pay">立即购买</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import NavHeader from "@/components/HeaderAside/Header"
import { PAY_DEALS } from '@/constants'
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
          this.$message({
            message: ErrorTips[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
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