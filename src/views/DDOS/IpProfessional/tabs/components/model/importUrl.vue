<template>
  <div id="importUrl">
    <div>
      <el-dialog
        :title="$t('DDOS.Proteccon_figura.pldrurlbmd')"
        :visible.sync="dialogVisible2"
        width="40%"
        :before-close="handleClose">
        <p class="tc-15-msg error" v-if="checkUrlFlg == false">
          {{$t('DDOS.Proteccon_figura.UrlIPWarning')}}
        </p>
        <p class="tc-15-msg error" v-if="checkNumFlg == false">
          {{$t('DDOS.Proteccon_figura.CUrlNumWarning')}}
        </p>
        <div>
          <el-input v-model="urlTextarea" :placeholder="$t('DDOS.Proteccon_figura.qsrurlbmd')" class="urlTexttarea" type="textarea"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleSure">{{$t('DDOS.Proteccon_figura.Determination')}}</el-button>
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
      checkUrlFlg: true, //ip格式/重复校验
      checkNumFlg: true //ip数量校验
    }
  },
  methods:{
    //关闭按钮
    handleClose(){
      this.dialogVisible=false;
      this.$emit("closeModel2",this.dialogVisible);
      this.urlTextarea = ""
    },
    //批量导入确定按钮
    handleSure(){
      this.checkUrlFlg = true;
      this.checkNumFlg = true;
      // 1.校验非空
      if (this.urlTextarea == "") {
        return
      }
      let urlList = this.urlTextarea.split("\n");
      var regNet = new RegExp("^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$");
      for (let i=0; i<urlList.length; i++) {
        // 2.校验格式
        if (!regNet.test(urlList[i])) {
          this.checkUrlFlg = false;
          return
        }
        // 3.校验重复
        for (let j=i+1; j<urlList.length; j++) {
          if (urlList[i] == urlList[j]) {
            this.checkUrlFlg = false;
            return
          }
        }
      }
      // 4.校验数量<=50
      if (urlList.length > 50) {
        this.checkNumFlg = false;
        return
      }
      
      this.dialogVisible=false;
      this.$emit("importUrlSure",[this.dialogVisible,this.urlTextarea]);
      this.urlTextarea = ""
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