<template>

  <div class="statistReportTit">
    <div class="ReportTit newClear">
      <h3 class="ReportTitH3">{{$t('DDOS.Statistical_forms.form_title')}}</h3>
      <el-button class="ReportTitBtn" type="primary" @click="newBuy">{{$t('DDOS.Statistical_forms.new_bug')}}
      </el-button>
    </div>
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('DDOS.Statistical_forms.DDoS_Protection')" name="ddos">
          <ddosAttack ref="ddosAttack" />
        </el-tab-pane>
        <el-tab-pane :label="$t('DDOS.Statistical_forms.CC_attack_protection')" name="cc">
          <ccAttack ref="ccAttack" />
        </el-tab-pane>
        <el-tab-pane :label="$t('DDOS.Statistical_forms.business')" name="service">
          <business ref="servers" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

</template>
<script>
  import HeaderCom from "../../CLA/Public/Head";
  import moment from "moment";
  // import ddosAttack from "./tabs/ddosAttack";
  // import ccAttack from "./tabs/ccAttack";
  // import business from "./tabs/business";
  require(["./tabs/ddosAttack"], resolve)
  require(["./tabs/ccAttack"], resolve)
  require(["./tabs/business"], resolve)
  export default {
    data() {
      return {
        activeName: "ddos" //一级tab标识
      };
    },
    components: {
      ddosAttack: ddosAttack,
      ccAttack: ccAttack,
      business: business,
      HeaderCom: HeaderCom
    },
    watch: {},
    methods: {
      // 获取资源列表
      describeResourceList(data) {
        let params = {
          Version: "2018-07-09",
          Business: "net"
        };
        if (this.resourceId != "" && this.resourceId != null) {
          params["IdList.0"] = this.resourceId;
        }
        this.axios.post("dayu2/DescribeResourceList", params).then(res => {
          // console.log(res)
        });
      },

      // tab页面切换
      handleClick(tab, event) {
        this.$refs.servers.describeResourceList(); //获取资源列表的接口单独调用（因为日期变更不需要调用此接口）
        if (tab.name == "ddos") {
          //DDOS攻击防护
          this.$refs.ddosAttack.getData();
        } else if (tab.name == "cc") {
          //CC攻击防护
          this.$refs.ccAttack.getDataCC();
        } else if (tab.name == "service") {
          //业务
          // console.log(this.$refs.servers.getDataService())
          this.$refs.servers.getDataService();
        }
      },
      newBuy() {
        this.$router.push({
          path: "/choose"
        });
      },
      //时间按钮

      thisTime(thisTime) {
        var ipt1 = document.querySelector(".newDataTime input:nth-child(2)");
        var ipt2 = document.querySelector(".newDataTime input:nth-child(4)");
        const end = new Date();
        const start = new Date();
        if (thisTime == "1") {
          start.setTime(start.getTime() - 3600 * 1000);
          var num =
            end.getTime() -
            new Date(
              new Date(new Date().toLocaleDateString()).getTime()
            ).getTime();
          var arr = [];
          for (var i = 0; i <= num / 3600000; i++) {
            var d = new Date(end.getTime() - 3600000 * i);
            arr.push(moment(d).format("MM-DD HH:mm:ss"));
          }
          this.timey = arr;
        } else if (thisTime == "2") {
          //ddos攻击-攻击流量带宽
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
          ipt1.value = moment(start).format("YYYY-MM-DD HH:mm:ss");
          ipt2.value = moment(end).format("YYYY-MM-DD HH:mm:ss");
          this.startTime = ipt1.value;
          this.endTime = ipt2.value;
          this.period = 86400;
          this.timedone(end, start, 86400000);
          //ddos攻击-攻击流量带宽
        } else if (thisTime == "3") {
          //ddos攻击-攻击流量带宽
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
          ipt1.value = moment(start).format("YYYY-MM-DD HH:mm:ss");
          ipt2.value = moment(end).format("YYYY-MM-DD HH:mm:ss");
          this.startTime = ipt1.value;
          this.endTime = ipt2.value;
          this.period = 86400;
          this.timedone(end, start, 86400000);
          //ddos攻击-攻击流量带宽
        } else if (thisTime == "4") {
          //ddos攻击-攻击流量带宽
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          ipt1.value = moment(start).format("YYYY-MM-DD HH:mm:ss");
          ipt2.value = moment(end).format("YYYY-MM-DD HH:mm:ss");
          this.startTime = ipt1.value;
          this.endTime = ipt2.value;
          this.period = 86400;
          this.timedone(end, start, 86400000);
          //ddos攻击-攻击流量带宽
        } else if (thisTime == "5") {
          //ddos攻击-攻击流量带宽
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6);
          ipt1.value = moment(start).format("YYYY-MM-DD HH:mm:ss");
          ipt2.value = moment(end).format("YYYY-MM-DD HH:mm:ss");
          this.startTime = ipt1.value;
          this.endTime = ipt2.value;
          this.period = 86400;
          this.timedone(end, start, 86400000);
          //ddos攻击-攻击流量带宽
        }
        this.describeDDoSNetTrend(this.timey);
      }
    }
  };

