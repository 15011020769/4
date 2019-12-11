<template>
  <div class="Cam" id="app">
    <HeadCom title="新建身份提供商" :backShow="true" @_back="_back" />
    <div class="container">
      <el-steps
        :space="160"
        :active="active"
        simple
        style="background: #fff; padding-top: 20px;margin-right: 450px;padding-left: 10px;"
      >
        <el-step title="配置提供商信息"></el-step>
        <el-step title="审阅并完成"></el-step>
      </el-steps>
      <hr style="margin-top:10px;" />
      <div v-show="active==0">
        <el-form :model="addModel" :rules="rules" size="mini" ref="ruleForm" label-width="100px">
          <el-form-item label="供应商类型" prop="providerType">
            <el-col :span="14">
              <el-radio size="mini" v-model="addModel.providerType" label="SAML">SAML</el-radio>
            </el-col>
          </el-form-item>
          <el-form-item label="供应商名称" prop="providerName">
            <el-col :span="14">
              <el-input size="mini" ref="providerNameRules" v-model="addModel.providerName"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-col :span="14">
              <el-input size="mini" type="text" v-model="addModel.remark"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="元数据文档" prop="metadataDocument">
            <el-upload
              size="mini"
              accept="text/xml, application/xml"
              class="upload-demo"
              :limit="1"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-change="handleChange"
            >
              <el-col :span="21">
                <div style="display:inline-block; width:100%;margin-left:-25px;">
                  <el-input :disabled="true" v-model="addModel.metadataDocument"></el-input>
                </div>
              </el-col>
              <el-col :span="2">
                <div style="display:inline-block">
                  <el-button size="mini">选择文件</el-button>
                </div>
              </el-col>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="active==1">
        <SecondStep :form="addModel" />
      </div>
      <br />
      <br />
      <el-button v-show="active>0" size="small" type="primary" @click="step">上一步</el-button>
      <el-button
        v-show="active<1"
        size="small"
        type="primary"
        style="margin-top: 12px;"
        @click="next('ruleForm')"
      >下一步</el-button>
      <!-- <el-button v-show="active==1" type="primary" @click="step">返回</el-button> -->
      <el-button v-show="active==1" size="small" type="primary" @click="confirm">确认</el-button>
    </div>
  </div>
</template>
<script>
import SecondStep from "./CheckAccomplish.vue";
import HeadCom from "../UserListNew/components/Head";
import { CREATE_SAML } from "@/constants";
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
      form: {},
      active: 0,
      addModel: {
        providerType: "SAML",
        providerName: "",
        remark: "",
        metadataDocument: ""
      },
      rules: {
        providerType: [
          {
            required: true,
            message: "请选择提供商类型",
            trigger: "blur"
          }
        ],
        providerName: [
          {
            required: true,
            message: "请输入用户组名称",
            trigger: "blur"
          }
        ],
        metadataDocument: [
          {
            required: true,
            message: "请选择元数据文档",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    handleChange(file) {
      this.addModel.metadataDocument = file.name;
      var reader = new FileReader();
      reader.onload = function(e) {
        let textxml = e.currentTarget.result;
        var encode = encodeURI(textxml);
        // 对编码的字符串转化base64
        var base64 = btoa(encode);
        localStorage.setItem("base64", base64);
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
          console.log(this.addModel);
          const params = {
            Version: "2019-01-16",
            Name: this.addModel.providerName,
            Description: this.addModel.remark,
            SAMLMetadataDocument: localStorage.getItem("base64")
          };
          console.log(params);
          this.axios.post(CREATE_SAML, params).then(res => {
            console.log(res)
            if (res.Response.Error.Code) {
              this.$message.error(res.Response.Error.Code);
            } else {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              const addModel = this.addModel;
              if (this.active++ > 1) {
                this.active = 0;
                this.form = this.addModel;
              }
            }
            console.log(res);
          });
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
        this.$router.push({
          name: "IdentityProvider"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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
    padding: 10px 40px;
    margin-top: 20px;
    box-sizing: border-box;

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
