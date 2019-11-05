<template>
  <div class="Cbs-uninstall">
    <el-dialog :visible.sync="uninstallShow"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
      width="580px"
      center>
      <div slot="title"
        class="title-wrap">
        <span>卸载云硬盘</span>
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
      <h2 class="Cbs-mountbottom">卸载实例({{Cbsdata.InstanceId}})的云硬盘( {{Cbsdata.DiskId}})</h2>
      <div>
        <p>win实例：强烈建议您在卸载之前，对该硬盘执行脱机操作， 查看详情。</p>

        <p>linux实例：建议您在卸载之前，确保该硬盘的所有分区处于非加载状态 (umounted)。部分linux操作系统可能不支持硬盘热拔插， 查看详情。</p>
      </div>
      <span slot="footer"
        class="dialog-footer">
        <el-button type="primary"
          @click="uninstall">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    uninstallShow: Boolean,
    Cbsdata: Object
  },
  data () {
    return {
      Detailsshow: false,
      tableData: []
    }
  },
  components: {},
  created () {
    this.tableData.push(this.Cbsdata)
    console.log(this.Cbsdata)
  },
  methods: {
    // 卸载确定
    uninstall () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        'DiskIds.0': this.Cbsdata.DiskId,
        InstanceId: this.Cbsdata.InstanceId
      }

      this.axios.post('cbs2/DetachDisks', parms).then(data => {
        console.log(data)
        if (data.Response.Error === undefined) {
          this.$emit('uninstallShow', false)
          this.$parent.getDataList()
          this.$message({
            message: '卸载成功',
            type: 'success'
          })
        }
      })
    },
    // 取消
    close () {
      this.$emit('uninstallShow', false)
    },
    Detailshow () {
      console.log(this.Detailsshow)
      this.Detailsshow = !this.Detailsshow
    }
  }
}
</script>

<style lang="scss" >
.Cbs-uninstall {
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
    .el-table .cell {
      font-size: 12px;
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
