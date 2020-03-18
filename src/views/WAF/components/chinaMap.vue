<template>
  <div>
    <p class="title">
      {{topTitle.name}}
      <span v-if="topTitle.name">BOT {{t('数目', 'WAF.number')}}</span>
      {{topTitle.value}}
    </p>
    <div ref="chinamap_dv" style="width: 100%;height: 580px;"></div>
  </div>
</template>

<script>
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
import 'echarts/map/js/china.js' // 引入中国地图数据
import nameComparison from './nameComparison '
export default {
  name: "myChart",
  props: {
    series: {
      type: Array,
    }
  },
  data() {
    return {
      chart: null,
      topTitle: {}
    };
  },
  mounted() {
    this.initChart();
  },
  watch: {
    series(val) {
      this.series = val
      this.initChart()
    }
  },
  methods: {
    initChart() {
      this.chart = this.$echarts.init(this.$refs.chinamap_dv);
      window.onresize = this.$echarts.init(this.$refs.chinamap_dv).resize;
      let that = this
      // 把配置和数据放这里
      this.chart.setOption({
        // 提示框组件
        tooltip: {
          trigger: 'item',
          formatter: function (val) {
            if (!val.data) {
              that.topTitle = {name: val.name, value: 0}
              return 0
            }
            that.topTitle = {name: val.name, value: val.value}
            // return val.data.name + ': ' + val.data.value
            return val.data.value
          }
        },
        // 视觉映射组件
        visualMap: {
          type: 'piecewise', // continuous 类型为连续型  piecewise 类型为分段型
          show: true, 
          left: "2%",
          pieces: [
            {gt: 1, lte: 20, label: '1~20',color: '#cfe4ff'},
            {gt: 21, lte: 40, label: '21~40',color: '#a7cdff'},
            {gt: 41, lte: 60, label: '41~60',color: '#76b1ff'},
            {gt: 61, lte: 80, label: '61~80',color: '#3d91fe'},
            {gt: 81, lte: 100, label: '81~100',color: '#016eff'},
          ],
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
            mapType: 'china', // 地图类型
            roam: false,
            // 图形上的文本标签
            label: {
              normal: {
                show: true, //显示省份标签
                textStyle: {
                    // color: "blue"
                    fontSize: 14,
                } //省份标签字体颜色
              },
              emphasis: { //对应的鼠标悬浮效果
                show: false,
                textStyle: {
                    color: "#800080"
                }
              }
            },
            aspectScale: 0.75,
            zoom: 1.2,//当前视角的缩放比例
            // 地图区域的多边形 图形样式
            itemStyle: {
              borderWidth: 0.5, // 描边线宽 为 0 时无描边
              borderColor: '#000', // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
              borderType: 'solid', // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
              areaColor: "#fff",
              color :'red'
            },
            // 高亮状态下的多边形和标签样式
            emphasis: {
              label: {
                show: true, // 是否显示标签
                color: '#94002d'
              },
            },
            // 自定义地区的名称映射
            nameMap: nameComparison,
            // 地图系列中的数据内容数组 数组项可以为单个数值
            data: that.series,
          }
        ]
      });
    }
  }
};

</script>
<style lang='scss' scoped>
  .title {
    padding: 10px 0 0 20px;
  }
</style>