<template>
  <div class="streamlookup-wrap">
    <Header :title="$t('CSS.appreciation.14')" />
    <div class="toolbar">
      <div class="search-wrap">
        <p>{{$t('CSS.appreciation.15')}}</p>

        <div class="search">
          <el-input v-model="StreamName" :placeholder="$t('CSS.appreciation.16')"></el-input>
          <el-button type="primary" size="small" class="searchbtn" @click="search">{{$t('CSS.appreciation.0')}}</el-button>
        </div>
      </div>
    </div>
    <div class="streamlookup-main" v-if="showMain">
      <p class="title">StreamName(流ID)：{{streamIDAfterSearch}} 詳細數據</p>
      <p class="sontitle" v-if="selectStream== '1'">播放數據查詢只能查詢最近30天，查詢時間段小於24小時</p>
      <p class="sontitle" v-else>推流數據查詢只能查詢最近3天，查詢時間段小於3小時</p>
      <div class="seek">
        <el-select
          size="small"
          v-model="selectStream"
          @change="changeOption"
          style="margin-right:20px;"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button-group>
          <el-button @click="checkTime(1)" :class="selBtn=='1'?'addStyleBtn':''">今天</el-button>
          <el-button @click="checkTime(2)" :class="selBtn=='2'?'addStyleBtn':''">昨天</el-button>
          <el-button @click="checkTime(3)" :class="selBtn=='3'?'addStyleBtn':''">前天</el-button>
        </el-button-group>
        <el-date-picker
          ref="mypicker"
          v-model="dateTimeValue"
          type="datetimerange"
          class="timeValue"
          range-separator="至"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
          @change="changeTimeValue"
          :picker-options="selectStream== '1' ? pickerOptions1 : pickerOptions2"
          :clearable= false
        ></el-date-picker>
      </div>
      <Play
        :StreamName="StreamName"
        :StartTime="StartTime"
        :EndTime="EndTime"
        v-if="showPlay"
        ref="tab1"
      />
      <Stream :StreamName="StreamName" :StartTime="StartTime" :EndTime="EndTime" v-else ref="tab2" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Header from '@/components/public/Head'
import Stream from './tab/stream'
import Play from './tab/play'
export default {
  name: 'streamlookup',
  data () {
    return {
      value: 1, // 时间组件默认选中值
      selectStream: '1',
      StreamName: '',
      streamIDAfterSearch: '',
      showMain: false,
      showPlay: true,
      options: [
        {
          value: '1',
          label: '檢視播放數據'
        },
        {
          value: '2',
          label: '檢視推流數據'
        }
      ],
      StartTime: moment(new Date()).subtract(2,'hours').format("YYYY-MM-DD HH:mm:ss"),
      EndTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      selBtn: 1, // 默认选中今天按钮
      dateTimeValue: [moment().subtract(2,'hours').format("YYYY-MM-DD HH:mm:ss"), moment().format("YYYY-MM-DD HH:mm:ss")], // 日期绑定
      pickerOptions1: {
        disabledDate(time) {
          return time > moment() || moment(new Date()).diff(time, 'days') > 29;
        },
      },
      pickerOptions2: {
        disabledDate(time) {
          return time > moment() || moment(new Date()).diff(time, 'days') > 3;
        },
      }
    }
  },
  components: {
    Header,
    Stream,
    Play
  },
  created () {},
  methods: {
    search () {
      if (this.StreamName == '' && this.showMain == false) {
        this.$message.error('請輸入流id')
      } else {
        this.streamIDAfterSearch = this.StreamName
        this.showMain = true
        if (this.selectStream == '1') {
          this.$nextTick(() => {
            this.$refs.tab1.init()
          })
        } else {
          this.$nextTick(() => {
            this.$refs.tab2.init()
          })
        }
      }
    },
     //时间点击事件
    checkTime(val) {
      let times = [moment().subtract(2,'hours'), moment()] // 默认今天
      this.selBtn = val
      switch (val) {
        case 2:
          times = [moment().subtract(1, "days").subtract(2,'hours'), moment().subtract(1, "days")]
          break;
        case 3:
          times = [moment().subtract(2, "days").subtract(2,'hours'), moment().subtract(2, "days")]
          break;
        default:
          break;
      }
      this.$refs.mypicker.userInput = null
      this.dateTimeValue = times
      this.StartTime = moment(times[0]).format('YYYY-MM-DD HH:mm:ss')
      this.EndTime = moment(times[1]).format('YYYY-MM-DD HH:mm:ss')
      if (this.selectStream == '1') {
        this.$nextTick(() => {
          this.$refs.tab1.init()
        })
      } else {
        this.$nextTick(() => {
          this.$refs.tab2.init()
        })
      }
    },
    changeTimeValue(val) {
      if (val == null) val = []
      this.selBtn = 0
      this.StartTime = moment(val[0]).format('YYYY-MM-DD HH:mm:ss')
      this.EndTime = moment(val[1]).format('YYYY-MM-DD HH:mm:ss')
       if (this.selectStream == '1') {
        this.$nextTick(() => {
          this.$refs.tab1.init()
        })
      } else {
        this.$nextTick(() => {
          this.$refs.tab2.init()
        })
      }
    },
    changeOption (val) {
      if (val == '1') {
        this.showPlay = true
        this.$nextTick(() => {
          this.$refs.tab1.init()
        })
      } else {
        this.showPlay = false
        this.$nextTick(() => {
          this.$refs.tab2.init()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input {
  width: 320px;
}
.streamlookup-wrap {
  .toolbar {
    margin: 20px;
    padding: 10px 0;
    box-sizing: border-box;
    background: white;
    .search-wrap {
      padding: 20px;
      p {
        margin-bottom: 10px;
      }
      .search {
        display: flex;
        justify-content: flex-start;
        ::v-deep .el-input__inner {
          height: 34px !important;
        }
      }
    }
  }
  .streamlookup-main {
    margin: 20px;
    padding: 20px;
    box-sizing: border-box;
    background: white;
    .title {
      font-size: 14px;
      font-weight: 700;
    }
    .sontitle {
      font-size: 12px;
      color: #bbb;
      margin: 10px 0;
    }
    .seek {
      display: flex;
      align-items: center;
      ::v-deep .el-button{
        height: 32px;
        border-radius: 0;
        line-height: 32px;
        padding-top: 0;
        overflow: hidden;
      }
      ::v-deep .el-input__inner {
        height: 32px;
        border-radius: 0;
        line-height: 32px;
        padding-top: 0;
        overflow: hidden
      }
      ::v-deep .el-range-separator{
        line-height: 26px;
      }
    }
  }
}
.addStyleBtn {
  background-color: #006eff !important;
  color: #fff;
}

</style>
