<template>
  <div>
    <div class="title_top">
      <i class="el-icon-back" @click="resetForm()"></i>
      <h1>创建跟踪集</h1>
    </div>
    <div class="tea-content__body">
      <div class="form">
        <p class="basic">基础信息</p>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <el-form-item label="跟踪集名称" prop="TrankingName">
            <el-input v-model="ruleForm.TrankingName" placeholder="请输入跟踪集名称"></el-input>
            <p class="hint trankHint">{{text}}</p>
          </el-form-item>
          <el-form-item label="跟踪所有区域">
            <span>是</span>
          </el-form-item>
          <p class="basic store">管理事件</p>
          <el-form-item label="管理事件">
            <el-radio-group v-model="ruleForm.radio2">
              <el-radio :label="0">全部</el-radio>
              <el-radio :label="1">只读</el-radio>
              <el-radio :label="2">只写</el-radio>
            </el-radio-group>
          </el-form-item>
          <p class="basic store">存储位置</p>
          <el-form-item label="创建新的cos存储桶">
            <el-radio-group v-model="ruleForm.radio">
              <el-radio :label="1" @change="Yes()">是</el-radio>
              <el-radio :label="0" @change="NO()">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="cos_box" v-if="YesShow">
            <label>cos存储桶</label>
            <div>
              <input
                type="text"
                v-model="ruleForm.COS"
                placeholder="请输入Bucket名称"
                @blur="cosBlur()"
                @focus="cosFocus()"
                :style="{'border-color':borderColor}"
              />
              <p class="hint" :style="{'color':color}">{{text1}}</p>
            </div>
          </div>
          <el-form-item label="cos存储桶" v-if="NoShow">
            <el-select v-model="value" v-if="select">
              <el-option label="暂无可用cos存储桶"></el-option>
            </el-select>
            <el-select v-model="value" v-if="!select">
              <el-option
                v-for="(item,index) in ListCos"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
            <p class="hint">{{text2}}</p>
          </el-form-item>
          <el-form-item label="日志文件前缀" prop="logName">
            <el-input v-model="ruleForm.logName" placeholder="请输入日志文件前缀"></el-input>
            <p class="hint trankHint">{{text}}</p>
          </el-form-item>
          <el-form-item label="发送CMQ通知">
            <el-radio-group v-model="ruleForm.radio3">
              <el-radio :label="1" @change="Yes()">是</el-radio>
              <el-radio :label="0" @change="NO()">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="btns">
            <el-button @click="resetForm()">取消</el-button>
            <el-button class="btn-b" :plain="true" @click="save()">完成创建</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { isYan, isYan1 } from '@/utils/validate'
