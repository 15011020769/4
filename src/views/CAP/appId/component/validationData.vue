<template>
  <div class="wrap">
    <div class="accounted">
      <div class="accountedData">
        <p>昨日恶意占比</p>
        <p>{{dataSum.CheckTicketSum}}</p>
      </div>
      <div class="accountedData">
        <p>昨日请求量</p>
        <p>{{dataSum.VfySum}}</p>
      </div>
      <div class="accountedData">
        <p>昨日验证量</p>
        <p>{{dataSum.AttackSum}}</p>
      </div>
      <div class="accountedData">
        <p>昨日通过量</p>
        <p>{{dataSum.GetSum}}</p>
      </div>
      <div class="accountedData">
        <p>昨日恶意拦截量</p>
        <p>{{dataSum.VfySuccSum}}</p>
      </div>
      <div class="accountedData" style="border:none">
        <p>昨日票据校验量</p>
        <p>---</p>
      </div>
    </div>
    <div class="accData">
      <div class="charts">
        <div class="chartsTitle">
          <div class="left">验证通过与拦截</div>
          <div class="right">
            <Time :classvalue="classvalues" @setTimeClassvalues="setTimeClassvalues"></Time>
          </div>
        </div>
        <div class="echarts">
          <EchartsCaptcha
            v-if="echartsData0.show"
            :id="echartsData0.id"
            :data="echartsData0.data"
            :xAxis="echartsData0.xAxis"
            :series="echartsData0.series"
          />
        </div>
      </div>
      <div class="charts">
        <div class="chartsTitle">
          <div class="left">拦截情况 (%)</div>
          <div class="right">
            <Time :classvalue="classvalue" @setTimeClassvalue="setTimeClassvalue"></Time>
          </div>
        </div>
        <div class="echarts">
          <EchartsCaptcha
            v-if="echartsData1.show"
            :id="echartsData1.id"
            :data="echartsData1.data"
            :xAxis="echartsData1.xAxis"
            :series="echartsData1.series"
          />
        </div>
      </div>
       <div class="charts">
        <div class="chartsTitle">
          <div class="left">验证码加载耗时 (秒)</div>
          <div class="right">
            <Time :classvalue="classvalue" @setTimeClassvalue="setTimeClassvalue"></Time>
          </div>
        </div>
        <div class="echarts">
          <EchartsCaptcha
            v-if="echartsData2.show"
            :id="echartsData2.id"
            :data="echartsData2.data"
            :xAxis="echartsData2.xAxis"
            :series="echartsData2.series"
          />
        </div>
      </div>
      <div class="charts">
        <div class="chartsTitle">
          <div class="left">验证码加载耗时 (秒)</div>
          <div class="right">
            <Time :classvalue="classvalue" @setTimeClassvalue="setTimeClassvalue"></Time>
          </div>
        </div>
        <div class="echarts">
          <EchartsCaptcha
            v-if="echartsData3.show"
            :id="echartsData3.id"
            :data="echartsData3.data"
            :xAxis="echartsData3.xAxis"
            :series="echartsData3.series"
          />
        </div>
      </div>
       <div class="charts">
        <div class="chartsTitle">
          <div class="left">一次通过尝试次数分布</div>
          <div class="right">
            <Time :classvalue="classvalue" @setTimeClassvalue="setTimeClassvalue"></Time>
          </div>
        </div>
        <div class="echarts">
          <EchartsCaptcha
            v-if="echartsData4.show"
            :id="echartsData4.id"
            :data="echartsData4.data"
            :xAxis="echartsData4.xAxis"
            :series="echartsData4.series"
          />
        </div>
      </div>
    </div>
    
  </div>
