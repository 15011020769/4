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
            >实时</el-button>
            <el-button
              size="small"
              @click="TimeChoice(1*24)"
              :type="classsvalue == 1*24 ? 'primary' : ''"
            >近24小时</el-button>
            <el-button
              size="small"
              @click="TimeChoice(1*24*7)"
              :type="classsvalue == 1*24*7 ? 'primary' : ''"
            >近7天</el-button>
            <el-popover placement="bottom" width="400" trigger="manual" v-model="visible">
              <p class="p-dis">
                <span>从</span>
                <el-date-picker
                  class="width-date"
                  v-model="datevalueStart"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
                <el-time-picker class="width-date" v-model="timevalueStart" placeholder="任意时间点"></el-time-picker>
              </p>
              <p class="p-dis">
                <span>至</span>
                <el-date-picker
                  class="width-date"
                  v-model="datevalueEnd"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>
                <el-time-picker class="width-date" v-model="timevalueEnd" placeholder="任意时间点"></el-time-picker>
              </p>
              <el-row class="margin-row">
                <el-button size="mini" type="primary" @click="Sure">确定</el-button>
                <el-button size="mini" @click="visible = false">取消</el-button>
              </el-row>
              <el-button
                size="small"
                v-if="datetim"
                icon="el-icon-search"
                @click="SelectionTime"
                slot="reference"
              >选择日期</el-button>
            </el-popover>
            <el-date-picker
              v-if="datetime"
              v-model="datetimeval"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="false"
              class="dateheight"
              @change="ReSelection"
            ></el-date-picker>
          </el-button-group>
        </el-row>
        <div class="drop">
          <span style="margin-right:15px">时间粒度:</span>
          <el-select v-model="value" placeholder="请选择" @change="switchData()" size="small">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <p class="LocaP">
        <a href="javascript:location.reload();">刷新</a>
      </p>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      datevalueStart: new Date(), // 日期（从）
      timevalueStart: new Date(), // 时间（从）
      datevalueEnd: new Date(), // 日期（至）
      timevalueEnd: new Date(), // 时间（至）
      datetimeval: [], // 选择时间数据
      visible: false, // 时间选择器的变化
      datetim: true, // 时间选择器的变化
      datetime: false, // 时间选择器的变化
      options: [
        // 默认下拉数据
        {
          value: "10",
          label: "10秒"
        },
        {
          value: "60",
          label: "1分钟"
        },
        {
          value: "300",
          label: "5分钟"
        }
      ],
      value: "10", // 粒度选择值
      Start_End: {
        StartTIme: "",
        EndTIme: ""
      },
      classvalue: 1
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
        this.value = "10";
        this.options = [
          {
            value: "10",
            label: "10秒"
          },
          {
            value: "60",
            label: "1分钟"
          },
          {
            value: "300",
            label: "5分钟"
          }
        ];
        const KTime = moment(new Date()).format("YYYY/MM/DD HH:mm:ss"); //获取当前时间
        const ETime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"); //获取当前时间
        const startTime = new Date(KTime).getTime();
        // 1小时前
        const noehoursago = moment(startTime - 3600000).format(
          "YYYY-MM-DD HH:mm:ss"
        ); //获取1小时前的时间
        this.Start_End.StartTIme = noehoursago;
        this.Start_End.EndTIme = ETime;
      } else if (time === 1 * 24) {
        this.value = "60";
        this.options = [
          {
            value: "60",
            label: "1分钟"
          },
          {
            value: "300",
            label: "5分钟"
          },
          {
            value: "3600",
            label: "1小时"
          },
          {
            value: "86400",
            label: "1天"
          }
        ];
        const KTime = moment(new Date()).format("YYYY/MM/DD HH:mm:ss"); //获取当前时间
        const ETime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"); //获取当前时间
        const startTime = new Date(KTime).getTime();
        // 1小时前
        const noehoursago = moment(startTime - 86400000).format(
          "YYYY-MM-DD HH:mm:ss"
        ); //获取1天前的时间
        this.Start_End.StartTIme = noehoursago;
        this.Start_End.EndTIme = ETime;
      } else if (time === 1 * 24 * 7) {
        this.value = "3600";
        this.options = [
          {
            value: "3600",
            label: "1小时"
          },
          {
            value: "86400",
            label: "1天"
          }
        ];
        const KTime = moment(new Date()).format("YYYY/MM/DD HH:mm:ss"); //获取当前时间
        const ETime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"); //获取当前时间
        const startTime = new Date(KTime).getTime();
        // 1小时前
        const noehoursago = moment(startTime - 604800000).format(
          "YYYY-MM-DD HH:mm:ss"
        ); //获取1周前的时间
        this.Start_End.StartTIme = noehoursago;
        this.Start_End.EndTIme = ETime;
      }
      this.$emit("switchData", [this.value, this.Start_End, this.classvalue]);
    },
    switchData() {
      this.$emit("switchData", [this.value, this.Start_End, this.classvalue]);
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
      this.value = "";
      this.TimeAfter();
    },
    // 按钮控制时间粒度初始化
    Initialization() {
      this.value = "";
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
        this.value = "10";
        this.options = [
          {
            value: "10",
            label: "10秒"
          },
          {
            value: "60",
            label: "1分钟"
          },
          {
            value: "300",
            label: "5分钟"
          }
        ];
      } else if (endTime - startTime <= 86400) {
        this.TimeSlot = "1days";
        this.classvalue = "";
        this.value = "60";
        this.options = [
          {
            value: "60",
            label: "1分钟"
          },
          {
            value: "300",
            label: "5分钟"
          },
          {
            value: "3600",
            label: "1小时"
          },
          {
            value: "86400",
            label: "1天"
          }
        ];
      } else {
        this.TimeSlot = "1weeks";
        this.classvalue = "";
        this.value = "3600";
        this.options = [
          {
            value: "3600",
            label: "1小时"
          },
          {
            value: "86400",
            label: "一天"
          }
        ];
      }
      this.Start_End.StartTIme = moment(this.datetimeval[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.Start_End.EndTIme = moment(this.datetimeval[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.$emit("switchData", [this.value, this.Start_End, this.classvalue]);
    }
  }
};
</script>

<style scoped lang="scss">
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
