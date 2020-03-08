<template>
  <div class="Deldomain">
    <el-dialog title="刪除錄製配置" :visible="modalVisible">
      <P>{{`確定刪除配置  ${domainName}`}}</P>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="$parent._delete()">確 定</el-button>
        <el-button @click="$emit('update:modalVisible', false)">取 消</el-button>
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
  }
}
</script>

<style>

</style>
