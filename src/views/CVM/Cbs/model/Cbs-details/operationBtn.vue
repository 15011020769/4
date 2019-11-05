<template>
  <div class="Cbs-operationBtn">
    <el-button-group>
      <el-button size="small"
        @click="TimeChoice(1)"
        :type="classsvalue === 1 ? 'primary' : ''">实时</el-button>
      <el-button size="small"
        @click="TimeChoice(1*24)"
        :type="classsvalue === 1*24 ? 'primary' : ''">近24小时</el-button>
      <el-button size="small"
        @click="TimeChoice(1*24*7)"
        :type="classsvalue === 1*24*7 ? 'primary' : ''">近7天</el-button>
      <el-button size="small"
        @click="TimeChoice(1*24*30)"
        :type="classsvalue === 1*24*30 ? 'primary' : ''">近30天</el-button>
      <el-date-picker v-model="datetimeval"
        type="datetimerange"
        size="small"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="dateheight"
        :picker-options="pickerOptions"
        @change="ReSelection">
      </el-date-picker>
    </el-button-group>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: ['classsvalue'],
  data () {
    return {
      datetimeval: '',
      currenttime: new Date(),
      Time: {
        startTime: '',
        endTime: ''
      },
      pickerOptions: {
        disabledDate (time) {
          return (
            time.getTime() > Date.now() ||
            time.getTime() < Date.now() - 2592000000
          )
        }
      }
    }
  },
  created () {
    this.TimeChoice(1 * 24 * 30)
  },
  methods: {
    TimeChoice (value) {
      var y = moment(this.currenttime).format('YYYY')
      var m = moment(this.currenttime).format('MM') - 1
      var d = moment(this.currenttime).format('DD')
      if (value === 1) {
        this.Time.startTime = parseInt(
          new Date(
            moment(new Date(y, m, d, 0, 0, 0)).format('YYYY-MM-DD HH:mm:ss')
          ).getTime() / 1000
        )
        this.Time.endTime = parseInt(new Date().getTime() / 1000)
      } else if (value === 1 * 24) {
        this.Time.startTime = parseInt(
          new Date(
            moment(new Date(y, m, Number(d - 1), 0, 0, 0)).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          ).getTime() / 1000
        )
        this.Time.endTime = parseInt(new Date().getTime() / 1000)
      } else if (value === 1 * 24 * 7) {
        this.Time.startTime = parseInt(
          new Date(
            moment(new Date(y, m, Number(d - 7), 0, 0, 0)).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          ).getTime() / 1000
        )
        this.Time.endTime = parseInt(new Date().getTime() / 1000)
      } else if (value === 1 * 24 * 30) {
        this.Time.startTime = parseInt(
          new Date(
            moment(new Date(y, m, Number(d - 29), 0, 0, 0)).format(
              'YYYY-MM-DD HH:mm:ss'
            )
          ).getTime() / 1000
        )
        this.Time.endTime = parseInt(new Date().getTime() / 1000)
      }
      this.$emit('GetTime', this.Time, value)
    },
    ReSelection (value) {
      this.Time.startTime =
        new Date(
          moment(new Date(value[0])).format('YYYY-MM-DD HH:mm:ss')
        ).getTime() / 1000

      this.Time.endTime =
        new Date(
          moment(new Date(value[1])).format('YYYY-MM-DD HH:mm:ss')
        ).getTime() / 1000
      this.$emit('GetTime', this.Time)
    }
  }
}
</script>

<style lang="scss">
.Cbs-operationBtn {
}
</style>
