<template>
  <div class="stream-wrap">
    <Echart
      :xAxis="xAxis1"
      :series="series1"
      :legendText="legendText1"
      v-loading="loading"
      v-if="showEchart"
      :tooltip="{
        trigger: 'axis',
        formatter: `{b}<br/>{a}  {c}Mbps`
      }"
    />
    <div class="empty" v-else>暫無數據</div>
    <Echart
      :xAxis="xAxis1"
      :series="series2"
      :legendText="legendText2"
      v-loading="loading"
      v-if="showEchart"
      color="#0accac"
      :tooltip="{
        trigger: 'axis',
        formatter: `{b}<br/>{a}  {c}MB`
      }"
    />
    <div class="empty" v-else>暫無數據</div>
    <Echart
      :xAxis="xAxis1"
      :series="series3"
      :legendText="legendText3"
      v-loading="loading"
      v-if="showEchart"
      color="#fa970c"
    />
    <div class="empty" v-else>暫無數據</div>
  </div>
</template>

<script>
import Echart from "../../components/line";
import moment from "moment";
import { CSS_STREAMPLAY } from "@/constants";
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
      legendText1: "",
      legendText2: "",
      legendText3: "",
    }
  },
  components: {
    Echart,
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
    init() {
      this.loading = true;
      const axix1 = []
      const series1 = []
      const series2 = []
      const series3 = []
      const params = {
        Version: "2018-08-01",
        StreamName: this.StreamName,
        StartTime: moment(this.StartTime).format("YYYY-MM-DD HH:mm:ss"),
        EndTime: moment(this.EndTime).format("YYYY-MM-DD HH:mm:ss"),
      };
      this.axios.post(CSS_STREAMPLAY, params).then(res => {
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
            this.legendText1 = '帶寬'
            this.legendText2 = '流量'
            this.legendText3 = '併發連接數'
            res.Response.DataInfoList.map(v => {
              axix1.push(moment(v.Time).format('YYYY-MM-DD HH:mm:ss'))
              series1.push(v.Bandwidth)
              series2.push(v.Flux)
              series3.push(v.Online)
            })
            this.xAxis1 = axix1
            this.series1 = series1
            this.series2 = series2
            this.series3 = series3
          } else {
            this.showEchart = false
          }
        }
        this.loading = false;
      })
    },
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
  }
</style>
