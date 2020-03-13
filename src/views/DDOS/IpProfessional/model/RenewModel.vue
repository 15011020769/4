<template>
  <div id="renewModel">
    <div>
      <el-dialog class="modelDetail"
        :title="$t('DDOS.protectCon.renewalPrice')"
        :visible.sync="renewShowModel"
        width="50%"
        :before-close="handleClose">
        <div class="newClear renewList">
          <div class="newClear">
            <p>{{$t('DDOS.AssetList.AssetListName')}}</p>
            <p>{{resObj.Id}}/{{resObj.Name}}</p>
          </div>
          <div class="newClear">
            <p>{{$t('DDOS.protectCon.renewalTime')}}</p>
            <p>
              <span :class="renew==1?'active':''" @click="checkListrenew(1,'60')">1月</span>
              <span :class="renew==2?'active':''" @click="checkListrenew(2,'60')">2月</span>
              <span :class="renew==3?'active':''" @click="checkListrenew(3,'60')">3月</span>
              <span :class="renew==4?'active':''" @click="checkListrenew(4,'60')">4月</span>
              <span :class="renew==5?'active':''" @click="checkListrenew(5,'60')">5月</span>
              <span :class="renew==6?'active':''" @click="checkListrenew(6,'60')">6月<i>促</i></span>
              <span :class="renew==7?'active':''" @click="checkListrenew(7,'60')">7月<i>促</i></span>
              <span :class="renew==8?'active':''" @click="checkListrenew(8,'60')">8月<i>促</i></span>
              <span :class="renew==9?'active':''" @click="checkListrenew(9,'60')">9月<i>促</i></span>
              <span :class="renew==10?'active':''" @click="checkListrenew(10,'60')">1年<i>促</i></span>
              <span :class="renew==11?'active':''" @click="checkListrenew(11,'60')">2年<i>促</i></span>
              <span :class="renew==12?'active':''" @click="checkListrenew(12,'60')">3年<i>促</i></span><br/>
              <a href="#" class="dataTimeOut">有效期至 2019-12-29 12:53:35</a>
            </p>
          </div>
          <div class="newClear">
            <p>{{$t('DDOS.protectCon.renewalPriceSum')}}</p>
            <p class="allMoney"><i class="money">{{money}}</i>元</p>
          </div>
        </div>
        <span class="bottomBtnU">
          <el-button class="nowPay">{{$t('DDOS.protectCon.justBuy')}}</el-button>
          <el-button @click="handleClose">取消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { ErrorTips } from '@/components/ErrorTips'
export default {
  props:{
    RenewShow:Boolean
  },
  data(){
    return{
      renew:1,//续费时长
      renewIsShow:'',//模态框
      money:'35,500.00',//总计费用
      resObj: {}, //从主页面传的资源对象
    }
  },
  computed:{
    renewShowModel(){
      return this.RenewShow;
    }
  },
  methods:{
    // 数据初始化（主页面打开本模态框时调用方法）
    init (scopeRow) {
      let objTemp = JSON.parse(JSON.stringify(scopeRow));
      objTemp.Record.forEach(item => {
        if (item.Key == 'Id') {
          this.resObj.Id = item.Value;
        } else if (item.Key == 'Name') {
          this.resObj.Name = (item.Value == "" ? "未命名" : item.Value);
        }
      })
    },
    //选择续费时长
    checkListrenew(thisType,num){
      this.renew=thisType
    },
    handleClose(){
      this.renewIsShow=false;
      this.$emit("closeRenewModel",this.renewIsShow)
    }
  }
}
</script>
<style lang="scss">
#renewModel{
  .newClear:after{
    display: block;
    content:'';
    clear:both;
  }
  .modelDetail{
    .el-dialog__title{
      font-size:14px;
      font-weight:600;
    }
  }
  .renewList{
    div{
      margin-bottom:20px;
      font-size: 12px;
      p:nth-child(1){
        color:#999;
        float:left;
        width:95px;
      }
      p:nth-child(2){
        float:left;
        width:calc(100% - 95px);
        color:#444;
        span{
          width:64px;
          display:inline-block;
          text-align:center;
          height:30px;
          line-height: 30px;
          color:#444;
          border:1px solid #ddd;
          position:relative;
          i{
            position: absolute;
            top:0;
            right:3px;
            width:18px;
            height:18px;
            border-radius: 2px;
            color:#fff;
            background-color:#ff7a4b;
            text-align:center;
            line-height: 18px;
            font-style: normal;
          }
        }
        .active{
          border:1px solid #006eff;
          color:#006eff;
        }
        .dataTimeOut{
          color:#999;
          font-size:12px;
        }
      }
      p:nth-child(2).allMoney{
        color:#ff7a4b;
        .money{
          font-size:26px;
          font-weight: 600;
          font-style: normal;
        }
      }
    }
  }
  .bottomBtnU{
    display:block;
    text-align:center;
    width:100%;
    button{
      height:30px;
      line-height: 30px;
      width:70px;
      padding:0;
      text-align:center;
      border-radius: 0;
      font-size:12px;
    }
    .nowPay{
      background-color:#006eff;
      color:#fff;
    }
  }
}
</style>