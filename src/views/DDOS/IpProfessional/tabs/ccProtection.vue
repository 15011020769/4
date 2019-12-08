<template>
  <div id="ccProtection">
    <div class="ccProtectPartOne">
      <el-select class="ccProtectSele" v-model="ccProtectSele" filterable placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="ccProtectPartTwo">
      <h2>HTTP CC防护</h2>
      <div class="partTwoIpt">
        <div class="newClear">
          <p class="partTwoPO">防护状态</p>
          <p class="partTwoPT">
            <el-switch
            class="switch"
              v-model="switchState"
              active-color="#006eff"
              inactive-color="#bbb">
            </el-switch>
            <span class="switchTip">对于敏感业务，可将业务URL添加到URL白名单，对该业务不做CC攻击检测和防护</span>
          </p>
        </div>
        <div class="newClear" v-if="switchState==true?true:false">
          <p class="partTwoPO">http请求数阈值</p>
          <p class="partTwoPT">
            <el-select class="ccProtectSele" v-model="httpRequestNum" placeholder="请选择">
              <el-option
                v-for="item in httpOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span class="marginLeftSpan">当http请求数超过设定值时，触发CC防护。</span>
          </p>
        </div>
        <div class="newClear" v-if="switchState==true?true:false">
          <p class="partTwoPO">HTTP CC攻击告警阈值</p>
          <p class="partTwoPT">
            <el-input v-model="httpCcNum" class="partTwoPTIpt"></el-input><span class="marginLeftSpan">QPS</span>
          </p>
          <span class="botTop">CC分级防护仅对通过接入网站业务的域名进行生效。</span>
        </div>
      </div>
    </div>
    <div>
      <addAccessControl/>
    </div>
    <div>
      <addIpList/>
    </div>
  </div>
</template>
<script>
import addAccessControl from './addAccessControl'
import addIpList from './addIpList'
export default {
  data(){
    return{
      ccProtectSele:'',//第一部分下拉
      options:[
        {
          value:'1',
          label:'000006y-12'
        }
      ],//下拉内容
      switchState:true,//防护状态
      httpRequestNum:'350 QPS',//http请求阈值
      httpOptions:[
        {
          value:50,
          label:'50QPS'
        },
        {
          value:100,
          label:'100QPS'
        },
        {
          value:150,
          label:'150QPS'
        },
        {
          value:240,
          label:'240QPS'
        },
        {
          value:350,
          label:'350QPS'
        },
        {
          value:480,
          label:'480QPS'
        },
        {
          value:550,
          label:'550QPS'
        },
        {
          value:700,
          label:'700QPS'
        },
        {
          value:850,
          label:'850QPS'
        },
        {
          value:1000,
          label:'1000QPS'
        },
        {
          value:1500,
          label:'1500QPS'
        },
        {
          value:2000,
          label:'2000QPS'
        },
        {
          value:3000,
          label:'3000QPS'
        },
        {
          value:5000,
          label:'5000QPS'
        },
        {
          value:10000,
          label:'10000QPS'
        },
        {
          value:20000,
          label:'20000QPS'
        },
      ],//http请求阈值数据
      httpCcNum:1000,//HTTP CC攻击告警阈值
    }
  },
  components:{
    addAccessControl:addAccessControl,//访问策略控制表格
    addIpList:addIpList,//添加IP表格
  }
}
</script>
<style lang="scss">
#ccProtection{
  .newClear:after{
    display:block;
    clear:both;
    content:'';
  }
  .ccProtectPartOne{
    width:100%;
    height:80px;
    padding: 20px;
    background-color:#fff;
    border:1px solid #ddd;
    box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
    margin-bottom:20px;
    .ccProtectSele{
      width:180px;
      height:30px;
      div{
        width:180px;
        height:30px;
        input{
          width:180px;
        }
      }
    }
  }
  .ccProtectPartTwo{
    width:100%;
    padding:20px;
    background-color:#fff;
    border:1px solid #ddd;
    box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
    margin-bottom:20px;
    h2{
      font-size:14px;
      font-weight:600;
      color:#000;
      margin-bottom:20px;
    }
    .partTwoIpt{
      div{
        margin-bottom:16px;
        p:nth-child(1).partTwoPO{
          float:left;
          width:140px;
          font-size:12px;
          color:#999;
        }
        p:nth-child(2).partTwoPT{
          float:left;
          width:calc(100% - 140px);
          font-size:12px;
          color:#999;
          .switch{
            float:left;
          }
          .switchTip{
            margin-left:12px;
            float:left;
            margin-top:3px;
          }
          .marginLeftSpan{
            margin-left:20px;
          }
          .partTwoPTIpt{
            width:180px;
            input{
              width:180px;
            }
          }
        }
        .botTop{
          color:#bbb;
        }
      }
    }
  }
  .el-select{
    height:30px!important;
  }
  .el-input{
    height:30px!important;
  }
  .el-input__inner{
    border-radius: 0!important;
    height:30px!important;
  }
}
</style>