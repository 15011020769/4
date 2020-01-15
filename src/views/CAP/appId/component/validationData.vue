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
            <Time></Time>
          </div>
        </div>
        <div class="echarts">
          <Echarts
            v-if="echartsData0.show"
            :data="echartsData0.data"
            :xAxis="echartsData0.xAxis"
            :series="echartsData0.series"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Echarts from "../../component/echarts";
import Time from "../../component/time";
import { QUERY_REQDATA, CLASSIFY_QUERY } from "@/constants/CAP.js";
export default {
  name: "validationData",
  data() {
    return {
      dataSum: [],
      End: this.getDateString(new Date()),
      Start: this.getDateString(
        new Date(new Date()),1
      ),
      Id: this.$route.query.Id,
      echartsData0: {
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
      }
    };
  },
  components: {
    Echarts,
    Time
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
      console.log(res);
      const data0 = [];
      const xData = [];
      this.echartsData0.xAxis = [];
      this.echartsData0.series = [];
      res.Response.Data.forEach(item => {
        data0.push(item.Cnt);
        xData.push(item.Date);
      });
      this.echartsData0.xAxis = xData;
      this.echartsData0.series.push({
        name: "请求量",
        type: "line",
        data: data0
      });
      params.Type = 1;
      this.getEachrtsData(params).then(res => {
        console.log(res);
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
          console.log(res);
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
            console.log(res);
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
            console.log(this.echartsData0.show)
          });
        });
      });
    });
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
        console.log(res);
        this.dataSum = res.Response;
        console.log(this.dataSum);
      });
    },
    //获取折线图数据
    getEachrtsData(params) {
      return this.axios.post(CLASSIFY_QUERY, params);
    },
    switchData0(StartDate, EndDate) {
      const params = {
        Version: "2019-01-01",
        Type: 0
      };
      // getEachrtsData(params, this.echartsData0);
    },
    switchData1(StartDate, EndDate) {
      const params = {
        Version: "2019-01-01",
        Type: 1
      };
      // getEachrtsData(params, this.echartsData0);
    },
    // 时间格式化'yyyy-MM-dd hh:mm:ss'
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