<template>
  <div>
    <div class="title_top">
      <div class="back">
        <i class="el-icon-back" @click="Back()"></i>
        <span>{{DetailData.Name}}</span>
      </div>
      <div class="off">
        <el-switch v-model="off" inactive-text="日志记录" @click.native="open()"></el-switch>
      </div>
    </div>
    <div class="tea-content__body">
      <div class="form">
        <p class="basic">基础信息</p>
        <div class="basic-b">
          <p>
            <span>跟踪集名称</span>
            <span>{{DetailData.Name}}</span>
          </p>
          <p>
            <span>跟踪所有区域</span>
            <span v-if="DetailData.IsMultiRegionAudit==1">是</span>
            <span v-if="DetailData.IsMultiRegionAudit==0">否</span>
          </p>
        </div>
        <p class="basic store">
          存储位置
          <span @click="redact()">编辑</span>
        </p>
        <div class="basic-b" v-if="TextShow">
          <p>
            <span>COS 存储桶</span>
            <span>{{DetailData.CosBucketName}}</span>
          </p>
          <p>
            <span>日志文件前缀</span>
            <span>{{DetailData.CosKeyPrefix}}</span>
          </p>
        </div>
        <el-form
          v-if="ShowBox"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="144px"
          class="demo-ruleForm"
        >
          <el-form-item label="创建新的cos存储桶">
            <el-radio-group v-model="ruleForm.radio">
              <el-radio :label="1" @change="Yes()">是</el-radio>
              <el-radio :label="0" @change="NO()">否</el-radio>
            </el-radio-group>
            <p class="hint" v-if="YesShow">目前新建存储桶仅支持创建在上海区域内。</p>
            <p class="hint" v-if="NoShow">目前仅支持存储到上海区域内的已经存在的COS存储桶。</p>
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
              >
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
          </el-form-item>
          <el-form-item label="日志文件前缀" prop="log_file">
            <el-input v-model="ruleForm.log_file" placeholder="请输入日志文件前缀"></el-input>
            <p class="hint">{{text2}}</p>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">保存</el-button>
            <el-button @click="resetForm()">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="del">
        <el-button :plain="true" @click="Del()">删除</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { isYan, isYan1 } from '@/utils/validate';
