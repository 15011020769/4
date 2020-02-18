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
          value="ALL">
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
        <div class="newClear">
          <div class="newClear newList">
            <p>IP</p>
            <p>10.1.1.23<span>拦截</span></p>
          </div>
          <div class="newClear newList">
            <p>域名</p>
            <p>-</p>
          </div>
          <div class="newClear newList">
            <p>拦截开始时间</p>
            <p>2019-12-18 14:47:48</p>
          </div>
          <div class="newClear newList">
            <p>拦截结束时间</p>
            <p>2019-12-25 23:59:59</p>
          </div>
          <div class="newClear newList">
            <p>类别</p>
            <p>黑名单</p>
          </div>
          <div class="newClear newList">
            <p>触发策略名称</p>
            <p>custom</p>
          </div>
        </div>
        <a href="#" @click="addBlack">加入黑白名单</a>
      </div>
    </div>
    <addBlackWhite :isShow="addBwModel" @closeModel="closeModel"/>
  </div>
</template>

<script>
import addBlackWhite from './model/addBlackWhite'
import { DESCRIBE_HOSTS, DESCRIBE_ACTIONED } from '@/constants'
export default {
  data () {
    return {
      ipSearch:'',//ip查询下拉
      ipSearchOptions:[],
      closeTip:true,//提示显示
      searchIp:'',//要查询的IP
      addBwModel:false,//弹框
      ipTest: false // ip输入格式是否正确
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
        this.ipSearchOptions = data.Response.HostList
        console.log(data);
      })
    },
    // 获取黑白名单列表
    getActioned() {
      console.log(111);
      let params = {
        Version: '2018-01-25',
        Domain: this.ipSearch,
        Ip: this.searchIp,
      }
      this.axios.post(DESCRIBE_ACTIONED, params).then(data => {
        console.log(data);
      })
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
