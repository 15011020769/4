<template>


  <div>
    <div class='box-dis'>
      <!-- 时间粒度搜素 -->
      <div class='btn-style'>
        <el-row>
          <el-button-group>
            <el-button size="small"
              @click="TimeChoice(1)"
              :type="classsvalue === 1 ? 'primary' : ''">实时</el-button>
            <el-button size="small"
              @click="TimeChoice(1*24)"
              :type="classsvalue === 1*24 ? 'primary' : ''">近24小时</el-button>
            <el-button size="small"
              @click="TimeChoice(1*24*7)"
              :type="classsvalue === 1*24*7 ? 'primary' : ''">近7天</el-button>

            <el-popover placement="bottom"
              width="400"
              v-model="visible"
              trigger="click">
              <p class='p-dis'>
                <span>从</span>
                <el-date-picker class="width-date"
                  v-model="datevalueStart"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
                <el-time-picker class="width-date"
                  v-model="timevalueStart"
                  placeholder="任意时间点">
                </el-time-picker>
              </p>
              <p class='p-dis'>
                <span>至</span>
                <el-date-picker class="width-date"
                  v-model="datevalueEnd"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
                <el-time-picker class="width-date"
                  v-model="timevalueEnd"
                  placeholder="任意时间点">
                </el-time-picker>
              </p>
              <el-row class='margin-row'>
                <el-button size="mini"
                  type="primary"
                  @click="Sure">确定</el-button>
                <el-button size="mini"
                  @click="visible = false">取消</el-button>
              </el-row>
              <el-button size="small"
                v-if="datetim"
                slot="reference"
                icon="el-icon-search"
                @click="SelectionTime">选择日期</el-button>
            </el-popover>
            <el-date-picker v-if="datetime"
              v-model="datetimeval"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="dateheight"
              @change="ReSelection">
            </el-date-picker>

          </el-button-group>
        </el-row>
        <div class="drop">
          <span style="margin-right:15px">时间粒度:</span>
          <el-select v-model="value"
            placeholder="请选择"
            size="small"
            @change="qiehuan(value)">
            <el-option v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <p class="LocaP"><a href="javascript:location.reload();">刷新</a></p>
    </div>

  </div>

</template>

<script>
import moment from 'moment';

