<template>
  <div>
    <div class="TimeDropDown">
      <el-row>
        <el-button-group>
          <el-button v-for="(item,index) in TimeArr" :key="index" :type="item.Time == TimeValue ? 'primary' : ''"
            size="small" @click="TimeChoice(item)">
            {{item.name}}
          </el-button>
          <el-popover placement="bottom" width="400" trigger="manual" v-model="visible" v-if="Datecontrol">
            <p class="p-dis">
              <span>從</span>
              <el-date-picker class="width-date" v-model="timevalueStart" type="date" placeholder="選擇日期"
                :picker-options="picker">
              </el-date-picker>
              <el-time-picker class="width-date" v-model="timevalueStart" placeholder="任意時間點">
              </el-time-picker>
            </p>
            <p class="p-dis">
              <span>至</span>
              <el-date-picker class="width-date" v-model="timevalueEnd" type="date" placeholder="選擇日期"
                :picker-options="picker">
              </el-date-picker>
              <el-time-picker class="width-date" v-model="timevalueEnd" placeholder="任意時間點">
              </el-time-picker>
            </p>
            <el-row class="margin-row">
              <el-button size="mini" type="primary" @click="Sure">確定</el-button>
              <el-button size="mini" @click="visible = false">取消</el-button>
            </el-row>
            <el-button size="small" v-if="datetim" icon="el-icon-search" @click="SelectionTime" slot="reference">選擇日期
            </el-button>
            <el-button size="small" v-if="datetime" @click="SelectionTime" slot="reference">
              {{timevalueStart}}至{{timevalueEnd}}<i class="el-icon-date el-icon--right"></i>
            </el-button>
          </el-popover>
        </el-button-group>
      </el-row>
      <div class="drop" v-if="Graincontrol">
        <span style="margin-right:15px">時間粒度:</span>
        <el-select v-model="grainValue" size="small" @change="SwitchGrain">
          <el-option v-for="item in TimeGranularity" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>
<script>
  import moment from "moment"
  export default {
    props: {
      TimeArr: {
        required: true,
        type: Array
      },
      Datecontrol: {
        required: true,
        type: Boolean
      },
      Graincontrol: {
        required: true,
        type: Boolean
      }
    },
    data() {
      return {
        TimeValue: '',
        grainValue: '',
        TimeGranularity: [],
        timevalueStart: null,
        timevalueEnd: null,
        datetimeval: [], // 选择时间数据
        visible: false, // 时间选择器的变化
        datetim: true, // 时间选择器的变化
        datetime: false, // 时间选择器的变化
        Start_End: {
          StartTIme: "",
          EndTIme: ""
        },
        picker: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },

      }
    },
    created() {
      this.initial()
    },
    methods: {
      //初始化数据
      initial() {
        this.TimeValue = this.TimeArr[0].Time
        this.TimeGranularity = this.TimeArr[0].TimeGranularity
        this.grainValue = this.TimeArr[0].TimeGranularity[0].value
        if (this.TimeValue)[
          this.AcquisitionTime()
        ]
      },
      //点击时间按钮
      TimeChoice(item) {
        this.datetime = false;
        this.datetim = true;
        this.TimeValue = item.Time
        this.TimeGranularity = item.TimeGranularity
        this.grainValue = item.TimeGranularity[0].value
        this.AcquisitionTime()
      },
      //切换粒度
      SwitchGrain() {
        this.$emit("switchData", [this.grainValue, this.Start_End]);
      },
      //根据字段获取响应时间
      AcquisitionTime() {
        const CurrentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"); //获取当前时间
        const TimeStamp = new Date(CurrentTime).getTime(); //当前时间戳
        if (this.TimeValue === 'realTime') {
          const StartTimeStamp = TimeStamp - 3600000 //1小时前时间戳
          const BeforeTime = moment(StartTimeStamp).format(
            "YYYY-MM-DD HH:mm:ss"
          ); //获取1小时前的时间
          this.Start_End.StartTIme = BeforeTime;
          this.Start_End.EndTIme = CurrentTime;
        } else if (this.TimeValue === 'Nearly_24_hours') {
          const StartTimeStamp = TimeStamp - 86400000 //24小时前时间戳
          const BeforeTime = moment(StartTimeStamp).format(
            "YYYY-MM-DD HH:mm:ss"
          ); //获取1小时前的时间
          this.Start_End.StartTIme = BeforeTime;
          this.Start_End.EndTIme = CurrentTime;
        } else if (this.TimeValue === 'Nearly_7_days') {
          const StartTimeStamp = TimeStamp - 604800000 //24小时前时间戳
          const BeforeTime = moment(StartTimeStamp).format(
            "YYYY-MM-DD HH:mm:ss"
          ); //获取1小时前的时间
          this.Start_End.StartTIme = BeforeTime;
          this.Start_End.EndTIme = CurrentTime;
        }
        this.$emit("switchData", [this.grainValue, this.Start_End]);
      },
      // 确定按钮
      Sure() {
        this.TimeValue = '' //按钮样式去掉
        this.timevalueStart = moment(this.timevalueStart).format("YYYY-MM-DD HH:mm:ss")
        this.timevalueEnd = moment(this.timevalueEnd).format("YYYY-MM-DD HH:mm:ss")
        const startTime = new Date(this.timevalueStart).getTime() / 1000;
        const endTime = new Date(this.timevalueEnd).getTime() / 1000;
        let Basis = ''
        if (endTime - startTime <= 3600) {
          Basis = 'realTime'
        } else if (endTime -
          startTime <= 3600 * 24) {
          Basis = 'Nearly_24_hours'
        } else if (endTime -
          startTime <= 3600 * 24 * 7) {
          Basis = 'Nearly_7_days'
        }
        this.TimeArr.forEach(item => {
          if (item.Time === Basis) {
            this.TimeGranularity = item.TimeGranularity
          }
        });
        this.grainValue = this.TimeGranularity[0].value
        this.visible = false;
        this.datetime = true;
        this.datetim = false;
        this.Start_End.StartTIme = this.timevalueStart;
        this.Start_End.EndTIme = this.timevalueEnd;
        this.$emit("switchData", [this.grainValue, this.Start_End]);
      },
      // 选择时间
      SelectionTime() {
        this.datetime = false;
        this.datetim = true;
        if (this.timevalueStart === null) {
          const CurrentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"); //获取当前时间
          const TimeStamp = new Date(CurrentTime).getTime(); //当前时间戳
          const StartTimeStamp = TimeStamp - 3600000 //1小时前时间戳
          this.timevalueStart = moment(new Date(StartTimeStamp)).format("YYYY-MM-DD HH:mm:ss")
          this.timevalueEnd = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        }
        this.visible = true;
      },

    },
  }

</script>
<style lang="scss" scoped>
  .TimeDropDown {
    display: flex;
  }

  .p-dis {
    display: flex;

    span {
      line-height: 40px;
    }

    .width-date {
      width: 150px;
      margin-left: 20px;
    }
  }

  .margin-row {
    margin-top: 30px;
    margin-left: 55%;
  }

  .dateheight {
    height: 32px;
  }

  .drop {
    margin-left: 30px;

    span {
      color: #cccccc;
      font-size: 10px;
    }

    ::v-deep.el-input {
      width: 100px !important;
      border: none;
    }
  }

</style>
