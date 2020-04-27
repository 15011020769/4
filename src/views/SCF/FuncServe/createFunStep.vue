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
            <el-input class="decsIpt" type="textarea" v-model="formShowable.descStep" :placeholder="$t('SCF.total.msmr')"></el-input>
            <p class="tipContent">{{ $t('SCF.total.zc') }}</p>
          </el-form-item>
          <el-form-item :label="$t('SCF.total.yxjs')" :required="true" class="labelLeft">
            <span slot="label">
              {{ $t('SCF.total.yxjs') }}
              <!-- <i class="el-icon-question"></i> -->
            </span>
            <el-select v-model="formShowable.runRole" class="decsIptSelect">
              <el-option v-for="item in RoleArr" :key="item.RoleName" :label="item.RoleName" :value="item.RoleName">
              </el-option>
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
            <el-select disabled v-model="formShowable.tipFun" class="decsIptSelect" readonly="readonly">
              <el-option :label="$t('SCF.total.zxbj')" value="onlineEdit"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-left: -100px;">
            <!-- <div class="codeContent">{{formShowable.codeContent}}</div> -->
            <!-- 编辑器的容器  v-loading="cslsLoading" -->
            <div class="content" v-loading="cslsLoading">
              <div id="container_editor_new" style="width: 100%; height: 500px; border: 1px solid #e7e7e7;"></div>
            </div>
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
                  <p @click="AddScience" class="addScience">添加</p>
                </div>
              </div>
            </div>

            <div class="seniorbox">
              <p>{{ $t('SCF.total.wlpz') }}</p>
              <div>
                <div class="Science">
                  <p>
                    <el-select v-model="Vpcvalue" :placeholder="$t('SCF.total.xzvpc')" @change="changeVpc">
                      <el-option v-for="item in VpcOptions" :key="item.VpcId" :label="item.VpcName" :value="item.VpcId">
                      </el-option>
                    </el-select>
                  </p>
                  <p>
                    <el-select v-model="Subnetvalue" :placeholder="$t('SCF.total.xzzw')">
                      <el-option v-for="item in SubnetOptions" :key="item.SubnetId" :label="item.SubnetName" :value="item.SubnetId"></el-option>
                    </el-select>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-button class="prevStep" @click="prevStep">{{ $t('SCF.total.syb') }}</el-button>
      <el-button class="compileSucc" @click="compileSucc()">{{ $t('SCF.total.wc') }}</el-button>
    </div>
  </div>
