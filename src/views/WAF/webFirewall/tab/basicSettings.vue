<template>
  <div>
    <div class="wrapper">
      <div class="refesher">
        <i class="el-icon-refresh"></i>
      </div>
      <div class="newClear mainCont">
        <div class="leftSet">
          <h1 class="newClear">基础设置<a @click="editH">编辑</a></h1>
          <div>
            <div class="newClear basicSetLsit">
              <div class="listLabel">域名</div>
              <div class="listCon">www.bai.com <i class="el-icon-copy-document"></i></div>
            </div>
            <div class="newClear basicSetLsit">
              <div class="listLabel">CNAME</div>
              <div class="listCon">81d6bacd0554621e3eee43702a2a536b.qcloudwzgj.com <i class="el-icon-copy-document"></i></div>
            </div>
            <div class="newClear basicSetLsit">
              <div class="listLabel">访问协议</div>
              <div class="listCon">HTTP</div>
            </div>
            <div class="newClear basicSetLsit">
              <div class="listLabel">协议端口</div>
              <div class="listCon">HTTP : 8080</div>
            </div>
            <div class="newClear basicSetLsit">
              <div class="listLabel">代理情况</div>
              <div class="listCon">是</div>
            </div>
            <div class="newClear basicSetLsit">
              <div class="listLabel">开启Websocket</div>
              <div class="listCon">是</div>
            </div>
            <div class="newClear basicSetLsit">
              <div class="listLabel">开启HTTP2.0</div>
              <div class="listCon">否</div>
            </div>
            <div class="newClear basicSetLsit">
              <div class="listLabel">负载均衡策略</div>
              <div class="listCon">IP hash</div>
            </div>
            <div class="newClear basicSetLsit">
              <div class="listLabel">HTTPS强制跳转</div>
              <div class="listCon">是</div>
            </div>
            <div class="newClear basicSetLsit">
              <div class="listLabel">源站域名</div>
              <div class="listCon">www.bal</div>
            </div>
          </div>
        </div>
        <div class="rightStatus">
          <div class="topStatus">
            <h1>WAF防护状态</h1>
            <div class="newClear basicSetLsit">
              <div class="listLabel">WAF状态</div>
              <div class="listCon">
                <el-switch
                  v-model="switchStatus"
                  active-color="#006eff"
                  inactive-color="#ddd"
                  @change="switchChange">
                </el-switch>
                <p class="tipP">关闭WAF总开关后，WAF将关闭规则（包括自定义、内置入侵检测规则等）；此时，WAF只进行流量转发，不会拦截攻击行为也不会记录攻击日志。</p>
              </div>
            </div>
            <div class="newClear basicSetLsit">
              <div class="listLabel">规则使用模式</div>
              <div class="listCon">
                <el-button-group>
                  <el-button class="lookD" :class="thisType=='1'?'addBgColor':''" @click="ruleUseType(1)">观察</el-button>
                  <el-button class="stopS" :class="thisType=='2'?'addBgColor':''" @click="ruleUseType(2)">拦截</el-button>
                </el-button-group>
              </div>
            </div>
          </div>
          <div class="botStatus">
            <h1 class="newClear">地域封禁<a @click="editAddress">编辑</a></h1>
            <div class="newClear basicSetLsit">
              <div class="listLabel">WAF状态</div>
              <div class="listCon">
                <el-switch
                  v-model="stopStatus"
                  active-color="#006eff"
                  inactive-color="#ddd"
                  @change="switchChange">
                </el-switch>
                <p class="tipP">可以选择国内省份和海外地区进行封禁。</p>
              </div>
            </div>
            <div class="newClear basicSetLsit">
              <div class="listLabel">已封禁地域</div>
              <div class="listCon">
                <span class="stopAddress">澳门</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <addressStopEditModel :isShow="addressModel" @closeAddressModel="closeAddressModel"/>
    </div>
  </div>
</template>
<script>
import addressStopEditModel from '../model/addressStopEditModel'
export default {
  data(){
    return{
      switchStatus:true,//防护状态开关
      thisType:'1',//默认使用规则
      stopStatus:true,//封禁状态
      addressModel:false,//地域弹框
    }
  },
  components:{
    addressStopEditModel:addressStopEditModel
  },
  methods:{
    //编辑按钮
    editH(){
      this.$router.push({
        name:'editDominList'
      })
    },
    //观察拦截事件
    ruleUseType(thisType){
      this.thisType=thisType;
      // console.log(thisType);
    },
    //WAF状态事件
    switchChange(){

    },
    //地域编辑按钮
    editAddress(){
      this.addressModel=true;
    },
    //关闭地域编辑弹框
    closeAddressModel(isShow){
      this.addressModel=isShow;
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  content:'';
  display:block;
  clear:both;
}
::v-deep button{
  border-radius: 0;
  height:30px;
  line-height: 30px;
  padding:0 20px;
}
.wrapper{
  padding:20px;
  .refesher{
    text-align:right;
    .el-icon-refresh{
      font-size:20px;
    }
  }
  .mainCont{
    padding:20px;
    width:100%;
    min-height:100px;
    background-color:#fff;
    border:1px solid #ddd;
    box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
    margin-top:12px;
    .leftSet{
      float:left;
      width:50%;
      padding-right:20px;
      h1{
        font-size: 14px;
        font-weight:600;
        color:#000;
        margin-bottom:20px;
        a{
          float:right;
          font-size:12px;
          font-weight:100;
        }
      }
    }
    .basicSetLsit{
      margin-bottom: 24px;
      div:nth-child(1).listLabel{
        font-size:12px;
        color:#999;
        float:left;
        width:110px;
      } 
      div:nth-child(2).listCon{
        font-size:12px;
        color:#000;
        float:left;
        width:calc(100% - 110px);
      }
    }
    .rightStatus{
      width:50%;
      float:left;
      .topStatus{
        padding-bottom:20px;
        border-bottom:1px solid #ddd;
        margin-bottom:20px;
        h1{
          font-size: 14px;
          font-weight:600;
          color:#000;
          margin-bottom:20px;
        }
        .addBgColor{
          background-color:#006eff;
          color:#fff;
        }
      }
      .tipP{
        color:#999;
        line-height:20px;
        margin-top:10px;
      }
      .botStatus{
        h1{
          font-size: 14px;
          font-weight:600;
          color:#000;
          margin-bottom:20px;
          a{
            float:right;
            font-size:12px;
            font-weight:100;
          }
        }
        .stopAddress{
          display:inline-block;
          margin-right:5px;
          padding:5px;
          background-color:#e5e5e5;
        }
      }
    }
  }
}
</style>