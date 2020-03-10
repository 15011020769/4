<template>
  <div class="security-rules">
    <div class="tab">
      <div class="tab-box">
        <div class="btn">
          <div>
            <el-row>
              <el-button
                type="primary"
                @click="newBuildByVal.newBuildState = true"
                >新增</el-button
              >
              <el-button disabled v-if="multipleSelection.length === 0"
                >移出</el-button
              >
              <el-button
                v-if="multipleSelection.length !== 0"
                @click="Deleles(multipleSelection)"
                >移出</el-button
              >
            </el-row>
          </div>
        </div>
        <div class="table">
          <el-table
            ref="multipleTable"
            :data="enterList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            v-loading="loadShow"
            height="500px"
          >
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column label="ID/主机名">
              <template slot-scope="scope">
                <a href="javascript:;">{{ scope.row.InstanceId }}</a>
                <p>{{ scope.row.InstanceName }}</p>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span>{{ InstanceState(scope.row.InstanceState) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="网络类型">
              VPC 网络
            </el-table-column>
            <el-table-column label="IP地址">
              <template slot-scope="scope">
                <p>{{ scope.row.PrivateIpAddresses[0] }}(内网)</p>
                <p>{{ scope.row.PublicIpAddresses[0] }}(外网)</p>
              </template>
            </el-table-column>
            <el-table-column label="地域">
              中国台北
            </el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <a href="javascript:;" @click="Editor(scope.row)">移出</a>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="tke-page">
            <div class="block">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增 -->
    <div class="wraps">
      <el-dialog
        :visible.sync="newBuildByVal.newBuildState"
        width="1024px"
        :show-close="false"
        class="dialog-box"
      >
        <div class="title">
          <h3>新建</h3>
          <a href="javascript:;" @click="newBuildByVal.newBuildState = false">
            <i class="el-icon-close"></i>
          </a>
        </div>
        <div class="dialog">
          <div class="p">
            <div class="main" style="background:white;">
              <div class="left">
                <div class="left-main border">
                  <div class="seek" style="">
                    <el-input
                      v-model="input"
                      placeholder="请输入内容"
                      style=""
                    ></el-input>
                    <p>
                      <i class="el-icon-search"></i>
                    </p>
                  </div>
                  <el-table
                    :data="tableData"
                    height="420"
                    @selection-change="AddHandleSelectionChange"
                  >
                    <el-table-column
                      type="selection"
                      width="55"
                    ></el-table-column>
                    <el-table-column
                      prop="PolicyName"
                      label="ID/主机名"
                      width="80"
                    ></el-table-column>
                    <el-table-column
                      prop="Type"
                      label="网络类型"
                      width="120"
                    ></el-table-column>
                    <el-table-column
                      prop="PolicyName"
                      label="IP地址"
                      width="120"
                    ></el-table-column>
                  </el-table>
                </div>
              </div>
              <div class="mid">
                <i class="el-icon-connection"></i>
              </div>
              <div class="right">
                <div class="right-main border">
                  <el-table :data="multipleSelection" height="460">
                    <el-table-column
                      prop="PolicyName"
                      label="策略名"
                      width="80"
                    ></el-table-column>
                    <el-table-column prop="Type" label="策略类型" width="150">
                      <template slot-scope="scope">
                        <p>{{ type[scope.row.Type] }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="PolicyName"
                      label="IP地址"
                      width="150"
                    ></el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p slot="footer" class="dialog-footer" style="text-align:center">
          <el-button type="primary" @click="save">保 存</el-button>
          <el-button @click="newBuildByVal.newBuildState">取 消</el-button>
        </p>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import { CM_GROUPING_MANAGE, CM_GROUPING_MANAGELIST } from "@/constants";
export default {
  data() {
    return {
      activeName: "first",
      enterList: [],
      loadShow: true,
      multipleSelection: [],
      multipleSelection1: [],
      newBuildByVal: {
        // 新建
        newBuildState: false
      },
      rulesNewByVal: {
        rulesNewState: false,
        SecurityGroupId: this.Rules.SecurityGroupId,
        RulesType: ""
      },
      //分页
      total: 0, //总条数
      pageSize: 10, // 分页条数
      pageIndex: 0, // 当前页码
      tableData: [],
      multipleSelection: [],
      input: ""
    };
  },
  props: {
    Rules: {
      type: Object,
      default: () => []
    }
  },
  components: {},
  created() {
    this.ListInit();
    console.log(this.Rules.instanceGroupId);
  },
  methods: {
    async ListInit() {
      this.loadShow = true;
      let param = {
        instanceGroupId: this.Rules.instanceGroupId,
        lang: "zh",
        limit: this.pageSize,
        offset: this.pageIndex
      };
      await this.axios.post(CM_GROUPING_MANAGE, param).then(res => {
        // if (res.Response.Error === undefined) {
        var _enterList = res.data.instanceList;
        console.log(_enterList);
        this.total = res.data.total;
        let params = {
          Version: "2017-03-12",
          Limit: this.pageSize
        };
        for (let i in _enterList) {
          params["InstanceIds." + i] = _enterList[i].dimensions.unInstanceId;
        }
        this.axios.post(CM_GROUPING_MANAGELIST, params).then(res => {
          if (res.Response.Error === undefined) {
            this.enterList = res.Response.InstanceSet;
            console.log(this.enterList);
            this.loadShow = false;
          } else {
            let ErrTips = {
              FailedOperation: "操作失败",
              InternalError: "内部错误",
              "InternalError.Param": "Param。",
              "InternalError.PublicClusterOpNotSupport": "集群不支持当前操作。",
              InvalidParameter: "参数错误",
              ResourceNotFound: "资源不存在",
              ResourceUnavailable: "资源不可用"
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
        // } else {
        //   let ErrTips = {};
        //   let ErrOr = Object.assign(ErrorTips, ErrTips);
        //   this.$message({
        //     message: ErrOr[res.Response.Error.Code],
        //     type: "error",
        //     showClose: true,
        //     duration: 0
        //   });
        // }
      });
    },
    // 状态
    InstanceState(val) {
      if (val === "PENDING") {
        return "创建中";
      } else if (val === "LAUNCH_FAILED") {
        return "创建失败";
      } else if (val === "RUNNING") {
        return "运行中";
      } else if (val === "STOPPED") {
        return "关机";
      } else if (val === "STARTING") {
        return "关机中";
      } else if (val === "REBOOTING") {
        return "重启中";
      } else if (val === "SHUTDOWN") {
        return "停止待销毁";
      } else if (val === "TERMINATING") {
        return "销毁中";
      }
    },
    save() {},
    // 编辑
    Editor(row) {
      this.rulesEditorByVal.rulesEditorState = true;
      if (this.activeName === "first") {
        this.rulesEditorByVal.RulesType = 0;
      } else if (this.activeName === "second") {
        this.rulesEditorByVal.RulesType = 1;
      }
      this.rulesEditorByVal.EditorList = row;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    AddHandleSelectionChange(val) {
      this.multipleSelection1 = val;
    },
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val - 1;
      this.ListInit();
      this.pageIndex += 1;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.ListInit();
    }
  }
};
</script>
<style lang="scss" scoped>
.security-rules {
  .tab {
    ::v-deep .el-tabs__nav-scroll {
      padding-left: 20px !important;
    }
    ::v-deep .el-tabs__content {
      padding: 20px;
    }
    .tab-box {
      .btn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        & > div {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          height: 30px;
          & > a {
            font-size: 14px;
            font-weight: 700;
            color: #006eff;
            & > i {
              font-size: 12px;
              font-weight: 900;
            }
          }
        }
        & > a {
          & > i {
            font-size: 12px;
            color: #888;
          }
        }
        ::v-deep .el-row {
          margin-right: 30px;
        }
        ::v-deep .el-button {
          border-radius: 0px;
          height: 30px;
          padding-top: 0;
          font-size: 12px;
          padding-bottom: 0;
        }
        ::v-deep .el-button--primary {
          border-color: #006eff;
          background: #006eff;
        }
      }
      .table {
        border-bottom: 1px solid #ddd;
        margin-bottom: 16px;
        margin-top: 10px;
        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
        -webkit-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
        -webkit-box-sizing: border-box;
        ::v-deep .el-table {
          padding: 20px;
        }
        .cl {
          color: #0abf5b;
        }
        a {
          margin-right: 10px;
          color: #006eff;
          &:hover {
            text-decoration: underline;
          }
        }
        ::v-deep .el-table th {
          padding: 0px;
          height: 40px;
        }
        ::v-deep .el-table th > .cell {
          font-size: 12px;
          font-weight: 700;
          color: #888;
        }
        ::v-deep .el-table__empty-text {
          font-size: 14px;
          color: #444;
        }
        ::v-deep .el-table td {
          border-color: #e5e5e5;
        }
        ::v-deep .el-table .cell {
          font-size: 12px;
          color: #444;
        }
        ::v-deep .el-table th.is-leaf {
          border-color: #e5e5e5;
        }
      }
    }
  }
}
.tke-page {
  padding: 20px;
  display: flex;
  flex-direction: row-reverse;
  background: #fff;
}

.wraps >>> .el-button,
.wraps >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.wraps >>> .el-dialog__body {
  padding: 0 20px;
}
.wraps {
  .dialog {
    .p {
      display: flex;
      margin-bottom: 16px;

      span {
        width: 68px;
        line-height: 30px;
      }
      .group-input {
        width: 300px;
        ::v-deep .el-input__inner {
          border-radius: 0px;
          width: 300px;
          height: 30px;
        }
      }
    }
  }
}

.dialog-footer {
  text-align: center;
}
.dialog-box {
  ::v-deep .el-dialog__header {
    padding: 0px;
  }
}
.wraps >>> .el-dropdown {
  font-size: 12px;
}
.wraps >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.wraps {
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
  .main {
    display: flex;
    overflow: hidden;

    .border {
      border: 1px #f2f2f2 solid;
    }
    .left {
      // flex: 1;

      .seek {
        position: relative;

        p {
          position: absolute;
          z-index: 100px;
          top: 0;
          right: 0;
          display: flex;
          align-items: center;
          height: 100%;
          cursor: pointer;

          i {
            margin-right: 10px;
          }
        }
      }
    }
    // .right {
    //   flex: 1;
    // }
    .mid {
      width: 50px;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 20px;
      }
    }
  }
}
</style>
