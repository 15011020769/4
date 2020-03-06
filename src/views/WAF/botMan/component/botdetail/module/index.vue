<template>
  <div>
    <div class="topHeader">
      <span><i class="el-icon-back" @click="$router.go(-1)"></i>{{t('BOT 详情', 'WAF.botxq')}}</span>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="t('基础信息', 'WAF.jcxx')" name="info"></el-tab-pane>
        <el-tab-pane :label="t('访问详情', 'WAF.fwxq')" name="detail"></el-tab-pane>
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
  .el-icon-back{
    margin-right:12px;
    color:#006eff;
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
</style>
