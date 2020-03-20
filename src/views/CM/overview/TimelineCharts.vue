<template>
  <div class="wrap">
    <div id="id" ref="chart" v-loading="loading"></div>
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/line");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
import moment from "moment";
export default {
  name: "TimelineCharts",
  props: {
    timelineData: {
      type: [Array, Array, Array],
      default: function() {
        return [[], [], []];
      }
    },
    loading: Boolean
  },
  mounted() {
    window.onresize = () => {
      echarts.init(this.$refs.chart).resize();
    };

    let myCharts = echarts.init(this.$refs.chart);
    this.setupEcharts(myCharts, [], [], []);
  },
  watch: {
    timelineData: function(n, o) {
      let myCharts = echarts.init(this.$refs.chart);
      this.setupEcharts(
        myCharts,
        this.timelineData[0],
        this.timelineData[1],
        this.timelineData[2]
      );
    }
  },
  methods: {
    setupEcharts(myCharts, startTimes, endTimes, titles) {
      let contentData = [];
      let timeShow = "";

      let today = moment().format("YYYY-MM-DD");

      for (var ii = 0; ii < 27; ii++) {
        timeShow = `${today} ${ii > 10 ? ii : "0" + ii}:00:00`;
        contentData.push([timeShow, "", "", "", "", "", ""]);
      }

      endTimes.forEach((tempEndTime, index) => {
        // 有些是今天以前的，为了和腾讯云显示一致，改为今天
        let startTimeMoment = moment(startTimes[index]);
        startTimeMoment.set("year", moment().year());
        startTimeMoment.set("month", moment().month());
        startTimeMoment.set("date", moment().date());

        let endTime = null;
        // “-”表示至今
        if (tempEndTime === "-") {
          endTime = `${today} 23:59:59`;
        } else {
          endTime = moment(tempEndTime).format("YYYY-MM-DD HH:mm:ss");
        }

        contentData.push([
          startTimeMoment.format("YYYY-MM-DD HH:mm:ss"), // 用于显示x轴的值
          endTime, // 結束時間用於渲染bar
          index, // 位置
          titles[index], // 标题
          startTimes[index], // 实际开始时间
          endTimes[index], // 实际结束时间
          (index + 1) * 25 // 用于显示y轴的值
        ]);
      });

      myCharts.setOption({
        tooltip: {
          trigger: "item",
          formatter: val => {
            let text = "";
            text = `${val.data[3]}<br/>正在告警<br/>发生/结束时间<br/>`;
            if (val.data[4] && val.data[5]) {
              let startTime = moment(val.data[4]).format("YYYY-MM-DD HH:mm:ss");
              let endTime = "";
              if (val.data[5] === "-") {
                text += startTime + "至今";
              } else {
                endTime = moment(val.data[5]).format("YYYY-MM-DD HH:mm:ss");
                text += startTime + "/" + endTime;
              }
            }
            return text;
          },
          textStyle: {
            align: "center"
          }
        },
        grid: {
          left: "3%",
          right: "10%",
          bottom: "3%",
          top: "8%",
          containLabel: true,
          backgroundColor: "#eee",
          borderColor: "#ccc"
        },
        dataZoom: [
          {
            id: "dataZoomY",
            type: "slider",
            yAxisIndex: 0,
            filterMode: "filter",
            start: 60,
            end: 100
          }
        ],
        xAxis: {
          type: "time",
          boundaryGap: false,
          interval: 1000 * 3600, // 可设置显示间隔
          min: `${today} 0:00:00`,
          axisLabel: {
            formatter: function(value, index) {
              return moment(value).format("HH");
            }
          }
        },
        yAxis: {
          type: "value",
          show: false
        },
        series: [
          {
            type: "custom",
            label: {
              show: true,
              formatter: function(value) {
                return titles[value.data[2]];
              },
              position: "right",
              color: "#000"
            },
            renderItem: function(params, api) {
              let value0 = api.value(0);
              let value1 = api.value(1);
              let value2 = api.value(2);
              let value6 = api.value(6);

              if (
                !isNaN(value0) &&
                !isNaN(value1) &&
                !isNaN(value2) &&
                !isNaN(value6)
              ) {
                let start = api.coord([value0, value6]);
                let end = api.coord([value1, value6]);
                let height = api.size([5, 10])[1];

                let rect = {
                  x: start[0],
                  y: start[1] + height,
                  width: end[0] - start[0],
                  height: height
                };

                let coordRect = {
                  x: params.coordSys.x,
                  y: params.coordSys.y,
                  width: params.coordSys.width,
                  height: params.coordSys.height
                };

                let rectShape = echarts.graphic.clipRectByRect(rect, coordRect);

                return (
                  rectShape && {
                    type: "rect",
                    shape: rectShape,
                    style: api.style()
                  }
                );
              }
            },
            itemStyle: {
              color: "#409EFF"
            },
            encode: {
              x: [0, 1],
              y: 6
            },
            data: contentData
          }
        ]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#id {
  width: 100%;
  height: 600px;
}
</style>
