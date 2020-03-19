<template>
  <div>
    <div class="CodeContent">
      <div class="CodeTool">
        <div class="CodeTool-frist">
          <P>
            <span>
              提交方法<i class="el-icon-question"></i>
            </span>
            <el-select v-model="SubmissionValue" placeholder="请选择" class="select" @change="changSubmit()">
              <el-option v-for="item in SubmissionArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </P>
          <P>
            <span>
              执行方法<i class="el-icon-question"></i>
            </span>
            <el-input v-model="implementInput"></el-input>
          </P>
          <P>
            <span>
              运行环境
            </span>
            <span>{{ScienceValue}}</span>
          </P>
        </div>
        <div>
          <p>
            <el-button size="small" @click="_Clone">
              下载代码包
            </el-button>
          </p>
        </div>
      </div>

      <div v-if="SubmissionValue==='Inline'" class="content">
        <!-- <el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="textarea">
        </el-input> -->
        <div id="roota" style="width: 100%; height: 500px;"></div>
      </div>

      <div v-if="SubmissionValue==='ZipFile'" class="content">
        <div class="ZipFile">
          <p class="ZipFilename">函数代码</p>
          <div class="ZipFilecontent">
            <p>
              <el-input v-model="input1" :disabled="true">
              </el-input>
            </p>
            <p>
              <el-upload action="" :show-file-list="false" :auto-upload="false" :on-change="filezip">
                <el-button size="small" accept="application/x-zip-compressed">上传</el-button>
              </el-upload>
            </p>

          </div>

        </div>
        <p>请上传zip格式的代码包，最大支持50M（如果zip大于10M，仅显示入口文件）</p>
      </div>

      <div v-if="SubmissionValue==='TempCos'" class="content">
        <div class="ZipFile">
          <p class="ZipFilename">函数代码</p>
          <div class="ZipFilecontent">
            <p>
              <el-input v-model="input2" :disabled="true">
              </el-input>
            </p>
            <p>
              <el-button size="small" @click="_fileClip">上传</el-button>
            </p>

          </div>

        </div>
        <input type="file" multiple directory mozdirectory webkitdirectory @change="fileClip" class="inputfile" id="webk" v-show="false" />

        <p>请选择文件夹（该文件夹根目录应包含 handler 入口文件），最大支持250M</p>
      </div>

      <div v-if="SubmissionValue==='Cos'" class="content">
        <div class="ZipFile">
          <p class="ZipFilename">COS Bucket</p>
          <div class="ZipFilecontent">
            <el-select v-model="cosvalue" placeholder="请选择">
              <el-option v-for="item in Cosoptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>

        </div>
        <div class="ZipFile">
          <p class="ZipFilename">COS对象文件</p>
          <div class="ZipFilecontent">
            <el-input v-model="input3" :disabled="true">
            </el-input>
          </div>

        </div>

      </div>
      <!-- <div>
        <el-input type="file" id="fileID"></el-input>
      </div>
      <div id="sdk-root" style="width: 100%; height: 100%"></div> -->
      <div class="functest">
        <el-button type="primary" size="small" @click="_Preservation">保存</el-button>
        <el-button size="small" @click="_testModal">测试</el-button>
        <span class="testmb">测试当前模板</span>
        <el-select v-model="testvalue" placeholder="请选择">
          <el-option v-for="(item, i) in modeloptions" :key="i" :label="item" :value="item">
            <span>item</span>
            <span style="float: right"><i class="el-icon-edit" @click="_editModal(item)" /><i class="el-icon-close" @click="_deleteModal(item)" /></span>
          </el-option>

        </el-select>
        <span class="testmb">
          <el-button type="text" size="small" @click="addModal = true">新建模板</el-button>
        </span>
      </div>
      <div class="test-info" v-if="isShowLogList">
        <div class="test-result">
          <h3>测试结果: <span style="color: red;">失败</span></h3>
        </div>
        <div class="back-result">
          <p>返回结果:</p>
          <p></p>
        </div>
        <div class="info-left">
          <p>摘要: <span></span></p>
          <p>请求ID:<span></span></p>
          <p>运行时间:<span>ms</span></p>
          <p>计费时间:<span>ms</span></p>
          <p>运行内存:<span>MB</span></p>
        </div>
        <div class="log-list">
          <p>日志:</p>
        </div>
      </div>
    </div>
    <el-dialog title="提示" :visible.sync="deleteModal" width="35%">
      <p>确定删除{{modalName}}吗?</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="_deleteTestModal">确认</el-button>
        <el-button @click="deleteModal = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="更换测试模板" :visible.sync="editModal" width="35%">
      <span>测试事件模板
        <el-tooltip effect="light" content="模板会在测试时作为event参数传递给函数，模板列表中包含了对各触发器事件的模拟数据结构" placement="right">
          <i class="el-icon-info"></i>
        </el-tooltip>
      </span><span> {{modalName}}</span>
      <pre class="rich-text"> {{modalName}}</pre>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="_deleteTestModal">确认</el-button>
        <el-button @click="editModal = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="配置测试模板" :visible.sync="addModal" width="50%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm" size="small" style="width:800px">
        <el-form-item label="测试事件模板" prop="name">
          <el-input type="text" placeholder="请输入模板名称" v-model="ruleForm.name" autocomplete="off" style="width:200px"></el-input>
          <p>1. 最多45个字符，最少2个字符</p>
          <p>2. 字母开头，支持 a-z，A-Z，0-9，-，_，且需要以数字或字母结尾</p>
        </el-form-item>
        <el-form-item label="测试事件模板">
          <el-select v-model="testvalue" placeholder="请选择">
            <el-option v-for="(item, i) in modeloptions" :key="i" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="_newmodel">提 交</el-button>
        <el-button @click="addModal = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import
