<template>
  <div>
    <div class="container">
      <el-card class="card">
        <el-form>
          <el-row type="flex">
            <el-form-item label="统计项目" style="width: 300px">
              <el-select
                v-model="project"
                value-key="ProjectId"
                size="small"
                placeholder="全部项目"
              >
                <el-option value="">全部项目</el-option>
                <el-option
                  v-for="p in projectList"
                  :key="p.ProjectId"
                  :value="p"
                  :label="p.ProjectName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="统计域名" style="width: 300px">
              <el-select
                v-model="domainName"
                size="small"
                placeholder="全部域名"
              >
                <el-option value="" label="">全部域名</el-option>
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
                style="width: 230px"
                size="small"
                v-model="time"
                :format="
                  interval === 'day'
                    ? 'yyyy-MM'
                    : interval === 'hour'
                    ? `yyyy-MM-dd - ${weekEnd}`
                    : 'yyyy-MM-dd'
                "
                :type="interval === 'day' ? 'month' : 'date'"
                @change="onChangeDate"
                :picker-options="pickerOptions"
                :clearable="false"
              >
              </el-date-picker>
            </el-form-item>
          </el-row>
          <el-form-item label="展示数据">
            <el-checkbox-group v-model="showFields">
              <el-checkbox label="overview">数据概览</el-checkbox>
              <el-checkbox label="regionTop">区域流量分布</el-checkbox>
              <el-checkbox label="flux">流量</el-checkbox>
              <el-checkbox label="bandlimit">带宽</el-checkbox>
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

      <region-top
        :params="params"
        v-if="showFields.includes('regionTop')"
        class="card"
      />
      <flux :params="params" v-if="showFields.includes('flux')" class="card" />
      <bandlimit
        :params="params"
        v-if="showFields.includes('bandlimit')"
        class="card"
      />
      <request
        :params="params"
        v-if="showFields.includes('request')"
        class="card"
      />
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
    TopUrl
  },
  data () {
    return {
      projectList: [],
      domainListCopy: [],
      domainList: [],
      project: '',
      domainName: '',
      interval: '5min',
      time: moment().subtract(1, 'd'),
      showFields: ['overview', 'regionTop', 'flux', 'bandlimit', 'request', 'errorCode', 'topUrl'],
      weekEnd: '',
      pickerOptions: {
        disabledDate: (date) => {
          if (this.interval === 'day') {
            return moment(date).isAfter(moment().subtract(1, 'month')) || moment(date).isBefore(moment().add(2, 'month').subtract(1, 'year'))
          }
          if (this.interval === 'hour') {
            return moment(date).isAfter(moment().subtract(moment().day(), 'd')) || moment(date).isBefore(moment().add(1, 'week').subtract(1, 'year'))
          }
          return moment(date).isAfter(moment().subtract(1, 'd')) || moment(date).isBefore(moment().add(1, 'd').subtract(1, 'year'))
        }
      }
    }
  },
  computed: {
    params () {
      const { interval, project, domainName, time } = this
      let times = time
      let type = '日报'
      if (interval === '5min') { // 日报
        times = [moment(time).startOf('d').format('YYYY-MM-DD 00:00:00'), moment(time).endOf('d').format('YYYY-MM-DD 23:59:59')]
      } else if (interval === 'day') { // 月报
        type = '月报'
        times = [moment(time).format('YYYY-MM-01 00:00:00'), moment(time).endOf('month').format('YYYY-MM-DD 23:59:59')]
      } else { // 周报
        type = '周报'
        times = [moment(time).format('YYYY-MM-DD 00:00:00'), `${this.weekEnd} 23:59:59`]
      }
      return {interval, type, projectId: project.ProjectId, projectName: project.ProjectName, domainName, times}
    }
  },
  watch: {
    project (project) {
      if (!project) {
        this.domainList = [...this.domainListCopy]
        return
      }
      this.domainList = this.domainListCopy.filter(domain => domain.ProjectId === project.ProjectId)
    },
    interval (interval) {
      if (interval === 'hour') {
        this.time = moment().subtract(7, 'd').startOf('week').add(1, 'd').format('YYYY-MM-DD')
        this.weekEnd = moment().subtract(7, 'd').endOf('week').add(1, 'd').format('YYYY-MM-DD')
      } else if (interval === 'day') {
        this.time = moment().subtract(1, 'month').format('YYYY-MM')
      } else {
        this.time = moment().subtract(1, 'd')
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    onChangeDate (date) {
      if (this.interval === 'hour') {
        if (moment(date).day() === 0) {
          this.time = moment(date).subtract(6, 'd').format('YYYY-MM-DD')
          this.weekEnd = moment(date).format('YYYY-MM-DD')
        } else {
          this.time = moment(date).startOf('week').add(1, 'd').format('YYYY-MM-DD')
          this.weekEnd = moment(date).endOf('week').add(1, 'd').format('YYYY-MM-DD')
        }
      }
    },
    init () {
      this.getProjects()
      this.getDomains()
    },
    getProjects () {
      this.axios.post('cdn2/ListCdnProjects', flatObj({
        'Version': '2018-06-06',
        Interfaces: ['DescribeCdnData', 'ListTopData', 'DescribeOriginData', 'DescribeBillingData']
      }))
        .then(({ Response }) => {
          this.projectList = Response.ProjectList
        })
    },
    getDomains () {
      this.axios.post('cdn2/ListCdnDomains', flatObj({
        'Version': '2018-06-06',
        Interfaces: ['DescribeCdnData', 'ListTopData', 'DescribeOriginData', 'DescribeBillingData']
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
::v-deep .el-checkbox + .el-checkbox {
  margin-left: 0px;
}
::v-deep .el-date-editor.el-input {
  width: 200px;
}
::v-deep .el-input--suffix .el-input__inner {
  padding-right: 0;
}
::v-deep .el-select input::placeholder{
  color: #606266;
}
</style>
