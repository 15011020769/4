<template>
  <div class="unsharing">
    <el-dialog :visible.sync="unsharingVal.unsharing" width="35%" :show-close="false">
      <div class="title">
        <h3>取消共享</h3>
        <a href="javascript:;" @click="cancel()">
          <i class="el-icon-close"></i>
        </a>
      </div>
      <div class="body">
        <span>
          <i class="el-icon-warning"></i>
        </span>
        <p>确定取消共享？</p>
      </div>
      <div class="footer">
        <el-button type="primary" @click="unSharing()">确 定</el-button>
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
    unsharingVal: {
      type: Object,
      default: () => []
    }
  },
  methods: {
    unSharing() {
      let param = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        ImageId: this.unsharingVal.unsharingId,
        Permission: "CANCEL"
      };
      if (this.unsharingVal.selection.length !== undefined) {
        for (var i in this.unsharingVal.selection) {
          param["AccountIds." + i] = this.unsharingVal.selection[i].AccountId;
        }
      }else{
        param["AccountIds.0"] = this.unsharingVal.selection.AccountId;
      }
      console.log(param);
      this.axios
        .post("cvm2/ModifyImageSharePermission", param)
        .then(data => {
          this.$message({
            message: "取消成功",
            type: "success"
          });
          this.$emit("MirrorSharing");
          this.cancel();
        })
        .catch(error => {
          this.$message({
            message: error,
            type: "error"
          });
        });
    },
    cancel() {
      this.$emit("close", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.unsharing {
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
      color: #333;
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
    display: flex;
    justify-content: flex-start;
    height: 74px;
    line-height: 74px;
    margin-bottom: 27px;
    & > span {
      width: 74px;
      text-align: center;
      margin-right: 10px;
      & > i {
        line-height: 74px;
        font-size: 66px;
        color: #e54545;
      }
    }
    & > p {
      color: #171d25;
      font-size: 16px;
      margin-top: -8px;
      font-weight: 700;
    }
  }
  .footer {
    display: flex;
    justify-content: center;
    /* 确定--取消按钮 */
    .el-button {
      width: 66px;
      padding: 0px;
      height: 30px;
      border-radius: 0px;
    }
    .el-button--primary {
      background: #006eff;
      border-color: #006eff;
    }
  }
}
</style>

