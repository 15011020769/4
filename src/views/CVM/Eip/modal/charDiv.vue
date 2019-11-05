<template>
  <div class="eip-char" v-show="charObj.divShow" :show-close="false">
    <div>
      <p class="char-tit">{{charObj.charInfo.AddressId}}</p>
      <i class="el-icon-close" @click="charObj.divShow= false"></i>
    </div>

    <div>
      <div class="div-time">
        <!-- 时间粒度搜素 -->
        <XTimeX v-on:qiehuan="GetDat" :classsvalue="value"></XTimeX>
      </div>
      <div class="char-div">
        <!-- 表格 -->
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop>
            <template slot-scope="scope">
              <span style="font-size:12px;font-weight:bolder;">
                {{scope.row.metricName | UpName(value)}}
                <el-popover placement="bottom-start" title width="200" trigger="hover">
                  <p>{{scope.row.metricName | UpTitle(value)}}</p>
                  <i class="el-icon-warning" slot="reference"></i>
                </el-popover>
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="dataPoints" width="600">
            <template slot-scope="scope">
              <p v-if="scope.row.dataPoints[0]===null">暂无数据</p>
              <div class="echart" v-if="scope.row.dataPoints[0]!==null">
                <echart-line
                  id="diskEchearrts-line"
                  :time="timeData"
                  :opData="scope.row.dataPoints"
                  :unit="diskUnit"
                  :title="diskTitle"
                  :scale="3"
                  :period="period"
                  :xdata="false"
                ></echart-line>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div class="echart" >
          <echart-line
            id="diskEchearrts-line"
            :time="timeData"
            :unit="diskUnit"
            :title="diskTitle"
            :period="period"
            :scale="3"
            :xdata="false"
          ></echart-line>
        </div>-->
      </div>
    </div>
  </div>
</template>
<script>
import XTimeX from "@/components/Tools/TimeX";
import echartLine from "@/components/Tools/echars-line";
export default {
  data() {
    return {
      value: 1,
      ID: this.$route.query.id,
      period: "",
      diskTitle: [],
      diskUnit: "",
      opDiskData: [],
      Start_End: [],
      tableData: [], // 获取列表数据
      timeData: [] // 折线图的x轴数据
    };
  },

  props: {
    charObj: {
      type: Object,
      default: () => []
    }
  },
  components: {
    echartLine,
    XTimeX
  },
  created() {
    // console.log(this.charObj);
  },
  methods: {
    GetDat(data) {
      this.period = data[0];
      this.timeData = data[1];
      this.Start_End = data[2];
      this.value = data[3];
      const metricNArr = [
        "vip_outtraffic",
        "vip_intraffic",
        "vip_outpkg",
        "vip_inpkg"
      ];
      this.tableData = [];
      for (let i = 0; i < metricNArr.length; i++) {
        this.Obtain(metricNArr[i]);
      }
      console.log(this.tableData);
    },
    Obtain(metricN) {
      const param = {
        Region: this.$cookie.get("regionv1"),
        namespace: "qce/lb",
        metricName: metricN,
        "dimensions.0.name": 'eip',
        "dimensions.0.value": this.charObj.charInfo.AddressIp,
        period: 60,
        startTime: this.Start_End.StartTIme,
        endTime: this.Start_End.EndTIme
      };
      this.axios.post("monitor/GetMonitorData", param).then(data => {        
        this.tableData.push(data);
      });
    }
  },
  filters: {
    UpName(value) {
      if (value === "vip_outtraffic") {
        return (value = "	外网出带宽");
      }
      if (value === "vip_intraffic") {
        return (value = "外网入带宽	");
      }
      if (value === "vip_outpkg") {
        return (value = "	出包量");
      }
      if (value === "vip_inpkg") {
        return (value = "	入包量");
      }
    },
    UpTitle(value) {
      if (value === "vip_outtraffic") {
        return (value = "	外网出带宽");
      }
      if (value === "vip_intraffic") {
        return (value = "外网入带宽	");
      }
      if (value === "vip_outpkg") {
        return (value = "	出包量");
      }
      if (value === "vip_inpkg") {
        return (value = "	入包量");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.eip-char {
  position: fixed;
  right: 0;
  top: 60px;
  width: 800px;
  height: 100%;
  padding: 0 20px 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-left: 1px solid #ddd;
  box-shadow: -3px 0 3px 0 rgba(73, 73, 87, 0.12);
  z-index: 160;
  .char-tit {
    font-size: 16px;
    font-weight: bold;
    line-height: 50px;
    float: left;
  }
  .el-icon-close {
    font-size: 22px;
    font-weight: bold;
    line-height: 50px;
    float: right;
    margin-right: 20px;
  }
}
.div-time {
  margin-top: 50px;
}
</style>

