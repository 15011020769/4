<template>
  <div>
    <el-dialog
      :title="t('创建下载任务', 'WAF.cjxzrw')"
      :visible.sync="modelShow"
      width="45%"
      :before-close="handleClose">
      <div class="newClear">
        <div class="newClear pIpt">
          <p>{{t('任务名称', 'WAF.rwmc')}}</p>
          <p>
            <el-input class="ipt" :placeholder="t('请输入任务名称，50个组符以内', 'WAF.qsrrwmc')" v-model="taskName" :maxlength="50"></el-input>
          </p>
        </div>
        <div class="tip">
          <p>{{t('说明', 'WAF.sm')}}：</p>
          <p class="padin">1. {{t('同一时间段内只允许创建一个下载的任务，请耐心等待', 'WAF.tysjdnzyx')}}。</p>
          <p class="padin">2. {{t('单次最多支持下载1万条日志，如果您需要下载的日志超过1万条，建议您分多次任务进行下载或联系台富云技术支持进行下载', 'WAF.dczdzcxz')}}。</p>
        </div>
      </div>
      <span class="footer">
        <el-button type="primary" @click="createBtn" :disabled="!taskName || !taskName.trim()">{{t('创建', 'WAF.cj')}}</el-button>
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
      this.$emit('create',this.taskName)
    },
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