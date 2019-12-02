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
              <tr class="t-body" colspan="0" aria-rowspan="0">
                <td>
                  <span>高防IP专业版新购</span>
                </td>
                <td>
                  <p><span>地域：{{allData1.address}}</span></p>
                  <p><span>防护带宽峰值：{{allData1.savePeak}}</span></p>
                  <p><span>弹性防护峰值：{{allData1.elasticPeak}}</span></p>
                  <p><span>自动续费：{{allData1.autoPay}}</span></p>
                  <p><span>业务宽带(Mbps)：{{allData1.BusinessBroadband}}</span></p>
                  <p><span>HTTP(QPS)：{{allData1.httpQPS}}</span></p>
                  <p><span>HTTPS(QPS)：{{allData1.httpsQPS}}</span></p>
                  <p><span>转发规则数(个)：{{allData1.shareNum}}</span></p>
                </td>
                <td>
                  <span>{{allData1.payMoney}}元/月</span>
                </td>
                <td>
                  <span>1</span>
                </td>
                <td>
                  <span>预付费</span>
                </td>
                <td>
                  <span>{{allData1.payTime}}</span>
                </td>
                <td>
                  <span>无</span>
                </td>
                <td>
                  <span class="tableTdLast">{{allData1.payMoney}}元</span>
                </td>
              </tr>
            </table>
        </div>
        <div class="bottomPay">
          <div class="payCheck newClear">
            <el-checkbox label="使用代金券" v-model="checkBox" :disabled='true'></el-checkbox>  <span class="checkBoxTip">(该产品无代金券)</span>
            <span class="copyMoney">+ 兑换代金券</span>
          </div>
          <div class="pay-submit">
            <span>购买/开通/续费 均可开票，支付成功后可前往 控制台 > 费用中心<a href="#">开发票</a></span>
            <span class="allTotal">总计费用：<span class="allMoneySpan"> ¥<span>{{allData1.payMoney}}</span></span></span>
            <el-button class="payBtnOne">代理支付</el-button>
            <el-button class="payBtnTwo" @click="next">自行支付</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default{
  data(){
    return {
      active: 0,
      allData:[],
      allData1:[],
      checkBox:[]
    }
  },
  created() {
    this.allData=sessionStorage.getItem("allData");
    this.allData1 = JSON.parse(this.allData)
    console.log(this.allData1)
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
        border-collapse:collapse;
        td:nth-child(1){
          padding-left:32px;
        }
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
          td:nth-child(1){
            padding-left:20px;
          }
          .tableTdLast{
            color:#ed711f;
          }
          
        }
        :hover{
            background-color:#dfecff
          }
      }
    }
    .bottomPay{
      width:100%;
      height:125px;
      background:#fff;
      .payCheck{
        padding:20px 30px 10px;
        margin-top:20px;
        color:#000;
        .checkBoxTip{
          color:#999;
          font-size:14px;
        }
        .copyMoney{
          color:#00a4ff;
          font-size:14px;
          float:right;
        }
        span.el-checkbox__label{
          color:#000;
        }
      }
      .pay-submit{
        padding:20px;
        text-align:right;
        font-size:14px;
        .allTotal{
          color:#999;
          font-size:14px;
          margin-left:42px;
          margin-right:30px;
          .allMoneySpan{
            color:#ed711f;
            span{
              font-size:30px;
              line-height: 30px;
              font-weight:400;
            }
          }
        }
        .payBtnOne{
          background: #fcfcfc;
          border-color: #d1d2d3;
          color: #0071ce;
          width:96px;
          height:33px;
          line-height: 33px;
          border-radius: 2px;
          padding:0;
        }
        .payBtnTwo{
          background: #fa7821;
          border-color: #e36d1f;
          color:#fff;
          border-radius: 2px;
          margin-left:5px;
          width:96px;
          height:33px;
          line-height: 33px;
          padding:0;
        }
      }
    }
  }
}
</style>