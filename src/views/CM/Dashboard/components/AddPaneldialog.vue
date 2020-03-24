<template>
  <div class="dialog">
    <el-dialog :title="$t('CVM.Dashboard.cjjkmb')" :visible.sync="show" @close="close" width="30%">
      <el-form :model="form" label-position="left" :rules="rules" ref="addPanelForm">
        <el-form-item :label="$t('CVM.Dashboard.mcheng')" label-width="80px" prop="name">
          <el-input v-model="form.name" autocomplete="off" style="width: 50%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save('addPanelForm')" :disabled="!canSubmit">{{$t('CVM.Dashboard.qd')}}</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  GET_DASHBOARD_LIST, CREATE_DASHBOARD
} from "@/constants";
import {
  ErrorTips
} from "@/components/ErrorTips"; //公共错误码
export default {
  data() {
    var validateRepeatName = (rule, value, callback) => {
      let inFlag = true;
      this.options.forEach(ele => {
        if (ele.label == value) {
          callback(new Error('名称重复了'));
          this.canSubmit = false; // 禁用提交
          inFlag = false; // 标记有错误
        }
      });
      if (inFlag) {
        this.canSubmit = true;
        callback();
      }
    };
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
      show: this.dialogVisible,
      // dialogFormVisible: false //监控面板的开关
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { validator: validateRepeatName, trigger: ['change', 'blur'] }
        ],
      },
      options: [], // 暂存的下拉选框
      canSubmit: true // 可以使用提交按钮
    };
  },
   props: {
    dialogVisible: {
      default: false,
      type: Boolean
    },
    // options: {
    //   default: [], type: Array
    // }
  },
  watch: {
    show: function (val) {
      this.$emit('update:dialogVisible', val)
    },
    dialogVisible: function (val) {
      this.show = val
    }
  },
  created() {

  },
  methods: {
    close() {
      this.$emit("cancel");
    },
    cancel() {
      this.$emit("cancel");
    },
    save(formName) { // 确定按钮
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("save");
          this.handlereateDashboardView();
        } else {
          return false;
        }
      });
    },
    //类型
    msgBtn(index) {
      this.liIndex = index;
    },
    //添加监控面板按钮
    async handlereateDashboardView() {
      let params =
      {
        Version: '2018-07-24',
        Module: 'monitor',
        DescName: this.form.name,
        Meta: '{"index": 18}', // 元数据，json串
      }
      // {
      //   "serviceType":"monitor","cmd":"CreateDashboard","regionId":1,
      //   "data":{"Version":"2018-07-24","Module":"monitor","DescName":"监控面板21","Meta":"{\"Index\":19}"},
      //   "action":"CreateDashboard"
      // }
      await this.axios.post(CREATE_DASHBOARD, params).then(res => {
        if (res.Response.Error === undefined) {
          // res.Response.DashboardID
          // res.Response.RequestId
          this.$parent.$parent.getDashboardList(); // 获取Dashboard列表数据
          this.$parent.$parent.DashboardID = res.Response.DashboardID.toString(); // 跳转到新的监控面板ID
          
          this.$parent.$parent.DashboardName = this.form.name
          this.form.name = "";
          // console.log(res.Response, this.$parent.$parent.panelValue, this.$parent.$parent, 'res.Response');
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
    },
    // 获取Dashboard 下拉选框数据
    async getDashboardList() {
      let params = {
        Version: "2018-07-24",
        Module: "monitor"
        // ProductType: '',
        // CustomID: ''
      };
      await this.axios
        .get(GET_DASHBOARD_LIST, {
          params: params
        })
        .then(res => {
          if (res.Response.Error === undefined) {
            let options = [];
            options = res.Response.DashboardList.map(ele => {
              return {
                value: ele.DashboardID,
                label: ele.DescName
              };
            });
            this.options = options;
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
                "FailedOperation.DbRecordUpdateFailed": "数据库记录更新失败。",
                "FailedOperation.DbTransactionBeginFailed": "数据库事务开始失败。",
                "FailedOperation.DbTransactionCommitFailed": "数据库事务提交失败。",
                "FailedOperation.DimQueryRequestFailed": "请求维度查询服务失败。",
                "FailedOperation.DivisionByZero": "被除数为0。",
                "FailedOperation.DruidQueryFailed": "查询分析数据失败。",
                "FailedOperation.DruidTableNotFound": "druid表不存在。",
                "FailedOperation.DuplicateName": "名字重复。",
                "FailedOperation.ServiceNotEnabled": "服务未启用，开通服务后方可使用。",
                InternalError: "内部错误。",
                "InternalError.ExeTimeout": "执行超时。",
                InvalidParameter: "参数错误。",
                "InvalidParameter.InvalidParameter": "参数错误。",
                "InvalidParameter.InvalidParameterParam": "参数错误。",
                InvalidParameterValue: "无效的参数值。",
                LimitExceeded: "超过配额限制。",
                "LimitExceeded.MetricQuotaExceeded": "指标数量达到配额限制，禁止含有未注册指标的请求。",
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
  }
};
</script>
<style lang="scss" scoped>
  .dialog >>> .el-form-item__label {
    text-align: left;
  }
</style>
