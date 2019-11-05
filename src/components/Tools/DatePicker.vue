<template>
  <div>
    <el-date-picker v-model="value" size="small" align="left" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00','23:59:59']" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" @change="datePickerChange">
    </el-date-picker>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            const time = new Date();
            const start = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + ' 00:00:00'
            picker.$emit('pick', [new Date(start), new Date()]);
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const time = new Date();
            time.setTime(time.getTime() - 3600 * 1000 * 24 * 1);
            const start = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + ' 00:00:00'
            const end = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + ' 23:59:59'
            picker.$emit('pick', [new Date(start), new Date(end)]);
          }
        }, {
          text: '近七天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近30天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      value: ''
    }
  },
  methods: {
    datePickerChange() {
      this.$emit('getDatePicker', this.value)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
