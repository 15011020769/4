<template>
  <div class="wrap">
    <div class="wrap-in">
      <div class="basis">
        <!--  -->
        <div class="title">
          <p class="title-left">
            <span>基础信息</span>
            <span class="close">(展示基本信息，可修改或删除场景)</span>
          </p>
          <p class="title-right">
            <i class="el-icon-delete" style="cursor:pointer"></i>
            <span>删除场景</span>
          </p>
        </div>
        <!--  -->
        <el-form status-icon ref="ruleForm" label-width="112px" class="demo-ruleForm">
          <el-form-item label="应用名称" prop="pass">
            <span>11112e</span>
          </el-form-item>
          <el-form-item label="所在网址" prop="checkPass">
            <span>11112e</span>
          </el-form-item>
          <el-form-item label="APPID" prop="age">
            <span>2002636472</span>
          </el-form-item>
          <el-form-item label="APP Secret Key" prop="age">
            <span>0uVi_glKfQIQbhG7qdAqNPw**</span>
          </el-form-item>
        </el-form>
      </div>
      <!-- 第二项内容 -->
      <div class="basis basis-two">
        <!--  -->
        <div class="title title-two">
          <p class="title-left">
            <span>阈值和告警</span>
            <span class="close">(修改验证码流量波动时的告警邮箱)</span>
          </p>
        </div>
        <!--  -->
        <div class="emailaddordel">
          <div class="warning-email">
            <p>告警邮箱</p>
            <p class="close">验证情况出现恶意量、拉取量波动时，将通过以下邮箱通知您</p>
          </div>
          <div class="addordel">
           <el-input v-model="addEmail" placeholder="请输入内容" ></el-input>
           <i class="el-icon-plus" @click="submit()"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import {isEmail} from ''
export default {
  data() {
    return {
      addEmail:''
    }
  },
  methods:{
    submit(){

    }
  }
};
</script>
<style scoped lang='scss'>
.wrap {
  width: 100%;
  height: 100%;
  padding: 20px;
  .wrap-in {
    background: white;
    .basis {
      padding: 20px;
      border-bottom: solid 1px #dddddd;
      .title {
        font-size: 15px;
        margin-bottom: 30px;
        display: flex;
        justify-content: space-between;
        .title-right span {
          cursor: pointer;
        }
        .title-left span:nth-of-type(1) {
          font-weight: 600;
        }
        .title-left span:nth-of-type(2) {
          margin-left: 6px;
          font-size: 14px;
        }
      }
      .title-two {
        margin-bottom: 100px;
      }
      .emailaddordel {
        padding: 0px 40px;
        .warning-email {
          margin-bottom: 50px;
          p {
            line-height: 2;
          }
          p:nth-of-type(1) {
            font-size: 18px;
          }
          p:nth-of-type(2) {
            color: #666;
          }
        }
        .addordel{
          position:relative;
           & >>>   .el-input .el-input__inner{
            width: 300px;
            border: none;
            border-bottom: solid 1px #ddd;
          }
          .el-icon-plus{
            cursor: pointer;
            position: absolute;
            font-size: 18px;
            top: 10px;
            left: 280px;
            color: #006ef0;
          }
        }
      }
    }
    .demo-ruleForm {
      & >>> .el-form-item__content span {
        margin-left: 30px;
      }
    }
    .basis-two{
      min-height: 480px;
    }
  }
}
.active {
  border-color: #006ef0 !important;
}
.close {
  color: #666;
}
.open {
  color: #006ef0;
}
</style>