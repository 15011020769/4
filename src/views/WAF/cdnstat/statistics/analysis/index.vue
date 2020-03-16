<template>
  <div>
    <div class="header">
      <h2>运营报表</h2>
    </div>
    <el-row type="flex" align="middle" justify="space-between" class="actions">
      <el-col>
        <el-button-group>
          <el-button size="small" :type="createTimeType === '0d' ? 'primary' : ''" @click="onTimeClick(0, 'd')">今天</el-button>
          <el-button size="small" :type="createTimeType === '1d' ? 'primary' : ''" @click="onTimeClick(1, 'd')">昨天</el-button>
          <el-button size="small" :type="createTimeType === '7d' ? 'primary' : ''" @click="onTimeClick(6, 'd')">近7天</el-button>
          <el-button size="small" :type="createTimeType === '1month' ? 'primary' : ''" @click="onTimeClick(1, 'month')">近30天</el-button>
        </el-button-group>
        <el-date-picker
          size="small"
          style="border-left: none;"
          v-model="time"
          format="yyyy-MM-dd"
          type="datetimerange"
          :picker-options="pickerOptions"
        ></el-date-picker>
        <el-select class="split" size="small" v-model="projectId"></el-select>
        <el-select class="split" size="small" v-model="domainName"></el-select>
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
export default {
  components: {
    Region,
  },
  data() {
    return {
      type: 'server',
      projectId: '',
      domainName: '',
      time: [moment(), moment()],
      createTimeType: '0d',
      selectDate: '',
      pickerOptions: {
        onPick: ({maxDate, minDate}) => {
          this.selectDate= minDate.getTime();
          if (maxDate) {
            this.selectDate= ''
          }
        }, disabledDate: (date) => {
          if (this.selectDate!== '') {
            const minTime = moment(this.selectDate).subtract(1, 'month')
            const maxTime = moment(this.selectDate).add(1, 'month')
            return moment(date).isBefore(minTime) || moment(date).isAfter(maxTime) || date.getTime() > Date.now()
          }
          return date.getTime() > Date.now();
        }
      }
    }
  },
  methods: {
    onTimeClick(n, u) {
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