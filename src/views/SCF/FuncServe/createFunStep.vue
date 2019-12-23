<template>
  <div class="wrap">
    <div class="topCreateFunStep">
      <span class="el-icon-back" @click="backFunlist"></span>
      <span class="createFunTit">{{ $t('SCF.total.cjhs') }}</span>
      <span class="docRight"></span>
    </div>
    <div class="mainContent">
      <div class="stepOneTopTit newClear">
        <span>1</span>
        <span>{{ $t('SCF.total.jcxx') }}</span>
        <span>></span>
        <span>2</span>
        <span>{{ $t('SCF.total.hspz') }}</span>
      </div>
      <div class="allConStep">
        <el-form :model="formShowable" label-width="100px">
          <el-form-item :label="$t('SCF.total.hsm')" class="labelLeft">
            <span>{{formShowable.funNameStep}}</span>
          </el-form-item>
          <el-form-item :label="$t('SCF.total.yxhj')" class="labelLeft">
            <span>{{formShowable.runMoentStep}}</span>
          </el-form-item>
          <el-form-item :label="$t('SCF.total.ms')" class="labelLeft">
            <el-input
              class="decsIpt"
              type="textarea"
              v-model="formShowable.descStep"
              :placeholder="$t('SCF.total.msmr')"
            ></el-input>
            <p class="tipContent">{{ $t('SCF.total.zc') }}</p>
          </el-form-item>
          <el-form-item :label="$t('SCF.total.yxjs')" :required="true" class="labelLeft">
            <span slot="label">
              {{ $t('SCF.total.yxjs') }}
              <!-- <i class="el-icon-question"></i> -->
            </span>
            <el-select v-model="formShowable.runRole" class="decsIptSelect">
              <el-option label="SCF_QcsRole" value="SCF_QcsRole"></el-option>
              <el-option label="QCS_SCFExcuteRole" value="QCS_SCFExcuteRole"></el-option>
            </el-select>
            <p class="tipContent">
              <span>{{ $t('SCF.total.jssq') }}</span>
              <a>
                {{ $t('SCF.total.xjjs') }}
                <span class="el-icon-share"></span>
              </a>
              <span>{{ $t('SCF.total.djs') }}</span>
              <a>
                {{ $t('SCF.total.xgqx') }}
                <span class="el-icon-share"></span>
              </a>
            </p>
          </el-form-item>
          <el-form-item :label="$t('SCF.total.zxff')" :required="true" class="labelLeft">
            <span slot="label">{{ $t('SCF.total.zxff') }}</span>
            <el-input placeholder="index.main_handler" v-model="formShowable.runFun" disabled></el-input>
          </el-form-item>
          <el-form-item :label="$t('SCF.total.tjff')" :required="true" class="labelLeft">
            <span slot="label">{{ $t('SCF.total.tjff') }}</span>
            <el-select v-model="formShowable.tipFun" class="decsIptSelect" readonly="readonly">
              <el-option :label="$t('SCF.total.zxbj')" value="onlineEdit"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label>
            <div class="codeContent">{{formShowable.codeContent}}</div>
          </el-form-item>
        </el-form>
        <div>
          <p v-if="senior" class="senior" @click="_senior">
            <i class="el-icon-arrow-down"></i>
            {{ $t('SCF.total.gjpz') }}
          </p>
          <p v-if="!senior" class="senior" @click="_senior">
            <i class="el-icon-arrow-up"></i>
            {{ $t('SCF.total.gjpz') }}
          </p>
          <div v-if="!senior">
            <div class="seniorbox">
              <p>{{ $t('SCF.total.hjbl') }}</p>
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
                  <p v-if="closeshow">
                    <i class="el-icon-close closeScience" @click="CloseScience(index)"></i>
                  </p>
                </div>
                <div class="Science">
                  <p @click="AddScience" class="addScience">{{ $t('SCF.total.tj') }}</p>
                </div>
              </div>
            </div>

            <div class="seniorbox">
              <p>{{ $t('SCF.total.wlpz') }}</p>
              <div>
                <div class="Science">
                  <p>
                    <el-select
                      v-model="Vpcvalue"
                      :placeholder="$t('SCF.total.xzvpc')"
                      @change="changeVpc"
                    >
                      <el-option
                        v-for="item in VpcOptions"
                        :key="item.VpcId"
                        :label="item.VpcName"
                        :value="item.VpcId"
                      ></el-option>
                    </el-select>
                  </p>
                  <p>
                    <el-select v-model="Subnetvalue" :placeholder="$t('SCF.total.xzzw')">
                      <el-option
                        v-for="item in SubnetOptions"
                        :key="item.SubnetId"
                        :label="item.SubnetName"
                        :value="item.SubnetId"
                      ></el-option>
                    </el-select>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-button class="prevStep" @click="prevStep">{{ $t('SCF.total.syb') }}</el-button>
      <el-button
        class="compileSucc"
        @click="compileSucc()"
        v-show="loading"
      >{{ $t('SCF.total.wc') }}</el-button>
      <el-button class="compileSucc" icon="el-icon-loading" v-show="!loading"></el-button>
    </div>
  </div>
