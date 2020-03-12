<template>
  <div id="saveOverView">
    <div class="topTitle">
      <div class="topTitleT">
        {{ t("安全概览", "WAF.aqgl") }}
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabList">
        <el-tab-pane :label="t('攻击概览', 'WAF.gjgl')" name="first">
          <attackOverview v-if="isChildUpdate1" />
        </el-tab-pane>
        <el-tab-pane :label="t('业务概览', 'WAF.ywgl')" name="second">
          <businessOverview v-if="isChildUpdate2" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import attackOverview from './tab/attackOverview'
import businessOverview from './tab/businessOverview'
import accessLog from './tab/accessLog'
export default {
  data () {
    return {
      activeName: 'first',
      isChildUpdate1: true,
      isChildUpdate2: false,
      isChildUpdate3: false
    }
  },
  components: {
    attackOverview: attackOverview, // 攻击概览
    businessOverview: businessOverview, // 业务概览
    accessLog: accessLog // 访问日志
  },
  methods: {
    // tab切换点击事件
    handleClick (tab, event) {
      // console.log(tab, event)
      if (tab.name == 'first') {
        this.isChildUpdate1 = true
        this.isChildUpdate2 = false
        this.isChildUpdate3 = false
      } else if (tab.name == 'second') {
        this.isChildUpdate1 = false
        this.isChildUpdate2 = true
        this.isChildUpdate3 = false
      } else {
        this.isChildUpdate1 = false
        this.isChildUpdate2 = false
        this.isChildUpdate3 = true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#saveOverView {
  .topTitle {
    .topTitleT {
      height: 50px;
      padding: 0 20px;
      line-height: 50px;
      background-color: #fff;
      font-size: 16px;
      font-weight: 600;
      color: #000;
    }
    .tabList {
      ::v-deep .el-tabs__header {
        background-color: #fff;
        padding-left: 20px;
      }
    }
  }
}
</style>
