<template>
  <div class="form-wrap">
    <h4>錄製配置</h4>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="可用範本" prop="template">
        <el-radio-group v-model="ruleForm.template" @change="radioChange">
          <el-radio label="FLV" />
          <el-radio label="MP4" />
          <el-radio label="HLS" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="範本名稱" prop="TemplateName">
        <el-input v-model="ruleForm.TemplateName" style="width:330px;" />
      </el-form-item>
      <el-form-item label="範本描述" prop="Description">
        <el-input type="textarea" v-model="ruleForm.Description" style="width:330px;" />
      </el-form-item>
      <el-form-item label="錄製文件類型" prop="TemplateType">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="文件類型" width="120">
            <template slot-scope="scope">{{ scope.row.TemplateName }}</template>
          </el-table-column>
          <el-table-column label="單個錄製文件時長(分鐘)">
            <template slot-scope="scope">
              <el-input
                :placeholder="scope.row.TemplateName === 'HLS' ? '無時長限制' : '5-120分钟'"
                v-model="scope.row.TemplateName === 'HLS' ? undefined : tableParams[scope.row.paramName].RecordInterval"
                :disabled="scope.row.TemplateName === 'HLS'"
              />
            </template>
          </el-table-column>
          <el-table-column label="文件保存時長(天)" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input
                v-model="tableParams[scope.row.paramName].StorageTime"
                placeholder="0~1080天，0为永久保存"
              />
            </template>
          </el-table-column>
          <el-table-column label="續錄超時時長(秒)" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input
                v-if="scope.row.TemplateName==='HLS'"
                placeholder="1-300s，0為不續錄"
                v-model="tableParams.HlsSpecialParam.FlowContinueDuration"
              />
              <el-input v-else disabled placeholder="不支持續錄" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="$parent._cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { TEMPLATE_TYPE, TEMPLATE_TYPE_PARAMS } from "../constance";
import { ADD_RECORDING_CONFIG, UPDATE_RECORDING_CONFIG } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
let ErrTips = {
  InternalError: "內部錯誤",
  InvalidParameter: "參數錯誤",
  "InvalidParameterValue.InstanceNotExist": "實例不存在",
  "InvalidParameterValue.RepetitionValue": "已存在相同參數",
  "InvalidParameterValue.SubnetIdInvalid": "無效的子網id",
  "InvalidParameterValue.SubnetNotBelongToZone": "子網不屬於zone",
  "InvalidParameterValue.VpcIdInvalid": "無效的 Vpc Id",
  "InvalidParameterValue.WrongAction": "Action參數取值錯誤",
  "InvalidParameterValue.ZoneNotSupport": "zone不支持",
  ResourceUnavailable: "資源不可用",
  UnauthorizedOperation: "未授權操作",
  "UnsupportedOperation.BatchDelInstanceLimit": "批量刪除實例限制",
  "UnsupportedOperation.OssReject": "Oss拒絕該操作"
};

