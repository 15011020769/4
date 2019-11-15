<!--  -->
<template>
  <div class="tabTwo">
    <div class="tab">
      <el-tabs v-model="activeName">
        <el-tab-pane label="单地域监控" name="first">
          <div class="check">
            <span class="">地域</span>
            <el-checkbox v-model="checked">港澳台地区(中国台北)</el-checkbox>
          </div>

          <div class="minitor" >
            <div class="time">
              <el-button-group>
                <el-button @click="thisTime(1)">实时</el-button>
                <el-button @click="thisTime(2)">近24小时</el-button>
                <el-button @click="thisTime(3)">近七天</el-button>
              </el-button-group>
              <el-date-picker
                class="newDataTime"
                v-model="value2"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              ></el-date-picker>
              <span>
                粒度：
                <el-select class="selectTime" v-model="value" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in selectTime"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </span>
              <span class="span-1">港澳台地区(中国台北)</span>
            </div>
            <div class="box-dis p-style">
              <p>
                <i class="el-icon-info"></i
                >注释：Max、Min和Avg数值统计为当前折线图内所有点的最大值、最小值和平均值
              </p>
              <p>
                <el-button type="text">导出数据</el-button>
              </p>
            </div>
            <div class="box-table">
              <!-- 表格 -->
              <el-table :data="tableData" style="width: 100%">
                <el-table-column prop>
                  <template slot-scope="scope">
                    <span style="font-size:12px;font-weight:bolder;">
                      外网出带宽
                      <el-popover placement="bottom-start" title width="200" trigger="hover">
                        <p>外网出带宽</p>
                        <i class="el-icon-warning" slot="reference"></i>
                      </el-popover>
                    </span>
                  </template>
                </el-table-column>

                <el-table-column prop="dataPoints" width="600">
                  <template slot-scope="scope">
                    <p v-if="scope.row.dataPoints[0] === null">暂无数据</p>
                    <div class="echart" v-if="scope.row.dataPoints[0] !== null">
                      <echart-line
                        id="diskEchearrts-line"
                        :time="timeData"
                        :opData="scope.row.dataPoints"
                        :unit="diskUnit"
                        :title="diskTitle"
                        :period="period"
                        :scale="3"
                        :xdata="false"
                      ></echart-line>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column prop>
                  <template slot-scope="scope">
                    <p>Max:</p>
                    <p>--</p>
                  </template>
                </el-table-column>

                <el-table-column prop>
                  <template slot-scope="scope">
                    <p>Min:</p>
                    <p>--</p>
                  </template>
                </el-table-column>

                <el-table-column prop>
                  <template slot-scope="scope">
                    <p>Avg:</p>
                    <p>--</p>
                  </template>
                </el-table-column>

                <el-table-column prop>
                  <template slot-scope="scope">
                    <p>
                      <i class="el-icon-menu i-font" style="font-size:26px;"></i>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="地域间监控" name="second">
          <div class="selects">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select v-model="value2" placeholder="请选择">
              <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="minitor" v-show="minitorShow">
            <div class="time">
              <el-button-group>
                <el-button @click="thisTime(1)">实时</el-button>
                <el-button @click="thisTime(2)">近24小时</el-button>
                <el-button @click="thisTime(3)">近七天</el-button>
              </el-button-group>
              <el-date-picker
                class="newDataTime"
                v-model="value2"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              ></el-date-picker>
              <span>
                粒度：
                <el-select class="selectTime" v-model="value" placeholder="请选择" filterable>
                  <el-option
                    v-for="item in selectTime"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </span>
              <span class="span-1">港澳台地区(中国台北)</span>
            </div>
            <div class="box-dis p-style">
              <p>
                <i class="el-icon-info"></i
                >注释：Max、Min和Avg数值统计为当前折线图内所有点的最大值、最小值和平均值
              </p>
              <p>
                <el-button type="text">导出数据</el-button>
              </p>
            </div>
            <div class="box-table">
              <!-- 表格 -->
              <el-table :data="tableData" style="width: 100%">
                <el-table-column prop>
                  <template slot-scope="scope">
                    <span style="font-size:12px;font-weight:bolder;">
                      外网出带宽
                      <el-popover placement="bottom-start" title width="200" trigger="hover">
                        <p>外网出带宽</p>
                        <i class="el-icon-warning" slot="reference"></i>
                      </el-popover>
                    </span>
                  </template>
                </el-table-column>

                <el-table-column prop="dataPoints" width="600">
                  <template slot-scope="scope">
                    <p v-if="scope.row.dataPoints[0] === null">暂无数据</p>
                    <div class="echart" v-if="scope.row.dataPoints[0] !== null">
                      <echart-line
                        id="diskEchearrts-line"
                        :time="timeData"
                        :opData="scope.row.dataPoints"
                        :unit="diskUnit"
                        :title="diskTitle"
                        :period="period"
                        :scale="3"
                        :xdata="false"
                      ></echart-line>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column prop>
                  <template slot-scope="scope">
                    <p>Max:</p>
                    <p>--</p>
                  </template>
                </el-table-column>

                <el-table-column prop>
                  <template slot-scope="scope">
                    <p>Min:</p>
                    <p>--</p>
                  </template>
                </el-table-column>

                <el-table-column prop>
                  <template slot-scope="scope">
                    <p>Avg:</p>
                    <p>--</p>
                  </template>
                </el-table-column>

                <el-table-column prop>
                  <template slot-scope="scope">
                    <p>
                      <i class="el-icon-menu i-font" style="font-size:26px;"></i>
                    </p>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import echartLine from '@/components/echars-line'
