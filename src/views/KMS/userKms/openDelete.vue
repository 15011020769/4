<template>
  <div>
    <el-dialog class="dialogModel" title="计划删除密钥" v-if="contentDialog[2]=='计划删除'?true:false" :visible.sync="disableDialog" width="30%" :before-close="handleClose">
      <div class="openDeleteTip">
        <span>温馨提示：计划删除天数可选范围为7-30天。密钥删除后将无法恢复，此密钥下的所有加密数据也将无法解密。为避免误删除行为，KMS服务将对以下操作进行自动告警:</span>
        <span>1.密钥被彻底删除前，对尝试调用此密钥的行为进行提示告警</span>
        <span>2.密钥被彻底删除前3天，每天提示告警</span>
      </div>
      <div>
        <span class="numberAdd">该密钥将于<el-input-number :min="7" :max="30" size="small" v-model="thisNumber"></el-input-number>天后消失</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="openDeleteSure">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="dialogModel" title="取消删除密钥" v-if="contentDialog[2]=='取消删除'?true:false" :visible.sync="disableDialog" width="30%" :before-close="handleClose">
      <div class="closeDelete">
        <p class="closeDeleteTxt">取消删除选中的密钥服务? 确认取消删除后，密钥重置为“已禁用”状态</p>
      </div>
      <table class="listShowDelete">
        <tbody>
          <tr>
            <td class="listShowNum">1</td>
            <td class="listShowNick">{{contentDialog[0]}}</td>
            <td class="listShowIsable">{{contentDialog[1]}}</td>
          </tr>
        </tbody>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="closeDeleteSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { SCH_KMS,CEL_KMS } from "@/constants";
export default {
  props:{
    isShow:Boolean,//判断弹框是否显示隐藏
    content:Array//数据
  },
  data(){
    return{
      thisShow:'',
      thisContent:[],
      thisNumber:"7",//将于几天后消失
      outTime:''
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
    //计划删除密钥确定按钮
    openDeleteSure(){
      this.thisShow=false;
      
      let params = {
        Version: '2019-01-18',
        Region: 'ap-taipei',
        KeyId: this.contentDialog[3],
        PendingWindowInDays:this.thisNumber
      };
      this.axios.post(SCH_KMS, params).then(res => {
        this.outTime= this.timestampToTime(res.Response.DeletionDate);
        this.$emit('openDeleteSure',[this.thisShow,this.outTime]);
        // console.log(this.timestampToTime(res.Response.DeletionDate));
        this.$parent.getData();
      });
    },
    //取消删除密钥确定按钮
    closeDeleteSure(){
      this.thisShow=false;
      this.$emit('closeDeleteSure',this.thisShow);
      let params = {
        Version: '2019-01-18',
        Region: 'ap-taipei',
        KeyId: this.contentDialog[3],
      };
      this.axios.post(CEL_KMS, params).then(res => {
        // console.log(res.Response);
        this.$parent.getData();
      });
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = date.getDate() + ' ';
      var h = date.getHours() + ':';
      var m = date.getMinutes() + ':';
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
    },
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
  span.numberAdd{
    color:#000;
    font-weight:600;
    font-size:14px;
  }
}
.listShowDelete{
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
  td:nth-child(3).listShowIsable{
    padding:0 20px;
    color:red;
  }
}
.openDeleteTip{
  font-size: 14px;
  margin-bottom: 20px;
  line-height: inherit;
  padding: 10px 30px 10px 20px;
  color: #003b80;
  border: 1px solid #97c7ff;
  background-color: #e5f0ff;
  span{
    color: #003b80;
    font-size: 14px;
  }
}
.numberAdd .el-input__inner{
  width:130px!important;
}
.closeDelete{
  p.closeDeleteTxt{
    font-size:14px;
    font-weight: 600;
    color:#000;
  }
}
</style>