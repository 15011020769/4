<template>
  <div class="box-dis">
    <!-- 时间粒度搜素 -->
    <div class="btn-style">
      <el-row>
        <el-button-group>
          <el-button size="small" @click="TimeChoice(1)" :type="classsvalue == 1 ? 'primary' : ''">今天</el-button>
          <el-button size="small" @click="TimeChoice(1*24)" :type="classsvalue == 1*24 ? 'primary' : ''">昨天
          </el-button>
          <el-button size="small" @click="TimeChoice(1*24*7)" :type="classsvalue == 1*24*7 ? 'primary' : ''">近7天
          </el-button>
          <el-button size="small" @click="TimeChoice(1*24*30)" :type="classsvalue == 1*24*30? 'primary' : ''">近30天
          </el-button>
          <el-popover placement="bottom" width="400" trigger="manual" v-model="visible">
            <p class="p-dis">
              <span>從</span>
              <el-date-picker
                class="width-date"
                v-model="datevalueStart"
                type="date"
                placeholder="選擇日期"
                :picker-options="pickerOptions1"
              >
              </el-date-picker>
              <el-time-picker class="width-date" v-model="timevalueStart" placeholder="任意時間點"></el-time-picker>
            </p>
            <p class="p-dis">
              <span>至</span>
              <el-date-picker
                class="width-date"
                v-model="datevalueEnd"
                type="date"
                placeholder="選擇日期"
                :picker-options="pickerOptions2"
              >
              </el-date-picker>
              <el-time-picker class="width-date" v-model="timevalueEnd" placeholder="任意時間點"></el-time-picker>
            </p>
            <el-row class="margin-row">
              <el-button size="mini" type="primary" @click="Sure">確定</el-button>
              <el-button size="mini" @click="visible = false">取消</el-button>
            </el-row>
            <el-button size="small" v-if="datetim" icon="el-icon-search" @click="SelectionTime" slot="reference">選擇日期
            </el-button>
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
          >
          </el-date-picker>
        </el-button-group>
      </el-row>
    </div>
  </div>
</template>

