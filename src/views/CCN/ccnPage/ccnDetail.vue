<!-- 云联网详情 -->
<template>
  <div>
    <div class="title_top">
      <div class="back">
        <i class="el-icon-back" @click="Back()"></i>
        <span>{{ccnName}}({{ccnId}})</span>
      </div>
      <div class="tabTitle">
        <span :class="['tab',showIndex==1?'active':'']" @click="handleClick(1)">{{$t("CCN.tabs.tab1")}}</span>
        <span :class="['tab',showIndex==2?'active':'']" @click="handleClick(2)">{{$t("CCN.tabs.tab2")}}</span>
        <span :class="['tab',showIndex==3?'active':'']" @click="handleClick(3)">{{$t("CCN.tabs.tab3")}}</span>
        <span :class="['tab',showIndex==4?'active':'']" @click="handleClick(4)">{{$t("CCN.tabs.tab4")}}</span>
      </div>
      <div class="detailContent">
        <tab-one v-if="showIndex==1"></tab-one>
        <tab-two v-if="showIndex==2"></tab-two>
        <tab-three v-if="showIndex==3"></tab-three>
        <tab-four v-if="showIndex==4"></tab-four>
      </div>
    </div>
  </div>
</template>

<script>
import tabOne from './module/tabOne.vue'
import tabTwo from './module/tabTwo.vue'
import tabThree from './module/tabThree.vue'
import tabFour from './module/tabFour.vue'
export default {
  data () {
    return {
      activeName: 'second',
      showIndex: 1,
      ccnId: '',
      ccnName: ''
    }
  },
  components: {
    tabOne,
    tabTwo,
    tabThree,
    tabFour
  },
  created () {
    this.ccnId = this.$route.query.ccnId
    this.ccnName = this.$route.query.ccnName
  },
  methods: {
    // 返回
    Back () {
      this.$router.push({
        path: '/ccnPage'
      })
    },
    handleClick (val) {
      this.showIndex = val
    }
  }
}
</script>
<style lang='scss' scoped>
.title_top {
  height: 82px;
  background: #fff;
  .back {
    padding-left: 20px;
    [class^='el-icon-'] {
      color: #006eff;
      line-height: 50px;
      font-size: 18px;
      font-weight: 600;
      margin-right: 15px;
    }
    & > span {
      color: #171d25;
      line-height: 50px;
      font-size: 16px;
      font-weight: 700;
    }
  }
  .tabTitle {
    background: #fff;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
  }
  .tab {
    font-size: 14px;
    padding: 5px 10px;
    margin: 10px 5px;
    cursor: pointer;
  }
  .active {
    font-weight: 700;
    border-bottom: 2px solid #006eff;
  }
  .detailContent {
    padding: 20px;
    height: 100%;
  }
}
</style>
