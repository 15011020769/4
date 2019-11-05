<template>
  <div class="Cbs-attribute">
    <el-dialog :visible.sync="attributeShow"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
      width="580px"
      center>
      <div slot="title"
        class="title-wrap">
        <span>修改云硬盘属性</span>
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

      <ul>
        <li>
          <p>
            释放行为：
          </p>
          <div>
            <el-checkbox v-model="checked">数据盘随实例一起释放</el-checkbox>
          </div>
        </li>
      </ul>

      <span slot="footer"
        class="dialog-footer">
        <el-button type="primary"
          @click="attribute">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    attributeShow: Boolean,
    Cbsdata: Object
  },
  data () {
    return {
      Detailsshow: true,
      tableData: [],
      checked: false
    }
  },
  components: {},
  created () {
    this.tableData.push(this.Cbsdata)
    console.log(this.Cbsdata)
  },
  methods: {
    // 修改确定
    attribute () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        'DiskIds.0': this.Cbsdata.DiskId,
        DeleteWithInstance: this.checked
      }
      this.axios.post('cbs2/ModifyDiskAttributes', parms).then(data => {
        if (data.Response.Error === undefined) {
          this.$emit('attributeShow', false)
          this.$parent.getDataList()
          this.$message({
            message: '修改属性成功',
            type: 'success'
          })
        } else {
          this.$emit('attributeShow', false)
          this.$message.error(data.Response.Error.Message)
        }
      })
    },
    // 取消
    close () {
      this.$emit('attributeShow', false)
    },
    Detailshow () {
      this.Detailsshow = !this.Detailsshow
    }
  }
}
</script>

<style lang="scss" >
.Cbs-attribute {
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
    ul {
      li {
        display: flex;
        p {
          width: 100px;
        }
      }
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
