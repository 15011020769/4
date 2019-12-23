<template>
  <div>
    <div>
      <el-dialog
        title="证书配置"
        :visible.sync="CertificateConfig"
        width="45%"
        :before-close="handleClose">
        <div class="newClear listP">
          <div class="listLabel">证书来源</div>
          <div class="listIpt">
            <el-radio-group v-model="CertificateSource">
              <el-radio label="腾讯雲托管证书"></el-radio>
              <el-radio label="自有证书"></el-radio>
            </el-radio-group>
          </div>
        </div>
        <div v-if="CertificateSource=='腾讯雲托管证书'?true:false">
          <div class="newClear listP">
            <div class="listLabel">
              <span>证书</span>
              <el-tooltip effect="light" content="只展示审核通过的托管证书；如需查看证书托管状态，请前往SSL证书管理界面。" placement="right">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </div>
            <div class="listIpt">
              <el-select v-model="certificate">
                <el-option label="te(YNZEzkBs)" value="te"></el-option>
                <el-option label="taifu(YNZBcUxN)" value="taifu"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div v-if="CertificateSource=='自有证书'?true:false">
          <div class="listP newClear">
            <div class="listLabel">
              <span>证书</span>
            </div>
            <div class="listIpt">
              <el-input class="textarea" type="textarea" placeholder="请将证书内容复制后粘贴在这里，包含证书链"></el-input>
              <p class="tip">请注意，粘贴的证书内容要包含<span class="tipOrange">证书链</span></p>
            </div>
          </div>
          <div class="listP newClear">
            <div class="listLabel">
              <span>私钥</span>
            </div>
            <div class="listIpt">
              <el-input class="textarea" type="textarea" placeholder="请将私钥内容复制后粘贴在这里"></el-input>
            </div>
          </div>
        </div>
        <span class="footer">
          <el-button class="saveBtn" @click="saveConnent">保存</el-button>
          <el-button @click="handleClose">取消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    isShow:Boolean
  },
  data(){
    return{
      dialogModel:'',//弹框
      CertificateSource:'',//证书来源
      certificate:'te(YNZEzkBs)',//证书
    }
  },
  computed:{
    CertificateConfig(){
      this.dialogModel=this.isShow
      return this.isShow
    }
  },
  methods:{
    //关闭按钮
    handleClose(){
      this.dialogModel=false;
      this.$emit("dialogModelClose",this.dialogModel)
    },
    //保存按钮
    saveConnent(){
      this.dialogModel=false;
      this.$emit("dialogModelClose",this.dialogModel)
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  content:'';
  display:block;
  clear:both;
}
::v-deep .el-dialog__title{
  font-size:14px;
  color:#000;
  font-weight:600;
}
.footer{
  display:inline-block;
  text-align:center;
  width:100%;
  margin-top:20px;
  ::v-deep button{
    height:30px;
    line-height:30px;
    padding:0 16px;
    border-radius: 0;
  }
  .saveBtn{
    background-color:#006eff;
    outline: none;
    color:#fff;
  }
}
.listP{
  margin-bottom:15px;
  div:nth-child(1).listLabel{
    float:left;
    width:88px;
    font-size:12px;
    color:#999;
  }
  div:nth-child(2).listIpt{
    float:left;
    width:calc(100% - 88px);
  }
}
.el-icon-info{
  margin-left:20px;
}
.textarea{
  width:330px;
  height:100px;
  ::v-deep textarea{
    width:330px;
    height:100px;
    border-radius: 0;
    resize: none;
    font-size:12px;
  }
}
.tip{
  font-size: 12px;
  color:#999;
  span{
    color:#FF9D00;
  }
}
</style>