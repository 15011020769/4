<template>
  <div class="overview-wrap">
    <HeaderCom title="概览" />
    <div class="overview-main">
      <div class="explain">
        <p>
          新用户9.9元特惠包（100G流量，1年有效期），限购1次，
          <a href="#">立即购买</a>
        </p>
        <p>
          CDN(直播)日志实时分析解决方案内测开放， 实时分析与检索日志数据，
          <a href="#">立即申请>>>></a>
        </p>
      </div>
      <div class="main-box">
        <h3>今日数据</h3>
        <div class="overview">
          <dl>
            <dt>
              <span>0</span>Mbps
            </dt>
            <dd>
              <p>实时下行带宽</p>
            </dd>
          </dl>
          <dl>
            <dt>
              <span>0</span>MB
            </dt>
            <dd>
              <p>今日下行流量</p>
            </dd>
          </dl>
          <dl>
            <dt>
              <span>0</span>人
            </dt>
            <dd>
              <p>
                直播在线数
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="在线数是直播过程中，平台统计的并发连接数量。"
                  placement="bottom"
                >
                  <span style="cursor: pointer;">
                    <i class="el-icon-info"></i>
                  </span>
                </el-tooltip>
              </p>
            </dd>
          </dl>
          <dl>
            <dt>
              <span>1</span>个
            </dt>
            <dd>
              <p>流量包</p>
              <p style="margin-top:10px;">总流量 20.0 GB</p>
              <p>已使用 0.0 GB</p>
            </dd>
          </dl>
        </div>
      </div>
      <div class="box">
        <el-button type="primary" v-show="!btnload">{{region}}</el-button>
        <el-button v-show="btnload" icon="el-icon-loading" type="primary"></el-button>
        <TimeX v-on:switchData="GetDat" :classsvalue="value" style="margin-left:20px;"></TimeX>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top:10px;">
        <el-tab-pane label="带宽趋势" name="first">带宽趋势</el-tab-pane>
        <el-tab-pane label="流量趋势" name="second">流量趋势</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import HeaderCom from "@/components/public/Head";
import TimeX from "@/components/public/TimeX";
import { ALL_CITY, LIVE_DESCRIBE_BILLBANDWIDTHANDFLUXLIST } from "@/constants";
export default {
  name: "overview",
  data() {
    return {
      value: "",
      activeName: "second",
      region: "",
      btnload: true
    };
  },
  components: {
    HeaderCom,
    TimeX
  },
  created() {
    this._region();
    this.describeBillBandwidthAndFluxList();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    GetDat() {},
    //获取地域
    _region() {
      this.axios.post(ALL_CITY).then(res => {
        this.region = res.data[0].zone;
        this.btnload = false;
      });
    },
    //直播计费带宽和流量数据查询
    describeBillBandwidthAndFluxList() {
      let params = {
        Version: '2018-08-01',
        StartTime: '2019-12-20 00:00:00',
        EndTime: '2019-12-20 10:56:40',
        Granularity: 60,
        //数据粒度，支持如下粒度(默认值：5)：
        //5：5分钟粒度，（跨度不支持超过1天）
        //60：1小时粒度（跨度不支持超过一个月）
        //1440：天粒度（跨度不支持超过一个月）
      }
      this.axios.post(LIVE_DESCRIBE_BILLBANDWIDTHANDFLUXLIST, params).then(res => {
        console.log(res)
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.overview-wrap >>> .el-button {
  height: 30px;
  line-height: 30px;
  padding-top: 0;
  font-size: 12px !important;
  border-radius: 0;
}
.overview-wrap >>> .box-dis {
  margin: 0;
}
.overview-wrap >>> .el-tab-pane {
  background: white;
  padding: 20px;
  box-sizing: border-box;
}
.overview-wrap >>> .el-input__inner {
  height: 30px;
  line-height: 30px;
  padding-top: 0;
  border-radius: 0;
  font-size: 12px;
  position: relative;
}
.overview-wrap >>> .btn-style {
  margin-left: 0;
}
.overview-wrap >>> .LocaP {
  margin-left: 10px;
  display: flex;
  align-items: center;
}
.overview-wrap {
  .overview-main {
    padding: 20px;
    box-sizing: border-box;

    .box {
      display: flex;
      align-items: center;
    }

    .main-box {
      background-color: #fff;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      padding: 20px;
      box-sizing: border-box;
      margin-bottom: 20px;

      .overview {
        display: flex;
        dl {
          flex: 1;
          padding-top: 20px;
          padding-bottom: 10px;
          box-sizing: border-box;

          dt {
            font-size: 14px;
            padding-left: 2px;
            span {
              font-size: 36px;
              font-weight: normal;
            }
          }
          dd {
            margin-top: 10px;
            color: #888;
          }
        }
      }
    }

    .explain {
      color: #003b80;
      border: 1px solid #97c7ff;
      background: #e5f0ff;
      padding: 10px 30px 10px 20px;
      margin-bottom: 10px;
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
  }
}
</style>