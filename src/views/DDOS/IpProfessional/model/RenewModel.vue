<template>
  <div id="renewModel">
    <div>
      <el-dialog class="modelDetail"
        :title="$t('DDOS.protectCon.renewalPrice')"
        :visible.sync="renewShowModel"
        width="50%"
        :before-close="handleClose">
        <div class="newClear renewList">
          <div class="newClear">
            <p>{{$t('DDOS.AssetList.AssetListName')}}</p>
            <p>{{resObj.Id}}/{{resObj.Name}}</p>
          </div>
          <div class="newClear">
            <p>{{$t('DDOS.protectCon.renewalTime')}}</p>
            <p>
              <span :class="renew==1?'active':''" @click="checkListrenew(1,1)">1月</span>
              <span :class="renew==2?'active':''" @click="checkListrenew(2,2)">2月</span>
              <span :class="renew==3?'active':''" @click="checkListrenew(3,3)">3月</span>
              <span :class="renew==4?'active':''" @click="checkListrenew(4,4)">4月</span>
              <span :class="renew==5?'active':''" @click="checkListrenew(5,5)">5月</span>
              <span :class="renew==6?'active':''" @click="checkListrenew(6,6)">6月</span>
              <span :class="renew==7?'active':''" @click="checkListrenew(7,7)">7月</span>
              <span :class="renew==8?'active':''" @click="checkListrenew(8,8)">8月</span>
              <span :class="renew==9?'active':''" @click="checkListrenew(9,9)">9月</span>
              <span :class="renew==10?'active':''" @click="checkListrenew(10,12)">1年</span>
              <span :class="renew==11?'active':''" @click="checkListrenew(11,24)">2年</span>
              <span :class="renew==12?'active':''" @click="checkListrenew(12,36)">3年</span><br/>
              <a href="#" class="dataTimeOut">有效期至 {{showTime}}</a>
            </p>
          </div>
          <div class="newClear">
            <p>{{$t('DDOS.protectCon.renewalPriceSum')}}</p>
            <p v-if ="!isQury" class="query">費用查詢中...</p>
            <p v-else class="allMoney"><i class="money">{{ this.showPrice(money, 2) }}</i>圓</p>
          </div>
        </div>
        <span class="bottomBtnU">
          <el-button class="nowPay" @click="jumpPay">{{$t('DDOS.protectCon.justBuy')}}</el-button>
          <el-button @click="handleClose">取消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { QUERY_PRICE } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'
