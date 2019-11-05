<template>
  <div class="region-copy">
    <el-dialog :show-close="false" :visible.sync="regionCopyShow" width="39%">
      <div class="title">
        <h3>跨地域复制镜像</h3>
        <a href="javascript:;" @click="cancel()">
          <i class="el-icon-close"></i>
        </a>
      </div>
      <div class="body">
        <p>复制1个镜像（共50GB）到：</p>
        <div class="table-box">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;"
            border
            height="150px"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="地域">
              <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column prop="name" label="已有镜像"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="footer">
        <el-button type="primary">确 定</el-button>
        <el-button @click="cancel()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      multipleSelection: []
    };
  },
  props: ["regionCopyShow"],
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    cancel() {
      this.$emit("close", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.region-copy {
  ::v-deep .el-dialog__header {
    padding: 0px;
  }
  ::v-deep .el-dialog__body {
    padding: 0 20px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    & > h3 {
      color: #000;
      font-size: 14px;
      font-weight: 700;
    }
    & > a {
      display: inline-block;
      height: 26px;
      width: 26px;
      text-align: center;
      line-height: 26px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      & > i {
        color: #888;
        font-size: 18px;
        line-height: 26px;
      }
    }
  }
  .body {
    margin-top: 10px;
    & > p {
      color: #444;
      font-size: 12px;
      font-weight: 700;
    }
    .table-box {
      margin-top: 5px;
      /* 表格 */
      ::v-deep .el-table--border {
        border: 1px solid #ddd;
      }
      ::v-deep .el-table td {
        border-bottom: 1px solid #ddd;
      }
      ::v-deep .el-table th.is-leaf {
        border-bottom: 1px solid #ddd;
      }
      ::v-deep .el-table--border th {
        border-right: 0px;
      }
      ::v-deep .el-table--border td {
        border-right: 0px;
      }
      ::v-deep .el-table--border td:nth-of-type(1) {
        text-align: center;
      }
      ::v-deep .el-table th {
        padding: 0px;
        height: 40px;
      }
      ::v-deep .el-table--border th:first-child .cell:nth-child(1) {
        text-align: center;
      }
      ::v-deep .el-table th > .cell {
        color: #888;
        font-size: 12px;
        font-weight: 700;
      }
      ::v-deep .el-table .cell {
        color: #444;
        font-size: 12px;
      }
    }
  }
  .footer {
    display: flex;
    justify-content: center;
    padding: 27px 20px 20px 20px;
  }
}
/* 确定--取消按钮 */
.image-tab[data-v-11d5b2e8] .el-button {
  width: 66px !important;
}
.image-tab[data-v-11d5b2e8] .el-button:nth-of-type(1) {
  border: 0;
}
.el-button--primary {
  background: #006eff !important;
}
</style>