export default {
  name: "optionForm",

  props: {
    selectItem: {
      type: Object
    }
  },

  data() {
    return {
      form: {
        desc: "", //範本描述
        template: "", //可用範本
        name: "" //範本名称
      },

      ruleForm: {
        TemplateName: "",
        Description: "",
        TemplateType: " " // 此处为“ ”是为了让表单校验通过
      },

      rules: {
        TemplateName: [
          { required: true, message: "請輸入範本名稱", trigger: "blur" },
          { min: 1, max: 30, message: "長度不能超過30個字符", trigger: "blur" }
        ],
        desc: [
          { required: false },
          { max: 100, message: "長度不能超過100個字符", trigger: "blur" }
        ],
        TemplateType: [{ required: true }]
      },

      tableData: JSON.parse(JSON.stringify(TEMPLATE_TYPE)),
      tableParams: JSON.parse(JSON.stringify(TEMPLATE_TYPE_PARAMS))
    };
  },

  mounted() {
    this.initTableParams();
    this.initInfo();
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const sortParams = {};
          const keyArr = Object.keys(this.tableParams);
          keyArr.forEach(key => {
            Object.keys(this.tableParams[key]).forEach(_key => {
              sortParams[`${key}.${_key}`] = this.tableParams[key][_key];
              if (this.tableParams[key].RecordInterval) {
                sortParams[`${key}.RecordInterval`] =
                  this.tableParams[key].RecordInterval * 60;
              }

              if (this.tableParams[key].StorageTime) {
                sortParams[`${key}.StorageTime`] =
                  this.tableParams[key].StorageTime * 3600 * 24;
              }
            });
          });

          const params = Object.assign(sortParams, {
            Version: "2018-08-01",
            TemplateName: this.ruleForm.TemplateName,
            Description: this.ruleForm.Description
          });

          // 如果有selectItem则为修改

          if (Object.keys(this.selectItem).length) {
            params.TemplateId = this.selectItem.TemplateId;
            delete params["HlsParam.RecordInterval"];
            this.handleUpdate(params);
            return;
          }

          this.handleAdd(params);
        }
      });
    },
    validateTableParameters(parameters) {
      // 验证table中各个参数的正确性

      if (
        parameters["HlsParam.Enable"] === 0 &&
        parameters["Mp4Param.Enable"] === 0 &&
        parameters["FlvParam.Enable"] === 0 &&
        parameters["AacParam.Enable"] === 0
      ) {
        this.$message.error("至少填寫選擇一種錄製文件類型");
        return false;
      }

      const maxStorageSeconds = 1080 * 24 * 3600; // 秒
      const maxHLSFlowContinueDuration = 300; // 秒

      // 如果启用了HLS
      if (parameters["HlsParam.Enable"] === 1) {
        if (parameters["HlsParam.StorageTime"] > maxStorageSeconds) {
          this.$message.error("HLS文件保存時長範圍0~1080天");
          return false;
        }
        if (
          parameters["HlsSpecialParam.FlowContinueDuration"] >
          maxHLSFlowContinueDuration ||
          parameters["HlsSpecialParam.FlowContinueDuration"] >= 0
        ) {
          this.$message.error("HLS續錄超時時長範圍0~300秒");
          return false;
        }
      }

      const maxRecordInterval = 120 * 60; // 分
      const minRecordInterval = 5 * 60; // 分

      // 如果启用了MP4
      if (parameters["Mp4Param.Enable"] === 1) {
        if (
          parameters["Mp4Param.RecordInterval"] < minRecordInterval ||
          parameters["Mp4Param.RecordInterval"] > maxRecordInterval
        ) {
          this.$message.error("MP4錄製文件時長範圍5~120分鐘");
          return false;
        }
        if (parameters["Mp4Param.StorageTime"] > maxStorageSeconds) {
          this.$message.error("MP4文件保存時長範圍0~1080天");
          return false;
        }
      }

      // 如果启用了FLV
      if (parameters["FlvParam.Enable"] === 1) {
        if (
          parameters["FlvParam.RecordInterval"] < minRecordInterval ||
          parameters["FlvParam.RecordInterval"] > maxRecordInterval
        ) {
          this.$message.error("FLV錄製文件時長範圍5~120分鐘");
          return false;
        }

        if (parameters["FlvParam.StorageTime"] > maxStorageSeconds) {
          this.$message.error("FLV文件保存時長範圍0~1080天");
          return false;
        }
      }

      // 如果启用了AAC
      if (parameters["AacParam.Enable"] === 1) {
        if (
          parameters["AacParam.RecordInterval"] < minRecordInterval ||
          parameters["AacParam.RecordInterval"] > maxRecordInterval
        ) {
          this.$message.error("ACC錄製文件時長範圍5~120分鐘");
          return false;
        }

        if (parameters["AacParam.StorageTime"] > maxStorageSeconds) {
          this.$message.error("ACC文件保存時長範圍0~1080天");
          return false;
        }
      }

      return true;
    },
    handleAdd(params) {
      if (!this.validateTableParameters(params)) {
        return;
      }

      this.axios.post(ADD_RECORDING_CONFIG, params).then(data => {
        if (data.Response.Error === undefined) {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.$parent.fetchRecordingList();
          this.$emit("update:formShow", false);
          return;
        }

        let ErrOr = Object.assign(ErrorTips, ErrTips);
        this.$message.error(ErrOr[data.Response.Error.Code]);
      });
    },

    handleUpdate(params) {
      if (!this.validateTableParameters(params)) {
        return;
      }

      this.axios.post(UPDATE_RECORDING_CONFIG, params).then(data => {
        if (data.Response.Error == undefined) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.$parent.fetchRecordingList();
          this.$emit("update:formShow", false);
          return;
        }
        let ErrOr = Object.assign(ErrorTips, ErrTips);
        this.$message.error(ErrOr[data.Response.Error.Code]);
      });
    },

    handleSelectionChange(e) {
      this.tableData.forEach(item => {
        this.tableParams[item.paramName].Enable = 0;
      });
      e.forEach(item => {
        this.tableParams[item.paramName].Enable = 1;
      });
    },

    radioChange(rows) {
      const index = this.tableData.findIndex(
        item => item.TemplateName === rows
      );
      this.$refs.multipleTable.clearSelection();
      if (rows) {
        this.$refs.multipleTable.toggleRowSelection(this.tableData[index]);
        return;
      }
    },

    initTableParams() {
      if (Object.keys(this.selectItem).length) {
        const currentParams = {};
        Object.keys(this.tableParams).forEach(key => {
          this.tableParams[key] = JSON.parse(
            JSON.stringify(this.selectItem[key])
          );

          if (this.tableParams[key].RecordInterval) {
            this.tableParams[key].RecordInterval =
              this.tableParams[key].RecordInterval / 60;
          }

          if (this.tableParams[key].StorageTime) {
            this.tableParams[key].StorageTime =
              this.tableParams[key].StorageTime / 60 / 24;
          }
        });
      }
    },

    initInfo() {
      this.ruleForm.Description = this.selectItem.Description;
      this.ruleForm.TemplateName = this.selectItem.TemplateName;

      const currentArr = [];
      Object.keys(this.tableParams).map(key => {
        if (this.tableParams[key].Enable === 1) {
          const currentItem = this.tableData.findIndex(
            item => item.paramName === key
          );
          currentArr.push(currentItem);
        }
      });
      currentArr.forEach(index => {
        this.$refs.multipleTable.toggleRowSelection(this.tableData[index]);
      });
    }
  }
};
</script>

<style scoped lang='scss'>
.form-wrap >>> .el-input__inner,
.form-wrap >>> .el-button {
  height: 30px;
  line-height: 30px;
  padding-top: 0;
  font-size: 12px !important;
  border-radius: 0;
}
.form-wrap >>> .el-textarea__inner {
  border-radius: 0;
  font-size: 12px !important;
}
.form-wrap >>> .el-radio__label,
.form-wrap >>> .el-checkbox__label {
  font-size: 12px !important;
}
.form-wrap >>> .el-form-item__label {
  text-align: left;
  font-size: 12px !important;
}
.form-wrap {
  h4 {
    font-size: 14px;
    margin-bottom: 15px;
  }
}
</style>
