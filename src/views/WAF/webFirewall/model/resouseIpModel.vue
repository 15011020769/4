<template>
  <div>
    <el-dialog
      title="提示"
      :visible.sync="dialogTrue"
      width="30%"
      :before-close="handleClose">
      <div class="newClear">
        <div class="newClear loopIpList">
          <p>域名</p>
          <p>www.bai.com</p>
        </div>
        <div class="newClear loopIpList">
          <p>回源IP</p>
          <p><span class="spanMargin">193.112.136.18</span></p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="copyBtn" @click="copyContent">复制</el-button>
        <el-button class="closeBtn" @click="handleClose">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props:{
    isShow:Boolean
  },
  data(){
    return{
      dialogModel:'',//模态框
    }
  },
  computed:{
    dialogTrue(){
      this.dialogModel=this.isShow;
      return this.isShow
    }
  },
  methods:{
    //关闭按钮
    handleClose(){
      this.dialogModel=false;
      this.$emit("closeModel",this.dialogModel)
    },
    //复制按钮
    copyContent(){

    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  clear:both;
  content:'';
  display:block;
}
::v-deep .el-dialog__title{
  font-size:14px;
  font-weight:600;
  color:#000;
}
::v-deep .el-dialog__footer{
  text-align:center;
}
::v-deep .el-button.copyBtn{
  background-color:#006eff;
  color:#fff;
}
::v-deep button.closeBtn{
  border:1px solid #ddd;
  background-color:transparent;
}
.loopIpList{
  margin-bottom:20px;
  p:nth-child(1){
    float:left;
    width:60px;
    font-size:12px;
    color:#999;
  }
  p:nth-child(2){
    float:left;
    width:calc(100% - 60px);
    font-size:12px;
    color:#000;
    .spanMargin{
      margin-right:30px;
    }
  }
}
</style>