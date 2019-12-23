<template>
  <div id="myChart" style="width: 100%;height: 400px;"></div>
</template>

<script>
export default {
  name: "myChart",
  data() {
    return {};
  },
  mounted() {
    this.echart();
  },
  props: {
    color: {
      type: String,
      default: "#3E8EF7"
    },
    xAxis: {
      type: Array
    },
    series: {
      type: Array
    }
  },
  watch: {
    xAxis(val) {
      this.xAxis = val;
      this.echart();
    },
    series(val) {
      this.series = val;
      this.echart();
    }
  },
  methods: {
    echart() {
      var myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.setOption({
        color: this.color,
        xAxis: {
          type: "category",
          data: this.xAxis
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: this.series,
            type: "line",
            smooth: true
          }
        ]
      });
    }
  }
};
</script>