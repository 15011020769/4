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
      period: String,
      Company: String
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
        if (this.Company != undefined) {
          var Company = this.Company
        } else {
          Company = ''
        }

        const TimeGranularity = {
          '5': '5秒',
          '10': '10秒',
          '60': '1分鐘',
          '300': '5分鐘',
          '3600': '1小時',
          '86400': '1天',
        }
        const period = this.period;
        const chartView = this.$refs.chart;
        const myChart = this.$echarts.init(chartView);
        myChart.setOption({

          tooltip: {
            enterable: true,
            trigger: "axis",
            position: function (point, params, dom, rect, size) {
              // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
              // 提示框位置
              var x = 0; // x坐标位置
              var y = 0; // y坐标位置

              // 当前鼠标位置
              var pointX = point[0];
              var pointY = point[1];

              // 外层div大小
              // var viewWidth = size.viewSize[0];
              // var viewHeight = size.viewSize[1];

              // 提示框大小
              var boxWidth = size.contentSize[0];
              var boxHeight = size.contentSize[1];

              // boxWidth > pointX 说明鼠标左边放不下提示框
              if (boxWidth > pointX) {
                x = 5;
              } else { // 左边放的下
                x = pointX - boxWidth;
              }

              // boxHeight > pointY 说明鼠标上边放不下提示框
              if (boxHeight > pointY) {
                y = 5;
              } else { // 上边放得下
                y = pointY - boxHeight;
              }

              return [x, y];
            },

            axisPointer: {
              type: "line",
              lineStyle: {
                width: 1
              },
              label: {
                backgroundColor: "#6a7985"
              }
            },

            formatter(params) {
              if (params[0].data === null) {
                params[0].data = ''
              }
              let relVal = `${params[0].name}<br/>
           ${params[0].data}${Company}<br />`;
              relVal += `粒度：${TimeGranularity[period]}</br>`;
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
            x: 60,
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
