<template>
  <div>
    <div>
      <el-dialog
        title="删除域名"
        :visible.sync="addDominModel"
        width="45%"
        :before-close="handleClosede">
        <div>
          <span class="tip">确定删除：{{addDominModel[1]}}?</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClosede">取 消</el-button>
          <el-button type="primary" @click="deleteDominSure">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    isShow:Boolean,
    con:String
  },
  computed:{
    addDominModel(){
    //   console.log(this.isShow);
      this.dialogmodel1=this.isShow
      return this.isShow
    },
    getCon(){
      return this.con
    }
  },
  data(){
    return{
      dialogmodel1:'',//弹框
    }
  },
  methods:{
    //关闭弹框
    handleClosede(){
      this.dialogmodel1=false;
      this.$emit("closedeleteDominModel",this.dialogmodel1)
    },
    //添加域名确定按钮
    deleteDominSure(){
      this.dialogmodel1=false;
      this.$emit("closedeleteDominModel",this.dialogmodel1)
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