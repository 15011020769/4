<template>
  <div>
    <div class="editTitle">
      <i class="el-icon-back" @click="backListDomin"></i>编辑域名
    </div>
    <div class="wrapper">
      <div class="mainEditList">
        <div class="mainEditListTop">
          <h2>域名配置</h2>
          <div class="newClear">
            <div class="newClear labelLsit">
              <div class="cLabel">域名<i class="el-icon-info"></i></div>
              <div class="lLabel">
                <el-input class="domin" :disabled="true" v-model="dominDisabel"></el-input>
              </div>
            </div>
            <div class="newClear labelLsit">
              <div class="cLabel">服务器配置<i class="el-icon-info"></i></div>
              <div class="lLabel">
                <p>
                  <el-checkbox class="checkBox" label="HTTP" name="type" v-model="httpModel"></el-checkbox>
                  <span v-if="httpModel==true?true:false">
                    <span class="httpDomin" v-if="!iptShow">80</span>
                    <a href="#" @click="iptShow=true" v-if="!iptShow">其他端口</a>
                    <el-select v-if="iptShow"
                      v-model="httpValue"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                      >
                      <el-option
                        v-for="item in httpOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </span>
                  </p><br/>
                <el-checkbox class="checkBox" label="HTTPS" name="type" v-model="httpsModel"></el-checkbox>
                <span v-if="httpsModel==true?true:false">
                  <span class="httpDomin" v-if="!iptShow1">80</span>
                  <a href="#" @click="iptShow1=true" v-if="!iptShow1">其他端口</a>
                  <el-select v-if="iptShow1"
                    v-model="httpsValue"
                    multiple
                    filterable
                    allow-create
                    default-first-option
                    >
                    <el-option
                      v-for="item in httpsOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </span><br/>
                <div v-if="httpsModel" class="bgGrey">
                  <p class="newClear pTip" v-if="thisTip">当选择HTTPS协议时，关联相关的证书信息才能进行正常防护<i class="el-icon-close" @click="thisTip=false"></i></p>
                  <p><span class="PcontentLabel">证书配置</span><a href="#" @click="connectCertificate">关联证书</a></p>
                  <p><a @click="changeClass">高级设置<i :class="topArrow"></i></a></p>
                  <div v-if="flag">
                    <p>
                      <span class="PcontentLabel">HTTPS强制跳转<i class="el-icon-info"></i></span>
                      <span>
                        <el-switch
                          v-model="routeSwitch"
                          active-color="#006eff"
                          inactive-color="#bbb">
                        </el-switch>
                      </span>
                    </p>
                    <p>
                      <span class="PcontentLabel">HTTPS回源方式</span>
                      <span>
                        <el-radio-group v-model="httpOrHttps">
                          <el-radio label="HTTP"></el-radio>
                          <el-select class="selectPort"
                            v-model="portValue"
                            filterable
                            allow-create
                            default-first-option>
                            <el-option
                              v-for="item in port"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                          <el-radio label="HTTPS"></el-radio>
                        </el-radio-group>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="newClear labelLsit">
              <div class="cLabel">开启HTTP2.0<i class="el-icon-info"></i></div>
              <div class="lLabel">
                <el-radio-group v-model="startHttp2">
                  <el-radio label="否"></el-radio>
                  <el-radio label="是"></el-radio>
                </el-radio-group>
                <p class="tipG">请确保您的的源站支持并开启了HTTP2.0，否则，即使配置开启2.0也将降级1.1。</p>
              </div>
            </div>
            <div class="newClear labelLsit">
              <div class="cLabel">源站地址<i class="el-icon-info"></i></div>
              <div class="lLabel">
                <el-radio-group v-model="resouseIp">
                  <el-radio label="IP"></el-radio>
                  <el-radio label="域名"></el-radio>
                </el-radio-group>
                <div v-if="resouseIp=='IP'?true:false">
                  <el-input type="textarea" class="textareaIpt" v-model="IPModelValue"></el-input>
                  <p class="tipG">请输入源站IP，用回车分隔多个IP，最多支持20个</p>
                </div>
                <div v-if="resouseIp=='域名'?true:false">
                  <el-input type="textarea" class="textareaIpt" v-model="dominModelValue"></el-input>
                  <p class="tipG">请输入源站域名，注意：源站域名不能和防护域名相同</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mainEditListTop">
          <h2>其他配置</h2>
          <div class="newClear">
            <div class="newClear labelLsit">
              <div class="cLabel">代理情况</div>
              <div class="lLabel">
                <el-radio-group v-model="agencySituation">
                  <el-radio label="否"></el-radio>
                  <el-radio label="是"></el-radio>
                </el-radio-group>
                <p class="tipG">是否已使用了高防、CDN、云加速等代理？</p>
              </div>
            </div>
            <div class="newClear labelLsit">
              <div class="cLabel">开启WebSocket</div>
              <div class="lLabel">
                <el-radio-group v-model="webSocket">
                  <el-radio label="否"></el-radio>
                  <el-radio label="是"></el-radio>
                </el-radio-group>
                <p class="tipG">如果您的网站使用了Websocket，建议您选择是。</p>
              </div>
            </div>
            <div class="newClear labelLsit">
              <div class="cLabel">负载均衡策略</div>
              <div class="lLabel">
                <el-radio-group v-model="balancingStrategy">
                  <el-radio label="轮询"></el-radio>
                  <el-radio label="IP Hash"></el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
        </div>
        <div class="botBtn">
          <el-button class="saveBtn" :disabled="true" @click="saveEdit">保存</el-button>
          <el-button @click="closeEdit">取消</el-button>
        </div>
      </div>
    </div>
    <connectCertificate :isShow="connectCertifModel" @dialogModelClose="dialogModelClose"/>
  </div>
