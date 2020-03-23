<template>
  <div class="form-wrap">
    <h4>回調設置</h4>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('CSS.transcribe.7')" prop="TemplateName">
        <el-input v-model="ruleForm.TemplateName" :placeholder="$t('CSS.transcribe.31')" style="width:330px;" />
        <span class="sub-text">僅支持中文、英文、數字、_、-，不超過30個字元</span>
      </el-form-item>
      <el-form-item :label="$t('CSS.transcribe.8')" prop="Description">
        <el-input
          type="textarea"
          :placeholder="$t('CSS.transcribe.26')"
          v-model="ruleForm.Description"
          style="width:330px;"
        />
        <span class="sub-text">僅支持中文、英文、數字、_、-，不超過100個字元</span>
      </el-form-item>
      <el-form-item :label="$t('CSS.transcribe.20')" prop="CallbackKey">
        <el-input
          v-model="ruleForm.CallbackKey"
          style="width:330px;"
          :placeholder="$t('CSS.transcribe.27')"
        />
      </el-form-item>
      <el-form-item :label="$t('CSS.transcribe.21')" prop="StreamBeginNotifyUrl">
        <el-input
          v-model="ruleForm.StreamBeginNotifyUrl"
          style="width:330px;"
          :placeholder="$t('CSS.transcribe.30')"
        />
      </el-form-item>
      <el-form-item :label="$t('CSS.transcribe.22')" prop="StreamEndNotifyUrl">
        <el-input
          v-model="ruleForm.StreamEndNotifyUrl"
          style="width:330px;"
          :placeholder="$t('CSS.transcribe.30')"
        />
      </el-form-item>
      <el-form-item :label="$t('CSS.transcribe.23')" prop="RecordNotifyUrl">
        <el-input
          v-model="ruleForm.RecordNotifyUrl"
          style="width:330px;"
          :placeholder="$t('CSS.transcribe.30')"
        />
      </el-form-item>
      <el-form-item :label="$t('CSS.transcribe.24')" prop="SnapshotNotifyUrl">
        <el-input
          v-model="ruleForm.SnapshotNotifyUrl"
          style="width:330px;"
          :placeholder="$t('CSS.transcribe.30')"
        />
      </el-form-item>
      <el-form-item :label="$t('CSS.transcribe.25')" prop="PornCensorshipNotifyUrl">
        <el-input
          v-model="ruleForm.PornCensorshipNotifyUrl"
          style="width:330px;"
          :placeholder="$t('CSS.transcribe.30')"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="$parent._cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ADD_CALLBACK_TEMPLATE, UPDATE_CALLBACK_TEMPLATES } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'
