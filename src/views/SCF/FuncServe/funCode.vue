<template>
  <div>
    <div class="contentMain" v-loading="loading">
      <div class="contentMainList">
        <div class="newClear">
          <el-form :model="funCodeForm" label-width="130px" class="formLeftInput newClear">
            <el-form-item label="提交方法" :required="true" class="floatLeftItem">
              <span slot="label">
                提交方法
                <i class="el-icon-question"></i>
              </span>
              <el-select
                v-model="funCodeForm.methodsTip"
                class="selectSetWidth"
                @change="chooseSelect"
              >
                <el-option label="在线编辑" value="inline"></el-option>
                <el-option label="本地上传zip包" value="zipFile"></el-option>
                <el-option label="本地上传文件夹" value="folder"></el-option>
                <el-option label="通过cos上传zip包" value="cos"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="执行方法" :required="true" class="floatLeftItem">
              <span slot="label">
                执行方法
                <i class="el-icon-question"></i>
              </span>
              <el-input v-model="functionData.Handler" />
            </el-form-item>
            <el-form-item label="运行环境" class="floatLeftItem">
              <span>{{functionData.Runtime}}</span>
            </el-form-item>
          </el-form>
          <div class="formRightInput">
            <el-select v-model="downLoadZip" placeholder="下载" class="selectSetWidth">
              <el-option label="下载代码包" value="code"></el-option>
              <el-option label="下载YAML文件" value="yaml"></el-option>
            </el-select>
          </div>
        </div>
        <div class="codeShow" v-if="codeShow">
          <span>{{functionData.CodeInfo}}</span>
        </div>
        <!-- <div class="bottomBtn newClear"> class导致按钮无法点击-->
        <div>
          <el-button type="primary" @click="saveCode" size="small">保存</el-button>
          <el-button @click="testCode" size="small">测试</el-button>
          <span style="padding:0 20px">*当前测试模板</span>
          <el-form style="display:inline-block">
            <el-form-item label :required="true" class="floatLeftItem">
              <el-select v-model="modelList" class="selectSetWidth floatLeftItem1">
                <el-option label="Hello World事件模板" value="HelloWorld"></el-option>
                <el-option label="COS 对象存储的 POST 事件模板" value="cospost"></el-option>
                <el-option label="COS 对象存储的 PUT 事件模板" value="cosput"></el-option>
                <el-option label="COS 对象存储的 DELETE 事件模板" value="cosdelete"></el-option>
                <el-option label="CMQ Topic 事件模板" value="cmqtop"></el-option>
                <el-option label="Api Gateway 事件模板" value="apieway"></el-option>
                <el-option label="Ckafka 事件模板" value="ckafka"></el-option>
                <el-option label="Timer 定时触发器事件模板" value="timer"></el-option>
                <p @click="newCreateModel=true">新建模板</p>
              </el-select>
              <el-dialog
                title="配置测试模板"
                :visible.sync="newCreateModel"
                width="50%"
                :append-to-body="true"
                :before-close="newCreateModelClose"
              >
                <el-form label-width="130px" :model="configTestModel">
                  <el-form-item label="测试事件模板" :required="true">
                    <el-input plcarholder="请输入模板名称" v-model="configTestModel.modelName" />
                    <p>1. 最多45个字符，最少2个字符</p>
                    <p>2. 字母开头，支持 a-z，A-Z，0-9，-，_，且需要以数字或字母结尾</p>
                  </el-form-item>
                  <el-form-item label="引用模板代码" :required="true">
                    <el-select v-model="configTestModel.useModelCode">
                      <el-option label="Hello World事件模板" value="scf_system-holloword"></el-option>
                      <el-option label="COS 对象存储的 POST 事件模板" value="scf_system_cos_post"></el-option>
                      <el-option label="COS 对象存储的 PUT 事件模板" value="scf_system_cos_put"></el-option>
                      <el-option label="COS 对象存储的 DELETE 事件模板" value="scf_system_cos_delete"></el-option>
                      <el-option label="CMQ Topic 事件模板" value="scf_system_cmq_topic"></el-option>
                      <el-option label="Api Gateway 事件模板" value="scf_system_apigateway"></el-option>
                      <el-option label="Ckafka 事件模板" value="scf_system_ckafka"></el-option>
                      <el-option label="Timer 定时触发器事件模板" value="scf_system_timer"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :required="true">
                    <div class="codeBox"></div>
                  </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                  <el-button @click="newCreateModel = false">取 消</el-button>
                  <el-button type="primary" @click="configCodeSure">提 交</el-button>
                </span>
              </el-dialog>
            </el-form-item>
          </el-form>
        </div>
        <div class="tea-form" style="width: 100%;">
          <div class="tea-form" style="display:flex">
            <p style="padding-right:20px">函数代码</p>
            <div>
              <div style="display:flex">
                <el-input
                  v-model="disinput"
                  placeholder="还未选择文件"
                  style="margin-right:20px"
                  size="small"
                  disabled
                ></el-input>
                <el-input
                  style="padding:0;width:90px"
                  type="file"
                  class="btnUp"
                  size="small"
                  @input="inpChange"
                ></el-input>
              </div>
              <p style="margin-top:15px">请上传zip格式的代码包，最大支持50M（如果zip大于10M，仅显示入口文件）</p>
            </div>
          </div>
        </div>
        <div class="bottomCodeShow" v-if="bottomCodeShowBtn">
          <h3>
            测试结果
            <span>成功</span>
          </h3>
          <div class="borderLeftBlue borderLeftBlue1">
            <h1>返回结果:</h1>
            <p>"hello from scf"</p>
          </div>
          <div class="newClear">
            <div class="borderLeftBlue borderLeftBlue2">
              <h1>摘要:</h1>
              <p>
                <span>请求ID:</span>
                <span>5a81551d-084b-11ea-a122-5254005dc76e</span>
              </p>
              <p>
                <span>运行时间:</span>
                <span>0.18000000715255737ms</span>
              </p>
              <p>
                <span>计费时间:</span>
                <span>100ms</span>
              </p>
              <p>
                <span>占用内存:</span>
                <span>10.09375MB</span>
              </p>
            </div>
            <div class="borderLeftBlue borderLeftBlue3">
              <h1>日志:</h1>
              <div>
                START RequestId: 5a81551d-084b-11ea-a122-5254005dc76e
                <br />Event RequestId: 5a81551d-084b-11ea-a122-5254005dc76e
                <br />Start Hello World function
                <br />Hello World
                <br />value1 = test value 1
                <br />value2 = test value 2
                <br />END RequestId: 5a81551d-084b-11ea-a122-5254005dc76e
                <br />Report RequestId: 5a81551d-084b-11ea-a122-5254005dc76e Duration:0.18ms Memory:128MB MaxMemoryUsed:10.0938MB
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { FUN_LOG, INVOKE, SCF_DETAILS } from "@/constants";
export default {
  data() {
    return {
      loading: true,
      functionData: [],
      FunctionRequestId: "",
      funCodeForm: {
        methodsTip: "inline",
        zxMethods: "index.main_handler",
        runMoment: "Python2.7"
      },
      disinput: "",
      downLoadZip: "",
      codeShow: true,
      modelList: "Hello World事件模板",
      newCreateModel: false,
      configTestModel: {
        modelName: "",
        useModelCode: ""
      },
      uploadZipBackBack: false,
      uploadCos: false,
      uploadFlolderShow: false,
      redTipShow: false,
      bottomCodeShowBtn: false,
      actionSubminFile1: {
        filesInput: ""
      },
      actionSubminFile2: {
        filesInput: ""
      },
      actionSubminFile3: {
        cosBucket: "",
        cosObjFile: ""
      },
      input: ""
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 查询详情
    init() {
      this.loading = true;
      let params = {
        Action: "GetFunction",
        Version: "2018-04-16",
        ShowCode: "TRUE",
        Namespace: "default",
        Qualifier: "$LATEST",
        Region: "ap-guangzhou" //this.$cookie.get("regionv2")
      };
      let functionName = this.$route.query.functionName;
      // functionName = 'tttt'
      if (functionName != "" && functionName != null) {
        params["FunctionName"] = functionName;
      }
      this.axios
        .post(SCF_DETAILS, params)
        .then(res => {
          let _this = this;
          this.functionData = res.Response;
          let funcData = this.functionData;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    saveCode() {
      // 点击保存，首先执行uploads，然后重新执行GetFunction，查询信息，
      // 查询模板GetTempCosInfo，根据返回的ObjectPath模板路径，执行UpdateFunctionCode
      //UpdateFunctionCode //更新雲函数代码
      let params = {
        Action: "UpdateFunctionCode",
        Version: "2018-04-16",
        Region: "ap-guangzhou", //this.$cookie.get("regionv2"),
        Handler: "index.main_handler"
      };
      let functionName = this.$route.query.functionName;
      // functionName = 'tttt'
      if (functionName != "" && functionName != null) {
        params["FunctionName"] = functionName;
      }
      this.axios
        .post(UPD_FUN_CODE, params)
        .then(res => {})
        .catch(error => {
          console.log(error);
        });
    },
    inpChange(val) {
      this.disinput = val;
    },
    //函数代码运行函数
    testCode() {
      // ClientContext: '{↵  "key1": "test value 1",↵  "key2": "test value 2"↵}'
      let params = {
        Action: "Invoke",
        Version: "2018-04-16",
        Namespace: "default",
        InvocationType: "Event",
        Qualifier: "$LATEST",
        Region: "ap-guangzhou" //this.$cookie.get("regionv2")
      };
      let functionName = this.$route.query.functionName;
      if (functionName != "" && functionName != null) {
        params["FunctionName"] = functionName;
      }
      this.axios
        .post(INVOKE, params)
        .then(res => {
          let _this = this;
          this.FunctionRequestId = res.Response.Result.FunctionRequestId;
          // 获取测试日志
          let params = {
            Action: "GetFunctionLogs",
            Version: "2018-04-16",
            Namespace: "default",
            FunctionRequestId: _this.FunctionRequestId,
            Qualifier: "$LATEST",
            Region: _this.$cookie.get("regionv2")
          };
          if (functionName != "" && functionName != null) {
            params["FunctionName"] = functionName;
          }
          this.axios
            .post(FUN_LOG, params)
            .then(res => {
              this.ResData = res.Response.Data;
              // 从腾讯雲产品执行交易分析，如果日志为空从新查询，一般查询10多次日志就出来
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });
    },
    newCreateModelClose() {
      this.newCreateModel = false;
    },
    //配置测试模板确定按钮
    configCodeSure() {
      this.newCreateModel = false;
    },
    //监测提交方法下拉框
    chooseSelect() {
      if (this.funCodeForm.methodsTip == "inline") {
        this.codeShow = true;
      } else {
        this.codeShow = false;
      }
      if (this.funCodeForm.methodsTip == "zipFile") {
        this.uploadZipBackBack = true;
      } else {
        this.uploadZipBackBack = false;
      }
      if (this.funCodeForm.methodsTip == "cos") {
        this.uploadCos = true;
      } else {
        this.uploadCos = false;
      }
      if (this.funCodeForm.methodsTip == "folder") {
        this.uploadFlolderShow = true;
      } else {
        this.uploadFlolderShow = false;
      }
    },
    //上传文件
    handleFile() {},
    handleFile1() {},
    //测试按钮
    bottomCodeShow() {
      alert(1);
      this.bottomCodeShowBtn = true;
    }
  }
};
</script>
<style lang="scss">
.formLeftInput {
  float: left;
  .floatLeftItem {
    display: inline-block;
    margin-right: 30px;
  }
}
.formRightInput {
  float: right;
}
.codeShow {
  width: 100%;
  height: 300px;
  background-color: #fff;
  border: 1px solid #ddd;
  overflow-y: scroll;
  padding: 20px;
  box-sizing: border-box;

  span {
    line-height: 30px;
  }
}
.bottomBtn {
  padding: 20px 0;
  border-top: 1px solid #ddd;
  margin-top: 20px;
  button {
    float: left;
    margin-right: 10px;
  }
  .newFormFloat {
    float: left;
    width: 330px;
  }
}
.el-select-dropdown {
  position: relative;
  p {
    position: absolute;
    bottom: 0;
    margin-top: 30px;
    width: 100%;
    line-height: 30px;
    background-color: #fff;
    border-top: 1px solid #ddd;
    color: #3e8ef7;
    text-indent: 12px;
  }
}
.codeBox {
  border: 1px solid #ddd;
  min-height: 200px;
}
.uploadZipBack {
  width: 100%;
  min-height: 85px;
  background-color: #f2f2f2;
  padding: 20px 10px;
}
.uploadFlolder {
  width: 100%;
  min-height: 85px;
  background-color: #f2f2f2;
  padding: 20px 10px;
}
.uploadCos {
  width: 100%;
  min-height: 85px;
  background-color: #f2f2f2;
  padding: 20px 10px;
}
.fileinput-button {
  position: relative;
  display: inline-block;
  overflow: hidden;
  input {
    position: absolute;
    right: 0px;
    top: 0px;
    opacity: 0;
    font-size: 200px;
  }
}
.tipRed {
  color: red;
}
.setWidthChoose {
  width: 250px;
  div.el-input {
    width: 250px;
  }
}
.cosFilePath {
  width: 250px;
  input {
    width: 250px;
  }
}
.bottomCodeShow {
  width: 100%;
  margin-top: 20px;
  min-height: 200px;
  h3 {
    font-size: 14px;
    font-weight: 600;
    span {
      color: green;
    }
  }
}
.borderLeftBlue {
  background-color: rgb(242, 242, 242);
  font-size: 14px;
  border-left: 11px solid rgb(210, 231, 247);
  padding: 20px 12px;
  margin-bottom: 20px;
  h1 {
    color: rgb(48, 127, 220);
    font-size: 14px;
    font-weight: 100;
  }
}
.borderLeftBlue2 {
  float: left;
  margin-right: 20px;
  width: 30%;
  min-height: 400px;
  p {
    line-height: 24px;
    span:nth-child(1) {
      color: rgb(48, 127, 220);
    }
    span:nth-child(2) {
      color: #888;
    }
  }
}
.borderLeftBlue3 {
  float: left;
  width: 68.7%;
  min-height: 400px;
  div {
    line-height: 24px;
    color: #888;
  }
}
.tea-form {
  display: table;
  font-size: 12px;
  line-height: 1.5;
}
.tea-form .tea-form {
  background-color: #f2f2f2;
  padding: 10px;
  width: 100%;
}
.btnUp .el-input__inner {
  padding: 0;
}
</style>