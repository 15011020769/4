<template>
  <div class="form-wrap">
    <h4>{{$t('CSS.detailPlay.TranscodingConfiguration')}}</h4>
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
      <el-form-item :label="$t('CSS.transcribe.18')">
        <el-radio-group v-model="selectType" @change="radioChange">
          <el-radio
            v-for="item in tableData"
            :key="item.key"
            :label="item.value"
          />
          <el-radio
            v-show="ruleForm.AiTransCode !== '1'"
            key="voice"
          :label="$t('CSS.transcribe.19')"
          />
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('CSS.transcribe.7')" prop="TemplateName">
        <el-input
          v-model="ruleForm.TemplateName"
          style="width:330px;"
          :disabled="Object.keys(selectItem).length > 0"
        />
        <!-- <br /> -->
        <span class="sub-text">僅支持字母、數字組合，請輸入3-10字元</span>
      </el-form-item>
      <el-form-item :label="$t('CSS.transcribe.8') " prop="Description">
        <el-input
          type="textarea"
          v-model="ruleForm.Description"
          style="width:330px;"
        />
        <span class="sub-text">僅支持中文、英文、數字、_、-</span>
      </el-form-item>
      <template v-if="selectType !== '純音訊'">
        <el-form-item
          label="影音碼率(kbps)"
          prop="VideoBitrate"
        >
          <el-input
            type="textarea"
            v-model.number="ruleForm.VideoBitrate"
            @input="value => ruleForm.VideoBitrate=value.replace(/[^\d]/, '')"
            style="width:330px;"
          />
          <span class="sub-text"
            >必填，編碼範圍
            100K-8000K，1000K以內僅支持整百填寫，1000Kbps以上僅支持整500填寫</span
          >
        </el-form-item>
        <el-form-item label="影音高度(px)" prop="Height">
          <el-input
            type="textarea"
            v-model.number="ruleForm.Height"
            @input="value => ruleForm.Height=value.replace(/[^\d]/, '')"
            style="width:330px;"
          />
          <span class="sub-text">影音高度範圍為0-3000，要求為4的倍數，寬度按等比例縮放</span>
        </el-form-item>
      </template>

      <el-form-item
        label="碼率壓縮比"
        prop="AdaptBitratePercent"
        v-if="ruleForm.AiTransCode == '1'"
      >
        <el-input
          type="textarea"
          v-model.number="ruleForm.AdaptBitratePercent"
          @input="value => ruleForm.AdaptBitratePercent=value.replace(/[^\d]/, '')"
          style="width:330px;"
        />
        <span class="sub-text">請輸入10-50之間的整數，表示相比影音碼率節省的碼率</span>
      </el-form-item>
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
import { TEMPLATE_TYPE, TEMPLATE_TYPE_PARAMS } from '../constance'
import { ADD_TRANSCODE_TEMPLATE, UPDATE_TRANSCODE_TEMPLATE } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'
import { CSSErrorTips } from '../../components/CSSErrorTips'

