<template>
  <div>
    <div>
      <el-dialog class="dialogModel"
        title="批量导入"
        :visible.sync="getIsShow2"
        width="30%"
        :before-close="handleClose">
        <div class="importAll exportAll newClear">
          <span class="importLabel">规则</span>
          <span class="importIpt">
            <el-input type="textarea" v-model="ExportRules"/>
          </span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">关闭</el-button>
          <!-- <el-button type="primary" @click="batchExportSure">确 定</el-button> -->
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    isShow2:Boolean,
  },
  computed:{
    getIsShow2(){
      this.dialogVisible2=this.isShow2
      return this.isShow2
    }
  },
  data(){
    return{
      dialogVisible2:'',//批量导出弹框
      ExportRules:'',//批量导出规则
    }
  },
  methods:{
    //弹框确定按钮
    batchExportSure(){
      this.dialogVisible2=false;
      this.$emit("batchExportSure",this.dialogVisible2)
    },
    //弹框关闭按钮
    handleClose(){
      this.dialogVisible2=false;
      this.$emit("closeModelExp",this.dialogVisible2)
    }
  }
}
</script>
<style lang="scss">
.exportAll{
    margin-bottom:20px;
}
</style>