import { GZJ_CREATE, LIST_COSBUCKETS } from '@/constants'
export default {
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        this.text = ''
        callback(new Error('请输入跟踪集名称'))
      } else if (!isYan(value)) {
        this.text = ''
        callback(new Error('仅支持大小写字母、数字、以及.的组合，不能超过40字符。'))
      } else {
        callback()
      }
    }
    let LogFile = (rule, value, callback) => {
      if (value === '') {
        this.text2 = ''
        callback(new Error('请输入cos存储库'))
      } else if (!isYan1(value)) {
        this.text2 = ''
        callback(new Error('仅支持小写字母、数字的组合，不能超过40字符。'))
      } else {
        callback()
      }
    }
    return {
      YesShow: true,
      NoShow: false,
      select: false,
      ListCosName: '',
      color: '',
      borderColor: '',
      value: '', // 下拉cos存储桶选择内容
      ListCos: '', // 否--cos存储桶
      text: '仅支持大小写字母、数字、以及_的组合，3-128个字符。',
      text1: '仅支持小写字母、数字的组合，不能超过40字符。',
      text2: '仅支持小写字母、数字的组合，不能超过40字符。',
      ruleForm: {
        radio: 1,
        radio2: 0,
        radion3: 1,
        TrankingName: '',
        logName: '',
        COS: '',
        COS1: '',
        log_file: ''
      },
      rules: {
        TrankingName: [
          {
            validator: validatePass,
            trigger: 'blur'
          }
        ],
        log_file: [
          {
            validator: LogFile,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.axios.post(LIST_COSBUCKETS).then(({ data }) => {
      this.ListCos = data.cosBucketsList
      for (var i = 0; i < this.ListCos.length; i++) {
        this.ListCosName = this.ListCos[i].Name
      }
      if (this.ListCos.length <= 0) {
        this.select = true
      }
    })
  },
  methods: {
    // cos存储桶失焦
    cosBlur () {
      if (this.ruleForm.COS == '') {
        this.borderColor = '#F56C6C'
        this.text1 = '请输入cos存储库'
        this.color = '#F56C6C'
      } else if (!isYan1(this.ruleForm.COS)) {
        this.text1 = '仅支持小写字母、数字的组合，不能超过40字符。'
        this.color = '#F56C6C'
        this.borderColor = '#F56C6C'
      } else {
        for (var i = 0; i < this.ListCos.length; i++) {
          if (this.ruleForm.COS == this.ListCos[i].name) {
            this.text1 = '您已创建和拥有此存储桶'
            this.color = '#F56C6C'
            this.borderColor = '#F56C6C'
            return
          } else {
            this.text1 = '仅支持小写字母、数字的组合，不能超过40字符。'
            this.color = '#888'
            this.borderColor = '#67C23A'
          }
        }
      }
    },
    cosFocus () {
      if (this.text1 == '请输入cos存储库') {
        this.borderColor = '#F56C6C'
      } else if (
        this.color == '#F56C6C' &&
        this.text1 == '仅支持小写字母、数字的组合，不能超过40字符。'
      ) {
        this.borderColor = '#F56C6C'
      } else if (this.text1 == '您已创建和拥有此存储桶') {
        this.borderColor = '#F56C6C'
      } else {
        this.borderColor = '#2277da'
      }
    },
    save () {
      let _cos
      if (this.ruleForm.radio == 1) {
        _cos = this.ruleForm.COS
      } else {
        _cos = this.value
      }
      let params = {
        IsMultiRegionAudit: 1,
        Name: this.ruleForm.TrankingName, // 跟踪集名称
        CosBucketName: _cos, // COS Bucket 的名称
        CosKeyPrefix: this.ruleForm.log_file // COS Bucket 前缀
      }
      this.axios.post(GZJ_CREATE, params).then(data => {
        if (data.codeDesc == 'Success') {
          this.$router.push({
            path: '/Audit'
          })
          this.$message({
            message: '创建成功'
          })
        }
      })
    },
    EmptyData () {
      this.ruleForm.COS = ''
      this.text1 = '仅支持小写字母、数字的组合，不能超过40字符。'
      this.color = '#888'
      this.borderColor = '#c0c4cc'
    },
    resetForm () {
      this.$router.replace({
        path: '/Audit'
      })
    },
    Yes () {
      this.YesShow = true
      this.NoShow = false
      this.EmptyData()
    },
    NO () {
      this.YesShow = false
      this.NoShow = true
      this.EmptyData()
    }
  }
}
</script>
<style lang="scss">
.form {
  .demo-ruleForm {
    .el-form-item__content {
      float: left;
    }
    .el-input__inner {
      width: 200px;
      height: 30px;
      border-radius: 0px;
    }
  }
  .btns {
    .el-button {
      height: 30px;
      line-height: 5px;
      border-radius: 0;
    }
    .btn-b {
          background-color: #006eff;
          color: #fff;
          border: 1px solid #006eff;
        }
  }
}
</style>
<style scoped lang="scss">
.title_top {
  display: flex;
  justify-content: flex-start;
  height: 50px;
  background: #fff;
  & > i {
    width: 16px;
    height: 16px;
    font-size: 16px;
    font-weight: 900;
    line-height: 48px;
    text-align: center;
    margin-left: 20px;
    color: #006eff;
    cursor: pointer;
  }
  h1 {
    padding-left: 10px;
    line-height: 50px;
    font-size: 16px;
    font-weight: 700;
  }
}
.cos_box {
  display: flex;
  height: 55px;
  margin-bottom: 22px;
  & > label {
    font-size: 12px;
    text-align: left;
    line-height: 30px;
    width: 144px;
    display: inline-block;
    color: #606266;
  }
  & > div {
    & > input {
      border: 1px solid #dcdfe6;
      padding: 0 15px;
      width: 150px;
      height: 30px;
      outline: none;
    }
    input:hover {
      border: 1px solid #c0c4cc;
    }
    input::-webkit-input-placeholder {
      color: #c0c4cc;
      font-size: 14px;
    }
    input:-moz-placeholder {
      color: #c0c4cc;
      font-size: 14px;
    }
    input::-moz-placeholder {
      color: #c0c4cc;
      font-size: 14px;
    }
    input:-ms-input-placeholder {
      color: #c0c4cc;
      font-size: 14px;
    }
    & > p {
      margin-top: 2px !important;
      border: 0;
    }
  }
}
.tea-content__body {
  padding: 20px;
  .form {
    padding: 15px;
    background: #fff;
    .basic {
      -webkit-margin-before: 1em;
      -webkit-margin-after: 1em;
      -webkit-margin-start: 0px;
      -webkit-margin-end: 0px;
      font-weight: bold;
      line-height: 30px;
      color: #000;
      font-size: 14px;
    }
    .store {
      border-top: 1px solid #ddd;
      margin-top: 20px;
      padding-top: 20px;
    }
    .hint {
      color: #888;
      font-size: 12px;
      margin-top: -5px;
    }
    .el-form-item__label {
      font-size: 12px;
      text-align: left;
      line-height: 30px;
    }
    .el-input__inner {
      width: 180px;
      height: 30px;
      border-radius: 0px;
    }
    .el-form-item__content {
      line-height: 30px;
    }
    .el-form-item {
      margin-bottom: 22px !important;
    }
    .el-select .el-input .el-select__caret.is-reverse {
      margin-top: -10px;
    }
  }
}
</style>
