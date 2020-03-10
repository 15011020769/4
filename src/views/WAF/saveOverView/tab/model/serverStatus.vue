<template>
 <el-row class="echartsShowSecond">
    <el-col :span="12">
    <h3 class="topfont">
      {{t('服务器响应状态', 'WAF.fwqxyzt')}}
      <span style="color:#bbb;">(次)</span>
    </h3>
    <el-row class="empty" v-if="seriesPieServer.length == 0 ? true : false">{{t('暂无数据', 'WAF.zwsj')}}</el-row>
    <EPie
      :series="seriesPieServer"
      :color="colorPie"
      :legendText="legendTextPieServer"
      v-loading="loading"
      v-else
    />
    </el-col>
    <el-col :span="12">
    <h3 class="topfont">
      {{t('浏览器类型', 'WAF.llqlx')}}
      <span style="color:#bbb;">(次)</span>
    </h3>
    <el-row class="empty" v-if="seriesPieBrowser.length == 0 ? true : false">{{t('暂无数据', 'WAF.zwsj')}}</el-row>
    <EPie
      :series="seriesPieBrowser"
      :color="colorPie"
      :legendText="legendTextPieBrowser"
      v-loading="loading"
      :left="'46%'"
      v-else
    />
    </el-col>
  </el-row>
</template>
<script>
import moment from "moment";
import { DESCRIBE_PIECHART } from '@/constants'
import EPie from "../../components/pie"
export default {
  props: {
    times: Array,
    domain: String,
    showModules: Array,
    id: Number,
  },
  components: {
    EPie
  },
  data() {
    return {
      seriesPieServer: [], // 服务器响应状态
      legendTextPieServer: [], // 服务器响应状态
      seriesPieBrowser: [], // 浏览器类型
      legendTextPieBrowser: [], // 浏览器类型
      colorPie: ['#006eff', '#434348', '#74BD48', "#F7A35C", "#8D62AE"],
      loading: true
    }
  },
  watch: {
    showModules(val, oldVal) {
      if (val.join() !== oldVal.join()) {
        this.init()
      }
    },
    times(val, oldVal) {
      if (
        val[0] !== oldVal[0]
        || val[1] !== oldVal[1]
      ) {
        this.init()
      }
    },
    domain(val, oldVal) {
      if (val !== oldVal) {
        this.init()
      }
    },
     id() {
      this.init()
    },
  },
  mounted() {
    this.getPieChart("us");
    this.getPieChart("ua");
  },
  methods: {
    init() {
      this.getPieChart("us");
      this.getPieChart("ua");
    },
    // 获取服务器响应浏览器类型
    getPieChart(type) {
      this.loading = true
      const params = {
        Version: '2018-01-25',
        FromTime: this.times[0],
        ToTime: this.times[1],
        QueryField: type,
        Host: "all",
        Edition: "clb-waf"
      }
      if (this.domain) {
        params["Host"] = this.domain
      }
      if (type == "us") {
        this.axios.post(DESCRIBE_PIECHART, params).then((resp) => {
          let usArrCount = []
          let usLegend = []
          this.generalRespHandler(resp, ({Data: {Piechart}}) => {
            Piechart && Piechart.map(v => {
              usArrCount.push({value: JSON.parse(v).count, name: JSON.parse(v).us,})
              usLegend.push(JSON.parse(v).us)
            })
            this.seriesPieServer = usArrCount
            this.legendTextPieServer = usLegend
          })
        }).then(() => {
            this.loading = false
          })
      } else if (type == "ua") {
        this.axios.post(DESCRIBE_PIECHART, params).then((resp) => {
          let uaArrCount = []
          let uaLegend = []
          this.generalRespHandler(resp, ({Data: {Piechart}}) => {
            Piechart && Piechart.map(v => {
              uaArrCount.push({value: JSON.parse(v).count, name: JSON.parse(v).ua,})
              uaLegend.push(JSON.parse(v).ua)
            })
            this.seriesPieBrowser = uaArrCount
            this.legendTextPieBrowser = uaLegend
          })
        }).then(() => {
          this.loading = false
        })
      }
    },
  }
}
</script>
<style lang="scss" scoped>
.echartsShowSecond {
    width: 100%;
    height: 258px;
    padding: 20px 0;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    margin-top: 20px;
    .topfont{
      padding-left: 20px;
    }
    .empty {
      height: 200px;
      width: 100%;
      line-height: 200px;
      text-align: center;
      font-weight: bold
    }
  }
</style>