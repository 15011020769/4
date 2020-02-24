<template>
  <div>
    <el-dialog
      title="创建下载任务"
      :visible.sync="modelShow"
      width="45%"
      :before-close="handleClose">
      <div class="newClear">
        <div class="newClear pIpt">
          <p>任务名称</p>
          <p>
            <el-input class="ipt" placeholder="请输入任务名称，50个组符以内" v-model="taskName" @input="iptChange"></el-input>
          </p>
        </div>
        <div class="tip">
          <p>说明：</p>
          <p class="padin">1. 同一时间段内只允许创建一个下载的任务，请耐心等待。</p>
          <p class="padin">2. 单次最多支持下载1万条日志，如果您需要下载的日志超过1万条，建议您分多次任务进行下载或联系腾讯雲技术支持进行下载。</p>
        </div>
      </div>
      <span class="footer">
        <el-button class="createBtn" @click="createBtn" :disabled="taskName1">创建</el-button>
        <el-button @click="handleClose">取消</el-button>
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
      dialogModel:'',//弹框
      taskName:'',//任务名称
      taskName1:false,
    }
  },
  computed:{
    modelShow(){
      this.dialogModel=this.isShow
      return this.isShow
    }
  },
  methods:{
    //关闭弹框
    handleClose(){
      this.dialogModel=false;
      this.$emit('closeCreateTaskModel',this.dialogModel)
    },
    //确定按钮点击事件
    createBtn(){
      this.dialogModel=false;
      this.$emit('closeCreateTaskModel',this.dialogModel)
    },
    //ipt框变化
    iptChange(){
      console.log(11)
      if(this.taskName==''){
        this.taskName1=true;
      }else{
        this.taskName1=false;
      }
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
  font-weight: 600;
}
::v-deep input{
  height:30px;
  border-radius: 0;
}
.footer{
  display:inline-block;
  width:100%;
  text-align:center;
  .createBtn{
    color:#fff;
    background-color:#006eff;
  }
}
.pIpt{
  margin-bottom:16px;
  p:nth-child(1){
    font-size:12px;
    color:#999;
    float:left;
    width:70px;
  }
  p:nth-child(2){
    float:left;
    width:calc(100% - 70px);
    .ipt{
      width:300px;
    }
  }
}
.tip{
  margin-bottom:20px;
  p{
    font-size:12px;
    color:#bbb;
    line-height: 20xp;
  }
  .padin{
    padding:0 26px;
  }
}
</style>