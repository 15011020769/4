<template>
  <div class="login">
    <el-dialog :visible.sync="loginStatus.loginDialog" :show-close="false" width="50%">
      <div slot="title" class="title-wrap">
        <span>登陆Linux实例</span>
        <i class="el-icon-close" @click="handleCancel"></i>
      </div>
      <div class="cotent">
        <div class="login-way">
          <span>标准登陆方式</span>
          <div class="login-detail">
            <div>支持复制粘贴、中文输入法，需要开启 SSH 端口（TCP:22）</div>
            <el-button size="mini" type="primary" class="login-button" @click="loginOne">立即登录</el-button>
            <div class="tips">提示：当前实例无公网IP，不支持Webshell 登录和远程登录软件登录，您可以采取以下方式进行登录</div>
          </div>
        </div>
        <div class="login-way">
          <span>其他方式（VNC）</span>
          <div class="login-detail">
            <div>该方式暂不支持复制粘贴、中文输入法</div>
            <div>提示：采用VNC方式登录，请务必开启 MFA 二次验证提高安全保障级别</div>
            <el-button size="mini" type="text" class="login-button" @click="loginTwo">立即登录</el-button>
          </div>
        </div>
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
    loginStatus: {
      type: Object,
      default: () => []
    }
  },
  methods: {
    loginOne() {
      var params = {
        Region: this.$cookie.get("regionv2"),
        InstanceId: this.loginStatus.InstanceItem[0].InstanceId
      };
      window.open('https://iaas.cloud.tencent.com/webshell?regionId=' + params.Region +'&instanceId=' + params.InstanceId)
    },
    loginTwo() {
      var params = {
        Region: this.$cookie.get("regionv2"),
        InstanceId: this.loginStatus.InstanceItem[0].InstanceId
      };
      window.open('https://iaas.cloud.tencent.com/vnc?regionId=' + params.Region +'&instanceId=' + params.InstanceId)
    },
    handleCancel() {
      this.$emit("close", false);
    }
  },
  components: {},
  mounted() {
    console.log(this.loginStatus.InstanceItem)
  }
};
</script>
<style lang="scss" scoped>
.login {
  .el-dialog__title {
    font-size: 16px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    span {
      font-weight: bolder;
    }
    i {
      font-size: 16px;
      font-weight: 900;
    }
  }
  .cotent {
    .login-way {
      .login-detail {
        padding: 20px;
        font-size: 12px;
        background: #f2f2f2;
        .login-button {
          margin-top: 10px;
        }
        .tips {
          color: #e54545;
        }
      }
    }
  }
}
</style>


