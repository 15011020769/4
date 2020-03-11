<template>
  <div id="diaologUpgradeModel">
    <div>
      <el-dialog class="modelDetail"
        :title="$t('DDOS.protectCon.upgrade')"
        :visible.sync="diaologUpgradeModel"
        width="50%"
        :before-close="handleClose"
        >
        <div class="newClear upgradeList" >
          <div class="newClear">
            <p>{{$t('DDOS.AssetList.AssetListName')}}</p>
            <p>net-0000006y/789</p>
          </div>
          <div class="newClear">
            <p>{{$t('DDOS.protectCon.CurrentMpeck')}}</p>
            <p>20Gbps</p>
          </div>
          <div class="newClear">
            <p>{{$t('DDOS.protectCon.ExpirationTime')}}</p>
            <p>2019-11-29 12：53：35</p>
          </div>
          <div class="newClear">
            <p>{{$t('DDOS.protectCon.upgradeMpeck')}}</p>
            <p>
              <span :class="type1==1?'active':''" @click="checkListSave(1,20)">20Gbps</span>
              <span :class="type1==2?'active':''" @click="checkListSave(2,30)">30Gbps</span>
              <span :class="type1==3?'active':''" @click="checkListSave(3,50)">50Gbps</span><br/>
              <a class="changeNum">{{$t('DDOS.choose.CCMinimum')}}：{{thisChnageNum}}</a>
            </p>
          </div>
          <div class="newClear">
            <p>{{$t('DDOS.protectCon.upgradeFord')}}</p>
            <p>
              <span :class="type2==1?'active':''" @click="checkListBusiness(1,50)">50Mb</span>
              <span :class="type2==2?'active':''" @click="checkListBusiness(2,100)">100Mb</span>
              <span :class="type2==3?'active':''" @click="checkListBusiness(3,150)">150Mb</span>
              <span :class="type2==4?'active':''" @click="checkListBusiness(4,200)">200Mb</span>
              <span :class="type2==5?'active':''" @click="checkListBusiness(5,500)">500Mb</span>
              <span :class="type2==6?'active':''" @click="checkListBusiness(6,1000)">1000Mb</span>
            </p>
          </div>
          <div class="newClear">
            <p>{{$t('DDOS.protectCon.upgradeRoleNum')}}</p>
            <p>
              <span :class="type3==1?'active':''" @click="checkListNum(1,60)">60</span>
              <span :class="type3==2?'active':''" @click="checkListNum(2,70)">70</span>
              <span :class="type3==3?'active':''" @click="checkListNum(3,80)">80</span>
              <span :class="type3==4?'active':''" @click="checkListNum(4,90)">90</span>
              <span :class="type3==5?'active':''" @click="checkListNum(5,100)">100</span>
              <span :class="type3==6?'active':''" @click="checkListNum(6,150)">150</span>
              <span :class="type3==7?'active':''" @click="checkListNum(7,200)">200</span>
              <span :class="type3==8?'active':''" @click="checkListNum(8,250)">250</span>
              <span :class="type3==9?'active':''" @click="checkListNum(9,300)">300</span>
            </p>
          </div>
        </div>
        <div class="upGradeTip" v-if="tipShow">
         {{$t('DDOS.protectCon.WarmPort')}}
          <i class="el-icon-close" @click="thisTipShow"></i>
        </div>
        <div class="upGradeMoney newClear">
          <p>{{$t('DDOS.protectCon.upgradeMoney')}}</p>
          <p v-if="isQury">
            <span>63300000</span>
            <span class="errorTip" v-if="errorShow">{{$t('DDOS.protectCon.EorrorLog')}}</span>
          </p>
          <p class="query" v-else>費用查詢中...</p>
        </div>
        <span class="bottomBtnU">
          <el-button :disabled="!isQury">{{$t('DDOS.protectCon.justUpgrade')}}</el-button>
          <el-button @click="handleClose">取消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { QUERY_PRICE } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'
