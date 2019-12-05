<template>
  <div>
    <div class="topCreateFunStep">
      <span class="el-icon-back" @click="backFunlist"></span>
      <span class="createFunTit">创建函数</span>
      <span class="docRight">
        <a href="#">
          命令行工具创建函数
          <span class="el-icon-share"></span>
        </a>
        <a href="#">
          VS Code创建函数
          <span class="el-icon-share"></span>
        </a>
      </span>
    </div>
    <div class="mainContent">
      <div class="stepOneTopTit newClear">
        <span>1</span>
        <span>基础信息</span>
        <span>></span>
        <span>2</span>
        <span>函数配置</span>
      </div>
      <div class="allConStep">
        <el-form :model="formShowable" label-width="100px">
          <el-form-item label="函数名" class="labelLeft">
            <span>{{formShowable.funNameStep}}</span>
          </el-form-item>
          <el-form-item label="运行环境" class="labelLeft">
            <span>{{formShowable.runMoentStep}}</span>
          </el-form-item>
          <el-form-item label="描述" class="labelLeft">
            <el-input class="decsIpt" type="textarea" v-model="formShowable.descStep" placeholder="helloworld 空白模板函数">
            </el-input>
            <p class="tipContent">最大支持1000个英文字母、数字、空格、逗号、句号、中文</p>
          </el-form-item>
          <el-form-item label="运行角色" :required="true" class="labelLeft">
            <span slot="label">
              运行角色
              <!-- <i class="el-icon-question"></i> -->
            </span>
            <el-select v-model="formShowable.runRole" class="decsIptSelect">
              <el-option label="SCF默认运行角色" value="default"></el-option>
              <el-option label="SCF_QcsRole" value="qsrole"></el-option>
            </el-select>
            <p class="tipContent">
              <span>此角色将用于授权函数运行时操作其他资源的权限。您可以</span>
              <a>
                新建角色
                <span class="el-icon-share"></span>
              </a>
              <span>或对角色</span>
              <a>
                修改权限
                <span class="el-icon-share"></span>
              </a>
            </p>
          </el-form-item>
          <el-form-item label="执行方法" :required="true" class="labelLeft">
            <span slot="label">
              执行方法

            </span>
            <el-input placeholder="index.main_handler" v-model="formShowable.runFun" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="提交方法" :required="true" class="labelLeft">
            <span slot="label">
              提交方法

            </span>
            <el-select v-model="formShowable.tipFun" class="decsIptSelect" readonly="readonly">
              <el-option label="在线编辑" value="onlineEdit"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label>
            <div class="codeContent">{{formShowable.codeContent}}</div>
          </el-form-item>
        </el-form>
        <div>
          <p v-if="senior" class="senior" @click="_senior">
            <i class="el-icon-arrow-down"></i>
            高级配置
          </p>
          <p v-if="!senior" class="senior" @click="_senior">
            <i class="el-icon-arrow-up"></i>
            高级配置
          </p>
          <div v-if="!senior">
            <div>
              <p>环境变量</p>
              <div></div>
            </div>
          </div>
        </div>


      </div>
      <el-button class="prevStep" @click="prevStep">上一步</el-button>
      <el-button class="compileSucc" @click="compileSucc()">完成</el-button>
    </div>
  </div>
