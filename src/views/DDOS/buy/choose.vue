<template>
  <div>
    <div class="topTit">
      <div class="topTitCenterR">
        高防IP专业版
      </div>
    </div>
    <div class="contentMain">
      <div class="contentMainCenter newClear">
        <div class="leftContent">
          <ul>
            <li>
              <div class="checkList newClear">
                <div class="checkListLeft">
                  地域
                </div>
                <div class="checkListRight">
                  <div>
                    <span class="address spanList" :class="type1=='1'?'seceltList':''" @click="checkAddress(1,'台湾台北')">台湾台北</span>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="checkList newClear">
                <div class="checkListLeft">
                  保底防护峰值
                </div>
                <div class="checkListRight">
                  <div>
                    <span class="spanList" :class="type2==1?'seceltList':''" @click="checkListTwo(1,'20Gbps')">20Gbps</span>
                    <span class="spanList" :class="type2==2?'seceltList':''" @click="checkListTwo(2,'30Gbps')">30Gbps</span>
                    <span class="spanList" :class="type2==3?'seceltList':''" @click="checkListTwo(3,'50Gbps')">50Gbps</span>
                    <span class="spanList" :class="type2==4?'seceltList':''" @click="checkListTwo(4,'100Gbps')">100Gbps</span>
                  </div>
                </div>
              </div>
              <div class="checkList newClear">
                <div class="checkListLeft">
                  CC防护峰值
                </div>
                <div class="checkListRight">
                  <span class="textList">{{ccText}}</span>
                </div>
              </div>
            </li>
            <li>
              <div class="checkList newClear">
                <div class="checkListLeft">
                  弹性防护峰值
                </div>
                <div class="checkListRight">
                  <div>
                    <span class="spanList" :class="type3==index?'seceltList':''" @click="checkListThree(index,item)" v-for="(item,index) in ElasticPeak" :key="index">{{item}}</span>
                  </div>
                  <div class="tipList">
                    <p class="tipListOne">运营商骨干线路故障或其他运营商策略等不确定因素，可能会造成未达到弹性上限发生封禁。如果发生未达开通的弹性峰值上限产生封禁的情况，免除当日弹性防护费用。</p>
                    <p class="tipListTwo">购买后，弹性防护不可修改。</p>
                  </div>
                </div>
              </div>
              <div class="checkList newClear">
                <div class="checkListLeft">
                  业务规格
                </div>
                <div class="checkListRight">
                  <div>
                    <span class="spanList" :class="type4==1?'seceltList':''" @click="checkListFour(1,'100Mbps')">100Mbps</span>
                    <span class="spanList" :class="type4==2?'seceltList':''" @click="checkListFour(2,'150Mbps')">150Mbps</span>
                    <span class="spanList" :class="type4==3?'seceltList':''" @click="checkListFour(3,'200Mbps')">200Mbps</span>
                    <span class="spanList" :class="type4==4?'seceltList':''" @click="checkListFour(4,'500Mbps')">500Mbps</span>
                    <span class="spanList" :class="type4==5?'seceltList':''" @click="checkListFour(5,'1Gbps')">1Gbps</span>
                    <span class="spanList" :class="type4==6?'seceltList':''" @click="checkListFour(6,'2Gbps')">2Gbps</span>
                  </div>
                  <div class="tipList">
                    <p class="tipListThree">腾讯云为您免费赠送100M的业务带宽，如不够用，请及时升级业务带宽。</p>
                    <p class="tipListThree">业务带宽: {{checked4}}</p>
                    <p class="tipListThree">HTTP: {{checkChange1}}QPS</p>
                    <p class="tipListThree">HTTPS: {{checkChange2}}QPS</p>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div class="checkList newClear">
                <div class="checkListLeft">
                  购买时长
                </div>
                <div class="checkListRight">
                  <div>
                    <span class="spanList" :class="type5==1?'seceltList':''" @click="checkListFive(1,'1个月')">1个月</span>
                    <span class="spanList" :class="type5==2?'seceltList':''" @click="checkListFive(2,'2个月')">2个月</span>
                    <span class="spanList" :class="type5==3?'seceltList':''" @click="checkListFive(3,'3个月')">3个月</span>
                    <span class="spanList" :class="type5==4?'seceltList':''" @click="checkListFive(4,'4个月')">4个月</span>
                    <span class="spanList" :class="type5==5?'seceltList':''" @click="checkListFive(5,'5个月')">5个月</span>
                    <el-tooltip placement="top" effect="light">
                      <div slot="content">6个月以上享88折</div>
                      <span class="spanList" :class="type5==6?'seceltList':''" @click="checkListFive(6,'6个月')">6个月<a href="#" class="spanListPosi">惠</a></span>
                    </el-tooltip>
                    <el-tooltip placement="top" effect="light">
                      <div slot="content">6个月以上享88折</div>
                      <span class="spanList" :class="type5==7?'seceltList':''" @click="checkListFive(7,'7个月')">7个月<a href="#" class="spanListPosi">惠</a></span>
                    </el-tooltip>
                    <el-tooltip placement="top" effect="light">
                      <div slot="content">6个月以上享88折</div>
                      <span class="spanList"  :class="type5==8?'seceltList':''" @click="checkListFive(8,'8个月')">8个月<a href="#" class="spanListPosi">惠</a></span>
                    </el-tooltip>
                    <el-tooltip placement="top" effect="light">
                      <div slot="content">6个月以上享88折</div>
                      <span class="spanList" :class="type5==9?'seceltList':''" @click="checkListFive(9,'9个月')">9个月<a href="#" class="spanListPosi">惠</a></span>
                    </el-tooltip>
                    <el-tooltip placement="top" effect="light">
                      <div slot="content">1年享83折</div>
                      <span class="spanList" :class="type5==10?'seceltList':''" @click="checkListFive(10,'1年')">1年<a href="#" class="spanListPosi">惠</a></span>
                    </el-tooltip>
                    <el-tooltip placement="top" effect="light">
                      <div slot="content">2年享7折</div>
                      <span class="spanList" :class="type5==11?'seceltList':''" @click="checkListFive(11,'2年')">2年<a href="#" class="spanListPosi">惠</a></span>
                    </el-tooltip>
                    <el-tooltip placement="top" effect="light">
                      <div slot="content">3年享5折</div>
                      <span class="spanList" :class="type5==12?'seceltList':''" @click="checkListFive(12,'3年')">3年<a href="#" class="spanListPosi">惠</a></span>
                    </el-tooltip>
                  </div>
                </div>
              </div>
              <div class="checkList newClear">
                <div class="checkListLeft">
                  自动续费
                </div>
                <div class="checkListRight">
                  <el-checkbox v-model="checked" @change="checkedOrNo"></el-checkbox> 账户余额足够时，设备到期后按月自动续费
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="rightContent" :class="searchBarFixed == true ? 'isFixed' :''">
          <h1>当前配置</h1>
          <div class="allConList">
            <p><span>地域</span><span>{{checked1}}</span></p>
            <p><span>保底防护峰值</span><span>{{checked2}}</span></p>
            <p><span>CC防护峰值</span><span>{{ccText}}</span></p>
            <p v-if="saveShow"><span>弹性防护</span><span>未开启</span></p>
            <p v-if="!saveShow"><span>弹性防护峰值</span><span>{{checked3}}</span></p>
            <p><span>业务带宽</span><span>{{checked4}}</span></p>
            <p><span>HTTP(QPS)</span><span>{{checkChange1}}</span></p>
            <p><span>HTTPS(QPS)</span><span>{{checkChange2}}</span></p>
            <p><span>购买时长</span><span>{{checked5}}</span></p>
            <p><span>自动续费</span><span>{{checkOrNull}}</span></p>
          </div>
          <div class="allMoney">
            <span>总计费用</span>
            <p>{{allMoney}}元</p>
            <button class="payBtn" @click="payPage">立即支付</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      ccText:'40,000QPS',//CC防护峰值
      ElasticPeak:["无","30Gbps","40Gbps","50Gbps","60Gbps","70Gbps","80Gbps","90Gbps","100Gbps","120Gbps","150Gbps","200Gbps","250Gbps","300Gbps","400Gbps","30Gbps","6000Gbps","900Gbps","1.2Tbps","1.7Tbps"],
      checked:false,//自动续费 否
      type1:1,
      checked1:'台灣台北',//地域
      flag:true,
      type2:1,
      checked2:'20Gbps',//保底防护峰值
      type3:0,
      checked3:'无',//弹性防护峰值
      checkedRoute3:0,
      type4:1,
      checked4:'100Mbps',//业务规格
      checkedRoute4:100,
      type5:1,
      checked5:'1个月',//购买时长
      checkOrNull:"否",
      allMoney:'177,000.00',
      checkChange1:'3000',//HTTP
      checkChange2:'3000',//HTTPS
      saveShow:true,
      searchBarFixed:false,
    }
  },
  mounted: function () {
    window.addEventListener('scroll', this.handleScroll, true);  // 监听（绑定）滚轮滚动事件
  },
  methods:{
    //默认选择中国台湾
    checkAddress(type1,checked){
      this.type1=type1;
      this.checked1=checked;
    },
    //保底防护峰值
    checkListTwo(type2,checked){
      this.type2=type2;
      this.checked2=checked;
    },
    //弹性防护峰值
    checkListThree(type3,checked){
      this.type3=type3;
      this.checked3=checked;
      if(type3==0){
        console.log(this.checkedRoute3)
        this.saveShow=true
        this.checkedRoute3=0
      }else{
        this.saveShow=false;
        this.checkedRoute3=checked
      }
      console.log(type3,checked)
    },
    //业务规格
    checkListFour(type4,checked){
      this.type4=type4;
      this.checked4=checked;
      if(this.type4==1){
        this.checkChange1=3000;
        this.checkChange2=3000;
        this.checkedRoute4=100;
      }else if(this.type4==2){
        this.checkChange1=5000;
        this.checkChange2=3500;
        this.checkedRoute4=150;
      }else if(this.type4==3){
        this.checkChange1=7000;
        this.checkChange2=4000;
        this.checkedRoute4=200;
      }else if(this.type4==4){
        this.checkChange1=20000;
        this.checkChange2=7000;
        this.checkedRoute4=500;
      }else if(this.type4==5){
        this.checkChange1=40000;
        this.checkChange2=10000;
        this.checkedRoute4=1000;
      }else if(this.type4==6){
        this.checkChange1=70000;
        this.checkChange2=17000;
        this.checkedRoute4=2000;
      }
    },
    //购买时长
    checkListFive(type5,checked){
      this.type5=type5;
      this.checked5=checked;
      console.log(type5,checked)
    },
    checkedOrNo(){
      console.log(this.checked);
      if(this.checked==true){
        this.checkOrNull='是'
      }else{
        this.checkOrNull='否'
      }
    },
    //点击跳转支付页面
    payPage(){
      let params={
        address:this.checked1,
        savePeak:this.checked2,
        elasticPeak:this.checkedRoute3,
        autoPay:this.checkOrNull,
        BusinessBroadband:this.checkedRoute4,
        httpQPS:this.checkChange1,
        httpsQPS:this.checkChange2,
        shareNum:60,
        payTime:this.checked5,
        payMoney:this.allMoney
      }
      let objStr = JSON.stringify(params)
      sessionStorage.setItem("allData", [objStr])
      this.$router.push({
        name: 'pay',
        // params:{
          
        // }
      })
    },
    //滚动监听
    handleScroll: function () {
    //   const that = this
    // let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    // that.scrollTop = scrollTop
    //   console.log(that.scrollTop)
    //     if (that.scrollTop > 60) {
    //       that.btnFlag = true
    //     } else {
    //       that.btnFlag = false
    //     }
      //console.log(scrollTop,document.body.scrollHeight);
      // console.log(scrollTop)
      // let offsetTop = document.querySelector('body').offsetTop;
      // console.log(offsetTop)
      // document.documentElement.scrollTop = offsetTop.scrollHeight;
      // //console.log(document.documentElement.scrollTop)
      // offsetTop.scrollHeight < 60 ? this.searchBarFixed = true : this.searchBarFixed = false;
    },
    destroyed () {
      window.removeEventListener('scroll', this.handleScroll)
    },

  }
}
</script>
<style lang="scss">
.newClear:after{
  display: block;
  clear:both;
  content:"";
}
.topTit{
  width:100%;
  background-color: #fff;
  -webkit-box-shadow: 0 2px 3px #e2e9ee;
  box-shadow: 0 2px 3px #e2e9ee;
  height:60px;
  .topTitCenterR{
    width:1250px;
    margin:0 auto;
    line-height: 60px;
    font-size: 24px;
    font-weight: 400;
  }
}
.contentMain{
  width:100%;
  padding:20px;
  .contentMainCenter{
    width:1290px;
    margin:0 auto;
    padding:0 20px;
    .leftContent{
      width:930px;
      float:left;
      padding:15px 20px;
      background-color: #fff;
      -webkit-box-shadow: 0 2px 3px #e2e9ee;
      box-shadow: 0 2px 3px #e2e9ee;
      ul{
        li{
          padding:15px 0;
          border-bottom:1px solid #e4e9f0;
          .checkList{
            padding:15px 0;
            .checkListLeft{
              float:left;
              width:130px;
              line-height: 30px;
              color: #666;
              font-size: 14px;
            }
            .checkListRight{
              float: left;
              line-height: 28px;
              width:724px;
              .tipList{
                font-size:12px;
                padding:12px 0;
                .tipListOne{
                  color:#999;
                  line-height: 16px;
                }
                .tipListTwo{
                  color:red;
                }
                .tipListThree{
                  color:#999;
                }
              }
              .spanList{
                width:100px;
                height:33px;
                line-height: 33px;
                text-align:center;
                color:#444;
                font-size:12px;
                margin-bottom:10px;
                border:1px solid #ddd;
                display: inline-block;
                position:relative;
                :hover{
                  background-color: #f2f2f2;
                }
                .spanListPosi{
                  position:absolute;
                  right:0;
                  top:0;
                  width:18px;
                  height:18px;
                  border-radius: 2px;
                  color:#fff;
                  font-size:12px;
                  text-align:center;
                  line-height: 18px;
                  background-color:#FF7200;
                }
              }
              .textList{
                color:#999;
              }
            }
          }
        }
      }
    }
    .rightContent{
      float:right;
      width:300px;
      background-color: #fff;
      -webkit-box-shadow: 0 2px 3px #e2e9ee;
      box-shadow: 0 2px 3px #e2e9ee;
      padding:0 20px 20px;
      h1{
        padding:15px 0;
        border-bottom:1px solid #ddd;
        font-size: 16px;
        font-weight: 400;
      }
      .allConList{
        padding:20px 0 5px;
        border-bottom:1px solid #ddd;
        p{
          margin-bottom:20px;
          font-size:14px;
          span:nth-child(1){
            width:130px;
            display:inline-block;
            line-height: 14px;
          }
          span:nth-child(2){
            display:inline-block;
            line-height: 14px;
            font-size:12px;
            color:#999;
          }
        }
      }
      .allMoney{
        padding:20px 0 10px;
        span{
          font-size:14px;
          color:#666;
        }
        p{
          margin:16px 0 22px;
          font-size:25px;
          font-weight:500;
          color:#ed711f;
        }
        .payBtn{
          width:100px;
          height:35px;
          color:#fff;
          line-height: 35px;
          text-align:center;
          background-color:#006eff;
          border:0;
        }
      }
    }
  }
}
.spanList:hover{
  background-color:#f2f2f2;
}
.seceltList{
  border:1px solid #006eff!important;
  color:#006eff!important;
}
.isFixed{
  position:fixed;
  background-color:#Fff;
  top:60px;
  z-index:999;
}
</style>