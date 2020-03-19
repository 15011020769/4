<template>
  <div>
    <el-row class="btnGroup">
      <el-button @click="add"
        ><span style="width: 10px; display: inline-block">+</span></el-button
      >
      <br /><el-button @click="dec"
        ><span style="width: 10px; display: inline-block">-</span></el-button
      >
    </el-row>
    <div ref="worldmap_dv" style="width: 100%;height: 480px;"></div>
  </div>
</template>

<script>
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/geo'
import roamController from 'echarts/lib/component/helper/RoamController'
import 'echarts/lib/component/visualMap'
import 'echarts/map/js/world.js' // 引入世界地图数据
import nameComparison from './nameComparison '
import type from '@/views/CM/CM_assembly/product_type'
export default {
  name: 'myChart',
  props: {
    total: {
      type: Number,
      default: 1
    },
    series: {
      type: Array
    },
    trafficOrVisits: {
      type: String,
      default: 'flux'
    }
  },
  data () {
    return {
      chart: null,
      i: 1,
      trafficOrVisitData: this.trafficOrVisits
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
    total (val) {
      this.total = val
      this.initChart()
    },
    i (val) {
      this.i = val
      this.initChart()
      // var myChart = this.$echarts.init(this.$refs.worldmap_dv);
      // myChart.on('georoam', function (params) {
      //   var option = myChart.getOption();
      //   console.log(option.series[0].zoom)
      //   this.i = option.series[0].zoom
      //   console.log(params);
      //   params.zoom += 0.1
      // });
    }
  },
  methods: {
    add () {
      this.chart.dispatchAction({
        type: 'geoRoam',
        zoom: 1.3,
        originX: this.chart.getWidth() / 2,
        originY: this.chart.getHeight() / 2
      })
    },
    dec () {
      this.chart.dispatchAction({
        type: 'geoRoam',
        zoom: 0.7,
        originX: this.chart.getWidth() / 2,
        originY: this.chart.getHeight() / 2
      })
    },
    initChart () {
      let that = this
      this.chart = this.$echarts.init(this.$refs.worldmap_dv)
      window.onresize = this.$echarts.init(this.$refs.worldmap_dv).resize
      // 把配置和数据放这里
      this.chart.setOption({
        // 提示框组件
        tooltip: {
          trigger: 'item', // 触发类型, 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
          formatter: function (val) {
            let relVal = ''
            if (!val.data) {
              return
            }
            if (that.trafficOrVisitData === 'flux') {
              relVal +=
                val.marker +
                '流量' +
                '<br/>' +
                val.data.name +
                ' : ' +
                val.data.value +
                '%'
            } else {
              relVal +=
                val.marker +
                '访问次数' +
                '<br/>' +
                val.data.name +
                ' : ' +
                val.data.value
            }

            return relVal
          }
        },
        roamController: {
          // 控制地图的上下左右放大缩小
          show: true,
          x: 'right',
          width: 120,
          height: 200,
          backgroundColor: 'rgba(0,0,0,0.1)',
          fillerColor: 'red',
          mapTypeControl: {
            world: true
          }
        },
        geo: {
          roam: true,
          zoom: 1
        },
        // 视觉映射组件
        visualMap: {
          type: 'piecewise', // continuous 类型为连续型  piecewise 类型为分段型
          show: true,
          left: '2%',
          pieces: [
            { lte: 1, label: '<1%', color: '#cfe4ff' },
            { gt: 1, lte: 5, label: '1%-5%', color: '#a7cdff' },
            { gt: 5, lte: 10, label: '5%-10%', color: '#76b1ff' },
            { gt: 10, lte: 15, label: '10%-15%', color: '#3d91fe' },
            { gt: 15, label: '>15%', color: '#016eff' }
          ],
          inverse: true,
          // 文本样式
          textStyle: {
            fontSize: 14,
            color: '#000'
          },
          realtime: false, // 拖拽时，是否实时更新
          calculable: true // 是否显示拖拽用的手柄
        },
        series: [
          {
            type: 'map', // 类型
            name: '',
            mapType: 'world', // 地图类型
            roam: true,
            zoom: this.i,
            scaleLimit: {
              // 滚轮缩放的极限控制
              min: 1
            },
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
                show: false, // 是否显示标签
                color: '#94002d' // 文字的颜色 如果设置为 'auto'，则为视觉映射得到的颜色，如系列色
              },
              itemStyle: {
                areaColor: '#e2ecf4'
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
<style lang="scss" scoped>
.btnGroup {
  position: absolute;
  z-index: 10;
  .el-button {
    padding: 12px;
  }
}
</style>