</template>
<script>
import EchartsCaptcha from '../../component/echartsCaptcha'
import Time from "../../component/time";
import { QUERY_REQDATA, CLASSIFY_QUERY , USER_HANDLE} from "@/constants/CAP.js";
export default {
  name: "validationData",
  data() {
    return {
      dataSum: [],
      End: this.getDateString(new Date()),
      Start: this.getDateString(
        new Date(new Date()),1
      ),
      classvalues: 1,
      classvalue: 1,
      Id: this.$route.query.Id,
      echartsData0: {
        id: 'echartsData0',
        show: false,
        data: ["请求量", "验证量", "通过量", "拦截量"],
        xAxis: ["00:00", "00:50", "01:40", "02:30", "04:10", "05:00"],
        series: [
          {
            name: "请求量",
            type: "line",
            data: [0, 2, 3, 7, 10, 0]
          },
          {
            name: "验证量",
            type: "line",
            data: [0, 0, 2, 0, 7, 0]
          },
          {
            name: "通过量",
            type: "line",
            data: [1, 2, 3, 4, 5, 9]
          },
          {
            name: "拦截量",
            type: "line",
            data: [4, 4, 3, 2, 1, 0]
          }
        ]
      },
      echartsData1: {
        id: 'echartsData1',
        type: 'OperDataInterceptUnitArray',
        show: false,
        data: ["总拦截比例", "因答案错误拦截比例", "因安全策略打击拦截比例"],
        xAxis: ["00:00", "00:50", "01:40", "02:30", "04:10", "05:00"],
        series: [
          {
            name: "总拦截比例",
            type: "line",
            data: [0, 2, 3, 7, 10, 0]
          },
          {
            name: "因答案错误拦截比例",
            type: "line",
            data: [0, 0, 2, 0, 7, 0]
          },
          {
            name: "因安全策略打击拦截比例",
            type: "line",
            data: [1, 2, 3, 4, 5, 9]
          }
        ]
      },
       echartsData2: {
        id: 'echartsData2',
        type:'OperDataLoadTimeUnitArray',
        show: false,
        data: ["验证码加载耗时"],
        xAxis: ["00:00", "00:50", "01:40", "02:30", "04:10", "05:00"],
        series: [
          {
            name: "验证码加载耗时",
            type: "line",
            data: [0, 2, 3, 7, 10, 0]
          }
        ]
      },
       echartsData3: {
        id: 'echartsData3',
        type:'OperDataTryTimesUnitArray',
        show: false,
        data: ["一次通过平均尝试次数"],
        xAxis: ["00:00", "00:50", "01:40", "02:30", "04:10", "05:00"],
        series: [
          {
            name: "一次通过平均尝试次数",
            type: "line",
            data: [0, 2, 3, 7, 10, 0]
          }
        ]
      },
      echartsData4: {
        id: 'echartsData4',
        type:'OperDataTryTimesDistributeUnitArray',
        show: false,
        data: ["一次通过尝试次数分布"],
        xAxis: ["00:00", "00:50", "01:40", "02:30", "04:10", "05:00"],
        series: [
          {
            name: "一次通过尝试次数分布",
            type: "line",
            data: [0, 2, 3, 7, 10, 0]
          }
        ]
      },
    };
  },
  components: {
    Time,
    EchartsCaptcha
  },
  created() {
    this.getAccount();
    const params = {
      Version: "2019-07-22",
      CaptchaAppId: this.Id,
      Type: 0,
      Start: this.Start,
      End: this.End
    };
    this.echartsData0.show = false;
    this.getEachrtsData(params).then(res => {
      // console.log(res);
      const data0 = [];
      const xData = [];
      this.echartsData0.xAxis = [];
      this.echartsData0.series = [];
      res.Response.Data.forEach(item => {
        data0.push(item.Cnt);
        xData.push(item.Date.substr(8,2)+':'+item.Date.substr(10,2));
      });
      this.echartsData0.xAxis = xData;
      this.echartsData0.series.push({
        name: "请求量",
        type: "line",
        data: data0
      });
      params.Type = 1;
      this.getEachrtsData(params).then(res => {
        // console.log(res);
        const data1 = [];
        res.Response.Data.forEach(item => {
          data1.push(item.Cnt);
        });
        this.echartsData0.series.push({
          name: "验证量",
          type: "line",
          data: data1
        });
        params.Type = 2;
        this.getEachrtsData(params).then(res => {
          // console.log(res);
          const data2 = [];
          res.Response.Data.forEach(item => {
            data2.push(item.Cnt);
          });
          this.echartsData0.series.push({
            name: "通过量",
            type: "line",
            data: data2
          });
          params.Type = 3;
          this.getEachrtsData(params).then(res => {
            // console.log(res);
            const data3 = [];
            res.Response.Data.forEach(item => {
              data3.push(item.Cnt);
            });
            this.echartsData0.series.push({
              name: "拦截量",
              type: "line",
              data: data3
            });
            this.echartsData0.show = true;
            // console.log(this.echartsData0.show)
          });
        });
      });
    });
    this.switchData(this.Start);
  },
  methods: {
    //获取占比量
    getAccount() {
      let params = {
        Version: "2019-07-22",
        CaptchaAppId: this.Id,
        Start: this.Start,
        End: this.End
      };
      this.axios.post(QUERY_REQDATA, params).then(res => {
        // console.log(res);
        this.dataSum = res.Response;
        // console.log(this.dataSum);
      });
    },
    //获取折线图数据
    getEachrtsData(params) {
      return this.axios.post(CLASSIFY_QUERY, params);
    },
    //获取折线图数据2
    getEachrtsDatas(params,eachrtsData) {
        eachrtsData.show = false
       this.axios.post(USER_HANDLE,params).then(res => {
        // console.log(res)
        let data = res.Response.Data
        if(data[eachrtsData.type]&&data[eachrtsData.type].length>0){
          eachrtsData.data = data
        }else{
          eachrtsData.xAxis = ['01-16']
          eachrtsData.series = eachrtsData.data.map((item)=>{
            return {name:item,type:'line',data:[0]}
          })
        }
         this.$nextTick(()=>{
          eachrtsData.show = true
          // console.log(eachrtsData)
         })
       })
    },
    switchData(StartDate,EndDate){
      if(StartDate!=undefined&&StartDate!=""){
        this.Start = StartDate 
      }
      if(EndDate!=undefined&&EndDate!=""){
        this.End = EndDate
      }
      this.switchData0()
      this.switchData1()
      this.switchData2()
      this.switchData3()
    },
    switchData0() {
      let params = {
        Version:'2019-07-22',
        Type: 2,
        CaptchaAppId:this.Id,
        Start:this.Start
      };
      this.getEachrtsDatas(params,this.echartsData1)
    },
    switchData1() {
      let params = {
        Version:'2019-07-22',
        Type: 1,
        CaptchaAppId:this.Id,
        Start:this.Start
      };
      this.getEachrtsDatas(params,this.echartsData2)
    },
    switchData2() {
      let params = {
        Version:'2019-07-22',
        Type: 3,
        CaptchaAppId:this.Id,
        Start:this.Start
      };
      this.getEachrtsDatas(params,this.echartsData3)
    },
     switchData3() {
      let params = {
        Version:'2019-07-22',
        Type: 4,
        CaptchaAppId:this.Id,
        Start:this.Start
      };
      this.getEachrtsDatas(params,this.echartsData4)
    },
    getDateString(date,flag) {
      // debugger
      let o = {
        y: date.getFullYear(),
        M: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        m: date.getMinutes()
      };
      for (const i in o) {
        o[i] = (o[i] + "").length == 1 ? "0" + o[i] : o[i];
      }
      if(flag==1){
        return o.y + "" + o.M + "" + o.d + "0000" ;
      }
      return o.y + "" + o.M + "" + o.d + "" + o.h + "" + o.m ;
    },
    setTimeClassvalue(value){
      this.classvalue = value
    },
    setTimeClassvalues(value){
      this.classvalues = value
    }
  }
};
</script>
<style lang="scss">
.el-tabs__content {
  background: #f2f2f2;
}

.el-tabs__header {
  padding: 0 20px;
  margin: 0;
}
</style>

<style scoped lang="scss">
.wrap {
  width: 100%;
  height: 100%;
  padding: 20px;
  .accounted {
    width: 100%;
    background: white;
    display: flex;
    padding: 20px;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    .accountedData {
      flex: 1;
      border-right: 1px solid #ccc;
      padding-left: 10px;
      p {
        padding: 13px;
      }
    }
  }
  .accData {
    width: 100%;
    .charts {
      width: 100%;
      background: white;
      margin-top: 20px;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      .chartsTitle {
        width: 100%;
        display: flex;
        .left {
          flex: 1;
          font-size: 15px;
          padding: 10px 10px;
          display: flex;
          align-items: center;
        }
        .right {
          width: 430px;
          padding: 10px 0px 10px 10px;
        }
      }
      .echarts {
        width: 100%;
      }
    }
  }
}
</style>