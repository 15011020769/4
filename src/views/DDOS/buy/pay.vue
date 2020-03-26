<template>
  <div>
    <div class="topTitR newClear">
      <div class="topTitCenter">
        <div class="leftTit">
          核對信息
        </div>
        <div class="rightStep">
          <el-steps :active="active" finish-status="success">
            <el-step title="核對信息"></el-step>
            <el-step title="支付"></el-step>
            <el-step title="支付結果"></el-step>
          </el-steps>
        </div>
      </div>
    </div>
    <div class="contentBox">
      <div class="contentCenter">
        <div class="payFortable">
          <table class="table-div">
              <tr class="t-head">
                <td>產品名稱</td>
                <td>配置信息</td>
                <td>單價</td>
                <td>數量</td>
                <td>付費方式</td>
                <td>購買時長</td>
                <td>優惠</td>
                <td>費用</td>
              </tr>
              <tr class="t-body" colspan="0" aria-rowspan="0">
                <td>
                  <span v-if="allData1.goodsId === 100615">高防IP專業版新購</span>
                  <span v-if="allData1.goodsId === 100616">高防IP專業版續費</span>
                  <span v-if="allData1.goodsId === 100617">高防IP專業版升級</span>
                </td>
                <td>
                  <p v-if="allData1.address!==''"><span>地域{{allData1.address}}</span></p>
                  <p v-if="allData1.savePeak!==''"><span>防護帶寬峰值：{{allData1.savePeak}}Gbps</span></p>
                  <p v-if="allData1.elasticPeak!==''"><span>彈性防護峰值：{{allData1.elasticPeak}}Gbps</span></p>
                  <p v-if="allData1.autoPay!==''"><span>自動續費：{{allData1.autoPay}}</span></p>
                  <p v-if="allData1.BusinessBroadband!==''"><span>業務寬頻(Mbps)：{{allData1.BusinessBroadband}}</span></p>
                  <p v-if="allData1.httpQPS!==''"><span>HTTP(QPS)：{{allData1.httpQPS}}</span></p>
                  <p v-if="allData1.httpsQPS!==''"><span>HTTPS(QPS)：{{allData1.httpsQPS}}</span></p>
                  <p v-if="allData1.shareNum!==''"><span>轉發規則數(個)：{{allData1.shareNum}}</span></p>
                </td>
                <td>
                  <span v-if="allData1.goodsId === 100617">-</span>
                  <span v-else>{{this.showPrice(allData1.payMoney/allData1.payTimeNum,2)}}圓/月</span>
                </td>
                <td>
                  <span>1</span>
                </td>
                <td>
                  <span>預付費</span>
                </td>
                <td>
                  <span>{{allData1.payTimeNum}}個月</span>
                </td>
                <td>
                  <span>無</span>
                </td>
                <td>
                  <span class="tableTdLast">{{this.showPrice(allData1.payMoney,2)}}圓</span>
                </td>
              </tr>
            </table>
        </div>
        <div class="bottomPay">
          <div class="pay-submit">
            <!-- <span>購買/開通/續費 均可開票，購買成功後可前往 控制台 > 費用中心<a href="#">開發票</a></span> -->
            <span class="allTotal">總計費用：<span class="allMoneySpan"> NT$<span>{{this.showPrice(allData1.payMoney,2)}}</span></span></span>
            <!-- <el-button class="payBtnOne">代理支付</el-button> -->
            <el-button class="payBtnTwo" @click="next">立即支付</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { GENERATE_DEALS, PAY_DEALS } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default{
  data() {
    return {
      active: 1,
      allData: [],
      allData1: [],
      checkBox: [],
      OrderIds: [],
      loading: false
    }
  },
  created () {
    this.allData = sessionStorage.getItem("allData");
    this.allData1 = JSON.parse(this.allData)
  },
  methods: {
    next () {
      if (this.active === 1) {
        this.GenerateDeals()
      }
      if (this.active > 2) this.active = 1
    },
    // 支付订单
    PayDeals () {
      let params = {
        Version: "2018-07-09",
        Region: "ap-taipei",
      }
      this.OrderIds.forEach((element, index) => {
        params['OrderIds.' + index] = element
      })
      this.loading = true
      this.active++
      this.axios.post(PAY_DEALS, params).then(res => {
        if (res.Response !== undefined) {
          if (res.Response.Error === undefined) {
            // 支付成功
            this.$message({
              message: '購買成功',
              type: 'success',
              showClose: true,
              duration: 0
            })
            this.$router.replace('/ProtectOverview')
          } else {
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code] === 'FailedOperation.BalanceInsufficient' ? '餘額不足' : '購買失敗',
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        }
      }).then(() => { this.loading = false })
    },
    // 创建订单
    GenerateDeals () {
      let params = {
        Version: "2018-07-09",
        Region: "ap-taipei",
      }
      // let GoodsDetail = {
      //   bandwidth: this.allData1.savePeak, // 保底带宽
      //   gfbandwidth: this.allData1.BusinessBroadband, // 业务带宽
      //   rule_count: this.allData1.shareNum, // 转发规则数
      //   pid: "14306",
      //   timeSpan: this.allData1.payTimeNum, // 购买时长
      //   timeUnit: "m"
      // };
      // let json = JSON.stringify(GoodsDetail);
      let Goods = [
        {
          RegionId: 39,
          ZoneId: 0,
          GoodsCategoryId: this.allData1.goodsId,
          GoodsNum: 1,
          PayMode: 1,
          ProjectId: 0,
          Platform: 1,
          GoodsDetail: this.allData1.goodsInfo
        }
      ]
      Goods.forEach((item, i) => {
        let keys = Object.keys(item)
        keys.forEach((e, p) => {
          params['Goods.' + i + '.' + e] = item[e]
        })
      })
      this.loading = true
      this.active++
      this.axios.post(GENERATE_DEALS, params).then(res => {
        if (res.Response !== undefined) {
          if (res.Response.Error === undefined) {
            this.OrderIds = res.Response.OrderIds
            this.PayDeals()
          } else {
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        }
      }).then(() => { this.loading = false })
    },
    // 价格展示
    showPrice  (number, decimals = 0, decPoint = '.') {
      number = (number + '').replace(/[^0-9+-Ee.]/g, '')
      let n = !isFinite(+number) ? 0 : +number
      let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
      let dec = (typeof decPoint === 'undefined') ? '.' : decPoint
      let s = ''
      let toFixedFix = function (n, prec) {
        let k = Math.pow(10, prec)
        return '' + Math.ceil(n * k) / k
      }
       s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
      if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
      }
       return s.join(dec)
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
      padding:0 30px;
      .table-div{
        border-collapse:collapse;
        td:nth-child(1){
          padding-left:32px;
        }
        .t-head{
          border-bottom:1px solid #ddd;
          height:30px;
          font-weight:bold;
          font-size:14px;
          td{
             padding:20px 35px 20px 35px;
          }
        }
        .t-body{
          border-bottom:1px solid #ddd;
          padding:30px 0;
          font-size:14px;
          td{
             padding:20px 30px 20px 32px;
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