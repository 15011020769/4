<template>
  <div>
    <div class="topHeader">
      <span>IP{{t('查询', 'WAF.js')}}</span>
      <el-select
        v-model="ipSearch">
        <el-option
          key="all"
          label="ALL"
          value="global">
        </el-option>
        <el-option
          v-for="item in ipSearchOptions"
          :key="item.Domain"
          :label="item.Domain"
          :value="item.Domain">
        </el-option>
      </el-select>
    </div>
    <div class="wrapper">
      <div class="tipTop newClear" v-if="closeTip">
        {{t('在这里，你可以查询某个IP的封堵状态，是否在IP黑白名单中，是否触发了CC，BOT，自定义人机识别等', 'WAF.zzlnkycx')}}
        <span class="el-icon-close" @click="closeTipBtn"></span>
      </div>
      <div class="searchIpt">
        <el-input v-model="searchIp" class="searchIp" :style="ipTest && 'border: 1px solid #e1504a; box-size: border-box'"></el-input>
        <el-button @click="getActioned" class="searchBtn">{{t('查询', 'WAF.js')}}</el-button>
        <div class="err-tips" v-show="ipTest">{{t('IP格式输入有误', 'WAF.ipgsyw')}}</div>
      </div>
      <div class="searchResoult">
        <h1>{{t('查询', 'WAF.js')}}{{t('结果', 'WAF.jg')}}</h1>
        <div class="newClear" v-for="ip in ipInfo" :key="ip.Ip">
          <div class="newClear newList">
            <p>IP</p>
            <p>{{ip.Ip}}<span :class="'status-'+ip.Action">{{currentTipsFilter(ip.Action)}}</span></p>
          </div>
          <div class="newClear newList">
            <p>域名</p>
            <p>-</p>
          </div>
          <div class="newClear newList">
            <p>{{t('拦截开始时间', 'WAF.ljkssj')}}</p>
            <p>{{ip.TsVersion | currentTimeFilter}}</p>
          </div>
          <div class="newClear newList">
            <p>{{t('拦截结束时间', 'WAF.ljjssj')}}</p>
            <p>{{ip.ValidTs | currentTimeFilter}}</p>
          </div>
          <div class="newClear newList">
            <p>{{t('类别', 'WAF.lb')}}</p>
            <p>{{currentNameFilter(ip.Category)}}</p>
          </div>
          <div class="newClear newList">
            <p>{{t('触发策略名称', 'WAF.csclmc')}}</p>
            <p>{{ip.Name}}</p>
          </div>
          <el-button type="text" v-if="ipInfo.length" @click="addBlack(ip)">{{t('加入黑白名单', 'WAF.jrhbmd')}}</el-button>
        </div>
        <span v-if="!ipInfo.length">{{textTips}}</span>
      </div>
    </div>
    <el-dialog
      title="添加黑白IP"
      :visible.sync="addBwModel"
      width="45%"
      destroy-on-close
    >
      <addBlackWhite :isShow.sync="addBwModel" @success="closeModel" :ipInfo="editIpInfo"/>
    </el-dialog>
  </div>
</template>

