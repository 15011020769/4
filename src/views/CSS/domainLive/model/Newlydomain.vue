<template>
  <div>
    <el-dialog title="添加域名" :visible.sync="AddDialogVisible" :close-on-click-modal='false'
      :close-on-press-escape='false' :before-close="handleCancel">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    name: "Addto",
    props: {
      AddDialogVisible: {
        required: false,
        type: Boolean
      },
    },
    data() {
      return {

      }
    },
    watch: {

    },
    methods: {
      handleCancel() {
        this.$emit('handleCancel', false)
      },
      // 点击弹框下的确定
      handleConfirm() {
        this.$emit('handleCancel', false)
      },
    },
  }

</script>
<style lang="scss" scope>

</style>
