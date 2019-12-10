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
      <addIpList :resourceId='ccProtectSele' :ccUrlWhiteList='ccUrlWhiteList'/>
    </div>
  </div>
</template>
<script>
import addAccessControl from './addAccessControl'
import addIpList from './addIpList'
import { RESOURCE_LIST, CC_THRESHOLD, CC_URLALLOW, DDOSPOLICY_CONT, CC_SELFDEFINEPOLICY_CREATE } from '@/constants'
export default {
  props: {
    ccProtectSele:String,//第一部分下拉 资源ID
  },
  data(){
    return{
      options:[],//下拉内容
      switchState:true,//防护状态
      httpRequestNum: 350,//http请求阈值
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
      // ccPolicy: {}, //创建CC自定义策略对象
      ccUrlWhiteList: [], //CC的Url白名单
    }
  },
  components:{
    addAccessControl:addAccessControl,//访问策略控制表格
    addIpList:addIpList,//添加IP表格
  },
  created() {
    this.getData()
  },
  watch: {
    switchState: function(value) {
      console.log(value, this.switchState)
      this.modifyCCThreshold()
      this.describeResourceList()
      this.describeCCUrlAllow()
    },
    httpRequestNum: function(value) {
      console.log(value)
      this.modifyCCThreshold()
      this.describeResourceList()
      this.describeCCUrlAllow()
    }
  },
  methods:{
    getData() {
      this.describeResourceList()
      this.describeCCUrlAllow()
    },
    // 1.1.获取资源列表
    describeResourceList() {
      let params = {
        Version: '2018-07-09',
        Business: 'net',
        'IdList.0': this.ccProtectSele,
      }
      this.axios.post(RESOURCE_LIST, params).then(res => {
        console.log(params,res)
      })
    },
    // 1.2.获取CC的Url白名单
    describeCCUrlAllow() {
      let params = {
        Version: '2018-07-09',
        Business: 'net',
        Id: this.ccProtectSele,
        'Type.0': 'white',
      }
      this.axios.post(CC_URLALLOW, params).then(res => {
        console.log(res)
        // this.ccUrlWhiteList = res.Response
      })
    },
    // 1.3.修改CC的防护阈值
    modifyCCThreshold() {
      let params = {
        Version: '2018-07-09',
        Business: 'net',
        Id: this.ccProtectSele,
        Protocol: this.switchState?'http':'',
        Threshold: this.switchState?this.httpRequestNum:0
      }
      this.axios.post(CC_THRESHOLD, params).then(res => {
        console.log(params,res)
      })
    },
    // 1.4.创建CC自定义策略(未调用)
    createCCSelfDefinePolicy() {
      let params = {
        Version: '2018-07-09',
        Business: 'net',
        Id: this.ccProtectSele,
        'Policy.Name': 'test',
        'Policy.Smode': 'speedlimit'
      }
      this.axios.post(CC_SELFDEFINEPOLICY_CREATE, params).then(res => {
        console.log(res)
      })
    },
    // 1.5.获取DDoS高级策略(未调用)
    describeDDoSPolicy() {
      let params = {
        Version: '2018-07-09',
        Business: 'net',
      }
      this.axios.post(DDOSPOLICY_CONT, params).then(res => {
        console.log(res)
      })
    },
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