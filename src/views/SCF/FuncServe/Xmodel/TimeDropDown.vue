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
              <el-date-picker class="width-date" v-model="timevalueStart" type="date" :placeholder="$t('SCF.total.xzrq')"
                :picker-options="picker">
              </el-date-picker>
              <el-time-picker class="width-date" v-model="timevalueStart" :placeholder="$t('SCF.total.rysjd')">
              </el-time-picker>
            </p>
            <p class="p-dis">
              <span>至</span>
              <el-date-picker class="width-date" v-model="timevalueEnd" type="date" :placeholder="$t('SCF.total.xzrq')"
                :picker-options="picker">
              </el-date-picker>
              <el-time-picker class="width-date" v-model="timevalueEnd" :placeholder="$t('SCF.total.rysjd')">
              </el-time-picker>
            </p>
            <el-row class="margin-row">
              <el-button size="mini" type="primary" @click="Sure">{{$t('SCF.total.qd')}}</el-button>
              <el-button size="mini" @click="visible = false">取消</el-button>
            </el-row>
            <el-button size="small" v-if="datetim" icon="el-icon-search" @click="SelectionTime" slot="reference">{{$t('SCF.total.xzrq')}}
            </el-button>
            <el-button size="small" v-if="datetime" @click="SelectionTime" slot="reference">
              {{timevalueStart}}至{{timevalueEnd}}<i class="el-icon-date el-icon--right"></i>
            </el-button>
          </el-popover>
          <el-button size="small" @click="_Reset">重置</el-button>
        </el-button-group>
      </el-row>
      <div class="drop" v-if="Graincontrol">
        <span style="margin-right:15px">{{$t('SCF.total.sjld')}}:</span>
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
            return time.getTime() > Date.now() || time.getTime() < (Date.now() - 5184000000)
          }
        },

      }
    },
    created() {
      this.initial()
    },
    methods: {
      //重置
      _Reset() {
        this.TimeValue = "realTime"
        this.datetime = false;
        this.datetim = true;
        this.AcquisitionTime()
        this.$emit("_Reset");
      },
      //初始化数据
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
      //点击时间按钮
      TimeChoice(item) {
        console.log(item)
        this.datetime = false;
        this.datetim = true;
        this.TimeValue = item.Time
        if (item.TimeGranularity) {
          this.TimeGranularity = item.TimeGranularity
          this.grainValue = item.TimeGranularity[0].value
        }
        this.AcquisitionTime()
      },
      //切换粒度
      SwitchGrain() {
        this.$emit("switchData", [this.grainValue, this.Start_End]);
      },
      //根据字段获取响应时间
      AcquisitionTime() {
        if (this.TimeValue === 'realTime') {
          this.Start_End.EndTIme = moment(new Date()).format("YYYY/MM/DD HH:mm:ss"); //获取当前时间
          this.Start_End.StartTIme = moment(new Date()).subtract(1, 'hours').format("YYYY/MM/DD HH:mm:ss");;
        } else if (this.TimeValue === 'Nearly_24_hours') {
          this.Start_End.EndTIme = moment(new Date()).format("YYYY/MM/DD HH:mm:ss"); //获取当前时间
          this.Start_End.StartTIme = moment(new Date()).subtract(1, 'days').format("YYYY/MM/DD HH:mm:ss");;
        } else if (this.TimeValue === 'Nearly_7_days') {
          this.Start_End.EndTIme = moment(new Date()).format("YYYY/MM/DD HH:mm:ss"); //获取当前时间
          this.Start_End.StartTIme = moment(new Date()).subtract(6, 'days').format("YYYY/MM/DD HH:mm:ss");;
        } else if (this.TimeValue === 'Nearly_15_days') {
          this.Start_End.EndTIme = moment(new Date()).format("YYYY/MM/DD HH:mm:ss"); //获取当前时间
          this.Start_End.StartTIme = moment(new Date()).subtract(14, 'days').format("YYYY/MM/DD HH:mm:ss");;
        } else if (this.TimeValue === 'Today') {
          this.Start_End.EndTIme = moment(new Date()).format("YYYY/MM/DD HH:mm:ss"); //获取当前时间
          this.Start_End.StartTIme = moment(new Date()).startOf('day').format("YYYY/MM/DD HH:mm:ss");;
        } else if (this.TimeValue === 'Yesterday') {
          this.Start_End.StartTIme = moment().subtract(1, 'days').startOf('day').format("YYYY/MM/DD HH:mm:ss");
          this.Start_End.EndTIme = moment().subtract(1, 'days').endOf('day').format("YYYY/MM/DD HH:mm:ss");
        } else if (this.TimeValue === 'Nearly_30_days') {
          this.Start_End.EndTIme = moment(new Date()).format("YYYY/MM/DD HH:mm:ss"); //获取当前时间
          this.Start_End.StartTIme = moment(new Date()).subtract(29, 'days').format("YYYY/MM/DD HH:mm:ss");;
        }
        this.Start_End.StartTIme = moment(new Date(this.Start_End.StartTIme)).format("YYYY-MM-DD HH:mm:ss")
        this.Start_End.EndTIme = moment(new Date(this.Start_End.EndTIme)).format("YYYY-MM-DD HH:mm:ss")
        this.$emit("switchData", [this.grainValue, this.Start_End]);
      },
      // 确定按钮
      Sure() {
        this.TimeValue = '' //按钮样式去掉
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
      // 选择时间
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
