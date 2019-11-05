<template>
  <div class="runninglog">
    <div>
      <el-button type="primary" size="mini">刷新</el-button>
      <el-select v-model="primaryData.search" placeholder="" size="mini" style="width:120px;margin:0 5px;">
        <el-option
          v-for="item in searchList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
        size="mini"
        v-model="primaryData.valuetime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button size="mini" v-model="primaryData.timeChecknow" style="margin-left:10px;">实时</el-button>
      <span>
        <el-button v-model="primaryData.timecheckday" size="mini">近24小时</el-button>
      </span>
      <span style="float: right;">
        <el-input v-model="primaryData.searchName" size="mini" placeholder="请输入requestID" suffix-icon="el-icon-search" @click="search"></el-input>
      </span>
    </div>
    <div class="content">
      <div class="left"></div>
      <div class="right">
        <span>请求id</span>
        <span class='right-title'>
          时间：
          <span style="margin-left:20px;">运行时间：<span style="color:#333;">{{showMessage.runtime}}ms</span></span>
          <span style="margin-left:20px;">计费时间：<span style="color:#333;">{{showMessage.counttime}}ms</span></span>
          <span style="margin-left:20px;">占用内存：<span style="color:#333;">{{showMessage.savetime}}MB</span></span>
        </span>
        <div class="right-content">
          <div style='font-size:14px;color:#006eff;line-height:40px;'>返回数据</div>
          <div style='font-size:14px;color:#006eff;line-height:40px;'>日志</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      primaryData: {
        search: '1',
        valuetime: [],
        timeChecknow:'',
        timecheckday: '',
        searchName: ''
      },
      searchList: [{
        value: '1',
        label: '全部日志'
      }, {
        value: '2',
        label: '调用成功'
      }, {
        value: '3',
        label: '调用失败'
      }],
      showMessage: {
        runtime: '0',
        counttime: '0',
        savetime: '0'
      }
    };
  },
  mounted() {
  },
  components: {
  },
  methods: {
    search() {

    }
  }
};
</script>

<style scoped lang="scss">
  .el-icon-search:hover {
    cursor: pointer;
  }
  .content {
    margin: 20px 0;
    padding: 20px;
    background: #fff;
  }
  .left {
    width: 240px;
    min-height: 800px;
    float: left;
    border: 1px solid #ccc;
    border-top: none;
    border-left: none;
  }
  .right {
    margin-left: 260px;
    min-height: 800px;
  }
  .right-title {
    display:block;
    padding: 0 20px;
    line-height: 50px;
    background:#f2f2f2;
    color: #aaa;
    font-size: 12px;
  }
  .right-content {
    display: inline-block;
    margin-top: 20px;
    padding: 0 10px;
    width: 100%;
    min-height: 700px;
    background: #f2f2f2;
  }
</style>
