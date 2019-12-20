<template>
  <div>
    <div>
      <el-dialog
        title="禁用域名"
        :visible.sync="dialogmodel"
        width="45%"
        :before-close="handleClose">
        <div>
          <span class="tip">确定禁用：{{addDominModel[1]}}?</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="deleteDominSure">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    isShow:Array
  },
  computed:{
    addDominModel(){
    //   console.log(this.isShow);
      this.dialogmodel=this.isShow[0]
      return this.isShow
    }
  },
  data(){
    return{
      dialogmodel:'',//弹框
    }
  },
  methods:{
    //关闭弹框
    handleClose(){
      this.dialogmodel=false;
      this.$emit("closedeleteDominModel",this.dialogmodel)
    },
    //添加域名确定按钮
    deleteDominSure(){
      this.dialogmodel=false;
      this.$emit("closedeleteDominModel",this.dialogmodel)
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  display:block;
  content:'';
  clear:both;
}
::v-deep .el-dialog__title{
  font-size:14px;
  font-weight:600;
}
::v-deep .el-dialog__footer{
  text-align:center;
}
.tip{
  font-size:12px;
  color:#000;
  font-weight: 600;
}
</style>