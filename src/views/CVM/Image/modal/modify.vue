<template>
  <div class="modify">
    <el-dialog :visible.sync="modifyShow.modifyState" width="44%" :show-close="false">
      <div class="title">
        <h3>修改镜像</h3>
        <a href="javascript:;" @click="cancel()">
          <i class="el-icon-close"></i>
        </a>
      </div>
      <div class="body">
        <ul>
          <li>
            <span>镜像ID:</span>
            <span>{{modifyShow.modifyStateId.ImageId}}</span>
          </li>
          <li>
            <span>镜像名称:</span>
            <div>
              <input type="text" v-model="ImageName" @blur="InputLength()" maxlength="20" />
              <span>{{textTips}}</span>
              <p>只支持字母、数字、连接符号，你还可以输入{{numLength}}个字符</p>
            </div>
          </li>
          <li>
            <span>镜像描述:</span>
            <textarea v-model="textarea" maxlength="60"></textarea>
          </li>
        </ul>
      </div>
      <div class="footer">
        <el-button type="primary" @click="modifySure()">确 定</el-button>
        <el-button @click="cancel()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ImageName: "",
      textarea: "",
      textTips: "",
      numLength: ""
    };
  },
  props: {
    modifyShow: {
      type: Object,
      default: () => []
    }
  },
  created() {
    this.ImageName = this.modifyShow.modifyStateId.ImageName;
    this.textarea = this.modifyShow.modifyStateId.ImageDescription;
    this.InputLength();
  },
  methods: {
    modifySure() {
      let NameProving = /^[0-9a-zA-Z-]*$/g;
      if (this.ImageName === "") {
        this.textTips = "镜像名称不能为空";
      } else if (!NameProving.test(this.ImageName)) {
        this.textTips = "镜像名称仅能包含字母数字字符";
      } else {
        this.textTips = "";
      }
      let params = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        ImageId: this.modifyShow.modifyStateId.ImageId,
        ImageName: this.ImageName,
        ImageDescription: this.textarea
      };
      this.axios
        .post("cvm2/ModifyImageAttribute", params)
        .then(data => {
          this.$message({
            message: '修改成功',
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
    InputLength() {
      this.numLength = 20 - this.ImageName.length;
    },
    cancel() {
      this.$emit("close", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.modify {
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
    & > ul {
      li {
        margin-bottom: 16px;
        display: flex;
        justify-content: flex-start;
        & > span {
          font-size: 12px;
          display: inline-block;
          &:nth-of-type(1) {
            width: 100px;
            color: #888;
          }
          &:nth-of-type(2) {
            color: #444;
          }
        }
        & > div {
          font-size: 12px;
          & > input {
            color: #444;
            width: 180px;
            height: 30px;
            border: 1px solid #ddd;
            padding: 0 10px;
            &:hover {
              border: 1px solid #bbb;
            }
          }
          & > p {
            color: #a2a2a2;
          }
        }
        & > textarea {
          width: 330px;
          height: 100px;
          color: #444;
          font-size: 12px;
          border: 1px solid #ddd;
          padding: 5px 10px;
          &:hover {
            border: 1px solid #bbb;
          }
        }
      }
    }
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

