<template>
  <div>
    <div class="topTitR newClear">
      <div class="topTitCenter">
        <div class="leftTit">
          核对信息
        </div>
        <div class="rightStep">
          <el-steps :active="active" finish-status="success">
            <el-step title="核对信息"></el-step>
            <el-step title="支付"></el-step>
            <el-step title="支付结果"></el-step>
          </el-steps>
        </div>
      </div>
    </div>
    <div class="contentBox">
      <div class="contentCenter">
        <div class="payFortable">
          <table class="table-div">
              <tr class="t-head">
                <td>产品名称</td>
                <td>配置信息</td>
                <td>单价</td>
                <td>数量</td>
                <td>付费方式</td>
                <td>购买时长</td>
                <td>优惠</td>
                <td>费用</td>
              </tr>
              <tr class="t-body">
                <td>
                  <span>高防IP专业版新购</span>
                </td>
                <td>
                  <p><span>地域：{{this.$route.params.address}}</span></p>
                  <p><span>防护带宽峰值：{{this.$route.params.savePeak}}</span></p>
                  <p><span>弹性防护峰值：{{this.$route.params.elasticPeak}}</span></p>
                  <p><span>自动续费：{{this.$route.params.autoPay}}</span></p>
                  <p><span>业务宽带(Mbps)：{{this.$route.params.BusinessBroadband}}</span></p>
                  <p><span>HTTP(QPS)：{{this.$route.params.httpQPS}}</span></p>
                  <p><span>HTTPS(QPS)：{{this.$route.params.httpsQPS}}</span></p>
                  <p><span>转发规则数(个)：{{this.$route.params.shareNum}}</span></p>
                </td>
                <td>
                  <span>{{this.$route.params.payMoney}}元/月</span>
                </td>
                <td>
                  <span>1</span>
                </td>
                <td>
                  <span>预付费</span>
                </td>
                <td>
                  <span>{{this.$route.params.payTime}}</span>
                </td>
                <td>
                  <span>无</span>
                </td>
                <td>
                  <span class="tableTdLast">{{this.$route.params.payMoney}}元</span>
                </td>
              </tr>
            </table>
        </div>
        <div class="">

        </div>
        <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default{
  data(){
    return {
      active: 0
    }
  },
  methods:{
    next() {
      if (this.active++ > 2) this.active = 0;
    }
  }
}
</script>
<style lang="scss">
.newClear:after{
  content:'';
  display: block;
  clear:both;
}
.topTitR{
  width:100%;
  height:90px;
  background-color: #fff;
  box-shadow: 0 2px 3px #e2e9ee;
  min-width: 1180px;
  .topTitCenter{
    min-width:1180px;
    width:1180px;
    margin:0 auto;
    .leftTit{
      float:left;
      line-height: 90px;
      font-size: 26px;
      font-weight: 400;
      line-height: 90px;
      color: #000;
    }
    .rightStep{
      float:right;
      width:470px;
      margin-top:20px;
    }
  }
}
.contentBox{
  width:100%;
  padding:20px 0;
  .contentCenter{
    width:1190px;
    margin:0 auto;
    .payFortable{
      width:100%;
      min-height:200px;
      background-color: #fff;
      overflow-x: hidden;
      overflow-y: hidden;
      .table-div{
        .t-head{
          border-top:1px solid #ddd;
          border-bottom:1px solid #ddd;
          height:30px;
          font-weight:bold;
          font-size:14px;
        }
        .t-body{
          border-bottom:1px solid #ddd;
          padding:30px 0;
          font-size:14px;
          td{
            padding:30px 0;
            p{
              margin-bottom:5px;
            }
          }
          .tableTdLast{
            color:#ed711f;
          }
        }
      }
    }
  }
}
</style>