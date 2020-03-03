<template>
  <div class="wrap">
    <div id="id" ref="chart"></div>
  </div>
</template>

<script>
  export default {
    name: "echart-line",
    props: {
      MetricName: String,
      id: String,
      time: [Array, String, Number],
      opData: Array,
      scale: Number,
      xdata: Boolean,
      period: String
    },
    mounted() {
      this.init();
    },
    watch: {
      time: {
        handler() {
          this.init();
        }
      },
      opData: {
        handler() {
          this.init();
        }
      }
    },
    methods: {
      init() {
        const period = this.period;
        const chartView = this.$refs.chart;
        const myChart = this.$echarts.init(chartView);
        myChart.setOption({
          tooltip: {
            enterable: true,
            trigger: "axis",
            axisPointer: {
              type: "cross",
              lineStyle: {
                width: 1
              },
              label: {
                backgroundColor: "#6a7985"
              }
            },

            formatter(params) {
              let relVal = `${params[0].name}<br/>`;
              relVal += `粒度：${period}</br>`;

              return relVal;
            }
          },
          toolbox: {
            feature: {
              saveAsImage: {
                show: true,
                name: this.MetricName,
                title: "導出圖片"
              }

            }
          },
          legend: {
            // data: this.title,
            y: "bottom"
          },
          grid: {
            x: 25,
            y: 45,
            x2: 5,
            y2: 20,
            borderWidth: 1
          },
          xAxis: [{
            type: "category",
            boundaryGap: false,
            data: this.time,
            axisTick: {
              // 决定是否显示坐标刻度
              alignWithLabel: true,
              show: this.xdata
            },
            axisLabel: {
              // 决定是否显示数据
              show: this.xdata
            },
            splitLine: {
              show: false
            },
            axisLine: {
              // y轴显示
              show: this.xdata
            }
          }],
          yAxis: [{
            splitLine: {
              // 网格线
              show: false
            },
            axisLine: {
              // X轴显示
              show: false
            },
            type: "value",
            splitNumber: this.scale
          }],

          series: [{
            labelLine: {
              normal: {
                show: false
              }
            },
            type: "line", // 设置图表主题
            data: this.opData,
            symbol: "none",
            itemStyle: {
              normal: {
                color: "#2072d9",
                lineStyle: {
                  color: "#2072d9"
                }
              }
            }
          }]
        });
        window.addEventListener("resize", () => {
          myChart.resize();
        });
      },
      beforrDestroy() {
        if (this.myChart) {
          this.myChart.clear();
        }
      }
    }
  };

</script>

<style lang="scss" scoped>
  i {
    float: right;
    font-size: 15px;
    margin-top: 12px;
    cursor: pointer;
  }

  #id {
    min-width: 500px;
    min-height: 120px;
    height: 100%;
  }

</style>
