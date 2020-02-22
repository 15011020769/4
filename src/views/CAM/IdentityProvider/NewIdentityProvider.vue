<template>
  <div class="Cam wrap" id="app">
    <HeadCom title="新建身份提供商" :backShow="true" @_back="_back" />
    <div class="container" v-loading="loading">
      <el-steps
        :active="active"
        simple
        finish-status="success"
        style="background: #fff; padding-top: 20px;padding-left: 10px;width:500px"
      >
        <el-step :title="$t('CAM.strategy.pztgsxx')"></el-step>
        <el-step :title="$t('CAM.strategy.completes')"></el-step>
      </el-steps>
      <hr style="margin-top:10px;" />
      <div v-show="active==0" style="width:100%;">
        <el-form :model="addModel" :rules="rules" size="mini" ref="ruleForm" label-width="100px">
          <el-form-item :label="$t('CAM.strategy.peopleType')" prop="providerType">
            <el-col :span="10">
              <!-- <el-radio size="mini" v-model="addModel.providerType" label="SAML">SAML</el-radio> -->
              <span>SAML</span>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('CAM.strategy.peopleName')" prop="providerName">
            <el-input size="mini" ref="providerNameRules" v-model="addModel.providerName" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item :label="$t('CAM.userList.userRemark')" prop="remark">
            <el-input size="mini" type="text" v-model="addModel.remark" style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item :label="$t('CAM.strategy.dataFile')" prop="metadataDocument" :error="metadataDocumentError">
            <el-upload
              size="mini"
              accept="text/xml, application/xml"
              class="upload-demo"
              :limit="1"
              action=""
              :show-file-list="false"
              :on-change="handleChange"
            >
              <el-row type="flex" :gutter="20">
                <el-col>
                  <el-input :disabled="true" v-model="addModel.metadataDocument" style="width: 200px"></el-input>
                </el-col>
                <el-col>
                  <el-button size="mini">{{$t('CAM.strategy.chooseFile')}}</el-button>
                </el-col>
              </el-col>
            </el-row>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="active==1" style="width:100%;">
        <SecondStep :form="addModel" />
      </div>
      <div style="width:100%">
        <el-button v-show="active>0" size="small" type="primary" @click="step">上一步</el-button>
        <el-button
          v-show="active<1"
          size="small"
          type="primary"
          style="margin-top: 12px;"
          @click="next('ruleForm')"
        >下一步</el-button>
        <!-- <el-button v-show="active==1" type="primary" @click="step">返回</el-button> -->
        <el-button v-show="active==1" size="small" type="primary" @click="confirm">{{$t('CAM.strategy.qr')}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import SecondStep from "./CheckAccomplish.vue";
import HeadCom from "../UserListNew/components/Head";
import { CREATE_SAML, CHECK_SAML_METADATA } from "@/constants";
import { type } from "os";
export default {
  name: "app",
  data() {
    return {};
  },
  components: {
    SecondStep,
    HeadCom
  },
  data() {
    return {
      metadataDocumentError: '',
      loading: false,
      form: {},
      active: 0,
      base64encode: '',
      addModel: {
        providerType: "SAML",
        providerName: "",
        remark: "",
        metadataDocument: ""
      },
      rules: {
        remark: [
          {
            required: true,
            message: "請輸入描述",
            trigger: "blur"
          }
        ],
        providerType: [
          {
            required: true,
            message: "請選擇提供商類型",
            trigger: "blur"
          }
        ],
        providerName: [
          {
            required: true,
            message: "請輸入名稱",
            trigger: "blur"
          },
          {
            pattern: /^[a-zA-Z0-9+=,.@_-]+$/g,
            message: '請輸入正確的名稱,支持3-128個數字、大小寫字母、和+=,.@_-'
          },
          { min: 3, max: 128, message: '請輸入正確的名稱,支持3-128個數字、大小寫字母、和+=,.@_-', trigger: 'blur' }
        ],
        metadataDocument: [
          {
            required: true,
            message: "請選擇元數據文件",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              callback(this.metadataDocumentError)
              // callback()
            }
          }
        ]
      }
    };
  },
  methods: {
    handleChange(file) {
      this.metadataDocumentError = ''
      if (!file.name.endsWith('.xml')) {
        this.metadataDocumentError = '文件类型无效，请上传类型为xml的文件'
        return
      }
      this.addModel.metadataDocument = file.name;
      var reader = new FileReader();
      reader.onload = e => {
        let textxml = e.currentTarget.result;
        let base64encode
        try {
          base64encode = btoa(textxml)
          this.axios.post(CHECK_SAML_METADATA, {
            Version: '2019-01-16',
            SAMLMetadataDocument: base64encode
          }).then(res => {
            if (res.Response.Error) {
              this.metadataDocumentError = '元数据文档内容有误'
            } else  {
              this.base64encode = base64encode
            }
          })
        } catch {
            this.metadataDocumentError = '元数据文档内容有误'
        }
      };
          reader.readAsText(file.raw);
    },
    //返回上一级
    _back() {
      this.$router.go(-1);
    },
    goback() {
      this.$router.push({
        name: "IdentityProvider"
      });
    },
    next(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.active += 1
        } else {
          return false;
        }
      });
    },
    step() {
      if (this.active > 0) {
        this.active--;
      }
    },
    confirm() {
      if (this.active == 1) {
        this.loading = true;
        const params = {
          Version: "2019-01-16",
          Name: this.addModel.providerName,
          Description: this.addModel.remark,
          SAMLMetadataDocument: this.base64encode
        };
        this.axios.post(CREATE_SAML, params).then(res => {
          if (res.Response.Error === undefined) {
            this.loading = false;
            this.$message({
              message: "添加成功",
              type: "success",
              duration: 0,
              showClose: true
            });
            this.$router.push({
              name: "IdentityProvider"
            });
          } else {
            let ErrTips = {
              "InvalidParameter.IdentityNameInUse": "身份提供商名稱已經使用",
              "InvalidParameterValue.MetadataError":
                "身份提供商元數據文件錯誤",
              "InvalidParameterValue.NameError": "身份提供商名稱錯誤",
              "LimitExceeded.IdentityFull": "身份提供商已達到上限"
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
.wrap >>> .el-button,
.wrap >>> .el-input__inner {
  border-radius: 0;
  height: 30px !important;
  line-height: 30px;
  padding-top: 0;
  font-size: 12px;
}
.Cam {
  .top {
    height: 45px;
    line-height: 45px;
    margin-bottom: 20px;
    padding: 0 20px;
    background: #fff;

    .title-left {
      display: inline-block;
      vertical-align: middle;
      font-size: 18px;
      font-weight: 700;
      margin-left: 20px;
      max-width: 70%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      height: 30px;
      line-height: 30px;
    }

    .backoff {
      font-size: 140%;
      font-weight: 900;
      color: #006eff;
      cursor: pointer;
    }
  }

  .container >>> .el-step__title {
    font-size: 15px;
  }

  .container >>> .el-radio__label {
    font-size: 12px;
  }

  .container >>> .el-form-item__label {
    text-align: left;
    font-size: 12px;
  }

  .container >>> .el-input {
    width: 200px;
  }
  .container >>> .el-form-item {
    margin-bottom: 12px;
  }
  .container >>> .el-input__inner {
    padding-left: 5px;
    border-radius: 0;
    height: 30px;
    line-height: 30px;
  }

  .container {
    width: 96%;
    height: 100%;
    // height:570px;
    // min-height: 500px;
    margin: 0 auto;
    background: #fff;
    padding: 20px 40px;
    padding-bottom: 30px;
    margin-top: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    hr {
      padding: 0;
      border: none;
      border-bottom: 1px solid #ddd;
      margin: 20px 0;
    }

    p.title,
    p.explain {
      text-align: center;
      line-height: 20px;
      font-size: 16px;
      color: #000;
      font-weight: 700;
    }

    p.explain {
      font-size: 12px;
      color: #ccc;
      margin-top: 10px;
      line-height: 16px;
      color: #666;
    }

    .buttons {
      margin-top: 25px;

      p {
        margin-bottom: 10px;
      }

      .el-button--primary.is-plain {
        color: #0075ff;
        border: 1px solid #006eff;
        background: #fff;
        display: block;
        margin: 0 auto;
        padding: 0 30px;
        max-width: 150px;
        height: 30px;
        line-height: 28px;
        font-size: 12px;
        box-sizing: border-box;
        white-space: nowrap;
        text-overflow: ellipsis;
        border-radius: 0;
        overflow: hidden;
      }

      .el-button--primary.is-plain:hover {
        color: #fff;
        background-color: #006eff;
        text-decoration: none;
      }
    }
  }

  .cam_button {
    width: 96%;
    margin: 10px auto;
  }

  .cam-lt {
    float: left;
  }

  .head-container {
    float: right;
  }

  .cam_button {
    position: relative;
  }

  .suo {
    position: absolute;
    right: 0;
  }
}
</style>