export default {
  data () {
    return {
      activeName: 'first',
      checked: true,
      options: [
        {
          value: '选项1',
          label: '请选择'
        },
        {
          value: '选项2',
          label: '华南地区(广州)'
        },
        {
          value: '选项3',
          label: '华南地区(广州)-黑石'
        }
      ],
      value: '',
      minitorShow: false, // 监控的显示与隐藏
      options2: [
        {
          value: '选项1',
          label: '请选择'
        },
        {
          value: '选项2',
          label: '华南地区(广州)'
        },
        {
          value: '选项3',
          label: '华南地区(广州)-黑石'
        }
      ],
      value2: '',
      selectTime: [
        {
          value: 'time1',
          label: '一分钟'
        },
        {
          value: 'time2',
          label: '五分钟'
        },
        {
          value: 'time3',
          label: '一小时'
        },
        {
          value: 'time4',
          label: '一天'
        }
      ],
      tableData: [], // 获取列表数据
      timeData: [] // 折线图的x轴数据
    }
  },
  components: {
    echartLine
  },
  watch: {
    // "form.instanceType": function (value) {
    //   // console.log(value)
    //   this.getInstanceIds(value)
    // },
  },
  created () {
    console.log(this.$route.query)
    this.ccnId = this.$route.query.ccnId
    this.getData()
  },
  methods: {
    // 初始化数据
    getData: function (){
      var params = {
        Version: "2018-07-24",
        Region: "ap-taipei",
        Namespace: 'QCE/VBC',
        MetricName: 'RegionOutPkg',
        'Instances.0.Dimensions.0.Name': 'CcnId',
        'Instances.0.Dimensions.0.Value': this.ccnId,
        // Period: 300,
        // StartTime: '',
        // EndTime: ''
      }
      var params2 = {
        Version: "2018-07-24",
        Region: "ap-taipei",
        Namespace: 'QCE/VBC',
        MetricName: 'RegionInPkg',
        'Instances.0.Dimensions.0.Name': 'CcnId',
        'Instances.0.Dimensions.0.Value': this.ccnId,
        // Period: 300,
        // StartTime: '',
        // EndTime: ''
      }
      var params3 = {
        Version: "2018-07-24",
        Region: "ap-taipei",
        Namespace: 'QCE/VBC',
        MetricName: 'RegionOutBandwidth',
        'Instances.0.Dimensions.0.Name': 'CcnId',
        'Instances.0.Dimensions.0.Value': this.ccnId,
        // Period: 300,
        // StartTime: '',
        // EndTime: ''
      }
      var params4 = {
        Version: "2018-07-24",
        Region: "ap-taipei",
        Namespace: 'QCE/VBC',
        MetricName: 'RegionInBandwidth',
        'Instances.0.Dimensions.0.Name': 'CcnId',
        'Instances.0.Dimensions.0.Value': this.ccnId,
        // Period: 300,
        // StartTime: '',
        // EndTime: ''
      }
      // 查询-单地域总出包量
      this.$axios.post("monitor2/GetMonitorData", params).then(res => {
        console.log(res);
      })
      // 查询-单地域总入包量
      this.$axios.post("monitor2/GetMonitorData", params2).then(res => {
        console.log(res);
      })
      // 查询-单地域总出带宽
      this.$axios.post("monitor2/GetMonitorData", params3).then(res => {
        console.log(res);
      })
      // 查询-单地域总入带宽
      this.$axios.post("monitor2/GetMonitorData", params4).then(res => {
        console.log(res);
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.tabTwo {
  background: #fff;
  min-height: 450px;
  .tab {
    padding-left: 20px;
    padding-top: 20px;
    .el-select {
      margin-right: 10px;
    }
    .check {
      span {
        margin-right: 20px;
      }
    }
  }
  .minitor {
    .time {
      margin-top: 10px;
      .el-button-group {
        margin-bottom: 7px;
      }
      .el-button {
        height: 35px;
      }
      .el-date-editor {
        height: 35px;
        margin: 0 10px;
      }
      .span-1 {
        font-weight: bold;
      }
    }
    .box-dis {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      .btn-style {
        margin-left: 20px;
        display: flex;
        line-height: 32px;
        .drop {
          margin-left: 30px;
          span {
            color: #cccccc;
            font-size: 10px;
          }
          .el-input {
            width: 100px !important;
            border: none;
          }
        }
      }
      p:nth-child(1) {
        color: #ccc;
        font-size: 14px;
      }
      p:nth-child(2) {
        margin-right: 20px;
      }
    }
    .btn-sty {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
