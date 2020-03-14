<template>
  <div class="security-rules">
    <div class="tab">
      <div class="tab-box">
        <div class="btn">
          <div>
            <el-row>
              <el-button type="primary" @click="AddBtn">新增</el-button>
              <el-button disabled v-if="multipleSelection1.length === 0"
                >移出</el-button
              >
              <el-button
                v-if="multipleSelection1.length !== 0"
                @click="allDelete = true"
                >移出</el-button
              >
            </el-row>
          </div>
        </div>
        <div class="table">
          <el-table
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
                <a href="javascript:;" @click="MoveOut(scope.row)">移出</a>
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
        v-loading="loadShowAdd"
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
                    <el-select
                      v-model="searchSelectProject"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in projectOptions"
                        :key="item.projectId"
                        :label="item.projectName"
                        :value="item.projectId"
                      >
                      </el-option>
                    </el-select>
                    <el-select v-model="searchSelect" placeholder="请选择">
                      <el-option
                        v-for="item in selectOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                    <el-input
                      placeholder="请输入内容"
                      v-model="searchInput"
                      class="input-with-select"
                    >
                      <el-button
                        slot="append"
                        icon="el-icon-search"
                        @click="AddDataList"
                      ></el-button>
                    </el-input>
                  </div>
                  <el-table
                    :data="tableData"
                    height="420"
                    ref="multipleTable"
                    @selection-change="AddHandleSelectionChange"
                    class="table-left"
                  >
                    <el-table-column
                      type="selection"
                      width="55"
                      :selectable="selectInit"
                    ></el-table-column>
                    <el-table-column label="ID/主机名" width="120">
                      <template slot-scope="scope">
                        <p>
                          <a href="javascript:;">{{ scope.row.InstanceId }}</a>
                        </p>
                        <p>{{ scope.row.InstanceName }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="网络类型" width="120"
                      >VPC 网络</el-table-column
                    >
                    <el-table-column label="IP地址" width="120">
                      <template slot-scope="scope">
                        <p>{{ scope.row.PrivateIpAddresses[0] }}(内网)</p>
                        <p class="out">
                          {{ scope.row.PublicIpAddresses[0] }}(外网)
                        </p>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <div class="mid">
                <i class="el-icon-connection"></i>
              </div>
              <div class="right">
                <div class="right-main border">
                  <el-table
                    :data="multipleSelection"
                    style=""
                    height="450"
                    class="table-left"
                  >
                    <el-table-column label="ID/主机名" width="120">
                      <template slot-scope="scope">
                        <p>
                          <a href="javascript:;">{{ scope.row.InstanceId }}</a>
                        </p>
                        <p>{{ scope.row.InstanceName }}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="网络类型" width="100"
                      >VPC 网络</el-table-column
                    >
                    <el-table-column label="IP地址" width="170">
                      <template slot-scope="scope">
                        <div class="resses">
                          <div>
                            <p>{{ scope.row.PrivateIpAddresses[0] }}(内网)</p>
                            <p class="out">
                              {{ scope.row.PublicIpAddresses[0] }}(外网)
                            </p>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column width="50">
                      <template slot-scope="scope">
                        <div class="resses">
                          <i
                            class="el-icon-error ml5"
                            @click="DeleteListAdd(scope.row)"
                          ></i>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p slot="footer" class="dialog-footer" style="text-align:center">
          <el-button type="primary" @click="save">保 存</el-button>
          <el-button @click="newBuildByVal.newBuildState = false"
            >取 消</el-button
          >
        </p>
      </el-dialog>
      <!-- 移出 -->
      <el-dialog
        title="确定移出所选实例？"
        :visible.sync="rulesEditorByVal.rulesEditorState"
        width="500px"
        custom-class="tke-dialog"
      >
        <div>
          移出后，该组之前绑定的告警策略将与该实例解绑，该组后续所涉及的操作将不会对该实例生效。
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="DeleteList()">确定移出</el-button>
          <el-button @click="rulesEditorByVal.rulesEditorState = false"
            >取消</el-button
          >
        </div>
      </el-dialog>
      <!-- 批量移出 -->
      <el-dialog
        :title="
          '已选择' + multipleSelection1.length + '个实例，确定要解除关联？'
        "
        :visible.sync="allDelete"
        width="500px"
        custom-class="tke-dialog"
      >
        <div>
          移出后，该组之前绑定的告警策略将与该实例解绑，该组后续所涉及的操作将不会对该实例生效。
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="DeleteList()"
            >确定移出所选实例</el-button
          >
          <el-button @click="allDelete = false">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import {
  CM_GROUPING_MANAGE,
  CM_GROUPING_MANAGELIST,
  CM_GROUPING_MOVE,
  CM_GROUPING_MANAGELIST_ADD,
  ALL_PROJECT,
  TKE_EXIST_NODES,
  CM_GROUPING_NEWLY_BUILD
} from "@/constants";
export default {
  data() {
    return {
      activeName: "first",
      enterList: [],
      loadShow: true,
      loadShowAdd: true,
      multipleSelection: [],
      multipleSelection1: [],
      newBuildByVal: {
        // 新建
        newBuildState: false
      },
      rulesEditorByVal: {
        rulesEditorState: false
      },
      allDelete: false,
      //分页
      total: 0, //总条数
      pageSize: 10, // 分页条数
      pageIndex: 0, // 当前页码
      tableData: [],
      input: "",
      delete: "",
      searchInput: "",
      searchSelectProject: 0,
      projectOptions: [
        {
          projectId: 0,
          projectName: "默认项目"
        }
      ],
      searchSelect: "",
      selectOptions: [
        {
          value: "1",
          label: "主机ID"
        },
        {
          value: "2",
          label: "IP"
        },
        {
          value: "3",
          label: "主机名"
        }
      ]
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
    this.NewProject();
    this.ListInit();
  },
  methods: {
    // 项目
    NewProject() {
      this.axios.get(ALL_PROJECT).then(res => {
        if (res.codeDesc === "Success") {
          var arr = res.data;
          for (var i in arr) {
            this.projectOptions.push(arr[i]);
          }
        } else {
          let ErrTips = {
            InternalError: "内部错误",
            UnauthorizedOperation: "未授权操作"
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
    },
    async ListInit() {
      this.loadShow = true;
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        InstanceGroupId: this.Rules.instanceGroupId,
        Limit: this.pageSize,
        Offset: this.pageIndex
      };
      await this.axios.post(CM_GROUPING_MANAGE, param).then(res => {
        if (res.Response.Error === undefined) {
          var _enterList = res.Response.InstanceList;
          this.total = res.Response.Total;
          let params = {
            Version: "2017-03-12",
            Limit: this.pageSize,
            Offset: this.pageIndex
          };
          for (let i in _enterList) {
            params["InstanceIds." + i] = JSON.parse(
              _enterList[i].Dimensions
            ).unInstanceId;
          }
          this.axios.post(CM_GROUPING_MANAGELIST, params).then(res => {
            if (res.Response.Error === undefined) {
              this.enterList = res.Response.InstanceSet;
              for (let i in _enterList) {
                for (let j in this.enterList) {
                  if (
                    JSON.parse(_enterList[i].Dimensions).unInstanceId ===
                    this.enterList[j].InstanceId
                  ) {
                    this.enterList[j]["UniqueId"] = _enterList[i].UniqueId;
                  }
                }
              }
              console.log(this.enterList);
              this.loadShow = false;
            } else {
              let ErrTips = {
                FailedOperation: "操作失败",
                InternalError: "内部错误",
                "InternalError.Param": "Param。",
                "InternalError.PublicClusterOpNotSupport":
                  "集群不支持当前操作。",
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
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
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
    // 新增
    AddBtn() {
      this.newBuildByVal.newBuildState = true;
      this.loadShowAdd = true;
      this.AddDataList();
    },
    DeleteListAdd(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
      for (var i in this.multipleSelection) {
        if (row.InstanceId === this.multipleSelection[i].InstanceId) {
          this.multipleSelection.splice(this.multipleSelection[i], 1);
        }
      }
    },
    save() {
      let param = {
        GroupName: this.Rules.groupName,
        Version: "2018-07-24",
        Module: "monitor",
        ViewName: this.Rules.viewName
      };
      console.log(this.multipleSelection);
      for (let i in this.multipleSelection) {
        param["InstanceList." + i + ".Region"] = "ap-taipei";
        // param["InstanceList." + i + ".Dimensions"] = JSON.stringify({
        //   unInstanceId: this.multipleSelection[i].InstanceId
        // });
        // param["InstanceList." + i + ".EventDimensions"] = JSON.stringify({
        //   uuid: this.multipleSelection[i].Uuid
        // });
        param["InstanceList." + i + ".Dimensions"] = {
          unInstanceId: this.multipleSelection[i].InstanceId
        };
        param["InstanceList." + i + ".EventDimensions"] = {
          uuid: this.multipleSelection[i].Uuid
        };
      }
      this.axios.post(CM_GROUPING_NEWLY_BUILD, param).then(res => {
        if (res.Response.Error === undefined) {
          console.log(res);
        } else {
          let ErrTips = {
            FailedOperation: "操作失败。",
            InternalError: "内部错误。",
            "InternalError.ExeTimeout": "执行超时。",
            InvalidParameter: "参数错误。",
            "InvalidParameter.InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameterParam": "参数错误。",
            InvalidParameterValue: "无效的参数值。",
            LimitExceeded: "超过配额限制。",
            MissingParameter: "缺少参数错误。",
            UnknownParameter: "未知参数错误。",
            UnsupportedOperation: "操作不支持。"
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
    },
    // 移出
    MoveOut(row) {
      console.log(row);
      this.rulesEditorByVal.rulesEditorState = true;
      this.multipleSelection1 = row;
    },
    // 确定移出
    DeleteList() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        InstanceGroupId: this.Rules.instanceGroupId
      };
      if (!Array.isArray(this.multipleSelection1)) {
        param["UniqueIds.0"] = this.multipleSelection1.UniqueId;
      } else {
        for (let i in this.multipleSelection1) {
          param["UniqueIds." + i] = this.multipleSelection1[i].UniqueId;
        }
      }
      this.axios.post(CM_GROUPING_MOVE, param).then(res => {
        if (res.Response.Error === undefined) {
          this.rulesEditorByVal.rulesEditorState = false;
          this.allDelete = false;
          this.ListInit();
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    async AddDataList() {
      let param = {
        Version: "2017-03-12",
        Region: "ap-taipei",
        Limit: 100
      };
      param["Filters.0.Name"] = "project-id";
      param["Filters.0.Values.0"] = this.searchSelectProject;
      if (this.searchSelect == 1 && this.searchInput != "") {
        param["Filters.1.Name"] = "instance-id";
        param["Filters.1.Values.0"] = this.searchInput;
      } else if (this.searchSelect == 2 && this.searchInput != "") {
        param["Filters.1.Name"] = "private-ip-address";
        param["Filters.1.Values.0"] = this.searchInput;
      } else if (this.searchSelect == 3 && this.searchInput != "") {
        param["Filters.1.Name"] = "instance-name";
        param["Filters.1.Values.0"] = this.searchInput;
      }
      if (this.searchSelect == "") {
        if (this.searchInput != "") {
          if (this.searchInput.slice(0, 4) === "ins-") {
            this.searchSelect = "1";
            param["Filters.1.Name"] = "instance-id";
            param["Filters.1.Values.0"] = this.searchInput;
          } else {
            this.searchSelect = "3";
            param["Filters.1.Name"] = "instance-name";
            param["Filters.1.Values.0"] = this.searchInput;
          }
        }
      }
      await this.axios.post(TKE_EXIST_NODES, param).then(res => {
        if (res.Response.Error === undefined) {
          this.tableData = res.Response.InstanceSet;
          this.loadShowAdd = false;
        } else {
          this.loadShowAdd = false;
          let ErrTips = {
            InternalServerError: "操作内部错误。",
            InvalidFilter: "无效的过滤器。",
            "InvalidFilterValue.LimitExceeded": "Filter参数值数量超过限制。",
            "InvalidHostId.Malformed":
              "无效CDH ID。指定的CDH ID格式错误。例如ID长度错误host-1122。",
            "InvalidInstanceId.Malformed":
              "无效实例ID。指定的实例ID格式错误。例如实例ID长度错误ins-1122。",
            InvalidParameter: "无效参数。参数不合要求或者参数不被支持等。",
            InvalidParameterValue:
              "无效参数值。参数值格式错误或者参数值不被支持等。",
            "InvalidParameterValue.LimitExceeded": "参数值数量超过限制。",
            "InvalidZone.MismatchRegion": "指定的zone不存在。"
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
    },
    handleSelectionChange(val) {
      this.multipleSelection1 = val;
    },
    AddHandleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 复选框操作
    selectInit(row, index) {
      if (
        this.enterList.some(el => {
          return el.InstanceId === row.InstanceId;
        })
      ) {
        return false;
      } else {
        return true;
      }
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
        display: flex;
        ::v-deep .el-select {
          width: 100px;
          font-size: 12px;
        }
        ::v-deep .el-input-group {
          width: 60%;
        }
        ::v-deep .el-input__inner {
          border-radius: 0;
          height: 30px;
          font-size: 12px;
          padding: 0px 10px;
        }
        ::v-deep .el-input-group__append {
          border-radius: 0;
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
.tke-dialog {
  ::v-deep .el-dialog__footer {
    text-align: center;
  }
}
</style>
