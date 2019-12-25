<template>
  <div>
    <div class="topHedaer">
      <div class="mainHedaer">
        Web应用防火墙
      </div>
    </div>
    <div class="wrapper">
      <div class="wrapperCont">
        <p class="pTip">包年包月</p>
        <div class="chooseList newClear bodertOP">
          <div class="listLabel">地域</div>
          <div class="listCon">
            <el-button class="taibei">台湾台北</el-button>
          </div>
        </div>
        <div class="chooseList newClear">
          <div class="listLabel">套餐</div>
          <div class="listCon">
            <el-button-group class="btnGroup">
              <el-button @click="taocan(1)" :class="thisType=='1'?'addColor':''">高级版</el-button>
              <el-button @click="taocan(2)" :class="thisType=='2'?'addColor':''">企业版</el-button>
              <el-button @click="taocan(3)" :class="thisType=='3'?'addColor':''">旗舰版</el-button>
            </el-button-group>
            <div v-if="thisType=='1'" class="pList">
              <p class="tipColr">适用于中小非业务网站的标准防护，基于AI+规则引擎；</p>
              <p>支持常见的Web攻击防护，包括SQL注入、XSS、Webshell上传、目录遍历等；</p>
              <p>云端自动更新Web 0 day漏洞的防护规则；</p>
              <p>支持HTTP(80、8080端口)、HTTPS(443、8443端口)的业务防护；</p>
              <p>支持高级CC攻击防护，过滤垃圾访问；</p>
              <p>支持网页防篡改，敏感数据防泄漏；</p>
              <p>支持按地域细粒度封禁；</p>
              <p>正常业务请求QPS:2500；</p>
              <p>CC防护峰值QPS:30000；</p>
              <p>支持一级域名个数：2；</p>
              <p>支持二级域名个数：20；</p>
              <p>业务宽带（云外/云内）：10Mbps/200Mbps；</p>
            </div>
            <div v-if="thisType=='2'" class="pList">
              <p class="tipColr">适用于中小型普通业务站点及中大型官网站点定制化防护服务，基于AI+规则引擎；</p>
              <p>包含高级版所有功能；</p>
              <p>支持链路劫持检测（5个）；</p>
              <p>支持高级BOT行为管理；</p>
              <p>支持非标准端口（不限于80，8080，443，8443）定制（10个）；</p>
              <p>支持HTTP协议级别自定义规则；</p>
              <p>独享IP防护；</p>
              <p>支持防御规则化专家服务；</p>
              <p>支持1对1售前售后支持；</p>
              <p>正常业务请求QPS：5000；</p>
              <p>CC防护峰值QPS:150000；</p>
              <p>支持一级域名个数：3；</p>
              <p>支持二级域名个数：30；</p>
              <p>业务宽带（云外/云内）：30Mbps/200Mbps；</p>
            </div>
            <div v-if="thisType=='3'" class="pList">
              <p class="tipColr">适用于大型及超大型业务网站及复杂业务站点定制化防护服务，基于AI+规则引擎；</p>
              <p>包含高级版所有功能；</p>
              <p>支持链路劫持检测（10个）；</p>
              <p>支持高级BOT行为管理；</p>
              <p>支持非标准端口（不限于80，8080，443，8443）定制（20个）；</p>
              <p>独享IP防护；</p>
              <p>支持1对1售前售后支持；</p>
              <p>正常业务请求QPS：10000；</p>
              <p>CC防护峰值QPS:500000；</p>
              <p>支持一级域名个数：4；</p>
              <p>支持二级域名个数：40；</p>
              <p>业务宽带（云外/云内）：50Mbps/200Mbps；</p>
            </div>
          </div>
        </div>
        <div class="chooseList newClear">
          <div class="listLabel">扩展域名包</div>
          <div class="listCon">
            <el-input-number size="mini" v-model="num1" @change="handleChange1" :min="0" :max="10" label="描述文字"></el-input-number>
            <p class="Ptext">一个域名包包含：10个域名防护（限制仅支持1个一级域名）</p>
          </div>
        </div>
        <div class="chooseList newClear">
          <div class="listLabel">QPS扩展包</div>
          <div class="listCon">
            <el-input-number size="mini" v-model="num2" @change="handleChange2" :min="0" :max="10" label="描述文字"></el-input-number>
            <p class="Ptext">一个QPS扩展包包含：1000QPS（套餐有效期内，一次最多可购买500个）</p>
          </div>
        </div>
        <div class="chooseList newClear">
          <div class="listLabel">安全日志服务包</div>
          <div class="listCon">
            <el-input-number size="mini" v-model="num3" @change="handleChange3" :min="0" :max="10" label="描述文字"></el-input-number>
            <p class="Ptext">一个日志服务包包含：1T日志服务存储容量（套餐有效期内，日志存储时长为180天，一次最多可购买500个）</p>
          </div>
        </div>
        <div class="chooseList newClear">
          <div class="borderTop">
            <div class="listLabel">购买时长</div>
            <div class="listCon">
              <el-button-group class="btnGroup">
                <el-button @click="mounth(1)" :class="mounthType=='1'?'addColor':''">1个月</el-button>
                <el-button @click="mounth(2)" :class="mounthType=='2'?'addColor':''">2个月</el-button>
                <el-button @click="mounth(3)" :class="mounthType=='3'?'addColor':''">3个月</el-button>
                <el-button @click="mounth(4)" :class="mounthType=='4'?'addColor':''">半年</el-button>
                <el-button @click="mounth(5)" :class="mounthType=='5'?'addColor':''">1年<span class="scale">85折</span></el-button>
                <el-button @click="mounth(6)" :class="mounthType=='6'?'addColor':''">2年<span class="scale">7折</span></el-button>
                <el-button @click="mounth(7)" :class="mounthType=='7'?'addColor':''">3年<span class="scale">5折</span></el-button>
              </el-button-group>
            </div>
          </div>
        </div>
        <div class="bottomTotal newClear">
          <p class="totaoLabel">总计费用:</p>
          <p class="totalMoney">
            <span class="money">3,880.00<i>元</i></span><br/>
            <el-button size="mini" class="immePay" @click="pay">立即支付</el-button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      thisType:'1',//套餐
      num1:'',//扩展域名包
      num2:'',//QPS扩展包
      num3:'',//安全日志服务包
      mounthType:'1',//购买时长
    }
  },
  methods:{
    //套餐选择
    taocan(thisType){
      this.thisType=thisType;
    },
    //购买时长
    mounth(mounthType){
      this.mounthType=mounthType;
    },
    //扩展域名包
    handleChange1(val){
      console.log(val)
    },
    //QPS扩展包
    handleChange2(val){
      console.log(val)
    },
    //安全日志服务包
    handleChange3(val){
      console.log(val)
    },
    //跳转支付页面
    pay(){
      this.$router.push({
        name:'pay'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  content: "";
  clear:both;
  display:block;
}
.topHedaer{
  width:100%;
  height:62px;
  background-color:#fff;
  margin-bottom: 20px;
  .mainHedaer{
    width:1120px;
    margin:0 auto;
    line-height: 62px;
    font-size:20px;
    font-weight: 600;
    color:#000;
  }
}
.wrapper{
  width:100%;
  .wrapperCont{
    width:1120px;
    margin:0 auto;
    .pTip{
      font-size:14px;
      color:#006eff;
      font-weight:600;
      height:30px;
      line-height: 30px;
      width:100px;
      text-align: center;
      background-color:#fff;
    }
    .chooseList{
      padding:20px;
      background-color:#fff;
    }
    .bodertOP{
      border-top:1px solid #ddd;
    }
    .borderTop{
      border-top:1px solid #ddd;
      padding-top:20px;
    }
    .listLabel{
      float:left;
      width:100px;
      font-size:12px;
      color:#888;
    }
    .listCon{
      float:left;
      width:calc(100% - 100px);
    }
    ::v-deep button{
      height:30px;
      line-height: 30px;
      padding:0 20px;
    }
    .taibei{
      background-color:#d7e6f8;
      color:#6fa4ff;
      border:1px solid #00a4ff;
    }
    .addColor{
      background-color:#d7e6f8;
      color:#6fa4ff;
      border:1px solid #00a4ff;
    }
    .btnGroup{
      ::v-deep button{
        margin-right:0;
        position:relative;
        span.scale{
          position:absolute;
          top:0;
          right:0;
          height:15px;
          line-height: 15px;
          padding:0 3px;
          color:#fff;
          font-size:10px;
          background-color:#ff7300;
        }
      }
    }
    .pList{
      p{
        color:#999;
        line-height: 20px;
      }
      .tipColr{
        color:#ff9d00;
        font-size: 12px;
        line-height: 20px;
      }
    }
    .Ptext{
      color:#999;
      font-size:12px;
      line-height: 20px;
    }
    .bottomTotal{
      width:100%;
      border-top:1px solid #ddd;
      padding:20px 20px 10px 20px;
      box-shadow: inset top 0 0 10px #CCC;
      background-color: #fff;
      margin-bottom:20px;
      .totaoLabel{
        float:left;
        width:105px;
        font-size:12px;
        color:#999;
      }
      .totalMoney{
        float:left;
        width:calc(100%- 105px);
        .money{
          font-size:18px;
          color:#fa7821;
          i{
            font-style: normal;
            font-size: 12px;
          }
        }
        ::v-deep button{
          background-color:#fa7821;
          color:#fff;
          margin-top:12px;
        }
      }
    }
  }
}
::v-deep input{
  height:30px;
  line-height: 20px;
}
</style>