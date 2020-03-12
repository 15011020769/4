<template>
  <el-row class="echartsShowFour">
    <el-col :span="12">
    <h3 class="topfont">
      {{t('响应时间最慢页面TOP5', 'WAF.xysjzmym')}}
      <span style="color:#bbb;">(毫秒)</span>
    </h3>
    <EBar
      :xAxis="xAxisBarArt"
      :series="seriesBarArt"
      :legendText="legendTextBarArt"
      v-loading="loading"
      v-if="xAxisBarArt.length == 0 ? false : true"
    />
    <el-row class="empty" v-else>暂无数据</el-row>
    </el-col>
    <el-col :span="12">
    <h3 class="topfont">
      {{t('页面访问次数TOP5', 'WAF.ymfwcs')}}
      <span style="color:#bbb;">(次)</span>
    </h3>
    <EBar
      :xAxis="xAxisBarUrl"
      :series="seriesBarUrl"
      :legendText="legendTextBarUrl"
      v-loading="loading"
      v-if="xAxisBarArt.length == 0 ? false : true"
    />
    <el-row class="empty" v-else>暂无数据</el-row>
    </el-col>
  </el-row>
</template>
<script>
import EBar from "../../components/stackBar"
import { DESCRIBE_HISTOGRAM } from '@/constants'
export default {
  props: {
    times: Array,
    domain: String,
    showModules: Array,
    id: Number,
  },
  data() {
    return {
      xAxisBarArt: [], // 响应时间最慢
      seriesBarArt: [], // 响应时间最慢
      xAxisBarUrl: [], // 页面访问次数
      seriesBarUrl: [], // 页面访问次数
      legendTextBarArt: this.t('响应时间', 'WAF.xytime'),
      legendTextBarUrl: this.t('访问次数', 'WAF.fwcs'),
      loading: true,
    }
  },
  components: {
    EBar,
  },
  watch: {
    showModules(val, oldVal) {
      if (val.join() !== oldVal.join()) {
        this.init()
      }
    },
    times(val, oldVal) {
      if (val.join() !== oldVal.join()) {
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
    this.init()
  },
  methods: {
    init() {
      this.getAccessIp("art");
      this.getAccessIp("url");
    },
    // 获取请求来源地址和ip柱状图、响应时间最慢和页面访问次数top5
    getAccessIp(type) {
      this.loading = true
      const params = {
        Version: '2018-01-25',
        FromTime: this.times[0],
        ToTime: this.times[1],
        Host: "all",
        Edition: "clb-waf",
        QueryField: type,
        Source: "access",
      }
      if (this.domain) {
        params["Host"] = this.domain
      }
      this.axios.post(DESCRIBE_HISTOGRAM, params).then((resp) => {
        let artArrCount = []
        let artArr = []
        let urlArrCount = []
        let urlArr = []
        if(type == "art") {
          this.generalRespHandler(resp, ({Histogram}) => {
            Histogram && Histogram.map(v => {
              artArrCount.push(JSON.parse(v).count)
              artArr.push(JSON.parse(v).url)
            })
            this.xAxisBarArt = artArr
            this.seriesBarArt = artArrCount
          })
        } else if(type == "url") {
          this.generalRespHandler(resp, ({Histogram}) => {
            Histogram && Histogram.map(v => {
              urlArrCount.push(JSON.parse(v).count)
              urlArr.push(JSON.parse(v).url)
            })
            this.xAxisBarUrl = urlArr
            this.seriesBarUrl = urlArrCount
          })
        }
      }).then(() => {
        this.loading = false
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.echartsShowFour {
    width: 100%;
    height: 308px;
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