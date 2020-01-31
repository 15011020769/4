<template>
  <div>
    <div class="TimeDropDown">
      <el-row>
        <el-button-group>
          <el-button v-for="(item,index) in TimeArr" :key="index" :type="item.Time == TimeValue ? 'primary' : ''"
            size="small" @click="TimeChoice(item)">
            {{item.name}}
          </el-button>
        </el-button-group>
      </el-row>
      <div class="drop">
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
      }
    },
    data() {
      return {
        TimeValue: '',
        grainValue: '',
        TimeGranularity: [],
        Start_End: {
          StartTIme: "",
          EndTIme: ""
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
      }

    },
  }

</script>
<style lang="scss" scoped>
  .TimeDropDown {
    display: flex
  }

</style>
