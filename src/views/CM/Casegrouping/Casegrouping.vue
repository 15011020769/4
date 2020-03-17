<template>
  <div class="group-wrap">
    <Header title="实例分组" />
    <div class="group-main">
      <div class="explain" style="margin-bottom:20px;">
        <p>
          实例分组功能提供对跨地域、跨项目组的云产品资源进行分组管理的能力，点击查看
          <a>实例分组文档</a>
        </p>
      </div>
      <div class="box">
        <div class="table-top">
          <div style="flex:1;">
            <el-button
              type="primary"
              @click="newBuildByVal.newBuildState = true"
              >新建</el-button
            >
            <Dialog
              :newBuildShow="newBuildByVal"
              v-if="newBuildByVal.newBuildState"
              v-on:close="newBuildByVal.newBuildState = false"
            ></Dialog>
          </div>
          <div class="seek">
            <el-input
              v-model="searchInput"
              placeholder="请输入实例组名搜索"
              @input="SearchInput"
            ></el-input>
            <el-button
              icon="el-icon-search"
              style="margin-left:-1px;"
              @click="ListInit()"
            ></el-button>
          </div>
        </div>
        <div class="table">
          <el-table
            :data="tableData"
            style="width: 100%"
            height="450"
            v-loading="loadShow"
          >
            <el-table-column label="实例组名称">
              <template slot-scope="scope">
                <div class="case-name">
                  <a href="javascript:;" @click="DetailsTo(scope.row)">{{
                    scope.row.GroupName
                  }}</a>
                  <i
                    class="el-icon-edit ml5"
                    @click="showEditNameDlg(scope.row)"
                  ></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="分组类型">
              <template slot-scope="scope">
                {{ scope.row.Name }}
              </template>
            </el-table-column>
            <el-table-column label="实例数">
              <template slot-scope="scope">
                {{ scope.row.InstanceSum }}个
              </template>
            </el-table-column>
            <el-table-column label="绑定告警策略数">
              <template slot-scope="scope">
                <a href="javascript:;" @click="DetailsToTwo(scope.row)"
                  >{{ scope.row.PolicyGroups.length }}个</a
                >
              </template>
            </el-table-column>
            <el-table-column label="最后修改">
              <template slot-scope="scope">
                <p>{{ scope.row.LastEditUin }}</p>
                <p>{{ scope.row.UpdateTime | formatDate }}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <a style="padding-right:10px;" @click="Copy(scope.row)">复制</a>
                <a @click="Delete(scope.row)">删除</a>
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
    <!-- 编辑集群名称弹窗 -->
    <el-dialog
      title="修改实例组名称"
      :visible.sync="editNameDialogVisible"
      width="500px"
      custom-class="tke-dialog"
    >
      <div class="edit-dialog">
        <el-input
          size="small"
          placeholder="请输入实例组名称，20字以内"
          v-model="editSearchVal"
          @input="EditTips"
        ></el-input>
        <p v-if="tipsShow">实例组名称不能为空</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setColonyName">保存</el-button>
        <el-button @click="editNameDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 复制 -->
    <el-dialog
      title="确定复制所选实例组"
      :visible.sync="copyDialogVisible"
      width="500px"
      custom-class="tke-dialog"
    >
      <div>是否复制 {{ groupName }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="CopyList()">确定复制</el-button>
        <el-button @click="copyDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog
      title="确定删除所选实例组"
      :visible.sync="deleteDialogVisible"
      width="500px"
      custom-class="tke-dialog"
    >
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="DeleteList()">确定删除</el-button>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Header from "@/components/public/Head";
// import Transfer from "./components/transfer";
import Dialog from "./components/dialog";
import { ErrorTips } from "@/components/ErrorTips";
import {
  CM_GROUPING_LIST,
  CM_GROUPING_LIST_TYPE,
  CM_GROUPING_LIST_DELETE,
  CM_GROUPING_LIST_EDIT,
  CM_GROUPING_LIST_COPY
} from "@/constants";
export default {
  name: "group",
  data() {
    return {
      loadShow: true, // 加载是否显示
      dialogVisible: false, //dialog
      searchInput: "", //搜索框的值
      tableData: [],
      //分页
      total: 0, //总条数
      pageSize: 10, // 分页条数
      pageIndex: 0, // 当前页码
      deleteDialogVisible: false,
      instanceGroupId: "",
      copyDialogVisible: false,
      groupName: "",
      newBuildByVal: {
        // 新建
        newBuildState: false
      },
      editSearchVal: "",
      editGroupId: "",
      editNameDialogVisible: false,
      tipsShow: false
    };
  },
  components: {
    Header,
    // Transfer,
    Dialog
  },
  created() {},
  mounted() {
    this.ListInit();
  },
  methods: {
    // 列表
    async ListInit() {
      this.loadShow = true;
      let params = {
        Version: "2018-07-24",
        Module: "monitor",
        Limit: this.pageSize,
        Offset: this.pageIndex
      };
      if (this.searchInput != "") {
        params["GroupName"] = this.searchInput;
      }
      await this.axios.post(CM_GROUPING_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          console.log(res);
          var _tableData = res.Response.InstanceGroupList;
          this.total = res.Response.Total;
          let param = {
            Version: "2018-07-24",
            Module: "monitor"
          };
          this.axios.post(CM_GROUPING_LIST_TYPE, param).then(res => {
            if (res.Response.Error === undefined) {
              let Conditions = res.Response.Conditions;
              for (let i in _tableData) {
                for (let j in Conditions) {
                  if (_tableData[i].ViewName === Conditions[j].PolicyViewName) {
                    _tableData[i]["Name"] = Conditions[j].Name;
                  }
                }
              }
              this.tableData = _tableData;
              console.log("tableData", this.tableData);
              this.loadShow = false;
            } else {
              this.loadShow = false;
              let ErrTips = {
                "AuthFailure.UnauthorizedOperation":
                  "请求未授权。请参考 CAM 文档对鉴权的说明。",
                DryRunOperation:
                  "DryRun 操作，代表请求将会是成功的，只是多传了 DryRun 参数。",
                FailedOperation: "操作失败。",
                "FailedOperation.AlertFilterRuleDeleteFailed":
                  "删除过滤条件失败。",
                "FailedOperation.AlertPolicyCreateFailed": "创建告警策略失败。",
                "FailedOperation.AlertPolicyDeleteFailed": "告警策略删除失败。",
                "FailedOperation.AlertPolicyDescribeFailed":
                  "告警策略查询失败。",
                "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失败。",
                "FailedOperation.AlertTriggerRuleDeleteFailed":
                  "删除触发条件失败。",
                "FailedOperation.DbQueryFailed": "数据库查询失败。",
                "FailedOperation.DbRecordCreateFailed": "创建数据库记录失败。",
                "FailedOperation.DbRecordDeleteFailed": "数据库记录删除失败。",
                "FailedOperation.DbRecordUpdateFailed": "数据库记录更新失败。",
                "FailedOperation.DbTransactionBeginFailed":
                  "数据库事务开始失败。",
                "FailedOperation.DbTransactionCommitFailed":
                  "数据库事务提交失败。",
                "FailedOperation.DimQueryRequestFailed":
                  "请求维度查询服务失败。",
                "FailedOperation.DruidQueryFailed": "查询分析数据失败。",
                "FailedOperation.DuplicateName": "名字重复。",
                "FailedOperation.ServiceNotEnabled":
                  "服务未启用，开通服务后方可使用。",
                InternalError: "内部错误。",
                "InternalError.ExeTimeout": "	执行超时。",
                InvalidParameter: "	参数错误。",
                "InvalidParameter.InvalidParameter": "参数错误。",
                "InvalidParameter.InvalidParameterParam": "参数错误。",
                InvalidParameterValue: "无效的参数值。",
                LimitExceeded: "超过配额限制。",
                "LimitExceeded.MetricQuotaExceeded":
                  "指标数量达到配额限制，禁止含有未注册指标的请求。",
                MissingParameter: "缺少参数错误。",
                ResourceInUse: "资源被占用。",
                ResourceInsufficient: "资源不足。",
                ResourceNotFound: "资源不存在。",
                ResourceUnavailable: "资源不可用。",
                ResourcesSoldOut: "资源售罄。",
                UnauthorizedOperation: "未授权操作。",
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
        } else {
          this.loadShow = false;
          this.deleteLoadShow = false;
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation":
              "请求未授权。请参考 CAM 文档对鉴权的说明。",
            DryRunOperation:
              "DryRun 操作，代表请求将会是成功的，只是多传了 DryRun 参数。",
            FailedOperation: "操作失败。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "删除过滤条件失败。",
            "FailedOperation.AlertPolicyCreateFailed": "创建告警策略失败。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略删除失败。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查询失败。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失败。",
            "FailedOperation.AlertTriggerRuleDeleteFailed":
              "删除触发条件失败。",
            "FailedOperation.DbQueryFailed": "数据库查询失败。",
            "FailedOperation.DbRecordCreateFailed": "创建数据库记录失败。",
            "FailedOperation.DbRecordDeleteFailed": "数据库记录删除失败。",
            "FailedOperation.DbRecordUpdateFailed": "数据库记录更新失败。",
            "FailedOperation.DbTransactionBeginFailed": "数据库事务开始失败。",
            "FailedOperation.DbTransactionCommitFailed": "数据库事务提交失败。",
            "FailedOperation.DimQueryRequestFailed": "请求维度查询服务失败。",
            "FailedOperation.DruidQueryFailed": "查询分析数据失败。",
            "FailedOperation.DuplicateName": "名字重复。",
            "FailedOperation.ServiceNotEnabled":
              "服务未启用，开通服务后方可使用。",
            InternalError: "内部错误。",
            "InternalError.ExeTimeout": "执行超时。",
            InvalidParameter: "参数错误。",
            "InvalidParameter.InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameterParam": "参数错误。",
            InvalidParameterValue: "无效的参数值。",
            LimitExceeded: "超过配额限制。",
            "LimitExceeded.MetricQuotaExceeded":
              "指标数量达到配额限制，禁止含有未注册指标的请求。",
            MissingParameter: "缺少参数错误。",
            ResourceInUse: "资源被占用。",
            ResourceInsufficient: "资源不足。",
            ResourceNotFound: "资源不存在。",
            ResourceUnavailable: "资源不可用。",
            ResourcesSoldOut: "资源售罄。",
            UnauthorizedOperation: "未授权操作。",
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
    SearchInput() {
      if (this.searchInput == "") {
        this.ListInit();
      }
    },
    // 详情跳转
    DetailsTo(row) {
      this.$router.push({
        name: "CasegroupingDetails",
        query: {
          groupName: row.GroupName,
          instanceGroupId: row.InstanceGroupId,
          type: "1",
          viewName: row.ViewName
        }
      });
    },
    // 详情跳转
    DetailsToTwo(row) {
      console.log(row);
      this.$router.push({
        name: "CasegroupingDetails",
        query: {
          groupName: row.GroupName,
          instanceGroupId: row.InstanceGroupId,
          type: "2",
          viewName: row.ViewName
        }
      });
    },
    // 编辑名称
    showEditNameDlg(row) {
      console.log(row);
      this.editSearchVal = row.GroupName;
      this.editNameDialogVisible = true;
      this.editGroupId = row.InstanceGroupId;
    },
    EditTips() {
      if (this.editSearchVal == "") {
        this.tipsShow = true;
      } else {
        this.tipsShow = false;
      }
    },
    // 修改集群名称
    setColonyName() {
      const param = {
        Version: "2018-07-24",
        Module: "monitor",
        GroupId: this.editGroupId,
        GroupType: 2,
        Key: "groupName",
        Value: this.editSearchVal
      };
      this.axios.post(CM_GROUPING_LIST_EDIT, param).then(res => {
        if (res.Response.Error === undefined) {
          this.editNameDialogVisible = false;
          this.ListInit();
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
    // 复制
    Copy(row) {
      this.copyDialogVisible = true;
      this.groupName = row.GroupName;
      this.instanceGroupId = row.InstanceGroupId;
    },
    CopyList() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        InstanceGroupId: this.instanceGroupId
      };
      this.axios.post(CM_GROUPING_LIST_COPY, param).then(res => {
        if (res.Response.Error === undefined) {
          this.copyDialogVisible = false;
          this.ListInit();
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
    // 删除
    Delete(row) {
      this.deleteDialogVisible = true;
      this.instanceGroupId = row.InstanceGroupId;
    },
    DeleteList() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        InstanceGroupId: this.instanceGroupId,
        IsDelRelatedPolicy: 1
      };
      this.axios.post(CM_GROUPING_LIST_DELETE, param).then(res => {
        if (res.Response.Error === undefined) {
          this.deleteDialogVisible = false;
        } else {
          let ErrTips = {
            DryRunOperation:
              "DryRun 操作，代表请求将会是成功的，只是多传了 DryRun 参数。",
            FailedOperation: "	操作失败。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "删除过滤条件失败。",
            "FailedOperation.AlertPolicyCreateFailed": "创建告警策略失败。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略删除失败。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查询失败。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失败。",
            "FailedOperation.AlertTriggerRuleDeleteFailed":
              "删除触发条件失败。",
            "FailedOperation.DbQueryFailed": "数据库查询失败。",
            "FailedOperation.DbRecordCreateFailed": "创建数据库记录失败。",
            "FailedOperation.DbRecordDeleteFailed": "数据库记录删除失败。",
            "FailedOperation.DbRecordUpdateFailed": "数据库记录更新失败。",
            "FailedOperation.DbTransactionBeginFailed": "数据库事务开始失败。",
            "FailedOperation.DbTransactionCommitFailed": "数据库事务提交失败。",
            "FailedOperation.DimQueryRequestFailed": "请求维度查询服务失败。",
            "FailedOperation.DruidQueryFailed": "查询分析数据失败。",
            "FailedOperation.DuplicateName": "名字重复。",
            "FailedOperation.ServiceNotEnabled":
              "服务未启用，开通服务后方可使用。",
            InternalError: "内部错误。",
            "InternalError.ExeTimeout": "执行超时。",
            InvalidParameter: "参数错误。",
            "InvalidParameter.InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameterParam": "参数错误。",
            InvalidParameterValue: "无效的参数值。",
            LimitExceeded: "超过配额限制。",
            "LimitExceeded.MetricQuotaExceeded":
              "指标数量达到配额限制，禁止含有未注册指标的请求。",
            MissingParameter: "缺少参数错误。",
            ResourceInUse: "资源被占用。",
            ResourceInsufficient: "资源不足。",
            ResourceNotFound: "资源不存在。",
            ResourceUnavailable: "资源不可用。",
            ResourcesSoldOut: "资源售罄。",
            UnauthorizedOperation: "未授权操作。",
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
  },
  filters: {
    formatDate(value) {
      let date = new Date(value * 1000);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    }
  }
};
</script>

<style lang="scss" scoped>
.group-wrap >>> .el-button,
.group-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
// .group-wrap >>> .el-dialog {
//   width: 1000px;
//   height: 700px;
//   margin-top: -350px;
//   top: 50%;
// }
.group-wrap {
  .Right-style {
    display: flex;
    justify-content: flex-end;

    .esach-inputL {
      width: 300px;
      margin-right: 20px;
    }
  }
  .pagstyle {
    padding: 20px;

    .pagtotal {
      font-size: 13px;
      font-weight: 400;
      color: #565656;
      line-height: 32px;
    }
  }
  a {
    color: #006eff;
    cursor: pointer;
  }
  .cursor {
    cursor: pointer;
  }
  .group-main {
    padding: 20px;
    box-sizing: border-box;

    .table {
      background: white;
      a {
        &:hover {
          text-decoration: underline;
        }
      }
      .case-name {
        i {
          margin-left: 4px;
          cursor: pointer;
        }
      }
    }

    .table-top {
      display: flex;
      margin-bottom: 20px;
      ::v-deep .el-button {
        border-radius: 0px;
        height: 30px;
        padding: 0 20px;
      }
      ::v-deep .el-input__inner {
        border-radius: 0px;
        height: 30px;
      }
      .seek {
        width: 240px;
        display: flex;
      }
    }

    .explain {
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      background: #e5f0ff;

      p {
        font-size: 11px;
        line-height: 18px;
      }
    }
  }
}
.tke-page {
  padding: 20px;
  display: flex;
  flex-direction: row-reverse;
}
.tke-dialog {
  ::v-deep .el-dialog__footer {
    text-align: center;
  }
  .edit-dialog {
    ::v-deep .el-input__inner {
      border-radius: 0px;
      width: 200px;
      height: 30px;
      padding: 0 10px;
    }
    p {
      color: #b43537;
      border: 1px solid #f6b5b5;
      background-color: #fcecec;
      width: 258px;
      box-sizing: border-box;
      padding: 10px 20px;
      margin-top: 10px;
    }
    ::v-deep .el-dialog__footer {
      text-align: center;
    }
  }
}
</style>
