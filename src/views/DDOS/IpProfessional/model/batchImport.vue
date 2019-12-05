<template>
  <div>
    <div>
      <el-dialog class="dialogModel"
        title="批量导入"
        :visible.sync="getIsShow1"
        width="30%"
        :before-close="handleClose">
        <div class="importAll">
          <span class="importLabel">规则</span>
          <span class="importIpt">
            <el-input type="textarea" v-model="importRules"/>
            <p class="margibBot">示例：业务域名只能全部省略或全部导入</p>
            <p>有业务域名:</p>
            <p>dayu.com TCP 1234 4321 1.1.1.1 10或dayu.com TCP 1234 4321 a.com</p>
            <p>省略业务域名:</p>
            <p class="margibBot">TCP 1234 4321 1.1.1.1 10或TCP 1234 4321 a.com</p>
            <p class="margibBot">注意：粘贴内容从左至右依次为业务域名(选填)、协议、转发端口、源站端口、回源IP和权重（或回源域名），中间由空格分隔。一行只能填写一条转发规则。</p>
          </span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="batchImportSure">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    isShow1:Boolean,
  },
  computed:{
    getIsShow1(){
      this.dialogVisible1=this.isShow1
      return this.isShow1
    }
  },
  data(){
    return{
      dialogVisible1:'',//批量导入弹框
      importRules:'',//批量导入规则
    }
  },
  methods:{
    //弹框确定按钮
    batchImportSure(){
      this.dialogVisible1=false;
      this.$emit("batchImportSure",this.dialogVisible1)
    },
    //弹框关闭按钮
    handleClose(){
      this.dialogVisible1=false;
      this.$emit("closeModelIpt",this.dialogVisible1)
    }
  }
}
</script>
<style lang="scss">
.dialogModel{
  .el-dialog__header{
    font-size:14px!important;
    font-weight:600;
    .el-dialog__title{
      font-size:14px!important;
      font-weight:600;
    }
  }
  .el-dialog__body{
    padding:10px 20px;
  }
  .titleTip{
    font-size:14px;
    font-weight: 600;
    color:#000;
    margin-bottom:12px;
  }
  .lookDetails{
    font-size:12px;
    color:#000;
    .fontweight{
      font-size:12px;
      font-weight:600;
    }
  }
}
.importAll{
  font-size:12px;
  color:#999;
  span.importLabel{
    float:left;
    width:100px;
  }
  span.importIpt{
    float:left;
    width:calc(100% - 100px);
    textarea{
      width:80%;
      height:100px;
      resize: none;
    }
    .margibBot{
      margin-bottom:25px;
    }
  }
}
</style>