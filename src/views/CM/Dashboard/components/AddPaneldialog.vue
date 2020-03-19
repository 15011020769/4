<template>
  <div class="dialog">
    <el-dialog :title="$t('CVM.Dashboard.cjjkmb')" :visible.sync="show" @close="close">
      <el-form :model="form">
        <el-form-item :label="$t('CVM.Dashboard.mcheng')" label-width="120px">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">{{$t('CVM.Dashboard.qd')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  CREATE_DASHBOARD
} from "@/constants";
import {
  ErrorTips
} from "@/components/ErrorTips"; //公共错误码
export default {
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      show: this.dialogVisible
      // dialogFormVisible: false //监控面板的开关
    };
  },
   props: {
    dialogVisible: {
      default: false,
      type: Boolean
    }
  },
  watch: {
    show: function (val) {
      this.$emit('update:dialogVisible', val)
    },
    dialogVisible: function (val) {
      this.show = val
    }
  },
  methods: {
    close() {
      this.$emit("cancel");
    },
    cancel() {
      this.$emit("cancel");
    },
    save() { // 确定按钮
      this.$emit("save");
      this.handlereateDashboardView();
    },
    //类型
    msgBtn(index) {
      this.liIndex = index;
    },
    //添加监控面板按钮
    async handlereateDashboardView() {
      let params = {
        Version: '2018-07-24',
        Module: 'monitor',
        DescName: this.form.name,
        Meta: '', // 元数据，json串
      }
      await this.axios.get(CREATE_DASHBOARD, {
        params: params
      }).then(res => {
        if (res.Response.Error === undefined) {
          // res.Response.DashboardID
          // res.Response.RequestId
          console.log(res.Response, 'res.Response');
        } else {
          let ErrTips = {
            "AuthFailure.UnauthorizedOperation": "请求未授权。请参考 CAM 文档对鉴权的说明。",
            "DryRunOperation": "DryRun 操作，代表请求将会是成功的，只是多传了 DryRun 参数。",
            "FailedOperation": "操作失败。",
            "FailedOperation.AlertFilterRuleDeleteFailed": "删除过滤条件失败。",
            "FailedOperation.AlertPolicyCreateFailed": "创建告警策略失败。",
            "FailedOperation.AlertPolicyDeleteFailed": "告警策略删除失败。",
            "FailedOperation.AlertPolicyDescribeFailed": "告警策略查询失败。",
            "FailedOperation.AlertPolicyModifyFailed": "告警策略修改失败。",
            "FailedOperation.AlertTriggerRuleDeleteFailed": "删除触发条件失败。",
            "FailedOperation.DbQueryFailed": "数据库查询失败。",
            "FailedOperation.DbRecordCreateFailed": "创建数据库记录失败。",
            "FailedOperation.DbRecordDeleteFailed": "数据库记录删除失败。",
            "FailedOperation.DbTransactionBeginFailed": "数据库事务开始失败。",
            "FailedOperation.DbTransactionCommitFailed": "数据库事务提交失败。",
            "FailedOperation.DimQueryRequestFailed": "请求维度查询服务失败。",
            "FailedOperation.DivisionByZero": "被除数为0。",
            "FailedOperation.DruidQueryFailed": "查询分析数据失败。",
            "FailedOperation.DruidTableNotFound": "druid表不存在。",
            "FailedOperation.DuplicateName": "名字重复。",
            "FailedOperation.ServiceNotEnabled": "服务未启用，开通服务后方可使用。",
            "InternalError":" 内部错误。",
            "InternalError.ExeTimeout": "执行超时。",
            "InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameter": "参数错误。",
            "InvalidParameter.InvalidParameterParam": "参数错误。",
            "InvalidParameterValue": "无效的参数值。",
            "LimitExceeded": "超过配额限制。",
            "LimitExceeded.MetricQuotaExceeded": "指标数量达到配额限制，禁止含有未注册指标的请求。",
            "MissingParameter": "缺少参数错误。",
            "ResourceInUse": "资源被占用。",
            "ResourceInsufficient": "资源不足。",
            "ResourceNotFound": "资源不存在。",
            "ResourceUnavailable": "资源不可用。",
            "ResourcesSoldOut": "资源售罄。",
            "UnauthorizedOperation": "未授权操作。",
            "UnknownParameter": "未知参数错误。",
            "UnsupportedOperation": "操作不支持。",
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      })
    }
  }
};
</script>
<style lang="sass" scoped>

</style>
