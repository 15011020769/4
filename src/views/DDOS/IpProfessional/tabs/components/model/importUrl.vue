<template>
  <div id="importUrl">
    <div>
      <el-dialog
        title="批量导入URL白名单"
        :visible.sync="dialogVisible2"
        width="40%"
        :before-close="handleClose">
        <div>
          <el-input v-model="urlTextarea" placeholder="请输入URL白名单, 以换行符分隔" class="urlTexttarea" type="textarea"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="importUrlSure">{{$t('DDOS.Proteccon_figura.Determination')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    isShow2:Boolean
  },
  computed:{
    dialogVisible2(){
      this.dialogVisible=this.isShow2
      return this.isShow2
    }
  },
  data(){
    return{
      dialogVisible:'',//弹框状态
      urlTextarea:'',//textarea绑定数据
    }
  },
  methods:{
    //关闭按钮
    handleClose(){
      this.dialogVisible=false;
      this.$emit("closeModel2",this.dialogVisible)
    },
    //批量导入确定按钮
    importUrlSure(){
      this.dialogVisible=false;
      this.$emit("importUrlSure",this.dialogVisible)
    }
  }
}
</script>
<style lang="scss">
#importUrl{
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
}
</style>