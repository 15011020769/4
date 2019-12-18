<template>
  <div>
    <div class="topTitle">
      防护设置
    </div>
    <div class="protectionCon">
      <div class="packageInfo">
        <h2>套餐信息</h2>
        <el-row>
          <el-col :span="12">
            <div class="informationList">
              <p><span>套餐</span><span>台湾台北 高级版<a href="#" class="blueHref" @click="packageUpgradeModel">升级</a></span></p>
              <p><span>到期时间</span><span>2020-01-12 16：00：00<a href="#" class="blueHref" @click="RenewModelBtn">续费</a></span></p>
              <p><span>标签</span><span>无</span></p>
              <p>
                <span>自动续费开关</span>
                <span>
                  <el-switch
                    v-model="automatiCrenewal"
                    active-color="#006eff"
                    inactive-color="#bbb">
                  </el-switch>
                </span>
              </p>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="informationList">
              <p><span>域名</span><span>0个 (每个域名包包含10个域名防护，仅支持1个一级域名)<a href="#" class="blueHref" @click="buyDominPackBtn">购买域名包</a></span></p>
              <p><span>已使用域名</span><span>2/20个</span></p>
              <p><span>安全日志服务包</span><span><a class="orangeHref">0个</a>（一个包包含1T日志服务存储容量），<a href="#" class="blueHref" @click="buyLogBack"> 立即购买</a></span></p>
              <p><span>QPS扩展包</span><span>当前QPS峰值 <a class="greenHref">0</a>当前套餐QPS <a class="orangeHref">2500</a>，<a href="#" class="blueHref" @click="qpsBack">立即购买</a></span></p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <dominList/>
      </div>
    </div>
    <packageUpgradeModel :isShow="packageUpModelShow" @packageUpModelClose="packageUpModelClose"/>
    <buyDominPack :isShow="buyDominModelShow" @buyDominPacModelClose="buyDominPacModelClose"/>
    <RenewModel :isShow="RenewModelShow" @renewModelClose="renewModelClose"/>
    <buyLogBackModel :isShow="buyLogBackModel" @closeLogBackModel="closeLogBackModel"/>
    <qpsBackModel :isShow="qpsBackModel" @closeqpsModel="closeqpsModel"/>
  </div>
</template>
<script>
import packageUpgradeModel from './model/packageUpgradeModel'
import buyDominPack from './model/buyDominPack'
import RenewModel from './model/RenewModel'
import dominList from './components/dominList'
import buyLogBackModel from './model/buyLogBackModel'
import qpsBackModel from './model/qpsBackModel'
export default {
  data(){
    return{
      automatiCrenewal:false,//套餐升级按钮
      packageUpModelShow:false,//套餐升级按钮弹框
      buyDominModelShow:false,//购买域名包
      RenewModelShow:false,//续费
      buyLogBackModel:false,//安全日志服务包
      qpsBackModel:false,//qps扩展包
    }
  },
  components:{
    packageUpgradeModel:packageUpgradeModel,//升级
    buyDominPack:buyDominPack,//购买域名包
    RenewModel:RenewModel,//续费
    dominList:dominList,//域名列表模块
    buyLogBackModel:buyLogBackModel,//安全日志服务包
    qpsBackModel:qpsBackModel,//qps扩展包
  },
  methods:{
    //升级按钮
    packageUpgradeModel(){
      this.packageUpModelShow=true;
    },
    //升级弹框关闭按钮
    packageUpModelClose(isShow){
      this.packageUpModelShow=isShow;
    },
    //购买域名包按钮
    buyDominPackBtn(){
      this.buyDominModelShow=true;
    },
    //购买域名包关闭按钮
    buyDominPacModelClose(isShow){
      this.buyDominModelShow=isShow;
    },
    //续费按钮
    RenewModelBtn(){
      this.RenewModelShow=true;
    },
    //续费关闭按钮
    renewModelClose(isShow){
      this.RenewModelShow=isShow;
    },
    //购买安全日志服务包
    buyLogBack(){
      this.buyLogBackModel=true;
    },
    //关闭安全日志服务包
    closeLogBackModel(isShow){
      this.buyLogBackModel=isShow;
    },
    //购买qpsBack
    qpsBack(){
      this.qpsBackModel=true;
    },
    //关闭qps
    closeqpsModel(isShow){
      this.qpsBackModel=isShow;
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  content:'';
  display:inline-block;
  clear:both;
}
.topTitle{
  width:100%;
  height:50px;
  line-height:50px;
  border-bottom:1px solid #ddd;
  padding:0 20px;
  font-size:16px;
  font-weight:600;
  color:#000;
  background-color:#fff;
}
.protectionCon{
  width:100%;
  padding:20px;
  .packageInfo{
    width:100%;
    height:210px;
    padding:20px;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
    padding: 20px;
    h2{
      font-size:14px;
      font-weight:600;
      margin-bottom:16px;
    }
    .informationList{
      p{
        margin-bottom:16px;
        span:nth-child(1){
          font-size:12px;
          color:#999;
          display:inline-block;
          width:100px;
        }
        span:nth-child(2){
          a.blueHref{
            margin-left:10px;
            color:#006eff;
          }
          a.orangeHref{
            color:#FF9D00;
            font-weight:600;
          }
          a.greenHref{
            font-weight:600;
            color:#007e3b;
          }
        }
      }
    }
  }
}
</style>