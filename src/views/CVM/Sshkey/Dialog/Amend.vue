<template>
  <div class="amend">
    <el-dialog :visible.sync="amendObj.amendShow" :show-close='false'>
      <div slot="title" class="title-wrap">
        <span>修改密钥</span>
        <i class="el-icon-close" @click="close"></i>
      </div>
      <el-form :model="form" :rules="rules" ref="ruleForm" label-position="left" label-width="120px">
        <el-form-item label="密钥名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入内容" class="input-width"></el-input>
          <p class="p-hint">只支持英文大小写、数字和下划线</p>
        </el-form-item>
        <el-form-item label="密钥描述" prop="desc">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    amendObj: {
      type: Object,
      default: () => []
    }
  },
  data () {
    var nameRule = (rule, value, callback) => {
      var regExp = /^(\w)+$/
      if (!value) {
        callback(new Error('请输入密钥名称'))
      } else if (regExp.test(value)) {
        callback()
      } else {
        callback(new Error('秘钥名称不符合规则'))
      }
    }
    return {
      form: {
        name: this.amendObj.sshKeyInfo.KeyName,
        desc: this.amendObj.sshKeyInfo.Description
      },
      rules: {
        name: [
          { validator: nameRule, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {

  },
  methods: {

    // 提交
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var params = {
            'Version': '2017-03-12',
            'Region': this.$cookie.get('regionv2'),
            'KeyId': this.amendObj.sshKeyInfo.KeyId,
            'KeyName': this.form.name,
            'Description': this.form.desc
          }
          this.axios
            .post('cvm2/ModifyKeyPairAttribute', params)
            .then(data => {
              this.$parent.getDataList() // 请求父组件的列表
              this.$emit('amendShowVal', false)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 关闭模态框
    close () {
      this.$emit('amendShowVal', false)
    }
  }

}
</script>

<style lang='scss' scoped>
.amend {
  .title-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    span {
      font-weight: bolder;
    }
    i {
      font-size: 16px;
      font-weight: 900;
      cursor: pointer;
    }
  }
  .input-width {
    width: 260px;
  }
  .p-hint {
    color: #a2a2a2;
  }
  .dialog-footer {
    display: block;
    text-align: center;
  }
}
</style>
