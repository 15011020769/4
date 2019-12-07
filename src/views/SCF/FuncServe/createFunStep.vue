<template>
  <div>
    <div class="topCreateFunStep">
      <span class="el-icon-back" @click="backFunlist"></span>
      <span class="createFunTit">创建函数</span>
      <span class="docRight">
        <!-- <a href="#">
          命令行工具创建函数
          <span class="el-icon-share"></span>
        </a>
        <a href="#">
          VS Code创建函数
          <span class="el-icon-share"></span>
        </a> -->
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
              <el-option label="SCF_QcsRole" value="SCF_QcsRole"></el-option>
              <el-option label="QCS_SCFExcuteRole" value="QCS_SCFExcuteRole"></el-option>
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
            <div class="seniorbox">
              <p>环境变量</p>
              <div>
                <div class="Science borderNone">
                  <p>Key</p>
                  <p>Value</p>
                </div>
                <div class="Science borderNone" v-for="(item,index) in ScienceArr" :key="index">
                  <p>
                    <el-input v-model="item.Key" class="Scienceinput"></el-input>
                  </p>
                  <p>
                    <el-input v-model="item.Value" class="Scienceinput"></el-input>
                  </p>
                  <p v-if="closeshow"><i class="el-icon-close closeScience" @click="CloseScience(index)"></i></p>
                </div>
                <div class="Science ">
                  <p @click="AddScience" class="addScience">添加</p>
                </div>
              </div>
            </div>

            <div class="seniorbox">
              <p>网络配置</p>
              <div>
                <div class="Science">
                  <p>
                    <el-select v-model="Vpcvalue" placeholder="请选择vpc" @change="changeVpc">
                      <el-option v-for="item in VpcOptions" :key="item.VpcId" :label="item.VpcName" :value="item.VpcId">
                      </el-option>
                    </el-select>
                  </p>
                  <p>
                    <el-select v-model="Subnetvalue" placeholder="请选择子网">
                      <el-option v-for="item in SubnetOptions" :key="item.SubnetId" :label="item.SubnetName"
                        :value="item.SubnetId">
                      </el-option>
                    </el-select>
                  </p>
                </div>
              </div>
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
    TEMPLATE_DETAIL,
    VPCS_LIST,
    SUBNET_LIST
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
          runFun: "",
          tipFun: "在线编辑",
          codeContent: ""
        },
        ScienceArr: [{}],
        ScienceKey: '', //环境变量key
        ScienceValue: '', //环境变量value
        VpcOptions: [], //vpc列表
        SubnetOptions: [], //子网列表
        Vpcvalue: '', //vpc
        Subnetvalue: '', //子网
        closeshow: false //删除按钮控制
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
      this.GetVpcList()
    },
    methods: {
      //环境添加
      AddScience() {
        this.ScienceArr.push({})
        if (this.ScienceArr.length > 1) {
          this.closeshow = true
        } else {
          this.closeshow = false
        }
      },
      //环境删除
      CloseScience(index) {
        this.ScienceArr.splice(index, 1);
        if (this.ScienceArr.length > 1) {
          this.closeshow = true
        } else {
          this.closeshow = false
        }
      },
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
            let DataBeginDetail = JSON.parse(data.Response.DemoConfig)
            this.formShowable.runFun = DataBeginDetail['serverless-cloud-function-application'].functions.handler
            this.formShowable.codeContent = data.Response.DemoCode
          })
      },
      //获取vpc列表
      GetVpcList() {
        let param = {
          Region: this.$cookie.get('regionv2'),
          Version: "2017-03-12",
        }
        this.axios
          .post(VPCS_LIST, param)
          .then(data => {
            this.VpcOptions = data.Response.VpcSet
          })
      },
      //选择vpc
      changeVpc() {
        console.log()
        this.GetSubnetList()
      },
      //获取子网列表
      GetSubnetList() {
        let param = {
          Region: this.$cookie.get('regionv2'),
          Version: "2017-03-12",
          'Filters.0.Name': 'vpc-id',
          'Filters.0.Values.0': this.Vpcvalue
        }
        this.axios
          .post(SUBNET_LIST, param)
          .then(data => {
            this.SubnetOptions = data.Response.SubnetSet
            console.log(data)
          })
      },
      //添加子函数
      compileSucc() {
         console.log(this.ScienceArr.length)
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
        if (this.Vpcvalue != '' && this.Subnetvalue != '') {
          params['VpcConfig.VpcId'] = this.Vpcvalue
          params['VpcConfig.SubnetId'] = this.Subnetvalue
        }
        for(let i in this.ScienceArr) {
          params['Environment.Variables.'+i+'.Key'] = this.ScienceArr[i].Key,
          params['Environment.Variables.'+i+'.Value'] = this.ScienceArr[i].Value
        }
        console.log(params);

        this.axios.post(ADD_FUNC, params).then(res => {
          this.$router.push({
          path: "/funSeverDetail",
          query:{
              
          }
        });
        });
      },
    }
  }

</script>
<style lang="scss" scoped>
  .seniorbox {
    display: flex;
    margin: 20px;

    ::v-deep .el-input {
      width: 170px !important;
    }

    .Science {
      margin-left: 20px;
      display: flex;
      width: 415px;
      height: 40px;
      border: 0.5px solid #ccc;

      p {
        color: #ccc;
        font-weight: bold;
        flex: 1;
        line-height: 40px;
        padding-left: 15px;


      }
    }

    .closeScience {
      cursor: pointer;
      font-size: 24px;
      line-height: 40px;
    }

    .addScience {
      cursor: pointer;
    }

    .borderNone {
      border-bottom: none;



      .Scienceinput {
        width: 165px !important;
      }
    }


  }


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
