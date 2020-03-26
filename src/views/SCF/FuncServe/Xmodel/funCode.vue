<template>
  <div>
    <div class="CodeContent">
      <div class="CodeTool">
        <div class="CodeTool-frist">
          <P>
            <span>
              提交方法
              <!-- <i class="el-icon-question"></i> -->
            </span>
            <el-select v-model="SubmissionValue" :placeholder="$t('SCF.total.qsz')" class="select" @change="changSubmit()">
              <el-option v-for="item in SubmissionArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </P>
          <P>
            <span>
              {{$t('SCF.total.zxff')}}
              <i class="el-icon-question" plain @click="openHint"></i>
            </span>
            <el-input v-model="implementInput"></el-input>
          </P>
          <P>
            <span>
              {{$t('SCF.total.yxhj')}}
            </span>
            <span>{{ScienceValue}}</span>
          </P>
        </div>
        <div>
          <p>
            <el-button size="small" @click="_Clone('download')">
              {{$t('SCF.total.xzdmb')}}
            </el-button>
          </p>
        </div>
      </div>

      <!-- 编辑器的容器 -->
      <div v-show="SubmissionValue === 'Inline'" class="content">
        <div id="container_editor" style="width: 100%; height: 500px;"></div>
      </div>

      <!-- 上传zip -->
      <div v-show="SubmissionValue === 'ZipFile'" class="content">
        <div class="ZipFile">
          <p class="ZipFilename">{{$t('SCF.total.hsdm')}}</p>
          <div class="ZipFilecontent">
            <p>
              <el-input v-model="input1" :disabled="true">
              </el-input>
            </p>
            <p>
              <el-upload action="" :show-file-list="false" :auto-upload="false" :on-change="filezip">
                <el-button size="small" accept="application/x-zip-compressed">{{$t('SCF.total.schuan')}}</el-button>
              </el-upload>
            </p>

          </div>

        </div>
        <p>{{$t('SCF.total.qscdmb')}}</p>
      </div>

      <!-- 上传文件夹 -->
      <div v-show="SubmissionValue === 'TempCos'" class="content">
        <div class="ZipFile">
          <p class="ZipFilename">{{$t('SCF.total.hsdm')}}</p>
          <div class="ZipFilecontent">
            <p>
              <el-input v-model="input2" :disabled="true">
              </el-input>
            </p>
            <p>
              <el-button size="small" @click="_fileClip">{{$t('SCF.total.schuan')}}</el-button>
            </p>

          </div>

        </div>
        <input type="file" multiple directory mozdirectory webkitdirectory @change="fileClip" class="inputfile" id="webk" v-show="false" />

        <p>{{$t('SCF.total.qxzwjj')}}</p>
      </div>

      <!-- cos上传 -->
      <div v-show="SubmissionValue === 'Cos'" class="content">
        <div class="ZipFile">
          <p class="ZipFilename">
            COS Bucket
            <el-tooltip placement="top" effect="light">
              <div slot="content">
                {{$t('SCF.total.xzsjy')}}
                <br />
                {{$t('SCF.total.wyhsszdy')}}
              </div>
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </p>
          <div class="ZipFilecontent">
            <el-select v-model="cosName" :placeholder="$t('SCF.total.qsz')">
              <el-option v-for="item in cosArr" :key="item.Name" :label="item.Name" :value="item.Name">
              </el-option>
            </el-select>
          </div>

        </div>
        <div class="ZipFile">
          <p class="ZipFilename">
            {{$t('SCF.total.dxwj')}}
            <el-tooltip placement="top" effect="light">
              <div slot="content">
                {{$t('SCF.total.qtxml')}}
                <br />
                {{$t('SCF.total.wzlj')}}，例如: \"/test/demo.zip\"
              </div>
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </p>
          <div class="ZipFilecontent">
            <el-input v-model="cosInput"></el-input>
          </div>
        </div>

      </div>

      <div class="functest">
        <el-button type="primary" size="small" @click="_Preservation">保存</el-button>
        <el-button size="small" @click="_testModal">{{$t('SCF.total.cs')}}</el-button>
        <span class="testmb">{{$t('SCF.total.csdqmb')}}</span>
        <el-select v-model="testvalue" :placeholder="$t('SCF.total.qsz')" @change="changeTemplate">
          <el-option v-for="(item, i) in templateList" :key="i" :label="item.name" :value="item.name">
            <!-- <span>{{item}}</span> -->
            <!-- <span style="float: right">
              <i class="el-icon-edit" @click="_editModal(item)" />
              &nbsp;
              <i class="el-icon-close" @click="_deleteModal(item)" />
            </span> -->
          </el-option>

        </el-select>
        <span class="testmb">
          <el-button type="text" size="small" @click="newDialog">{{$t('SCF.total.xjmb')}}</el-button>
        </span>
      </div>

      <div class="test-info" v-if="isShowLogList">
        <div class="test-result">
          <h3>
            {{$t('SCF.total.csjg')}}:
            <span style="color: red;">{{testResult.InvokeResult === 0 ? '成功' : '失敗'}}</span>
          </h3>
        </div>
        <div class="back-result">
          <p class="p-blue">{{$t('SCF.total.fhjg')}}:</p>
          <p class="p-result">{{testResult.RetMsg}}</p>
        </div>
        <div class="info-left">
          <p class="p-blue">摘要</p>
          <p>
            <span class="span-blue">{{$t('SCF.total.qqid')}}:</span>
            <span>{{testResult.FunctionRequestId}}</span>
          </p>
          <p>
            <span class="span-blue">{{$t('SCF.total.yxsj')}}:</span>
            <span>{{testResult.Duration}} ms</span>
          </p>
          <p>
            <span class="span-blue">{{$t('SCF.total.jfsj')}}:</span>
            <span>{{testResult.BillDuration}} ms</span>
          </p>
          <p>
            <span class="span-blue">{{$t('SCF.total.yxnc')}}:</span>
            <span>{{testResult.MemUsage}} MB</span>
          </p>
        </div>
        <div class="log-list">
          <p class="p-blue">{{$t('SCF.total.rz')}}</p>
          <p v-html="testResult.Log"></p>
        </div>
      </div>
    </div>

    <!-- 删除模板 dialog -->
    <el-dialog title="提示" :visible.sync="deleteModal" width="35%">
      <p>{{$t('SCF.total.qdschu')}}{{modalName}}嗎?</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="_deleteTestModal">{{$t('SCF.total.qr')}}</el-button>
        <el-button @click="deleteModal = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 编辑模板 dialog -->
    <el-dialog class="edit-template" :title="$t('SCF.total.ghcsmb')" :visible.sync="editModal" width="35%">
      <span>
        {{$t('SCF.total.cssjmb')}}
        <el-tooltip placement="top" effect="light">
          <div slot="content">
            {{$t('SCF.total.mblb')}}
            <br />
            {{$t('SCF.total.bhcfsj')}}
          </div>
          <i class="el-icon-warning"></i>
        </el-tooltip>
      </span>
      <span> {{modalName}}</span>
      <div class="codemirror-div">
        <codemirror ref="mycode" v-model="templateDetail.TestModelValue" :options="cmOptions" class="code">
        </codemirror>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editTemplate">{{$t('SCF.total.qr')}}</el-button>
        <el-button @click="editModal = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 新建模板 dialog -->
    <el-dialog class="new-template" :title="$t('SCF.total.pzsjmb')" :visible.sync="addModal" width="50%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm" size="small">
        <el-form-item :label="$t('SCF.total.cssjmb')" prop="name">
          <el-input type="text" :placeholder="$t('SCF.total.qsrmbmc')" v-model="ruleForm.name" autocomplete="off" style="width:200px"></el-input>
          <p class="p-1">{{$t('SCF.total.zdzszf')}}</p>
          <p class="p-1">{{$t('SCF.total.ts2')}}</p>
        </el-form-item>
        <el-form-item :label="$t('SCF.total.cssjmb')">
          <el-select v-model="testvalue" :placeholder="$t('SCF.total.qsz')" @change="changeTemplate">
            <el-option v-for="(item, i) in templateList" :key="i" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="codemirror-div">
            <codemirror ref="mycode" v-model="codemirrorValue" :options="cmOptions" class="code">
            </codemirror>
          </div>
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
import JsZip from 'jszip'
import {
  SCF_DETAILS,
  LIST_VERSION,
  CLONE_SCF,
  TEST_MODEL,
  TESTMODELS_LIST,
  DELETE_MODAL,
  TEST_MODAL,
  INVOKE,
  UPD_FUN_CODE,
  UPDATE_TEST_MODEL,
  SCF_LIST_COSBUCKETS,
  GetTempCosInfo
} from "@/constants";
import {
  ErrorTips
} from "@/components/ErrorTips";

