<template>
  <div class="container">
    <div class="editTitle">
      <p class="title">
      <i class="el-icon-back" @click="backListDomin"></i>编辑域名
      </p>
      <div class="main">
        <div class="head">
          <el-steps :active="active" finish-status="success" simple>
            <el-step title="输入域名" ></el-step>
            <el-step title="选择监听器" ></el-step>
          </el-steps>
        </div>
        <domain @next="active=2" v-show="active === 1" />
        <listener v-show="active === 2" />
      </div>
    </div>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips"
import { COMMON_ERROR } from '../constants'
import Domain from './components/domain'
import Listener from './components/listener'

export default {
  data() {
    return {
      active: 2
    }
  },
  components: {
    Domain,
    Listener
  },
  methods: {
    backListDomin() {
      this.$router.go(-1)
      if (!t && r.isPanDomain(e)) {
            return "当前版本不支持泛域名，请升级到旗舰版"
        }
    },
  }
}
</script>
<style lang="scss" scoped>
.container {
  .main {
    background: #fff;
    margin: 20px;
    padding-bottom: 20px;
  }
  .head {
    padding-top: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #dcdfe6;
  }
  ::v-deep .el-steps--simple {
    padding-left: 20px;
    width: 400px;
    background: #fff;
  }
  ::v-deep .el-step.is-simple .el-step__head {
    display: flex;
  }
  .editTitle{
    // height:50px;
    // border-bottom:1px solid #ddd;
    // padding:0 20px;
    // line-height:50px;
    // font-size:16px;
    // font-weight: 600;
    // background-color:#fff;
    .title {
      height: 50px;
      line-height: 50px;
      font-size: 16px;
    font-weight: 700;
      color: #000;
      background: #fff;
      padding-left: 20px;
    }
    .el-icon-back{
      margin-right:12px;
      color:#006eff;
    }
  }
}
</style>