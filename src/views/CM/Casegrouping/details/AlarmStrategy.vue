<template>
  <div class="relation-example">
    <div class="tab">
      <div class="tab-box">
        <div class="btn">
          <el-row>
            <el-button type="primary" @click="NewRelation()">{{
              $t("CVM.Casegrouping.xj")
            }}</el-button>
          </el-row>
          <div class="search">
            <el-input
              :placeholder="$t('CVM.Casegrouping.placeholder4')"
              class="input-with-select"
              v-model="inputVal"
              @input="Input()"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="ListInit()"
              ></el-button>
            </el-input>
          </div>
        </div>
        <div class="table-box">
          <el-table
            ref="multipleTable"
            :data="listData"
            tooltip-effect="dark"
            style="width: 100%"
            v-loading="loadShow"
          >
            <el-table-column :label="$t('CVM.Casegrouping.clmc')">
              <template slot-scope="scope">
                <a href="javascript:;" @click="defaultClick(scope.row)">
                  {{ scope.row.GroupName }}</a
                >
              </template>
            </el-table-column>
            <el-table-column :label="$t('CVM.Casegrouping.cftj')">
              <template slot-scope="scope">
                <el-popover placement="left-start" width="400" trigger="hover">
                  <div class="popover-box">
                    <p class="text-color">{{ $t("CVM.Casegrouping.zbgj") }}</p>
                    <div
                      v-for="i in scope.row.Conditions"
                      class="trigger-condition"
                    >
                      <p>
                        {{ i.MetricShowName }}
                        {{ i.CalcType | CalcType }} {{ i.CalcValue
                        }}{{ i.Unit }}，持續{{ i.ContinueTime / 60 }}分鐘，按{{
                          i.AlarmNotifyPeriod | AlarmNotifyPeriod
                        }}{{
                          i.AlarmNotifyPeriod > 0
                            ? $t("CVM.Casegrouping.cfgj")
                            : $t("CVM.Casegrouping.bcfgj")
                        }}
                      </p>
                    </div>
                    <p class="text-color">{{ $t("CVM.Casegrouping.sjgj") }}</p>
                    <div
                      v-for="j in scope.row.EventConditions"
                      class="trigger-condition"
                    >
                      <p>
                        {{ j.EventShowName }}，{{
                          j.AlarmNotifyPeriod > 0
                            ? $t("CVM.Casegrouping.cfgj")
                            : $t("CVM.Casegrouping.bcfgj")
                        }}
                      </p>
                    </div>
                  </div>
                  <div slot="reference">
                    <div
                      v-for="(item, index) in scope.row.Conditions"
                      :key="index"
                      class="trigger-condition"
                    >
                      <p>
                        {{ item.MetricShowName }}
                        {{ item.CalcType | CalcType }} {{ item.CalcValue
                        }}{{ item.Unit }}，持续{{
                          item.ContinueTime / 60
                        }}分鍾，按{{ item.AlarmNotifyPeriod | AlarmNotifyPeriod
                        }}{{
                          item.AlarmNotifyPeriod > 0
                            ? $t("CVM.Casegrouping.cfgj")
                            : $t("CVM.Casegrouping.bcfgj")
                        }}
                      </p>
                    </div>
                    <div
                      v-for="(items, indexs) in scope.row.EventConditions"
                      class="trigger-condition"
                    >
                      <p>
                        {{ items.EventShowName }}，{{
                          items.AlarmNotifyPeriod > 0
                            ? $t("CVM.Casegrouping.cfgj")
                            : $t("CVM.Casegrouping.bcfgj")
                        }}
                      </p>
                    </div>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column :label="$t('CVM.Casegrouping.gjqd')">
              <template slot-scope="scope">
                <div v-for="(i, x) in scope.row.ReceiverInfos" :key="x">
                  <p>接收組：{{ i.ReceiverGroupList.length }}个</p>
                  <p>
                    有效期：{{ i.StartTime | EndTime }} -
                    {{ i.EndTime | EndTime }}
                  </p>
                  <p>
                    管道：<span v-for="(j, k) in i.NotifyWay" :key="k"
                      >{{ j | NotifyWay
                      }}<i v-if="i.NotifyWay.length - 1 > k">、</i></span
                    >
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('CVM.Casegrouping.gjqt')">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.IsOpen"
                  active-color="#006eff"
                  inactive-color="#888"
                  @change="AlarmStart(scope.row, scope.$index)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <a href="javascript:;" @click="UnDelete(scope.row)">{{ $t("CVM.Casegrouping.jcbd") }}</a>
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
    <!-- 告警启停 -->
    <el-dialog
      :label="$t('CVM.Casegrouping.gjczqr')"
      :visible.sync="startStop"
      width="500px"
      class="tke-dialog"
      :before-close="CelStart"
    >
      <div>
        <p>{{ $t("CVM.Casegrouping.tips3") }}【{{ GroupName }}】</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="SureStart()">{{
          $t("CVM.Casegrouping.qd")
        }}</el-button>
        <el-button @click="CelStart">取消</el-button>
      </div>
    </el-dialog>
    <!-- 解除绑定 -->
    <el-dialog
      :label="$t('CVM.Casegrouping.title3')"
      :visible.sync="UnBinding"
      width="500px"
      custom-class="tke-dialog"
    >
      <div>
        <p>{{ $t("CVM.Casegrouping.tips4") }}</p>
        <p>
          <el-checkbox
            v-model="checked"
            style="margin-right:10px;"
          ></el-checkbox
          >{{ $t("CVM.Casegrouping.tips5") }}
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="SureUnBind()">{{ $t("CVM.Casegrouping.qdjb") }}</el-button>
        <el-button @click="UnBinding = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import moment from "moment";
