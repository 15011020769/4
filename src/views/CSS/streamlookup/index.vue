<template>
  <div class="streamlookup-wrap">
    <Header title="流详情查询" />
    <div class="toolbar">
      <div class="search-wrap">
        <p>可对单个视频流查询推流和播放数据详情</p>
        <div class="search">
          <el-input v-model="StreamName" placeholder="输入StreamName(流ID)进行查询"></el-input>
          <el-button type="primary" size="small" class="searchbtn" @click="search">查询</el-button>
        </div>
      </div>
    </div>
    <div class="streamlookup-main" v-if="showMain">
      <p class="title">StreamName(流ID)：{{streamIDAfterSearch}} 详细数据</p>
      <p class="sontitle">播放数据查询只能查询最近30天，查询时间段小于24小时</p>
      <div class="seek">
        <el-select size="small" v-model="selectStream" @change="changeOption">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <XTimeD v-on:switchData="GetDat" :classsvalue="value"></XTimeD>
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
import moment from "moment";
import Header from "@/components/public/Head";
import XTimeD from "@/components/public/TimeD";
import Stream from "./tab/stream";
import Play from "./tab/play";
export default {
  name: "streamlookup",
  data() {
    return {
      value: 1, //时间组件默认选中值
      selectStream: "1",
      StreamName: "",
      streamIDAfterSearch: "",
      showMain: false,
      showPlay: true,
      options: [
        {
          value: "1",
          label: "查看播放数据"
        },
        {
          value: "2",
          label: "查看推流数据"
        }
      ],
      StartTime: moment(new Date()).format("YYYY-MM-DD 00:00:00"),
      EndTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    };
  },
  components: {
    Header,
    XTimeD,
    Stream,
    Play
  },
  created() {},
  methods: {
    search() {
      if (this.StreamName == "" && this.showMain == false) {
        this.$message.error("请输入流id");
      } else {
        this.streamIDAfterSearch = this.StreamName;
        this.showMain = true;
        if (this.selectStream == "1") {
          this.$nextTick(() => {
            this.$refs.tab1.init();
          });
        } else {
          this.$nextTick(() => {
            this.$refs.tab2.init();
          });
        }
      }
    },
    //时间组件返回的数据
    GetDat(val) {
      val[0].StartTIme = moment(val[0].StartTIme).format("YYYY-MM-DD HH:mm:ss");
      this.value = val[1];
      this.timeData = val;
      this.StartTime = this.timeData[0].StartTIme;
      this.EndTime = this.timeData[0].EndTIme;
      if (this.selectStream == "1") {
        this.$nextTick(() => {
          this.$refs.tab1.init();
        });
      } else {
        this.$nextTick(() => {
          this.$refs.tab2.init();
        });
      }
    },
    changeOption(val) {
      if (val == "1") {
        this.showPlay = true;
        this.$nextTick(() => {
          this.$refs.tab1.init();
        });
      } else {
        this.showPlay = false;
        this.$nextTick(() => {
          this.$refs.tab2.init();
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.streamlookup-wrap >>> .el-input {
  width: 300px;
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
    }
  }
}
</style>
