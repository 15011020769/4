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
      type: [Array]
    },
    loading: Boolean,
    day: String
  },
  mounted() {
    window.onresize = () => {
      echarts.init(this.$refs.chart).resize();
    };

    let myCharts = echarts.init(this.$refs.chart);
    this.setupEcharts(myCharts, [], [], []);
  },
  beforeDestroy() {
    window.onresize = null;
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
    setupEcharts(myCharts, startTimes, endTimes, otherInfo) {
      let contentData = [];
      let timeShow = "";

      let currentMoment = moment(this.day);
      let current = currentMoment.format("YYYY-MM-DD");

      for (var ii = 0; ii < 27; ii++) {
        timeShow = `${current} ${ii > 10 ? ii : "0" + ii}:00:00`;
        contentData.push([timeShow, "", "", "", ""]);
      }

      endTimes.forEach((tempEndTime, index) => {
        // 有些是今天以前的，为了和腾讯云显示一致，改为今天
        let startTimeMoment = moment(startTimes[index]);

        let endTime = null;
        const todayMoment = moment();
        if (startTimeMoment.isSame(todayMoment, "day")) {
          let endTimeMoment = null
          if (tempEndTime === "-") {
            endTimeMoment = todayMoment;
          } else {
            endTimeMoment = moment(tempEndTime);
          }
            endTimeMoment.set("year", currentMoment.year());
            endTimeMoment.set("month", currentMoment.month());
            endTimeMoment.set("date", currentMoment.date());

            endTime = endTimeMoment.format("YYYY-MM-DD HH:mm:ss");
        } else {
          if (tempEndTime === "-") {
            endTime = `${current} 23:59:59`;
          } else {
            let endTimeMoment = moment(tempEndTime);
            endTimeMoment.set("year", currentMoment.year());
            endTimeMoment.set("month", currentMoment.month());
            endTimeMoment.set("date", currentMoment.date());

            endTime = endTimeMoment.format("YYYY-MM-DD HH:mm:ss");
          }
        }

        startTimeMoment.set("year", currentMoment.year());
        startTimeMoment.set("month", currentMoment.month());
        startTimeMoment.set("date", currentMoment.date());

        contentData.push([
          startTimeMoment.format("YYYY-MM-DD HH:mm:ss"), // 用于显示x轴的值
          endTime, // 結束時間用於渲染bar
          (index + 1) * 25, // 用于显示y轴的值
          index, // 位置
          otherInfo[index]
        ]);
      });

      const that = this;

      myCharts.setOption({
        tooltip: {
          trigger: "item",
          formatter: function(value) {
            return that.getTooltips(value.data[4]);
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
            end: 100,
            showDetail: false
          }
        ],
        xAxis: {
          type: "time",
          boundaryGap: false,
          interval: 1000 * 3600, // 可设置显示间隔
          min: `${current} 0:00:00`,
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
                const info = value.data[4];
                return info.Title;
              },
              position: "right",
              color: "#000"
            },
            renderItem: function(params, api) {
              let value0 = api.value(0); // 开始时间
              let value1 = api.value(1); // 结束时间
              let value2 = api.value(2); // y轴数据源
              let value3 = api.value(3); // 数据源index

              if (
                !isNaN(value0) &&
                !isNaN(value1) &&
                !isNaN(value3) &&
                !isNaN(value2)
              ) {
                let start = api.coord([value0, value2]);
                let end = api.coord([value1, value2]);
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
              y: 2
            },
            data: contentData
          }
        ]
      });
    },
    getTooltips(info) {
      let text = "";

      if (info !== undefined) {
        // 设置标题
        const title = info.Title;
        const statusText = info.Status === 0 ? "正在告警" : "已恢復";
        const productName = info.ProductCName;

        text += `${title}<br/>${productName} ${statusText}<br/>`;

        // 开始和结束时间
        const FirstOccurTime = info.FirstOccurTime;
        const LastOccurTime = info.LastOccurTime;

        if (FirstOccurTime && LastOccurTime) {
          text += `發生/結束時間<br/>`;
          const startTime = moment(FirstOccurTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );

          const endTime =
            LastOccurTime === "-"
              ? "至今"
              : "/" + moment(LastOccurTime).format("YYYY-MM-DD HH:mm:ss");

          text += startTime + endTime;
        }
      }

      return text;
    }
  }
};
</script>

<style lang="scss" scoped>
#id {
  width: 100%;
  height: 500px;
}
</style>
