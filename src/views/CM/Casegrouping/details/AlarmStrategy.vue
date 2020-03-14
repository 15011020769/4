<template>
  <div class="relation-example">
    <div class="tab">
      <div class="tab-box">
        <div class="btn">
          <el-row>
            <el-button type="primary" @click="NewRelation()">新建</el-button>
          </el-row>
          <div class="search">
            <el-input
              placeholder="请输入策略名称搜索"
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
            <el-table-column label="策略名称">
              <template slot-scope="scope">
                <a href="javascript:;">{{ scope.row.GroupName }}</a>
              </template>
            </el-table-column>
            <el-table-column label="触发条件">
              <template slot-scope="scope">
                <el-popover placement="left-start" width="400" trigger="hover">
                  <div class="popover-box">
                    <p class="text-color">指标告警（任意）：</p>
                    <div
                      v-for="i in scope.row.Conditions"
                      class="trigger-condition"
                    >
                      <p>
                        {{ i.MetricShowName }}
                        {{ i.CalcType | CalcType }} {{ i.CalcValue
                        }}{{ i.Unit }}，持续{{ i.ContinueTime / 60 }}分钟，按{{
                          i.AlarmNotifyPeriod | AlarmNotifyPeriod
                        }}{{
                          i.AlarmNotifyPeriod > 0 ? "重复告警" : "不重复告警"
                        }}
                      </p>
                    </div>
                    <p class="text-color">事件告警：</p>
                    <div
                      v-for="j in scope.row.EventConditions"
                      class="trigger-condition"
                    >
                      <p>
                        {{ j.EventShowName }}，{{
                          j.AlarmNotifyPeriod > 0 ? "重复告警" : "不重复告警"
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
                        }}分钟，按{{ item.AlarmNotifyPeriod | AlarmNotifyPeriod
                        }}{{
                          item.AlarmNotifyPeriod > 0 ? "重复告警" : "不重复告警"
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
                            ? "重复告警"
                            : "不重复告警"
                        }}
                      </p>
                    </div>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="告警渠道">
              <template slot-scope="scope">
                <div v-for="(i, x) in scope.row.ReceiverInfos" :key="x">
                  <p>接收组：{{ i.ReceiverGroupList.length }}个</p>
                  <p>有效期：</p>
                  <p>
                    渠道：<span v-for="(j, k) in i.NotifyWay" :key="k"
                      >{{ j | NotifyWay
                      }}<i v-if="i.NotifyWay.length - 1 > k">、</i></span
                    >
                  </p>
                </div>
              </template> </el-table-column
            >…
            <el-table-column label="告警启停">
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
                <a href="javascript:;" @click="UnDelete(scope.row)">解除绑定</a>
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
      title="告警操作确认"
      :visible.sync="startStop"
      width="500px"
      custom-class="tke-dialog"
    >
      <div>
        <p>确定停用告警策略【{{ GroupName }}】</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="SureStart()">确定</el-button>
        <el-button @click="startStop = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 解除绑定 -->
    <el-dialog
      title="确定解绑告警策略"
      :visible.sync="UnBinding"
      width="500px"
      custom-class="tke-dialog"
    >
      <div>
        <p>解绑后，策略将不再对实例分组生效</p>
        <p>
          <el-checkbox
            v-model="checked"
            style="margin-right:10px;"
          ></el-checkbox
          >同时删除关联的告警策略
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="SureUnBind()">确定解绑</el-button>
        <el-button @click="UnBinding = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
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
              "请求未授权。请参考 CAM 文档对鉴权的说明。",
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
              "请求未授权。请参考 CAM 文档对鉴权的说明。",
            FailedOperation: "操作失败。",
            InternalError: "内部错误。",
            InvalidParameter: "参数错误。",
            "InvalidParameter.InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameterParam": "参数错误。",
            InvalidParameterValue: "无效的参数值。",
            LimitExceeded: "超过配额限制。",
            MissingParameter: "缺少参数错误。"
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
            FailedOperation: "操作失败。",
            InternalError: "内部错误。",
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
        return "日同比上涨";
      } else if (value == 8) {
        return "日同比下降";
      } else if (value == 9) {
        return "周同比上涨";
      } else if (value == 10) {
        return "周同比下降";
      } else if (value == 11) {
        return "周期环比上涨";
      } else if (value == 12) {
        return "周期环比下降";
      }
    },
    AlarmNotifyPeriod(val) {
      if ((val / 60 / 60) % 1 == 0) {
        if ((val / 60 / 60 / 24) % 1 == 0) {
          return val / 60 / 60 / 24 + "天";
        } else {
          return val / 60 / 60 + "小时";
        }
      } else if ((val / 60) % 1 == 0) {
        return val / 60 + "分钟";
      }
    },
    NotifyWay(val) {
      if (val === "EMAIL") {
        return "邮件";
      } else if (val === "SMS") {
        return "短信";
      } else if (val === "WECHAT") {
        return "微信";
      } else if (val === "CALL") {
        return "站内信";
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
