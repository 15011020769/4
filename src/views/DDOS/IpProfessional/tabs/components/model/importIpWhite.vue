<template>
  <div id="importUrl">
    <div>
      <el-dialog
        :title="$t('DDOS.Proteccon_figura.pldrbmd')"
        :visible.sync="dialogVisible2"
        width="40%"
        :before-close="handleClose">
        <p class="tc-15-msg error" v-if="checkIpFlg == false">
          {{$t('DDOS.Proteccon_figura.UrlIPWarning')}}
        </p>
        <p class="tc-15-msg error" v-if="checkNumFlg == false">
          {{$t('DDOS.Proteccon_figura.WhiteNumWarning')}}
        </p>
        <div>
          <el-input v-model="ipWhiteTextarea" :placeholder="$t('DDOS.Proteccon_figura.qsrbmd')" class="urlTexttarea" type="textarea"></el-input>
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
      ipWhiteTextarea:'',//textarea绑定数据
      checkIpFlg: true, //ip格式/重复校验
      checkNumFlg: true //ip数量校验
    }
  },
  methods:{
    //关闭按钮
    handleClose(){
      this.dialogVisible=false;
      this.$emit("closeModel2",this.dialogVisible)
      this.ipWhiteTextarea = ""
    },
    //批量导入确定按钮
    handleSure(){
      this.checkIpFlg = true;
      this.checkNumFlg = true;
      // 1.校验非空
      if (this.ipWhiteTextarea == "") {
        return
      }
      let ipList = this.ipWhiteTextarea.split("\n");
      var regIP = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      for (let i=0; i<ipList.length; i++) {
        // 2.校验格式
        if (!regIP.test(ipList[i])) {
          this.checkIpFlg = false;
          return
        }
        // 3.校验重复
        for (let j=i+1; j<ipList.length; j++) {
          if (ipList[i] == ipList[j]) {
            this.checkIpFlg = false;
            return
          }
        }
      }
      // 4.校验数量<=50
      if (ipList.length > 50) {
        this.checkNumFlg = false;
        return
      }

      this.dialogVisible=false;
      this.$emit("importIpWhiteSure",[this.dialogVisible,this.ipWhiteTextarea]);
      this.ipWhiteTextarea = ""
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