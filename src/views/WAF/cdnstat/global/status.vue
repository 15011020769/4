<template>
  <el-card>
    <el-row type="flex" class="header" justify="space-between">
      <h3>全网状态详情</h3>
    </el-row>

    <el-row type="flex" align="center">
      <el-button-group>
        <el-button size="mini" :type="createTimeType === 0 ? 'primary' : ''" @click="onTimeClick(0)">今日</el-button>
        <el-button size="mini" :type="createTimeType === 1 ? 'primary' : ''" @click="onTimeClick(1)">昨日</el-button>
        <el-button size="mini" :type="createTimeType === 7 ? 'primary' : ''" @click="onTimeClick(7)">近7天</el-button>
      </el-button-group>
      <el-date-picker
        size="mini"
        style="border-left: none;"
        v-model="time"
        format="yyyy-MM-dd"
        type="datetimerange"
      ></el-date-picker>
    </el-row>
  </el-card>
</template>
<script>
import moment from 'moment'
export default {
  data() {
    return {
      time: [moment(), moment()],
      createTimeType: 0,
    }
  },
  methods: {
    onTimeClick(n) {
      this.createTimeType = n
      let start = moment().subtract(n, 'd')
      let end = moment()
      if (n !== 0) {
        end = moment().subtract(1, 'd')
      }
      this.time = [start, end]
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  margin-bottom: 15px;
}
::v-deep .el-date-editor--datetimerange.el-input__inner {
  width: 230px;
}
</style>