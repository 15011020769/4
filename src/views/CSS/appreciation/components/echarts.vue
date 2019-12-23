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
  methods: {
    echart() {
      var myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.setOption({
        color: ["#3E8EF7"],
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            smooth: true
          }
        ]
      });
    },
    //导出图片
    exportImg() {
      var myChart = this.$echarts.init(document.getElementById("id"));

      var i = myChart.getDataURL({
        type: "png",
        backgroundColor: "white"
        // 导出的图片分辨率比例，默认为 1。
        //pixelRatio: number,
      });
      var $a = document.createElement("a");
      $a.setAttribute("href", i);
      $a.setAttribute("download", "image.png");
      $a.click();
    }
  }
};
</script>