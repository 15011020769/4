<template>
  <div class="form-wrap">
    <h4>轉碼配置</h4>
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="轉碼類型"
        prop="AiTransCode"
        v-if="!Object.keys(selectItem).length"
      >
        <el-select placeholder="请选择" v-model="ruleForm.AiTransCode">
          <el-option label="普通轉碼" value="0" key="0" />
          <el-option label="極速高清" value="1" key="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="可用範本">
        <el-radio-group v-model="selectType" @change="radioChange">
          <el-radio
            v-for="item in tableData"
            :key="item.key"
            :label="item.value"
          />
          <el-radio
            v-show="ruleForm.AiTransCode !== '1'"
            key="voice"
            label="純音頻"
          />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="範本名稱" prop="TemplateName" :show-message="false">
        <el-input
          v-model="ruleForm.TemplateName"
          style="width:330px;"
          :disabled="Object.keys(selectItem).length > 0"
        />
        <br />
        <span>僅支持字母、數字組合，請輸入3-10字符</span>
      </el-form-item>
      <el-form-item label="範本描述" prop="Description">
        <el-input
          type="textarea"
          v-model="ruleForm.Description"
          style="width:330px;"
        /><br />
        <span>僅支持中文、英文、數字、_、-</span>
      </el-form-item>
      <template v-if="selectType !== '純音頻'">
        <el-form-item
          label="影音碼率(kbps)"
          prop="VideoBitrate"
          :show-message="false"
        >
          <el-input
            type="textarea"
            v-model="ruleForm.VideoBitrate"
            style="width:330px;"
          /><br />
          <span
            >必填，編碼範圍
            100K-8000K，1000K以內僅支持整百填寫，1000Kbps以上僅支持整500填寫</span
          >
        </el-form-item>
        <el-form-item label="影音高度(px)" prop="Height" :show-message="false">
          <el-input
            type="textarea"
            v-model="ruleForm.Height"
            style="width:330px;"
          /><br />
          <span>視頻高度範圍為0-3000，要求為4的倍數，寬度按等比例縮放</span>
        </el-form-item>

        <el-form-item
          label="碼率壓縮比"
          prop="AdaptBitratePercent"
          :show-message="false"
          v-show="ruleForm.AiTransCode === '1'"
        >
          <el-input
            type="textarea"
            v-model="ruleForm.AdaptBitratePercent"
            style="width:330px;"
          /><br />
          <span>請輸入10-50之間的整數，表示相比視頻碼率節省的碼率</span>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >保存</el-button
        >
        <el-button @click="$parent._cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { TEMPLATE_TYPE, TEMPLATE_TYPE_PARAMS } from "../constance";
import { ADD_TRANSCODE_TEMPLATE, UPDATE_TRANSCODE_TEMPLATE } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
import { CSSErrorTips } from "../../components/CSSErrorTips";

