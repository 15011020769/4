<template>
  <div class="Cam wrap" id="app">
    <HeadCom :title="info.Name" :backShow="true" @_back="_back" />
    <el-card class="container">
      <el-row class="item">
        <el-col style="width: 100PX"><h3>提供商信息</h3></el-col>
      </el-row>
      <el-row class="item">
        <el-col style="width: 100PX"><span>提供商类型</span></el-col>
        <el-col>SMAL</el-col>
      </el-row>
      <el-row class="item">
        <el-col style="width: 100PX"><span>提供商名称</span></el-col>
        <el-col>{{info.Name}}</el-col>
      </el-row>
      <el-row class="item">
        <el-col style="width: 100PX"><span>描述</span></el-col>
        <el-col v-if="!showEditDescription">{{info.Description}} <i class="el-icon-edit" @click="showEditDescription=true"></i></el-col>
        <el-col v-else>
          <el-input v-model="description" style="width: 150px" />&nbsp;
          <el-button type="text" size="mini" @click="updateDescription">保存</el-button>
          <el-button type="text" size="mini" @click="showEditDescription=false">取消</el-button>
        </el-col>
      </el-row>
      <el-row class="item">
        <el-col style="width: 100PX"><span>元数据文档</span></el-col>
        <el-col>
          <el-button type="text" @click="dialogVisible=true">上传</el-button>&nbsp;
          <el-button type="text" @click="download">下载</el-button>
        </el-col>
      </el-row>
      <el-row class="item">
        <el-col style="width: 100PX"><span>最后修改时间</span></el-col>
        <el-col>{{info.ModifyTime}}</el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="元数据上传"
      :visible.sync="dialogVisible"
      width="30%"
      destroy-on-close
    >
      <el-form :model="addModel" :rules="rules" size="mini" ref="ruleForm" label-width="100px">
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
      <el-row slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateSAMLMetadata">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import HeadCom from "../UserListNew/components/Head";
import { GET_SAML_PROVIDER, UPDATE_SAML_PROVIDER } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  components: {
   HeadCom
  },
  data() {
    return {
      metadataDocumentError: '',
      base64encode: '',
      addModel: {
        metadataDocument: ""
      },
      rules: {
        metadataDocument: [
          {
            required: true,
            message: "請選擇元數據文件",
            trigger: "blur"
          }
        ]
      },
      dialogVisible: false,
      showEditDescription: false,
      description: '',
      info: {}
    }
  },
  mounted() {
    this.init()
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
              this.metadataDocumentError = '元数据文档2内容有误'
            } else  {
              this.base64encode = base64encode
            }
          })
        } catch {
          this.metadataDocumentError = '元数3据文档内容有误'
        }
      };
      reader.readAsText(file.raw);
    },
    init() {
      this.axios.post(GET_SAML_PROVIDER, {
        Version: '2019-01-16',
        Name: this.$route.params.name
      }).then(res => {
        if (res.Response.Error === undefined) {
          this.info = res.Response
          this.description = res.Response.Description
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      })
    },
    updateDescription() {
      const info = {
        ...this.info,
        Description: this.description
      }
      this.update(info, () => {
        this.showEditDescription = false
      })
    },
    updateSAMLMetadata() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const info = {
            ...this.info,
            SAMLMetadata: this.base64encode
          }
          this.update(info, () => {
            this.dialogVisible = false
            this.base64encode = ''
          })
        }
      });
    },
    update(info, cb) {
      this.axios.post(UPDATE_SAML_PROVIDER, {
        Version: '2019-01-16',
        Name: info.Name,
        Description: info.Description,
        SAMLMetadataDocument: info.SAMLMetadata
      }).then(res => {
        if (res.Response.Error === undefined) {
          this.$message({
            message: '修改成功',
            type: "success",
            showClose: true,
            duration: 0
          });
          this.init()
          cb()
        } else {
          let ErrTips = {
            'ResourceNotFound.IdentityNotExist': '身份提供商不存在'
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      })
    },
    _back() {
      this.$router.go(-1);
    },
    download() {
      const e = atob(this.info.SAMLMetadata)
      const t = 'meta.xml'
      if (window.Uint8Array && window.Blob) {
        try {
          var n = new Blob([new Uint8Array([239, 187, 191]), e],{
              type: "text/plain;charset=utf-8"
          });
          if (window.navigator.msSaveOrOpenBlob)
              window.navigator.msSaveOrOpenBlob(n, t);
          else if ("download"in document.createElement("a")) {
              var r = document.createElement("a")
                , a = URL.createObjectURL(n);
              r.href = a,
              r.download = t,
              document.body.appendChild(r),
              r.click(),
              document.body.removeChild(r),
              window.URL.revokeObjectURL(a)
          } else {
            this.$message({
              message: '浏览器暂不支持',
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        } catch (e) {
          this.$message({
            message: '浏览器暂不支持',
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      } else {
        this.$message({
          message: '浏览器暂不支持',
          type: "error",
          showClose: true,
          duration: 0
        });
      }
    }
  }
}
</script>
<style lang="scss" scope>
  .container {
    margin: 20px 24px;
    .item {
      display: flex;
      height: 40px;
      line-height: 40px;
      .el-icon-edit {
        cursor: pointer;
      }
      span {
        font-size: 12px;
        color: #888;
      }
      button span {
        color: inherit;
      }
    }
  }
</style>