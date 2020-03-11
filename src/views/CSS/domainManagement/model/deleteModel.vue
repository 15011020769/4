<template>
  <div>
    <div>
      <el-dialog
        title="删除域名"
        :visible.sync="addDominModel"
        width="45%"
        :before-close="handleClosede"
      >
        <div>
          <span class="tip">確定删除：{{ getCon[0] }}?</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="deleteDominSure">確 定</el-button>
          <el-button @click="handleClosede">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { DEL_DOMAIN } from '@/constants'
export default {
  props: {
    isShow: Boolean,
    con: Array
  },
  computed: {
    addDominModel () {
    //   console.log(this.isShow);
      this.dialogmodel1 = this.isShow
      return this.isShow
    },
    getCon () {
      return this.con
    }
  },
  data () {
    return {
      dialogmodel1: '' // 弹框
    }
  },
  methods: {
    // 关闭弹框
    handleClosede () {
      this.dialogmodel1 = false
      this.$emit('closedeleteDominModel', this.dialogmodel1)
    },
    // 删除域名确定按钮
    deleteDominSure () {
      const param = {
        Version: '2018-08-01',
        DomainName: this.getCon[0],
        DomainType: this.getCon[1]
      }
      this.axios.post(DEL_DOMAIN, param).then(data => {
        if (data.Response.Error == undefined) {
          this.$message({
            message: '删除域名成功',
            type: 'success'
          })
          this.$emit('DelhandleCancel', false)
          this.$parent.describeLiveDomains()
        } else {
          this.$message.error(data.Response.Error.Message)
        }
      })
      this.dialogmodel1 = false
      this.$emit('closedeleteDominModel', this.dialogmodel1)
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after {
  display: block;
  content: "";
  clear: both;
}
::v-deep .el-dialog__title {
  font-size: 14px;
  font-weight: 600;
}
::v-deep .el-dialog__footer {
  text-align: center;
}
.tip {
  font-size: 12px;
  color: #000;
  font-weight: 600;
}
</style>
