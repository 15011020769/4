<template>
  <div>
    <div class="box-dis">
      <!-- 时间粒度搜素 -->
      <div class="btn-style">
        <el-row>
          <el-button-group>
            <el-button
              size="small"
              @click="TimeChoice(1)"
              :type="classsvalue == 1 ? 'primary' : ''"
              >今天</el-button
            >
            <el-button
              size="small"
              @click="TimeChoice(-1)"
              :type="classsvalue == -1 ? 'primary' : ''"
              >昨天</el-button
            >
            <el-button
              size="small"
              @click="TimeChoice(1 * 24 * 7)"
              :type="classsvalue == 1 * 24 * 7 ? 'primary' : ''"
              >近7天</el-button
            >
            <el-button
              size="small"
              @click="TimeChoice(1 * 24 * 30)"
              :type="classsvalue == 1 * 24 * 30 ? 'primary' : ''"
              >近30天</el-button
            >
            <el-popover
              placement="bottom"
              width="400"
              trigger="manual"
              v-model="visible"
            >
              <p class="p-dis">
                <span>從</span>
                <el-date-picker
                  class="width-date"
                  v-model="Start_End.StartTIme"
                  type="date"
                  placeholder="選擇日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="startTimePickerOptions"
                ></el-date-picker>
                <el-time-picker
                  class="width-date"
                  v-model="Start_End.StartTIme"
                  value-format="HH:mm:ss"
                  placeholder="任意時間點"
                ></el-time-picker>
              </p>
              <p class="p-dis">
                <span>至</span>
                <el-date-picker
                  class="width-date"
                  v-model="Start_End.EndTIme"
                  type="date"
                  placeholder="選擇日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="endTimePickerOptions"
                ></el-date-picker>
                <el-time-picker
                  class="width-date"
                  v-model="Start_End.EndTIme"
                  placeholder="任意時間點"
                  value-format="HH:mm:ss"
                ></el-time-picker>
              </p>
              <el-row class="margin-row">
                <el-button size="mini" type="primary" @click="Sure"
                  >確定</el-button
                >
                <el-button size="mini" @click="visible = false">取消</el-button>
              </el-row>
              <el-button
                size="small"
                v-if="datetim"
                icon="el-icon-search"
                @click="SelectionTime"
                slot="reference"
                >選擇日期</el-button
              >
            </el-popover>
            <el-date-picker
              v-if="datetime"
              v-model="datetimeval"
              type="datetimerange"
              range-separator="至"
              start-placeholder="開始日期"
              end-placeholder="結束日期"
              :clearable="false"
              class="dateheight"
              @change="ReSelection"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-button-group>
        </el-row>
        <div class="drop" v-if="granularity">
          <span style="margin-right:15px">時間粒度:</span>
          <el-select
            v-model="value"
            placeholder="請選擇"
            @change="switchData()"
            size="small"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data () {
    let _minTime = null
    let _maxTime = null

    return {
      datetimeval: [], // 选择时间数据
      visible: false, // 时间选择器的变化
      datetim: true, // 时间选择器的变化
      datetime: false, // 时间选择器的变化
      options: [
        // 默认下拉数据
        {
          value: '300',
          label: '5分鐘'
        },
        {
          value: '3600',
          label: '1小時'
        }
      ],
      value: '300', // 粒度选择值
      Start_End: {
        StartTIme: '',
        EndTIme: ''
      },
      classvalue: 1,
      pickerOptions: {
        onPick (time) {
          // 如果选择了只选择了一个时间
          if (!time.maxDate) {
            let timeRange = 30 * 24 * 60 * 60 * 1000 // 腾讯接口要求不能超过31天
            _minTime = time.minDate.getTime() - timeRange // 最小时间

            const tempMaxTime = time.minDate.getTime() + timeRange // 最大时间
            const now = Date.now()

            // 不超过今天
            if (tempMaxTime > now) {
              _maxTime = now
            } else {
              _maxTime = tempMaxTime
            }
            // 如果选了两个时间，那就清空本次范围判断数据，以备重选
          } else {
            _minTime = _maxTime = null
          }
        },
        disabledDate (time) {
          // onPick后触发
          // 该方法会轮询当3个月内的每一个日期，返回false表示该日期禁选
          if (_minTime && _maxTime) {
            return time.getTime() < _minTime || time.getTime() > _maxTime
          } else if (_minTime == null && _maxTime == null) {
            // 如果都没有选择要限制不能比今天更晚的日期
            const now = Date.now()
            const beroreNow = Date.now() - 3600 * 1000 * 24 * 60
            return time.getTime() > now || time.getTime() < beroreNow
          }
        }
      },
      startTimePickerOptions: {
        disabledDate (time) {
          const now = Date.now() - 3600 * 1000 * 24 * 60
          return time.getTime() < now || time.getTime() > Date.now()
        }
      },
      endTimePickerOptions: {
        disabledDate (time) {
          const now = Date.now()
          return (
            time.getTime() > now ||
            time.getTime() < Date.now() - 3600 * 1000 * 24 * 60
          )
        }
      }
    }
  },
  props: {
    classsvalue: {
      required: true
    },
    granularity: {
      required: false,
      type: Boolean,
      default: true
    }
  },
  created () {
    this.TimeChoice(1)
  },
  methods: {
    // 点击时间按钮
    TimeChoice (time) {
      this.classvalue = time
      this.Initialization()
      this.value = '300'
      let options = [
        {
          value: '300',
          label: '5分鐘'
        },
        {
          value: '3600',
          label: '1小時'
        }
      ]
      if (time === 1) {
        const KTime = moment()
          .startOf('d')
          .format('YYYY-MM-DD HH:mm:ss')
        const ETime = moment().format('YYYY-MM-DD HH:mm:ss')
        this.Start_End.StartTIme = KTime
        this.Start_End.EndTIme = ETime
      } else if (time === -1) {
        const KTime = moment()
          .subtract(1, 'd')
          .startOf('d')
          .format('YYYY-MM-DD HH:mm:ss')
        const ETime = moment()
          .subtract(1, 'd')
          .endOf('d')
          .format('YYYY-MM-DD HH:mm:ss')
        this.Start_End.StartTIme = KTime
        this.Start_End.EndTIme = ETime
      } else if (time === 1 * 24 * 7) {
        options = [
          ...options,
          {
            value: '86400',
            label: '一天'
          }
        ]
        this.Start_End.StartTIme = moment()
          .subtract(6, 'd')
          .startOf('d')
          .format('YYYY-MM-DD HH:mm:ss')
        this.Start_End.EndTIme = moment().format('YYYY-MM-DD HH:mm:ss')
      } else if (time === 1 * 24 * 30) {
        options = [
          ...options,
          {
            value: '86400',
            label: '一天'
          }
        ]
        this.Start_End.StartTIme = moment()
          .subtract(29, 'd')
          .startOf('d')
          .format('YYYY-MM-DD HH:mm:ss')
        this.Start_End.EndTIme = moment().format('YYYY-MM-DD HH:mm:ss')
      }
      this.options = options
      this.$emit('switchData', [this.value, this.Start_End, this.classvalue])
    },
    switchData () {
      this.$emit('switchData', [this.value, this.Start_End, this.classvalue])
    },
    // 确定按钮
    Sure () {
      const startDatetime = moment(
        this.Start_End.StartTIme,
        'YYYY-MM-DD HH:mm:ss'
      )
      const endDatetime = moment(this.Start_End.EndTIme, 'YYYY-MM-DD HH:mm:ss')

      if (endDatetime.diff(startDatetime, 'days') >= 31) {
        this.$message.error('只能查詢31天內的趨勢數據')
        return
      }

      this.visible = false
      this.getdate()
      this.TimeAfter()
    },
    // 截取时间
    getdate () {
      this.datetim = false
      this.datetime = true
      this.datetimeval = [
        moment(this.Start_End.StartTIme),
        moment(this.Start_End.EndTIme)
      ]
    },
    // 选择时间
    SelectionTime () {
      this.visible = true
    },
    // 时间重新选择---确定
    ReSelection () {
      if (
        this.datetimeval === null ||
        this.datetimeval === undefined ||
        this.datetimeval.length === 0
      ) {
        return
      }

      this.value = ''
      this.TimeAfter()
    },
    // 按钮控制时间粒度初始化
    Initialization () {
      this.value = ''
      this.datetim = true
      this.datetime = false
    },
    // 确定之后
    TimeAfter () {
      const qdate = moment(this.datetimeval[0])
      const hdate = moment(this.datetimeval[1])
      this.value = '300'
      this.classvalue = ''
      if (hdate.diff(qdate, 'd') < 6) {
        this.options = [
          {
            value: '300',
            label: '5分鐘'
          },
          {
            value: '3600',
            label: '1小時'
          }
        ]
      } else {
        this.options = [
          {
            value: '300',
            label: '5分鐘'
          },
          {
            value: '3600',
            label: '1小時'
          },
          {
            value: '86400',
            label: '一天'
          }
        ]
      }
      this.Start_End.StartTIme = moment(this.datetimeval[0]).format(
        'YYYY-MM-DD HH:mm:ss'
      )
      this.Start_End.EndTIme = moment(this.datetimeval[1]).format(
        'YYYY-MM-DD HH:mm:ss'
      )
      this.$emit('switchData', [this.value, this.Start_End, this.classvalue])
    }
  }
}
</script>

<style scoped lang="scss">
.box-dis {
  display: flex;
  justify-content: space-between;

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

      ::v-deep.el-input {
        width: 100px !important;
        border: none;
      }
    }
  }
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
  height: 34px;
}

::v-deep.i-font {
  font-size: 36px;
}

::v-deep.el-button--small {
  font-size: 14px !important;
}

.bgImgSet {
  background: blue;
}

.LocaP {
  padding-right: 20px;
}
</style>
