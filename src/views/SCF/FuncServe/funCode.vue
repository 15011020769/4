<template>
  <div>
    <div class="contentMain">
      <div class="contentMainList">
        <div class="newClear">
          <el-form :model="funCodeForm" label-width="130px" class="formLeftInput newClear">
            <el-form-item label="提交方法" :required="true" class="floatLeftItem">
              <span slot="label">
                提交方法
                <i class="el-icon-question"></i>
              </span>
              <el-select v-model="funCodeForm.methodsTip" class="selectSetWidth" @change="chooseSelect">
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
              <el-input v-model="funCodeForm.zxMethods" />
            </el-form-item>
            <el-form-item label="运行环境" class="floatLeftItem">
              <span>{{funCodeForm.runMoment}}</span>
            </el-form-item>
          </el-form>
          <div class="formRightInput">
            <el-select v-model="downLoadZip" placeholder="下载" class="selectSetWidth">
              <el-option label="下载代码包" value="code"></el-option>
              <el-option label="下载YAML文件" value="yaml"></el-option>
            </el-select>
          </div>
        </div>
        <div class="codeShow" v-if="codeShow"></div>
        <div class="uploadZipBack" v-if="uploadZipBackBack">

        </div>
        <div class="uploadCos" v-if="uploadCos"> 

        </div>
        <div class="bottomBtn newClear">
          <el-button type="primary">保存</el-button>
          <el-button>测试</el-button>
          <el-form>
            <el-form-item label="当前测试模板" :required="true" class="floatLeftItem">
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
                    <el-input plcarholder="请输入模板名称" v-model="configTestModel.modelName"/>
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
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      funCodeForm: {
        methodsTip: "inline",
        zxMethods: "index.main_handler",
        runMoment: "Python2.7"
      },
      downLoadZip: "",
      codeShow: true,
      modelList:"Hello World事件模板",
      newCreateModel:false,
      configTestModel:{
        modelName:"",
        useModelCode:""
      },
      uploadZipBackBack:false,
      uploadCos:false
    };
  },
  methods: {
    newCreateModelClose(){
      this.newCreateModel=false;
    },
    //配置测试模板确定按钮
    configCodeSure(){
      this.newCreateModel=false;
    },
    //监测提交方法下拉框
    chooseSelect(){
      if(this.funCodeForm.methodsTip=="inline"){
        this.codeShow=true;
      }else{
        this.codeShow=false;
        if(this.funCodeForm.methodsTip=="zipFile"||this.funCodeForm.methodsTip=="folder"){
          console.log(this.funCodeForm.methodsTip)
          this.uploadZipBackBack=true;
        }else{
          this.uploadZipBackBack=false;
          if(this.funCodeForm.methodsTip=="cos"){
            this.uploadCos=true;
          }else{
            this.uploadCos=false;
          }
        }
      }
    }
  }
};
</script>
<style lang="scss">
.formLeftInput {
  float: left;
  .floatLeftItem {
    float: left;
    margin-right: 30px;
  }
}
.formRightInput {
  float: right;
}
.codeShow {
  width: 100%;
  min-height: 300px;
  background-color: #fff;
  border: 1px solid #ddd;
}
.bottomBtn{
  padding:20px 0;
  border-top:1px solid #ddd;
  margin-top:20px;
  button{
    float:left;
    margin-right:10px;
  }
}
.el-select-dropdown{
  position:relative;
  p{
    position:absolute;
    bottom:0;
    margin-top:30px;
    width:100%;
    line-height:30px;
    background-color:#fff;
    border-top:1px solid #ddd;
    color:#3E8EF7;
    text-indent:12px;
  }
}
.codeBox{
  border:1px solid #ddd;
  min-height:200px;
}
</style>