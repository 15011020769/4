<template>
  <div>
    <div class="wrapperContent">
      <p class="down">
        <el-row class="timeListTop newClear">
          <el-select
            v-model="selectValue"
            filterable
            allow-create
            class="selectDomin"
            default-first-option
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button-group class="buttonDateCheck">
            <el-button @click="checkTime(1)" :class="thisType=='1'?'addStyleBtn':''">今天</el-button>
            <el-button @click="checkTime(2)" :class="thisType=='2'?'addStyleBtn':''">昨天</el-button>
            <el-button @click="checkTime(3)" :class="thisType=='3'?'addStyleBtn':''">近7天</el-button>
          </el-button-group>
          <el-date-picker
            v-model="dateTimeValue"
            type="daterange"
            class="dateTimeValue"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-row>
        <el-row class="iconBtn">
          <i class="el-icon-download"></i>
          <i class="el-icon-refresh"></i>
          <i class="el-icon-setting"></i>
        </el-row>
      </p>
      <div class="contentNum">
        <el-row>
          <el-col :span="8">
            <div class="rowContain">
              <p>
                <span class="green">0</span>
                <span>bps</span>
              </p>
              <p>上行带宽峰值</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="rowContain">
              <p>
                <span class="oarnge">0</span>
                <span>bps</span>
              </p>
              <p>下行带宽峰值</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="rowContain">
              <p>
                <span class="blue">0</span>
                <span>QPS</span>
              </p>
              <p>请求峰值</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="echartsShow">
        <div id="echarts" ref="chart"></div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
export default {
  data() {
    return {
      options: [
        {
          value: "ALL",
          label: "ALL"
        },
        {
          value: "www.baidu.com",
          label: "domin"
        }
      ], //默认下拉选项
      dateTimeValue: "", //日期绑定
      selectValue: [], //域名下拉菜单
      thisType: "1", //按钮默认选中
      endTime: "",
      startTime: ""
    };
  },
  mounted () {
    var _this=this;
    setTimeout(function(){
      _this.initCharts()
    },1000)
　},
  methods: {
    //时间点击事件
    checkTime(type) {
      this.thisType = type;
      var ipt1 = document.querySelector(".dateTimeValue input:nth-child(2)");
      var ipt2 = document.querySelector(".dateTimeValue input:nth-child(4)");
      const end = new Date();
      const start = new Date();
      if (type == "1") {
        start.setTime(start.getTime() - 3600 * 1000 * 24);
      } else if (type == "2") {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
        end.setTime(end.getTime() - 3600 * 1000 * 24);
      } else if (type == "3") {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      }
      ipt1.value = moment(start).format("YYYY-MM-DD");
      ipt2.value = moment(end).format("YYYY-MM-DD");
      this.startTime = moment(start).format("YYYY-MM-DD");
      this.endTime = moment(end).format("YYYY-MM-DD");
    },
    //图表
    initCharts() {
      let myChart = this.$echarts.init(this.$refs.chart);
      // console.log(this.$refs.chart); // 绘制图表
      myChart.setOption({
        color: ["rgb(124, 181, 236)"],
        title: { text: "" },
        tooltip: {},
        xAxis: {
          data:  ["12-05", "12-04", "12-03", "12-02", "12-01"]
          // type : 'time',
          // minInterval: 1
        },
        yAxis: {
          axisLine: {
            //y轴
            show: false
          },
          axisTick: {
            //刻度线
            show: false
          },
          splitLine: {
            //网格线
            show: true
          },
          axisLabel: {
            formatter: "{value}"
          },
          boundaryGap: true
        },
        series: [
          {
            name: "WEB攻击次数",
            type: "line",
            data: [0,1,2,3,4,5],
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "rgb(124, 181, 236)"
                }
              }
            }
          },
          {
            name: "CC攻击次数",
            type: "line",
            data: [0,1,2,3,4,5],
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "rgb(124, 181, 236)"
                }
              }
            }
          }
        ],
        legend: {
          data:['WEB攻击次数','CC攻击次数'],
          //默认横向布局，纵向布局值为'vertical'
          orient: "vertical",
          x: "center", //可设定图例在左、右、居中
          y: "bottom",
          icon: "line", //图例样式
          textStyle: {
            //文字样式
            fontWeight: "bold"
          },
          lineStyle: {
            color: "#000"
          }
        }
      });
      // myChart.resize();
      // window.addEventListener("resize", function() {
      //   myChart.resize();
      // });
    }
  }
};
</script>
<style lang="scss" scoped>
.wrapperContent {
  padding: 0 20px 20px;
  ::v-deep .el-input__inner {
    height: 30px;
    line-height: 30px;
    border-radius: 0;
  }
  .newClear:after {
    content: "";
    display: inline-block;
    clear: both;
  }
  button {
    height: 30px;
    line-height: 30px;
    border-radius: 0;
  }
  .down {
    width: 100%;
    height: 30px;
    margin: 5px 0 10px 0;
    display: flex;
    justify-content: space-between;
    .timeListTop {
      margin-bottom: 12px;
      .selectDomin {
        margin-right: 10px;
        float: left;
      }
      .buttonDateCheck {
        float: left;
        button {
          padding: 0 20px;
        }
        .addStyleBtn {
          background-color: #006eff !important;
          color: #fff;
        }
      }
      .dateTimeValue {
        ::v-deep .el-range__icon {
          line-height: 26px;
        }
        ::v-deep .el-range-separator {
          line-height: 26px;
          width: 7%;
        }
      }
    }
    .iconBtn {
      font-size: 16px;
      color: #888;
      display: flex;
      align-items: center;
      > i {
        margin: 0 10px;
        font-weight: 600;
      }
      i:hover {
        cursor: pointer;
      }
    }
  }
  .contentNum {
    width: 100%;
    height: 110px;
    padding: 15px 0;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    margin-bottom: 20px;
    .rowContain {
      text-align: center;
      p:nth-child(1) {
        margin-bottom: 16px;
        font-size: 14px;
        span:nth-child(1) {
          font-size: 36px;
        }
        span.green {
          color: #29CC85;
        }
        span.oarnge {
          color: #ff9d00;
        }
        span.blue {
          color: #006eff;
        }
      }
    }
  }
  .echartsShow {
    width: 100%;
    height: 378px;
    padding: 15px 0;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    #echarts {
      width: 100%;
      height: 300px;
      div{
        width:100%;
      }
    }
  }
}
</style>