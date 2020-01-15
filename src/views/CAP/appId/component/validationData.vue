<template>
  <div class="wrap">
    <div class="accounted">
      <div class="accountedData">
        <p>昨日恶意占比</p>
        <p>---</p>
      </div>
      <div class="accountedData">
        <p>昨日请求量</p>
        <p>---</p>
      </div>
      <div class="accountedData">
        <p>昨日验证量</p>
        <p>---</p>
      </div>
      <div class="accountedData">
        <p>昨日通过量</p>
        <p>---</p>
      </div>
      <div class="accountedData">
        <p>昨日恶意拦截量</p>
        <p>---</p>
      </div>
      <div class="accountedData" style="border:none">
        <p>昨日票据校验量</p>
        <p>---</p>
      </div>
    </div>
    <div class="accData">
      <Echarts :data="echartsData" :xAxis="xAxis" :series="series" />
    </div>
  </div>
</template>
<script>
import Echarts from "../../component/echarts";
export default {
  name: "validationData",
  data() {
    return {
      echartsData: ["请求量", "验证量", "通过量", "拦截量"],
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
    };
  },
  components: {
    Echarts
  }
};
</script>
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
    background: white;
    .charts {
      width: 100%;
      background: white;
      margin-top: 20px;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    }
  }
}
</style>