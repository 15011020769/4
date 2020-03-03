<template>
  <div>
    <div class="topTitle">
      {{t('防护设置', 'WAF.fhsz')}}
    </div>
    <div class="protectionCon">
      <div class="packageInfo">
        <h2>套餐信息</h2>
        <el-row>
          <el-col :span="12">
            <div class="informationList">
              <p>
                <span>套餐</span>
                <span v-if="package.Level">
                  {{CLB_PACKAGE_CFG_TYPES[package.Level].name}}
                  <a v-if="package.Level !== 0" href="#" class="blueHref" @click="packageUpgradeModel">{{t('升级', 'WAF.sj')}}</a>
                </span>
              </p>
              <p>
                <span>{{t('到期时间', 'WAF.dqsj')}}</span>
                <span v-if="package.Level">{{package.ValidTime}}<a href="#" class="blueHref" @click="RenewModelBtn">续费</a></span>
              </p>
              <p><span>{{t('标签', 'WAF.bq')}}</span><span>{{t('无', 'WAF.w')}}</span></p>
              <p>
                <span>{{t('自动续费开关', 'WAF.zdxfkg')}}</span>
                <span>
                  <el-switch
                    v-model="AutoRenewBool"
                    active-color="#006eff"
                    inactive-color="#bbb"
                    @change="onChangeAutoRenew"
                  >
                  </el-switch>
                </span>
              </p>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="informationList">
              <p>
                <span>域名包</span>
                <span>{{package.DomainPkg && package.DomainPkg.Count || 0}}{{t('个', 'WAF.g')}} 
                  ({{t('每个域名包包含10个域名防护，仅支持1个一级域名', 'WAF.mgymb')}})
                  <a href="#" class="blueHref" @click="buyDominPackBtn">
                    <template v-if="package.DomainPkg">{{t('购买域名包', 'WAF.gmymb')}}</template>
                    <template v-else>{{t('立即购买', 'WAF.ljgm')}}</template>
                  </a>
                </span>
              </p>
              <p><span>已使用域名</span><span>{{package.DomainCount}}/{{package.DomainLimit}}{{t('个', 'WAF.g')}}</span></p>
              <p>
                <span>{{t('安全日志服务', 'WAF.aqrzfwb')}}包</span>
                <span>
                  <a class="orangeHref">{{package.Cls && package.Cls.Count || 0}}{{t('个', 'WAF.g')}}</a>
                  （{{t('一个包包含1T日志服务存储容量', 'WAF.ygbbh')}}），
                  <a href="#" class="blueHref" @click="buyLogBack">
                    <template v-if="package.Cls">{{t('立即升级', 'WAF.ljsj')}}</template>
                    <template v-else>{{t('立即购买', 'WAF.ljgm')}}</template>
                  </a>
                </span>
              </p>
              <p>
                <span>{{t('QPS扩展包', 'WAF.qpskzb')}}</span>
                <span>{{t('到期时当前QPS峰值间', 'WAF.dqqpsfz')}} 
                  <a class="greenHref">{{package.MaxQPS}}</a> 
                  {{t('当前套餐QPS', 'WAF.dqqps')}} 
                  <a class="orangeHref">
                    {{package.Level && CLB_PACKAGE_CFG_TYPES[package.Level].busQps + (package.QPS && package.QPS.Count || 0)}}
                  </a>，
                  <a href="#" class="blueHref" @click="qpsBack">
                    <template v-if="package.QPS">{{t('立即升级', 'WAF.ljsj')}}</template>
                    <template v-else>{{t('立即购买', 'WAF.ljgm')}}</template>
                  </a>
                </span>
              </p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <dominList :package="package" />
      </div>
    </div>
    <packageUpgradeModel :package="package" :isShow="packageUpModelShow" @packageUpModelClose="packageUpModelClose"/>
    <buyDominPack :package="package" :isShow="buyDominModelShow" @buyDominPacModelClose="buyDominPacModelClose"/>
    <RenewModel :package="package" :isShow="RenewModelShow" @renewModelClose="renewModelClose"/>
    <buyLogBackModel :package="package" :isShow="buyLogBackModel" @closeLogBackModel="closeLogBackModel"/>
    <qpsBackModel :package="package" :isShow="qpsBackModel" @closeqpsModel="closeqpsModel"/>
  </div>
</template>
<script>
import packageUpgradeModel from './model/packageUpgradeModel'
import buyDominPack from './model/buyDominPack'
import RenewModel from './model/RenewModel'
import dominList from './components/dominList'
import buyLogBackModel from './model/buyLogBackModel'
import qpsBackModel from './model/qpsBackModel'
import { DESCRIBE_USER_INFO, MODIFY_PACKAGE_RENEW } from '@/constants'
import { ErrorTips } from "@/components/ErrorTips"
import { CLB_PACKAGE_CFG_TYPES, COMMON_ERROR } from '../constants'

export default {
  data(){
    return{
      automatiCrenewal:false,//套餐升级按钮
      packageUpModelShow:false,//套餐升级按钮弹框
      buyDominModelShow:false,//购买域名包
      RenewModelShow:false,//续费
      buyLogBackModel:false,//安全日志服务包
      qpsBackModel:false,//qps扩展包
      package: {}, // 套餐信息
      CLB_PACKAGE_CFG_TYPES,
      AutoRenewBool: false,
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
  mounted() {
    this.init()
  },
  methods:{
    init() {
      this.getPackage()
    },
    onChangeAutoRenew(status) {
      this.AutoRenewBool = !status
      this.$confirm(this.t('开启自动续费后，所有已购买的计费项将会被续费。', 'WAF.xftip'), this.t('开启自动续费', 'WAF.kqzdxf'), {
        confirmButtonText: this.t('确定', 'WAF.qd'),
        cancelButtonText: '取消',
        type: ''
      }).then(() => {
        this.axios.post(MODIFY_PACKAGE_RENEW, {
          Version: '2018-01-25',
          Status: Number(status)
        }).then(resp => {
          this.generalRespHandler(resp, this.getPackage)
        }, COMMON_ERROR, this.t('切换成功', 'WAF.qhcg'))
      })
    },
    getPackage() {
      this.axios.post(DESCRIBE_USER_INFO, {
        Version: '2018-01-25'
      }).then(resp => {
        this.generalRespHandler(resp, ({ Data }) => {
          this.AutoRenewBool = !!Data.AutoRenew
          this.package = Data
        })
      })
    },
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