<template>
  <div>
    <div class="title_top">
      <h1>历史记录导出</h1>
    </div>
    <div class="tea-content__body">
      <div class="explain">
        <p>温馨提示：</p>
        <p>
          <span>1. 历史数据导出为离线操作，导出成功后将通过邮件和短信下发确认投递通知，请确保</span>
          <a href="JavaScript:;">联系方式</a>
          <span>无误。</span>
        </p>
        <p>
          <span>2. 已导出的数据系统仅支持保存 5 个工作日，请尽快投递至 cos 存储桶，超过有效期未处理则视作丢弃。</span>
        </p>
        <p>
          <span>3. 导出的数据投递至 cos 中所产生的存储费用，将依据 COS 标准计费进行收取，</span>
          <a href="JavaScript:;">查看COS计费详情。</a>
        </p>
      </div>
      <div class="btn">
        <el-button :plain="true" type="text" @click="dialogVisible = true">申请导出</el-button>
      </div>
      <div class="tables">
        <el-table :data="tableData" style="width: 100%">
          <template slot="empty">暂无历史导出记录</template>
          <el-table-column width="27"></el-table-column>
          <el-table-column prop="name" label="数据导出范围" width="225">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text">{{ scope.row.name }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="isMultiRegionAudit" label="数据大小" width="225">
            <template slot-scope="scope">
              <div v-if="scope.row.isMultiRegionAudit==1">是</div>
              <div v-if="scope.row.isMultiRegionAudit==0">否</div>
            </template>
          </el-table-column>
          <el-table-column prop="bucketName" label="数据有效期" width="225"></el-table-column>
          <el-table-column prop="status" label="状态" width="125">
            <template slot-scope="scope">
              <div v-if="scope.row.status==0" class="close_color">关闭</div>
              <div v-if="scope.row.status==1" class="off_color">开启</div>
            </template>
          </el-table-column>
          <el-table-column prop label="数据申请时间"></el-table-column>
          <el-table-column prop label="操作"></el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 模态框 -->
    <el-dialog title="导出条件" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form :model="form">
        <el-form-item label="时间范围">
          <el-radio-group v-model="form.radio2">
            <el-radio :label="0">最近一个月</el-radio>
            <el-radio :label="1">最近六个月</el-radio>
            <el-radio :label="2">自定义时间</el-radio>
          </el-radio-group>
          <el-button type="primary" @click="innerVisible = true">打开内层 Dialog</el-button>
        </el-form-item>
      </el-form>
      <el-dialog width="30%" title="操作提示" :visible.sync="innerVisible" append-to-body>
       <p>1. 历史数据导出为离线操作，导出成功后将通过邮件和短信下发确认投递通知，请确保联系方式无误。</p>
       <p>2. 导出数据投递至 cos 所产生的存储费用，将依据 COS 标准计费进行收取，查看 COS 计费详情。</p>
       <el-radio >上述信息我已知晓</el-radio>
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value1: '',
      input3: '',
      visible: false,
      dialogVisible: false, // 模态框
      innerVisible: false, // 内层模态窗
      form: {
        radio: 1
      },
      tableData: [] // 列表数据
    }
  },
  methods: {
    // 模态框的关闭
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.title_top {
  height: 50px;
  background: #fff;
  h1 {
    padding-left: 20px;
    line-height: 50px;
    font-size: 16px;
    font-weight: 700;
  }
}
.tea-content__body {
  padding: 20px;
  .explain {
    font-size: 12px;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
    p {
      line-height: 20px;
    }
  }
}
.btn {
  .over {
    position: relative;
    width: 66px;
    height: 30px;
    overflow: hidden;
    & > p {
      width: 144px;
      position: absolute;
      left: 30px;
      color: #fff;
      background: rgb(29, 29, 29);
      padding: 5px 10px;
      border-radius: 5px;
      z-index: 100;
      font-size: 12px;
    }
  }
  :hover {
    overflow: visible;
  }
  .el-button {
    padding:8px;
    height: 30px;
    background-color: #006eff;
    color: #fff;
    border: 1px solid #006eff;
    line-height: 0px;
    border-radius: 0px;
    font-size: 12px !important;
  }
  .el-button.is-plain:hover {
    background-color: #0063e5;
    color: #fff;
    border: 1px solid #0063e5;
  }
}
.tables {
  margin-top: 10px;
  .el-table th > .cell {
    font-size: 12px;
  }
  .el-table td {
    font-size: 12px;
  }
  .el-table .cell {
    height: 23px;
  }
  .el-button--text {
    height: 23px;
    line-height: 0px;
  }
  .el-table td:nth-of-type(2) {
    color: #006eff;
  }
  .close_color {
    color: #e54545;
  }
  .off_color {
    color: #0abf5b;
  }
}
</style>
