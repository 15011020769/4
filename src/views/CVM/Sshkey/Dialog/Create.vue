<template>
  <div class="create">
    <el-dialog :visible.sync="createObj.createShow" :show-close='false'>
      <div slot="title" class="title-wrap">
        <span>创建SSH密钥</span>
        <i class="el-icon-close" @click="close"></i>
      </div>
      <el-form :model="form" :rules="rules" :hide-required-asterisk="parm" ref="ruleForm" label-position="left" label-width="120px">
        <el-form-item label="创建方式">
          <el-radio v-model="form.radio" label="1">创建新密钥对</el-radio>
          <el-radio v-model="form.radio" label="2" disabled>使用已有公钥(暂未开放)</el-radio>
        </el-form-item>
        <el-form-item label="密钥名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入内容" class="input-width"></el-input>
          <p class="p-hint">只支持英文大小写、数字和下划线</p>
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
    createObj: {
      type: Object,
      default: () => []
    },
    projectId: [String, Number]
  },
  data() {
    var nameRule = (rule, value, callback) => {
      var regExp = /^(\w)+$/
      if (!value) {
        callback(new Error('请输入密钥名称'));
      }else if (regExp.test(value)) {
        callback()
      } else {
        callback(new Error('秘钥名称不符合规则'))
      }
    };
    return {
      parm: false,
      form: {
        radio: '1',
        name: ''
      },
      rules: {
        name: [
          { validator: nameRule, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {

    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var params = {
            'Version': '2017-03-12',
            'Region': this.$cookie.get('regionv2'),
            'KeyName': this.form.name
          }
          if (this.projectId === '') {
            params.ProjectId = 0
          } else {
            params.ProjectId = Number(this.projectId)
          }
          this.axios
            .post("cvm2/CreateKeyPair", params)
            .then(data => {
              this.$parent.getDataList()      // 请求父组件的列表
              this.$emit('createShowVal', false);
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    // 关闭模态框
    close() {
      this.$emit('createShowVal', false);
    }
  }

};
</script>

<style lang='scss' scoped>
.create {
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
