<template>
  <div>
    <div class="title_top">
      <div class="back">
        <i class="el-icon-back" @click="Back()"></i>
        <span>{{ DetailData.AuditName }}</span>
      </div>
      <div class="off">
        <el-switch v-model="off" inactive-text="日志记录" @click.native="open()"></el-switch>
      </div>
    </div>
    <div class="tea-content__body">
      <div class="form">
        <div class="form-box">
          <p class="basic">基础信息</p>
          <div class="basic-b">
            <p>
              <span>跟踪集名称</span>
              <span>{{ DetailData.AuditName }}</span>
            </p>
            <p>
              <span>跟踪所有区域</span>
              <span v-if="DetailData.AuditStatus == 1">是</span>
              <span v-if="DetailData.AuditStatus == 0">否</span>
            </p>
          </div>
        </div>
        <div class="form-box">
          <p class="basic store">
            管理事件
            <span @click="edit()">编辑</span>
          </p>

          <div class="basic-b" v-if="editShow">
            <p>
              <span>管理事件</span>
              <span v-if="DetailData.ReadWriteAttribute == 1">只读</span>
              <span v-if="DetailData.ReadWriteAttribute == 2">只写</span>
              <span v-if="DetailData.ReadWriteAttribute == 3">全部</span>
            </p>
          </div>
          <div class="basic-b" v-if="!editShow">
            <p>
              <span>管理事件</span>
              <el-radio-group v-model="editradio">
                <el-radio :label="3">全部</el-radio>
                <el-radio :label="1">只读</el-radio>
                <el-radio :label="2">只写</el-radio>
              </el-radio-group>
            </p>
            <div>
              <el-button type="primary" @click="editSave()">保存</el-button>
              <el-button @click="editClose()">取消</el-button>
            </div>
          </div>
        </div>
        <div class="form-box">
          <p class="basic store">
            存储位置
            <span @click="redact()">编辑</span>
          </p>
          <div class="basic-b" v-if="TextShow">
            <p>
              <span>COS 存储桶</span>
              <span>地域： {{ DetailData.CosRegion }}</span> &nbsp; &nbsp;
              <span>名称： {{ DetailData.CosBucketName }}</span>
            </p>
            <p>
              <span>日志文件前缀</span>
              <span>{{ DetailData.LogFilePrefix }}</span>
            </p>
            <p>
              <span>发送CMQ通知</span>
              <span v-if="DetailData.IsEnableCmqNotify == 1">是</span>
              <span v-if="DetailData.IsEnableCmqNotify == 0">否</span>
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
            <el-form-item label="cos存储桶" v-if="YesShow">
              <div>
                <select name="" id="" class="select-1">
                  <option value="">中国台北</option>
                </select>
                <input
                  type="text"
                  v-model="ruleForm.COS"
                  placeholder="请输入Bucket名称"
                  @blur="cosBlur()"
                  @focus="cosFocus()"
                  class="input-1"
                  :style="{ 'border-color': borderColor }"
                />
                <p class="hint" :style="{ color: color }">{{ text1 }}</p>
              </div>
            </el-form-item>
            <el-form-item label="cos存储桶" v-if="NoShow">
              <el-select v-model="value" v-if="select">
                <el-option label="暂无可用cos存储桶"></el-option>
              </el-select>
              <el-select v-model="value" v-if="!select">
                <el-option
                  v-for="(item, index) in ListCos"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <span>添加 <a @click="setClick()">高级设置</a></span>
            </el-form-item>
            <div class="setShow" v-if="setShow">
              <el-form-item label="日志文件前缀" prop="log_file">
                <el-input
                  v-model="ruleForm.log_file"
                  placeholder="请输入日志文件前缀"
                  style="width:200px"
                ></el-input>
                <p class="hint">{{ text2 }}</p>
              </el-form-item>
              <el-form-item label="发送CMQ通知">
                <el-radio-group v-model="ruleForm.radio2">
                  <el-radio :label="1" @change="sendYes()">是</el-radio>
                  <el-radio :label="0" @change="sendNo()">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="creatCMQ" v-if="creatCMQ">
              <el-form-item label="创建CMQ队列">
                <el-radio-group v-model="ruleForm.radio3">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="CMQ队列名称">
                <div>
                  <input
                    type="text"
                    v-model="ruleForm.CMQ"
                    placeholder="请输入CMQ队列名称"
                    class="input-1"
                    :style="{ 'border-color': borderColor }"
                  />
                  <p class="hint" :style="{ color: color }">{{ text1 }}</p>
                </div>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button type="primary" @click="submitForm()">保存</el-button>
              <el-button @click="resetForm()">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="del">
        <el-button :plain="true" @click="Del()">删除</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { isYan, isYan1 } from '@/utils/validate'