</script>
<style lang="scss" scoped>
  .wrap>>>.el-tabs__nav-wrap {
    background: white;
    padding: 0 15px;
    box-sizing: border-box;
  }

  .wrap>>>.el-input__inner {
    height: 30px;
    line-height: 30px;
    padding-top: 0;
    border-radius: 0;
  }

  .newClear {
    content: "";
    display: block;
    clear: both;
  }

  .statistReportTit {
    width: 100%;
    height: 84px;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
    padding: 12px 20px 0;

    .ReportTitH3 {
      float: left;
      font-size: 16px;
      font-weight: 600;
    }

    .ReportTitBtn {
      float: right;
      height: 30px;
      width: 52px;
      padding: 0;
      color: #fff;
      border-radius: 0;
      background-color: #006eff;
      line-height: 30px;
      padding: 0;
      text-align: center;
    }
  }

  .mainConList {
    padding: 20px 0;
    width: 100%;

    .mainConListAll {
      width: 100%;
      min-height: 100px;
      border: 1px solid #ddd;
      margin-bottom: 20px;
      background-color: #fff;
      padding: 20px;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);

      .mainConListOneIpt {
        width: 200px;
        margin-top: 12px;
      }

      .tabsCard {
        border: none;

        .el-tabs__header {
          border: none;

          .el-tabs__nav {
            border-bottom: 1px solid #e4e7ed;
          }

          .el-tabs__item.is-active {
            color: #3e8ef7;
            border: 1px solid #3e8ef7;
          }
        }
      }
    }

    .mainConListFour {
      h3 {
        line-height: 52px;
        font-size: 14px;
        color: #000;
        font-weight: 600;
      }
    }
  }

  .tabListPage {
    text-align: right;
  }

  .ddosAttackSelect1 {
    width: 180px;
    margin-right: 12px;

    div.el-input {
      width: 180px;

      input {
        width: 180px;
        height: 30px;
        border-radius: 0;
        font-size: 12px;
      }
    }
  }

  .tabsCard {
    .el-tabs__item {
      height: 30px;
      line-height: 30px;
    }
  }

  #myChart2 {
    width: 100%;
    height: 380px;
    margin: 20px 0;
  }

  .colDivThree {
    padding: 20px;
    text-align: center;

    h1 {
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: bold;
    }

    p.count {
      color: #888 !important;
      font-size: 12px;
    }

    .dataList {
      text-align: center;
      height: 100px;
      padding-top: 44px;
      color: #888 !important;
      font-size: 12px;
    }
  }

  #myChart3 {
    width: 100%;
    height: 380px;
    margin: 20px 0;
  }

  #myChart4 {
    width: 100%;
    height: 380px;
    margin: 20px 0;
  }

  #myChart5 {
    width: 100%;
    height: 380px;
    margin: 20px 0;
  }

  .newDataTimeTwo {
    float: left;
    height: 30px !important;
    border-radius: 0 !important;
    margin-left: -1px;

    span.el-range-separator {
      line-height: 24px;
      width: 8%;
    }

    i.el-range__icon {
      line-height: 24px;
    }
  }

  .newDataTimethree {
    float: left;
    height: 30px !important;
    border-radius: 0 !important;
    margin-left: -1px;

    span.el-range-separator {
      line-height: 24px;
      width: 8%;
    }

    i.el-range__icon {
      line-height: 24px;
    }
  }

</style>
