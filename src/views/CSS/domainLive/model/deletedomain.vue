<template>
  <div class="Deldomain">
    <el-dialog
      title="推流域名"
      :visible.sync="DelDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="DelhandleCancel"
    >
      <P>确定删除推流域名:{{ DomainName }}</P>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DelhandleCancel">取 消</el-button>
        <el-button type="primary" @click="Deldomain">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { DEL_DOMAIN } from "@/constants";
export default {
  name: "Deldoma",
  props: {
    DomainName: {
      required: false,
      type: String
    },
    DomainType: {
      required: false,
      type: [String, Number]
    },
    DelDialogVisible: {
      required: false,
      type: Boolean
    }
  },
  data() {
    return {};
  },
  methods: {
    DelhandleCancel() {
      this.$emit("DelhandleCancel", false);
    },
    Deldomain() {
      const param = {
        Version: "2018-08-01",
        DomainName: this.DomainName,
        DomainType: this.DomainType
      };
      this.axios.post(DEL_DOMAIN, param).then(data => {
        if (data.Response.Error == undefined) {
          this.$message({
            message: "删除域名成功",
            type: "success"
          });
          this.$emit("DelhandleCancel", false);
          this.$parent.getDATA();
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(CSSErrorTips, ErrTips);
          this.$message({
            type: "error",
            message: ErrOr[data.Response.Error.Code],
            showClose: true,
            duration: 0
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scope>
</style>