</template>
<script>
  import {
    ADD_FUNC,
    TEMPLATE_DETAIL
  } from "@/constants";
  export default {
    data() {
      return {
        senior: true,
        DemoId: '',
        formShowable: {
          funNameStep: "",
          runMoentStep: "",
          descStep: "",
          runRole: "",
          runFun: "index.main_handler",
          tipFun: "在线编辑",
          codeContent: ""
        }
      };
    },
    computed: {
      // 模糊搜索
    },
    created() {
      this.formShowable.funNameStep = window.sessionStorage.getItem(
        "funNameSess"
      );
      this.formShowable.runMoentStep = window.sessionStorage.getItem("runMoent");
      this.DemoId = window.sessionStorage.getItem("DemoId");
      if (this.DemoId) {
        this.GetTemplateDetail()
      }
    },
    methods: {
      //回去上一页
      backFunlist() {
        this.$router.push({
          path: "/FuncServe"
        });
      },
      //上一步
      prevStep() {
        this.$router.push({
          path: "/createFun"
        });
      },
      _senior() {
        this.senior = !this.senior
      },
      GetTemplateDetail() { //获取函数模板详情
        let param = {
          Region: this.$cookie.get('regionv2'),
          Version: "2018-04-16",
          DemoId: this.DemoId
        }
        this.axios
          .post(TEMPLATE_DETAIL, param)
          .then(data => {
            this.formShowable.codeContent = data.Response.DemoCode

          })
      },
      //添加子函数
      compileSucc() {
        let params = {
          Version: "2018-04-16",
          Region: this.$cookie.get('regionv2'),
          FunctionName: this.formShowable.funNameStep,
          'Code.DemoId': this.DemoId,
          Handler: this.formShowable.runFun,
          Runtime: this.formShowable.runMoentStep,
          Description: this.formShowable.descStep,
          Role: this.formShowable.runRole
        };
        this.axios.post(ADD_FUNC, params).then(res => {
          console.log(res);
        });
      },
    }
  }

</script>
<style lang="scss" scoped>
  .senior {
    color: #006eff;
    cursor: pointer;
  }

  .allConStep>>>.el-input {
    width: 200px;
  }

  .allConStep>>>.el-textarea__inner {
    border-radius: 0;
    height: 100px;
  }

  .allConStep>>>.el-input__inner {
    height: 30px !important;
    line-height: 30px !important;
    border-radius: 0 !important;
  }

  .allConStep>>>.el-form-item__label {
    text-align: left;
    width: 120px;
  }

  .newClear:after {
    display: block;
    content: "";
    clear: both;
  }

  .topCreateFunStep {
    width: 100%;
    height: 52px;
    background-color: #fff;
    line-height: 52px;
    border-bottom: 1px solid #eee;
    padding: 0 20px;

    .createFunTit {
      font-size: 16px;
      font-weight: 600;
      line-height: 52px;
    }

    .el-icon-back {
      float: left;
      margin-top: 17px;
      font-size: 20px;
      margin-right: 20px;
    }

    .docRight {
      float: right;

      a {
        float: left;
        margin-left: 12px;

        .el-icon-share {
          font-size: 20px;
          margin-left: 5px;
        }
      }
    }
  }

  .mainContent {
    margin: 20px;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  }

  .stepOneTopTit {
    line-height: 32px;
    width: 100%;
    margin-bottom: 15px;

    span:nth-child(1) {
      width: 30px;
      float: left;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background-color: #006eff;
      color: #fff;
      margin-right: 12px;
      border-radius: 100%;
    }

    span:nth-child(2) {
      float: left;
      color: #000;
      margin-right: 35px;
      font-weight: 600;
      font-size: 14px;
    }

    span:nth-child(3) {
      font-size: 14px;
      color: #000;
      float: left;
      margin-right: 35px;
    }

    span:nth-child(4) {
      width: 30px;
      float: left;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background-color: #006eff;
      color: #fff;
      border-radius: 100%;
      margin-right: 12px;
    }

    span:nth-child(5) {
      float: left;
      color: #000;
      margin-right: 40px;
      font-weight: 600;
      font-size: 14px;
    }
  }

  .prevStep {
    margin-top: 12px !important;
    margin-right: 12px;
  }

  .compileSucc {
    margin-top: 12px !important;
    color: #fff !important;
    background-color: #006eff !important;
  }

  .allConStep {
    width: 100%;
    border-bottom: 1px solid #eaeaea;
    padding-bottom: 20px;
    font-size: 12px;

    .decsIpt {
      width: 200px;
    }

    .decsIptSelect {
      width: 200px;
      display: block;

      div.el-input {
        width: 200px;

        input {
          width: 200px;
        }
      }
    }

    .labelLeft .el-form-item__label {
      text-align: left !important;
      font-size: 12px;
      color: #888;
    }
  }

  .tipContent {
    font-size: 12px;
    color: #888;

    span {
      float: left;
    }

    a {
      float: left;

      span.el-icon-share {
        float: right;
        margin: 14px 5px 0 0;
      }
    }
  }

  .codeContent {
    width: 100%;
    min-height: 500px;
    background-color: #eaeaea;
  }

</style>
