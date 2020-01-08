<template>
  <div class="form-wrap">
    <h4>回調設置</h4>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item label="模板名稱" prop="TemplateName">
        <el-input v-model="ruleForm.TemplateName" style="width:330px;" />
      </el-form-item>
      <el-form-item label="模板描述" prop="Description">
        <el-input 
          type="textarea"
          v-model="ruleForm.Description"
          style="width:330px;"
          />
      </el-form-item>
      <el-form-item label="回调秘钥" prop="CallbackKey" >
        <el-input 
          v-model="ruleForm.CallbackKey" 
          style="width:330px;" 
          placeholder="请输入回调密钥(由大小写字母及数字组成，最长32个字符)"
          />
      </el-form-item>
      <el-form-item label="推流回调" prop="StreamBeginNotifyUrl">
        <el-input 
          v-model="ruleForm.StreamBeginNotifyUrl" 
          style="width:330px;"
          placeholder="请输入推流回调URL(协议头:http、https等))"
          />
      </el-form-item>
      <el-form-item label="断流回调" prop="StreamEndNotifyUrl">
        <el-input 
          v-model="ruleForm.StreamEndNotifyUrl" 
          style="width:330px;"
          placeholder="请输入断流回调URL(协议头:http、https等))"
          />
      </el-form-item>
      <el-form-item label="录制回调" prop="RecordNotifyUrl">
        <el-input 
          v-model="ruleForm.RecordNotifyUrl" 
          style="width:330px;"
          placeholder="请输入录制回调URL(协议头:http、https等))"
          />
      </el-form-item>
      <el-form-item label="截图回调" prop="SnapshotNotifyUrl">
        <el-input 
          v-model="ruleForm.SnapshotNotifyUrl" 
          style="width:330px;" 
          placeholder="请输入截图回调URL(协议头:http、https等))"          
          />
      </el-form-item>
      <el-form-item label="鉴黄回调" prop="PornCensorshipNotifyUrl">
        <el-input 
          v-model="ruleForm.PornCensorshipNotifyUrl" 
          style="width:330px;"
          placeholder="请输入鉴黄回调URL(协议头:http、https等))"          
          />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="$emit('update:formShow', false)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ADD_CALLBACK_TEMPLATE, UPDATE_CALLBACK_TEMPLATES } from "@/constants"

export default {
  name: "optionForm",

  props: {
    selectItem: {
      type: Object
    }
  },

  data() {
    return {
      ruleForm: {
        TemplateName: "",
        Description: "",
        CallbackKey: "",
        PornCensorshipNotifyUrl: "",
        SnapshotNotifyUrl: "",
        RecordNotifyUrl: "",
        StreamEndNotifyUrl: "",
        StreamBeginNotifyUrl: ""
      },

      rules: {
        TemplateName: [
          { required: true, message: "請輸入模板名稱", trigger: "blur" },
          { min: 1, max: 30, message: "長度不能超過30個字符", trigger: "blur" }
        ],
        desc: [
          { required: false },
          { max: 100, message: "長度不能超過100個字符", trigger: 'blur' }
        ]
        
      },
    }
  },

  mounted() {
    this.initTableParams()
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 如果有selectItem则为修改

          const params = { ...this.ruleForm }
          params.Version = '2018-08-01'

          if (Object.keys(this.selectItem).length) {
            params.TemplateId = this.selectItem.TemplateId
            this.handleUpdate(params)
            return
          }

          this.handleAdd(params)

        }
      })
    },

    handleAdd(params) {
      this.axios.post(ADD_CALLBACK_TEMPLATE, params).then(data => {
        if (data.Response.Error == undefined) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$parent.fetchRecordingList()
          this.$emit('update:formShow', false)
          return
        }
        this.$message.error(data.Response.Error.Message)
      })
    },

    handleUpdate(params) {
      this.axios.post(UPDATE_CALLBACK_TEMPLATES, params).then(data => {
        if (data.Response.Error == undefined) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$parent.fetchRecordingList()
          this.$emit('update:formShow', false)
          return
        }
        this.$message.error(data.Response.Error.Message)
      })
    },

    initTableParams() {
      if (Object.keys(this.selectItem).length) {
        const currentParams = {}
        Object.keys(this.ruleForm).forEach(key => {
          this.ruleForm[key] = JSON.parse(JSON.stringify(this.selectItem[key]))
        })
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
.input-number >>> .el-input__inner {
  height: 40px;
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
  .explain {
    display: inline-block;
    p {
      line-height: 18px;

      a {
        color: #006eff;
      }
      a:hover {
        border-bottom: 1px #006eff solid;
      }
    }
  }
}
</style>