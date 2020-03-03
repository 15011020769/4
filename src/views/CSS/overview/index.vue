<template>
  <div class="overview-wrap">
    <HeaderCom :title="$t('CSS.overview.0')"/>
    <div class="overview-main">
      <div class="main-box">
        <h3>{{$t('CSS.overview.5')}}</h3>
        <div class="overview">
          <dl>
            <dt>
              <span>{{totalBandwidth && totalBandwidth.split(' ')[0]}}</span>{{totalBandwidth && totalBandwidth.split(' ')[1]}}
            </dt>
            <dd>
              <p>{{$t('CSS.overview.6')}}</p>
            </dd>
          </dl>
          <dl>
            <dt>
              <span>{{todayFlux}}</span>MB
            </dt>
            <dd>
              <p>今日下行流量</p>
            </dd>
          </dl>
          <dl>
            <dt>
              <span>{{online}}</span>人
            </dt>
            <dd>
              <p>
                {{$t('CSS.overview.7')}}
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('CSS.overview.8')"
                  placement="bottom"
                >
                  <span style="cursor: pointer;">
                    <i class="el-icon-info"></i>
                  </span>
                </el-tooltip>
              </p>
            </dd>
          </dl>
          <dl>
            <dt>
              <span>{{fluxPackageCount}}</span>个
            </dt>
            <dd>
              <p>流量包</p>
              <p style="margin-top:10px;">{{$t('CSS.overview.9')}} {{totalFlux}} GB</p>
              <p>已使用 {{usedFlux}} GB</p>
            </dd>
          </dl>
        </div>
      </div>
      <div class="box">
        <el-button size="small" type="primary" v-show="!btnload">{{region}}</el-button>
        <el-button v-show="btnload" icon="el-icon-loading" type="primary"></el-button>
        <TimeX @switchData="GetDat" :classsvalue="value" style="margin-left:10px;"></TimeX>
        <el-dropdown
          :hide-on-click="false"
          trigger="click"
          ref="doaminRef"
          style="margin-left: 30px"
        >
          <el-button type="primary" size="small">
            {{domainCheckedListCopy.length === domainData.length ? '全部域名' : domainCheckedListCopy.join()}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <label class="domain-label"><el-checkbox :value="domainCheckedList.length === domainData.length" @change="checkDomainAll" /> 全部域名</label>
            </el-dropdown-item>
            <el-dropdown-item
              v-for="item in domainData"
              :key="item"
            >
              <label class="domain-label"><el-checkbox @change="checked => doaminChange(checked, item)" :value="domainCheckedList.includes(item)" /> {{item}}</label>
            </el-dropdown-item>
            <el-row class="doamin-btn-container">
              <el-button size="small" type="primary" @click="comfirmDomain">{{$t('CSS.overview.12')}}</el-button>
              <el-button size="small" @click="cancelDomain">取消</el-button>
            </el-row>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button size="small" type="primary" @click="getTrend" style="margin-left: 30px">{{$t('CSS.overview.12')}}</el-button>
      </div>
      <el-tabs v-model="activeName" style="margin-top:10px;">
        <el-tab-pane :label="$t('CSS.overview.10')" name="带宽">
        </el-tab-pane>
        <el-tab-pane :label="$t('CSS.overview.11')" name="流量"></el-tab-pane>
      </el-tabs>
      <e-line
        :xAxis="timeData"
        :series="series"
        :legendText="activeName"
        :tooltip="{
          trigger: 'axis',   
          formatter: `{b}<br/>{a} {c}${activeName === '带宽' ? 'Mpbs' : 'MB'}`
        }"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import HeaderCom from "@/components/public/Head";
import TimeX from "@/components/public/TimeY";
import ELine from "../components/line";
import { 
  ALL_CITY,
  CSS_MBPS,
  LIVE_DESCRIBE_LIVEDOMAINPLAYINFOLIST,
  DOMAIN_LIST,
  LIVE_DESCRIBE_LIVEPACKAGEINFO
} from "@/constants";

