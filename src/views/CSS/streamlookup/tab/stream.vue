<template>
  <div class="stream-wrap">
    <el-button type="text" size="mini" class="excel_part" @click="exportEchart">導出數據</el-button>
    <Echart
      :xAxis="xAxis1"
      :series="series1"
      :legendText="legendText1"
      v-loading="loading"
      v-if="showEchart"
      :tooltip="{
        trigger: 'axis',
        formatter: `{b}<br/>{a}  {c}fps`
      }"
    />
    <div class="empty" v-else>暫無數據，請核實流ID和查詢時段</div>
    <Echart
      :xAxis="xAxis1"
      :series="series2"
      :legendText="legendText2"
      v-loading="loading"
      v-if="showEchart"
      :tooltip="{
        trigger: 'axis',
        formatter: `{b}<br/>{a}  {c}bps`
      }"
    />
    <div class="empty" v-else>暫無數據，請核實流ID和查詢時段</div>
    <Echart
      :xAxis="xAxis1"
      :series="series3"
      :legendText="legendText3"
      v-loading="loading"
      v-if="showEchart"
      :tooltip="{
        trigger: 'axis',
        formatter: `{b}<br/>{a}  {c}fps`
      }"
    />
    <div class="empty" v-else>暫無數據，請核實流ID和查詢時段</div>
    <Echart
      :xAxis="xAxis1"
      :series="series4"
      :legendText="legendText4"
      v-loading="loading"
      v-if="showEchart"
      :tooltip="{
        trigger: 'axis',
        formatter: `{b}<br/>{a}  {c}bps`
      }"
    />
    <div class="empty" v-else>暫無數據，請核實流ID和查詢時段</div>
    <div class="stream-table">
      <!-- <p>详细信息</p> -->
      <!-- <XTimeD v-on:switchData="GetDat" :classsvalue="value"></XTimeD> -->
    </div>
  </div>
</template>

<script>
import moment from "moment";
import XLSX from 'xlsx'
import Echart from "../../components/line";
import XTimeD from "@/components/public/TimeD";
import { CSS_STREAMPUSH } from "@/constants";
export default {
  name:'stream',
  data(){
    return{
      loading: true, //加载状态
      showEchart: true,
      value: 1,
      xAxis1: [],
      series1: [],
      series2: [],
      series3: [],
      series4: [],
      legendText1: '',
      legendText2: '',
      legendText3: '',
      legendText4: '',
      line_json: [],
    }
  },
  components: {
    Echart,
    XTimeD,
  },
  props: {
    StartTime: {
      type: String
    },
    EndTime: {
      type: String
    },
    StreamName: {
      type: String
    }
  },
  created() {
    this.init();
  },
  methods: {
    exportEchart() {
      const ws = XLSX.utils.json_to_sheet(this.line_json);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "推流質量");
      XLSX.writeFile(wb, "推流質量.csv");
    },
    init() {
      this.loading = true;
      const axix1 = []
      const series1 = []
      const series2 = []
      const series3 = []
      const series4 = []
      const params = {
        Version: "2018-08-01",
        StreamName: this.StreamName,
        StartTime: moment(this.StartTime).format("YYYY-MM-DD HH:mm:ss"),
        EndTime: moment(this.EndTime).format("YYYY-MM-DD HH:mm:ss"),
      };
      let tempArr = []
      this.axios.post(CSS_STREAMPUSH, params).then(res => {
        if (res.Response.Error) {
          this.showEchart = false
           if (
              res.Response.Error.Message ==
              "param=StreamName,value=, length is zero."
            ) {
              this.$message.error("請輸入流id");
            } else {
              this.$message.error(res.Response.Error.Message);
            }
        } else {
          if (res.Response.DataInfoList.length != 0) {
            this.showEchart = true
            this.legendText1 = res.Response.DataInfoList[0].ClientIp + '影音帧率'
            this.legendText2 = res.Response.DataInfoList[0].ClientIp + '影音碼率'
            this.legendText3 = res.Response.DataInfoList[0].ClientIp + '音頻帧率'
            this.legendText4 = res.Response.DataInfoList[0].ClientIp + '音頻碼率'
            res.Response.DataInfoList.map(v => {
              axix1.push(moment(v.Time).format('YYYY-MM-DD HH:mm:ss'))
              series1.push(v.VideoFps)
              series2.push(v.VideoRate)
              series3.push(v.AudioFps)
              series4.push(v.AudioRate)
              tempArr.push({
                Time: moment(v.Time).format('YYYY-MM-DD HH:mm:ss'),
                ClientIp: v.ClientIp,
                VideoFps: v.VideoFps,
                "VideoRate(bps)": v.VideoRate,
                AudioFps: v.AudioFps,
                "AudioRate(bps)": v.AudioRate
              })
            })
            this.xAxis1 = axix1
            this.series1 = series1
            this.series2 = series2
            this.series3 = series3
            this.series4 = series4
            this.line_json = tempArr
          } else {
            this.showEchart = false
            this.line_json = [{
                Time: "",
                ClientIp: "",
                VideoFps: "",
                "VideoRate(bps)": "",
                AudioFps: "",
                "AudioRate(bps)": ""
              }]
          }
        }
        this.loading = false;
      })
    },
  //时间组件返回的数据
    // GetDat(val) {
    //   val[0].StartTIme = moment(val[0].StartTIme).format("YYYY-MM-DD HH:mm:ss");
    //   this.value = val[1];
    //   this.timeData = val;
    //   this.StartTime = this.timeData[0].StartTIme;
    //   this.EndTime = this.timeData[0].EndTIme
    //   if (this.selectStream == '1') {
    //     this.$nextTick(() => {
    //       this.$refs.tab1.init();
    //     })
    //   }
    // },
  }
}
</script>

<style lang="scss" scoped>
  .stream-wrap{
    .empty {
      width: 100%;
      height: 300px;
      background: rgb(248, 248, 248);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
    }
    .excel_part {
      position: relative;
      left: calc(100% - 60px);
      bottom: 80px;
    }
  }
</style>
