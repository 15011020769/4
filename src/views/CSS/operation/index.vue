<template>
  <div class="operation-wrap">
    <Header title="运营数据" />
    <div class="seek">
      <XTimeX v-on:switchData="GetDat" :classsvalue="value"></XTimeX>
    </div>
    <div class="seek seek-box">
      <p>
        <span>选择域名</span>
        <el-select
          v-model="domain"
          multiple
          collapse-tags
          style="margin-left: 10px;"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </p>
      <p style="margin-left:20px;">
        <span>选择运营商</span>
        <el-select v-model="operator" placeholder="请选择" style="margin-left:10px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </p>
      <el-button style="margin-left:20px;">{{region}}</el-button>
      <el-button style="margin-left:20px;" type="primary" @click="search">查询</el-button>
    </div>
    <div class="operation-main">
      <div class="tab-box">
        <dl
          v-for="(item,index) in tab"
          :key="index"
          :class="tabIndex == index ? 'active' : ''"
          @click="tabClick(index)"
        >
          <dt>{{item.name}}</dt>
          <dd>
            0
            <span style="font-size:16px;color:black;">{{item.code}}</span>
          </dd>
        </dl>
      </div>
      <div class="main">
        <Tab1 :StartTIme="StartTIme" :EndTIme="EndTIme" v-if="tabIndex == 0" />
        <Tab2 :StartTIme="StartTIme" :EndTIme="EndTIme" v-if="tabIndex == 1" />
        <Tab3 :StartTIme="StartTIme" :EndTIme="EndTIme" v-if="tabIndex == 2" />
        <Tab4 :StartTIme="StartTIme" :EndTIme="EndTIme" v-if="tabIndex == 3" />
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Header from "@/components/public/Head";
import XTimeX from "@/components/public/TimeN";
import { ALL_CITY } from "@/constants";
import Tab1 from "./tab/tab1";
import Tab2 from "./tab/tab2";
import Tab3 from "./tab/tab3";
import Tab4 from "./tab/tab4";
export default {
  name: "operation",
  data() {
    return {
      operator: "",
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      domain: "",
      value: 1, //时间组件默认选中值
      region: "台灣台北", //地域
      tabIndex: 0, //tab默认选中值
      //tab内容
      tab: [
        {
          name: "带宽峰值",
          code: "Mbps"
        },
        {
          name: "总流量",
          code: "MB"
        },
        {
          name: "总请求数",
          code: "次"
        },
        {
          name: "并发连接数峰值",
          code: "次"
        }
      ],
      StartTIme: moment(new Date()).format("YYYY-MM-DD 00:00:00"),
      EndTIme: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    };
  },
  components: {
    Header,
    XTimeX,
    Tab1,
    Tab2,
    Tab3,
    Tab4
  },
  created() {
    this.getCity();
  },
  methods: {
    //查询
    search() {
      this.StartTIme = this.timeData[0].StartTIme;
      this.EndTIme = this.timeData[0].EndTIme;
    },
    //时间组件返回的数据
    GetDat(val) {
      val[0].StartTIme = moment(val[0].StartTIme).format("YYYY-MM-DD HH:mm:ss");
      this.value = val[1];
      this.timeData = val;
    },
    //获取城市
    getCity() {
      this.axios.post(ALL_CITY).then(res => {
        this.region = res.data[0].zone;
      });
    },
    //tab切换
    tabClick(index) {
      this.tabIndex = index;
    }
  }
};
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
.operation-wrap >>> .el-range-input {
  margin-top: 5px;
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
</style>