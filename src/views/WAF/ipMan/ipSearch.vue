<template>
  <div>
    <div class="topHeader">
      <span>IP查询</span>
      <el-select
        v-model="ipSearch"
        filterable
        allow-create
        default-first-option
        placeholder="请选择文章标签">
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
        在这里，你可以查询某个IP的封堵状态，是否在IP黑白名单中，是否触发了CC，BOT，自定义人机识别等
        <span class="el-icon-close" @click="closeTipBtn"></span>
      </div>
      <div class="searchIpt">
        <el-input v-model="searchIp" class="searchIp" :style="ipTest && 'border: 1px solid #e1504a; box-size: border-box'"></el-input>
        <el-button @click="getActioned" class="searchBtn">查询</el-button>
        <div class="err-tips" v-show="ipTest">IP格式输入有误</div>
      </div>
      <div class="searchResoult">
        <h1>查询结果</h1>
        <div class="newClear" v-if="ipInfo.length">
          <div class="newClear newList">
            <p>IP</p>
            <p>{{ipInfo[0].Ip}}<span style="margin-left: 10px; color: #007e3b">{{ipInfo[0].Name | currentTipsFilter}}</span></p>
          </div>
          <div class="newClear newList">
            <p>域名</p>
            <p>-</p>
          </div>
          <div class="newClear newList">
            <p>拦截开始时间</p>
            <p>{{ipInfo[0].TsVersion | currentTimeFilter}}</p>
          </div>
          <div class="newClear newList">
            <p>拦截结束时间</p>
            <p>{{ipInfo[0].ValidTs | currentTimeFilter}}</p>
          </div>
          <div class="newClear newList">
            <p>类别</p>
            <p>{{ipInfo[0].Category | currentNameFilter}}</p>
          </div>
          <div class="newClear newList">
            <p>触发策略名称</p>
            <p>{{ipInfo[0].Name}}</p>
          </div>
        </div>
        <a href="#" v-if="ipInfo.length" @click="addBlack">加入黑白名单</a>
        <span v-if="!ipInfo.length">{{textTips}}</span>
      </div>
    </div>
    <template v-if="ipInfo[0]">
      <addBlackWhite :isShow="addBwModel" @closeModel="closeModel" :ipInfo="Object.assign(ipInfo[0], { Domain: ipSearch })"/>
    </template>
  </div>
</template>

<script>
import addBlackWhite from './model/addBlackWhite'
import { DESCRIBE_HOSTS, DESCRIBE_ACTIONED } from '@/constants'
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
      textTips: '请输入IP，并点击查询。'
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
      let pattern = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g
      this.ipTest = !pattern.test(n)
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
    addBlack(){
      this.addBwModel=true;
    },
    //关闭
    closeModel(isShow){
      this.addBwModel=isShow;
    },
    // 获取防护域名列表
    getDescribeHost() {
      let params = {
        Version: '2018-01-25',
      }
      
      this.axios.post(DESCRIBE_HOSTS, params).then(data => {
        if (data.Response.Error) {
          let ErrOr = Object.assign(ErrorTips, COMMON_ERROR)
          this.$message({
            message: ErrOr[Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          })
        } else {
          this.ipSearchOptions = data.Response.HostList
        }
      })
    },
    // 获取黑白名单列表
    getActioned() {
      let params = {
        Version: '2018-01-25',
        Domain: this.ipSearch,
        Ip: this.searchIp,
      }
      this.axios.post(DESCRIBE_ACTIONED, params).then(data => {
        if (data.Response.Error) {
          let ErrOr = Object.assign(ErrorTips, COMMON_ERROR)
          this.$message({
            message: ErrOr[Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          })
        } else {
          this.ipInfo = data.Response.Data.Res
          this.textTips = `没有在域名${this.ipSearch}下，查到${this.searchIp} 的相关信息。`
        }
      })
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

    currentNameFilter(text) {
      if (text === 'whiteIp') {
        return '白名单'
      }
      return '黑名单'
    },

    currentTipsFilter(text) {
      if (text === 'custom') {
        return '放通'
      }
      return '拦截'
    }
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
</style>