let defaultParams = {
  Version: '2018-08-01'
}
export default {
  name: 'overview',
  data() {
    return {
      domainData: [],
      domainCheckedList: [],
      domainCheckedListCopy: [],
      totalBandwidth: 0,
      todayFlux: 0,
      online: 0,
      usedFlux: 0,
      totalFlux: 0,
      fluxPackageCount: 0,
      value: 1,
      granularity: 0,
      activeName: '带宽',
      region: '',
      StartTime: '',
      EndTime: '',
      timeData: [],
      bandwidthData: [],
      series: [],
      fluxData: [],
      btnload: true
    };
  },
  components: {
    HeaderCom,
    TimeX,
    ELine,
  },
  created() {
    this._region();
    this.init();
  },
  watch: {
    activeName() {
      if (this.activeName === '带宽') {
        this.series = [...this.bandwidthData]
      } else {
        this.series = [...this.fluxData]
      }
    }
  },
  methods: {
    doaminChange(checked, domain) {
      if (checked) {
        this.domainCheckedList.push(domain);
      } else {
        this.domainCheckedList = this.domainCheckedList.filter(item => item !== domain)
      }
    },
    checkDomainAll(checked) {
      if (checked) {
        this.domainCheckedList = [...this.domainData]
      } else {
        this.domainCheckedList = []
      }
    },
    comfirmDomain() {
      if (this.domainCheckedList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择域名'
        })
      } else {
        this.$refs.doaminRef.visible = false
        this.domainCheckedListCopy = [...this.domainCheckedList]
      }
    },
    cancelDomain() {
      this.domainCheckedList = [...this.domainCheckedListCopy]
      this.$refs.doaminRef.visible = false
    },
    GetDat(params) {
      this.granularity = params[0]
      this.StartTime = params[1].StartTIme
      this.EndTime = params[1].EndTIme
      this.value = params[2]
      this.$nextTick(this.getTrend)
    },
    //获取地域
    _region() {
      this.axios.post(ALL_CITY).then(res => {
        this.region = res.data[0].zone;
        this.btnload = false;
      });
    },
    init() {
      this.getDomain()
      this.getHeadData()
    },
    getDomain() {
      this.axios.post(DOMAIN_LIST, defaultParams).then(({ Response: { DomainList } }) => {
        const domains = []
        if (Array.isArray(DomainList)) {
          DomainList.forEach(domain => {
            domains.push(domain.Name)
          })
        }
        this.domainCheckedList = domains
        this.domainData = domains
        this.domainCheckedListCopy = domains
      })
    },
    // 实时下行带宽 今日下行流量 直播在线数
    getHeadData() {
      const params = {
        ...defaultParams,
        StartTime: moment().startOf('d').format('YYYY-MM-DD HH:mm:ss'),
        EndTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        Granularity: 60
      }
      // 查询今日总流量
      this.axios.post(CSS_MBPS, params).then(({ Response }) => {
        this.todayFlux = Response.SumFlux
        this.totalBandwidth = Response.PeakBandwidth > 1 ? `${Response.PeakBandwidth} Mbps` : `${Response.PeakBandwidth * 1000} Kbps`
      })
      // 查询实时总带宽 实时总连接数
      this.axios.post(LIVE_DESCRIBE_LIVEDOMAINPLAYINFOLIST, defaultParams).then(({ Response }) => {
        this.online = Response.TotalOnline
      })
      // 查询流量包
      this.axios.post(LIVE_DESCRIBE_LIVEPACKAGEINFO, {
        ...defaultParams,
        PackageType: 0,
      })
      .then(({ Response: { LivePackageInfoList } }) => {
        if (Array.isArray(LivePackageInfoList)) {
          this.fluxPackageCount = LivePackageInfoList.length
          let usedFlux = 0
          let totalFlux = 0
          LivePackageInfoList.forEach(item => {
            usedFlux += item.Used
            totalFlux += item.Total
          })
          this.totalFlux = (totalFlux / 1000 / 1000 / 1000).toFixed(2)
          this.usedFlux = (usedFlux / 1000 / 1000 / 1000).toFixed(2)
        }
      })
      
    },
    // 统计趋势数据
    getTrend() {
      let params = {
        ...defaultParams,
        StartTime: this.StartTime,
        EndTime: this.EndTime,
        Granularity: Number(this.granularity) / 60,
        MainlandOrOversea: 'Mainland'
      }
      if (this.domainCheckedListCopy.length !== this.domainData.length) {
        this.domainCheckedListCopy.forEach((domain, index) => {
          params[`PlayDomains.${index}`] = domain
        })
      }
      this.axios.post(CSS_MBPS, params).then(({ Response: { DataInfoList } }) => {
        const times = []
        const bandwidthData = []
        const fluxData = []
        DataInfoList.forEach(item => {
          times.push(item.Time)
          bandwidthData.push(item.Bandwidth)
          fluxData.push(item.Flux)
        })
        this.timeData = times
        this.bandwidthData = bandwidthData
        this.fluxData = fluxData
        if (this.activeName === '带宽') {
          this.series = bandwidthData
        } else {
          this.series = fluxData
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.overview-wrap >>> .el-button {
  height: 30px;
  line-height: 30px;
  padding-top: 0;
  font-size: 12px !important;
  border-radius: 0;
}
.overview-wrap >>> .box-dis {
  margin: 0;
}
.overview-wrap >>> .el-tab-pane {
  background: white;
  padding: 20px;
  box-sizing: border-box;
}
.overview-wrap >>> .el-input__inner {
  height: 30px;
  line-height: 30px;
  padding-top: 0;
  border-radius: 0;
  font-size: 12px;
  position: relative;
}
.overview-wrap >>> .btn-style {
  margin-left: 0;
}
.overview-wrap >>> .LocaP {
  margin-left: 10px;
  display: flex;
  align-items: center;
}
.overview-wrap {
  .overview-main {
    padding: 20px;
    box-sizing: border-box;

    .box {
      display: flex;
      align-items: center;
    }

    .main-box {
      background-color: #fff;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      padding: 20px;
      box-sizing: border-box;
      margin-bottom: 20px;

      .overview {
        display: flex;
        dl {
          flex: 1;
          padding-top: 20px;
          padding-bottom: 10px;
          box-sizing: border-box;

          dt {
            font-size: 14px;
            padding-left: 2px;
            span {
              font-size: 36px;
              font-weight: normal;
            }
          }
          dd {
            margin-top: 10px;
            color: #888;
          }
        }
      }
    }

    .explain {
      color: #003b80;
      border: 1px solid #97c7ff;
      background: #e5f0ff;
      padding: 10px 30px 10px 20px;
      margin-bottom: 10px;
      border-radius: 2px;

      p {
        line-height: 18px;

        a {
          color: #006eff;
        }
        a:hover {
          border-bottom: 1px #006eff solid;
        }
      }
    }
  }
}
.domain-label {
  display: block;
  cursor: pointer;
}
.doamin-btn-container {
  margin-left: 20px;
}
</style>