export default {
  name: "optionForm",

  props: {
    selectItem: {
      type: Object
    }
  },
  computed: {
    actualItem() {
      return this.selectItem;
    }
  },
  watch: {
    actualItem(newValue, oldValue) {
      // 从编辑页面直接点击添加，需要刷新为空表单的状态
      if (Object.keys(newValue).length === 0) {
        this.$refs.ruleForm.resetFields();
        this.ruleForm.AiTransCode = "0";
        // 默认选择普通
        this.selectCommonType();
      }
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
        AiTransCode: "0",
        Height: "",
        VideoBitrate: "",
        AdaptBitratePercent: ""
      },

      rules: {
        TemplateName: [{ required: true }],
        desc: [{ required: false }],
        Height: [{ required: true }],
        VideoBitrate: [{ required: true }],
        AdaptBitratePercent: [{ required: true }]
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
    validateForm() {
      const TemplateNameRegex = /^[a-zA-Z0-9]{3,10}$/;

      if (!TemplateNameRegex.test(this.ruleForm.TemplateName)) {
        this.$message({
          message: "範本名稱不符合要求",
          type: "error",
          showClose: true,
          duration: 0
        });
        return false;
      }

      const descRegex = /^[u4e00-\u9fff_a-zA-Z0-9_-]*$/;

      if (!descRegex.test(this.ruleForm.Description)) {
        this.$message({
          message: "範本描述不符合要求",
          type: "error",
          showClose: true,
          duration: 0
        });
        return false;
      }

      const VideoBitrate = this.ruleForm.VideoBitrate;

      if (VideoBitrate.length === 0) {
        this.$message({
          message: "請輸入影音碼率",
          type: "error",
          showClose: true,
          duration: 0
        });
        return false;
      }

      if (VideoBitrate < 100 || VideoBitrate > 8000) {
        this.$message({
          message: "編碼範圍為100K-8000K",
          type: "error",
          showClose: true,
          duration: 0
        });
        return false;
      }

      if (VideoBitrate >= 100 && VideoBitrate <= 1000) {
        if (VideoBitrate % 100 !== 0) {
          this.$message({
            message: "編碼範圍1000K以內僅支持整百填寫",
            type: "error",
            showClose: true,
            duration: 0
          });
          return false;
        }
      } else if (VideoBitrate > 1000 && VideoBitrate <= 8000) {
        if (VideoBitrate % 500 !== 0) {
          this.$message({
            message: "編碼範圍1000Kbps以上僅支持整500填寫",
            type: "error",
            showClose: true,
            duration: 0
          });
          return false;
        }
      }

      const Height = this.ruleForm.Height;

      if (Height.length === 0) {
        this.$message({
          message: "請輸入影音高度",
          type: "error",
          showClose: true,
          duration: 0
        });
        return false;
      }

      if (Height < 0 || Height > 3000) {
        this.$message({
          message: "影音高度範圍為0-3000",
          type: "error",
          showClose: true,
          duration: 0
        });
        return false;
      }

      if (Height % 4 !== 0) {
        this.$message({
          message: "視頻高度要求為4的倍數，寬度按等比例縮放",
          type: "error",
          showClose: true,
          duration: 0
        });
        return false;
      }

      let AdaptBitratePercent = this.ruleForm.AdaptBitratePercent;
      let AiTransCode = this.ruleForm.AiTransCode;

      if (AiTransCode === "1") {
        if (AdaptBitratePercent.length === 0) {
          this.$message({
            message: "請輸入碼率壓縮比",
            type: "error",
            showClose: true,
            duration: 0
          });
          return false;
        }

        if (AdaptBitratePercent < 10 || AdaptBitratePercent > 50) {
          this.$message({
            message: "碼率壓縮比為10-50之間的整數",
            type: "error",
            showClose: true,
            duration: 0
          });
          return false;
        }

        if (!/^\d+$/.test(AdaptBitratePercent)) {
          this.$message({
            message: "碼率壓縮比為10-50之間的整數",
            type: "error",
            showClose: true,
            duration: 0
          });
          return false;
        }
      }

      return true;
    },

    submitForm(formName) {
      const params = Object.assign(this.ruleForm, {
        Version: "2018-08-01"
      });

      if (this.selectType === "純音頻") {
        params.Height = 0;
        params.VideoBitrate = 100;
      } else {
        if (!this.validateForm()) {
          return;
        }
      }

      let AiTransCode = params.AiTransCode;
      if (AiTransCode === "0") {
        delete params.AdaptBitratePercent;
      } else {
        params.AdaptBitratePercent = params.AdaptBitratePercent * 0.01;
      }

      if (Object.keys(this.selectItem).length) {
        params.TemplateId = this.selectItem.TemplateId;
        delete params.AiTransCode;
        delete params.TemplateName;
        this.handleUpdate(params);
        return;
      }

      this.handleAdd(params);
    },

    handleAdd(params) {
      this.axios.post(ADD_TRANSCODE_TEMPLATE, params).then(data => {
        if (data.Response.Error == undefined) {
          this.$message({
            message: "添加成功",
            type: "success",
            showClose: true,
            duration: 0
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
            type: "success",
            showClose: true,
            duration: 0
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
        Object.keys(this.ruleForm).forEach(key => {
          this.ruleForm[key] = JSON.parse(JSON.stringify(this.selectItem[key]));
          this.ruleForm.AiTransCode = this.ruleForm.AiTransCode.toString();
          this.ruleForm.AdaptBitratePercent =
            this.ruleForm.AdaptBitratePercent * 100;
        });
      } else {
        // 默认选择普通
        this.selectCommonType();
      }
    },
    selectCommonType() {
      const currentItem = TEMPLATE_TYPE.find(item => item.key === "common");
      this.ruleForm.Height = currentItem.Height;
      this.ruleForm.VideoBitrate = currentItem.VideoBitrate;
      this.selectType = currentItem.value;
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
  span {
    font-size: 12px;
    color: #888;
  }
}
</style>
