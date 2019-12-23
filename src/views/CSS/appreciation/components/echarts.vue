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
      type: Array,
      default: []
    },
    series: {
      type: Array,
      default: []
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
    doHandleMonth(month) {
      var m = month;
      if (month.toString().length == 1) {
        m = "0" + month;
      }
      return m;
    },
    getDay(day) {
      var today = new Date();
      var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
      today.setTime(targetday_milliseconds); //注意，这行是关键代码
      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();
      tMonth = this.doHandleMonth(tMonth + 1);
      tDate = this.doHandleMonth(tDate);
      return tYear + "-" + tMonth + "-" + tDate;
    },
    echart() {
      var myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.setOption({
        color: this.color,
        xAxis: {
          type: "category",
          data:
            this.xAxis.length != 0
              ? this.xAxis
              : [
                  this.getDay(4),
                  this.getDay(3),
                  this.getDay(2),
                  this.getDay(1),
                  this.getDay(0)
                ]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: this.series.length != 0 ? this.series : [0, 0, 0, 0, 0],
            type: "line",
            smooth: true
          }
        ]
      });
    }
  }
};
</script>