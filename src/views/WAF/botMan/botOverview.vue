<!--  -->
<template>
  <div>
    <div class="topHeader">
      <span>BOT 概览</span>
    </div>
    <div class="wrapper">
      <div class="topTip" v-if="tipShow">
        <p style="width: 99%">BOT 行为管理能够对友好及恶意机器人程序进行甄别分类，并采取针对性的流量管理策略，如放通搜索引擎类机器人流量，而对恶意数据爬取商品信息流量采取不响应或减缓响应或差异化响应策略，能够应对恶意机器人程序爬取带来的资源消耗，信息泄露及无效营销问题，同时也保障友好机器人程序（如搜索引擎，广告程序）的正常运行。了解更多</p>
        <span class="el-icon-close" @click="closeTip"></span>
      </div>
      <div class="timeList">
        <el-button-group class="buttonDateCheck">
          <el-button @click="checkTime(1)">近1小时</el-button>
          <el-button @click="checkTime(2)">近6小时</el-button>
          <el-button @click="checkTime(3)">今天</el-button>
          <el-button @click="checkTime(4)">昨天</el-button>
          <el-button @click="checkTime(5)">近7天</el-button>
        </el-button-group>
        <el-date-picker
          v-model="dateTimeValue"
          type="datetimerange"
          class="timeValue"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :clearable= false
        ></el-date-picker>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tipShow: true,
      dateTimeValue: "", // 日期绑定
    }
  },

  methods: {
    //关闭提示文字
    closeTip() {
      this.tipShow = false;
    },
    checkTime(val) {
      if(val == "1") {

      }
    }
  }
}

</script>
<style lang='scss' scoped>
.topHeader {
  width: 100%;
  height: 50px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 0 20px;
  line-height: 50px;
  span {
    font-size: 16px;
    font-weight: 600;
    color: #000;
    margin-right: 20px;
  }
}

.wrapper {
  width: 100%;
  padding: 20px;
  button {
    height: 30px;
    line-height: 28px;
    border-radius: 0;
  }
  ::v-deep .el-input__inner {
    height: 30px;
    line-height: 30px;
    border-radius: 0;
  }
  .topTip {
    font-size: 12px;
    line-height: inherit;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    margin-bottom: 20px;
    position: relative;
    p {
      line-height: 20px;
    }
    .el-icon-close {
      position: absolute;
      font-size: 18px;
      top: 10px;
      margin-left: 10px;
      right: 20px;
    }
  }
  .timeList {
    .buttonDateCheck {
      float: left;
      button {
        padding: 0 20px;
      }
      .addStyleBtn {
        background-color: #006eff !important;
        color: #fff;
      }
    }
    .timeValue {
      ::v-deep .el-range__icon {
        line-height: 22px;
      }
      ::v-deep .el-range-separator {
        line-height: 22px;
        width: 7%;
      }
    }
  }
}
</style>
