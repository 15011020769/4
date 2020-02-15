<template>
  <div class="wrap">
    <div class="head" id="head">
      <NavHeader></NavHeader>
    </div>
    <div class="body" id="main">
      <div class="bodyTitle">
        <p>验证码服务</p>
      </div>
      <div class="content">
        <div class="contentChoose">
          <div class="packAgesNum">
            <div class="numLeft">
              <p style="font-size:15px">次数包</p>
            </div>
            <div class="numRight">
               <el-radio-group v-model="quantity">
                <el-radio-button :label="20">20万次</el-radio-button>
                <el-radio-button :label="100">100万次</el-radio-button>
                <el-radio-button :label="500">500万次</el-radio-button>
                <el-radio-button :label="1000">1000万次</el-radio-button>
                <el-radio-button :label="10000">1亿次</el-radio-button>
                <el-radio-button :label="100000">10亿次</el-radio-button>
              </el-radio-group>
              <p style="font-size:13px;padding-top:15px;color:#999;">次数包用完后，超出次数会按照0.005元/次日结。</p>
              <p
                style="font-size:13px;padding-top:15px;color:#999;"
              >以上流量包最高可支持QPS 1000,如需购买更高上限流量包,请点击提交工单联系我们，我们将提供专人为您服务</p>
            </div>
          </div>
          <div class="period">
            <div class="numLeft">
              <p style="font-size:15px">有效期</p>
            </div>
            <div class="numRight">
              <el-button type="primary" size="small">一年</el-button>
              <p style="margin-top:15px;color:#999;">1年内未使用完的次数自动过期</p>
            </div>
          </div>
        </div>
        <div class="contentPrice">
           <div class="numLeft">
              <p style="font-size:15px">费用:</p>
            </div>
            <div class="numRight">
              <div style="margin-bottom:15px;">
                <p v-show="query" style="color: #999;">费用查询中...</p>
                <p v-show="!query" style="color: #ed711f; font-size: 25px;">NT$ {{TotalCost}}</p>
              </div>
              <el-button type="primary" :disabled="loading" size="small" @click="generateDeal">立即支付</el-button>
            </div>
        </div>
      </div>
    </div>
    <div class="foot" id="foot">
      <p style="color:white;dispaly:flex;align-items: center;margin-top:15px">
        <span>隐私权声明</span>
        <span style="padding-left:30px">服务条款</span>
        <span style="padding-left:30px">营业规章与服务契约</span>
        <span style="padding-left:30px">著作权保护公告</span>
        <span style="padding-left:30px">关于我们</span>
      </p>
      <p style="color:white">客户服务专线: 0809-016-888 台富云科技股份有限公司</p>
    </div>
  </div>
</template>

<script>
import NavHeader from "@/components/HeaderAside/Header";
import { ES_PRICE, GENERATE_DEALS } from '@/constants'
import { ErrorTips } from "@/components/ErrorTips"
export default {
  data() {
    return {
      quantity: 20,
      TotalCost: 0,
      query: true,
      loading: false,
    };
  },
  components: {
    NavHeader
  },
  watch: {
    quantity() {
      this.queryPrice()
    }
  },
  mounted() {
    this.loading = false
    this.queryPrice()
  },
  methods: {
    generateDeal() {
      this.loading = true
      this.axios.post(GENERATE_DEALS, {
        Version: '2018-07-09',
        'Goods.0.GoodsCategoryId': 101119,
        'Goods.0.RegionId': 1,
        'Goods.0.ZoneId': 0,
        'Goods.0.GoodsNum': 1,
        'Goods.0.ProjectId': 0,
        'Goods.0.PayMode': 1,
        'Goods.0.Platform': 1,
        'Goods.0.GoodsDetail': JSON.stringify({
          timeSpan: 1,
          timeUnit: 'p',
          threshold: this.quantity * 10000,
          pid: 1000772,
          [`sv_captcha_volume_${this.quantity}`]: this.quantity * 10000,
          Currency: 'CNY'
        }),
      }).then(res => {
        if (res.Response.Error === undefined) {
          this.loading = true
          this.$router.push({name: 'check', params: {totalCost: this.TotalCost, quantity: this.quantity, orderId: res.Response.OrderIds[0]}})
        } else {
          this.$message({
            message: ErrorTips[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      })
    },
    queryPrice() {
      this.query = true
      this.axios.post(ES_PRICE, {
        Version: '2018-07-09',
        PayMode: 1,
        Platform: 1,
        'ResInfo.0.GoodsCategoryId': 101119,
        'ResInfo.0.RegionId': 1,
        'ResInfo.0.ZoneId': 1,
        'ResInfo.0.GoodsNum': 1,
        'ResInfo.0.PayMode': 1,
        'ResInfo.0.GoodsDetail': JSON.stringify({
            timeSpan: 1,
            timeUnit: 'p',
            threshold: this.quantity * 10000,
            pid: 1000772,
            [`sv_captcha_volume_${this.quantity}`]: this.quantity * 10000,
            Currency: 'CNY'
          }),
      }).then(res => {
        if (res.Response.Error === undefined) {
          this.query = false
          this.TotalCost = res.Response.PriceInfos[0].TotalCost
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
  },
};
</script>
<style scoped lang="scss">
.wrap {
  width: 100%;
  height: 100%;
  background: #f2f2f2;
  position: relative;
  .body {
    width: 100%;
    background: #f2f2f2;
    .bodyTitle {
      width: 100%;
      background: white;
      padding: 15px 0px 15px 245px;
      box-shadow: 0 2px 3px #e2e9ee;
      p {
        font-size: 22px;
        font-weight: bold;
      }
    }
    .content {
      width: 1180px;
      margin: 0 auto;
      // display: flex;
      flex-direction: column;
      background: white;
      margin-top: 30px;
      margin-bottom: 30px;
      .contentChoose {
        flex: 1;
      padding: 20px;
      box-sizing: border-box;
        .packAgesNum {
          width: 100%;
          display: flex;
          
        padding: 10px;
          .numLeft {
            width: 108px;
            padding-bottom: 30px;
          }
          .numRight {
            flex: 1;
          }
        }
        .period {
          width: 100%;
          display: flex;
          
        padding: 10px;
          .numLeft {
            width: 108px;
            padding-bottom: 30px;
          }
          .numRight {
            flex: 1;
          }
        }
      }
      .contentPrice {
        width: 100%;
        display: flex;
        box-shadow:rgb(228, 233, 240) 0px -4px 4px -2px;
      padding: 30px;
      box-sizing: border-box;
          .numLeft {
            width: 108px;
            padding-bottom: 30px;
          }
          .numRight {
            flex: 1;
          }
      }
    }
  }
  .foot {
    width: 100%;
    height: 150px;
    background-color: rgb(44, 48, 58) !important;
    position: absolute;
    bottom: 0;
    text-align: center;
    line-height: 50px;
  }
}
</style>