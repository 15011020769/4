<template>
  <div class="Deldomain">
    <el-dialog title="添加域名" :visible.sync="DelDialogVisible" :close-on-click-modal='false'
      :close-on-press-escape='false' :before-close="DelhandleCancel">

      <span slot="footer" class="dialog-footer">
        <el-button @click="DelhandleCancel">取 消</el-button>
        <el-button type="primary" @click="Deldomain">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    DEL_DOMAIN
  } from "@/constants";
  export default {
    name: "Deldoma",
    props: {
      DeldomainID: {
        required: true,
        type: String
      },
    },
    data() {
      return {

      }
    },
    methods: {
      DelhandleCancel() {
        this.$emit('DelhandleCancel', false)
      },
      Deldomain() {

      },
    },
  }

</script>
<style lang="scss" scope>

</style>
