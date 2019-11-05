<template>
  <div class="renew">
    <el-dialog :visible.sync="backVal.backshot" :show-close="false" width="55%">
      <div slot="title" class="title-wrap">
        <span>回滚数据</span>
        <i class="el-icon-close" @click="handleCancel"></i>
      </div>
      <div class="content">
        <span>
          您已选
          <span>1个快照</span>，
        </span>
        <span class="packdown">查看详情</span>
        <el-button type="text" class="basicInfo-pack" @click="handlePack">
          <i :class="[basic?'el-icon-arrow-up':'el-icon-arrow-down']"></i>
        </el-button>
        <div :class="[basic?'table':'']">
          <el-table
            ref="instanceTable"
            :data="instanceInfo"
            :header-cell-style="{'font-size':'12px'}"
            :row-style="tableRowStyle"
            v-if="basic"
          >
            <el-table-column prop="address" label="No.1" width="50">
              <template slot-scope="scope">
                <div class="detail-code">1</div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="快照名称">
              <template slot-scope="scope">
                <div class="detail-code">{{backVal.backId.SnapshotName}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="快照ID">
              <template slot-scope="scope">
                <div class="detail-code">{{backVal.backId.SnapshotId}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="关联硬盘">
              <div class="detail-code">{{backVal.backId.DiskId}}</div>
            </el-table-column>
          </el-table>
        </div>
         <div>
            <p>系统盘 disk-hf8sy5fl 的数据将回滚到 2019-03-18 14:25:43</p>
            <p>此时刻之后的数据将被清除，请谨慎操作！</p>
          </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="handleback">确定</el-button>
          <el-button size="mini" @click="handleCancel">取消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      basic: true,
      instanceInfo: [
        {
          address: '1'
        }
      ],
      currentIndex: 0
    }
  },
  props: {
    backVal: {
      type: Object,
      default: () => []
    }
  },
  computed: {},
  methods: {
    tableRowStyle ({ row, rowIndex }) {
      return {
        'font-size': '12px'
      }
    },
    handlePack () {
      this.basic = !this.basic
    },
    handleback () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        'SnapshotId': this.backVal.backId.SnapshotId,
        'DiskId': this.backVal.backId.DiskId
      }
      this.axios.post('cbs2/ApplySnapshot', parms).then(data => {
        // console.log(data)
        this.$message({
          message: '回滚成功',
          type: 'success'
        })
        this.$parent.getDataList() // 请求父组件的列表
        this.$emit('close', false)
      }).catch(error => {
        this.$message({
          message: error,
          type: 'error'
        })
      })
    },
    handleCancel () {
      this.$emit('close', false)
    },
    handleCheck (index) {
      this.currentIndex = index
      if (this.currentIndex <= 2) {
      }
    }
  },
  components: {},
  mounted () {}
}
</script>
<style lang="scss" scoped>
.renew {
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
    }
  }
  .content {
    font-size: 12px;
    .packdown {
      color: #006eff;
    }
    .table {
      border: 1px solid #eee;
      border-bottom: none;
    }
    .title-Num {
      margin-top: 20px;
      .title-left {
        display: inline-block;
        width: 100px;
      }
    }
    .dialog-footer {
      display: block;
      text-align: center;
      padding-top: 10px;
    }
  }
}
</style>
