<template>
  <div class="Deldomain">
    <el-dialog title="推流域名" :visible.sync="ProhibitDialogVisible" :close-on-click-modal='false'
      :close-on-press-escape='false' :before-close="ProhibithandleCancel">
      <P>确定禁用推流域名:{{DomainName}}</P>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ProhibithandleCancel">取 消</el-button>
        <el-button type="primary" @click="Prohibitdomain">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    PROHIBIT_DOMAIN
  } from "@/constants";
  export default {
    name: "Prohibitdom",
    props: {
      DomainName: {
        required: false,
        type: String
      },
      ProhibitDialogVisible: {
        required: false,
        type: Boolean
      },
    },
    data() {
      return {

      }
    },
    methods: {
      ProhibithandleCancel() {
        this.$emit('ProhibithandleCancel', false)
      },
      Prohibitdomain() {
        const param = {
          Version: '2018-08-01',
          DomainName: this.DomainName,
        };
        this.axios.post(PROHIBIT_DOMAIN, param).then(data => {
          if (data.Response.Error == undefined) {
            this.$message({
              message: '禁用域名成功',
              type: 'success'
            });
            this.$emit('ProhibithandleCancel', false)
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