import {
  GZJ_DETAILIST,
  GZJ_DELETE,
  GZJ_STOPLOGGING,
  GZJ_STRATLOGGING,
  GZJ_UPDATEAUDIT,
  LIST_COSBUCKETS
} from '@/constants'
export default {
  data () {
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
      AuditName: '',
      YesShow: true,
      NoShow: false,
      ShowBox: false,
      TextShow: true,
      editShow: true, // 管理事件的编辑 显示与隐藏
      editradio: 3,
      setShow: true, // 高级设置 显示与隐藏
      creatCMQ: false, // 创建cmq的显示与隐藏
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
        radio2: 0,
        COS: '',
        log_file: '',
        CMQ: ''
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
      Version: '2019-03-19',
      Region: 'ap-guangzhou',
      AuditName: this.$route.query.AuditName
    }
    this.axios.post(GZJ_DETAILIST, params).then(data => {
      console.log(data.Response)
      this.DetailData = data.Response
      // this.ResList = data.Response
      // for (var i = 0; i < this.ResList.length; i++) {
      //   this.ListCosName = this.ResList[i].Name
      // }
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
    submitForm () {
      let CosBucketName, IsCreateNewBucket
      if (this.ruleForm.radio == 0) {
        CosBucketName = this.value
        IsCreateNewBucket = 0
      } else {
        CosBucketName = this.ruleForm.COS
        IsCreateNewBucket = 1
      }
      let params = {
        // Name: this.DetailData.Name, // 跟踪集名称
        // CosBucketName: _CosBucketName, // cos存储桶
        // IsEnableCmqNotify: _IsEnableCmqNotify,
        // CosKeyPrefix: this.ruleForm.log_file // 日志文件前缀
        Version: '2019-03-19',
        Region: 'ap-guangzhou',
        AuditName: this.$route.query.AuditName,
        LogFilePrefix: this.ruleForm.log_file
      }
      this.axios.post(GZJ_UPDATEAUDIT, params).then(data => {
        console.log(data)
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
      this.ruleForm.COS = ''
      this.text1 = '仅支持小写字母、数字的组合，不能超过40字符。'
      this.color = '#888'
      this.borderColor = '#c0c4cc'
    },
    // 取消
    resetForm () {
      this.ShowBox = !this.ShowBox
      this.TextShow = true
      this.EmptyData()
    },
    editClose () {
      this.editShow = true
    },
    // 编辑
    edit () {
      this.editShow = false
    },
    editSave () {
      // let ReadWriteAttribute = this.editradio
      console.log(this.editradio)
      let params = {
        Version: '2019-03-19',
        Region: 'ap-guangzhou',
        AuditName: this.$route.query.AuditName,
        ReadWriteAttribute: this.editradio
      }
      this.axios.post(GZJ_UPDATEAUDIT, params).then(data => {
        console.log(data)
        // if (data.codeDesc == 'Success') {
        //   this.$router.go(0)
        //   this.$message({
        //     message: '更新成功',
        //     type: 'success'
        //   })
        // }
      })
    },
    redact () {
      this.ShowBox = true
      this.TextShow = false
      this.EmptyData()
      this.ruleForm.log_file = ''
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
    setClick () {
      this.setShow = !this.setShow
      this.creatCMQ = false
    },
    sendYes () {
      this.creatCMQ = true
    },
    sendNo () {
      this.creatCMQ = false
    },
    // 返回
    Back () {
      this.$router.push({
        path: '/Audit'
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
        AuditName: this.$route.query.AuditName,
        Version: '2019-03-19',
        Region: 'ap-guangzhou'
      }
      this.axios.post(GZJ_DELETE, params).then(data => {
        console.log(data)
        if (data == '') {
          this.$router.push({
            path: '/Audit'
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
    [class^='el-icon-'] {
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
    .el-switch__label * {
      font-size: 12px;
      color: #000;
    }
    .el-switch.is-checked .el-switch__core {
      border-color: #006eff;
      background-color: #006eff;
    }
    .el-message-box--center .el-message-box__title {
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
    .form-box {
      padding: 15px;
      background: #fff;
      margin-bottom: 20px;
      .input-1 {
        height: 27px;
        border: 1px solid;
        padding-left: 5px;
      }
      .select-1 {
        height: 27px;
        margin-right: 10px;
      }
    }
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
      & > span {
        float: right;
        color: #006eff;
        font-size: 12px;
        margin-left: 10px;
        cursor: pointer;
      }
      :hover {
        text-decoration: underline;
      }
    }
    .hint {
      color: #888;
      font-size: 12px;
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
      margin-bottom: 10px;
    }
    .el-input__icon {
      height: 116%;
    }
  }
}

.del {
  margin-top: 20px;
  .el-button {
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
  .el-button:hover {
    background: #0063e5;
    border-color: #0063e5;
    color: #fff;
  }
  .el-button.is-plain:hover {
    background: #0063e5;
    border-color: #0063e5;
    color: #fff;
  }
}
</style>