export default {
  data() {
    return {
      clsddTime: 1,
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
          value: '10',
          label: '10秒',
        },
        {
          value: '60',
          label: '1分钟',
        },
        {
          value: '300',
          label: '5分钟',
        },
      ],
      value: '10', // 粒度选择值
      timeX: {
        // 生成X轴集合
        realtimemiao: [], // 实时10秒
        realtimenoe: [], // 实时1分钟
        realtimefive: [], // 实时5分钟
        daysnoe: [], // 1天1分钟
        daysfive: [], // 1天5分钟
        daysnoeh: [], // 1天1小时
        daysnoed: [], // 1天
        weeksnoeh: [], // 1周1小时
        weeksnoed: [], // 1周1天
      },
      Start_End: {
        StartTIme: '',
        EndTIme: '',
      },
      XtimeX: [],
      TimeSlot: '',
    };
  },
  props: {
    classsvalue: {
      required: true,
      type: String,
    },
  },
  created() {
    this.uptime();
    this.XTimeX();
    this.$emit('qiehuan', [this.value, this.XtimeX, this.Start_End, 1]);
    this.GettimeX();
  },
  methods: {
    // 初始化x数据
    Reset() {
      this.timeX.realtimemiao = [];
      this.timeX.realtimenoe = [];
      this.timeX.realtimefive = [];
      this.timeX.daysnoe = [];
      this.timeX.daysfive = [];
      this.timeX.daysnoeh = [];
      this.timeX.daysnoed = [];
      this.timeX.weeksnoeh = [];
      this.timeX.weeksnoed = [];
    },
    // 时间选择
    TimeChoice(time) {
      this.clsddTime = time;
      this.Initialization();
      this.Reset();
      this.GettimeX();
      this.value = '10';
      if (time === 1) {
        this.value = '10';
        this.options = [
          { value: '10', label: '10秒' },
          { value: '60', label: '1分钟' },
          { value: '300', label: '5分钟' },
        ];
        const Time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const startTime = new Date(Time).getTime();
        // 1小时前
        const noehoursago = moment(startTime - 3600000).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        this.Start_End.StartTIme = noehoursago;
        this.Start_End.EndTIme = Time;
      } else if (time === 1 * 24) {
        this.value = '60';
        this.options = [
          { value: '60', label: '1分钟' },
          { value: '300', label: '5分钟' },
          { value: '3600', label: '1小时' },
          { value: '86400', label: '1天' },
        ];
        const Time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const startTime = new Date(Time).getTime();
        // 1小时前
        const noehoursago = moment(startTime - 86400000).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        this.Start_End.StartTIme = noehoursago;
        this.Start_End.EndTIme = Time;
      } else if (time === 1 * 24 * 7) {
        this.value = '3600';
        this.options = [
          { value: '3600', label: '1小时' },
          { value: '86400', label: '1天' },
        ];
        const Time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const startTime = new Date(Time).getTime();
        // 1小时前
        const noehoursago = moment(startTime - 604800000).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        this.Start_End.StartTIme = noehoursago;
        this.Start_End.EndTIme = Time;
      }
      this.XTimeX();
      this.$emit('qiehuan', [this.value, this.XtimeX, this.Start_End, time]);
    },
    // 处理至选择默认时间(少1个小时)
    uptime() {
      const time = new Date();
      const uptime = Number(moment(time).format('HH')) - 1;
      // YYYY-MM-DD HH:mm:ss
      this.timevalueStart = new Date(
        moment(time).format('YYYY'),
        moment(time).format('MM'),
        moment(time).format('DD'),
        uptime,
        moment(time).format('mm'),
        moment(time).format('ss'),
      );

      const Time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const startTime = new Date(Time).getTime();
      // 1小时前
      const noehoursago = moment(startTime - 3600000).format(
        'YYYY-MM-DD HH:mm:ss',
      );
      this.Start_End.StartTIme = noehoursago;
      this.Start_End.EndTIme = Time;
    },
    // 生成X轴
    GettimeX() {
      this.gethourone();
      this.gethourtian();
      this.getweek();
    },
    // 截取时间
    getdate() {
      this.datetim = false;
      this.datetime = true;
      const y = moment(this.datevalueStart).format('YYYY');
      const m = moment(this.datevalueStart).format('MM');
      const d = moment(this.datevalueStart).format('DD');
      const h = moment(this.timevalueStart).format('HH');
      const f = moment(this.timevalueStart).format('mm');
      const s = moment(this.timevalueStart).format('ss');

      const yy = moment(this.datevalueEnd).format('YYYY');
      const mm = moment(this.datevalueEnd).format('MM');
      const dd = moment(this.datevalueEnd).format('DD');
      const hh = moment(this.timevalueEnd).format('HH');
      const ff = moment(this.timevalueEnd).format('mm');
      const ss = moment(this.timevalueEnd).format('ss');
      this.datetimeval = [
        new Date(y, m, d, h, f, s),
        new Date(yy, mm, dd, hh, ff, ss),
      ];
    },

    // 确定按钮
    Sure() {
      this.visible = false;
      this.getdate();
      this.TimeAfter();
    },
    // 确定之后
    TimeAfter() {
      const qdate = moment(this.datetimeval[0]).format('YYYY/MM/DD-HH:mm:ss');
      const hdate = moment(this.datetimeval[1]).format('YYYY/MM/DD-HH:mm:ss');
      const startTime = new Date(qdate).getTime() / 1000;
      const endTime = new Date(hdate).getTime() / 1000;
      this.Reset();
      if (endTime - startTime <= 3600) {
        this.TimeSlot = '1hours';
        this.classvalue = '';
        this.value = '10';
        this.classvalue = 1;
        this.GetTimeBX();
        this.options = [
          { value: '10', label: '10秒' },
          { value: '60', label: '1分钟' },
          { value: '300', label: '5分钟' },
        ];
      } else if (endTime - startTime <= 86400) {
        this.TimeSlot = '1days';
        this.classvalue = '';
        this.value = '60';
        this.classvalue = 1 * 24;
        this.GetTimeBXX();
        this.options = [
          { value: '60', label: '1分钟' },
          { value: '300', label: '5分钟' },
          { value: '3600', label: '1小时' },
          { value: '86400', label: '1天' },
        ];
      } else {
        this.TimeSlot = '1weeks';
        this.classvalue = '';
        this.classvalue = 1 * 24 * 7;
        this.value = '3600';
        this.GetTimeBXXX();
        this.options = [
          { value: '3600', label: '1小时' },
          { value: '86400', label: '一天' },
        ];
      }

      this.Start_End.StartTIme = moment(this.datetimeval[0]).format(
        'YYYY-MM-DD HH:mm:ss',
      );
      this.Start_End.EndTIme = moment(this.datetimeval[1]).format(
        'YYYY-MM-DD HH:mm:ss',
      );

      if (this.datetime === true) {
        if (this.TimeSlot === '1hours' && this.value === '10') {
          this.XtimeX = this.timeX.realtimemiao;
        } else if (this.TimeSlot === '1hours' && this.value === '60') {
          this.XtimeX = this.timeX.realtimenoe;
        } else if (this.TimeSlot === '1hours' && this.value === '300') {
          this.XtimeX = this.timeX.realtimefive;
        } else if (this.TimeSlot === '1days' && this.value === '60') {
          this.XtimeX = this.timeX.daysnoe;
        } else if (this.TimeSlot === '1days' && this.value === '300') {
          this.XtimeX = this.timeX.daysfive;
        } else if (this.TimeSlot === '1days' && this.value === '3600') {
          this.XtimeX = this.timeX.daysnoeh;
        } else if (this.TimeSlot === '1days' && this.value === '86400') {
          this.XtimeX = this.timeX.daysnoed;
        } else if (this.TimeSlot === '1weeks' && this.value === '3600') {
          this.XtimeX = this.timeX.weeksnoeh;
        } else if (this.TimeSlot === '1weeks' && this.value === '86400') {
          this.XtimeX = this.timeX.weeksnoed;
        }
        this.$emit('qiehuan', [this.value, this.XtimeX, this.Start_End]);
      }
    },
    // 按钮控制时间粒度初始化
    Initialization() {
      this.value = '';
      this.datetim = true;
      this.datetime = false;
    },
    qiehuan(value) {
      this.XTimeX();
      this.Reset();
      this.GettimeX();
      this.value = value;
      if (this.datetime === true) {
        this.Reset();
        this.GetTimeBX()
        this.GetTimeBXX()
        this.GetTimeBXXX()
        if (this.TimeSlot === 1 && this.value === '10') {
          this.XtimeX = this.timeX.realtimemiao;
        } else if (this.TimeSlot === '1hours' && this.value === '60') {
          this.XtimeX = this.timeX.realtimenoe;
        } else if (this.TimeSlot === '1hours' && this.value === '300') {
          this.XtimeX = this.timeX.realtimefive;
        } else if (this.TimeSlot === '1days' && this.value === '60') {
          this.XtimeX = this.timeX.daysnoe;
        } else if (this.TimeSlot === '1days' && this.value === '300') {
          this.XtimeX = this.timeX.daysfive;
        } else if (this.TimeSlot === '1days' && this.value === '3600') {
          this.XtimeX = this.timeX.daysnoeh;
        } else if (this.TimeSlot === '1days' && this.value === '86400') {
          this.XtimeX = this.timeX.daysnoed;
        } else if (this.TimeSlot === '1weeks' && this.value === '3600') {
          this.XtimeX = this.timeX.weeksnoeh;
        } else if (this.TimeSlot === '1weeks' && this.value === '86400') {
          this.XtimeX = this.timeX.weeksnoed;
        }
        this.$emit('qiehuan', [this.value, this.XtimeX, this.Start_End]);
      } else {
        this.$emit('qiehuan', [
          this.value,
          this.XtimeX,
          this.Start_End,
          this.clsddTime,
        ]);
      }
    },
    // 选择时间
    SelectionTime() {
      this.visible = true;
      this.TimeAfter();
    },

    // 时间重新选择---确定
    ReSelection() {
      this.value = '';
      this.TimeAfter();
    },

    // 1小时(生成x轴)
    gethourone() {
      const time = moment();
      const nian = moment(time).format('YYYY');
      const yue = moment(time).format('MM');
      const ri = moment(time).format('DD');
      const shi = moment(time).format('HH');
      let fen = moment(time).format('mm');
      let miao = moment(time).format('ss');

      // ----------------------------------------------1小时粒度10秒-------------------------------------------------------------
      // 把秒提取出来，分别得到十位和个位
      let miaoge = parseInt(miao % 10);
      const miaoshi = parseInt((miao % 100) / 10);
      // ，如果个位不为0，则变为0
      if (miaoge !== 0) {
        miaoge = 0;
        miao = `${miaoshi}${miaoge}`;
      }
      // 生成秒的个位为0的新时间
      const NowTimeMiao = moment(
        new Date(nian, Number(yue) - 1, ri, shi, fen, miao),
      ).format('YYYY-MM-DD HH:mm:ss');
      const NowTimeM = new Date(NowTimeMiao).getTime(); // 当前时间的时间戳
      const StartM = NowTimeM - 3600000; // 1个小时前的时间戳
      // 1小时10秒  realtimemiao
      for (let i = StartM; i < NowTimeM; i += 10000) {
        this.timeX.realtimemiao.push(
          moment(new Date(i)).format('YYYY-MM-DD HH:mm:ss'),
        );
      }
      // ----------------------------------------------1小时粒度10秒-------------------------------------------------------------

      // ----------------------------------------------1小时粒度1分钟-------------------------------------------------------------
      // 生成秒为0的新时间
      const NowTimeFen = moment(
        new Date(nian, Number(yue) - 1, ri, shi, fen, 0),
      ).format('YYYY-MM-DD HH:mm:ss');
      const NowTimeF = new Date(NowTimeFen).getTime(); // 当前时间的时间戳
      const StartF = NowTimeF - 3600000; // 1个小时前的时间戳
      // 1小时1分  realtimenoe
      for (let i = StartF; i < NowTimeF; i += 60000) {
        this.timeX.realtimenoe.push(
          moment(new Date(i)).format('YYYY-MM-DD HH:mm:ss'),
        );
      }
      // ----------------------------------------------1小时粒度1分钟-------------------------------------------------------------
      // ----------------------------------------------1小时粒度5分钟-------------------------------------------------------------
      // 1小时5分  realtimefive
      // 把分提取出来，分别得到十位和个位
      let fenge = parseInt(fen % 10);
      const fenshi = parseInt((fen % 100) / 10);
      // 如果分钟的个位<5，则分钟的个位为0，如果>5，则分钟的个位为5
      if (fenge < 5) {
        fenge = 0;
        fen = `${fenshi}${fenge}`;
      } else {
        fenge = 5;
        fen = `${fenshi}${fenge}`;
      }

      // 生成秒的个位为0的新时间
      const NowTimeFenF = moment(
        new Date(nian, Number(yue) - 1, ri, shi, fen, 0),
      ).format('YYYY-MM-DD HH:mm:ss');

      const NowTimeFF = new Date(NowTimeFenF).getTime(); // 当前时间的时间戳
      const StartMFF = NowTimeFF - 3600000; // 1个小时前的时间戳

      for (let i = StartMFF; i < NowTimeFF; i += 300000) {
        this.timeX.realtimefive.push(
          moment(new Date(i)).format('YYYY-MM-DD HH:mm:ss'),
        );
      }
      // ----------------------------------------------1小时粒度5分钟-------------------------------------------------------------
    },
    // 近24小时(生成x轴)
    gethourtian() {
      const time = moment();
      const nian = moment(time).format('YYYY');
      const yue = moment(time).format('MM');
      const ri = moment(time).format('DD');
      const shi = moment(time).format('HH');
      let fen = moment(time).format('mm');
      // ----------------------------------------------1天粒度1分钟-------------------------------------------------------------
      // 生成秒为0的新时间
      const NowTimeFen = moment(
        new Date(nian, Number(yue) - 1, ri, shi, fen, 0),
      ).format('YYYY-MM-DD HH:mm:ss');
      const NowTimeF = new Date(NowTimeFen).getTime(); // 当前时间的时间戳
      const StartF = NowTimeF - 86400000; // 1天前的时间戳
      // 1天1分  daysnoe
      for (let i = StartF; i < NowTimeF; i += 60000) {
        this.timeX.daysnoe.push(
          moment(new Date(i)).format('YYYY-MM-DD HH:mm:ss'),
        );
      }
      // ----------------------------------------------1天粒度1分钟-------------------------------------------------------------

      // ----------------------------------------------1天粒度5分钟-------------------------------------------------------------
      // 1小时5分  daysfive
      // 把分提取出来，分别得到十位和个位
      let fenge = parseInt(fen % 10);
      const fenshi = parseInt((fen % 100) / 10);
      // 如果分钟的个位<5，则分钟的个位为0，如果>5，则分钟的个位为5
      if (fenge < 5) {
        fenge = 0;
        fen = `${fenshi}${fenge}`;
      } else {
        fenge = 5;
        fen = `${fenshi}${fenge}`;
      }

      // 生成秒的个位为0的新时间
      const NowTimeFenF = moment(
        new Date(nian, Number(yue) - 1, ri, shi, fen, 0),
      ).format('YYYY-MM-DD HH:mm:ss');

      const NowTimeFF = new Date(NowTimeFenF).getTime(); // 当前时间的时间戳
      const StartMFF = NowTimeFF - 86400000; // 1天前的时间戳

      for (let i = StartMFF; i < NowTimeFF; i += 300000) {
        this.timeX.daysfive.push(
          moment(new Date(i)).format('YYYY-MM-DD HH:mm:ss'),
        );
      }
      // ----------------------------------------------1天粒度5分钟-------------------------------------------------------------

      // ----------------------------------------------1天粒度1小时-------------------------------------------------------------
      // 生成秒为0的新时间
      const NowTimeHOUR = moment(
        new Date(nian, Number(yue) - 1, ri, shi, 0, 0),
      ).format('YYYY-MM-DD HH:mm:ss');
      const NowTimeH = new Date(NowTimeHOUR).getTime(); // 当前时间的时间戳
      const StartH = NowTimeH - 86400000; // 1天前的时间戳
      // 1天1小时  daysnoeh
      for (let i = StartH; i < NowTimeH; i += 3600000) {
        this.timeX.daysnoeh.push(
          moment(new Date(i)).format('YYYY-MM-DD HH:mm:ss'),
        );
      }
      // ----------------------------------------------1天粒度1小时-------------------------------------------------------------
      // ----------------------------------------------1天粒度1天-------------------------------------------------------------
      // 生成秒为0的新时间
      const NowTimeDays = moment(new Date(nian, Number(yue) - 1, ri)).format(
        'YYYY-MM-DD HH:mm:ss',
      );
      const NowTimeD = new Date(NowTimeDays).getTime(); // 当前时间的时间戳
      const StartD = NowTimeD - 86400000; // 1天前的时间戳
      // 1天  daysnoed
      for (let i = StartD; i < NowTimeD; i += 86400000) {
        this.timeX.daysnoed.push(
          moment(new Date(i)).format('YYYY-MM-DD HH:mm:ss'),
        );
      }
      // ----------------------------------------------1天粒度1天-------------------------------------------------------------
    },
    // 近7天(生成x轴)
    getweek() {
      const time = moment();
      const nian = moment(time).format('YYYY');
      const yue = moment(time).format('MM');
      const ri = moment(time).format('DD');
      const shi = moment(time).format('HH');
      // ----------------------------------------------7天粒度1小时-------------------------------------------------------------

      const NowTimeZHOU = moment(
        new Date(nian, Number(yue) - 1, ri, shi, 0, 0),
      ).format('YYYY-MM-DD HH:mm:ss');
      const NowTimeZ = new Date(NowTimeZHOU).getTime(); // 当前时间的时间戳
      const StartZ = NowTimeZ - 604800000; // 1周前的时间戳
      // 7天1小时  weeksnoeh
      for (let i = StartZ; i < NowTimeZ; i += 3600000) {
        this.timeX.weeksnoeh.push(
          moment(new Date(i)).format('YYYY-MM-DD HH:mm:ss'),
        );
      }
      // ----------------------------------------------7天粒度1小时-------------------------------------------------------------

      // ----------------------------------------------7天粒度1天-------------------------------------------------------------
      const NowTimeZHOUt = moment(
        new Date(nian, Number(yue) - 1, ri, 0, 0, 0),
      ).format('YYYY-MM-DD HH:mm:ss');
      const NowTimeZd = new Date(NowTimeZHOUt).getTime(); // 当前时间的时间戳
      const StartZd = NowTimeZd - 604800000; // 1周前的时间戳
      // 7天1天  weeksnoed
      for (let i = StartZd; i < NowTimeZd; i += 86400000) {
        this.timeX.weeksnoed.push(
          moment(new Date(i)).format('YYYY-MM-DD HH:mm:ss'),
        );
      }
      // ----------------------------------------------7天粒度1天-------------------------------------------------------------
    },

    // 选择时间之后生成X轴
    // 1小时之内
    GetTimeBX() {
      const time = moment(this.datetimeval[1]);
      const nian = moment(time).format('YYYY');
      const yue = moment(time).format('MM');
      const ri = moment(time).format('DD');
      const shi = moment(time).format('HH');
      let fen = moment(time).format('mm');
      let miao = moment(time).format('ss');

      //= =======================================================================
      const timex = moment(this.datetimeval[0]);
      const nianx = moment(timex).format('YYYY');
      const yuex = moment(timex).format('MM');
      const rix = moment(timex).format('DD');
      const shix = moment(timex).format('HH');
      let fenx = moment(timex).format('mm');
      let miaox = moment(timex).format('ss');

      // ----------------------------------------------1小时粒度10秒-------------------------------------------------------------
      // 把秒提取出来，分别得到十位和个位
      let miaoge = parseInt(miao % 10);
      const miaoshi = parseInt((miao % 100) / 10);
      // ，如果个位不为0，则变为0
      if (miaoge !== 0) {
        miaoge = 0;
        miao = `${miaoshi}${miaoge}`;
      }

      let miaogex = parseInt(miaox % 10);
      const miaoshix = parseInt((miaox % 100) / 10);
      // ，如果个位不为0，则变为0
      if (miaogex !== 0) {
        miaogex = 0;
        miaox = `${miaoshix}${miaogex}`;
      }
      // 生成秒的个位为0的新时间
      const NowTimeMiao = moment(
        new Date(nian, Number(yue) - 1, ri, shi, fen, miao),
      ).format('YYYY-MM-DD HH:mm:ss');

      const StartTimeMiao = moment(
        new Date(nianx, Number(yuex) - 1, rix, shix, fenx, miaox),
      ).format('YYYY-MM-DD HH:mm:ss');
      const NowTimeM = new Date(NowTimeMiao).getTime(); // 当前时间的时间戳
      const StartM = new Date(StartTimeMiao).getTime(); // 1个小时前的时间戳
      // 1小时10秒  realtimemiao
      for (let i = StartM; i < NowTimeM; i += 10000) {
        this.timeX.realtimemiao.push(
          moment(new Date(i)).format('YYYY-MM-DD HH:mm:ss'),
        );
      }

      // ----------------------------------------------1小时粒度10秒-------------------------------------------------------------

      // ----------------------------------------------1小时粒度1分钟-------------------------------------------------------------
      // 生成秒为0的新时间
      const NowTimeFen = moment(
        new Date(nian, Number(yue) - 1, ri, shi, fen, 0),
      ).format('YYYY-MM-DD HH:mm:ss');
      const StartTimeFen = moment(
        new Date(nianx, Number(yuex) - 1, rix, shix, fenx, 0),
      ).format('YYYY-MM-DD HH:mm:ss');
      const NowTimeF = new Date(NowTimeFen).getTime(); // 当前时间的时间戳
      const StartF = new Date(StartTimeFen).getTime(); // 1个小时前的时间戳
      // 1小时1分  realtimenoe
      for (let i = StartF; i < NowTimeF; i += 60000) {
        this.timeX.realtimenoe.push(
          moment(new Date(i)).format('YYYY-MM-DD HH:mm:ss'),
        );
      }
      // ----------------------------------------------1小时粒度1分钟-------------------------------------------------------------
      // ----------------------------------------------1小时粒度5分钟-------------------------------------------------------------
      // 1小时5分  realtimefive
      // 把分提取出来，分别得到十位和个位
      let fenge = parseInt(fen % 10);
      const fenshi = parseInt((fen % 100) / 10);
      // 如果分钟的个位<5，则分钟的个位为0，如果>5，则分钟的个位为5
      if (fenge < 5) {
        fenge = 0;
        fen = `${fenshi}${fenge}`;
      } else {
        fenge = 5;
        fen = `${fenshi}${fenge}`;
      }

      let fengex = parseInt(fenx % 10);
      const fenshix = parseInt((fenx % 100) / 10);
      // 如果分钟的个位<5，则分钟的个位为0，如果>5，则分钟的个位为5
      if (fengex < 5) {
        fengex = 0;
        fenx = `${fenshix}${fengex}`;
      } else {
        fengex = 5;
        fenx = `${fenshix}${fengex}`;
      }

      // 生成秒的个位为0的新时间
      const NowTimeFenF = moment(
        new Date(nian, Number(yue) - 1, ri, shi, fen, 0),
      ).format('YYYY-MM-DD HH:mm:ss');
      const StartTimeFenF = moment(
        new Date(nianx, Number(yuex) - 1, rix, shix, fenx, 0),
      ).format('YYYY-MM-DD HH:mm:ss');

      const NowTimeFF = new Date(NowTimeFenF).getTime(); // 当前时间的时间戳
      const StartMFF = new Date(StartTimeFenF).getTime(); // 1个小时前的时间戳

      for (let i = StartMFF; i < NowTimeFF; i += 300000) {
        this.timeX.realtimefive.push(
          moment(new Date(i)).format('YYYY-MM-DD HH:mm:ss'),
        );
      }
      // ----------------------------------------------1小时粒度5分钟-------------------------------------------------------------
    },
    // 1天之内
    GetTimeBXX() {
      const time = moment(this.datetimeval[1]);
      const nian = moment(time).format('YYYY');
      const yue = moment(time).format('MM');
      const ri = moment(time).format('DD');
      const shi = moment(time).format('HH');
      let fen = moment(time).format('mm');

      //= =======================================================================
      const timex = moment(this.datetimeval[0]);
      const nianx = moment(timex).format('YYYY');
      const yuex = moment(timex).format('MM');
      const rix = moment(timex).format('DD');
      const shix = moment(timex).format('HH');
      let fenx = moment(timex).format('mm');

      // ----------------------------------------------1天粒度1分钟-------------------------------------------------------------
      // 生成秒为0的新时间
      const NowTimeFen = moment(
        new Date(nian, Number(yue) - 1, ri, shi, fen, 0),
      ).format('YYYY-MM-DD HH:mm:ss');
      const StartTimeFen = moment(
        new Date(nianx, Number(yuex) - 1, rix, shix, fenx, 0),
      ).format('YYYY-MM-DD HH:mm:ss');
      const NowTimeF = new Date(NowTimeFen).getTime(); // 当前时间的时间戳
      const StartF = new Date(StartTimeFen).getTime(); // 1天前的时间戳
      // 1天1分  daysnoe
      for (let i = StartF; i < NowTimeF; i += 60000) {
        this.timeX.daysnoe.push(
          moment(new Date(i)).format('YYYY-MM-DD HH:mm:ss'),
        );
      }
      // ----------------------------------------------1天粒度1分钟-------------------------------------------------------------

      // ----------------------------------------------1天粒度5分钟-------------------------------------------------------------
      // 1小时5分  daysfive
      // 把分提取出来，分别得到十位和个位
      let fenge = parseInt(fen % 10);
      const fenshi = parseInt((fen % 100) / 10);
      // 如果分钟的个位<5，则分钟的个位为0，如果>5，则分钟的个位为5
      if (fenge < 5) {
        fenge = 0;
        fen = `${fenshi}${fenge}`;
      } else {
        fenge = 5;
        fen = `${fenshi}${fenge}`;
      }

      let fengex = parseInt(fenx % 10);
      const fenshix = parseInt((fenx % 100) / 10);
      // 如果分钟的个位<5，则分钟的个位为0，如果>5，则分钟的个位为5
      if (fengex < 5) {
        fengex = 0;
        fenx = `${fenshix}${fengex}`;
      } else {
        fengex = 5;
        fenx = `${fenshix}${fengex}`;
      }

      // 生成秒的个位为0的新时间
      const NowTimeFenF = moment(
        new Date(nian, Number(yue) - 1, ri, shi, fen, 0),
      ).format('YYYY-MM-DD HH:mm:ss');
      const StartTimeFenF = moment(
        new Date(nianx, Number(yuex) - 1, rix, shix, fenx, 0),
      ).format('YYYY-MM-DD HH:mm:ss');

      const NowTimeFF = new Date(NowTimeFenF).getTime(); // 当前时间的时间戳
      const StartMFF = new Date(StartTimeFenF).getTime(); // 1天前的时间戳

      for (let i = StartMFF; i < NowTimeFF; i += 300000) {
        this.timeX.daysfive.push(
          moment(new Date(i)).format('YYYY-MM-DD HH:mm:ss'),
        );
      }
      // ----------------------------------------------1天粒度5分钟-------------------------------------------------------------

      // ----------------------------------------------1天粒度1小时-------------------------------------------------------------
      // 生成秒为0的新时间
      const NowTimeHOUR = moment(
        new Date(nian, Number(yue) - 1, ri, shi, 0, 0),
      ).format('YYYY-MM-DD HH:mm:ss');
      const StartTimeHOUR = moment(
        new Date(nianx, Number(yuex) - 1, rix, shix, 0, 0),
      ).format('YYYY-MM-DD HH:mm:ss');
      const NowTimeH = new Date(NowTimeHOUR).getTime(); // 当前时间的时间戳
      const StartH = new Date(StartTimeHOUR).getTime(); // 1天前的时间戳
      // 1天1小时  daysnoeh
      for (let i = StartH; i < NowTimeH; i += 3600000) {
        this.timeX.daysnoeh.push(
          moment(new Date(i)).format('YYYY-MM-DD HH:mm:ss'),
        );
      }
      // ----------------------------------------------1天粒度1小时-------------------------------------------------------------
      // ----------------------------------------------1天粒度1天-------------------------------------------------------------
      // 生成秒为0的新时间
      const NowTimeDays = moment(new Date(nian, Number(yue) - 1, ri)).format(
        'YYYY-MM-DD HH:mm:ss',
      );
      const StartTimeDays = moment(
        new Date(nianx, Number(yuex) - 1, rix),
      ).format('YYYY-MM-DD HH:mm:ss');
      const NowTimeD = new Date(NowTimeDays).getTime(); // 当前时间的时间戳
      const StartD = new Date(StartTimeDays).getTime(); // 1天前的时间戳
      // 1天  daysnoed
      for (let i = StartD; i < NowTimeD; i += 86400000) {
        this.timeX.daysnoed.push(
          moment(new Date(i)).format('YYYY-MM-DD HH:mm:ss'),
        );
      }
      // ----------------------------------------------1天粒度1天-------------------------------------------------------------
    },
    // 1周或者大于1周
    GetTimeBXXX() {
      const time = moment(this.datetimeval[1]);
      const nian = moment(time).format('YYYY');
      const yue = moment(time).format('MM');
      const ri = moment(time).format('DD');
      const shi = moment(time).format('HH');

      //= =======================================================================
      const timex = moment(this.datetimeval[0]);
      const nianx = moment(timex).format('YYYY');
      const yuex = moment(timex).format('MM');
      const rix = moment(timex).format('DD');
      const shix = moment(timex).format('HH');

      // ----------------------------------------------7天粒度1小时-------------------------------------------------------------

      const NowTimeZHOU = moment(
        new Date(nian, Number(yue) - 1, ri, shi, 0, 0),
      ).format('YYYY-MM-DD HH:mm:ss');
      const StartTimeZHOU = moment(
        new Date(nianx, Number(yuex) - 1, rix, shix, 0, 0),
      ).format('YYYY-MM-DD HH:mm:ss');
      const NowTimeZ = new Date(NowTimeZHOU).getTime(); // 当前时间的时间戳
      const StartZ = new Date(StartTimeZHOU).getTime(); // 1周前的时间戳
      // 7天1小时  weeksnoeh
      for (let i = StartZ; i < NowTimeZ; i += 3600000) {
        this.timeX.weeksnoeh.push(
          moment(new Date(i)).format('YYYY-MM-DD HH:mm:ss'),
        );
      }
      // ----------------------------------------------7天粒度1小时-------------------------------------------------------------

      // ----------------------------------------------7天粒度1天-------------------------------------------------------------
      const NowTimeZHOUt = moment(
        new Date(nian, Number(yue) - 1, ri, 0, 0, 0),
      ).format('YYYY-MM-DD HH:mm:ss');
      const StartTimeZHOUt = moment(
        new Date(nianx, Number(yuex) - 1, rix, 0, 0, 0),
      ).format('YYYY-MM-DD HH:mm:ss');
      const NowTimeZd = new Date(NowTimeZHOUt).getTime(); // 当前时间的时间戳
      const StartZd = new Date(StartTimeZHOUt).getTime(); // 1周前的时间戳
      // 7天1天  weeksnoed
      for (let i = StartZd; i < NowTimeZd; i += 86400000) {
        this.timeX.weeksnoed.push(
          moment(new Date(i)).format('YYYY-MM-DD HH:mm:ss'),
        );
      }
      // ----------------------------------------------7天粒度1天-------------------------------------------------------------
    },
    // 获取对应X轴数据
    XTimeX() {
      if (this.clsddTime === 1 && this.value === '10') {
        this.XtimeX = this.timeX.realtimemiao;
      } else if (this.clsddTime === 1 && this.value === '60') {
        this.XtimeX = this.timeX.realtimenoe;
      } else if (this.clsddTime === 1 && this.value === '300') {
        this.XtimeX = this.timeX.realtimefive;
      } else if (this.clsddTime === 1 * 24 && this.value === '60') {
        this.XtimeX = this.timeX.daysnoe;
      } else if (this.clsddTime === 1 * 24 && this.value === '300') {
        this.XtimeX = this.timeX.daysfive;
      } else if (this.clsddTime === 1 * 24 && this.value === '3600') {
        this.XtimeX = this.timeX.daysnoeh;
      } else if (this.clsddTime === 1 * 24 && this.value === '86400') {
        this.XtimeX = this.timeX.daysnoed;
      } else if (this.clsddTime === 1 * 24 * 7 && this.value === '3600') {
        this.XtimeX = this.timeX.weeksnoeh;
      } else if (this.clsddTime === 1 * 24 * 7 && this.value === '86400') {
        this.XtimeX = this.timeX.weeksnoed;
      }
    },
  },
};
</script>

<style  scoped lang="scss">

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
      /deep/.el-input {
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

/deep/.i-font {
  font-size: 36px;
}
/deep/.el-button--small {
  font-size: 14px !important;
}
.bgImgSet {
  background: blue;
}
.LocaP{
  padding-right: 20px;
}
</style>
