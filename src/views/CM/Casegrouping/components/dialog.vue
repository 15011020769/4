<template>
  <div class="wrap">
    <el-dialog
      :visible.sync="newBuildShow.newBuildState"
      width="1024px"
      :show-close="false"
      class="dialog-box"
    >
      <div class="title">
        <h3>新建</h3>
        <a href="javascript:;" @click="cancel()">
          <i class="el-icon-close"></i>
        </a>
      </div>
      <div class="dialog">
        <div class="p">
          <span>分组名</span>
          <el-tooltip
            :disabled="groupingNameTips"
            placement="bottom"
            effect="light"
          >
            <div slot="content" class="group-name">
              <i class="el-icon-info ml5"></i>
              {{ nameTips }}
            </div>
            <el-input
              v-model="groupingName"
              placeholder="1-20个中英文字符或下划线"
              class="group-input"
              @input="GroupingNameInput"
              maxlength="20"
            ></el-input>
          </el-tooltip>
        </div>
        <div class="p">
          <span>分组类型</span>
          <grouping-type @handleChangeChild="showMsgfromChild"></grouping-type>
        </div>
        <div class="p">
          <span>添加至组</span>
          <div class="main" style="background:white;">
            <div class="left">
              <div class="left-main border">
                <div class="seek" style="">
                  <el-select v-model="searchSelectProject" placeholder="请选择">
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
                      @click="ListInit"
                    ></el-button>
                  </el-input>
                </div>
                <el-table
                  :data="tableData"
                  height="420"
                  ref="multipleTable"
                  @selection-change="handleSelectionChange"
                  v-loadmore="loadMore"
                  class="table-left"
                >
                  <el-table-column
                    type="selection"
                    width="55"
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
                          @click="DeleteList(scope.row)"
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
        <el-button @click="cancel">取 消</el-button>
      </p>
    </el-dialog>
  </div>
</template>

<script>
import GroupingType from "@/components/GroupingType";
import { ErrorTips } from "@/components/ErrorTips";
import {
  TKE_EXIST_NODES,
  ALL_PROJECT,
  CM_GROUPING_NEWLY_BUILD
} from "@/constants";
export default {
  name: "msg",
  data() {
    return {
      tableData: [],
      multipleSelection: [],
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
      ],
      groupingName: "",
      groupingNameTips: true,
      nameTips: "分组名称不能为空",
      groupingType: ["云服务器", "cvm_device"],
      loadSign: true,
      pageSize: 20, // 分页条数
      pageIndex: 0 // 当前页码
    };
  },
  components: {
    GroupingType
  },
  props: {
    newBuildShow: {
      type: Object,
      default: () => []
    }
  },
  mounted() {
    this.ListInit();
    this.NewProject();
  },
  methods: {
    cancel() {
      this.$emit("close", false);
    },
    // 分组名
    GroupingNameInput() {
      if (this.groupingName === "") {
        this.nameTips = "分组名称不能为空";
        this.groupingNameTips = false;
      } else if (this.groupingName.length == 20) {
        this.nameTips = "分组名称不能超过 20 字";
        this.groupingNameTips = false;
      } else {
        this.groupingNameTips = true;
      }
    },
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
        } else {
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
    // 保存
    save() {
      var _ViewName = "";
      if (this.groupingType.length > 0) {
        _ViewName = this.groupingType[this.groupingType.length - 1];
      }
      let param = {
        GroupName: this.groupingName,
        Version: "2018-07-24",
        Module: "monitor",
        ViewName: _ViewName
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //类型
    msgBtn(index) {
      this.liIndex = index;
    },
    // 分组类型
    showMsgfromChild(val) {
      this.groupingType = val;
      console.log(this.groupingType);
    },
    loadMore() {
      if (this.loadSign) {
        this.loadSign = false;
        this.pageIndex++;
      }
    },
    DeleteList(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
      for (var i in this.multipleSelection) {
        if (row.InstanceId === this.multipleSelection[i].InstanceId) {
          this.multipleSelection.splice(this.multipleSelection[i], 1);
        }
      }
    }
  },
  directives: {
    loadmore: {
      bind(el, binding) {
        const selectWrap = el.querySelector(".el-table__body-wrapper");
        selectWrap.addEventListener("scroll", function() {
          let sign = 100;
          const scrollDistance =
            this.scrollHeight - this.scrollTop - this.clientHeight;
          if (scrollDistance <= sign) {
            binding.value();
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.wrap >>> .el-button,
.wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.wrap >>> .el-dialog__body {
  padding: 0 20px;
}
.wrap {
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
.wrap >>> .el-dropdown {
  font-size: 12px;
}
.wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.wrap {
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
    .right {
      border: 1px #f2f2f2 solid;
      border-bottom: 0px;
    }
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
.group-name {
  color: red;
}
.table-left {
  p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    font-size: 12px;
    a {
      color: #006eff;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .out {
    color: #888;
  }
}
.resses {
  display: flex;
  align-items: center;
  i {
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>
