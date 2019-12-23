<template>
  <div class="Deldomain">
    <el-dialog title="推流域名" :visible.sync="EnableDialogVisible" :close-on-click-modal='false'
      :close-on-press-escape='false' :before-close="EnablehandleCancel">
      <P>确定启用推流域名:{{DomainName}}</P>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EnablehandleCancel">取 消</el-button>
        <el-button type="primary" @click="Enabledomain">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    ENABLE_DOMAIN
  } from "@/constants";
  export default {
    name: "Enabledomain",
    props: {
      DomainName: {
        required: false,
        type: String
      },
      EnableDialogVisible: {
        required: false,
        type: Boolean
      },
    },
    data() {
      return {

      }
    },
    methods: {
      EnablehandleCancel() {
        this.$emit('EnablehandleCancel', false)
      },
      Enabledomain() {
        const param = {
          Version: '2018-08-01',
          DomainName: this.DomainName,
        };
        this.axios.post(ENABLE_DOMAIN, param).then(data => {
          if (data.Response.Error == undefined) {
            this.$message({
              message: '启用域名成功',
              type: 'success'
            });
            this.$emit('EnablehandleCancel', false)
            this.$parent.getDATA();
          } else {
            this.$message.error(data.Response.Error.Message);
          }
        });
      },
    },
  }

</script>
<style lang="scss" scope>

</style>
