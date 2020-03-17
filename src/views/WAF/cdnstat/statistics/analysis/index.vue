<template>
  <div>
    <div class="header">
      <h2>运营报表</h2>
    </div>
    <el-row type="flex" align="middle" justify="space-between" class="actions">
      <el-col>
        <el-button-group>
          <el-button
            size="small"
            :type="createTimeType === '0d' ? 'primary' : ''"
            @click="onTimeClick(0, 'd')"
            >今天</el-button
          >
          <el-button
            size="small"
            :type="createTimeType === '1d' ? 'primary' : ''"
            @click="onTimeClick(1, 'd')"
            >昨天</el-button
          >
          <el-button
            size="small"
            :type="createTimeType === '7d' ? 'primary' : ''"
            @click="onTimeClick(6, 'd')"
            >近7天</el-button
          >
          <el-button
            size="small"
            :type="createTimeType === '1month' ? 'primary' : ''"
            @click="onTimeClick(1, 'month')"
            >近30天</el-button
          >
        </el-button-group>
        <el-date-picker
          size="small"
          style="border-left: none;"
          v-model="time"
          format="yyyy-MM-dd"
          type="datetimerange"
          :picker-options="pickerOptions"
        ></el-date-picker>
        <el-select v-model="projectId" size="small" placeholder="全部项目">
          <el-option value="">全部项目</el-option>
          <el-option
            v-for="p in projectList"
            :key="p.ProjectId"
            :value="p.ProjectId"
            :label="p.ProjectName"
          ></el-option>
        </el-select>
        <el-select v-model="domainName" size="small" placeholder="全部域名">
          <el-option value="">全部域名</el-option>
          <el-option
            v-for="p in domainList"
            :key="p.DomainName"
            :value="p.DomainName"
            :label="p.DomainName"
          ></el-option>
        </el-select>
        <!-- <el-select class="split" size="small" v-model="projectId"></el-select>
        <el-select class="split" size="small" v-model="domainName"></el-select> -->
      </el-col>
      <i class="el-icon-setting icon" />
    </el-row>
    <el-row class="actions">
      <el-radio-group v-model="type" size="small">
        <el-radio-button label="server">服务地区</el-radio-button>
        <el-radio-button label="client">客户端地区</el-radio-button>
      </el-radio-group>
    </el-row>
    <div class="container">
      <region class="card" />
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import Region from './region'
import { flatObj } from '@/utils'

export default {
  components: {
    Region
  },
  data () {
    return {
      projectList: [],
      domainList: [],
      domainListCopy: [],
      type: 'server',
      projectId: '',
      domainName: '',
      time: [moment(), moment()],
      createTimeType: '0d',
      selectDate: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.selectDate = minDate.getTime()
          if (maxDate) {
            this.selectDate = ''
          }
        },
        disabledDate: (date) => {
          if (this.selectDate !== '') {
            const minTime = moment(this.selectDate).subtract(1, 'month')
            const maxTime = moment(this.selectDate).add(1, 'month')
            return moment(date).isBefore(minTime) || moment(date).isAfter(maxTime) || date.getTime() > Date.now()
          }
          return date.getTime() > Date.now()
        }
      }
    }
  },
  computed: {

  },
  watch: {
    projectId (projectId) {
      if (!projectId) {
        this.domainList = [...this.domainListCopy]
        return
      }
      this.domainList = this.domainListCopy.filter(domain => domain.ProjectId === projectId)
    }

  },
  mounted () {
    this.init()
  },
  methods: {
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
    },
    onTimeClick (n, u) {
      this.createTimeType = `${n}${u}`
      let start = moment().subtract(n, u)
      let end = moment()
      if (this.createTimeType === '1d') {
        end = moment().subtract(1, 'd')
      }
      this.time = [start, end]
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
.actions {
  margin: 20px 20px 15px 30px;
  .split {
    margin-left: 10px;
  }
  .icon {
    font-size: 20px;
    cursor: pointer;
  }
}
::v-deep .el-date-editor--datetimerange.el-input__inner {
  width: 230px;
}
.card {
  margin-bottom: 20px;
}
</style>
