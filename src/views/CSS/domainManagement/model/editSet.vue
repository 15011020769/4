<template>
  <div>
    <el-dialog
      :title="$t('CSS.domainManagement.22')"
      :visible.sync="isShow"
      width="45%"
      :before-close="handleClose"
    >
      <div class="newClear">
        <div class="newClear conList">
          <p>{{ $t("CSS.domainManagement.23") }}</p>
          <p>
            <el-switch
              v-model="switchvalue"
              active-color="#006eff"
              inactive-color="#ddd"
            >
            </el-switch>
          </p>
        </div>
        <div class="newClear conList">
          <p>主KEY</p>
          <p>
            <el-input v-model="mainKey" :maxlength="32"></el-input><br />
            <span>{{ $t("CSS.domainManagement.47") }}。</span>
          </p>
        </div>
        <div class="newClear conList">
          <p>{{ $t("CSS.domainManagement.24") }}</p>
          <p>
            <el-input v-model="readyKey" :maxlength="32"></el-input><br />
            <span>{{ $t("CSS.domainManagement.47") }}。</span>
          </p>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveSet">保存</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { LIVE_MODIFYLIVEPUSHAUTHKEY } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  props: {
    isShow: {
      required: false,
      type: Boolean
    },
    pushAuthKeyInfo: {
      required: true,
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      switchvalue: false, // 开关
      mainKey: "", // 主KEY
      readyKey: "" // 备KEY
    };
  },
  watch: {
    pushAuthKeyInfo() {
      this.mainKey = this.pushAuthKeyInfo.MasterAuthKey; // 主KEY
      this.readyKey = this.pushAuthKeyInfo.BackupAuthKey;
      this.switchvalue = this.pushAuthKeyInfo.Enable === 1;
    },
    mainKey(newVal, oldVal) {
      this.mainKey = newVal.replace(/[^\da-zA-Z]/g, "");
    },
    readyKey(newVal, oldVal) {
      this.readyKey = newVal.replace(/[^\da-zA-Z]/g, "");
    }
  },
  methods: {
    // 关闭
    handleClose() {
      this.$emit("closeModel", false);
    },
    // 保存按钮
    saveSet() {
      if (this.mainKey.length === 0) {
        this.$message({
          type: "error",
          message: "請輸入主key",
          showClose: true,
          duration: 0
        });
        return;
      }

      this.axios
        .post(LIVE_MODIFYLIVEPUSHAUTHKEY, {
          DomainName: this.$route.query.Name,
          Version: "2018-08-01",
          Enable: Number(this.switchvalue),
          MasterAuthKey: this.mainKey,
          BackupAuthKey: this.readyKey
        })
        .then(Response => {
          console.log(Response, "Response");
          if (Response.Error) {
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              type: "error",
              message: ErrOr[Response.Error.Code],
              showClose: true,
              duration: 0
            });
          } else {
            this.$emit("changed");
          }
        });
      this.$emit("closeModel", false);
    }
  }
};
</script>
<style  lang="scss" scoped>
.newClear:after {
  content: "";
  display: block;
  clear: both;
}
::v-deep .el-dialog__title {
  font-size: 14px;
  font-weight: 600;
}
::v-deep .el-dialog__footer {
  text-align: center;
}
::v-deep input {
  width: 300px;
  height: 30px;
  border-radius: 0;
}
::v-deep .el-dialog__headerbtn {
  background-color: #fff;
  border: none;
}
.conList {
  margin-bottom: 20px;
  p:nth-child(1) {
    width: 70px;
    float: left;
    color: #999;
    font-size: 12px;
  }
  p:nth-child(2) {
    float: left;
    width: calc(100% - 70px);
    span {
      color: #999;
      font-size: 12px;
    }
  }
}
</style>