import { CSSErrorTips } from '../../components/CSSErrorTips'
export default {
  name: 'optionForm',

  props: {
    selectItem: {
      type: Object
    }
  },

  data () {
    let checkCallbackKey = (rule, value, callback) => {
      if (value && value.length > 0) {
        let result = /^[a-zA-Z0-9]{1,32}$/.test(value)
        console.log(result)
        if (!result) {
          return callback(
            new Error('回調金鑰由大小寫字母及數字組成，最長32個字元')
          )
        }
      }

      callback()
    }
    let checkStreamBeginNotifyUrl = (rule, value, callback) => {
      if (value && value.length > 0) {
        let result = this.isHttpOrHttps(value)
        if (!result) {
          return callback(new Error('推流回調URL不合法'))
        }
      }
      callback()
    }

    let checkStreamEndNotifyUrl = (rule, value, callback) => {
      if (value && value.length > 0) {
        let result = this.isHttpOrHttps(value)
        if (!result) {
          return callback(new Error('斷流回調URL不合法'))
        }
      }
      callback()
    }

    let checkRecordNotifyUrl = (rule, value, callback) => {
      if (value && value.length > 0) {
        let result = this.isHttpOrHttps(value)
        if (!result) {
          return callback(new Error('錄製回調URL不合法'))
        }
      }
      callback()
    }

    let checkSnapshotNotifyUrl = (rule, value, callback) => {
      if (value && value.length > 0) {
        let result = this.isHttpOrHttps(value)
        if (!result) {
          return callback(new Error('截圖回調URL不合法'))
        }
      }
      callback()
    }

    let PornCensorshipNotifyUrl = (rule, value, callback) => {
      if (value && value.length > 0) {
        let result = this.isHttpOrHttps(value)
        if (!result) {
          return callback(new Error('鑑黃回調URL不合法'))
        }
      }
      callback()
    }

    return {
      ruleForm: {
        TemplateName: '',
        Description: '',
        CallbackKey: '',
        PornCensorshipNotifyUrl: '',
        SnapshotNotifyUrl: '',
        RecordNotifyUrl: '',
        StreamEndNotifyUrl: '',
        StreamBeginNotifyUrl: ''
      },

      rules: {
        TemplateName: [
          { required: true, message: '請輸入範本名稱', trigger: 'blur' },
          { pattern: /^[\w\-\u4e00-\u9fa5]{1,30}$/, message: '範本名稱不符要求', trigger: 'blur' }
        ],
        Description: [
          { required: false },
          { max: 100, message: '長度不能超過100個字元', trigger: 'blur' },
          { pattern: /^[\w\-\u4e00-\u9fa5]{0,100}$/, message: '描述不符要求', trigger: 'blur' }
        ],
        CallbackKey: [
          { required: false },
          { validator: checkCallbackKey, trigger: 'blur' }
        ],
        StreamBeginNotifyUrl: [
          { validator: checkStreamBeginNotifyUrl, trigger: 'blur' }
        ],
        StreamEndNotifyUrl: [
          { validator: checkStreamEndNotifyUrl, trigger: 'blur' }
        ],
        RecordNotifyUrl: [{ validator: checkRecordNotifyUrl, trigger: 'blur' }],
        SnapshotNotifyUrl: [
          { validator: checkSnapshotNotifyUrl, trigger: 'blur' }
        ],
        PornCensorshipNotifyUrl: [
          { validator: PornCensorshipNotifyUrl, trigger: 'blur' }
        ]
      }
    }
  },

  mounted () {
    this.initTableParams()
  },

  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 如果有selectItem则为修改

          const params = { ...this.ruleForm }
          params.Version = '2018-08-01'

          if (
            params['StreamBeginNotifyUrl'].length == 0 &&
            params['StreamEndNotifyUrl'].length == 0 &&
            params['RecordNotifyUrl'].length == 0 &&
            params['SnapshotNotifyUrl'].length == 0 &&
            params['PornCensorshipNotifyUrl'].length == 0
          ) {
            this.$message.error('請至少填寫一個回調地址')
            return
          }

          if (Object.keys(this.selectItem).length) {
            params.TemplateId = this.selectItem.TemplateId
            this.handleUpdate(params)
            return
          }

          this.handleAdd(params)
        }
      })
    },

    handleAdd (params) {
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
        let ErrOr = Object.assign(ErrorTips, CSSErrorTips)
        this.$message.error(ErrOr[data.Response.Error.Code])
      })
    },

    handleUpdate (params) {
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
        let ErrOr = Object.assign(ErrorTips, CSSErrorTips)
        this.$message.error(ErrOr[data.Response.Error.Code])
      })
    },

    initTableParams () {
      if (Object.keys(this.selectItem).length) {
        const currentParams = {}
        Object.keys(this.ruleForm).forEach(key => {
          this.ruleForm[key] = JSON.parse(JSON.stringify(this.selectItem[key]))
        })
      }
    },
    isHttpOrHttps (url) {
      return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
    }
  }
}
</script>

<style scoped lang='scss'>
.sub-text {
  color: #888;
  margin-left: 15px;
  font-size: 12px;
  width: 300px;
  display: inline-block;
  line-height: 20px;
}
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
  span {
    font-size: 12px;
    color: #888;
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
