<template>
  <div class="delete">
    <el-dialog :visible.sync="deleteShow.deleteState" width="29.68%" :show-close="false">
      <div class="title">
        <h3>提醒</h3>
        <a href="javascript:;" @click="cancel()">
          <i class="el-icon-close"></i>
        </a>
      </div>
      <div class="body">
        <p>确认删除安全组: {{deleteShow.deleteStateId.SecurityGroupName}} ({{deleteShow.deleteStateId.SecurityGroupId}})?</p>
      </div>
      <div class="footer">
        <el-button type="primary" @click="DeleteSure()">确 定</el-button>
        <el-button @click="cancel()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    deleteShow: {
      type: Object,
      default: () => []
    }
  },
  created() {},
  methods: {
    DeleteSure() {
      let params = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        SecurityGroupId: this.deleteShow.deleteStateId.SecurityGroupId
      };
      this.axios
        .post("vpc2/DeleteSecurityGroup", params)
        .then(data => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.$emit("getDataList");
          this.cancel();
        })
        .catch(error => {
          console.log(error);
        });
    },
    cancel() {
      this.$emit("close", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.delete {
  ::v-deep .el-dialog__header {
    padding: 0px;
  }
  ::v-deep .el-dialog__body {
    padding: 0px;
  }
  ::v-deep .el-dialog__footer {
    padding: 0px;
  }
  ::v-deep .el-dialog {
    padding: 20px;
  }
  .title {
    height: 26px;
    line-height: 26px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    & > h3 {
      color: #000;
      font-size: 14px;
      font-weight: 700;
    }
    & > a {
      display: inline-block;
      height: 26px;
      width: 26px;
      text-align: center;
      line-height: 26px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      & > i {
        color: #888;
        font-size: 18px;
        line-height: 26px;
      }
    }
  }
  .body {
    height: 72px;
    font-size: 12px;
    line-height: 72px;
  }
  .footer {
    display: flex;
    justify-content: center;
    margin-top: 27px;
    /* 确定--取消按钮 */
    .el-button {
      width: 66px !important;
      padding: 0px;
      height: 30px;
      border-radius: 0px;
    }
    .el-button--primary {
      background: #006eff;
      border-color: #006eff !important;
    }
  }
}
</style>