<script>
  import moment from "moment";

  export default {
    data() {
      let vue = this
      return {
        datevalueStart: new Date(), // 日期（从）
        timevalueStart: new Date(), // 时间（从）
        datevalueEnd: new Date(), // 日期（至）
        timevalueEnd: new Date(), // 时间（至）
        datetimeval: [], // 选择时间数据
        visible: false, // 时间选择器的变化
        datetim: true, // 时间选择器的变化
        datetime: false, // 时间选择器的变化
        timeOptionRange: "",
        Start_End: {
          StartTIme: "",
          EndTIme: ""
        },
        classvalue: 1,
        pickerOptions1: {
          disabledDate(time) {
            return time > moment()
          },
        },
        pickerOptions2: {
          disabledDate(time) {
            let timeOptionRange = vue.datevalueStart;
            if(timeOptionRange){
              return moment(time).diff(timeOptionRange, 'days') > 30 || time < moment(timeOptionRange) || time > moment()
            }
            return time > moment()
          },
        },
        pickerOptions: {
          disabledDate(time) {
            let timeOptionRange = vue.timeOptionRange;
            if(timeOptionRange){
              return moment(timeOptionRange).diff(time, 'days') > 30 || moment(time).diff(timeOptionRange, 'days') > 30 || time > moment()
            }
            return time > moment()
          },
          onPick(time){
            if(time.minDate && !time.maxDate){
                vue.timeOptionRange = time.minDate;
            }
            if(time.maxDate){
                vue.timeOptionRange = null;
            }
          }
        }
      };
    },
    props: {
      classsvalue: {
        required: true
      }
    },
    created() {
      this.TimeChoice(1);
    },
    methods: {
      //点击时间按钮
      TimeChoice(time) {
        this.classvalue = time;
        this.Initialization();
        if (time === 1) {
          //今天
          const KTime = moment(new Date()).format("YYYY/MM/DD 00:00:00"); //获取当前时间
          const ETime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"); //获取当前时间
          this.Start_End.StartTIme = KTime;
          this.Start_End.EndTIme = ETime;
        } else if (time === 1 * 24) {
          //昨天
          const KTime = moment(new Date()).format("YYYY/MM/DD HH:mm:ss"); //获取当前时间
          const startTime = new Date(KTime).getTime();
          // 
          const noeago = moment(startTime - 86400000).format(
            "YYYY-MM-DD 00:00:00"
          ); //获取1天前的时间
          const noenow = moment(startTime - 86400000).format(
            "YYYY-MM-DD 23:59:59"
          ); //获取1天前的时间
          this.Start_End.StartTIme = noeago;
          this.Start_End.EndTIme = noenow;
        } else if (time === 1 * 24 * 7) {
          const KTime = moment(new Date()).format("YYYY/MM/DD HH:mm:ss"); //获取当前时间
          const startTime = new Date(KTime).getTime();
          const zhouago = moment(startTime - 518400000).format(
            "YYYY-MM-DD 00:00:00"
          ); //获取1周前的时间
          const zhounow = moment(startTime).format(
            "YYYY-MM-DD 23:59:59"
          );
          this.Start_End.StartTIme = zhouago;
          this.Start_End.EndTIme = zhounow;
        } else if (time === 1 * 24 * 30) {
          const KTime = moment(new Date()).format("YYYY/MM/DD HH:mm:ss"); //获取当前时间
          const startTime = new Date(KTime).getTime();
          const yueago = moment(startTime - 2505600000).format(
            "YYYY-MM-DD 00:00:00"
          ); //获取1周前的时间
          const yuenow = moment(startTime).format(
            "YYYY-MM-DD 23:59:59"
          );
          this.Start_End.StartTIme = yueago;
          this.Start_End.EndTIme = yuenow;
        }
        this.$emit("switchData", [this.Start_End, this.classvalue]);
      },
      switchData() {
        this.$emit("switchData", [this.Start_End, this.classvalue]);
      },
      // 确定按钮
      Sure() {
        this.visible = false;
        this.getdate();
        this.TimeAfter();
      },
      // 截取时间
      getdate() {
        this.datetim = false;
        this.datetime = true;
        const y = moment(this.datevalueStart).format("YYYY");
        const m = moment(this.datevalueStart).format("MM") - 1;
        const d = moment(this.datevalueStart).format("DD");
        const h = moment(this.timevalueStart).format("HH");
        const f = moment(this.timevalueStart).format("mm");
        const s = moment(this.timevalueStart).format("ss");

        const yy = moment(this.datevalueEnd).format("YYYY");
        const mm = moment(this.datevalueEnd).format("MM") - 1;
        const dd = moment(this.datevalueEnd).format("DD");
        const hh = moment(this.timevalueEnd).format("HH") - 1;
        const ff = moment(this.timevalueEnd).format("mm");
        const ss = moment(this.timevalueEnd).format("ss");

        this.datetimeval = [
          new Date(y, m, d, h, f, s),
          new Date(yy, mm, dd, hh, ff, ss)
        ];
      },
      // 选择时间
      SelectionTime() {
        this.visible = true;
      },
      // 时间重新选择---确定
      ReSelection() {
        this.TimeAfter();
      },
      // 按钮控制时间粒度初始化
      Initialization() {
        this.datetim = true;
        this.datetime = false;
      },
      // 确定之后
      TimeAfter() {
        const qdate = moment(this.datetimeval[0]).format("YYYY/MM/DD-HH:mm:ss");
        const hdate = moment(this.datetimeval[1]).format("YYYY/MM/DD-HH:mm:ss");
        const startTime = new Date(qdate).getTime() / 1000;
        const endTime = new Date(hdate).getTime() / 1000;
        if (endTime - startTime <= 3600) {
          this.TimeSlot = "1hours";
          this.classvalue = "";
        } else if (endTime - startTime <= 86400) {
          this.TimeSlot = "1days";
          this.classvalue = "";
        } else {
          this.TimeSlot = "1weeks";
          this.classvalue = "";
        }
        this.Start_End.StartTIme = moment(this.datetimeval[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.Start_End.EndTIme = moment(this.datetimeval[1]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.$emit("switchData", [this.Start_End, this.classvalue]);
      }
    }
  };

</script>

<style scoped lang="scss">
  .box-dis {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    .btn-style {
      margin-left: 20px;
      display: flex;
      line-height: 32px;
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
