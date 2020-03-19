<template>
  <div class="Deldomain">
    <el-dialog
      title="刪除截圖鑑黃配置"
      :visible="modalVisible"
      :before-close="handleClose"
    >
      <P>{{ `確定刪除配置  ${domainName}` }}</P>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="$parent._delete()">{{$t('CSS.domainManagement.43')}}</el-button>
        <el-button @click="$emit('update:modalVisible', false)"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    modalVisible: {
      required: true,
      type: Boolean
    },
    domainName: {
      required: false,
      type: String,
      default: ''
    }
  },
  methods: {
    handleClose (done) {
      this.$emit('update:modalVisible', false)
      done()
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  width: 100%;
  text-align: center;
  display: inline-block;
}
</style>
