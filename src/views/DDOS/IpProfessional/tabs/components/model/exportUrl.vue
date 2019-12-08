<template>
  <div id="exportUrl">
    <div>
      <el-dialog
        title="批量导出URL白名单"
        :visible.sync="dialogVisible3"
        width="35%"
        :before-close="handleClose">
        <div>
          <el-input type="textarea" class="urlTexttarea" v-model="exportText" :disabled="true"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose" class="closeBtn">关闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    isShow3:Boolean
  },
  computed:{
    dialogVisible3(){
      this.dialogVisible=this.isShow3
      return this.isShow3
    }
  },
  data(){
    return{
      dialogVisible:'',//弹框状态
      exportText:'',//textarea绑定数据
    }
  },
  methods:{
    //关闭按钮
    handleClose(){
      this.dialogVisible=false;
      this.$emit("closeModel3",this.dialogVisible)
    }
  }
}
</script>
<style lang="scss">
#exportUrl{
  .urlTexttarea{
    width:100%;
    height:100px;
    textarea{
      width:100%;
      height:100px;
      border-radius: 0;
      resize: none;
    }
  }
  .closeBtn{
    background-color:#006eff;
    color:#fff;
  }
}
</style>