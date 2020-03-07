<template>
  <div>
    <div class="CodeContent">
      <div class="CodeTool">
        <div class="CodeTool-frist">
          <P>
            <span>
              提交方法<i class="el-icon-question"></i>
            </span>
            <el-select v-model="SubmissionValue" placeholder="请选择" class="select">
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
          <p class="CourseRight">
            <a href="">Python2.7 开发教程</a>
          </p>
          <p>
            <el-dropdown trigger="click">
              <el-button size="small">
                下载
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>下载代码包</el-dropdown-item>
                <el-dropdown-item>下载YAML文件</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </p>
        </div>
      </div>

      <div v-if="SubmissionValue==='Inline'" class="content">
        <el-input type="textarea" :rows="10" placeholder="请输入内容" v-model="textarea">
        </el-input>
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
        <input type="file" multiple directory mozdirectory webkitdirectory @change="fileClip" class="inputfile"
          id="webk" v-show="false" />

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
    </div>
  </div>
</template>
<script>
  import
  JsZip
  from 'jszip'
  import {
    SCF_DETAILS,
    LIST_VERSION
  } from "@/constants";
  export default {
    props: ['FunctionVersion'],
    data() {
      return {
        functionName: this.$route.query.functionName,
        SubmissionValue: 'Inline', //提交方法
        implementInput: '', //执行方法
        ScienceValue: 'Python2.7', //运行环境
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
        fileBase64clip: '', //文件夹上传
        input2: '',
        Cosoptions: [],
        cosvalue: '', //cos
        input3: '', //cos路径
      }
    },
    created() {},
    methods: {
      //获取详情数据
      GetDate() {
        let param = {
          Region: localStorage.getItem('regionv2'),
          Version: "2018-04-16",
          FunctionName: this.functionName,
        };
        this.axios.post(SCF_DETAILS, param).then(res => {

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
      filezip(file) {
        console.log(file)
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
        console.log(file.raw)
        this.getBase64(file.raw).then(resBase64 => {
          this.fileBase64zip = resBase64.split(',')[1] //直接拿到base64信息
        })
        return isLt
      },
      _fileClip() {
        document.getElementById('webk').click()
      },
      fileClip(file) {
        let clip = file.target.files
        console.log(clip.length)
        console.log(clip)
        // this.getBase64(clip).then(resBase64 => {
        //   this.fileBase64clip = resBase64.split(',')[1] //直接拿到base64信息
        // })

        // var JSZip = require("jszip");
        // var zip = new JSZip();
        // zip.file('sss', '222');
        // var img = zip.folder("zipllll");
        // img.file(clip[0].name, clip[0].webkitRelativePath, {
        //   base64: true
        // });
        // zip.generateAsync({
        //     type: "blob"
        //   })
        //   .then(function (content) {
        //     // see FileSaver.js
        //     saveAs(content, "example.zip");
        //   });

      },


    }
  }

</script>
<style lang="scss" scoped>
  .CodeContent {
    height: 500px;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, .2);
    padding: 20px;

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

          ::v-deep .el-select {
            width: 200px !important;
          }

          ::v-deep .el-input__inner {
            width: 200px !important;
          }

          ::v-deep .el-input {
            width: 200px !important;
          }

        }
      }





    }

    .content {
      ::v-deep .el-input {
        width: 200px;
      }

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


  }

</style>
