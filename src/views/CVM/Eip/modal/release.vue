<template>
  <div class="renew">
    <el-dialog :visible.sync="eipObj.eipShow" :show-close="false" width="45%">
      <div slot="title" class="title-wrap">
        <span>释放弹性公网IP</span>
        <i class="el-icon-close" @click="handleCancel"></i>
      </div>
      <div class="content">
        <div class="p-desc">
          <p>确定将该弹性公网IP:{{eipObj.eipInfo.AddressId}}
            (<span v-if="eipObj.eipInfo.AddressName">{{eipObj.eipInfo.AddressName}} </span>
            <span v-if="!eipObj.eipInfo.AddressName">未命名 </span>)释放？</p>
        </div>
        <div>
          <el-form
            :model="form"
            :rules="rules"
            ref="ruleForm"
            label-position="left"
            label-width="120px"
          >
            <el-form-item label="确认IP" prop="name">
              <el-input v-model="form.name"  class="input-width" placeholder="请输入IP地址，确认释放"></el-input>
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
        // name: this.eipInfo.AddressIp
      },
      rules: {
        name: [
          { required: true, message: '请输入ip', trigger: 'blur' }
        ]
      },
      currentIndex: 0
    }
  },
  props: {
    eipObj: {
      type: Object,
      default: () => []
    }
  },
  created () {
    // console.log(this.eipObj.eipInfo.AddressIp)
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
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var params = {
            'Version': '2017-03-12',
            'Region': this.$cookie.get('regionv2'),
            'AddressIds.0': this.eipObj.eipInfo.AddressId
          }
          this.axios
            .post('vpc2/ReleaseAddresses', params)
            .then(data => {
              console.log(data)
              setTimeout(() => {
                this.$parent.getDataList() // 请求父组件的列表
              }, 1000)
              this.$emit('eipShowVal', false)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleCancel () {
      this.$emit('eipShowVal', false)
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
    .p-desc {
      font-size: 12px;
      line-height: inherit;
      padding: 10px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      background: #e5f0ff;
      margin-bottom: 20px;
    }
    .dialog-footer {
      display: block;
      text-align: center;
      padding-top: 10px;
    }
  }
}
</style>
