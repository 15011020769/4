<template>
  <div>
    <div class="header">
      <h2>运营报表</h2>
    </div>
    <el-row type="flex" align="middle" justify="space-between" class="actions">
      <el-col>
        <el-button-group style="margin-top:-4px">
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
            @click="onTimeClick(7, 'd')"
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
          style="border-left: none;width:350px"
          v-model="time"
          type="datetimerange"
          :picker-options="pickerOptions"
        ></el-date-picker>
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
        <el-select v-model="domainName" size="small" placeholder="全部域名">
          <el-option value="">全部域名</el-option>
          <el-option
            v-for="p in domainList"
            :key="p.DomainName"
            :value="p.DomainName"
            :label="p.DomainName"
          ></el-option>
        </el-select>
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
      <region :params="params" class="card" />
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
      project: '',
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
    params () {
      const { project, domainName, type, time } = this

      let times = time
      //  let type = '日报'
      // if (interval === '5min') { // 日报
      // times = [moment(time).startOf('d').format('YYYY-MM-DD 00:00:00'), moment(time).endOf('d').format('YYYY-MM-DD 23:59:59')]
      // console.log(this.createTimeType, times, 'time---')
      // } else if (interval === 'day') { // 月报
      //   type = '月报'
      //   times = [moment(time).format('YYYY-MM-01 00:00:00'), moment(time).endOf('month').format('YYYY-MM-DD 23:59:59')]
      // } else { // 周报
      //   type = '周报'
      //   times = [moment(time).format('YYYY-MM-DD 00:00:00'), `${this.weekEnd} 23:59:59`]
      // }
      return { projectId: project.ProjectId, AreaType: type, projectName: project.projectName, domainName, times }
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
    type (val) {
      // this.params.AreaType = val
    },
    time (val) {
      // this.time = []
      // val.forEach(val => {
      //   this.time.push(val.format('YYYY-MM-DD HH:mm:ss'))
      //   console.log(val.format('YYYY-MM-DD HH:mm:ss'), 'val')
      // })
      // console.log(val, this.params, 'shijia')
    }
    // interval (interval) {
    //   if (interval === 'hour') {
    //     this.time = moment().subtract(7, 'd').startOf('week').add(1, 'd').format('YYYY-MM-DD')
    //     this.weekEnd = moment().subtract(7, 'd').endOf('week').add(1, 'd').format('YYYY-MM-DD')
    //   } else if (interval === 'day') {
    //     this.time = moment().subtract(1, 'month').format('YYYY-MM')
    //   } else {
    //     this.time = moment().subtract(1, 'd')
    //   }
    // }

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
      // var ipt1 = document.querySelector('.dataTime input:nth-child(2)')
      // var ipt2 = document.querySelector('.dataTime input:nth-child(4)')
      // let startTime = moment().subtract(num, unit)
      // if (unit === 'd') {
      //   startTime = moment().subtract(num, unit).startOf('d')
      // }
      // ipt1.value = startTime.format('YYYY-MM-DD HH:mm:ss')
      // ipt2.value = moment().endOf('d').format('YYYY-MM-DD HH:mm:ss')
      // this.startTime = startTime.format('YYYY-MM-DD HH:mm:ss')
      // this.endTime = moment().endOf('d').format('YYYY-MM-DD HH:mm:ss')

      this.createTimeType = `${n}${u}`

      let start = moment().subtract(n, u)
      let end = moment()
      if (this.createTimeType === '1d') {
        end = moment().subtract(1, 'd')
      }
      this.time = [start, end]
      // console.log(start, 'this.time')
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
