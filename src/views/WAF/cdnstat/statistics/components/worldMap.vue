<template>
  <div ref="worldmap_dv" style="width: 100%;height: 480px;"></div>
</template>

<script>
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/map/js/world.js' // 引入中国地图数据
import nameComparison from './nameComparison '
export default {
  name: 'myChart',
  props: {
    max: {
      type: Number,
      default: 50000
    },
    series: {
      type: Array
    }
  },
  data () {
    return {
      chart: null
    }
  },
  mounted () {
    this.initChart()
    // this.chinaConfigure();
    // console.log(this.series)
  },
  watch: {
    series (val) {
      this.series = val
      this.initChart()
    },
    max (val) {
      this.max = val
      this.initChart()
    }
  },
  methods: {
    initChart () {
      this.chart = this.$echarts.init(this.$refs.worldmap_dv)
      window.onresize = this.$echarts.init(this.$refs.worldmap_dv).resize
      // 把配置和数据放这里
      this.chart.setOption({
        // 提示框组件
        tooltip: {
          trigger: 'item', // 触发类型, 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
          // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
          // 使用函数模板  传入的数据值 -> value: number | Array
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
          type: 'continuous', // continuous 类型为连续型  piecewise 类型为分段型
          show: true, // 是否显示 visualMap-continuous 组件 如果设置为 false，不会显示，但是数据映射的功能还存在
          // 指定 visualMapContinuous 组件的允许的最小/大值。'min'/'max' 必须用户指定。
          // [visualMap.min, visualMax.max] 形成了视觉映射的『定义域』
          left: '2%',
          min: 0,
          max: this.max,
          // pieces: [                           //自定义『分段式视觉映射组件（visualMapPiecewise）』的每一段的范围，以及每一段的文字，以及每一段的特别的样式
          //   {min: 1500},                     // 不指定 max，表示 max 为无限大（Infinity）。
          //   {min: 900, max: 1500},
          //   {min: 310, max: 1000},
          //   {min: 200, max: 300},
          //   {min: 10, max: 200, label: '10 到 200（自定义label）'},
          //   {value: 123, label: '123（自定义特殊颜色）', color: 'grey'}, // 表示 value 等于 123 的情况。
          //   {max: 5}
          //   ],                     // 不指定 min，表示 min 为无限大（-Infinity）。
          // 文本样式
          textStyle: {
            fontSize: 14,
            color: '#000'
          },
          realtime: false, // 拖拽时，是否实时更新
          calculable: true, // 是否显示拖拽用的手柄
          // 定义 在选中范围中 的视觉元素
          inRange: {
            color: ['#9fb5ea', '#006eff']
          }
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
              }
            },
            // 自定义地区的名称映射
            nameMap: nameComparison,
            // 地图系列中的数据内容数组 数组项可以为单个数值
            data: this.series
          }
        ]
      })
    }
  }
}

</script>
