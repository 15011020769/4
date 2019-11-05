<template>
  <div class="share">
    <el-dialog :visible.sync="shareShow.shareState" width="43.93%" :show-close="false">
      <div class="title">
        <h3>共享镜像</h3>
        <a href="javascript:;" @click="cancel()">
          <i class="el-icon-close"></i>
        </a>
      </div>
      <div class="body">
        <div class="tips">您可以通过对端账号唯一ID将此镜像共享给其他用户，每个自定义镜像最多可以共享给50个帐号。</div>
        <ul>
          <li>
            <p>对端账号唯一ID</p>
            <div>
              <div class="input-box">
                <el-input v-model="inputVal" placeholder="请输入对方对端账号唯一ID" @blur="InputChange()"></el-input>
                <span v-if="inputRule">{{inputTips}}</span>
              </div>
              <el-tooltip
                class="item"
                effect="light"
                content="在用户中心的个人信息中查看,点击查看操作指南"
                placement="bottom"
              >
                <i class="el-icon-info"></i>
              </el-tooltip>
            </div>
          </li>
          <li>
            <p>已用限额</p>
            <p>{{shareShow.norm.length}}/50</p>
          </li>
        </ul>
      </div>
      <div class="footer">
        <el-button type="info" plain disabled v-if="inputRule === true">共 享</el-button>
        <el-button type="primary" v-if="inputRule === false" @click="ShareBtn()">共 享</el-button>
        <el-button @click="cancel()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      inputVal: "",
      inputTips: "",
      inputRule: false
    };
  },
  props: {
    shareShow: {
      type: Object,
      default: () => []
    }
  },
  methods: {
    InputChange() {
      let qqPattern = /^[1-9][0-9]{4,11}$/;
      if (this.inputVal === "") {
        this.inputRule = true;
        this.inputTips = "不能为空";
        return;
      } else if (!qqPattern.test(this.inputVal)) {
        this.inputRule = true;
        this.inputTips = "QQ号码格式不正确";
        return;
      } else {
        this.inputRule = false;
      }
    },
    // 共享
    ShareBtn() {
      let param = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        ImageId: this.shareShow.shareStateId,
        "AccountIds.0": this.inputVal,
        Permission: "SHARE"
      };
      this.axios
        .post("cvm2/ModifyImageSharePermission", param)
        .then(data => {
          if (data.Response.Error === undefined) {
            this.$message({
              message: "共享成功",
              type: "success"
            });
            this.$emit("MirrorSharing");
            this.cancel();
          } else {
            if (
              data.Response.Error.Message.substring(
                data.Response.Error.Message.length - 6
              ) === "found."
            ) {
              this.inputRule = true;
              this.inputTips = "账号 `" + this.inputVal + "` 不存在";
            } else if (
              data.Response.Error.Message.substring(
                data.Response.Error.Message.length - 6
              ) === "count."
            ) {
              this.inputRule = true;
              this.inputTips =
                "账号` " + this.inputVal + "` 为协作者，请填写主账号";
            } else if (
              data.Response.Error.Message.substring(
                data.Response.Error.Message.length - 6
              ) === "xists."
            ) {
              this.inputRule = true;
              this.inputTips = "账号` " + this.inputVal + "` 已存在";
            } else {
              this.inputRule = false;
            }
          }
        })
        .catch(error => {
          this.$message({
            message: error,
            type: "error"
          });
        });
    },
    // 取消
    cancel() {
      this.$emit("close", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.share {
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
    .tips {
      font-size: 12px;
      padding: 10px 30px 10px 20px;
      color: #003b80;
      border: 1px solid #97c7ff;
      background: #e5f0ff;
      line-height: 20px;
    }
    & > ul {
      margin-top: 16px;
      margin-bottom: 11px;
      li {
        display: flex;
        justify-content: flex-start;
        padding-bottom: 16px;
        & > p {
          display: flex;
          font-size: 12px;
          height: 30px;
          line-height: 30px;
          &:nth-of-type(1) {
            width: 104px;
            color: #888;
          }
          &:nth-of-type(2) {
            color: #000;
          }
        }
        & > div {
          display: flex;
          .input-box {
            width: 180px;
            font-size: 12px;
            height: 30px;
            color: red;
            position: relative;
            /* 输入框 */
            ::v-deep .el-input__inner {
              border-radius: 0px;
              height: 30px;
              width: 180px;
            }
            ::v-deep .el-input__inner {
              font-size: 12px;
            }
            & > span {
              display: inline-block;
              min-width: 300px;
              position: absolute;
              top: 30px;
              left: 0px;
            }
          }
          & > i {
            color: #888;
            line-height: 30px;
            margin-left: 5px;
            font-size: 14px;
          }
        }
      }
    }
  }
  .footer {
    display: flex;
    justify-content: center;
    /* 共享--取消按钮 */
    .el-button {
      width: 66px !important;
      height: 30px !important;
      line-height: 30px;
      text-align: center;
      border-radius: 0px;
      padding: 0px !important;
    }
    .el-button--primary {
      background: #006eff;
      border: 0;
      height: 30px;
      line-height: 30px;
      text-align: center;
      width: 66px !important;
    }
  }
}
</style>

