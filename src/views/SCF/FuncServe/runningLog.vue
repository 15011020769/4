<template>
  <div>
    <div class="contentMain">
      <div class="topChoseTime newClear">
        <el-select v-model="logStatus" class="chooseSelect">
            <el-option label="全部日志" value="allLog"></el-option>
            <el-option label="调用成功" value="successLog"></el-option>
            <el-option label="调用失败" value="errorLog"></el-option>
        </el-select>
        <el-button-group class="bthGroup">
          <el-button @click="thisTime(1)">实时</el-button>
          <el-button @click="thisTime(2)">近24小时</el-button>
        </el-button-group>
        <el-date-picker
          v-model="value1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="timeNode">
        </el-date-picker>
        <el-button type="primary" @click="reset">重置</el-button>
        <div class="topFloatRight">
          <el-input v-model="iptSearch" placeholder="请输入requestID" class="rigthSearch"/>
          <el-button class="el-icon-search"></el-button>
        </div>
      </div>
      <div class="bottomContent newClear">
        <div class="leftConList">
          <ul>
            <li v-for="item in logList" :key="item.id"><span>{{item.time}}</span><span>{{item.status}}</span></li>
          </ul>
        </div>
        <div class=RightShow>
          <p>请求ID：138f46465fsdf45</p>
          <div class="timeCenterShow">
            <span>时间：</span><span class="marginColor">2019-11-16 17:46:21</span>
            <span>运行时间：</span><span class="marginColor">0.2ms</span>
            <span>计费时间</span><span class="marginColor">100ms</span>
            <span>占用内存</span><span class="marginColor">10.094mb</span>
          </div>
          <div class="logAndData">
            <div class="dataContent">
              <h1>返回数据：</h1>
              <p>"hello from scf"</p>
            </div>
            <div class="logContent">
              <h1>日志：</h1>
              <div class="logCodeCont">
                START RequestId: f25925b2-0855-11ea-b666-5254000c8aa4<br/>
                Event RequestId: f25925b2-0855-11ea-b666-5254000c8aa4<br/>
                Hello World<br/>
                value1 = test value 1<br/>
                value2 = test value 2<br/>
                END RequestId: f25925b2-0855-11ea-b666-5254000c8aa4<br/>
                Report RequestId: f25925b2-0855-11ea-b666-5254000c8aa4 Duration:0ms Memory:128MB MaxMemoryUsed:10.093750MB
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
        logStatus:"全部状态",
        value1:"",
        iptSearch:"",
        logList:[
          {id:"1",time:"2019-11-18 10:21:21",status:"调用成功"},
          {id:"2",time:"2019-11-19 15:50:21",status:"调用成功"}
        ]
    }
  },
  methods: {
    thisTime(thisTime){
      var ipt1=document.querySelector(".timeNode input:nth-child(2)");
      var ipt2=document.querySelector(".timeNode input:nth-child(4)");
      const end = new Date();
      const start = new Date();
      if(thisTime=="1"){
        start.setTime(start.getTime() - 3600 * 1000 );
      }
      else if(thisTime=="2"){
        start.setTime(start.getTime() - 3600 * 1000 * 24);
      }
      ipt1.value=start.toLocaleString('chinese',{hour12:false}).replace(/\//g,'-');
      ipt2.value=end.toLocaleString('chinese',{hour12:false}).replace(/\//g,'-')
    },
    reset(){
      this.logStatus="全部状态";
      this.value1=null
    }
  }
};
</script>
<style lang="scss">
.topChoseTime{
  margin-bottom:12px;
  .chooseSelect{
    margin-right:10px;
  }
  .bthGroup{
    margin-right:10px;
  }
  .timeNode{
    margin-right:10px;
  }
  .topFloatRight{
    float:right;
    .rigthSearch{
      width:200px;
      input{
        width:200px;
      }
    }
  }
  
}
.bottomContent{
  min-height:500px;
  background-color:#fff;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
  border:1px solid #ddd;
  width:100%;
  .leftConList{
    float:left;
    width:370px;
    border-right:1px solid #ddd;
    min-height:500px;
    ul{
      li{
        width:100%;
        height:50px;
        line-height:50px;
        border-bottom:1px solid #ddd;
        font-size:12px;
        padding:0 20px;
        span:nth-child(1){
          margin-right:110px;
        }
      }
    }
  }
  .RightShow{
    float:right;
    width:calc(100% - 371px);
    min-height:500px;
    padding:10px 20px;
    p{
      margin-bottom:10px;
      font-size:14px;
    }
    .timeCenterShow{
      width:100%;
      height:40px;
      line-height: 40px;
      font-size:12px;
      margin-bottom:20px;
      color:#888;
      background-color:rgb(242, 242, 242);
      padding:0 12px;
      .marginColor{
        color:#000;
        margin-right:12px;
      }
    }
    .logAndData{
      border-left:11px solid rgb(210, 231, 247);
      min-height:300px;
      background-color:rgb(242, 242, 242);
      padding:12px;
      div{
        h1{
          font-size:14px;
          color:rgb(48, 127, 220);
          margin-bottom:12px;
        }
      }
      .logCodeCont{
        line-height:24px;
        font-size: 14px;
      }
    }
  }
}

</style>