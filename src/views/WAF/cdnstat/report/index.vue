<template>
  <div>
    <div class="header">
      <h2>运营报表</h2>
    </div>
    <div  class="container">
      <el-card class="card">
        <el-form>
          <el-row type="flex">
            <el-form-item label="统计项目" style="width: 300px">
              <el-select v-model="projectId" size="small" placeholder="全部项目">
                <el-option value="">全部项目</el-option>
                <el-option
                  v-for="p in projectList"
                  :key="p.ProjectId"
                  :value="p.ProjectId"
                  :label="p.ProjectName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="统计域名" style="width: 300px">
              <el-select v-model="domainName" size="small" placeholder="全部域名">
                <el-option value="">全部域名</el-option>
                <el-option
                  v-for="p in domainList"
                  :key="p.DomainName"
                  :value="p.DomainName"
                  :label="p.DomainName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row type="flex">
            <el-form-item label="报表类型" style="width: 300px">
              <el-radio-group v-model="interval" size="small">
                <el-radio-button label="5min">日报</el-radio-button>
                <el-radio-button label="hour">周报</el-radio-button>
                <el-radio-button label="day">月报</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="时间选择" style="width: 300px">
              <el-date-picker
                ref="datePicker"
                style="width: 230px"
                size="small"
                v-model="time"
                :format="interval === 'day' ? 'yyyy-MM' : 'yyyy-MM-dd'"
                :type="interval === 'hour' ? 'datetimerange' : 'date'"
                :picker-options="pickerOptions"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-row>
          <el-form-item label="展示数据">
            <el-checkbox-group v-model="showFields">
              <el-checkbox label="overview">数据概览</el-checkbox>
              <el-checkbox label="regionTop">区域流量分布</el-checkbox>
              <el-checkbox label="flux">流量</el-checkbox>
              <el-checkbox label="bandlimit" >带宽</el-checkbox>
              <el-checkbox label="request">请求数</el-checkbox>
              <el-checkbox label="errorCode">错误码</el-checkbox>
              <el-checkbox label="topUrl">TOP10 URL</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-card>
      <overview
        :params="params"
        v-if="showFields.includes('overview')"
        class="card"
      />
      <region-top class="card" />
      <flux class="card" />
      <bandlimit class="card" />
      <request class="card" />
      <request class="card" />
      <error-code
        :params="params"
        v-if="showFields.includes('errorCode')"
        class="card"
      />
      <top-url
        :params="params"
        v-if="showFields.includes('topUrl')"
        class="card"
      />
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import Overview from './overview'
import RegionTop from './regionTop'
import Flux from './flux'
import Bandlimit from './bandlimit'
import Request from './request'
import ErrorCode from './errorCode'
import TopUrl from './topUrl'
import { flatObj } from '@/utils'
export default {
  components: {
    Overview,
    RegionTop,
    Flux,
    Bandlimit,
    Request,
    ErrorCode,
    TopUrl,
  },
  data() {
    return {
      projectList: [],
      domainListCopy: [],
      domainList: [],
      projectId: '',
      domainName: '',
      interval: '5min',
      time: moment().subtract(1, 'd'),
      showFields: ['overview', 'regionTop', 'flux', 'bandlimit', 'request', 'errorCode', 'topUrl'],
      pickerOptions: {
        onPick({ maxDate, minDate }) {
          console.log(maxDate, minDate)
        }
      }
    }
  },
  computed: {
    params() {
      const { interval, projectId, domainName, time } = this
      let times = time
      if (interval === '5min') {
        times = [time, time]
      } else if (interval === 'day') {
        times = [time, ]
      }
      return {interval, projectId, domainName, times}
    }
  },
  watch: {
    projectId(projectId) {
      if (!projectId) {
        this.domainList = [...this.domainListCopy]
        return
      }
      this.domainList = this.domainListCopy.filter(domain => domain.ProjectId === projectId)
    },
    interval(interval) {
      if (interval === 'hour') {
        this.time = [moment().subtract(7, 'd'), moment().subtract(1, 'd')]
      } else if (interval === 'day') {
        this.time = moment().subtract(1, 'month').format('YYYY-MM')
      } else {
        this.time = moment().subtract(1, 'd')
      }
    }
  },
  mounted() {
    console.log(this.$refs.datePicker)
    this.init()
  },
  methods: {
    init() {
      this.getProjects()
      this.getDomains()
    },
    getProjects() {
      this.axios.post('cdn2/ListCdnProjects', flatObj({
        "Version": "2018-06-06",
        Interfaces: ["DescribeCdnData", "ListTopData", "DescribeOriginData", "DescribeBillingData"]
      }))
        .then(({ Response }) => {
          this.projectList = Response.ProjectList
        })
    },
    getDomains() {
      this.axios.post('cdn2/ListCdnDomains', flatObj({
        "Version": "2018-06-06",
        Interfaces: ["DescribeCdnData", "ListTopData", "DescribeOriginData", "DescribeBillingData"]
      }))
        .then(({ Response }) => {
          this.domainList = Response.DomainList.filter(domain => domain.Area === 'overseas')
          this.domainListCopy = [...this.domainList]
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  margin: 25px 30px;
}
.header {
  h2 {
  padding-left: 20px;
    font-size: 16px;
    line-height: 51px;
    color: #000;
    background: #fff;
  }
}
.card {
  margin-bottom: 20px;
}
::v-deep .el-checkbox+.el-checkbox {
  margin-left: 0px;
}
::v-deep .el-date-editor.el-input {
  width: 200px;
}


</style>