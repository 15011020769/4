<template>
  <div class="unsharing">
    <el-dialog :visible.sync="deleteShow.deleteState" width="35%" :show-close="false">
      <div class="title">
        <h3>删除镜像</h3>
        <a href="javascript:;" @click="cancel()">
          <i class="el-icon-close"></i>
        </a>
      </div>
      <div class="body">
        <span>
          <i class="el-icon-warning"></i>
        </span>
        <p>确定删除选中的镜像？</p>
      </div>
      <div class="footer">
        <el-button type="primary" @click="SureBtn()">确 定</el-button>
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
  methods: {
    SureBtn() {
      let param = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2")
      };
      if (this.deleteShow.deleteStateId.length !== undefined) {
        for (var i in this.deleteShow.deleteStateId) {
          param["ImageIds." + i] = this.deleteShow.deleteStateId[i].ImageId;
        }
      }else{
        param["ImageIds.0"] = this.deleteShow.deleteStateId.ImageId;
      }
      console.log(param);
      this.axios
        .post("cvm2/DeleteImages", param)
        .then(data => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.$emit("getDataList");
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