<script>
import addBlackWhite from './model/addBlackWhite'
import { DESCRIBE_HOSTS, DESCRIBE_ACTIONED } from '@/constants'
import { isValidIPAddressNew } from '@/utils'
import moment from 'moment'
export default {
  data () {
    return {
      ipSearch: 'global',//ip查询下拉
      ipSearchOptions:[],
      closeTip:true,//提示显示
      searchIp:'',//要查询的IP
      addBwModel:false,//弹框
      ipTest: false, // ip输入格式是否正确
      ipInfo: [], // 查询的ip信息
      editIpInfo: {},
      textTips: this.t('请输入IP，并点击查询', 'WAF.qsripjs')
    }
  },
  components:{
    addBlackWhite:addBlackWhite
  },
  mounted() {
    this.getDescribeHost()
  },
  watch: {
    searchIp(n) {
      this.ipTest = !isValidIPAddressNew(n)
    }
  },
  methods: {
    //关闭提示
    closeTipBtn(){
      this.closeTip=false;
    },
    //查询
    searchBtn(){},
    //加入黑名单
    addBlack(ip){
      this.editIpInfo = {
        Domain: this.ipSearch,
        ipAddress: ip.Ip,
        blackWhiteCh: ip.Action,
        des: ip.Name,
        datatime: moment().add(7, 'd'),
        timeValue: moment().add(7, 'd').format('YYYY-MM-DD 23:59:59')
      }
      this.addBwModel=true;
    },
    //关闭
    closeModel(){
      this.addBwModel = false
    },
    // 获取防护域名列表
    getDescribeHost() {
      let params = {
        Version: '2018-01-25',
      }
      
      this.axios.post(DESCRIBE_HOSTS, params)
      .then(resp => {
        this.generalRespHandler(resp, ({ HostList }) => {
          this.ipSearchOptions = HostList
        })
      })
    },
    // 获取黑白名单列表
    getActioned() {
      let params = {
        Version: '2018-01-25',
        Domain: this.ipSearch,
        Ip: this.searchIp,
      }
      this.axios.post(DESCRIBE_ACTIONED, params).then(resp => {
        this.generalRespHandler(resp, ({ Data }) => {
          this.ipInfo = Data.Res
          this.textTips = `没有在域名${this.ipSearch === 'global' ? 'ALL' : this.ipSearch}下，查到${this.searchIp} 的${this.t('相关', 'WAF.xg')}${this.t('信息', 'WAF.info')}。`
        })
      })
    },
    currentNameFilter(text) {
      if (text === 'whiteIp') {
        return this.t('白名单', 'WAF.bmd')
      }
      return this.t('黑名单', 'WAF.hmd')
    },
    currentTipsFilter(action) {
      if (action === 40) {
        return '放通'
      }
      return this.t('拦截', 'WAF.lj')
    }
  },
  filters: {
    currentTimeFilter(time) {
      const len = JSON.stringify(time).length
      let str = time
      if (len < 13) {
       str = str * 1000
      }
      return moment(new Date(str)).format("YYYY-MM-DD HH:mm:ss");
    },
  }
}

</script>
<style lang='scss' scoped>
.newClear:after{
  content:'';
  display: block;
  clear:both;
}
.topHeader{
  width:100%;
  height:50px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
  padding:0 20px;
  line-height: 50px;
  span{
    font-size:16px;
    font-weight:600;
    color:#000;
    margin-right:20px;
  }
}
::v-deep input{
  height:30px;
  border-radius: 0;
}
.wrapper{
  width:100%;
  padding:20px;
  .tipTop{
    width:100%;
    font-size: 12px;
    line-height: inherit;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    .el-icon-close{
      float:right;
      font-size:15px;
    }
  }
  .searchIpt{
    width:100%;
    height:80px;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
    padding: 20px;
    border:1px solid #ddd;
    margin:20px 0;
    .searchIp{
      width:200px;
      float:left;
      margin-right:16px;
    }
    ::v-deep button{
      height:30px;
      line-height: 30px;
      padding:0 20px;
      border-radius: 0;
    }
    .searchBtn{
      background-color:#006eff;
      color:#fff;
    }
    .err-tips {
      font-size: 10px;
      color: #e1504a;
      width: 100px;
      padding-top: 5px;
    }
  }
  .searchResoult{
    width:100%;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
    padding: 20px;
    border:1px solid #ddd;
    h1{
      font-size: 14px;
      font-weight: 600;
      color:#000;
      margin-bottom:20px;
    }
    .newList{
      margin-bottom:20px;
      p:nth-child(1){
        font-size:12px;
        color:#999;
        float:left;
        width:105px;
      }
      p:nth-child(2){
        font-size:12px;
        color:#000;
        float:left;
        width:calc(100% - 105px);
      }
    }
  }
}
.status-40 {
  color: #007e3b;
  margin-left: 15px;
}
.status-42 {
  color: #e1504a;
  margin-left: 15px;
}
</style>