import {
  codemirror
} from 'vue-codemirror'
import "codemirror/theme/ambiance.css"; // 这里引入的是主题样式，根据设置的theme的主题引入，一定要引入！！
require("codemirror/mode/javascript/javascript"); // 这里引入的模式的js，根据设置的mode引入，一定要引入！！
import {
  defaultTemplate
} from './defaultTemplate'
import openHint from './openHint'
// import COS from 'cos-js-sdk-v5'

// const cos = new COS({
//   getAuthorization: async (_, callback) => {
//     const res = await Vue.prototype.axios({
//       url: 'bucket/uploadKey3',
//       method: 'get'
//     })
//     console.log(res)
//     callback({
//       TmpSecretId: res.data.secretId,
//       TmpSecretKey: res.data.secretKey,
//       XCosSecurityToken: res.data.sessionToken,
//       ExpiredTime: res.data.extra.expiredTime // SDK 在 ExpiredTime 时间前，不会再次调用 getAuthorization
//     })
//   }
// })

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
        label: '在線編輯',
        value: 'Inline'
      },
      {
        label: '本地上傳zip包',
        value: 'ZipFile'
      },
      {
        label: '本地上傳文件夾',
        value: 'TempCos'
      },
      {
        label: '通過cos上傳zip包',
        value: 'Cos'
      }
      ],
      textarea: '測試',
      input1: '',
      fileBase64zip: '', //zip上传
      fileBase64clip: '',
      fileBase64clip1: '', //文件夹上传
      address: '', // 获取到的zip地址
      input2: '',
      cosName: '', //cos桶的名字
      cosInput: '', //cos路径
      cosArr: [],    // 获取到cos的数量
      defaultTemplate: defaultTemplate, // 静态默认模板
      modeloptions: [], // 模板列表
      templateList: [], // 静态默认模板与请求的模板列表集合
      codemirrorValue: `{
        "key1": "test value 1",
        "key2": "test value 2"
      }`, // 弹框编辑器的默认值
      templateDetail: { // 获取模板详情
        TestModelValue: ''
      },
      testvalue: 'Hello World事件範本',
      deleteModal: false, //是否启动删除模板modal
      modalName: '', //模板名称
      editModal: false, //是否启动编辑模板modal
      addModal: false, //是否打开新增modal
      ruleForm: {
        name: '' //名称
      },
      testResult: {}, //测试结果
      isShowLogList: false, //是否显示日志列表
      rules: {
        name: [{
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('範本名稱不能為空'))
            } else if (value.length < 2 || value.length > 45) {
              callback(new Error('範本名稱长度仅限于2到45个字符'))
            } else if (!(/^[a-z][a-z\d-]*$/.test(value))) {
              callback(new Error('範本名稱格式不正確'))
            } else {
              callback()
            }
          },
          trigger: "blur",
          required: true
        }]
      },
      cmOptions: {
        mode: {
          name: 'javascript',
          json: true
        },
        theme: "default",
        readOnly: false,
        tabSize: 2,
        lineNumbers: true, // 显示行号
        lineWrapping: true, //代码折叠
        matchBrackets: true, //括号匹配
      },
      cslsSDK: new CloudStudioLiteFilesServiceSDK() // 初始化编辑器

    }
  },
  created() {

  },
  components: {
    codemirror,
    openHint
  },
  mounted() {

    this.GetDate(); // 获取详情
    this.GetListFunctionTestModels(); // 获取模板列表

    // this.getTempCosToken()

  },
  methods: {

    //获取函数详情数据
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
          this._Clone('address') // 获取地址
          if (res.Response.Status !== 'Active') {
            this.$message({
              message: '執行方法handler上傳錯誤，請查看執行方法handler說明，重新上傳',
              type: "error",
              showClose: true,
              duration: 0
            });
          }
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

    // 获取地址下载
    _Clone(name) {
      console.log(name)
      let param = {
        Region: localStorage.getItem('regionv2'),
        Version: "2018-04-16",
        FunctionName: this.functionName,
        Qualifier: this.functionversion,
        Namespace: this.$route.query.SpaceValue,
      };
      this.axios.post(CLONE_SCF, param).then(res => {
        if (res.Response.Error === undefined) {
          if (name === 'download') {
            window.open(res.Response.Url)
          } else if (name === 'address') {
            this.address = res.Response.Url
            this.getCsLite() // 渲染编辑器
          }

        } else {
          let ErrTips = {
            'FailedOperation.FunctionStatusError': '函數在部署中,無法做此操作',
            'InternalError': '內部錯誤',
            'InternalError.System': '內部系統錯誤',
            'InvalidParameter.Payload': '請求參數不合法',
            'InvalidParameterValue': ' 參數取值錯誤',
            'ResourceNotFound.Function': '函數不存在',
            'ResourceNotFound.FunctionName': '函數不存在',
            'ResourceNotFound.FunctionVersion': '函數版本不存在',
            'ResourceNotFound.Version': '版本不存在',
            'UnauthorizedOperation.CAM': 'CAM鑒權失敗',
            'UnauthorizedOperation.CodeSecret': ' 無訪問程式碼權限'
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
      this.cslsSDK.init({
        rootNode: document.querySelector('#container_editor'),
        modeType: ModeTypeEnum.ZIP,
        i18nType: "zh-tw"
      });
      // https://03-20-1300561189.cos.ap-taipei.myqcloud.com/dasd_LATEST.zip
      this.cslsSDK.addListener({
        onRead: () => {
          return new Promise(res => {
            fetch(this.address, {
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
              })
          })
        }
      })

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
        this.$message.error('文件必須為.zip或者.rar類型')
        return
      }
      // 限制上传文件的大小
      const isLt = file.size / 1024 / 1024 / 100 <= 0.5
      if (!isLt) {
        this.$message.error('最大支持50M（如果zip大於10M，僅顯示入口文件）')
      }
      this.input1 = file.name
      this.getBase64(file.raw).then(resBase64 => {
        this.fileBase64zip = resBase64.split(',')[1] //直接拿到base64信息
      })
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
          this.$message.error('請選擇文件夾（該文件夾根目錄應包含 handler 入口文件），最大支持250M')
          return
        }
        this.getBase64(this.fileBase64clip).then(resBase64 => {
          this.fileBase64clip1 = resBase64.split(',')[1] //直接拿到base64信息
        })
      })


    },

    // 点击新建模板弹出框
    newDialog() {
      this.addModal = true;
      this.changeTemplate() // 触发select下拉模板change事件
    },

    // 新建测试模板 确定事件
    _newmodel() {
      let param = {
        Region: localStorage.getItem('regionv2'),
        Version: "2018-04-16",
        FunctionName: this.functionName,
        TestModelName: this.ruleForm.name,
        TestModelValue: this.templateDetail.TestModelValue,
      };
      this.axios.post(TEST_MODEL, param).then(res => {
        if (res.Response.Error === undefined) {
          this.addModal = false
          this.$message({
            message: "新建測試範本成功",
            type: "success",
            showClose: true,
            duration: 0
          });
          this.GetListFunctionTestModels() // 重新获取列表数据
        } else {
          let ErrTips = {
            'InternalError': '內部錯誤',
            'InvalidParameterValue': '參數取值錯誤',
            'InvalidParameterValue.TestModelName': 'TestModelName傳入錯誤',
            'InvalidParameterValue.TestModelValue': 'testModelValue長度超限',
            'LimitExceeded.FunctionTestModel': 'FunctionTestModel數量超出最大限制',
            'LimitExceeded.TestModel': '同一個函數下測試範本配額個數已達限制',
            'ResourceInUse.TestModel': '測試範本已存在',
            'ResourceInUse.TestModelName': 'TestModelName已存在',
            'ResourceNotFound.Function': '函數不存在',
            'ResourceNotFound.FunctionName': '函數不存在',
            'UnauthorizedOperation.CAM': 'CAM鑒權失敗'
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

    // 二进制转base64
    blobToDataURI(blob, callback) {
      var reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = function (e) {
        callback(e.target.result);
      }
    },

    // 保存 按钮
    _Preservation() {
      let param = {
        Region: localStorage.getItem('regionv2'),
        Version: "2018-04-16",
        FunctionName: this.functionName,
        Handler: this.implementInput,
        Namespace: this.$route.query.SpaceValue
      };

      if (this.SubmissionValue === 'ZipFile') {         // 上传的是zip
        param.ZipFile = this.fileBase64zip
        this.updateCsliteFun(param) // 更新函数代码
      } else if (this.SubmissionValue === 'TempCos') {  // 上传的是文件夹
        param.ZipFile = this.fileBase64clip1
        this.updateCsliteFun(param) // 更新函数代码
      } else if (this.SubmissionValue === 'Inline') {   // 在线编辑
        this.cslsSDK.getBlob().then(blob => {
          this.blobToDataURI(blob, data => { //blob格式再转换为base64格式
            console.log(data)
            const base64Str = data.replace(/^data:application\/\w+;base64,/, "")
            var strLength = base64Str.length;
            var fileLength = parseInt(strLength - (strLength / 8) * 2);
            // 由字节转换为KB
            var sizea = "";
            sizea = (fileLength / 1024).toFixed(2);
            console.log('base64大小' + sizea)

            param.ZipFile = base64Str;  // 正则替换哈 imgData 为base64字符串
            this.updateCsliteFun(param) // 更新函数代码
          })

        })
      } else if (this.SubmissionValue === 'Cos') {         // 上传的是COS
        param.CosBucketName = this.cosName
        param.CosObjectName = this.cosInput
        param.CosBucketRegion = localStorage.getItem('regionv2')
        this.updateCsliteFun(param)     // 更新函数代码
      }
    },

    // 获取临时token 用作在线编辑的cos上传
    getTempCosToken() {
      const objectPath = `${this.$cookie.get("appid")}/${this.$route.query.SpaceValue}/${this.functionName}.zip`
      let params = {
        ObjectPath: objectPath,
        Region: localStorage.getItem('regionv2'),
        Type: "",
        Version: "2018-04-16"
      }
      this.axios.post('http://152.136.25.227:8868/product/' + GetTempCosInfo, params).then(res => {
        if (res.Response.Error === undefined) {
          // this.$message({
          //   message: '保存成功',
          //   type: "success",
          //   showClose: true,
          //   duration: 0
          // });
          location.reload()
        } else {
          this.$message({
            message: '保存失敗',
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },

    // 更新函数代码
    updateCsliteFun(param) {
      this.axios.post(UPD_FUN_CODE, param).then(res => {
        if (res.Response.Error === undefined) {
          // this.$message({
          //   message: '保存成功',
          //   type: "success",
          //   showClose: true,
          //   duration: 0
          // });
          location.reload()
        } else {
          this.$message({
            message: '保存失敗',
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },

    // 获取函数测试模板 --> 列表
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
          this.templateList = []
          this.templateList = this.defaultTemplate // 把默认的模板赋值给模板列表 在通过下面的for循环 把自定义的模板push进来
          this.testvalue = this.templateList[0].name
          console.log(this.templateList)
          console.log(this.modeloptions)
          if (this.modeloptions.length !== 0) {
            this.modeloptions.forEach((item, i) => {
              this.GetFunctionTestModel(item)
            })
          }
        } else {
          let ErrTips = {
            "InternalError": "內部錯誤",
            "InvalidParameterValue": "參數取值錯誤",
            "ResourceNotFound.Function": "函數不存在。",
            "ResourceNotFound.FunctionName": "函數不存在。",
            "UnauthorizedOperation.CAM": "CAM鑒權失敗。"
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

    // 获取函数测试模板 --> 详情
    GetFunctionTestModel(name) {
      let param = {
        Region: localStorage.getItem('regionv2'),
        Version: "2018-04-16",
        Action: 'DeleteFunctionTestModel',
        FunctionName: this.functionName,
        Namespace: this.$route.query.SpaceValue,
        TestModelName: name
      };

      this.axios.post(TEST_MODAL, param).then(res => {
        if (res.Response.Error === undefined) {
          this.templateDetail = res.Response
          this.templateList.push({ // 把自定义的模板push到templateList模板列表里面
            name: name,
            code: this.templateDetail.TestModelValue
          })
        } else {
          let ErrTips = {
            "InternalError": "內部錯誤",
            "InvalidParameterValue": "參數取值錯誤",
            "ResourceNotFound.FunctionName": "函數不存在。",
            "UnauthorizedOperation.CAM": "CAM鑒權失敗。",
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

    // select选中改变模板
    changeTemplate() {
      this.templateList.forEach((item, i) => {
        if (item.name === this.testvalue) {
          this.codemirrorValue = item.code
        }
      })
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
      this.GetFunctionTestModel(name);
    },

    //删除测试模板
    _deleteTestModal() {
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
          this.deleteModal = false;
          this.modalName = '';
          this.GetListFunctionTestModels();
          this.$message({
            message: "刪除成功",
            type: "success",
            showClose: true,
            duration: 0
          });
        } else {
          let ErrTips = {
            "InternalError": "內部錯誤",
            "InvalidParameterValue": "參數取值錯誤",
            "ResourceNotFound.Function": "函數不存在。",
            "ResourceNotFound.FunctionName": "函數不存在。",
            "UnauthorizedOperation.CAM": "CAM鑒權失敗。",
            "ResourceNotFound.FunctionTestModel": "FunctionTestModel不存在。",
            "ResourceNotFound.TestModel": "測試範本不存在。"
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

    // 测试模板 点击函数
    _testModal() {
      let param = {
        Version: "2018-04-16",
        Region: localStorage.getItem('regionv2'),
        FunctionName: this.functionName,
        InvocationType: "RequestResponse",
        LogType: "Tail",
        ClientContext: this.codemirrorValue,
        Qualifier: this.functionversion,
        Namespace: this.$route.query.SpaceValue
      }

      this.axios.post(INVOKE, param).then(res => {
        if (res.Response.Error === undefined) {
          this.testResult = res.Response.Result;
          this.testResult.Log = this.trim(res.Response.Result.Log)
          this.isShowLogList = true;
        } else {
          let ErrTips = {
            "InternalError": "內部錯誤",
            "InvalidParameterValue": "參數取值錯誤",
            "ResourceNotFound.FunctionName": "函數不存在。",
            "UnauthorizedOperation.CAM": "CAM鑒權失敗。",
            "ResourceNotFound.FunctionTestModel": "FunctionTestModel不存在。",
            "FailedOperation.FunctionStatusError": "函數在部署中,無法做此操作。",
            "FailedOperation.InvokeFunction": "調用函數失敗。",
            "InternalError.System": "內部系統錯誤。",
            "InvalidParameterValue.Param": "入參不是標準的json。",
            "ResourceNotFound.Function": "函數不存在。",
            "ResourceUnavailable.InsufficientBalance": "餘額不足，請先充值。"
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

    // 换行符变为br标签
    trim(str) { //str表示要转换的字符串
      return str.replace(/\n|\r\n/g, "<br/>");
    },

    // 提交方法 切换
    changSubmit() {
      if (this.SubmissionValue === 'Cos') {
        this.getCosList()     // 点击cos获取cos的数据
      }
    },

    // 编辑更新模板
    editTemplate() {
      let param = {
        Region: localStorage.getItem('regionv2'),
        Version: "2018-04-16",
        Action: 'DeleteFunctionTestModel',
        FunctionName: this.functionName,
        Namespace: this.$route.query.SpaceValue,
        TestModelName: this.modalName,
        TestModelValue: this.templateDetail.TestModelValue
      };

      this.axios.post(UPDATE_TEST_MODEL, param).then(res => {
        if (res.Response.Error === undefined) {
          this.editModal = false
          this.$message({
            message: "更換測試範本成功",
            type: "success",
            showClose: true,
            duration: 0
          });
        } else {
          this.$message({
            message: "更換測試範本失敗",
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },

    // 请求COS的存储桶数据
    getCosList() {
      const params = {
        Region: localStorage.getItem("regionv2"),
        Version: "2017-03-12"
      };
      this.axios.post(SCF_LIST_COSBUCKETS, params).then(res => {
        var data = res.Buckets.Bucket;
        this.cosArr = [];
        data.forEach((item, index) => {
          if (item.Location == localStorage.getItem("regionv2")) {
            let bucketName = item.Name.split('-')
            bucketName.pop()
            item.Name = bucketName.join("-")
            this.cosArr.push(item);
          }
        });
        console.log(this.cosArr)
        // if (arr.length == 0) {
        //   this.BucketSelect.name = "";
        // } else {
        //   arr.forEach(item => {
        //     if (item.name == this.detailData.CosBucketName) {
        //       this.BucketSelect.name = item.name;
        //     }
        //   });
        // }
        // this.BucketSelect.options = arr;
        //解决 数据更新页面不更新

      });
    },

    // 执行方法提醒
    openHint() {
      this.$notify({
        title: '執行方法說明',
        dangerouslyUseHTMLString: true,
        duration: 0,
        message: <openHint></openHint>
      });
    }
  }
}

</script>
<style lang="scss" scoped>
.CodeContent {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  .el-icon-question {
    font-size: 12px;
    cursor: pointer;
  }

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
        width: 110px;
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
      margin-top: 10px;
      height: 60px;
      width: 100%;
      background-color: rgb(242, 242, 242);

      .p-blue {
        padding: 10px 0 0 10px;
        font-size: 12px;
        color: rgb(48, 127, 220);
      }

      .p-result {
        padding: 10px 0 0 10px;
        font-size: 12px;
      }
    }

    .info-left {
      background-color: rgb(242, 242, 242);
      width: 300px;
      float: left;
      margin: 20px 20px 0px 0px;
      height: 300px;

      > p {
        padding: 10px 0 0 10px;
      }

      .span-blue {
        color: rgb(48, 127, 220);
        padding-right: 5px;
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
      }

      .p-blue {
        padding: 10px 0 0 10px;
        font-size: 12px;
        color: rgb(48, 127, 220);
      }
    }
  }
  .el-icon-warning {
    font-size: 12px;
    cursor: pointer;
  }
}

.edit-template {
  .el-icon-warning {
    font-size: 12px;
    cursor: pointer;
  }

  .codemirror-div {
    margin-top: 10px;
    border: 1px solid #e7e7e7;
  }
}

.new-template {
  .p-1 {
    font-size: 12px;
    line-height: 20px;
  }

  .codemirror-div {
    margin-top: 10px;
    border: 1px solid #e7e7e7;
    /* width: 100%; */
  }
}
</style>
