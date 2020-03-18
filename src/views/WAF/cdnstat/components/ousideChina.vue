<template>
  <div>
    <div ref="worldmap_dv" style="width: 100%;height: 600px;"></div>
  </div>
</template>

<script>
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/geo'
import 'echarts/lib/component/visualMap'
import 'echarts/map/js/world.js' // 引入世界地图数据
import nameComparison from './nameComparison '
export default {
  name: "myChart",
  props: {
    series: {
      type: Array,
    },
    pieces: {
      type: Array,
      default: () => {}
    },
    tooltip: {
      type: Object
    },
    inverse: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.initChart();
  },
  watch: {
    series(val) {
      this.series = val
      this.initChart()
    },
    pieces(val) {
      this.pieces = val
      this.initChart()
    },
    tooltip(val) {
      this.tooltip = val
      this.initChart()
    },
    inverse(val) {
      this.inverse = val
      this.initChart()
    }
  },
  methods: {
    initChart() {
      let that = this
      this.chart = this.$echarts.init(this.$refs.worldmap_dv);
      window.onresize = this.$echarts.init(this.$refs.worldmap_dv).resize;
      // 把配置和数据放这里
      this.chart.setOption({
         grid: {
          left: '0%',
          right: '0%',
          bottom: '0%',
          top: '0%',
          containLabel: true
        },
        // 提示框组件
        tooltip: this.tooltip,
        geo: {
          roam: true,
          zoom: 1,
        },
        // 视觉映射组件
        visualMap: {
          type: 'piecewise', // continuous 类型为连续型  piecewise 类型为分段型
          show: true,
          left: "2%",
          pieces: this.pieces,
          // pieces: [
          //   {lte: 1, label: '好(<1s)',color: '#319a18'},
          //   {gt: 1, lte: 2, label: '较好(1-5s)',color: '#51af32'},
          //   {gt: 2, lte: 3, label: '告警(2-3s)',color: '#ffb800'},
          //   {gt: 3, lte: 5, label: '较差(3-5s)',color: '#e1504a'},
          //   {gt: 5, label: '差(>5s)',color: '#e32310'},
          // ],
          inverse: this.inverse, 
          // 文本样式
          textStyle: {
            fontSize: 14,
            color: '#000'
          },
          realtime: false, // 拖拽时，是否实时更新
          calculable: true, // 是否显示拖拽用的手柄
        },
        series: [
          {
            type: 'map', // 类型
            name: '',
            mapType: 'world', // 地图类型
            roam: false,
            zoom: 1.2,
            label: {
              show: false // 是否显示对应地名
            },
            // 地图区域的多边形 图形样式
            itemStyle: {
              borderWidth: 0.5,
              borderColor: '#000',
              borderType: 'solid', // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted',
              areaColor: '#F8F8F8'
            },
            // 高亮状态下的多边形和标签样式
            emphasis: {
              label: {
                show: true, // 是否显示标签
                fontWeight: 'bold',
                color: '#000',
                fill: 'rgb(255, 255, 255)',
                textShadow: '0px 0px 6px #000',
                textRendering: 'geometricprecision',
              },
              itemStyle: {
                areaColor: '#e2ecf4'
              }
            },
            // 自定义地区的名称映射
            nameMap: nameComparison,
            // 地图系列中的数据内容数组 数组项可以为单个数值
            data: this.series,
          }
        ]
      });
    }
  }
};

</script>
<style lang="scss" scoped>
  .btnGroup {
    position: absolute;
    z-index: 10;
    .el-button {
      padding:12px;
    }
  }
</style>
