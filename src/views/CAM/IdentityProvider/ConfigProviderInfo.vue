<template>
  <div class="Cam">
    <div class="container">
      <el-form :model="addModel" :rules="rules" size="mini" ref="addModel" label-width="100px">
        <el-form-item label="供应商类型" prop="providerType" >
            <el-col :span="14">
                <el-radio size="mini" v-model="addModel.providerType" label="SAML">SAML</el-radio>
            </el-col>
        </el-form-item>
        <el-form-item label="供应商名称" prop="providerName" >
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
            <el-upload size="mini"
                accept="text/xml, application/xml"
                class="upload-demo"
                action=""
                :on-change="handleChange">
                <el-col :span="21">
                 <div style="display:inline-block; width:100%; padding-right:10px;"><el-input :disabled="true" v-model="addModel.metadataDocument"></el-input></div>
                </el-col>
                <el-col :span="2">
                 <div style="display:inline-block"><el-button size="mini" >选择文件</el-button></div>
                </el-col>
            </el-upload>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      addModel: Object
    },
    data() {
      return {
        // addModel: {
        //     providerType: 'SAML'
        // },
        rules: {
          providerType: [
            { required: true, message: '请选择提供商类型', trigger: 'blur' }
          ],
          providerName: [
            { required: true, message: '请输入用户组名称', trigger: 'blur' }
          ],
          metadataDocument: [
            { required: true, message: '请选择元数据文档', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
        handleChange() {

        },
      create() {
        // let params = {
        //   name: this.addModel.providerName,
        //   desc: this.addModel.remark,
        //   SAMLMetadataDocument: ''
        // }
        // this.$axios.post('cam2/CreateSAMLProvider', params).then(res => {
        // })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .Cam {
  .container {
    width:96%;
    height:200px;
    min-height: 200px;
    margin:10px auto 0;
    background: #fff;
    padding:20px;
    padding-right: 50%;
    p.title,p.explain{
      text-align: center;
      line-height: 20px;
      font-size: 16px;
      color: #000;
      font-weight: 700;
    }
    p.explain {
      font-size: 12px;
      color:#ccc;
      margin-top: 10px;
      line-height: 16px;
      color: #666;
    }
    .upload-demo{
        display: inline-block;
    }
    .el-input__inner{
      width: 200px;
    }
  }

}
</style>