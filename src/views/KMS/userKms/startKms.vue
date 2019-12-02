<template>
  <div>
    <el-dialog class="dialogModel" :title='contentDialog[2]=="启用密钥"?"启用密钥服务":"禁用密钥服务"' :visible.sync="disableDialog" width="30%" :before-close="handleClose">
      <div>
        <p v-if="contentDialog[2]=='启用密钥'?true:false" class="titleTip">启用选中的密钥服务？</p>
        <p v-if="contentDialog[2]=='禁用密钥'?true:false" class="titleTip">禁用选中的密钥服务？</p>
        <p class="lookDetails">您已选<span class="fontweight"><span>1</span>个密钥服务</span><a @click="detailsIsshow"> 查看详情</a></p>
        <table class="listShow" v-if="detailIsShow">
          <tbody>
            <tr>
              <td class="listShowNum">1</td>
              <td class="listShowNick">{{contentDialog[0]}}</td>
              <td v-if="contentDialog[2]=='启用密钥'?true:false" class="listShowIsable">可启用</td>
              <td v-if="contentDialog[2]=='禁用密钥'?true:false" class="listShowIsable">可禁用</td>
            </tr>
          </tbody>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button v-if="contentDialog[2]=='启用密钥'?true:false" type="primary" @click="startKmsSure">确 定</el-button>
        <el-button v-if="contentDialog[2]=='禁用密钥'?true:false" type="primary" @click="stopKmsSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
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
    //启动密钥轮换弹出框关闭事件
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
    //启动密钥轮换确定按钮
    startKmsSure(){
      this.thisShow=false;
      this.$emit('startKmsSure',this.thisShow);
    },
    //禁用密钥轮换确定按钮
    stopKmsSure(){
      this.thisShow=false;
      this.$emit('stopKmsSure',this.thisShow);
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