import {
  GZJ_DETAILIST,
  GZJ_DELETE,
  GZJ_STOPLOGGING,
  GZJ_STRATLOGGING,
  GZJ_UPDATEAUDIT,
  LIST_COSBUCKETS
} from '@/constants';
export default {
  data () {
    let LogFile = (rule, value, callback) => {
      if (value === '') {
        this.text2 = '';
        callback(new Error('请输入cos存储库'))
      } else if (!isYan1(value)) {
        this.text2 = '';
        callback(new Error('仅支持小写字母、数字的组合，不能超过40字符。'))
      } else {
        callback()
      }
    }
    return {
      YesShow: true,
      NoShow: false,
      ShowBox: false,
      TextShow: true,
      off: true,
      select: false,
      color: '',
      borderColor: '',
      value: '', // 下拉cos存储桶选择内容
      DetailData: '',
      ListCos: '', // 否--cos存储桶
      ListCosName: '',
      text: '仅支持大小写字母、数字、以及-_.的组合，不能超过40字符。',
      text1: '仅支持小写字母、数字的组合，不能超过40字符。',
      text2: '仅支持小写字母、数字的组合，不能超过40字符。',
      ruleForm: {
        radio: 1,
        COS: '',
        log_file: ''
      },
      rules: {
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
    let params = {
      auditNameList: this.$route.query.auditNameList
    }
    this.axios.post(GZJ_DETAILIST, params).then(({ data }) => {
      this.DetailData = data.auditList[0]
      if (this.DetailData.Status == 0) {
        this.off = false
      } else {
        this.off = true
      }
    })
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
        this.borderColor = '#F56C6C';
        this.text1 = '请输入cos存储库';
        this.color = '#F56C6C';
      } else if (!isYan1(this.ruleForm.COS)) {
        this.text1 = '仅支持小写字母、数字的组合，不能超过40字符。';
        this.color = '#F56C6C';
        this.borderColor = '#F56C6C';
      } else {
        for (var i = 0; i < this.ListCos.length; i++) {
          if (this.ruleForm.COS == this.ListCos[i].name) {
            this.text1 = '您已创建和拥有此存储桶';
            this.color = '#F56C6C';
            this.borderColor = '#F56C6C';
            return
          } else {
            this.text1 = '仅支持小写字母、数字的组合，不能超过40字符。';
            this.color = '#888';
            this.borderColor = '#67C23A';
          }
        }
      }
    },
    cosFocus () {
      if (this.text1 == '请输入cos存储库') {
        this.borderColor = '#F56C6C';
      } else if (
        this.color == '#F56C6C' &&
        this.text1 == '仅支持小写字母、数字的组合，不能超过40字符。'
      ) {
        this.borderColor = '#F56C6C';
      } else if (this.text1 == '您已创建和拥有此存储桶') {
        this.borderColor = '#F56C6C';
      } else {
        this.borderColor = '#2277da';
      }
    },
    submitForm () {
      let _CosBucketName, _IsMultiRegionAudit
      if (this.ruleForm.radio == 0) {
        _CosBucketName = this.value
        _IsMultiRegionAudit = 0
      } else {
        _CosBucketName = this.ruleForm.COS
        _IsMultiRegionAudit = 1
      }
      let params = {
        Name: this.DetailData.Name, // 跟踪集名称
        CosBucketName: _CosBucketName, // cos存储桶
        IsMultiRegionAudit: _IsMultiRegionAudit,
        CosKeyPrefix: this.ruleForm.log_file // 日志文件前缀
      }
      this.axios.post(GZJ_UPDATEAUDIT, params).then(data => {
        if (data.codeDesc == 'Success') {
          this.$router.go(0)
          this.$message({
            message: '更新成功',
            type: 'success'
          })
        }
      })
    },
    EmptyData () {
      this.ruleForm.COS = '';
      this.text1 = '仅支持小写字母、数字的组合，不能超过40字符。';
      this.color = '#888';
      this.borderColor = '#c0c4cc';
    },
    // 取消
    resetForm () {
      this.ShowBox = !this.ShowBox
      this.TextShow = true
      this.EmptyData()
    },
    // 编辑
    redact () {
      this.ShowBox = true
      this.TextShow = false
      this.EmptyData()
      this.ruleForm.log_file = '';
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
    },
    // 返回
    Back () {
      this.$router.push({
        path: '/cloudaudit-tranking'
      })
    },
    // 开启关闭--日志记录
    open () {
      let _data = {
        Name: this.DetailData.Name
      }
      if (this.off == false) {
        this.$confirm(
          '停止后，您无法再将日志文件收集到您的 COS 存储桶和日志组中。之前的日志文件仍可访问',
          '确定停止日志记录吗？',
          {
            confirmButtonText: '确定停止',
            cancelButtonText: '取消'
          }
        )
          .then(() => {
            this.axios.post(GZJ_STOPLOGGING, _data).then(({ data }) => {
              this.$router.push({
                path: '/cloudaudit-tranking'
              })
              this.$message({
                type: 'success',
                message: '关闭成功!'
              })
            })
          })
          .catch(() => {})
      } else {
        this.axios
          .post(GZJ_STRATLOGGING, _data)
          .then(data => {
            if (data.code != 0) {
              this.$message({
                type: 'error',
                message: data.message
              })
            }
          })
          .catch(error => {
            this.$message({
              type: 'error',
              message: '错误'
            })
          })
      }
    },
    // 删除
    Del () {
      let params = {
        Name: this.DetailData.Name
      }
      this.axios.post(GZJ_DELETE, params).then(({ data }) => {
        if (data == '') {
          this.$router.push({
            path: '/cloudaudit-tranking'
          })
          this.$message({
            message: '删除成功'
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.title_top {
  height: 50px;
  padding: 0 20px;
  background: #fff;
  display: flex;
  line-height: 50px;
  justify-content: space-between;
  .back {
    /deep/[class^="el-icon-"] {
      color: #006eff;
      line-height: 50px;
      font-size: 20px;
      font-weight: 600;
      margin-right: 24px;
    }
    & > span {
      color: #171d25;
      line-height: 50px;
      font-size: 16px;
      font-weight: 700;
    }
  }
  .off {
    /deep/.el-switch__label * {
      font-size: 12px;
      color: #000;
    }
    /deep/.el-switch.is-checked .el-switch__core {
      border-color: #006eff;
      background-color: #006eff;
    }
    /deep/.el-message-box--center .el-message-box__title {
      font-size: 18px;
      color: #171d25;
      vertical-align: middle;
      line-height: 36px;
      justify-content: flex-start;
      font-weight: 700;
    }
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
    .basic-b {
      & > p {
        font-size: 12px;
        color: #444;
        & > span:nth-of-type(1) {
          width: 144px;
          height: 30px;
          display: inline-block;
          color: #888;
        }
      }
    }
    .store {
      border-top: 1px solid #ddd;
      margin-top: 20px;
      padding-top: 20px;
      & > span {
        cursor: pointer;
        color: #006eff;
        font-size: 12px;
        margin-left: 10px;
      }
      :hover {
        text-decoration: underline;
      }
    }
    .hint {
      color: #888;
      font-size: 12px;
    }
    /deep/.el-form-item__label {
      font-size: 12px;
      text-align: left;
      line-height: 30px;
    }
    /deep/.el-input__inner {
      width: 180px;
      height: 30px;
      border-radius: 0px;
    }
    /deep/.el-form-item__content {
      line-height: 30px;
    }
    /deep/.el-form-item {
      margin-bottom: 10px;
    }
    /deep/.el-input__icon {
      height: 116%;
    }
  }
}

.del {
  margin-top: 20px;
  /deep/.el-button {
    height: 30px;
    min-width: 24px;
    padding: 0 20px;
    background-color: #006eff;
    color: #fff;
    border: 1px solid #006eff;
    line-height: 30px;
    font-size: 12px;
    border-radius: 0px;
  }
  /deep/.el-button:hover {
    background: #0063e5;
    border-color: #0063e5;
    color: #fff;
  }
  /deep/.el-button.is-plain:hover {
    background: #0063e5;
    border-color: #0063e5;
    color: #fff;
  }
}
</style>
