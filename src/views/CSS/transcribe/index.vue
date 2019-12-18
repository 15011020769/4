<template>
  <div class="transcribe-wrap">
    <HeaderCom title="录制配置" />
    <div class="transcribe-main">
      <div class="explain">
        <p>
          温馨提示：录制功能为增值收费项，详细计费规则请
          <a href="#">参考文档</a>
        </p>
      </div>
      <div class="explain">
        <p>
          模板设置完成，需关联推流域名方可生效，请点击
          <a href="#">域名管理</a>进行关联设置。模板设置请
          <a href="#">参考文档</a>模板配置完后续大约5分鐘生效
        </p>
      </div>
      <div class="main-box">
        <div class="left">
          <i class="el-icon-plus" @click="_add"></i>
          <i class="el-icon-delete"></i>
        </div>
        <div class="right" v-show="formShow">
          <Form />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderCom from "@/components/public/Head";
import Form from "./tab/form";
export default {
  name: "transcribe",
  data() {
    return {
      formShow: true
    };
  },
  components: {
    HeaderCom,
    Form
  },
  methods: {
    _add() {
      this.formShow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.transcribe-wrap {
  .transcribe-main {
    padding: 20px;
    box-sizing: border-box;

    .main-box {
      background-color: #fff;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      padding: 20px;
      box-sizing: border-box;
      margin-bottom: 20px;
      display: flex;

      .left {
        width: 20%;
        i {
          font-size: 15px;
          font-weight: bold;
          color: #666;
          margin-right: 14px;
          cursor: pointer;
        }
      }
      .right {
        flex: 1;
        border-left: 1px #ccc solid;
        padding: 20px;
        box-sizing: border-box;
      }
    }

    .explain {
      color: #003b80;
      border: 1px solid #97c7ff;
      background: #e5f0ff;
      padding: 10px 30px 10px 20px;
      margin-bottom: 20px;
      border-radius: 2px;

      p {
        line-height: 18px;

        a {
          color: #006eff;
        }
        a:hover {
          border-bottom: 1px #006eff solid;
        }
      }
    }
  }
}
</style>