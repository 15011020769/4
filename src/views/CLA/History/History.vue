<template>
  <div>
    <div class="title_top">
      <h1>{{ $t('CLA.total.lsjldc') }}</h1>
    </div>
    <div class="tea-content__body">
      <div class="explain">
        <p>{{ $t('CLA.total.wxts') }}：</p>
        <p>
          <span>{{ $t('CLA.total.lsjlts') }}</span>
          <!-- <a href="JavaScript:;">联系方式</a> -->
          <span>{{ $t('CLA.total.ww') }}</span>
        </p>
        <p>
          <span
            >{{ $t('CLA.total.lsjlts2') }}</span
          >
        </p>
        <p>
          <span>{{ $t('CLA.total.lsjlts3') }}</span>
          <!-- <a href="JavaScript:;">查看COS计费详情。</a> -->
        </p>
      </div>
      <div class="btn">
        <el-button :plain="true" type="text" @click="dialogVisible = true">{{ $t('CLA.total.sqdc') }}</el-button>
      </div>
      <div class="tables">
        <el-table :data="tableData" style="width: 100%">
          <template slot="empty">{{ $t('CLA.total.zwlsdcjl') }}</template>
          <el-table-column prop="name" :label="$t('CLA.total.sjdcfw')">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column prop="" :label="$t('CLA.total.sjdx')">
            <template slot-scope="scope"> {{ scope.row.size }} MB </template>
          </el-table-column>
          <el-table-column prop="" :label="$t('CLA.total.sjyxq')">
            <template slot-scope="scope"> {{ scope.row.time }} 天 </template>
          </el-table-column>
          <el-table-column prop="status" :label="$t('CLA.total.zt')">
            <template slot-scope="scope">
              <div v-if="scope.row.status == 0">
                <i class="el-icon-time close_color"></i> {{ $t('CLA.total.dtd') }}
              </div>
              <div v-if="scope.row.status == 1"><i class="el-icon-time off_color"></i>{{ $t('CLA.total.td') }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="dataTime" :label="$t('CLA.total.sjsqsj')"></el-table-column>
          <el-table-column prop :label="$t('CLA.total.cz')">
            <el-button type="text" @click="sendVisible = true">{{ $t('CLA.total.tdz') }} cos</el-button>
            <el-button type="text" @click="discardVisible = true">{{ $t('CLA.total.dqsj') }}</el-button>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 50, 100, 200]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="4"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 导出模态框 -->
    <el-dialog
      :title="$t('CLA.total.dctj')"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form :model="form">
        <el-form-item :label="$t('CLA.total.sjfw')">
          <el-radio-group v-model="form.radio2">
            <el-radio :label="0">{{ $t('CLA.total.zjygy') }}</el-radio>
            <el-radio :label="1">{{ $t('CLA.total.zjlgy') }}</el-radio>
            <el-radio :label="2">{{ $t('CLA.total.zdysj') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-dialog width="30%" :title="$t('CLA.total.czts')" :visible.sync="innerVisible" append-to-body>
        <p>
         {{ $t('CLA.total.dcts') }} 
        </p>
        <p>
         {{ $t('CLA.total.dcts2') }} 
        </p>
        <el-radio v-model="radioIn">{{ $t('CLA.total.wyzx') }}</el-radio>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="innerVisible = false">{{ $t('CLA.total.qd') }}</el-button>
          <el-button @click="innerVisible = false">{{ $t('CLA.total.qx') }}</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="innerVisible = true">{{ $t('CLA.total.qd') }}</el-button>
        <el-button @click="dialogVisible = false">{{ $t('CLA.total.qx') }}</el-button>
      </div>
    </el-dialog>
    <!-- 投递cos模态窗 -->
    <el-dialog :title="$t('CLA.total.costd')" :visible.sync="sendVisible" class="formDialog">
      <el-form :model="sendCos">
        <el-form-item :label="$t('CLA.total.coscct')">
          <el-radio-group v-model="sendCos.isCreate">
            <el-radio label="PT">{{ $t('CLA.total.s') }}</el-radio>
            <el-radio label="AU">{{ $t('CLA.total.f') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('CLA.total.coscct')">
          <el-select v-model="sendCos.region" placeholder="">
            <el-option :label="$t('CLA.total.zgtb')" value="taibei"></el-option>
          </el-select>
          <el-input v-model="sendCos.input" :placeholder="$t('CLA.total.qsrnr')"></el-input>
          <p class="edit-p">{{ $t('CLA.total.cxtj') }}</p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sendVisible = false">{{ $t('CLA.total.qx') }}</el-button>
        <el-button type="primary">{{ $t('CLA.total.qd') }}</el-button>
      </div>
    </el-dialog>
    <!-- 丢弃数据的模态窗 -->
    <el-dialog
      :title="$t('CLA.total.qddqsj')"
      :visible.sync="discardVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>{{ $t('CLA.total.dqsjh') }}</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="discardVisible = false">{{ $t('CLA.total.qx') }}</el-button>
        <el-button type="primary" @click="discardVisible = false">{{ $t('CLA.total.qd') }}</el-button>
      </div>
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
      discardVisible: false,
      sendVisible: false,
      innerVisible: false, // 内层模态窗
      radioIn: 1,
      form: {
        radio: 1
      },
      tableData: [
        {
          name: '2019-10-19 ~ 2019-11-19',
          size: '129',
          time: '5',
          status: 0,
          dataTime: '2019-11-19 19:40:37'
        }
      ], // 列表数据
      sendCos: {
        isCreate: 0,
        region: '',
        input: ''
      },
      currentPage: 1
    }
  },
  methods: {
    // 模态框的关闭
    handleClose (done) {
      this.$confirm('確認關閉？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    handleSizeChange (val) {
      console.log(`每頁 ${val} 條`)
    },
    handleCurrentChange (val) {
      console.log(`當前頁: ${val}`)
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
    padding: 8px;
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
  .el-table {
    font-size: 12px;
  }
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
    color: orange;
  }
  .off_color {
    color: #0abf5b;
  }
}
.el-pagination{
  float: right;
}
.formDialog {
  .el-select {
    float: left;
    margin-right: 10px;
  }
  .el-input {
    width: 150px;
  }
  .edit-p {
    margin-left: 10%;
  }
}

.el-dialog__wrapper {
  ::v-deep .el-dialog__title {
    font-weight: 700;
    font-size: 14px;
  }
  ::v-deep .el-radio__label {
    font-size: 12px;
    width: 90px;
    text-align: left;
  }
}
.el-form {
  ::v-deep .el-form-item__label {
    font-size: 12px;
    text-align: left;
  }
}
.el-input {
  ::v-deep .el-input__inner {
    height: 30px;
    width: 200px;
    line-height: 30px
  }
}
.el-select {
  ::v-deep .el-input__inner {
    height: 30px;
    line-height: 30px
  }
}
.dialog-footer {
  text-align: center;
  .el-button {
    height: 30px;
    line-height: 0;
    border-radius: 0;
  }
}
</style>
