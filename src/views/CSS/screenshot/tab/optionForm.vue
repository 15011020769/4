<template>
  <div class="form-wrap">
    <h4>截圖鑒黃配置</h4>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item :label="$t('CSS.transcribe.7')" prop="TemplateName">
        <el-input v-model="ruleForm.TemplateName" style="width:330px;" />
      </el-form-item>
      <el-form-item :label="$t('CSS.transcribe.8')" prop="Description">
        <el-input type="textarea" v-model="ruleForm.Description" style="width:330px;" />
      </el-form-item>
      <el-form-item class="input-number" label="截圖間隔" prop="SnapshotInterval">
        <el-input-number v-model="ruleForm.SnapshotInterval" :step="5" step-strictly />
      </el-form-item>
      <el-form-item :label="$t('CSS.domainManagement.7')+$t('CSS.domainManagement.16')" prop="PornFlag">
        <el-switch v-model="ruleForm.PornFlag" />
        <div class="explain" v-if="ruleForm.PornFlag">
          <p>{{$t('CSS.domainManagement.50')}}</p>
        </div>
      </el-form-item>
      <el-form-item label="儲存位置">
        <div class="explain">
          <p>{{$t('CSS.domainManagement.51')}}</p>
        </div>
      </el-form-item>
      <el-form-item label="CosAppId" prop="CosAppId">
        <el-input v-model="ruleForm.CosAppId" />
      </el-form-item>
      <el-form-item label="CosBucket" prop="CosBucket">
        <el-input v-model="ruleForm.CosBucket" />
      </el-form-item>
      <el-form-item label="CosRegion" prop="CosRegion">
        <el-input v-model="ruleForm.CosRegion" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="$parent._cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ADD_SNAPSHOT_TEMPLATE, UPDATE_SNAPSHOT_TEMPLATE } from '@/constants'

const regex = /^[u4e00-\u9fff_a-zA-Z0-9_-]*$/

export default {
  name: 'optionForm',

  props: {
    selectItem: {
      type: Object
    }
  },

  data () {
    let checkTemplateName = (rule, value, callback) => {
      let result = regex.test(value)
      if (!result) {
        callback(new Error('範本僅支持中文、英文、數字、_、-，不超過30個字符'))
      }
      callback()
    }

    let checkDesc = (rule, value, callback) => {
      let result = regex.test(value)
      if (!result) {
        callback(
          new Error('範本描述僅支持中文、英文、數字、_、-，不超過100個字符')
        )
      }
      callback()
    }

    let checkSnapshotInterval = (rule, value, callback) => {
      if (value < 5 || value > 300) {
        callback(new Error('截圖間隔取值範圍為5秒-300秒，必須為5的倍數'))
      }

      if (value % 5 !== 0) {
        callback(new Error('截圖間隔取值範圍為5秒-300秒，必須為5的倍數'))
      }
      callback()
    }

    let checkCosAppId = (rule, value, callback) => {
      if (!/^[1-9]\d*$/.test(value)) {
        callback(new Error('CosAppId必须是整数'))
      }
      callback()
    }

    return {
      ruleForm: {
        TemplateName: '',
        Description: '',
        SnapshotInterval: 10, // 截圖間隔
        PornFlag: 0, // 是否开启鉴黄，0：不开启，1：开启。默认：0。
        CosAppId: '',
        CosBucket: '',
        CosRegion: ''
      },

      rules: {
        TemplateName: [
          { required: true, message: '請輸入範本名稱', trigger: 'blur' },
          { validator: checkTemplateName, trigger: 'blur' }
        ],
        desc: [{ required: false }, { validator: checkDesc, trigger: 'blur' }],
        SnapshotInterval: [
          { required: true, message: '請輸入截圖間隔', trigger: 'blur' },
          { validator: checkSnapshotInterval, trigger: 'blur' }
        ],
        CosAppId: [
          { required: true, message: '請輸入CosAppId', trigger: 'blur' },
          { validator: checkCosAppId, trigger: 'blur' }
        ],
        CosBucket: [
          { required: true, message: '請輸入CosBucket', trigger: 'blur' }
        ],
        CosRegion: [
          { required: true, message: '請輸入CosRegion', trigger: 'blur' }
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
          params.PornFlag = this.ruleForm.PornFlag ? 1 : 0

          if (Object.keys(this.selectItem).length) {
            params.TemplateId = this.selectItem.TemplateId
            params.CosAppId = Number(params.CosAppId)
            this.handleUpdate(params)
            return
          }

          this.handleAdd(params)
        }
      })
    },

    handleAdd (params) {
      this.axios.post(ADD_SNAPSHOT_TEMPLATE, params).then(data => {
        if (data.Response.Error == undefined) {
          this.$message({
            message: '添加成功',
            type: 'success',
            showClose: true,
            duration: 0
          })
          this.$parent.fetchRecordingList()
          this.$emit('update:formShow', false)
          return
        }
        this.$message.error(data.Response.Error.Message)
      })
    },

    handleUpdate (params) {
      this.axios.post(UPDATE_SNAPSHOT_TEMPLATE, params).then(data => {
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

    initTableParams () {
      if (Object.keys(this.selectItem).length) {
        const currentParams = {}
        Object.keys(this.ruleForm).forEach(key => {
          this.ruleForm[key] = JSON.parse(JSON.stringify(this.selectItem[key]))
          this.ruleForm.PornFlag = this.selectItem.PornFlag > 0
        })
      }
    }
  }
}
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
