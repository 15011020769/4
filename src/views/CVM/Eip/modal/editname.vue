<template>
  <div class="renew">
    <el-dialog :visible.sync="editObj.editShow" :show-close="false" width="45%">
      <div slot="title" class="title-wrap">
        <span>改名</span>
        <i class="el-icon-close" @click="close"></i>
      </div>
      <div class="content">
        <div>
          <el-form
            :model="form"
            :rules="rules"
            ref="ruleForm"
            label-position="left"
            label-width="120px"
          >
            <el-form-item label="新名称" prop="name">
              <el-input v-model="form.name"  class="input-width"></el-input>
              <p class="p-hint">还可以输入60个字符</p>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="submitForm('ruleForm')">确定</el-button>
          <el-button size="mini" @click="handleCancel">取消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      basic: true,
      form: {
        name: this.editObj.shotInfo.AddressName
      },
      rules: {
        name: [
          { required: true, message: '请输入快照名称', trigger: 'blur' }
        ]
      },
      currentIndex: 0
    }
  },
  props: {
    editObj: {
      type: Object,
      default: () => []
    },
    editShow: Boolean
  },
  create () {
    // console.log(this.editObj)
  },
  methods: {
    tableRowStyle ({ row, rowIndex }) {
      return {
        'font-size': '12px'
      }
    },
    handlePack () {
      this.basic = !this.basic
    },
    // 提交
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var params = {
            'Version': '2017-03-12',
            'Region': this.$cookie.get('regionv2'),
            'AddressId': this.editObj.shotInfo.AddressId,
            'AddressName': this.form.name
          }
          this.axios
            .post('vpc2/ModifyAddressAttribute', params)
            .then(data => {
              this.$parent.getDataList() // 请求父组件的列表
              this.$emit('editShowVal', false)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 关闭模态框
    close () {
      this.$emit('editShowVal', false)
    },
    handleCancel () {
      this.$emit('editShowVal', false)
    },
    handleCheck (index) {
      this.currentIndex = index
      if (this.currentIndex <= 2) {
      }
    }
  },
  components: {},
  mounted () {}
}
</script>
<style lang="scss" scoped>
.renew {
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
    }
  }
  .content {
    font-size: 12px;
    .packdown {
      color: #006eff;
    }
    .table {
      border: 1px solid #eee;
      border-bottom: none;
      margin-bottom: 20px;
    }
    .title-Num {
      margin-top: 20px;
      .title-left {
        display: inline-block;
        width: 100px;
      }
    }
    .dialog-footer {
      display: block;
      text-align: center;
      padding-top: 10px;
    }
  }
  .input-width{
    width: 200px;
    height: 30px;
  }
}
</style>