import moment, { now, min, months } from 'moment'
export default {
  props:{
    RenewShow:Boolean
  },
  data(){
    return{
      renew:1,//续费时长
      renewIsShow:'',//模态框
      money:'35,500.00',//总计费用
      resObj: {}, //从主页面传的资源对象
      timeNum:0,
      isQury:false,
      showTime:0
    }
  },
  computed:{
    renewShowModel(){
      return this.RenewShow;
    }
  },
  methods:{
    // 数据初始化（主页面打开本模态框时调用方法）
    init (scopeRow) {
      let objTemp = JSON.parse(JSON.stringify(scopeRow));
      objTemp.Record.forEach(item => {
        console.log('item key=' + item.Key + '***item value=' + item.Value)
        if (item.Key == 'Id') {
          this.resObj.Id = item.Value;
        } else if (item.Key == 'Name') {
          this.resObj.Name = (item.Value == "" ? "未命名" : item.Value);
        } else if (item.Key === "DdosMax") {
          this.resObj.bandwidth = item.Value / 1000
        }else if (item.Key === "ServiceBandwidth") {
          this.resObj.gfbandwidth = item.Value
        }else if (item.Key === "RuleLimit") { 
          this.resObj.rule_limt = item.Value
        }else if (item.Key === "Expire") {//过期时间
          this.resObj.Expire = item.Value
        }
      })
      this.checkListrenew(1,1)
    },
    //选择续费时长
    checkListrenew(thisType,num){
      this.renew=thisType
      this.timeNum = num
      this.showTime = moment(this.resObj.Expire).add(this.timeNum,"months").format("YYYY-MM-DD HH:mm:ss")
      this.queryPrice()
    },
    handleClose(){
      this.renewIsShow=false;
      this.$emit("closeRenewModel",this.renewIsShow)
    },
     // 查询价格
    queryPrice() {
      this.isQury = false
      let GoodsDetail = {
        bandwidth: this.resObj.bandwidth, // 保底带宽
        gfbandwidth: this.resObj.gfbandwidth, // 业务带宽
        rule_count:  this.resObj.rule_limt, // 转发规则数
        pid: "14306",
        timeSpan: this.timeNum, // 购买时长
        timeUnit: "m"
      };
      let json = JSON.stringify(GoodsDetail);
      let ResInfo = [
        {
          RegionId: 39,
          ZoneId: 0,
          GoodsCategoryId: 100616,
          Currency: "CNY",
          GoodsNum: 1,
          PayMode: 1,
          GoodsDetail: json
        }
      ];
      let params = {
        Version: "2018-07-09",
        Region: "ap-taipei",
        PayMode: 1,
        Platform: 1
      };
      ResInfo.forEach((item, i) => {
        let keys = Object.keys(item)
        keys.forEach((e, p) => {
          params['ResInfo.' + i + '.' + e] = item[e]
        })
      })
      this.axios.post(QUERY_PRICE, params).then(res => {
        if (res.Response !== undefined) {
          if (res.Response.Error === undefined) {
            this.money =  res.Response.PriceInfos[0].TotalCost
            this.testPrice = res.Response.PriceInfos[0].totalCost_rmb
            this.isQury = true
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
      });
    },
     jumpPay () {
       let GoodsDetail = {
        bandwidth: this.resObj.bandwidth, // 保底带宽
        gfbandwidth: this.resObj.gfbandwidth, // 业务带宽
        rule_count:  this.resObj.rule_limt, // 转发规则数
        pid: "14306",
        timeSpan: this.timeNum, // 购买时长
        timeUnit: "m"
      };
      let json = JSON.stringify(GoodsDetail);
       let params = {
          savePeak: this.resObj.bandwidth,
          BusinessBroadband: this.resObj.gfbandwidth,
          shareNum: this.resObj.rule_limt,
          payMoney: this.money,
          payTimeNum: this.timeNum,
          address: '',
          elasticPeak: '',
          httpQPS: '',
          httpsQPS: '',
          autoPay:'',
          goodsId: 100616,
          goodsInfo:json
        };
        let objStr = JSON.stringify(params);
        sessionStorage.setItem("allData", [objStr]);
        this.$router.replace({
          name: "pay"
        });
    },
    // 展示价格
    showPrice(number, decimals = 0, decPoint = ".", thousandsSep = ",") {
      number = (number + "").replace(/[^0-9+-Ee.]/g, "");
      let n = !isFinite(+number) ? 0 : +number;
      let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
      let sep = typeof thousandsSep === "undefined" ? "," : thousandsSep;
      let dec = typeof decPoint === "undefined" ? "." : decPoint;
      let s = "";
      let toFixedFix = function(n, prec) {
        let k = Math.pow(10, prec);
        return "" + Math.ceil(n * k) / k;
      };
      s = (prec ? toFixedFix(n, prec) : "" + Math.round(n)).split(".");
      let re = /(-?\d+)(\d{3})/;
      while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
      }
      if ((s[1] || "").length < prec) {
        s[1] = s[1] || "";
        s[1] += new Array(prec - s[1].length + 1).join("0");
      }
      return s.join(dec);
    },
  }
}
</script>
<style lang="scss">
#renewModel{
  .newClear:after{
    display: block;
    content:'';
    clear:both;
  }
  .modelDetail{
    .el-dialog__title{
      font-size:14px;
      font-weight:600;
    }
  }
  .renewList{
    div{
      margin-bottom:20px;
      font-size: 12px;
      p:nth-child(1){
        color:#999;
        float:left;
        width:95px;
      }
      p:nth-child(2){
        float:left;
        width:calc(100% - 95px);
        color:#444;
        span{
          width:64px;
          display:inline-block;
          text-align:center;
          height:30px;
          line-height: 30px;
          color:#444;
          border:1px solid #ddd;
          position:relative;
          i{
            position: absolute;
            top:0;
            right:3px;
            width:18px;
            height:18px;
            border-radius: 2px;
            color:#fff;
            background-color:#ff7a4b;
            text-align:center;
            line-height: 18px;
            font-style: normal;
          }
        }
        .active{
          border:1px solid #006eff;
          color:#006eff;
        }
        .dataTimeOut{
          color:#999;
          font-size:12px;
        }
      }
      p:nth-child(2).allMoney{
        color:#ff7a4b;
        .money{
          font-size:26px;
          font-weight: 600;
          font-style: normal;
        }
      }
    }
  }
  .bottomBtnU{
    display:block;
    text-align:center;
    width:100%;
    button{
      height:30px;
      line-height: 30px;
      width:70px;
      padding:0;
      text-align:center;
      border-radius: 0;
      font-size:12px;
    }
    .nowPay{
      background-color:#006eff;
      color:#fff;
    }
    .query {
          font-size: 14px;
          font-weight: 500;
          color: #666;
        }
  }
}
</style>