<template>
  <div>
    <el-row class="btnGroup">
      <el-button @click="add">+</el-button><br /><el-button @click="dec"
        >-</el-button
      >
    </el-row>
    <div ref="worldmap_dv" style="width: 100%;height: 480px;"></div>
  </div>
</template>

<script>
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/map/js/world.js' // 引入中国地图数据
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
    trafficOrVisits (val) {
      this.trafficOrVisitData = this.trafficOrVisits
      this.initChart()
    }

  },
  methods: {
    add () {
      this.i += 0.5
      var myChart = this.$echarts.init(this.$refs.worldmap_dv)
      myChart.setOption({ geo: { zoom: this.i } })
      myChart.setOption({ series: { zoom: this.i } })
    },
    dec () {
      if (this.i > 1) {
        this.i -= 0.5
      } else {
        return
      }
      var myChart = this.$echarts.init(this.$refs.worldmap_dv)
      myChart.setOption({ series: { zoom: this.i } })
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
          // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
          // 使用函数模板  传入的数据值 -> value: number | Array
          formatter: function (val) {
            let relVal = ''
            if (!val.data) {
              return
            }
            if (that.trafficOrVisitData === 'flux') {
              relVal += val.marker + '流量' + '<br/>' + val.data.name + ' : ' + val.data.value + '%'
            } else {
              relVal += val.marker + '访问次数' + '<br/>' + val.data.name + ' : ' + val.data.value
            }

            return relVal
          }
        },
        roamController: {// 控制地图的上下左右放大缩小 图上没有显示
          show: true,
          x: 'right',
          mapTypeControl: {
            'world': true
          }
        },
        // 视觉映射组件
        visualMap: {
          type: 'piecewise', // continuous 类型为连续型  piecewise 类型为分段型
          show: true,
          left: '2%',
          // min: 0,
          // max: this.max,
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
            zoom: 1,
            scaleLimit: { // 滚轮缩放的极限控制
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
}
</style>