import {
  CM_GROUPING_ALARM_STRATEGY,
  CM_GROUPING_UNBINDING,
  CM_GROUPING_ALARM_START
} from "@/constants";
export default {
  data() {
    return {
      listData: [],
      //分页
      total: 0, //总条数
      pageSize: 10, // 分页条数
      pageIndex: 0, // 当前页码
      loadShow: true,
      checked: false,
      UnBinding: false,
      GroupId: "",
      GroupName: "",
      startStop: false,
      IsOpen: false,
      inputVal: ""
    };
  },
  components: {},
  props: {
    Rules: {
      type: Object,
      default: () => []
    }
  },
  created() {},
  mounted() {
    this.ListInit();
  },
  methods: {
    // 搜索
    Input() {
      if (this.inputVal === "") {
        this.ListInit();
      }
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
      if (this.inputVal != "") {
        param["Like"] = this.inputVal;
      }
      await this.axios.post(CM_GROUPING_ALARM_STRATEGY, param).then(res => {
        if (res.Response.Error === undefined) {
          // console.log(res);
          this.listData = res.Response.GroupList;
          this.total = res.Response.Total;
          this.loadShow = false;
        } else {
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
    },
    // 新建
    NewRelation() {
      this.$router.push({
        name: "strategyCreate",
        query: {
          instanceGroupId: this.Rules.instanceGroupId
        }
      });
    },
    defaultClick(row) {
      console.log(row);
      this.$router.push({
        name: "strategyCreateDetail",
        query: {
          groupId: row.GroupId,
          viewName: row.ViewName
        }
      });
    },
    // 告警启停
    AlarmStart(row, index) {
      console.log(row);
      this.startStop = true;
      this.GroupId = row.GroupId;
      this.GroupName = row.GroupName;
      this.IsOpen = !row.IsOpen;
    },
    SureStart() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        GroupId: this.GroupId
      };
      if (this.IsOpen === false) {
        param["IsShielded"] = 0;
      } else {
        param["IsShielded"] = 1;
      }
      this.axios.post(CM_GROUPING_ALARM_START, param).then(res => {
        if (res.Response.Error === undefined) {
          this.startStop = false;
          this.ListInit();
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation":
              "請求未授權。請參考 CAM 文檔對鑒權的說明。",
            FailedOperation: "操作失敗。",
            InternalError: "內部錯誤。",
            InvalidParameter: "參數錯誤。",
            "InvalidParameter.InvalidParameter": "參數錯誤。",
            "InvalidParameter.InvalidParameterParam": "參數錯誤。",
            InvalidParameterValue: "無效的參數值。",
            LimitExceeded: "超過配額限制。",
            MissingParameter: "缺少參數錯誤。"
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
    CelStart() {
      this.startStop = false;
      this.ListInit();
    },
    // 解除绑定
    UnDelete(row) {
      console.log(row);
      this.UnBinding = true;
      this.GroupId = row.GroupId;
    },
    SureUnBind() {
      let param = {
        Version: "2018-07-24",
        Module: "monitor",
        InstanceGroupId: this.Rules.instanceGroupId,
        PolicyGroupId: this.GroupId
      };
      if (this.checked === false) {
        param["IsDelRelatedPolicy"] = 0;
      } else {
        param["IsDelRelatedPolicy"] = 1;
      }
      this.axios.post(CM_GROUPING_UNBINDING, param).then(res => {
        if (res.Response.Error === undefined) {
          this.UnBinding = false;
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
    }
  },
  filters: {
    CalcType(value) {
      if (value == 1) {
        return ">";
      } else if (value == 2) {
        return ">=";
      } else if (value == 3) {
        return "<";
      } else if (value == 4) {
        return "<=";
      } else if (value == 5) {
        return "=";
      } else if (value == 6) {
        return "!=";
      } else if (value == 7) {
        return "日同比上漲";
      } else if (value == 8) {
        return "日同比下降";
      } else if (value == 9) {
        return "周同比上漲";
      } else if (value == 10) {
        return "周同比下降";
      } else if (value == 11) {
        return "週期環比上漲";
      } else if (value == 12) {
        return "週期環比下降";
      }
    },
    AlarmNotifyPeriod(val) {
      if ((val / 60 / 60) % 1 == 0) {
        if ((val / 60 / 60 / 24) % 1 == 0) {
          return val / 60 / 60 / 24 + "天";
        } else {
          return val / 60 / 60 + "小時";
        }
      } else if ((val / 60) % 1 == 0) {
        return val / 60 + "分鍾";
      }
    },
    EndTime(val) {
      return moment(val * 1000).format("HH:mm:ss");
    },
    NotifyWay(val) {
      if (val === "EMAIL") {
        return "郵件";
      } else if (val === "SMS") {
        return "簡訊";
      } else if (val === "WECHAT") {
        return "微信";
      } else if (val === "CALL") {
        return "電話";
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.relation-example {
  .tab {
    ::v-deep .el-tabs__nav-scroll {
      padding-left: 20px !important;
    }
    .tab-box {
      .btn {
        display: flex;
        justify-content: space-between;
        ::v-deep .el-button {
          padding-top: 0px;
          padding-bottom: 0px;
          border-radius: 0px;
          height: 30px;
          font-size: 12px;
        }
        ::v-deep .el-button--primary {
          border-color: #006eff;
          background: #006eff;
        }
        .search {
          ::v-deep .el-input__inner {
            border-radius: 0px;
            height: 30px;
          }
          ::v-deep .el-input-group__append {
            border-radius: 0px;
            height: 30px;
          }
        }
      }
      .table-box {
        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
        -webkit-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
        -webkit-box-sizing: border-box;
        border-bottom: 1px solid #ddd;
        background: #fff;
        margin-top: 10px;
        ::v-deep .el-table {
          padding: 20px;
        }
        .num {
          padding: 10px 10px 14px 10px;
          line-height: 27px;
          color: #888;
          margin: 0 20px;
        }
        a {
          color: #006eff;
          font-size: 12px;
          &:hover {
            text-decoration: underline;
          }
        }
        p {
          margin-top: -4px;
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
      .length {
        padding: 10px 10px 14px 10px;
        & > p {
          height: 30px;
          line-height: 30px;
          color: #888;
          font-size: 12px;
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
.popover-box {
  .text-color {
    font-size: 12px;
    color: #888;
    &:nth-of-type(2) {
      margin-top: 20px;
    }
  }
}
.trigger-condition {
  p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
}
</style>
