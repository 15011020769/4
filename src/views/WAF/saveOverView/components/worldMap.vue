<template>
  <div ref="worldmap_dv" style="width: 100%;height: 600px;"></div>
</template>

<script>
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/map/js/world.js' // 引入中国地图数据
import nameComparison from './nameComparison '
export default {
  name: "myChart",
  props: {
    series: {
      type: Array,
    },
    pieces: {
      type: Array
    }
  },
  data() {
    return {
      chart: null
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
    }
  },
  methods: {
    initChart() {
      this.chart = this.$echarts.init(this.$refs.worldmap_dv);
      window.onresize = this.$echarts.init(this.$refs.worldmap_dv).resize;
      // 把配置和数据放这里
      this.chart.setOption({
        // 提示框组件
        tooltip: {
          trigger: 'item',
          formatter: function (val) {
            if (!val.data) {
              // return val.name + ': ' + 0
              return 0
            }
            // return val.data.name + ': ' + val.data.value
            return val.data.value
          }
        },
        // 视觉映射组件
        visualMap: {
          type: 'piecewise', // continuous 类型为连续型  piecewise 类型为分段型
          show: true, 
          left: "2%",
          pieces: this.pieces,
          inverse: true,
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
            // 系列名称，用于tooltip的显示，legend 的图例筛选 在 setOption 更新数据和配置项时用于指定对应的系列
            name: '',
            mapType: 'world', // 地图类型
            // 是否开启鼠标缩放和平移漫游 默认不开启 如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move' 设置成 true 为都开启
            roam: true,
            // 图形上的文本标签
            label: {
              show: false // 是否显示对应地名
            },
            // 地图区域的多边形 图形样式
            itemStyle: {
              borderWidth: 0.5, // 描边线宽 为 0 时无描边
              borderColor: '#000', // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
              borderType: 'solid' // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
            },
            // 高亮状态下的多边形和标签样式
            emphasis: {
              label: {
                show: true, // 是否显示标签
                color: '#94002d' // 文字的颜色 如果设置为 'auto'，则为视觉映射得到的颜色，如系列色
              },
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