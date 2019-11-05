<template>
  <div class="editor">
    <el-dialog :visible.sync="modifyShow.modifyState" width="40%" :show-close="false">
      <div class="title">
        <h3>编辑安全组</h3>
        <a href="javascript:;" @click="cancel()">
          <i class="el-icon-close"></i>
        </a>
      </div>
      <div class="body">
        <ul>
          <li>
            <span>名称</span>
            <div>
              <input type="text" v-model="EditorName" />
            </div>
          </li>
          <li>
            <span>备注</span>
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
      EditorName: "",
      textarea: ""
    };
  },
  props: {
    modifyShow: {
      type: Object,
      default: () => []
    }
  },
  created() {
    this.EditorName = this.modifyShow.modifyStateId.SecurityGroupName;
    this.textarea = this.modifyShow.modifyStateId.SecurityGroupDesc;
  },
  methods: {
    modifySure() {
      let params = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        SecurityGroupId: this.modifyShow.modifyStateId.SecurityGroupId,
        GroupName: this.EditorName,
        GroupDescription: this.textarea
      };
      this.axios
        .post("vpc2/ModifySecurityGroupAttribute", params)
        .then(data => {
          this.$message({
            message: "编辑成功",
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
.editor {
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
    display: flex;
    justify-content: flex-start;
    & > ul {
      li {
        margin-bottom: 16px;
        display: flex;
        justify-content: flex-start;
        padding-left: 20px;
        & > span {
          font-size: 12px;
          display: inline-block;
          &:nth-of-type(1) {
            width: 44px;
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
          height: 54px;
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

