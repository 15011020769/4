<template>
  <div>
    <div class="basicinfo">
      <h1 class="newClear">
        播放地址
      </h1>
      <div class="newClear">
        <div class="newClear newList">
          <p>播放地址（RTMP）</p>
          <p>rtmp://{{ $route.query.Name }}/live/StreamName</p>
        </div>
        <div class="newClear newList">
          <p>播放地址（FLV）</p>
          <p>http://{{ $route.query.Name }}/live/StreamName.flv</p>
        </div>
        <div class="newClear newList">
          <p>播放地址（HLS）</p>
          <p>http://{{ $route.query.Name }}/live/StreamName.m3u8</p>
        </div>
        <div class="newClear newList">
          <p>播放地址（UDP）</p>
          <p>webrtc://{{ $route.query.Name }}/live/StreamName.m3u8</p>
        </div>
      </div>
    </div>
    <div class="basicinfo">
      <h1 class="newClear">播放地址生成器</h1>
      <div class="bgGray">
        <div class="newClear newList1">
          <p>{{ $t("CSS.detailPlay.basicMessage") }}</p>
          <p>{{ playAuthKeyInfo.AuthKey }}</p>
        </div>
        <div class="newClear newList1">
          <p>{{ $t("CSS.detailPlay.effectivetime") }}</p>
          <p>{{ playAuthKeyInfo.AuthDelta }}秒</p>
        </div>
        <div class="newClear newList1">
          <p>播放域名</p>
          <p>{{ $route.query.Name }}</p>
        </div>
      </div>
      <div class="dateOut">
        <span class="spanBlod">{{ $t("CSS.detailPlay.timeSetting") }}</span
        >&nbsp;
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('CSS.detailPlay.0')"
          placement="bottom-start"
        >
          <i class="el-icon-info" />
        </el-tooltip>
        <el-date-picker
          class="dataDateTime"
          :clearable="false"
          v-model="dataDateTime"
          type="date"
          :placeholder="$t('CSS.domainManagement.31')"
        ></el-date-picker>
        <el-time-picker
          :clearable="false"
          v-model="dateValue"
          class="dateValue"
        ></el-time-picker>
        <span class="spanBlod">StreamName&nbsp;&nbsp;</span>
        <el-input
          :placeholder="$t('CSS.domainManagement.28')"
          v-model.trim="streamName"
          class="streamName"
        ></el-input>
        <el-button @click="handlePlayCreateUrl">生成播放地址</el-button>
      </div>
      <div class="basicinfo" v-show="playUrls.length">
        <h3 class="newClear" style="margin-bottom: 15px">
          {{ $t("CSS.builder.10")
          }}<span class="sub-text">({{ $t("CSS.detailPlay.1") }})</span>
        </h3>
        <div class="newClear" v-for="(url, index) in playUrls" :key="index">
          <div class="newList">
            <p>{{ url.name }}</p>
            <p>{{ url.value }}</p>
          </div>
          <p class="tip">{{ url.tip }}</p>
        </div>
        <div class="newClear">
          <div class="newClear newList">
            <p>{{ $t("CSS.builder.5") }}</p>
            <p>{{ validTime }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  LIVE_DESCRIBE_LIVEPLAYAUTHKEY
} from '@/constants'
import moment from 'moment'
import md5 from 'js-md5'
export default {
  data () {
    return {
      playAuthKeyInfo: {},
      streamName: '',
      dataDateTime: moment(), // 过期时间月份
      dateValue: moment().endOf('d'), // 时间
      playUrls: [],
      validTime: ''
    }
  },
  mounted () {
    this.getAuthConf()
  },
  methods: {
    getAuthConf () {
      this.axios
        .post(LIVE_DESCRIBE_LIVEPLAYAUTHKEY, {
          Version: '2018-08-01',
          DomainName: this.$route.query.Name
        })
        .then(({ Response: { PlayAuthKeyInfo } }) => {
          this.playAuthKeyInfo = PlayAuthKeyInfo
        })
    },
    handlePlayCreateUrl: function () {
      var b = this
      var c = b.streamName
      if (!c) {
        return void this.$message({
          type: 'warning',
          message: '请输入 StreamName'
        })
      }
      var d = b.dataDateTime.format('YYYY-MM-DD')
      var e = b.dateValue.format('HH:mm:ss')
      d = d.replace(/-/g, '/')
      var h = new Date(d + ' ' + e)
      b.validTime = `${b.dataDateTime.format('YYYY-MM-DD')} ${e}`
      b.generatePlayAddress(b.$route.query.Name, 'live', c, h)
    },
    generatePlayAddress: function (a, b, c, d) {
      var e = this
      var h
      var g = e.playAuthKeyInfo
      if (g.Enable == 1) {
        e.calculatePlayUrlWithAuth(a, b, c, g, d)
      } else {
        e.calculatePlayUrlWithAuth(a, b, c, null, d)
      }
    },
    calculatePlayUrlWithAuth: function (a, b, c, d, e) {
      var g = ''
      if (d) {
        var h = (e.getTime() - 1e3 * d.AuthDelta) / 1e3
        var i = parseInt(h).toString(16).toUpperCase()
        var j = {
          txSecret: md5(d.AuthKey + c + i),
          txTime: i
        }
        g = `?txSecret=${j.txSecret}&txTime=${j.txTime}`
      }
      var k = [{
        name: '播放地址 (RTMP)',
        value: 'rtmp://' + a + '/' + b + '/' + c + g,
        qrcode: !0
        // txTime: n.format(new Date(e.getTime()), "yyyy-MM-dd hh:ii:ss")
      }, {
        name: '播放地址 (FLV)',
        value: 'http://' + a + '/' + b + '/' + c + '.flv' + g,
        qrcode: !0
      }, {
        name: '播放地址 (HLS)',
        value: 'http://' + a + '/' + b + '/' + c + '.m3u8' + g,
        qrcode: !0
      }]
      k.push({
        name: '播放地址 (UDP)',
        tip: '快直播(UDP)流量/带宽费用与标准直播不同',
        value: 'webrtc://' + a + '/' + b + '/' + c + '.m3u8' + g,
        qrcode: !0
      }),
      this.playUrls = k
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after {
  display: block;
  content: "";
  clear: both;
}
::v-deep input {
  height: 30px;
  border-radius: 0;
  width: 100%;
}
::v-deep button {
  height: 30px;
  padding: 0 20px;
  line-height: 30px;
  color: #fff;
  background-color: #006eff;
  border-radius: 0;
  border: 1px solid #006eff;
}
.bgGray {
  background-color: #f2f2f2;
  width: 100%;
  padding: 20px;
  margin-bottom: 20px;
  .newList1 {
    margin-bottom: 30px;
    p:nth-child(1) {
      font-size: 12px;
      color: #999;
      float: left;
      width: 120px;
    }
    p:nth-child(2) {
      font-size: 12px;
      color: #000;
      float: left;
      width: calc(100% - 120px);
    }
  }
}
.basicinfo {
  width: 100%;
  min-height: 100px;
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  padding: 20px;
  margin-bottom: 20px;
  h1 {
    font-size: 14px;
    font-weight: 600;
    color: #000;
    margin-bottom: 30px;
    a {
      float: right;
      font-size: 12px;
      font-weight: 100;
    }
  }
  .newClear {
    margin-bottom: 30px;
  }
  .newList {
    p:nth-child(1) {
      font-size: 12px;
      color: #999;
      float: left;
      width: 120px;
    }
    p:nth-child(2) {
      font-size: 12px;
      color: #000;
      float: left;
      width: calc(100% - 120px);
    }
  }
}
.dateOut {
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
  .spanBlod {
    font-size: 12px;
    color: #888;
    font-weight: 600;
  }
}
.dataDateTime {
  width: 135px;
  margin: 0 20px 0 12px;
  font-size: 12px;
  ::v-deep .el-input__icon {
    line-height: 1;
  }
}
.dateValue {
  width: 120px;
  margin-right: 20px;
  ::v-deep .el-input__icon {
    line-height: 1;
  }
}
.streamName {
  width: 200px;
  margin: 0 30px 0 0;
  font-size: 12px;
}
.leftCon {
  display: inline-block;
  width: 70px;
  font-size: 12px;
  color: #999;
}
.rightCon {
  display: inline-block;
  width: calc(100% - 70px);
  font-size: 12px;
  color: #999;
}
.greyContent {
  width: 100%;
  height: 285px;
  overflow-y: auto;
  background-color: #f5f2f0;
  border-radius: 4px;
}
.sub-text {
  font-size: 12px;
  color: #888;
  margin-left: 5px;
}
.tip {
  color: #888;
}
</style>
