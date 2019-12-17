<template>
  <div>
    <div>
      <el-dialog
        title="删除域名"
        :visible.sync="deleteModel"
        width="45%"
        :before-close="handleClose">
        <div class="newClear">
          <i class="el-icon-warning"></i><span class="deleteTip">确定删除当前所选域名？</span>
        </div>
        <span class="footer">
          <el-button class="deleteBtn" @click="deleteBtn">删除</el-button>
          <el-button class="closeBtn" @click="handleClose">取消</el-button>
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
      deleteDialog:'',//弹框
    }
  },
  computed:{
    deleteModel(){
      return this.isShow;
    }
  },
  methods:{
    //关闭按钮
    handleClose(){
      this.deleteDialog=false;
      this.$emit("closeDeleteModel",this.deleteDialog)
    },
    //删除按钮
    deleteBtn(){
      this.deleteDialog=false;
      this.$emit("closeDeleteModel",this.deleteDialog)
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
::v-deep button.deleteBtn{
  background-color:#006eff;
  color:#fff;
}
::v-deep button.closeBtn{
  border:1px solid #ddd;
}
.footer{
  width:100%;
  display:inline-block;
  text-align:center;
}
.el-icon-warning{
  font-size:32px;
  color:red;
  float:left;
}
.deleteTip{
  float:left;
  font-size:16px;
  font-weight: 600;
  color:#000;
  margin-left:20px;
  margin-top:5px;
}
</style>