JsZip
  from 'jszip'
import {
  SCF_DETAILS,
  LIST_VERSION,
  CLONE_SCF,
  TEST_MODEL,
  TESTMODELS_LIST,
  DELETE_MODAL,
  TEST_MODAL,
  INVOKE
} from "@/constants";
import {
  ErrorTips
} from "@/components/ErrorTips";

export default {
  props: ['FunctionVersion'],
  data() {
    return {
      functionName: this.$route.query.functionName,
      funDate: {}, //函数详情
      functionversion: '',
      SubmissionValue: 'Inline', //提交方法
      implementInput: '', //执行方法
      ScienceValue: '', //运行环境
      SubmissionArr: [{ //提交方法数组
        label: '在线编辑',
        value: 'Inline'
      },
      {
        label: '本地上传zip包',
        value: 'ZipFile'
      },
      {
        label: '本地上传文件夹',
        value: 'TempCos'
      },
      {
        label: '通过cos上传zip包',
        value: 'Cos'
      }
      ],
      textarea: '测试',
      input1: '',
      fileBase64zip: '', //zip上传
      fileBase64clip: '',
      fileBase64clip1: '', //文件夹上传
      input2: '',
      Cosoptions: [],
      cosvalue: '', //cos
      input3: '', //cos路径
      modeloptions: [], //模板列表
      testvalue: '',
      deleteModal: false,//是否启动删除模板modal
      modalName: '',//模板名称
      editModal: false,//是否启动编辑模板modal
      addModal: false,//是否打开新增modal
      ruleForm: {
        name: ''//名称
      },
      testResult: {},//测试结果
      isShowLogList: false,//是否显示日志列表
      rules: {
        name: [
          {
            validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('模板名稱不能為空'))
              } else if (value.length < 2 || value.length > 45) {
                callback(new Error('模板名稱长度仅限于2到45个字符'))
              } else if (!(/^[a-z][a-z\d-]*$/.test(value))) {
                callback(new Error('模板名稱格式不正確'))
              } else {
                callback()
              }
            },
            trigger: "blur",
            required: true
          }
        ]
      }
    }
  },
  created() {
    this.GetDate();
    this.GetListFunctionTestModels();
  },
  mounted() {
    const CSLite = new this.$cloudstudio .CloudStudioLiteSDK({
      rootNode: document.querySelector('#roota'),
      funcName: 'workspace',
      helpDocLink: 'https://studio.dev.tencent.com/',
      applyStatistics: {
        appId: 'appId-1',
        appKey: 'appKey-1',
        channel: 'channel-1',
        uid: {}
      }
    });
    // const CSLite = new CloudStudioLiteSDK({
    //   rootNode: document.querySelector('#roota'),
    //   funcName: 'workspace',
    //   helpDocLink: 'https://studio.dev.tencent.com/',
    //   applyStatistics: {
    //     appId: 'appId-1',
    //     appKey: 'appKey-1',
    //     channel: 'channel-1',
    //     uid: 'uid-1'
    //   } 
    // });
    // document.querySelector('#fileID').onchange = e => {
    //   const reader = new FileReader();
    //   reader.onload = () => {
    //     const initConfig = {
    //       rootNode: document.querySelector('#sdk-root'),
    //       funcName: "",
    //       modeType: window.ModeTypeEnum.ZIP,
    //       helpDocLink: "",
    //       blobData: new Blob(),
    //       i18nType: "zh-cn",
    //       // entryPath: 'index.html', // 如果需要默认打开文件，则指定entryPath
    //     }
    //     execLiteServiceConstructor(initConfig, 2, reader.result);
    //   };
    //   reader.readAsBinaryString(e.target.files[0]);
    // }
    // const formatWorkerUrl = function (name) {
    //   return window.location.origin + "/worker/" + name;
    // };
    // CloudStudioLiteFilesServiceSDK.MonacoWorkerUrl([
    //   { label: "typescript", url: formatWorkerUrl("typescript.worker.js") },
    //   { label: "editor", url: formatWorkerUrl("editor.worker.js") },
    //   { label: "json", url: formatWorkerUrl("json.worker.js") },
    // ]);

    // const liteSDK = new CloudStudioLiteFilesServiceSDK();
    // // // 构造 litesdk
    // const execLiteServiceConstructor = function (config, permissionModeType, blobData) {
    //   if (!config & !permissionModeType & !blobData) return;
    //   liteSDK.init(config);
    //   console.log("init done");
    //   liteSDK.setPermission(permissionModeType);
    //   liteSDK.refreshRenderDOM();
    //   liteSDK.addListener({
    //     onRead: function () {
    //       return new Promise(function (res) {
    //         res({ content: blobData });
    //       });
    //     },
    //   });
    // };

    // window.liteSDK = liteSDK;
  },
  methods: {
    //获取详情数据
    GetDate() {
      let param = {
        Region: localStorage.getItem('regionv2'),
        Version: "2018-04-16",
        FunctionName: this.functionName,
        Namespace: this.$route.query.SpaceValue
      };
      this.axios.post(SCF_DETAILS, param).then(res => {
        if (res.Response.Error === undefined) {
          this.funDate = res.Response
          this.implementInput = res.Response.Handler
          this.functionversion = res.Response.FunctionVersion
          this.ScienceValue = res.Response.Runtime
        } else {
          let ErrTips = {
            'InternalError': '內部錯誤',
            'InternalError.System': '內部系統錯誤',
            'InvalidParameter.Payload': '請求參數不合法',
            'InvalidParameterValue': '參數取值錯誤',
            'InvalidParameterValue.CodeSecret': 'CodeSecret傳入錯誤',
            'ResourceNotFound.Function': '函數不存在',
            'ResourceNotFound.FunctionName': '函數不存在',
            'UnauthorizedOperation': '未授權操作',
            'UnauthorizedOperation.CAM': 'CAM鑒權失敗',
            'UnauthorizedOperation.CodeSecret': '無訪問程式碼權限'
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
    //下载
    _Clone() {
      let param = {
        Region: localStorage.getItem('regionv2'),
        Version: "2018-04-16",
        FunctionName: this.functionName,
        Qualifier: this.functionversion,
      };
      this.axios.post(CLONE_SCF, param).then(res => {
        if (res.Response.Error === undefined) {
          window.open(res.Response.Url)
        } else {
          let ErrTips = {
            'FailedOperation.FunctionStatusError': '函数在部署中,无法做此操作',
            'InternalError': '内部错误',
            'InternalError.System': '内部系统错误',
            'InvalidParameter.Payload': '请求参数不合法',
            'InvalidParameterValue': ' 参数取值错误',
            'ResourceNotFound.Function': '函数不存在',
            'ResourceNotFound.FunctionName': '函数不存在',
            'ResourceNotFound.FunctionVersion': '函数版本不存在',
            'ResourceNotFound.Version': '版本不存在',
            'UnauthorizedOperation.CAM': 'CAM鉴权失败',
            'UnauthorizedOperation.CodeSecret': ' 无访问代码权限'
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
    //转base64
    getBase64(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        let fileResult = "";
        reader.readAsDataURL(file);
        //开始转
        reader.onload = function () {
          fileResult = reader.result;
        };
        //转 失败
        reader.onerror = function (error) {
          reject(error);
        };
        //转 结束 咱就 resolve 出去
        reader.onloadend = function () {
          resolve(fileResult);
        };
      });
    },
    //上传zip
    filezip(file) {
      let fileName = file.name
      let pos = fileName.lastIndexOf('.')
      let lastName = fileName.substring(pos, fileName.length)
      if (lastName.toLowerCase() !== '.zip' && lastName.toLowerCase() !== '.rar') {
        this.$message.error('文件必须为.zip或者.rar类型')
        return
      }
      // 限制上传文件的大小
      const isLt = file.size / 1024 / 1024 / 100 <= 0.5
      if (!isLt) {
        this.$message.error('最大支持50M（如果zip大于10M，仅显示入口文件）')
      }
      this.input1 = file.name
      this.getBase64(file.raw).then(resBase64 => {
        this.fileBase64zip = resBase64.split(',')[1] //直接拿到base64信息
      })
      return isLt
    },
    _fileClip() {
      document.getElementById('webk').click()
    },
    //上传文件夹
    fileClip(file) {
      const that = this
      let clip = file.target.files
      var JSZip = require("jszip");
      const zip = new JSZip()
      var FileApi = require('file-save');
      Array.from(clip).forEach((item) => {
        const fixedPath = item.name
        zip.file(fixedPath, item, {
          compression: 'DEFLATE',
          compressionOptions: {
            level: '6'
          }
        })
      })
      const zipcontent = zip.generateAsync({
        type: 'blob'
      }).then(function (content) {
        return new File([content], 'index.zip')
      });
      Promise.resolve(zipcontent)
      zipcontent.then((result) => {
        that.fileBase64clip = result
      }).then((result) => {
        const isLt = that.fileBase64clip.size / 1024 / 1024 / 100 <= 2.5
        if (!isLt) {
          this.$message.error('请选择文件夹（该文件夹根目录应包含 handler 入口文件），最大支持250M')
          return
        }
        this.getBase64(this.fileBase64clip).then(resBase64 => {
          this.fileBase64clip1 = resBase64.split(',')[1] //直接拿到base64信息
        })
      })


    },
    _newmodel() {
      let param = {
        Region: localStorage.getItem('regionv2'),
        Version: "2018-04-16",
        FunctionName: this.functionName,
        TestModelName: 'ceshi',
        TestModelValue: '123456789',
      };
      this.axios.post(TEST_MODEL, param).then(res => {
        console.log(res)
        if (res.Response.Error === undefined) {

        } else {
          let ErrTips = {
            'InternalError': '内部错误',
            'InvalidParameterValue': '参数取值错误',
            'InvalidParameterValue.TestModelName': 'TestModelName传入错误',
            'InvalidParameterValue.TestModelValue': 'testModelValue长度超限',
            'LimitExceeded.FunctionTestModel': 'FunctionTestModel数量超出最大限制',
            'LimitExceeded.TestModel': '同一个函数下测试模版配额个数已达限制',
            'ResourceInUse.TestModel': '测试模版已存在',
            'ResourceInUse.TestModelName': 'TestModelName已存在',
            'ResourceNotFound.Function': '函数不存在',
            'ResourceNotFound.FunctionName': '函数不存在',
            'UnauthorizedOperation.CAM': 'CAM鉴权失败'
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
    //保存
    _Preservation() {


    },
    //获取函数测试模板列表
    GetListFunctionTestModels() {
      let param = {
        Region: localStorage.getItem('regionv2'),
        Version: "2018-04-16",
        Action: 'ListFunctionTestModels',
        FunctionName: this.functionName,
        Namespace: this.$route.query.SpaceValue
      };

      this.axios.post(TESTMODELS_LIST, param).then(res => {
        if (res.Response.Error === undefined) {
          this.modeloptions = res.Response.TestModels;
        } else {
          let ErrTips = {
            "InternalError": "内部错误",
            "InvalidParameterValue": "参数取值错误",
            "ResourceNotFound.Function": "函数不存在。",
            "ResourceNotFound.FunctionName": "函数不存在。",
            "UnauthorizedOperation.CAM": "CAM鉴权失败。"
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
    //是否删除模板
    _deleteModal(name) {
      this.deleteModal = true;
      this.modalName = name;
    },
    //是否修改模板
    _editModal(name) {
      this.editModal = true;
      this.modalName = name;
      this.GetFunctionTestModel();
    },
    //删除测试模板
    async _deleteTestModal() {
      let param = {
        Region: localStorage.getItem('regionv2'),
        Version: "2018-04-16",
        Action: 'DeleteFunctionTestModel',
        FunctionName: this.functionName,
        Namespace: this.$route.query.SpaceValue,
        TestModelName: this.modalName
      };

      this.axios.post(DELETE_MODAL, param).then(res => {
        if (res.Response.Error === undefined) {
          this.deleteModal = true;
          this.modalName = '';
          this.GetListFunctionTestModels();
          this.$message({
            message: "删除成功",
            type: "success",
            showClose: true,
            duration: 0
          });
        } else {
          let ErrTips = {
            "InternalError": "内部错误",
            "InvalidParameterValue": "参数取值错误",
            "ResourceNotFound.Function": "函数不存在。",
            "ResourceNotFound.FunctionName": "函数不存在。",
            "UnauthorizedOperation.CAM": "CAM鉴权失败。",
            "ResourceNotFound.FunctionTestModel": "FunctionTestModel不存在。",
            "ResourceNotFound.TestModel": "测试模版不存在。"
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

    //获取函数测试模板
    GetFunctionTestModel() {
      let param = {
        Region: localStorage.getItem('regionv2'),
        Version: "2018-04-16",
        Action: 'DeleteFunctionTestModel',
        FunctionName: this.functionName,
        Namespace: this.$route.query.SpaceValue,
        TestModelName: this.modalName
      };

      this.axios.post(TEST_MODAL, param).then(res => {
        if (res.Response.Error === undefined) {
        } else {
          let ErrTips = {
            "InternalError": "内部错误",
            "InvalidParameterValue": "参数取值错误",
            "ResourceNotFound.FunctionName": "函数不存在。",
            "UnauthorizedOperation.CAM": "CAM鉴权失败。",
            "ResourceNotFound.FunctionTestModel": "FunctionTestModel不存在。"
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
    //测试模板
    _testModal() {
      let param = {
        Version: "2018-04-16",
        Region: localStorage.getItem('regionv2'),
        FunctionName: this.functionName,
        InvocationType: "RequestResponse",
        LogType: "Tail",
        ClientContext: JSON.stringify({ key1: "test value 1", key2: "test value 2" }),
        Qualifier: this.functionversion,
        Namespace: this.$route.query.SpaceValue
      }

      this.axios.post(INVOKE, param).then(res => {
        if (res.Response.Error === undefined) {
          this.testResult = res.Response.Result;
          this.isShowLogList = true;
        } else {
          let ErrTips = {
            "InternalError": "内部错误",
            "InvalidParameterValue": "参数取值错误",
            "ResourceNotFound.FunctionName": "函数不存在。",
            "UnauthorizedOperation.CAM": "CAM鉴权失败。",
            "ResourceNotFound.FunctionTestModel": "FunctionTestModel不存在。",
            "FailedOperation.FunctionStatusError": "函数在部署中,无法做此操作。",
            "FailedOperation.InvokeFunction": "调用函数失败。",
            "InternalError.System": "内部系统错误。",
            "InvalidParameterValue.Param": "入参不是标准的json。",
            "ResourceNotFound.Function": "函数不存在。",
            "ResourceUnavailable.InsufficientBalance": "余额不足，请先充值。"
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

</script>
<style lang="scss" scoped>
.CodeContent {
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  padding: 20px;

  ::v-deep .el-select {
    height: 32px !important;
    line-height: 32px !important;
    width: 200px !important;
  }

  ::v-deep .el-input__inner {
    height: 32px !important;
    line-height: 32px !important;
    width: 200px !important;
  }

  ::v-deep .el-input {
    height: 32px !important;
    line-height: 32px !important;
    width: 200px !important;
  }

  .CodeTool {
    font-size: 12px;
    color: #888;
    display: flex;
    justify-content: space-between;

    .CodeTool-frist {
      flex-basis: 70%;
    }

    div {
      display: flex;

      .CourseRight {
        margin-right: 40px;
      }

      p {
        display: flex;
        line-height: 30px;
        margin-right: 10px;

        span {
          margin-right: 10px;
        }
      }
    }
  }

  .content {
    background: #f2f2f2;
    padding: 20px;
    margin: 20px 0;

    .ZipFile {
      display: flex;
      margin-bottom: 20px;

      .ZipFilename {
        line-height: 32px;
        color: #888;
        width: 100px;
      }

      .ZipFilecontent {
        display: flex;
      }
    }
  }

  .functest {
    padding-top: 20px;
    border-top: 1px solid #ccc;

    .testmb {
      margin: 0 20px;
    }
  }
  .test-info {
    position: relative;
    left: 0;
    right: 0;
    overflow-y: auto;
    overflow-x: hidden;
    .test-result {
      margin-top: 20px;
    }
    .back-result {
      height: 50px;
      width: 100%;
      background-color: rgb(242, 242, 242);
      p:nth-of-type(1) {
        padding: 10px 0 0 10px;
        font-size: 12px;
        color: rgb(48, 127, 220);
      }
    }
    .info-left {
      background-color: rgb(242, 242, 242);
      width: 300px;
      float: left;
      margin: 20px 20px 0px 0px;
      height: 300px;
      > p {
        color: rgb(48, 127, 220);
        padding: 10px 0 0 10px;
      }
    }
    .log-list {
      background-color: rgb(242, 242, 242);
      height: 300px;
      margin: 20px 0px 0px 320px;
      width: auto;
      > p {
        padding: 10px 0 0 10px;
        font-size: 12px;
        color: rgb(48, 127, 220);
      }
    }
  }
}
</style>
