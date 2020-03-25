<template>
  <div class="dialog">
    <el-dialog :title="$t('CVM.Dashboard.cjjkmb')" :visible.sync="show" @close="close" width="30%">
      <el-form :model="form" label-position="left" :rules="rules" ref="addPanelForm">
        <el-form-item :label="$t('CVM.Dashboard.mcheng')" label-width="80px" prop="name">
          <el-input v-model="form.name" autocomplete="off" style="width: 50%" maxlength="64"></el-input>
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
  }
};
</script>
<style lang="scss" scoped>
  .dialog >>> .el-form-item__label {
    text-align: left;
  }
</style>
