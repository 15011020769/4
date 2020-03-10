<template>
  <div class="wrap">
    <div class="topTit">
      <div class="topTitCenterR">
        {{ $t("DDOS.Protective.professionalEdition") }}
      </div>
    </div>
    <div class="contentMain">
      <div class="contentMainCenter newClear">
        <div class="leftContent">
          <ul>
            <li>
              <div class="checkList newClear">
                <div class="checkListLeft">
                  {{ $t("DDOS.choose.regional") }}
                </div>
                <div class="checkListRight">
                  <div>
                    <span
                      class="address spanList"
                      :class="type1 == '1' ? 'seceltList' : ''"
                      @click="checkAddress(1, '台湾台北')"
                      >{{ city }}</span
                    >
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="checkList newClear">
                <div class="checkListLeft">
                  {{ $t("DDOS.choose.MinimumProtection") }}
                </div>
                <div class="checkListRight">
                  <div>
                    <span
                      v-for="(item, index) in Gbps"
                      :key="index"
                      class="spanList"
                      :class="GbpsIndex == index ? 'seceltList' : ''"
                      @click="_Gbps(index, item.name)"
                      >{{ item.name }}Gbps</span
                    >
                    <!-- <span
                      class="spanList"
                      :class="type2==1?'seceltList':''"
                      @click="checkListTwo(1,'20Gbps')"
                    >20Gbps</span>-->
                  </div>
                </div>
              </div>
              <div class="checkList newClear">
                <div class="checkListLeft">
                  {{ $t("DDOS.choose.CCMinimum") }}
                </div>
                <div class="checkListRight">
                  <span class="textList">{{ ccText }}</span>
                </div>
              </div>
            </li>
            <li>
              <div class="checkList newClear">
                <div class="checkListLeft">
                  {{ $t("DDOS.choose.ElasticProtection") }}
                </div>
                <div class="checkListRight">
                  <div>
                    <span
                      v-for="(item, index) in Gbps[GbpsIndex].child"
                      :key="index"
                      class="spanList"
                      :class="GbpsChildIndex == index ? 'seceltList' : ''"
                      @click="_GbpsChild(index, item)"
                      >{{ showGbpsInfo(index, item) }}</span
                    >
                    <!-- >{{item}}Gbps</span> -->
                    <!-- <span
                      class="spanList"
                      :class="type3==index?'seceltList':''"
                      @click="checkListThree(index,item)"
                      v-for="(item,index) in ElasticPeak"
                      :key="index"
                    >{{item}}</span>-->
                  </div>
                  <div class="tipList">
                    <p class="tipListOne">
                      {{ $t("DDOS.choose.chooseTitle") }}
                    </p>
                    <p class="tipListTwo">
                      {{ $t("DDOS.choose.chooseTitles") }}
                    </p>
                  </div>
                </div>
              </div>
              <div class="checkList newClear">
                <div class="checkListLeft">
                  {{ $t("DDOS.choose.BusinessMetrics") }}
                </div>
                <div class="checkListRight">
                  <div>
                    <!-- 业务带宽最低是50M起卖，最大为1G不是2G -->
                    <span
                      class="spanList"
                      :class="type4 == 1 ? 'seceltList' : ''"
                      @click="checkListFour(1, '50Mbps')"
                      >50Mbps</span
                    >
                    <span
                      class="spanList"
                      :class="type4 == 2 ? 'seceltList' : ''"
                      @click="checkListFour(2, '100Mbps')"
                      >100Mbps</span
                    >
                    <span
                      class="spanList"
                      :class="type4 == 3 ? 'seceltList' : ''"
                      @click="checkListFour(3, '150Mbps')"
                      >150Mbps</span
                    >
                    <span
                      class="spanList"
                      :class="type4 == 4 ? 'seceltList' : ''"
                      @click="checkListFour(4, '200Mbps')"
                      >200Mbps</span
                    >
                    <span
                      class="spanList"
                      :class="type4 == 5 ? 'seceltList' : ''"
                      @click="checkListFour(5, '500Mbps')"
                      >500Mbps</span
                    >
                    <span
                      class="spanList"
                      :class="type4 == 6 ? 'seceltList' : ''"
                      @click="checkListFour(6, '1Gbps')"
                      >1Gbps</span
                    >
                    <!-- <span class="spanList" :class="type4==6?'seceltList':''" @click="checkListFour(6,'2Gbps')">2Gbps</span> -->
                  </div>
                  <div class="tipList">
                    <!-- 移除免費贈送100M的業務頻寬 -->
                    <!-- <p class="tipListThree">{{$t('DDOS.choose.toBychoose')}}</p> -->
                    <p class="tipListThree">
                      {{ $t("DDOS.choose.bandwidth") }}: {{ checked4 }}
                    </p>
                    <p class="tipListThree">HTTP: {{ checkChange1 }}QPS</p>
                    <p class="tipListThree">HTTPS: {{ checkChange2 }}QPS</p>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="checkList newClear">
                <div class="checkListLeft">{{ $t("DDOS.choose.byTime") }}</div>
                <div class="checkListRight">
                  <div>
                    <span
                      class="spanList"
                      :class="type5 == 1 ? 'seceltList' : ''"
                      @click="checkListFive(1, '1个月')"
                      >1个月</span
                    >
                    <span
                      class="spanList"
                      :class="type5 == 2 ? 'seceltList' : ''"
                      @click="checkListFive(2, '2个月')"
                      >2个月</span
                    >
                    <span
                      class="spanList"
                      :class="type5 == 3 ? 'seceltList' : ''"
                      @click="checkListFive(3, '3个月')"
                      >3个月</span
                    >
                    <span
                      class="spanList"
                      :class="type5 == 4 ? 'seceltList' : ''"
                      @click="checkListFive(4, '4个月')"
                      >4个月</span
                    >
                    <span
                      class="spanList"
                      :class="type5 == 5 ? 'seceltList' : ''"
                      @click="checkListFive(5, '5个月')"
                      >5个月</span
                    >
                    <span
                      class="spanList"
                      :class="type5 == 6 ? 'seceltList' : ''"
                      @click="checkListFive(6, '6个月')"
                    >
                      6个月</span
                    >
                    <span
                      class="spanList"
                      :class="type5 == 7 ? 'seceltList' : ''"
                      @click="checkListFive(7, '7个月')"
                    >
                      7个月
                    </span>
                    <span
                      class="spanList"
                      :class="type5 == 8 ? 'seceltList' : ''"
                      @click="checkListFive(8, '8个月')"
                    >
                      8个月
                    </span>
                    <span
                      class="spanList"
                      :class="type5 == 9 ? 'seceltList' : ''"
                      @click="checkListFive(9, '9个月')"
                    >
                      9个月</span
                    >
                    <span
                      class="spanList"
                      :class="type5 == 10 ? 'seceltList' : ''"
                      @click="checkListFive(10, '1年')"
                    >
                      1年
                    </span>
                    <span
                      class="spanList"
                      :class="type5 == 11 ? 'seceltList' : ''"
                      @click="checkListFive(11, '2年')"
                    >
                      2年</span
                    >
                    <span
                      class="spanList"
                      :class="type5 == 12 ? 'seceltList' : ''"
                      @click="checkListFive(12, '3年')"
                    >
                      3年
                    </span>
                    <!-- <el-tooltip placement="top" effect="light">
                      <div slot="content">3年享5折</div>
                      <span
                        class="spanList"
                        :class="type5==12?'seceltList':''"
                        @click="checkListFive(12,'3年')"
                      >
                        3年
                        <a href="#" class="spanListPosi">惠</a>
                      </span>
                    </el-tooltip> -->
                  </div>
                </div>
              </div>
              <div class="checkList newClear">
                <div class="checkListLeft">
                  {{ $t("DDOS.choose.renewalMoney") }}
                </div>
                <div class="checkListRight">
                  <el-checkbox
                    v-model="checked"
                    @change="checkedOrNo"
                  ></el-checkbox>
                  {{ $t("DDOS.choose.accountMoney") }}
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div
          class="rightContent"
          :class="searchBarFixed == true ? 'isFixed' : ''"
        >
          <h1>{{ $t("DDOS.choose.configuration") }}</h1>
          <div class="allConList">
            <p>
              <span>{{ $t("DDOS.choose.regional") }}</span>
              <span>{{ checked1 }}</span>
            </p>
            <p>
              <span>{{ $t("DDOS.choose.MinimumProtection") }}</span>
              <span>{{ Gbps[GbpsIndex].name }}Gbps</span>
              <!-- <span>{{checked2}}</span> -->
            </p>
            <p>
              <span>{{ $t("DDOS.choose.CCMinimum") }}</span>
              <span>{{ ccText }}</span>
            </p>
            <p v-if="saveShow">
              <span>{{ $t("DDOS.choose.ElasticVal") }}</span>
              <span>{{ $t("DDOS.choose.doNotOpen") }}</span>
            </p>
            <p v-if="!saveShow">
              <span>{{ $t("DDOS.choose.ElasticProtection") }}</span>
              <span>{{ Gbps[GbpsIndex].child[GbpsChildIndex] }}Gbps</span>
              <!-- <span>{{checked3}}</span> -->
            </p>
            <p>
              <span>{{ $t("DDOS.choose.bandwidth") }}</span>
              <span>{{ checked4 }}</span>
            </p>
            <p>
              <span>HTTP(QPS)</span>
              <span>{{ checkChange1 }}</span>
            </p>
            <p>
              <span>HTTPS(QPS)</span>
              <span>{{ checkChange2 }}</span>
            </p>
            <p>
              <span>{{ $t("DDOS.choose.byTime") }}</span>
              <span>{{ checked5 }}</span>
            </p>
            <p>
              <span>{{ $t("DDOS.choose.renewalMoney") }}</span>
              <span>{{ checkOrNull }}</span>
            </p>
          </div>
          <div class="allMoney">
            <span>{{ $t("DDOS.choose.sumMoney") }}</span>
            <p>{{ this.showPrice(allMoney, 2) }}元</p>
            <button class="payBtn" @click="payPage">立即支付</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ALL_CITY, QUERY_PRICE } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  data() {
    return {
      ccText: "40,000QPS", //CC防护峰值
      ElasticPeak: [
        "无",
        "30Gbps",
        "40Gbps",
        "50Gbps",
        "60Gbps",
        "70Gbps",
        "80Gbps",
        "90Gbps",
        "100Gbps",
        "120Gbps",
        "150Gbps",
        "200Gbps",
        "250Gbps",
        "300Gbps",
        "400Gbps",
        "30Gbps",
        "6000Gbps",
        "900Gbps",
        "1.2Tbps",
        "1.7Tbps"
      ],
      Gbps: [
        {
          name: 20,
          child: [
            0,
            30,
            40,
            50,
            60,
            70,
            80,
            90,
            100,
            120,
            150,
            200,
            250,
            300,
            400
          ]
        },
        {
          name: 30,
          child: [0, 40, 50, 60, 70, 80, 90, 100, 120, 150, 200, 150, 300, 400]
        },
        {
          name: 50,
          child: [0, 60, 70, 80, 90, 100, 120, 150, 200, 250, 300, 400]
        }
      ],
      checked: false, //自动续费 否
      type1: 1,
      checked1: "台灣台北", //地域
      flag: true,
      type2: 1,
      checked2: 20, //保底防护峰值
      type3: 0,
      checked3: "无", //弹性防护峰值
      checkedRoute3: 0,
      type4: 1,
      checked4: "50Mbps", //业务规格
      checkedRoute4: 50,
      type5: 1,
      checked5: "1个月", //购买时长
      checkOrNull: "否",
      allMoney: 34500,
      checkChange1: "1500", //HTTP
      checkChange2: "1500", //HTTPS
      saveShow: true,
      searchBarFixed: false,
      city: "",
      GbpsIndex: 0,
      GbpsChildIndex: 0,
      OrderIds:[]
    };
  },
  mounted: function() {
    window.addEventListener("scroll", this.handleScroll, true); // 监听（绑定）滚轮滚动事件
  },
  created() {
    this.region();
    this.queryPrice();
  },
  methods: {
    _GbpsChild(index, item) {
      this.GbpsChildIndex = index;
      if (index === 0) {
        this.saveShow = true;
      } else {
        this.saveShow = false;
      }
      this.checkedRoute3 = item;
    },
    _Gbps(index, item) {
      this.GbpsIndex = index;
      this.type2 = index;
      this.checked2 = item;
      if (index === 1) {
        this.ccText = "70,000QPS";
      } else if (index === 2) {
        this.ccText = "150,000QPS";
      } else {
        this.ccText = "40,000QPS";
      }
      this.queryPrice();
    },
    region() {
      this.axios.get(ALL_CITY).then(data => {
        if (data === undefined || data.data === undefined) {
          this.city = "台灣台北";
        } else {
          this.city = data.data[0].zone;
        }
      });
    },
    // 默认选择中国台湾
    checkAddress(type1, checked) {
      this.type1 = type1;
      this.checked1 = checked;
    },
    //业务规格
    checkListFour(type4, checked) {
      this.type4 = type4;
      this.checked4 = checked;
      if (this.type4 === 1) {
        this.checkChange1 = 1500;
        this.checkChange2 = 1500;
        this.checkedRoute4 = 50;
      } else if (this.type4 === 2) {
        this.checkChange1 = 3000;
        this.checkChange2 = 3000;
        this.checkedRoute4 = 100;
      } else if (this.type4 === 3) {
        this.checkChange1 = 5000;
        this.checkChange2 = 3500;
        this.checkedRoute4 = 150;
      } else if (this.type4 === 4) {
        this.checkChange1 = 7000;
        this.checkChange2 = 4000;
        this.checkedRoute4 = 200;
      } else if (this.type4 === 5) {
        this.checkChange1 = 20000;
        this.checkChange2 = 7000;
        this.checkedRoute4 = 500;
      } else if (this.type4 === 6) {
        this.checkChange1 = 40000;
        this.checkChange2 = 10000;
        this.checkedRoute4 = 1000;
      }
      this.queryPrice();
    },
    //购买时长
    checkListFive(type5, checked) {
      this.type5 = type5;
      this.checked5 = checked;
      this.queryPrice();
    },
    checkedOrNo() {
      console.log(this.checked);
      if (this.checked === true) {
        this.checkOrNull = "是";
      } else {
        this.checkOrNull = "否";
      }
    },
    // 点击跳转支付页面
    payPage() {
      // 被锁定的账户无法购买资源 lock_state === '1' 表示账户为锁定状态
      if (this.$cookie.get("lock_state") === "1") {
        this.$message({
          showClose: true,
          message: this.$t("COM.lockText"),
          type: "warning"
        });
      } else {
        this.jumpPay()
      }
    },
    //滚动监听
    handleScroll: function() {
      //   const that = this
      // let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      // that.scrollTop = scrollTop
      //   console.log(that.scrollTop)
      //     if (that.scrollTop > 60) {
      //       that.btnFlag = true
      //     } else {
      //       that.btnFlag = false
      //     }
      //console.log(scrollTop,document.body.scrollHeight);
      // console.log(scrollTop)
      // let offsetTop = document.querySelector('body').offsetTop;
      // console.log(offsetTop)
      // document.documentElement.scrollTop = offsetTop.scrollHeight;
      // //console.log(document.documentElement.scrollTop)
      // offsetTop.scrollHeight < 60 ? this.searchBarFixed = true : this.searchBarFixed = false;
    },
    destroyed() {
      window.removeEventListener("scroll", this.handleScroll);
    },
    showGbpsInfo(i, item) {
      if (i === 0) {
        return "无";
      } else {
        return item + "Gbps";
      }
    },
    // 查询价格
    queryPrice() {
      let GoodsDetail = {
        bandwidth: this.checked2, // 保底带宽
        gfbandwidth: this.checkedRoute4, // 业务带宽
        rule_count: 60, // 转发规则数
        pid: "14306",
        timeSpan: this.type5, // 购买时长
        timeUnit: "m"
      };
      let json = JSON.stringify(GoodsDetail);
      let ResInfo = [
        {
          RegionId: 39,
          ZoneId: 0,
          GoodsCategoryId: 100615,
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
            this.allMoney = res.Response.PriceInfos[0].TotalCost;
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
      console.log(number)
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
};
</script>
<style lang="scss">
.wrap {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.newClear:after {
  display: block;
  clear: both;
  content: "";
}
.topTit {
  width: 100%;
  background-color: #fff;
  -webkit-box-shadow: 0 2px 3px #e2e9ee;
  box-shadow: 0 2px 3px #e2e9ee;
  height: 50px;
  .topTitCenterR {
    margin: 0 auto;
    line-height: 50px;
    font-size: 16px;
    font-weight: 700;
    padding: 0 20px;
    box-sizing: border-box;
  }
}
.contentMain {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  .contentMainCenter {
    flex: 1;
    margin: 0 auto;
    display: flex;
    .leftContent {
      flex: 1;
      padding: 15px 20px;
      background-color: #fff;
      -webkit-box-shadow: 0 2px 3px #e2e9ee;
      box-shadow: 0 2px 3px #e2e9ee;
      ul {
        li {
          padding: 15px 0;
          border-bottom: 1px solid #e4e9f0;
          .checkList {
            padding: 15px 0;
            .checkListLeft {
              float: left;
              width: 130px;
              line-height: 30px;
              color: #666;
              font-size: 14px;
            }
            .checkListRight {
              float: left;
              line-height: 28px;
              width: 724px;
              .tipList {
                font-size: 12px;
                padding: 12px 0;
                .tipListOne {
                  color: #999;
                  line-height: 16px;
                }
                .tipListTwo {
                  color: red;
                }
                .tipListThree {
                  color: #999;
                }
              }
              .spanList {
                width: 100px;
                height: 33px;
                line-height: 33px;
                text-align: center;
                color: #444;
                font-size: 12px;
                margin-bottom: 10px;
                border: 1px solid #ddd;
                display: inline-block;
                position: relative;
                cursor: pointer;
                :hover {
                  background-color: #f2f2f2;
                }
                .spanListPosi {
                  position: absolute;
                  right: 0;
                  top: 0;
                  width: 18px;
                  height: 18px;
                  border-radius: 2px;
                  color: #fff;
                  font-size: 12px;
                  text-align: center;
                  line-height: 18px;
                  background-color: #ff7200;
                }
              }
              .textList {
                color: #999;
              }
            }
          }
        }
      }
    }
    .rightContent {
      width: 25%;
      background-color: #fff;
      -webkit-box-shadow: 0 2px 3px #e2e9ee;
      box-shadow: 0 2px 3px #e2e9ee;
      padding: 0 20px 20px;
      margin-left: 20px;
      h1 {
        padding: 15px 0;
        border-bottom: 1px solid #ddd;
        font-size: 16px;
        font-weight: 400;
      }
      .allConList {
        padding: 20px 0 5px;
        border-bottom: 1px solid #ddd;
        p {
          margin-bottom: 20px;
          font-size: 14px;
          span:nth-child(1) {
            width: 130px;
            display: inline-block;
            line-height: 14px;
          }
          span:nth-child(2) {
            display: inline-block;
            line-height: 14px;
            font-size: 12px;
            color: #999;
          }
        }
      }
      .allMoney {
        padding: 20px 0 10px;
        span {
          font-size: 14px;
          color: #666;
        }
        p {
          margin: 16px 0 22px;
          font-size: 25px;
          font-weight: 500;
          color: #ed711f;
        }
        .payBtn {
          width: 100px;
          height: 35px;
          color: #fff;
          line-height: 35px;
          text-align: center;
          background-color: #006eff;
          border: 0;
        }
      }
    }
  }
}
.spanList:hover {
  background-color: #f2f2f2;
}
.seceltList {
  border: 1px solid #006eff !important;
  color: #006eff !important;
}
.isFixed {
  position: fixed;
  background-color: #fff;
  top: 60px;
  z-index: 999;
}
</style>