<template>
  <div>
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
          style="border-left: none;width:260px"
          v-model="time"
          type="datetimerange"
          :clearable="false"
          format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        ></el-date-picker>&nbsp;&nbsp;
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
        </el-select>&nbsp;&nbsp;
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
          const last90d = moment().subtract(90, 'd')
          if (this.selectDate !== '') {
            const minTime = moment(this.selectDate).subtract(1, 'month')
            const maxTime = moment(this.selectDate).add(1, 'month')
            return moment(date).isBefore(minTime) || moment(date).isAfter(maxTime) || date.getTime() > Date.now() || moment(date).isBefore(last90d)
          }
          return date.getTime() > Date.now() || moment(date).isBefore(last90d)
        }
      }
    }
  },
  computed: {
    params () {
      const { project, domainName, type, time } = this
      return { projectId: project.ProjectId, AreaType: type, projectName: project.ProjectName, domainName, times: time }
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
::v-deep .el-select input::placeholder{
  color: #606266;
}
</style>
