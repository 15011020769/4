<template>
  <div class="group-wrap">
    <Header :title="$t('CVM.Casegrouping.slfz')" />
    <div class="group-main">
      <div class="explain" style="margin-bottom:20px;">
        <p>
          {{ $t("CVM.Casegrouping.slfztgnl") }}
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
              :placeholder="$t('CVM.Casegrouping.placeholder1')"
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
            <el-table-column :label="$t('CVM.Casegrouping.slzmc')">
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
            <el-table-column :label="$t('CVM.Casegrouping.fzlx')">
              <template slot-scope="scope">
                {{ scope.row.Name }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('CVM.Casegrouping.sls')">
              <template slot-scope="scope">
                {{ scope.row.InstanceSum }}個
              </template>
            </el-table-column>
            <el-table-column :label="$t('CVM.Casegrouping.bdgjcls')">
              <template slot-scope="scope">
                <a href="javascript:;" @click="DetailsToTwo(scope.row)"
                  >{{ scope.row.PolicyGroups.length }}個</a
                >
              </template>
            </el-table-column>
            <el-table-column :label="$t('CVM.Casegrouping.zhxg')">
              <template slot-scope="scope">
                <p>{{ scope.row.LastEditUin }}</p>
                <p>{{ scope.row.UpdateTime | formatDate }}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <a style="padding-right:10px;" @click="Copy(scope.row)">{{
                  $t("CVM.Casegrouping.zhxg")
                }}</a>
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
      :title="$t('CVM.Casegrouping.xgslzmc')"
      :visible.sync="editNameDialogVisible"
      width="500px"
      custom-class="tke-dialog"
    >
      <div class="edit-dialog">
        <el-input
          size="small"
          :placeholder="$t('CVM.Casegrouping.placeholder2')"
          v-model="editSearchVal"
          @input="EditTips"
          maxlength="20"
        ></el-input>
        <p v-if="tipsShow">{{ $t("CVM.Casegrouping.tips2") }}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setColonyName">保存</el-button>
        <el-button @click="editNameDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 复制 -->
    <el-dialog
      :title="$t('CVM.Casegrouping.title1')"
      :visible.sync="copyDialogVisible"
      width="500px"
      custom-class="tke-dialog"
    >
      <div>{{ $t("CVM.Casegrouping.sffz") + groupName }}</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="CopyList()">{{
          $t("CVM.Casegrouping.qdfz")
        }}</el-button>
        <el-button @click="copyDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog
      :title="$t('CVM.Casegrouping.title2')"
      :visible.sync="deleteDialogVisible"
      width="500px"
      custom-class="tke-dialog"
    >
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="DeleteList()">{{
          $t("CVM.Casegrouping.qdsc")
        }}</el-button>
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
                  "請求未授權。請參考 CAM 文檔對鑒權的說明。",
                DryRunOperation:
                  "DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。",
                FailedOperation: "操作失敗。",
                "FailedOperation.AlertFilterRuleDeleteFailed":
                  "刪除過濾條件失敗。",
                "FailedOperation.AlertPolicyCreateFailed": "創建告警策略失敗。",
                "FailedOperation.AlertPolicyDeleteFailed": "告警策略刪除失敗。",
                "FailedOperation.AlertPolicyDescribeFailed":
                  "告警策略查詢失敗。",
                "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失敗。",
                "FailedOperation.AlertTriggerRuleDeleteFailed":
                  "刪除触发條件失敗。",
                "FailedOperation.DbQueryFailed": "數據庫查詢失敗。",
                "FailedOperation.DbRecordCreateFailed": "創建數據庫記錄失敗。",
                "FailedOperation.DbRecordDeleteFailed": "數據庫記錄删除失敗。",
                "FailedOperation.DbRecordUpdateFailed": "數據庫記錄更新失敗。",
                "FailedOperation.DbTransactionBeginFailed":
                  "數據庫事務開始失敗。",
                "FailedOperation.DbTransactionCommitFailed":
                  "數據庫事務提交失敗。",
                "FailedOperation.DimQueryRequestFailed":
                  "請求維度查詢服務失敗。",
                "FailedOperation.DivisionByZero": "被除數為0。",
                "FailedOperation.DruidQueryFailed": "查詢分析數據失敗。",
                "FailedOperation.DruidTableNotFound": "druid表不存在。",
                "FailedOperation.DuplicateName": "名字重複。",
                "FailedOperation.ServiceNotEnabled":
                  "服務未啟用，開通服務後方可使用。",
                InternalError: "內部錯誤。",
                "InternalError.ExeTimeout": "執行超時。",
                InvalidParameter: "參數錯誤。",
                "InvalidParameter.InvalidParameter": "參數錯誤。",
                "InvalidParameter.InvalidParameterParam": "參數錯誤。",
                InvalidParameterValue: "無效的參數值。",
                "LimitExceeded.MetricQuotaExceeded":
                  "指標數量達到配額限制，禁止含有未註冊指標的請求。",
                MissingParameter: "缺少參數錯誤。",
                ResourceInUse: "資源被佔用。",
                ResourceInsufficient: "資源不足。",
                ResourceNotFound: "資源不存在。",
                ResourceUnavailable: "資源不可用。",
                ResourcesSoldOut: "資源售罄。",
                UnauthorizedOperation: "未授權操作。",
                UnknownParameter: "未知參數錯誤。",
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
              "請求未授權。請參考 CAM 文檔對鑒權的說明。",
            DryRunOperation:
              "DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。",
            FailedOperation: "操作失敗。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "刪除過濾條件失敗。",
            "FailedOperation.AlertPolicyCreateFailed": "創建告警策略失敗。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略刪除失敗。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查詢失敗。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失敗。",
            "FailedOperation.AlertTriggerRuleDeleteFailed":
              "刪除触发條件失敗。",
            "FailedOperation.DbQueryFailed": "數據庫查詢失敗。",
            "FailedOperation.DbRecordCreateFailed": "創建數據庫記錄失敗。",
            "FailedOperation.DbRecordDeleteFailed": "數據庫記錄删除失敗。",
            "FailedOperation.DbRecordUpdateFailed": "數據庫記錄更新失敗。",
            "FailedOperation.DbTransactionBeginFailed": "數據庫事務開始失敗。",
            "FailedOperation.DbTransactionCommitFailed": "數據庫事務提交失敗。",
            "FailedOperation.DimQueryRequestFailed": "請求維度查詢服務失敗。",
            "FailedOperation.DivisionByZero": "被除數為0。",
            "FailedOperation.DruidQueryFailed": "查詢分析數據失敗。",
            "FailedOperation.DruidTableNotFound": "druid表不存在。",
            "FailedOperation.DuplicateName": "名字重複。",
            "FailedOperation.ServiceNotEnabled":
              "服務未啟用，開通服務後方可使用。",
            InternalError: "內部錯誤。",
            "InternalError.ExeTimeout": "執行超時。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            "LimitExceeded.MetricQuotaExceeded":
              "指標數量達到配額限制，禁止含有未註冊指標的請求。",
            MissingParameter: "缺少參數錯誤。",
            ResourceInUse: "資源被佔用。",
            ResourceInsufficient: "資源不足。",
            ResourceNotFound: "資源不存在。",
            ResourceUnavailable: "資源不可用。",
            ResourcesSoldOut: "資源售罄。",
            UnauthorizedOperation: "未授權操作。",
            UnknownParameter: "未知參數錯誤。",
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
            FailedOperation: "操作失敗。",
            InternalError: "內部錯誤。",
            "InternalError.ExeTimeout": "執行超時。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            LimitExceeded: "超過配額限制。",
            MissingParameter: "缺少參數錯誤。",
            UnknownParameter: "未知參數錯誤。",
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
      console.log(row);
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
            FailedOperation: "操作失敗。",
            InternalError: "內部錯誤。",
            "InternalError.ExeTimeout": "執行超時。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            LimitExceeded: "超過配額限制。",
            MissingParameter: "缺少參數錯誤。",
            UnknownParameter: "未知參數錯誤。",
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
          this.ListInit();
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation":
              "請求未授權。請參考 CAM 文檔對鑒權的說明。",
            DryRunOperation:
              "DryRun 操作，代表請求將會是成功的，只是多傳了 DryRun 參數。",
            FailedOperation: "操作失敗。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "刪除過濾條件失敗。",
            "FailedOperation.AlertPolicyCreateFailed": "創建告警策略失敗。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略刪除失敗。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查詢失敗。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失敗。",
            "FailedOperation.AlertTriggerRuleDeleteFailed":
              "刪除触发條件失敗。",
            "FailedOperation.DbQueryFailed": "數據庫查詢失敗。",
            "FailedOperation.DbRecordCreateFailed": "創建數據庫記錄失敗。",
            "FailedOperation.DbRecordDeleteFailed": "數據庫記錄删除失敗。",
            "FailedOperation.DbRecordUpdateFailed": "數據庫記錄更新失敗。",
            "FailedOperation.DbTransactionBeginFailed": "數據庫事務開始失敗。",
            "FailedOperation.DbTransactionCommitFailed": "數據庫事務提交失敗。",
            "FailedOperation.DimQueryRequestFailed": "請求維度查詢服務失敗。",
            "FailedOperation.DivisionByZero": "被除數為0。",
            "FailedOperation.DruidQueryFailed": "查詢分析數據失敗。",
            "FailedOperation.DruidTableNotFound": "druid表不存在。",
            "FailedOperation.DuplicateName": "名字重複。",
            "FailedOperation.ServiceNotEnabled":
              "服務未啟用，開通服務後方可使用。",
            InternalError: "內部錯誤。",
            "InternalError.ExeTimeout": "執行超時。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            "LimitExceeded.MetricQuotaExceeded":
              "指標數量達到配額限制，禁止含有未註冊指標的請求。",
            MissingParameter: "缺少參數錯誤。",
            ResourceInUse: "資源被佔用。",
            ResourceInsufficient: "資源不足。",
            ResourceNotFound: "資源不存在。",
            ResourceUnavailable: "資源不可用。",
            ResourcesSoldOut: "資源售罄。",
            UnauthorizedOperation: "未授權操作。",
            UnknownParameter: "未知參數錯誤。",
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
