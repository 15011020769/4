<template>
  <div class="Cdb-restart">
    <el-dialog :visible.sync="restartShow"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
      width="850px"
      center>
      <div slot="title"
        class="title-wrap">
        <span>分配至项目</span>
        <i class="el-icon-close"
          @click="close"></i>
      </div>

      <div class="Cdb-mountbottom"> 您已选 1台 云硬盘 <a @click="Detailshow">查看详情</a></div>
      <div v-if="Detailsshow"
        class="Cdb-mountbottom">
        <el-table :data="tableData"
          border
          style="width: 100%">
          <el-table-column prop="InstanceId"
            label="实例ID">
          </el-table-column>
          <el-table-column prop="InstanceName"
            label="实例名">
          </el-table-column>
          <el-table-column prop=""
            label="实例类型">
            <template slot-scope="scope">
              {{scope.row.InstanceType|MYSQLTYPEFilter()}}
            </template>
          </el-table-column>
          <el-table-column prop="DeadlineTime"
            label="关联实例">
            <template slot-scope="scope">
              -
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="Cdb-information">
        <p>1. 重启期间，实例将无法正常提供服务，已有的连接会断掉，请您做好准备，以免造成影响。</p>
        <p>2. 重启期间，如果业务写入量大，脏页会很多，为减少业务不可用时长，可能会导致重启失败。</p>
        <p>3. 只读实例重启期间，权重与剔除策略对其不生效，请您保持关注。</p>
        <p>此次重启预计耗时50秒</p>
      </div>
<div class="Cdb-mountbottom Cdbchecked">
    <el-checkbox v-model="checked">已阅读并同意</el-checkbox><a href="">重启规则</a>
</div>
      <span slot="footer"
        class="dialog-footer">
        <el-button type="primary"
        :disabled="this.checked===false"
          @click="restart">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    restartShow: Boolean,
    Cdbdata: Object
  },
  data () {
    return {
      Detailsshow: false,
      tableData: [],
      checked: false
    }
  },
  components: {},
  created () {
    this.tableData.push(this.Cdbdata)
    console.log(this.tableData)
  },
  methods: {
    Detailshow () {
      this.Detailsshow = !this.Detailsshow
    },

    // 分配项目确定
    restart () {
      var parms = {
        Version: '2017-03-20',
        Region: this.$cookie.get('regionv2'),
        'InstanceIds.0': this.Cdbdata.InstanceId
      }
      this.axios.post('cdb2/RestartDBInstances', parms).then(data => {
        if (data.Response.Error === undefined) {
          this.$emit('restartShow', false)
          this.$parent.getDataList()
          this.$message({
            message: '重启成功',
            type: 'success'
          })
        }
      })
    },

    // 取消
    close () {
      this.$emit('restartShow', false)
    }
  }
}
</script>

<style lang="scss" >
.Cdb-restart {
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
  }
.Cdb-information{
p{
  color: #ff9d00;
}
}
.Cdbchecked{
  a{padding-left: 10px;}
}
  .Cdb-mountbottom {
    margin-bottom: 15px;
  }
}
</style>
