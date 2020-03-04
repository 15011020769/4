<template>
  <div>
    <div class="topHeader">
      <span>BOT 详情</span>
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="info"></el-tab-pane>
        <el-tab-pane label="访问详情" name="detail"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="wrapper">
      <base-info  v-if="activeName == 'info'"></base-info>
      <access-detail v-if="activeName == 'detail'"></access-detail>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { DESCRIBE_HOSTS, DESCRIBE_BOT_STATUS } from '@/constants'
import accessDetail from './accessDetail'
import baseInfo from './baseInfo'
export default {
  data () {
    return {
      activeName: "info",
      SrcIp: this.$route.query.SrcIp
    }
  },
  components: {
    accessDetail,
    baseInfo,
  },
  mounted() {
    console.log(this.SrcIp)
  },
  methods: {
  }
}

</script>
<style lang='scss' scoped>
.topHeader {
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 20px 20px 0 20px;
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
    line-height: 6px;
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
  .topSelect {
    ::v-deep .el-range__icon {
        line-height: 22px;
    }
    ::v-deep .el-range-separator {
      line-height: 22px;
      width: 7%;
    }
    ::v-deep .el-select {
      margin-right: 10px;
    }
    button {
      padding: 0 20px;
    }
    .addStyleBtn {
      background-color: #006eff !important;
      color: #fff;
    }
  }
}
</style>