export default {
  props:{
    Upgrade:Boolean,
    // values: Object
  },
  data(){
    return{
      UpgradeShow:'',//弹框显示隐藏
      type1:1,//升级保底防护
      type2:1,//升级业务宽带
      type3:1,//升级转发规则数
      tipShow:true,//温馨提示框
      errorShow:false,//升级费用服务器错误时的提示
      thisChnageNum:'40,000Qps',
      isQury: false,
      // resObj: {}
    }
  },
  computed:{
    diaologUpgradeModel(){
      return this.Upgrade
    }
  },
  methods: {
    // init (scopeRow) {
    //   this.resObj = JSON.parse(JSON.stringify(scopeRow))
    //    this.resObj.Record.forEach(item => {
    //     if (item.Key == "ServiceBandwidth") {
    //       this.values.bandwidth = item.Value;
    //       console.log('bandwidth = ' + item.Value)
    //     }
    //      if (item.Key == "RuleLimit") {
    //       this.values.rule = item.Value;
    //       console.log('rule = ' + item.Value)
    //     }
    //   })
    // },
    //关闭取消按钮
    handleClose(){
      this.UpgradeShow=false;
      this.$emit("closeUpgradeModel",this.UpgradeShow)
    },
    //升级保底防护
    checkListSave(thistype1,num1){
      this.type1=thistype1;
      if(this.type1==1){
        this.thisChnageNum='40,000QPS'
      }else if(this.type1==2){
        this.thisChnageNum='70,000QPS'
      }else if(this.type1==3){
        this.thisChnageNum='150,000QPS'
      }
      // console.log(num1)
      // this.values.bandwidth = num
    },
    //升级业务宽带
    checkListBusiness(thistype2,num2){
      this.type2=thistype2;
      // console.log(num2)
      // this.values.gfbandwidth = num2
    },
    //升级转发规则数
    checkListNum (thistype3, num3) {
      this.type3 = thistype3
      // console.log(num3)
      // this.values.rule = num3
    },
    //温馨提示关闭按钮
    thisTipShow(){
      this.tipShow=false;
    },
     // 查询价格
    queryPrice() {
      this.isQury = false
      let GoodsDetail = {
        // bandwidth: this.values.bandwidth, // 保底带宽
        // gfbandwidth: this.values.gfbandwidth, // 业务带宽
        // rule_count: this.values.rule, // 转发规则数
        pid: "14306",
        timeSpan: 1, // 购买时长
        timeUnit: "m"
      };
      let json = JSON.stringify(GoodsDetail);
      let ResInfo = [
        {
          RegionId: 39,
          ZoneId: 0,
          GoodsCategoryId: 100617,
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
            this.allMoney =  res.Response.PriceInfos[0].TotalCost
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
       let params = {
          address: this.checked1,
          savePeak: this.checked2,
          elasticPeak: this.checkedRoute3,
          autoPay: this.checkOrNull,
          BusinessBroadband: this.checkedRoute4,
          httpQPS: this.checkChange1,
          httpsQPS: this.checkChange2,
          shareNum: 60,
          payTime: this.checked5,
          payMoney: this.allMoney,
          payTimeNum: this.type5
        };
        let objStr = JSON.stringify(params);
        sessionStorage.setItem("allData", [objStr]);
        this.$router.push({
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
    }
  }
}
</script>
<style lang="scss">
#diaologUpgradeModel{
  .newClear:after{
    display: block;
    content:"";
    clear:both;
  }
  .modelDetail{
    .el-dialog__title{
      font-size:14px;
      font-weight:600;
    }
    .upgradeList{
      div{
        margin-bottom:16px;
        font-size:12px;
        p:nth-child(1){
          color:#999;
          float:left;
          width:95px;
        }
        p:nth-child(2){
          color:#444;
          float:left;
          width:calc(100% -95px);
          span{
            display:inline-block;
            height:30px;
            border:1px solid #ddd;
            width:64px;
            text-align:center;
            line-height:30px;
            color:#000;
          }
          .active{
            color:#006eff;
            border:1px solid #006eff;
          }
          .changeNum{
            color:#999;
          }
        }
      }
    }
    .upGradeTip{
      font-size: 12px;
      line-height: inherit;
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      border-radius: 2px;
      background: #e5f0ff;
      position: relative;
      box-sizing: border-box;
      max-width: 1360px;
      margin-left: auto;
      margin-right: auto;
      margin-bottom:20px;
      .el-icon-close{
        float:right;
        font-size:20px;
      }
    }
    .upGradeMoney{
      margin-top:20px;
      margin-bottom:20px;
      p:nth-child(1){
        float:left;
        width:95px;
        font-size:12px;
        color:#999;
      }
      p:nth-child(2){
        float:left;
        width:calc(100% - 95px);
        font-size:12px;
        .errorTip{
          color:#e54545 !important;
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
    }
     .query {
          font-size: 14px;
          font-weight: 500;
          color: #666;
        }
  }
}

</style>