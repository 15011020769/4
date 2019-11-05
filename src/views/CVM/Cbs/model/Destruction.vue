<template>
  <div class="Cbs-Destruction">
    <el-dialog :visible.sync="DestructionShow"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
      width="580px"
      center>
      <div slot="title"
        class="title-wrap">
        <span>销毁云硬盘</span>
        <i class="el-icon-close"
          @click="close"></i>
      </div>

      <div class="Cbs-mountbottom"> 您已选 1台 云硬盘 <a @click="Detailshow">查看详情</a></div>
      <div v-if="Detailsshow"
        class="Cbs-mountbottom">
        <el-table :data="tableData"
          border
          style="width: 100%">
          <el-table-column prop="date"
            label="No."
            width="55">
            <template slot-scope="scope">
              1
            </template>
          </el-table-column>
          <el-table-column prop="DiskName"
            label="云硬盘名称"
            width="120">
          </el-table-column>
          <el-table-column prop="DiskId"
            label="云硬盘ID"
            width="120">
          </el-table-column>
          <el-table-column prop=""
            label="计费模式"
            width="80">
            <template slot-scope="scope">
              {{scope.row.DiskChargeType|Billingmodelfilter()}}
            </template>
          </el-table-column>
          <el-table-column prop="DeadlineTime"
            label="到期/创建时间">
            <template slot-scope="scope">
              {{scope.row.DeadlineTime}} 到期
            </template>
          </el-table-column>
        </el-table>
      </div>
      <h2 class="Cbs-mountbottom">销毁选中的云硬盘？</h2>
      <div class="Des-style">
        <p> 销毁后所有数据将被清除且不可恢复，请提前备份数据。</p>
      </div>
      <span slot="footer"
        class="dialog-footer">
        <el-button type="primary"
          @click="Destruction">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    DestructionShow: Boolean,
    Cbsdata: Object
  },
  data () {
    return {
      Detailsshow: true,
      tableData: []
    }
  },
  components: {},
  created () {
    this.tableData.push(this.Cbsdata)
    console.log(this.Cbsdata)
  },
  methods: {
    // 销毁确定
    Destruction () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        'DiskIds.0': this.Cbsdata.DiskId
      }
      this.axios.post('cbs2/TerminateDisks', parms).then(data => {
        console.log(data)
        if (data.Response.Error === undefined) {
          this.$emit('DestructionShow', false)
          this.$parent.getDataList()
          this.$message({
            message: '销毁成功',
            type: 'success'
          })
        } else {
          this.$emit('DestructionShow', false)
          this.$message.error(data.Response.Error.Message)
        }
      })
    },
    // 取消
    close () {
      this.$emit('DestructionShow', false)
    },
    Detailshow () {
      console.log(this.Detailsshow)
      this.Detailsshow = !this.Detailsshow
    }
  }
}
</script>

<style lang="scss" >
.Cbs-Destruction {
  a {
    cursor: pointer;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    span {
      font-weight: bolder;
    }
    i {
      font-size: 16px;
      font-weight: 900;
      cursor: pointer;
    }
  }
  .el-dialog__body {
    padding: 10px 20px 30px;
    font-size: 12px;
    line-height: 20px;
    .Des-style {
      background: #e5f0ff;
      padding: 8px 10px;
      margin-bottom: 15px;
      border-radius: 2px;
      border: 1px solid #97c7ff;
      line-height: 20px;
      color: #003b80;
    }
  }
  .Cbs-mountbottom {
    margin-bottom: 15px;
  }
  h2 {
    color: black;
    font-size: 14px;
  }
}
</style>
