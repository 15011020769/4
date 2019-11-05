<template>
  <div class="monitorList">
    <el-dialog
      :visible.sync="monitordialog"
      width="70%"
      center
      :show-close="false">
      <div slot="title" class="title-wrap"><span style='font-weight: bolder;'>调用次数<span style="color:#888;">(次)</span></span><i class="el-icon-close" @click="close(2)"></i></div>
      <el-button size="mini" v-model="primaryData.timeChecknow">实时</el-button>
      <span>
        <el-button v-model="primaryData.timecheckday" size="mini">近24小时</el-button>
      </span>
      <span>
        <el-button v-model="primaryData.timecheckweek" size="mini">近7天</el-button>
      </span>
      <el-date-picker
        size="mini"
        style="width:240px;"
        v-model="primaryData.valuetime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <span style="float: right;">
        <span style="font-size:12px;color:#888;margin-left:20px;">时间粒度：
        </span>
        <el-select v-model="primaryData.time" placeholder="" size="mini" style="width:100px;margin:0 5px;">
          <el-option
          v-for="item in timeList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
          </el-option>
        </el-select>
        <span style="float: right;">
          <span class='refresh'>刷新</span>
        </span>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      primaryData: {
        valuetime: [],
        timeChecknow:'',
        timecheckday: '',
        timecheckweek: '',
        time: ''
      },
      timeList: [{
        value: '1',
        label: '1分钟'
      }, {
        value: '2',
        label: '5分钟'
      }],
    };
  },
  props: ["monitordialog"],
  computed: {
  },
  methods: {
    close(value) {
      this.$emit("close",value);
    }
  }
};
</script>

<style scoped lang="scss">
  .title-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bolder;
  }
  .title-wrap>i {
    font-size: 16px;
    font-weight: 900;
  }
  .el-icon-close {
    padding: 5px;
    color: #9c9c9c;
  }
  .el-icon-close:hover {
    background: #f2f2f2;
    cursor: pointer;
  }
  .refresh {
    margin-left: 50px;
    font-size: 12px;
    color: #006eff;
    cursor: pointer;
  }
</style>