export default {
  name: 'optionForm',

  props: {
    selectItem: {
      type: Object
    }
  },
  computed: {
    actualItem () {
      return this.selectItem
    }
  },
  watch: {
    actualItem (newValue, oldValue) {
      // 从编辑页面直接点击添加，需要刷新为空表单的状态
      if (Object.keys(newValue).length === 0) {
        this.$refs.ruleForm.resetFields()
        this.ruleForm.AiTransCode = '0'
        // 默认选择普通
        this.selectCommonType()
      }
    }
  },
  data () {
    return {
      form: {
        desc: '', // 範本描述
        template: '', // 可用範本
        name: '' // 範本名称
      },

      ruleForm: {
        TemplateName: '',
        Description: '',
        AiTransCode: '0',
        Height: '',
        VideoBitrate: '',
        AdaptBitratePercent: ''
      },

      rules: {
        TemplateName: [
          { required: true, message: '請輸入範本名稱' },
          { pattern: /^[a-zA-Z\d]{3,10}$/, message: '範本名稱不符要求', trigger: 'blur' }
        ],
        Description: [
          { required: false },
           { pattern: /^[\u4e00-\u9fa5\w\-]*$/, message: '描述不符要求', trigger: 'blur' }
        ],
        Height: [
          { required: true, message: '請輸入影音高度' },
          {
            validator: (rule, value, callback) => {

              if (value < 0 || value > 3000) {
                return void callback('影音高度範圍為0-3000')
              }

              if (value % 4 !== 0) {
                return void callback('影音高度要求為4的倍數，寬度按等比例縮放')
              }
              callback()
            }
          }
          
        ],
        VideoBitrate: [
          { required: true, message: '請輸入影音碼率' },
          {
            validator(rule, VideoBitrate, callback) {
              
              if (!VideoBitrate) {
                return void callback('請輸入影音碼率')
              }

              if (VideoBitrate < 100 || VideoBitrate > 8000) {
                return void callback('編碼範圍為100K-8000K')
              }

              if (VideoBitrate >= 100 && VideoBitrate <= 1000) {
                if (VideoBitrate % 100 !== 0) {
                  return void callback('編碼範圍1000K以內僅支持整百填寫')
                }
              } else if (VideoBitrate > 1000 && VideoBitrate <= 8000) {
                if (VideoBitrate % 500 !== 0) {
                  return void callback('編碼範圍1000Kbps以上僅支持整500填寫')
                }
              }
              callback()
            }
          }
        ],
        AdaptBitratePercent: [
          { required: true, message: '請輸入碼率壓縮比' },
          {
            validator(rule, AdaptBitratePercent, callback) {
              if (!AdaptBitratePercent) {
                return void callback('請輸入碼率壓縮比')
              }

              if (AdaptBitratePercent < 10 || AdaptBitratePercent > 50) {
                return void callback('碼率壓縮比為10')
              }

              if (!/^\d+$/.test(AdaptBitratePercent)) {
                return void callback('碼率壓縮比為10')
              }
              callback()
            }
          }
        ]
      },

      tableData: JSON.parse(JSON.stringify(TEMPLATE_TYPE)),

      selectType: ''
    }
  },

  mounted () {
    this.initTableParams()
    // this.initInfo()
  },

  methods: {
    submitForm (formName) {
      this.$refs.ruleForm.validate(valid => {
        console.log(valid)
        if (valid) {
          console.log(3232)
          const params = JSON.parse(JSON.stringify(this.ruleForm))
          params.Version = '2018-08-01'
    
          if (this.selectType === '純音訊') {
            params.Height = 0
            params.VideoBitrate = 100
            params.NeedVideo = 0
            params.NeedAudio = 1
          } else {
            params.NeedVideo = 1
            params.NeedAudio = 1
          }
    
          params.AiTransCode = parseInt(params.AiTransCode)
    
          let AiTransCode = params.AiTransCode
          if (AiTransCode === 0) {
            delete params.AdaptBitratePercent
          } else {
            params.AdaptBitratePercent = params.AdaptBitratePercent * 0.01
          }
    
          if (Object.keys(this.selectItem).length) {
            params.TemplateId = this.selectItem.TemplateId
            delete params.AiTransCode
            delete params.TemplateName
            this.handleUpdate(params)
            return
          }
    
          this.handleAdd(params)
        }

      })
    },

    handleAdd (params) {
      this.axios.post(ADD_TRANSCODE_TEMPLATE, params).then(data => {
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
        let ErrOr = Object.assign(ErrorTips, CSSErrorTips)
        this.$message.error(ErrOr[data.Response.Error.Code])
      })
    },

    handleUpdate (params) {
      this.axios.post(UPDATE_TRANSCODE_TEMPLATE, params).then(data => {
        if (data.Response.Error == undefined) {
          this.$message({
            message: '修改成功',
            type: 'success',
            showClose: true,
            duration: 0
          })
          this.$parent.fetchRecordingList()
          this.$emit('update:formShow', false)
          return
        }
        let ErrOr = Object.assign(ErrorTips, CSSErrorTips)
        this.$message.error(ErrOr[data.Response.Error.Code])
      })
    },

    handleSelectionChange (e) {
      this.tableData.forEach(item => {
        this.tableParams[item.paramName].Enable = 0
      })
      e.forEach(item => {
        this.tableParams[item.paramName].Enable = 1
      })
    },

    radioChange (rows) {
      const currentItem = TEMPLATE_TYPE.find(item => item.value === rows)
      if (this.selectType !== '純音訊') {
        this.ruleForm.Height = currentItem.Height
        this.ruleForm.VideoBitrate = currentItem.VideoBitrate
      }

      this.selectType = rows
    },

    initTableParams () {
      if (Object.keys(this.selectItem).length) {
        Object.keys(this.ruleForm).forEach(key => {
          this.ruleForm[key] = JSON.parse(JSON.stringify(this.selectItem[key]))
          this.ruleForm.AiTransCode = this.ruleForm.AiTransCode.toString()
          this.ruleForm.AdaptBitratePercent =
            Math.floor(this.ruleForm.AdaptBitratePercent * 100)
        })
      } else {
        // 默认选择普通
        this.selectCommonType()
      }
    },
    selectCommonType () {
      const currentItem = TEMPLATE_TYPE.find(item => item.key === 'common')
      this.ruleForm.Height = currentItem.Height
      this.ruleForm.VideoBitrate = currentItem.VideoBitrate
      this.selectType = currentItem.value
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
