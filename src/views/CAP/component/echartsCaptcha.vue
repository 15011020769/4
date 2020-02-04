<template>
  <div :id="id" :style="{width: '100%', height: '400px'}"></div>
</template>

<script>
export default {
  name: "echarts",
  data() {
    return {
      xAxle:this.xAxis,
      data2:this.data,
      series2:this.series,
    };
  },
  mounted() {  
    this.drawLine();
  },
  props: {
    id:{
      type: String,
      required: true,
    },
    color: {
      type: Array,
      default: () => ["#449bf0", "#8bd35b", "#68d8f8", "#ef3a62"]
    },
    data: {
      type: Array
    },
    xAxis: {
      type: Array
    },
    series: {
      type: Array
    }
  },
  created(){
    // console.log(this.xAxis)
  },
  watch:{
    xAxis:{
      handler(val){
        this.xAxle=val;
        this.drawLine()
      },
      deep:true
    },
    data:{
      handler(val){
        this.data2=val;
        this.drawLine()
      },
      deep:true
    },
    series:{
      handler(val){
        this.series2=val;
        this.drawLine()
      },
      deep:true
    },
  },
  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById(this.id));
      // 绘制图表
      myChart.setOption({
        color: this.color,
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: this.data
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xAxle
          // data: this.xAxis
        },
        yAxis: {
          type: "value"
        },
        series: this.series2
      });
    }
  }
};
</script>