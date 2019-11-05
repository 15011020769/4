<template>
  <div class="editor">
    <el-dialog :visible.sync="rulesEditorShow.rulesEditorState" width="30%" :show-close="false">
      <div class="title">
        <h3>编辑</h3>
        <a href="javascript:;" @click="cancel()">
          <i class="el-icon-close"></i>
        </a>
      </div>
      <div class="body">
        <div class="add">
          <div>
            <span>来源：</span>
            <el-input placeholder="如10.0.0.1或10.0.0.0/16" v-model="editor.source"></el-input>
          </div>
          <div>
            <span>协议端口：</span>
            <el-input placeholder="如UDP:53,TCP:80,443或TCP:80-90" v-model="editor.ipPort"></el-input>
          </div>
          <div>
            <span>策略：</span>
            <el-select v-model="value">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div>
            <span>备注：</span>
            <el-input v-model="editor.remark"></el-input>
          </div>
        </div>
      </div>
      <div class="footer">
        <el-button type="primary" @click="EditorSure()">确定</el-button>
        <el-button @click="cancel()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: [
        {
          value: "ACCEPT",
          label: "允许"
        },
        {
          value: "DROP",
          label: "拒绝"
        }
      ],
      value: "",
      editor: {
        source: "", // 来源
        ipPort: "", // 协议端口
        remark: "" // 备注
      },
      ipPortArr: []
    };
  },
  props: {
    rulesEditorShow: {
      type: Object,
      default: () => []
    }
  },
  created() {
    this.editor.source = this.rulesEditorShow.EditorList.CidrBlock;
    this.editor.ipPort =
      this.rulesEditorShow.EditorList.Protocol.toUpperCase() +
      ":" +
      this.rulesEditorShow.EditorList.Port;
    this.value = this.rulesEditorShow.EditorList.Action;
    this.editor.remark = this.rulesEditorShow.EditorList.PolicyDescription;
  },
  methods: {
    // 确定
    EditorSure() {
      let params = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        SecurityGroupId: this.rulesEditorShow.EditorRulesId
      };
      var rulesType = "";
      if (this.rulesEditorShow.RulesType === 0) {
        rulesType = "Ingress";
      } else if (this.rulesEditorShow.RulesType === 1) {
        rulesType = "Egress";
      }
      params[
        "SecurityGroupPolicySet." + rulesType + ".0.PolicyIndex"
      ] = this.rulesEditorShow.EditorList.PolicyIndex;
      params["SecurityGroupPolicySet." + rulesType + ".0.Action"] = this.value;
      params[
        "SecurityGroupPolicySet." + rulesType + ".0.PolicyDescription"
      ] = this.editor.remark;
      params[
        "SecurityGroupPolicySet." + rulesType + ".0.CidrBlock"
      ] = this.editor.source;
      if (this.editor.ipPort !== "ALL") {
        this.ipPortArr = this.editor.ipPort.split(":");
        if (this.ipPortArr[1] === undefined) {
          this.$message({
            message: "请填写正确的协议端口",
            type: "error"
          });
          return;
        }
        params[
          "SecurityGroupPolicySet." + rulesType + ".0.Protocol"
        ] = this.ipPortArr[0];
        params[
          "SecurityGroupPolicySet." + rulesType + ".0.Port"
        ] = this.ipPortArr[1];
      }
      this.axios
        .post("vpc2/ReplaceSecurityGroupPolicy", params)
        .then(data => {
          if (data.Response.Error) {
            this.$message({
              message: "添加失败",
              type: "error"
            });
            this.cancel();
          } else {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.$emit("rulesList");
            this.cancel();
          }
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
    font-size: 12px;
    a {
      color: #006eff;
      font-size: 12px;
      &:hover {
        text-decoration: underline;
      }
    }
    .add {
      margin-bottom: 20px;
      & > div {
        display: flex;
        margin-top: 10px;
        justify-content: flex-start;
        & > span {
          line-height: 30px;
          display: inline-block;
          width: 66px;
        }
      }
      ::v-deep .el-input {
        width: 200px;
      }
      ::v-deep .el-input__inner {
        border-radius: 0px;
        width: 200px;
        height: 30px;
        padding-left: 10px;
        font-size: 12px;
      }
    }
    table {
      width: 100%;
      border: 1px solid #ddd;
      thead {
        tr {
          td {
            padding: 0 10px;
            height: 40px;
            font-size: 12px;
            color: #888;
            font-weight: 700;
          }
        }
      }
      tbody {
        tr {
          td {
            border-top: 1px solid #ddd;
            padding: 0 10px;
            height: 40px;
            font-size: 12px;
            color: #333;
            a {
              color: #006eff;
              margin-left: 10px;
            }
          }
        }
      }
    }
    ::v-deep .el-table--border {
      border: 1px solid #ddd;
    }
    ::v-deep .el-table--border th {
      border-right: 0px;
      border-color: #ddd;
    }
    ::v-deep .el-table--border td {
      border-right: 0px;
      border-color: #ddd;
    }
    ::v-deep .el-table th > .cell {
      font-size: 12px;
      color: #888;
    }
    ::v-deep .el-table th {
      padding: 0px;
      height: 40px;
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
      font-size: 12px;
      border-radius: 0px;
    }
    .el-button--primary {
      background: #006eff;
      border-color: #006eff !important;
    }
  }
}
</style>

