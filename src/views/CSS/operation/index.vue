<template>
  <div class="operation-wrap">
    <Header title="運營數據" />
    <div class="explain">
      <p>
        您可以在雲監控中設置告警，配置流量/帶寬等參數超過設定值時通過簡訊/郵件/站內信等通知您。
        <a href="#">設置告警</a>
      </p>
    </div>
    <el-row class="topSelect">
      <el-button-group>
        <el-button @click="checkTime(1)" :class="selBtn=='1'?'addStyleBtn':''">今天</el-button>
        <el-button @click="checkTime(2)" :class="selBtn=='2'?'addStyleBtn':''">昨天</el-button>
        <el-button @click="checkTime(3)" :class="selBtn=='3'?'addStyleBtn':''">近7天</el-button>
        <el-button @click="checkTime(4)" :class="selBtn=='4'?'addStyleBtn':''">近30天</el-button>
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
        :picker-options="pickerOptions"
        :clearable= false
      ></el-date-picker>
      <p style="margin-left:20px;">
        <span>{{$t('CSS.builder.20')}}</span>
        <el-dropdown
          :hide-on-click="false"
          trigger="click"
          ref="doaminRef"
          style="margin-left: 20px"
        >
          <el-button type="primary" size="small">
            {{domainCheckedListCopy.length === domainsData.length ? '全部域名' : domainCheckedListCopy.join()}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <label class="domain-label">
                <el-checkbox
                  :value="domainCheckedList.length === domainsData.length"
                  @change="checkDomainAll"
                />
                全部域名
              </label>
            </el-dropdown-item>
            <el-dropdown-item
              v-for="item in domainsData"
              :key="item"
            >
              <label class="domain-label">
                <el-checkbox
                  @change="checked => doaminChange(checked, item)"
                  :value="domainCheckedList.indexOf(item) == -1 ? false : true"
                />
                {{item}}
              </label>
            </el-dropdown-item>
            <el-row class="doamin-btn-container">
              <el-button
                size="small"
                type="primary"
                @click="comfirmDomain"
              >
                {{$t('CSS.overview.12')}}
              </el-button>
              <el-button size="small" @click="cancelDomain">取消</el-button>
            </el-row>
          </el-dropdown-menu>
        </el-dropdown>
      </p>
      <el-button type="primary" style="margin-left:20px;">{{region}}</el-button>
      <el-button style="margin-left:20px;" type="primary" @click="search">{{$t('CSS.cutout.1')}}</el-button>
    </el-row>
    <div class="operation-main">
      <div class="tab-box">
        <dl
          v-for="(item,index) in tab"
          :key="index"
          :class="tabIndex == index ? 'active' : ''"
          @click="tabClick(index)"
        >
          <dt>
            {{item.name}}
            <el-tooltip placement="top" effect="light" class="mode-tooltip" v-if="item.name=='併發連接數峰值'">
              <i class="el-icon-info"></i>
              <span slot="content">
                若播放協議為RTMP和FLV，並發連接數即在線人數；<br/>
                若播放協議為HLS，此數據不可作為在線人數的參考
              </span>
            </el-tooltip>
          </dt>
          <dd>
            {{item.value}}
            <span style="font-size:16px;color:black;">{{item.code}}</span>
          </dd>
        </dl>
      </div>
      <div class="main">
        <Tab1
          :StartTIme="StartTIme"
          :EndTIme="EndTIme"
          v-if="tabIndex == 0"
          :domainsData="domainsData"
          :domainCheckedListCopy="domainCheckedListCopy"
          ref="tab1"
        />
        <Tab2
          :StartTIme="StartTIme"
          :EndTIme="EndTIme"
          v-if="tabIndex == 1"
          :domainsData="domainsData"
          :domainCheckedListCopy="domainCheckedListCopy"
          ref="tab2"
        />
        <Tab3
          :StartTIme="StartTIme"
          :EndTIme="EndTIme"
          v-if="tabIndex == 2"
          :domainsData="domainsData"
          :domainCheckedListCopy="domainCheckedListCopy"
          ref="tab3"
        />
        <Tab4
          :StartTIme="StartTIme"
          :EndTIme="EndTIme"
          v-if="tabIndex == 3"
          :domainsData="domainsData"
          :domainCheckedListCopy="domainCheckedListCopy"
          ref="tab4"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Header from '@/components/public/Head'
import { ALL_CITY, DOMAIN_LIST, CSS_MBPS, DESCRIBE_PLAY_STAT_INFOLIST } from '@/constants'
import Tab1 from './tab/tab1'
import Tab2 from './tab/tab2'
import Tab3 from './tab/tab3'
import Tab4 from './tab/tab4'
export default {
  name: "operation",
  data() {
    let vue = this
    return {
      domainsData: [],
      domainCheckedList: [],
      domainCheckedListCopy: [],
      options: [
        {
          value: '',
          label: '全部運營商'
        },
        {
          value: 'China Telecom',
          label: '中國電信'
        },
        {
          value: 'China Unicom',
          label: '中國聯通'
        },
        {
          value: 'China Mobile',
          label: '中國移動'
        }
      ],
      domain: [],
      value: 1, // 时间组件默认选中值
      region: '台灣台北', // 地域
      tabIndex: 0, // tab默认选中值
      // tab内容
      tab: [
        {
          name: '帶寬峰值',
          code: 'Mbps',
          value: 0
        },
        {
          name: '總流量',
          code: 'MB',
          value: 0
        },
        {
          name: '總請求數',
          code: '次',
          value: 0
        },
        {
          name: '並發連接數峰值',
          code: '次',
          value: 0
        }
      ],
      StartTIme: moment(new Date()).format('YYYY-MM-DD 00:00:00'),
      EndTIme: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      dateTimeValue: [moment().startOf('day'), moment()], // 日期绑定
      selBtn: 1, // 默认选中今天按钮
      pickerOptions: {
        disabledDate(time) {
          let timeOptionRange = vue.timeOptionRange;
          if(timeOptionRange){
            return moment(timeOptionRange).diff(time, 'days') > 30
            || moment(time).diff(timeOptionRange, 'days') > 30
            || time > moment()
            || time < moment().startOf('years')
          }
          return time > moment() || time < moment().startOf('years')
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
    }
  },
  components: {
    Header,
    Tab1,
    Tab2,
    Tab3,
    Tab4
  },
  created () {
    this.getCity()
    this.getDomains()
    this.getTotal()
  },
  watch: {
    tabIndex () {
      this.search()
    }
  },
  methods: {
    doHandleMonth (month) {
      var m = month
      if (month.toString().length == 1) {
        m = '0' + month
      }
      return m
    },
    // 域名列表
    getDomains () {
      const params = {
        Version: '2018-08-01'
      }
      this.axios.post(DOMAIN_LIST, params).then(({ Response: { DomainList } }) => {
        const domainArr = []
        if (Array.isArray(DomainList)) {
          DomainList.forEach(domain => {
            if (domain.Type === 1) {
              domainArr.push(domain.Name)
            }
          })
        }
        this.domainsData = domainArr
        this.domainCheckedList = domainArr
        this.domainCheckedListCopy = domainArr
      })
    },
    // 查询
    search () {
      this.getTotal()
      if (this.tabIndex == 0) {
        this.$nextTick(() => {
          this.$refs.tab1.init()
        })
      } else if (this.tabIndex == 1) {
        this.$nextTick(() => {
          this.$refs.tab2.init()
        })
      } else if (this.tabIndex == 2) {
        this.$nextTick(() => {
          this.$refs.tab3.init()
        })
      } else if (this.tabIndex == 3) {
        this.$nextTick(() => {
          this.$refs.tab4.init()
        })
      }
    },
    // 时间点击事件
    checkTime (val) {
      let times = [moment().startOf('day'), moment()] // 默认今天
      this.selBtn = val
      switch (val) {
        case 2:
          times = [moment().subtract(24, 'hours'), moment().subtract(24, 'hours').endOf('day')]
          break
        case 3:
          times = [moment().subtract(6, 'days'), moment().endOf('day')]
          break
        case 4:
          times = [moment().subtract(29, 'days'), moment().endOf('day')]
          break
        default:
          break
      }
      times[0] = times[0].startOf('day')
      this.$refs.mypicker.userInput = null
      this.dateTimeValue = times
      this.StartTIme = moment(this.dateTimeValue[0]).format('YYYY-MM-DD HH:mm:ss')
      this.EndTIme = moment(this.dateTimeValue[1]).format('YYYY-MM-DD HH:mm:ss')
    },
    changeTimeValue () {
      this.selBtn = 0
      this.StartTIme = moment(this.dateTimeValue[0]).format('YYYY-MM-DD HH:mm:ss')
      this.EndTIme = moment(this.dateTimeValue[1]).format('YYYY-MM-DD HH:mm:ss')
    },
    // 获取城市
    getCity () {
      this.axios.post(ALL_CITY).then(res => {
        this.region = res.data[0].zone
      })
    },
    // tab切换
    tabClick (index) {
      this.tabIndex = index
    },
    getTotal () {
      // 因为默认是台湾所以用接口DESCRIBE_PLAY_STAT_INFOLIST
      const params = {
        Version: '2018-08-01',
        StartTime: moment(this.StartTIme).format('YYYY-MM-DD HH:mm:ss'),
        EndTime: moment(this.EndTIme).format('YYYY-MM-DD HH:mm:ss'),
        Granularity: 60,
        // MainlandOrOversea: "Mainland"
        // 'CountryOrAreaNames.0': 'Taiwan'
      }
      // const params2 = {
      //   Version: "2018-08-01",
      //   StartTime: moment(this.StartTIme).format("YYYY-MM-DD HH:mm:ss"),
      //   EndTime: moment(this.EndTIme).format("YYYY-MM-DD HH:mm:ss"),
      //   Granularity: 60,
      //   MainlandOrOversea: "Mainland"
      //   MainlandOrOversea: "Oversea",
      // };
      if (this.domainCheckedListCopy.length !== this.domainsData.length) {
        this.domainCheckedListCopy.forEach((item, index) => {
          params['PlayDomains.' + index] = item
          // params2['PlayDomains.' + index] = item
        })
      }
      // 不查运营商 看腾讯页面0和1的数据请求CSS_MBPS，2和3的数据请求DESCRIBE_PLAY_STAT_INFOLIST
      // this.axios.post(CSS_MBPS, params2).then(res => {
      //   if (res.Response.Error) {
      //     this.$message.error(res.Response.Error.Message);
      //   } else {
      //     this.tab[0].value = res.Response.PeakBandwidth
      //     this.tab[1].value = res.Response.SumFlux
      //   }
      // });
      this.axios.post(DESCRIBE_PLAY_STAT_INFOLIST, params).then(res => {
        if (res.Response.Error) {
          this.$message.error(res.Response.Error.Message)
        } else {
          this.tab[0].value = res.Response.MaxBandwidth // 带宽峰值
          this.tab[1].value = res.Response.TotalFlux // 总流量
          this.tab[2].value = res.Response.TotalRequest // 总请求数
          this.tab[3].value = res.Response.MaxOnline // 并发连接数
        }
      })
    },
    checkDomainAll (checked) {
      if (checked) {
        this.domainCheckedList = [...this.domainsData]
      } else {
        this.domainCheckedList = []
      }
    },
    doaminChange (checked, domain) {
      if (checked) {
        this.domainCheckedList.push(domain)
      } else {
        this.domainCheckedList = this.domainCheckedList.filter(item => item !== domain)
      }
    },
    comfirmDomain () {
      if (this.domainCheckedList.length === 0) {
        this.$message({
          type: 'warning',
          message: '請選擇域名',
          showClose: true,
          duration: 0
        })
      } else {
        this.$refs.doaminRef.visible = false
        this.domainCheckedListCopy = [...this.domainCheckedList]
      }
    },
    cancelDomain () {
      this.domainCheckedList = [...this.domainCheckedListCopy]
      this.$refs.doaminRef.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.operation-wrap >>> .el-button,
.operation-wrap >>> .el-input__inner,
.operation-wrap >>> .el-range-input {
  height: 30px;
  border-radius: 0;
  line-height: 30px;
  padding-top: 0;
  overflow: hidden;
}
.operation-wrap >>> .el-select__tags span:nth-child(1) {
  display: flex;
}
.operation-wrap >>> .el-select__tags-text {
  max-width: 50px;
  overflow: hidden;
  display: inline-block;
}
.operation-wrap >>> .el-tag {
  display: flex;
  align-items: center;
}
.operation-wrap >>> .el-range-input {
  margin-top: 5px;
}
 ::v-deep .el-input__inner {
  height: 30px !important;
  line-height: 30px !important;
  border-radius: 0;
}
.operation-wrap {
  .seek-box {
    padding: 10px 20px;
    padding-bottom: 0;
    box-sizing: border-box;
    p {
      span {
        font-size: 13px;
        color: #888;
      }
    }
  }
  .explain {
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    padding: 10px 30px 10px 20px;
    margin: 20px 0 0 20px;
    border-radius: 2px;
    p {
      line-height: 18px;

      a {
        color: #006eff;
      }
      a:hover {
        border-bottom: 1px #006eff solid;
      }
    }
  }
  .seek {
    display: flex;
    align-items: center;
  }
  .operation-main {
    margin: 20px;
    padding: 10px 0;
    box-sizing: border-box;
    background: white;

    .main {
      padding: 20px;
      padding-bottom: 0;
      box-sizing: border-box;
    }

    .tab-box {
      display: flex;
      dl {
        flex: 1;
        padding: 0 20px;
        box-sizing: border-box;
        border-right: 1px #ccc solid;

        cursor: pointer;
        dt {
          font-size: 14px;
          font-weight: bold;
          border-top: 2px white solid;
          padding-top: 20px;
          box-sizing: border-box;
        }

        dd {
          font-size: 34px;
          margin-top: 15px;
          padding-bottom: 20px;
          box-sizing: border-box;
        }
      }
      dl:nth-last-child(1) {
        border-right: 0;
      }
      .active {
        color: #006eff;
        dt {
          border-top: 2px #006eff solid;
        }
      }
    }
  }
}
.domain-label {
  display: block;
  cursor: pointer;
}
.doamin-btn-container {
  margin-left: 20px;
}
.el-icon-info {
  color: #888;
}

.topSelect {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  box-sizing: border-box;
    & > * {
      float: left;
    }
    .selectDomin {
      width: 230px;
    }

    ::v-deep {

      flex-wrap: wrap !important;
    }
    ::v-deep .el-button{
      font-size: 12px !important;
    }
    ::v-deep .el-range__icon {
        line-height: 22px;
    }
    ::v-deep .el-range-separator {
      line-height: 22px;
      width: 7%;
    }
    ::v-deep .el-select {
      margin-right: 10px;
    }
    ::v-deep .el-input {
      width: 250px;
    }
    button {
      padding: 0 20px;
    }
    .addStyleBtn {
      background-color: #006eff !important;
      color: #fff;
    }
  }
  button {
    height: 30px;
    line-height: 6px;
    border-radius: 0;
  }
  .timeValue {
    border-left: none;
    width: 380px;
    font-size: 12px !important;
  }
</style>