</template>
<script>
import connectCertificate from '../model/connectCertificate'
export default {
  data(){
    return{
      dominDisabel:'www.bai.com',//域名
      httpModel:true,//http绑定
      httpsModel:true,//https绑定
      httpValue:[],//http其他端口
      httpsValue:[],//https其他端口
      httpOptions:[
        {
          label:'80',
          value:'80'
        },
        {
          label:'8080',
          value:'8080'
        }
      ],
      httpsOptions:[
        {
          label:'80',
          value:'80'
        },
        {
          label:'8080',
          value:'8080'
        }
      ],
      iptShow:false,//其他端口隐藏
      iptShow1:false,//其他端口隐藏
      thisTip:true,//提示信息
      topArrow:'el-icon-caret-top',
      flag:true,
      routeSwitch:false,//是否强制跳转
      httpOrHttps:'HTTP',//http类型选择
      port:[
        {

        }
      ],//端口
      portValue:'80',//端口
      startHttp2:'否',//是否开启HTTP2.0
      resouseIp:'IP',//源站地址
      IPModelValue:'',//ip  textarea
      dominModelValue:'',//域名  textarea
      agencySituation:'是',//代理情况
      webSocket:'是',//是否开启websocket
      balancingStrategy:'IP Hash',//负载均衡策略
      connectCertifModel:false,//关联证书
    }
  },
  components:{
    connectCertificate:connectCertificate
  },
  methods:{
    //返回域名列表
    backListDomin(){
      this.$router.go(-1)
    },
    //改变class
    changeClass(){
      if(this.flag){
        this.topArrow='el-icon-caret-bottom';
        this.flag=false;
      }else{
        this.topArrow='el-icon-caret-top';
        this.flag=true;
      }
    },
    //保存按钮
    saveEdit(){
      this.$router.go(-1)
    },
    //取消按钮
    closeEdit(){
      this.$router.go(-1)
    },
    //关联证书
    connectCertificate(){
      this.connectCertifModel=true;
    },
    //关闭关联证书弹框
    dialogModelClose(isSHow){
      this.connectCertifModel=isSHow;
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
.editTitle{
  height:50px;
  border-bottom:1px solid #ddd;
  padding:0 20px;
  line-height:50px;
  font-size:16px;
  font-weight: 600;
  background-color:#fff;
  .el-icon-back{
    margin-right:12px;
    color:#006eff;
  }
}
::v-deep input{
  height:30px;
  line-height: 30px;
  border-radius: 0;
}
::v-deep textarea{
  resize: none;
  border-radius: 0;
}
.wrapper{
  padding:20px;
  width:100%;
  .mainEditList{
    padding:20px;
    width:100%;
    min-height:200px;
    border:1px solid #ddd;
    background-color:#fff;
    box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
    .mainEditListTop{
      margin-bottom:20px;
      h2{
        font-size:14px;
        font-weight:600;
        color:#000;
        margin-bottom:20px;
      }
      .labelLsit{
        margin-bottom:20px;
        div:nth-child(1).cLabel{
          width:120px;
          float:left;
          font-size:12px;
          color:#999;
          .el-icon-info{
            margin-left:10px;
          }
        }
        div:nth-child(2).lLabel{
          float:left;
          width:calc(100% - 120px);
          .domin{
            width:330px;
            input{
              width:330px;
            }
          }
          .httpDomin{
            margin:0 20px;
          }
          .checkBox{
            margin-right:10px;
          }
          .bgGrey{
            width:490px;
            min-height:100px;
            background-color:#ededed;
            margin-top:12px;
            padding:10px 20px;
            p{
              margin-bottom:12px;
            }
            .pTip{
              color: #c07400;
              border:1px solid #ffd18b;
              background-color: #fff4e3;
              height:36px;
              line-height: 36px;
              font-size:12px;
              padding:0 10px;
              margin-bottom:10px;
              .el-icon-close{
                float:right;
                font-size:20px;
                margin-top:6px;
              }
            }
            .PcontentLabel{
              font-size:12px;
              color:#999;
              display:inline-block;
              width:120px;
            }
            .selectPort{
              width:80px;
              margin:0 20px 0 10px;
              div{
                width:80px;
              }
            }
          }
          .tipG{
            color:#999;
            font-size:12px;
            margin:10px 0;
          }
          .textareaIpt{
            width:330px;
            height:100px;
            margin:10px 0;
            ::v-deep textarea{
              width:330px;
              height:100px;
              border-radius: 0;
              resize: none;
            }
          }
        }
      }
    }
  }
}
.botBtn{
  padding-left:120px;
  ::v-deep button{
    height:30px;
    line-height: 30px;
    border-radius: 0;
    padding:0 16px;
  }
  .saveBtn{
    background-color:#006eff;
    color:#fff;
  }
}
</style>