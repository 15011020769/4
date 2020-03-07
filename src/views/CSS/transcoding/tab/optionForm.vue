<template>
  <div class="form-wrap">
    <h4>轉碼配置</h4>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="轉碼類型" prop="AiTransCode" v-if="!Object.keys(selectItem).length">
        <el-select placeholder="请选择" v-model="ruleForm.AiTransCode">
          <el-option label="普通轉碼" value="0" key="0" />
          <el-option label="極速高清" value="1" key="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="可用範本">
        <el-radio-group v-model="selectType" @change="radioChange">
          <el-radio v-for="item in tableData" :key="item.key" :label="item.value" />
          <el-radio v-show="ruleForm.AiTransCode !== '1'" key="voice" label="純音頻" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="範本名稱" prop="TemplateName">
        <el-input
          v-model="ruleForm.TemplateName"
          style="width:330px;"
          :disabled="Object.keys(selectItem).length > 0"
        />
        <span class="inputTip">仅支持字母、数字组合，请输入3-10个字符</span>
      </el-form-item>
      <el-form-item label="範本描述" prop="Description">
        <el-input type="textarea" v-model="ruleForm.Description" style="width:330px;" />
        <span class="textTip">仅支持中文、英文、数字、_、-</span>
      </el-form-item>
      <template v-if="selectType !== '純音頻'">
        <el-form-item label="影音碼率(kbps)" prop="VideoBitrate">
          <el-input type="textarea" v-model="ruleForm.VideoBitrate" style="width:330px;" />
          <span class="textTip">必填，编码范围 100K-8000K,1000K以内仅支持整百填写，1000Kbps以上仅支持整500填写</span>
        </el-form-item>
        <el-form-item label="影音高度(px)" prop="Height">
          <el-input type="textarea" v-model="ruleForm.Height" style="width:330px;" />
          <span class="textTip">视频高度范围为0-3000，要求为4的倍数，宽度按等比例缩放</span>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="$parent._cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { TEMPLATE_TYPE, TEMPLATE_TYPE_PARAMS } from "../constance";
import { ADD_TRANSCODE_TEMPLATE, UPDATE_TRANSCODE_TEMPLATE } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
import { CSSErrorTips } from '../../components/CSSErrorTips';

export default {
  name: "optionForm",

  props: {
    selectItem: {
      type: Object
    }
  },

  data() {
    let checkVideoBitrate = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error("請輸入影音碼率"));
      }

      if (value < 100 || value > 8000) {
        callback(
          new Error(
            "編碼範圍為100K-8000K，1000K以內僅支持整百填寫，1000Kbps以上僅支持整500填寫"
          )
        );
      }

      if (value >= 100 && value <= 1000) {
        if (value % 100 !== 0) {
          callback(
            new Error(
              "編碼範圍為100K-8000K，1000K以內僅支持整百填寫，1000Kbps以上僅支持整500填寫"
            )
          );
        }
      } else if (value > 1000 && value <= 8000) {
        if (value % 500 !== 0) {
          callback(
            new Error(
              "編碼範圍為100K-8000K，1000K以內僅支持整百填寫，1000Kbps以上僅支持整500填寫"
            )
          );
        }
      }

      callback();
    };

    let checkVideoHeight = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error("請輸入影音高度"));
      }

      if (value < 0 || value > 3000) {
        callback(
          new Error("視頻高度範圍為0-3000，要求為4的倍數，寬度按等比例縮放")
        );
      }

      if (value % 4 !== 0) {
        callback(
          new Error("視頻高度範圍為0-3000，要求為4的倍數，寬度按等比例縮放")
        );
      }
      callback();

    };

    return {
      form: {
        desc: "", //範本描述
        template: "", //可用範本
        name: "" //範本名称
      },

      ruleForm: {
        TemplateName: "",
        Description: "",
        AiTransCode: "0",
        Height: "",
        VideoBitrate: ""
      },

      rules: {
        TemplateName: [
          {
            required: true,
            message: "請輸入範本名稱，長度不能超過30個字符",
            trigger: "blur"
          },
          {
            min: 1,
            max: 30,
            message: "請輸入範本名稱，長度不能超過30個字符",
            trigger: "blur"
          }
        ],
        desc: [
          { required: false },
          { max: 100, message: "長度不能超過100個字符", trigger: "blur" }
        ],
        Height: [{ validator: checkVideoHeight, trigger: "blur" }],
        VideoBitrate: [{ validator: checkVideoBitrate, trigger: "blur" }]
      },

      tableData: JSON.parse(JSON.stringify(TEMPLATE_TYPE)),

      selectType: ""
    };
  },

  mounted() {
    this.initTableParams();
    // this.initInfo()
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 如果有selectItem则为修改

          const params = Object.assign(this.ruleForm, {
            Version: "2018-08-01"
          });

          if (this.selectType === "純音頻") {
            params.Height = 0;
            params.VideoBitrate = 100;
          }

          if (Object.keys(this.selectItem).length) {
            params.TemplateId = this.selectItem.TemplateId;
            delete params.AiTransCode;
            delete params.TemplateName;
            this.handleUpdate(params);
            return;
          }

          this.handleAdd(params);
        }
      });
    },

    handleAdd(params) {
      this.axios.post(ADD_TRANSCODE_TEMPLATE, params).then(data => {
        if (data.Response.Error == undefined) {
          this.$message({
            message: "添加成功",
            type: "success"
          });
          this.$parent.fetchRecordingList();
          this.$emit("update:formShow", false);
          return;
        }
        let ErrOr = Object.assign(ErrorTips, CSSErrorTips);
        this.$message.error(ErrOr[data.Response.Error.Code]);
      });
    },

    handleUpdate(params) {
      this.axios.post(UPDATE_TRANSCODE_TEMPLATE, params).then(data => {
        if (data.Response.Error == undefined) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.$parent.fetchRecordingList();
          this.$emit("update:formShow", false);
          return;
        }
        let ErrOr = Object.assign(ErrorTips, CSSErrorTips);
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
      const currentItem = TEMPLATE_TYPE.find(item => item.value === rows);
      this.ruleForm.Height = currentItem.Height;
      this.ruleForm.VideoBitrate = currentItem.VideoBitrate;
      this.selectType = rows;
    },

    initTableParams() {
      if (Object.keys(this.selectItem).length) {
        const currentParams = {};
        Object.keys(this.ruleForm).forEach(key => {
          this.ruleForm[key] = JSON.parse(JSON.stringify(this.selectItem[key]));
          this.ruleForm.AiTransCode = this.ruleForm.AiTransCode.toString();
        });
      }
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
  .inputTip {
    position: absolute;
    top: 33px;
    left: 0;
    font-size: 12px;
    color: #888;
    vertical-align: middle;
  }
  .textTip {
    position: absolute;
    top: 43px;
    left: 0;
    font-size: 12px;
    color: #888;
    vertical-align: middle;
  }
  .el-form-item {
    margin-bottom: 38px;
  }
}
</style>
