<template>
  <div>
    <el-dialog class="dialogModel" :title='contentDialog[2]=="啟用密鑰"?"啟用密鑰服務":"禁用密鑰服務"' :visible.sync="disableDialog" width="30%" :before-close="handleClose">
      <div>
        <p v-if="contentDialog[2]=='啟用密鑰'?true:false" class="titleTip">{{$t('KMS.total.question1')}}</p>
        <p v-if="contentDialog[2]=='禁用密鑰'?true:false" class="titleTip">{{$t('KMS.total.question2')}}</p>
        <p class="lookDetails">{{$t('KMS.total.chooseAl')}}<span class="fontweight">{{$t('KMS.total.oneKmsSer')}}</span><a @click="detailsIsshow"> {{$t('KMS.total.lookDetail')}}</a></p>
        <table class="listShow" v-if="detailIsShow">
          <tbody>
            <tr>
              <td class="listShowNum">1</td>
              <td class="listShowNick">{{contentDialog[0]}}</td>
              <td v-if="contentDialog[2]=='啟用密鑰'?true:false" class="listShowIsable">{{$t('KMS.total.canStart')}}</td>
              <td v-if="contentDialog[2]=='禁用密鑰'?true:false" class="listShowIsable">{{$t('KMS.total.canStop')}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">{{$t('KMS.total.modelClose')}}</el-button>
        <el-button v-if="contentDialog[2]=='啟用密鑰'?true:false" type="primary" @click="startKmsSure">{{$t('KMS.total.modelSure')}}</el-button>
        <el-button v-if="contentDialog[2]=='禁用密鑰'?true:false" type="primary" @click="stopKmsSure">{{$t('KMS.total.modelSure')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { EnableKey,DisableKey } from "@/constants";
export default {
  props:{
    isShow:Boolean,//判断弹框是否显示隐藏
    content:Array//数据
  },
  data(){
    return{
      thisShow:'',
      thisContent:[],
      detailIsShow:false,//详情显示隐藏
      flag:true,
    }
  },
  computed:{
    disableDialog(){
      return this.isShow;
    },
    contentDialog(){
      return this.content
    }
  },
  methods:{
    //启动密钥弹出框关闭事件
    handleClose(){
      this.thisShow=false;
      this.$emit('parentByClick',this.thisShow);
    },
    //点击查看详情
    detailsIsshow(){
      if(this.flag==true){
        this.detailIsShow=true;
        this.flag=false;
      }else{
        this.detailIsShow=false;
        this.flag=true;
      }
    },
    //启动密钥确定按钮
    startKmsSure(){
      this.thisShow=false;
      this.$emit('startKmsSure',this.thisShow);
      let params = {
        Version: '2019-01-18',
        Region: 'ap-taipei',
        KeyId: this.contentDialog[1]
      };
     
      this.axios.post(EnableKey, params).then(res => {
        console.log(res.Response);
        this.$parent.GetList();
        
      });
    },
    //禁用密钥确定按钮
    stopKmsSure(){
      this.thisShow=false;
      this.$emit('stopKmsSure',this.thisShow);
      let params = {
        Version: '2019-01-18',
        Region: 'ap-taipei',
        KeyId: this.contentDialog[1]
      };
      this.axios.post(DisableKey, params).then(res => {
        // console.log(res.Response);
        this.$parent.GetList();
      });
    }
  }
}
</script>
<style lang="scss">
.newClear:after{
  display: inline-block;
  content:'';
  clear:both;
}
.dialogModel{
  .el-dialog__header{
    font-size:14px;
    font-weight:600;
  }
  .el-dialog__body{
    padding:10px 20px;
  }
  .titleTip{
    font-size:14px;
    font-weight: 600;
    color:#000;
    margin-bottom:12px;
  }
  .lookDetails{
    font-size:12px;
    color:#000;
    .fontweight{
      font-size:12px;
      font-weight:600;
    }
  }
}
.listShow{
  width:100%;
  height:36px;
  border:1px solid #ddd;
  margin-top:10px;
  td:nth-child(1).listShowNum{
    width:35px;
    text-align:center;
    border-right:1px solid #ddd;
  }
  td:nth-child(2).listShowNick{
    padding:0 20px;
    border-right:1px solid #ddd;
  }
  td:nth-child(3).listShowId{
    padding:0 20px;
    border-right:1px solid #ddd;
  }
  td:nth-child(4).listShowIsable{
    padding:0 20px;
  }
}
</style>