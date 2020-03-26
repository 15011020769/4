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
      <!-- <div class="drop" v-if="Graincontrol">
        <span style="margin-right:15px">時間粒度:</span>
        <el-select v-model="grainValue" size="small" @change="SwitchGrain">
          <el-option v-for="item in TimeGranularity" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div> -->
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
      },
      Difference: {
        required: true,
        type: String
      }
    },
    data() {
      return {
        TimeValue: '',
        grainValue: '',
        TimeGranularity: [],
        timevalueStart: null,
        timevalueEnd: null,
        datetimeval: [], // 選擇時間數據
        visible: false, // 時間選擇器的變化
        datetim: true, // 時間選擇器的變化
        datetime: false, // 時間選擇器的變化
        Start_End: {
          StartTIme: "",
          EndTIme: ""
        },
        picker: {
          disabledDate(time) {
            return time.getTime() > Date.now() || time.getTime() < (Date.now() - 5184000000)
          }
        },

      }
    },
    created() {
      this.initial()
    },
    methods: {
      //初始化數據
      initial() {
        this.TimeValue = this.TimeArr[0].Time
        if (this.TimeArr[0].TimeGranularity) {
          this.TimeGranularity = this.TimeArr[0].TimeGranularity
          this.grainValue = this.TimeArr[0].TimeGranularity[0].value
        }
        if (this.TimeValue)[
          this.AcquisitionTime()
        ]
      },
      //點擊時間按鈕
      TimeChoice(item) {
        this.datetime = false;
        this.datetim = true;
        this.TimeValue = item.Time
        if (item.TimeGranularity) {
          this.TimeGranularity = item.TimeGranularity
          this.grainValue = item.TimeGranularity[0].value
        }
        this.AcquisitionTime()
      },
      //切換粒度
      SwitchGrain() {
        this.$emit("switchData", [this.grainValue, this.Start_End]);
      },
      // 返回橫坐標數組
      getXAxis(startTime, endTime) {
        let startTimeSec = new Date(startTime).getTime();
        let endTimeSec = new Date(endTime).getTime();
        let XAxis = [];
        for (var i = startTimeSec; i <= endTimeSec; i = i + Number(this.grainValue)*1000) {
          XAxis.push(moment(new Date(i)).format("YYYY/MM/DD HH:mm:ss"))
        }
        return XAxis;
      },
      //根據字段獲取響應時間
      AcquisitionTime() {
        if (this.TimeValue === 'realTime') {
          this.Start_End.EndTIme = moment(new Date()).format("YYYY/MM/DD HH:mm:ss"); //獲取當前時間
          this.Start_End.StartTIme = moment(new Date()).subtract(1, 'hours').format("YYYY/MM/DD HH:mm:ss");;
          this.Start_End.XAxis = this.getXAxis(this.Start_End.StartTIme, this.Start_End.EndTIme);
        } else if (this.TimeValue === 'Nearly_24_hours') {
          this.Start_End.EndTIme = moment(new Date()).format("YYYY/MM/DD HH:mm:ss"); //獲取當前時間
          this.Start_End.StartTIme = moment(new Date()).subtract(1, 'days').format("YYYY/MM/DD HH:mm:ss");;
          this.Start_End.XAxis = this.getXAxis(this.Start_End.StartTIme, this.Start_End.EndTIme);
        } else if (this.TimeValue === 'Nearly_7_days') {
          this.Start_End.EndTIme = moment(new Date()).format("YYYY/MM/DD HH:mm:ss"); //獲取當前時間
          this.Start_End.StartTIme = moment(new Date()).subtract(6, 'days').format("YYYY/MM/DD HH:mm:ss");;
          this.Start_End.XAxis = this.getXAxis(this.Start_End.StartTIme, this.Start_End.EndTIme);
        } else if (this.TimeValue === 'Nearly_15_days') {
          this.Start_End.EndTIme = moment(new Date()).format("YYYY/MM/DD HH:mm:ss"); //獲取當前時間
          this.Start_End.StartTIme = moment(new Date()).subtract(14, 'days').format("YYYY/MM/DD HH:mm:ss");;
          this.Start_End.XAxis = this.getXAxis(this.Start_End.StartTIme, this.Start_End.EndTIme);
        } else if (this.TimeValue === 'Today') {
          this.Start_End.EndTIme = moment(new Date()).format("YYYY/MM/DD HH:mm:ss"); //獲取當前時間
          this.Start_End.StartTIme = moment(new Date()).startOf('day').format("YYYY/MM/DD HH:mm:ss");;
          this.Start_End.XAxis = this.getXAxis(this.Start_End.StartTIme, this.Start_End.EndTIme);
        } else if (this.TimeValue === 'Yesterday') {
          this.Start_End.StartTIme = moment().subtract(1, 'days').startOf('day').format("YYYY/MM/DD HH:mm:ss");
          this.Start_End.EndTIme = moment().subtract(1, 'days').endOf('day').format("YYYY/MM/DD HH:mm:ss");
          this.Start_End.XAxis = this.getXAxis(this.Start_End.StartTIme, this.Start_End.EndTIme);
        } else if (this.TimeValue === 'Nearly_30_days') {
          this.Start_End.EndTIme = moment(new Date()).format("YYYY/MM/DD HH:mm:ss"); //獲取當前時間
          this.Start_End.StartTIme = moment(new Date()).subtract(29, 'days').format("YYYY/MM/DD HH:mm:ss");;
          this.Start_End.XAxis = this.getXAxis(this.Start_End.StartTIme, this.Start_End.EndTIme);
        }
        this.Start_End.StartTIme = moment(new Date(this.Start_End.StartTIme)).format("YYYY-MM-DD HH:mm:ss")
        this.Start_End.EndTIme = moment(new Date(this.Start_End.EndTIme)).format("YYYY-MM-DD HH:mm:ss")
        this.$emit("switchData", [this.grainValue, this.Start_End]);
      },
      // 確定按鈕
      Sure() {
        this.TimeValue = '' //按鈕樣式去掉
        this.timevalueStart = moment(this.timevalueStart).format("YYYY/MM/DD HH:mm:ss")
        this.timevalueEnd = moment(this.timevalueEnd).format("YYYY/MM/DD HH:mm:ss")
        const startTime = moment(this.timevalueStart);
        const endTime = moment(this.timevalueEnd);
        let Basis = ''
        if (endTime.diff(startTime, 'h') <= 1 && this.Difference == 'H') {
          Basis = 'realTime'
        } else if (endTime.diff(startTime, 'd') <= 1 && this.Difference == 'H') {
          Basis = 'Nearly_24_hours'
        } else if ((endTime.diff(startTime, 'd') <= 6 && this.Difference == 'H') || (endTime.diff(startTime, 'd') > 6 &&
            this.Difference == 'H')) {
          Basis = 'Nearly_7_days'
        } else if (endTime.diff(startTime, 'd') <= 1 && this.Difference == 'D') {
          Basis = 'Today'
        } else if (endTime.diff(startTime, 'd') <= 6 && this.Difference == 'D') {
          Basis = 'Nearly_7_days'
        } else if (endTime.diff(startTime, 'd') <= 14 && this.Difference == 'D') {
          Basis = 'Nearly_15_days'
        } else if (endTime.diff(startTime, 'd') <= 29 && this.Difference == 'D') {
          Basis = 'Nearly_30_days'
        }
        this.TimeArr.forEach(item => {
          if (item.Time === Basis) {
            if (item.TimeGranularity) {
              this.TimeGranularity = item.TimeGranularity
              this.grainValue = item.TimeGranularity[0].value
            }
          }
        });
        this.visible = false;
        this.datetime = true;
        this.datetim = false;
        this.Start_End.StartTIme = moment(new Date(this.timevalueStart)).format("YYYY-MM-DD HH:mm:ss")
        this.Start_End.EndTIme = moment(new Date(this.timevalueEnd)).format("YYYY-MM-DD HH:mm:ss")
        this.$emit("switchData", [this.grainValue, this.Start_End]);
      },
      // 選擇時間
      SelectionTime() {
        this.datetime = false;
        this.datetim = true;
        if (this.timevalueStart === null) {
          this.timevalueStart = moment(new Date()).subtract(1, 'hours').format("YYYY/MM/DD HH:mm:ss")
          this.timevalueEnd = moment(new Date()).format("YYYY/MM/DD HH:mm:ss")
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
