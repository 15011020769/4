<template>
  <div class="deleterRow">
    <div class="top-title">
      <i class="el-icon-back" @click="handleBack"></i>
      <span>{{title}}</span>
      <span style='float: right;'>
        <el-select v-model="primaryData.search" placeholder="" size="mini">
          <el-option
            v-for="item in searchList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" size="mini" style='margin-left: 10px;'>发布新版本</el-button>
      </span>
    </div>
    <div class="tabTitle">
      <span :class="['tab',showIndex==1?'active':'']" @click="handleClick(1)">函数配置</span>
      <span :class="['tab',showIndex==2?'active':'']" @click="handleClick(2)">函数代码</span>
      <span :class="['tab',showIndex==3?'active':'']" @click="handleClick(3)">触发方式</span>
      <span :class="['tab',showIndex==4?'active':'']" @click="handleClick(4)">运行日志</span>
      <span :class="['tab',showIndex==5?'active':'']" @click="handleClick(5)">监控信息</span>
    </div>
    <div class="detailContent">
      <functionconfigue v-if="showIndex==1"></functionconfigue>
      <functionCode v-if="showIndex==2"></functionCode>
      <triggerway v-if="showIndex==3"></triggerway>
      <runninglog v-if="showIndex==4"></runninglog>
      <monitor v-if="showIndex==5"></monitor>
    </div>
  </div>
</template>

<script>
import functionconfigue from './module/detail/functionconfigue.vue';
import functionCode from './module/detail/functionCode.vue';
import triggerway from './module/detail/triggerway.vue';
import runninglog from './module/detail/runninglog.vue';
import monitor from './module/detail/monitor.vue';

export default {
  data() {
    return {
      title: 'se2223',
      searchList: [{
        value: '1',
        label: '全部语言',
      }, {
        value: '2',
        label: 'pathon2.7',
      }],
      primaryData: {
        search: '1',
      },
      showIndex: 1,
    };
  },
  computed: {
  },
  components: {
    functionconfigue,
    functionCode,
    triggerway,
    runninglog,
    monitor,
  },
  methods: {
    handleBack() {
      this.$router.push('/scffuncServe');
    },
    handleClick(val) {
      this.showIndex = val;
    },
  },
};
</script>

<style scoped lang="scss">
  .top-title {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    background-color: #fff;
    font-weight: bolder;
    border-bottom: 1px solid #ccc;
  }

  .el-icon-back {
    font-size: 20px;
    margin-right: 30px;
    padding: 2px;
    color: #006eff;
  }
  .el-icon-back:hover {
    background: #eee;
  }
  .tabTitle {
    background: #fff;
    height: 30px;
    line-height: 30px;
    padding-left:20px;
  }
  .tab {
    padding: 5px 10px;
    margin: 10px 5px;
    cursor: pointer;
  }
  .active {
    border-bottom: 2px solid #006eff;
  }
  .detailContent {
    padding: 20px;
    height: 100%;
  }
</style>