</template>
<script>
import { ADD_FUNC, TEMPLATE_DETAIL, VPCS_LIST, SUBNET_LIST } from "@/constants";
export default {
  data() {
    return {
      loading: true,
      senior: true,
      DemoId: "",
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
      ScienceKey: "", //环境变量key
      ScienceValue: "", //环境变量value
      VpcOptions: [], //vpc列表
      SubnetOptions: [], //子网列表
      Vpcvalue: "", //vpc
      Subnetvalue: "", //子网
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
      this.GetTemplateDetail();
    }
    this.GetVpcList();
  },
  methods: {
    //环境添加
    AddScience() {
      this.ScienceArr.push({});
      if (this.ScienceArr.length > 1) {
        this.closeshow = true;
      } else {
        this.closeshow = false;
      }
    },
    //环境删除
    CloseScience(index) {
      this.ScienceArr.splice(index, 1);
      if (this.ScienceArr.length > 1) {
        this.closeshow = true;
      } else {
        this.closeshow = false;
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
      this.senior = !this.senior;
    },
    GetTemplateDetail() {
      //获取函数模板详情
      let param = {
        Region: "ap-guangzhou", //this.$cookie.get('regionv2'),
        Version: "2018-04-16",
        DemoId: this.DemoId
      };
      this.axios.post(TEMPLATE_DETAIL, param).then(data => {
        let DataBeginDetail = JSON.parse(data.Response.DemoConfig);
        this.formShowable.runFun =
          DataBeginDetail[
            "serverless-cloud-function-application"
          ].functions.handler;
        this.formShowable.codeContent = data.Response.DemoCode;
      });
    },
    //获取vpc列表
    GetVpcList() {
      let param = {
        Region: "ap-guangzhou", //this.$cookie.get('regionv2'),
        Version: "2017-03-12"
      };
      this.axios.post(VPCS_LIST, param).then(data => {
        this.VpcOptions = data.Response.VpcSet;
      });
    },
    //选择vpc
    changeVpc() {
      this.GetSubnetList();
    },
    //获取子网列表
    GetSubnetList() {
      let param = {
        Region: "ap-guangzhou", //this.$cookie.get('regionv2'),
        Version: "2017-03-12",
        "Filters.0.Name": "vpc-id",
        "Filters.0.Values.0": this.Vpcvalue
      };
      this.axios.post(SUBNET_LIST, param).then(data => {
        this.SubnetOptions = data.Response.SubnetSet;
      });
    },
    //添加子函数
    compileSucc() {
      this.loading = false;
      let params = {
        Version: "2018-04-16",
        Region: "ap-guangzhou", //this.$cookie.get('regionv2'),
        FunctionName: this.formShowable.funNameStep,
        "Code.DemoId": this.DemoId,
        Handler: this.formShowable.runFun,
        Runtime: this.formShowable.runMoentStep,
        Description: this.formShowable.descStep,
        Role: this.formShowable.runRole
      };
      if (this.Vpcvalue != "" && this.Subnetvalue != "") {
        params["VpcConfig.VpcId"] = this.Vpcvalue;
        params["VpcConfig.SubnetId"] = this.Subnetvalue;
      }
      for (let i in this.ScienceArr) {
        (params["Environment.Variables." + i + ".Key"] = this.ScienceArr[
          i
        ].Key),
          (params["Environment.Variables." + i + ".Value"] = this.ScienceArr[
            i
          ].Value);
      }

      this.axios.post(ADD_FUNC, params).then(res => {
        this.$router.push({
          path: "/FuncServe"
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap >>> .el-input__inner,
.wrap >>> .el-button {
  height: 30px;
  line-height: 30px;
  border-radius: 0;
  padding-top: 0;
}
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

.allConStep >>> .el-input {
  width: 200px;
}

.allConStep >>> .el-textarea__inner {
  border-radius: 0;
  height: 100px;
}

.allConStep >>> .el-input__inner {
  height: 30px !important;
  line-height: 30px !important;
  border-radius: 0 !important;
}

.allConStep >>> .el-form-item__label {
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
