<template>
  <div class="delete">
    <el-dialog :visible.sync="newLinkagesShow.newLinkagesState" width="63.01%" :show-close="false">
      <div class="title">
        <h3>新增实例关联</h3>
        <a href="javascript:;" @click="cancel()">
          <i class="el-icon-close"></i>
        </a>
      </div>
      <div class="body">
        <div class="tips">
          <p>当实例绑定多个安全组时，新绑定的安全组将自动设为最高优先级。</p>
          <p>安全组绑定私有网络云主机时，默认绑定在云主机的主网卡上。</p>
        </div>
        <div class="big-box">
          <div class="left">
            <p>请选择"安全组:"要绑定的实例</p>
            <el-input placeholder="请输入名称/ID/IP（仅显示未关联该安全组的实例）">
              <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
            <div class="left-table-box">
              <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                height="310px"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="40px" align="center"></el-table-column>
                <el-table-column label="实例ID/名称">
                  <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column prop="name" label="所属网络"></el-table-column>
                <el-table-column prop="address" label="主 IP 地址"></el-table-column>
              </el-table>
            </div>
          </div>
          <div class="center">
            <i class="iconfont">&#xe656;</i>
          </div>
          <div class="right">
            <p>已选择(0/100)</p>
            <div class="right-table-box">
              <el-table :data="tableData" style="width: 100%" height="340px">
                <el-table-column label="实例ID/名称"></el-table-column>
                <el-table-column label="所属网络"></el-table-column>
                <el-table-column label="主 IP 地址"></el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="deleteRow(scope.$index, tableData)"
                      type="text"
                      size="small"
                    >移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <el-button type="primary" @click="DeleteSure()">确 定</el-button>
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
  props: {
    newLinkagesShow: {
      type: Object,
      default: () => []
    }
  },
  created() {},
  methods: {
    DeleteSure() {},
    // 搜索
    search() {},
    // 删除
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    cancel() {
      this.$emit("close", false);
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.delete {
  ::v-deep .el-dialog__header {
    padding: 0px;
  }
  ::v-deep .el-dialog__body {
    padding: 0px;
  }
  ::v-deep .el-dialog__footer {
    padding: 0px;
  }
  ::v-deep .el-dialog {
    padding: 20px;
  }
  .title {
    height: 26px;
    line-height: 26px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
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
    font-size: 12px;
    .tips {
      background: #e5f0ff;
      padding: 8px 10px;
      margin-bottom: 15px;
      border-radius: 2px;
      border: 1px solid #97c7ff;
      line-height: 20px;
      color: #003b80;
    }
    .big-box {
      display: flex;
      justify-content: space-between;
      .left {
        width: 47.5%;
        height: 380px;
        ::v-deep .el-input-group > .el-input__inner {
          width: 100%;
          border-radius: 0px;
          padding: 0 30px 0 10px;
          font-size: 12px;
          border: 1px solid #ddd;
        }
        ::v-deep .el-input-group__append {
          padding: 0px;
          border: 0px;
          border-radius: 0px;
          width: 0px;
        }
        ::v-deep .el-button {
          width: 30px;
          height: 28px;
          line-height: 28px;
          padding: 0px;
          margin-left: -31px;
          border-radius: 0px;
          &:hover {
            background: #f2f2f2;
          }
        }
        & > p {
          height: 31px;
          line-height: 31px;
          color: #444;
          font-size: 12px;
          font-weight: 700;
        }
        .left-table-box {
          border: 1px solid #ddd;
          border-top: 0px;
          ::v-deep .el-table th {
            padding: 0px;
            height: 40px;
          }
          ::v-deep .el-table th > .cell {
            padding: 0px;
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
      .center {
        width: 5%;
        height: 380px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .right {
        width: 47.5%;
        height: 380px;
        & > p {
          height: 31px;
          line-height: 31px;
          color: #444;
          font-size: 12px;
          font-weight: 700;
        }
        .right-table-box {
          border: 1px solid #ddd;
          ::v-deep .el-table th {
            padding: 0px;
            height: 40px;
          }
          ::v-deep .el-table th > .cell {
            padding: 0px 10px;
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
    }
  }
  .footer {
    display: flex;
    justify-content: center;
    margin-top: 27px;
    /* 确定--取消按钮 */
    .el-button {
      width: 66px !important;
      padding: 0px;
      height: 30px;
      border-radius: 0px;
    }
    .el-button--primary {
      background: #006eff;
      border-color: #006eff !important;
    }
  }
}
</style>