</template>
<script>
import {
  ADD_FUNC,
  TEMPLATE_DETAIL,
  VPCS_LIST,
  SUBNET_LIST,
  DESCRIB_ROLE
} from "@/constants";
import {
  ErrorTips
} from "@/components/ErrorTips";
export default {
  data() {
    return {
      senior: true,
      DemoId: "",
      formShowable: {
        funNameStep: "",
        runMoentStep: "",
        descStep: "",
        runRole: "",
        runFun: "",
        tipFun: "在線編輯",
        codeContent: ""
      },
      ScienceArr: [{}],
      ScienceKey: "", //环境变量key
      ScienceValue: "", //环境变量value
      VpcOptions: [], //vpc列表
      SubnetOptions: [], //子网列表
      Vpcvalue: "", //vpc
      Subnetvalue: "", //子网
      RoleArr: [],
      closeshow: false, //删除按钮控制
      cslsSDK: new CloudStudioLiteFilesServiceSDK(), // 初始化编辑器
      cslsLoading: false, // 编辑器加载动画
      tempDetail: JSON.parse(localStorage.getItem('tempDetail'))    // 获取缓存的信息
    };
  },
  computed: {
    // 模糊搜索
  },
  created() {
    // 函数名称
    this.formShowable.funNameStep = window.sessionStorage.getItem(
      "funNameSess"
    );
    this.formShowable.runMoentStep = window.sessionStorage.getItem("runMoent");  // 运行环境
    // this.DemoId = window.sessionStorage.getItem("DemoId");

    this.formShowable.descStep = this.tempDetail.desc   // 描述
    this.formShowable.runFun = this.tempDetail.handler  //执行方法
    console.log(this.tempDetail.desc)

    // if (this.DemoId) {
    //   this.GetTemplateDetail();
    // }
    this.GetVpcList();
    this._Getrole()
  },
  mounted() {
    this.getCsLite()      // 初始化编辑器
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
    // GetTemplateDetail() {
    //   //获取函数模板详情
    //   let param = {
    //     Region: localStorage.getItem('regionv2'),
    //     Version: "2018-04-16",
    //     DemoId: this.DemoId
    //   };
    //   this.axios.post(TEMPLATE_DETAIL, param).then(data => {
    //     let DataBeginDetail = JSON.parse(data.Response.DemoConfig);
    //     this.formShowable.runFun =
    //       DataBeginDetail[
    //         "serverless-cloud-function-application"
    //       ].functions.handler;
    //     this.formShowable.codeContent = data.Response.DemoCode;
    //   });
    // },
    //获取vpc列表
    GetVpcList() {
      let param = {
        Region: localStorage.getItem('regionv2'),
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
        Region: localStorage.getItem('regionv2'),
        Version: "2017-03-12",
        "Filters.0.Name": "vpc-id",
        "Filters.0.Values.0": this.Vpcvalue
      };
      this.axios.post(SUBNET_LIST, param).then(data => {
        this.SubnetOptions = data.Response.SubnetSet;
      });
    },
    _Getrole() { //获取角色
      let param = {
        Region: localStorage.getItem('regionv2'),
        Version: "2019-01-16",
        Page: 1,
        Rp: 200
      };
      this.axios.post(DESCRIB_ROLE, param).then(res => {
        if (res.Response.Error === undefined) {
          let List = res.Response.List
          List.forEach(item => {
            let strategyArr = JSON.parse(item.PolicyDocument)
            let strategy = strategyArr.statement[0].principal.service
            if (typeof strategy === 'object') {
              strategy.forEach(i => {
                if (i.split(".")[0] === 'scf') {
                  this.RoleArr.push(item)
                }
              });
            } else if (typeof strategy === "string") {
              if (strategy.split(".")[0] === 'scf') {
                this.RoleArr.push(item)
              }
            }
          });
          console.log(this.RoleArr)
        } else {
          let ErrTips = {
            'InternalError.SystemError': 'InternalError.SystemError',
            'InvalidParameter.ParamError': '非法入參'
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },

    // 渲染编辑器
    getCsLite() {
      this.cslsLoading = true // 开启加载动画
      this.cslsSDK.init({
        rootNode: document.querySelector('#container_editor_new'),
        modeType: ModeTypeEnum.ZIP,
        i18nType: "zh-tw"
      });
      let temp_url = 'https://7-1301459465.cos.ap-taipei.myqcloud.com/Nodejs6-1.zip?q-sign-algorithm=sha1&q-ak=AKIDwXkfdD2dToXIroTyRYWFEZtxB7Gr8046&q-sign-time=1587958739;1587962339&q-key-time=1587958739;1587962339&q-header-list=&q-url-param-list=&q-signature=5ade6478f4a44d6c32d97ffed44b89f90f5c17f1&x-cos-security-token=bcdee169808986827035e08a02d314afe9af689640001'
      this.cslsSDK.addListener({
        onRead: () => {
          return new Promise(res => {
            fetch(temp_url, {
              headers: {
                'content-type': 'application/zip'
              },
              method: 'GET'
            })
              .then(res => res.blob())
              .then(blob => {
                res({
                  content: blob
                })
                this.cslsLoading = false // 关闭加载动画
              })
          })
        }
      })
    },

    // 二进制转base64
    blobToDataURI(blob, callback) {
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = function (e) {
        callback(e.target.result);
      }
    },

    // 完成按钮 添加子函数
    compileSucc() {
      let params = {
        Version: "2018-04-16",
        Region: localStorage.getItem('regionv2'),
        FunctionName: this.formShowable.funNameStep,      // 函数名称
        // Handler: this.formShowable.runFun,                // 执行方法
        Handler: 'index.main_handler',                // 执行方法
        Runtime: this.formShowable.runMoentStep,          // 运行环境
        Description: this.formShowable.descStep,          // 描述
        Role: this.formShowable.runRole,                  // 角色
        Namespace: this.$route.query.Namespace            // 命名空间
      };
      this.cslsSDK.flush().then(() => {
        this.cslsSDK.getBlob().then(blob => {
          const blobSize = blob.size / 1024 / 1024
          if (blobSize > 20 || blobSize === 20) {
            this.$message({
              message: '在線編輯最大能上傳20M，您的代碼包已超過20M，請使用COS方式上傳',
              type: "warning",
              showClose: true,
              duration: 0
            });
          } else {
            this.blobToDataURI(blob, data => { //blob格式再转换为base64格式
              const base64url = data.replace(/^data:application\/\w+;base64,/, "")
              params["Code.ZipFile"] = base64url;
              this.completeFun(params) // 更新函数代码
            })
          }
        })
      })
    },

    // 完成方法
    completeFun(params) {
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
      if (this.formShowable.funNameStep && this.formShowable.runMoentStep) {
        this.axios.post(ADD_FUNC, params).then(res => {
          if (res.Response.Error === undefined) {
            this.$message({
              message: '创建成功',
              type: "success",
              showClose: true,
              duration: 0
            });
            localStorage.removeItem('tempDetail')   // 创建完成 清除缓存中的模板详情
            this.$router.push({
              path: "/FuncServe",
              query: {
                Namespace: this.$route.query.Namespace
              }
            });
          } else {
            let ErrTips = {
              'FailedOperation.CreateFunction': '操作失敗',
              'FailedOperation.Namespace': 'Namespace已存在',
              'InternalError': '內部錯誤',
              'InternalError.System': '內部系統錯誤',
              'InvalidParameter.Payload': '請求參數不合法',
              'InvalidParameterValue': '參數取值錯誤',
              'InvalidParameterValue.Code': 'Code傳入錯誤',
              'InvalidParameterValue.CodeSecret': 'CodeSecret傳入錯誤',
              'InvalidParameterValue.CodeSource': 'CodeSource傳入錯誤',
              'InvalidParameterValue.Cos': 'Cos傳入錯誤',
              'InvalidParameterValue.CosBucketName': 'CosBucketName不符合規範',
              'InvalidParameterValue.CosObjectName': 'CosObjectName不符合規範',
              'InvalidParameterValue.Description': 'Description傳入錯誤',
              'InvalidParameterValue.EipConfig': 'EipConfig參數錯誤',
              'InvalidParameterValue.Environment': 'Environment傳入錯誤',
              'InvalidParameterValue.FunctionName': '函數不存在',
              'InvalidParameterValue.Handler': 'Handler傳入錯誤',
              'InvalidParameterValue.Layers': 'Layers參數傳入錯誤',
              'InvalidParameterValue.MemorySize': 'MemorySize錯誤',
              'InvalidParameterValue.Namespace': 'Namespace參數傳入錯誤',
              'InvalidParameterValue.Runtime': 'Runtime傳入錯誤',
              'InvalidParameterValue.TempCosObjectName': '非法的TempCosObjectName',
              'InvalidParameterValue.Type': 'Type傳入錯誤',
              'InvalidParameterValue.ZipFile': 'ZipFile非法',
              'LimitExceeded.Function': '函數數量超出最大限制',
              'LimitExceeded.Memory': '記憶體超出最大限制',
              'LimitExceeded.Timeout': 'Timeout超出最大限制',
              'MissingParameter.Code': 'Code沒有傳入',
              'MissingParameter.Runtime': '缺失 Runtime 欄位',
              'ResourceInUse.Function': '函數已存在',
              'ResourceInUse.FunctionName': 'FunctionName已存在',
              'ResourceNotFound.Demo': '不存在的Demo',
              'ResourceNotFound.Role': '角色不存在',
              'ResourceNotFound.Vpc': 'VPC或子網不存在',
              'ResourceUnavailable.Namespace': 'Namespace不可用',
              'UnauthorizedOperation.CAM': 'CAM鑒權失敗',
              'UnauthorizedOperation.Region': 'Region錯誤',
              'UnauthorizedOperation.Role': '沒有許可權訪問您的Cos資源',
              'UnauthorizedOperation.TempCosAppid': 'TempCos的Appid和請求帳戶的Appid不一致'
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      }
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
