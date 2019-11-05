<template>
  <div class="Cbs-Journal">
    <operationBtn :classsvalue='classsvalue'
      v-on:GetTime="GetTime"></operationBtn>
    <div class="Journal-table">
      <el-table :data="JournalArr"
        v-loading='loading'
        style="width: 100%">
        <el-table-column prop="EventTime"
          label="操作时间">
        </el-table-column>
        <el-table-column prop="EventNameCn"
          label="操作名称">
        </el-table-column>
        <el-table-column prop="EventName"
          label="Action">
        </el-table-column>
        <el-table-column prop="Username"
          label="操作者">
        </el-table-column>
        <el-table-column prop="address"
          label="操作结果">
          <template slot-scope="scope">
            <p v-if="scope.row.ErrorCode===0"
              :class="scope.row.ErrorCode===0?'green-c':''">成功</p>
          </template>
        </el-table-column>
        <el-table-column prop="address"
          label="详情">
          <template slot-scope="scope">
            <a href="">详情</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import operationBtn from './operationBtn'
export default {
  data () {
    return {
      Cbsparameter: '', // 数据
      JournalArr: [], // 操作日志数据
      classsvalue: 1 * 24 * 30, // 子组件按钮样式
      loading: false // 表格加载动画
    }
  },
  props: ['CbsDetail'],
  components: { operationBtn },
  created () {
    this.Cbsparameter = this.CbsDetail[0]
  },
  methods: {
    GetTime (time, value) {
      this.classsvalue = value
      this.Time = time
      if (this.Time) {
        this.Journal()
      }
    },
    Journal () {
      this.loading = true
      var parms = {
        Version: '2019-03-19',
        Region: 'ap-guangzhou',
        'LookupAttributes.0.AttributeKey': 'ReadOnly',
        'LookupAttributes.0.AttributeValue': false,
        'LookupAttributes.1.AttributeKey': 'ResourceType',
        'LookupAttributes.1.AttributeValue': 'cvm',
        'LookupAttributes.2.AttributeKey': 'ResourceName',
        'LookupAttributes.2.AttributeValue':
          'volume/' + this.Cbsparameter.DiskId,
        StartTime: this.Time.startTime,
        EndTime: this.Time.endTime
      }
      this.axios.post('cloudaudit2/LookUpEvents', parms).then(data => {
        this.JournalArr = data.Response.Events
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.Cbs-Journal {
  .Journal-table {
    margin-top: 20px;
    border: 1px solid #ebeef5;
  }
}
</style>
