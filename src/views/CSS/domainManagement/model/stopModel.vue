<template>
  <div>
    <div>
      <el-dialog
        title="禁用域名"
        :visible.sync="addDominModel"
        width="45%"
        :before-close="handleClose"
      >
        <div>
          <span class="tip">確定禁用：{{ getCon }}?</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="stopDominSure">確 定</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isShow: Boolean,
    con: String
  },
  computed: {
    addDominModel () {
      // console.log(this.isShow);
      this.dialogmodel = this.isShow
      return this.isShow
    },
    getCon () {
      return this.con
    }
  },
  data () {
    return {
      dialogmodel: '' // 弹框
    }
  },
  methods: {
    // 关闭弹框
    handleClose () {
      this.dialogmodel = false
      this.$emit('closeStopDominModel', false)
    },
    // 禁用域名确定按钮
    stopDominSure () {
      this.dialogmodel = false
      this.$emit('closeStopDominModel', true)
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
