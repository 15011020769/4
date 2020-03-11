<template>
  <div v-loading="loadShow">
    <div class="topHead">
      <i class="el-icon-back" @click="returnBack"></i>
      {{ $route.query.Name }}
    </div>
    <div class="conTabs">
      <el-tabs v-model="activeName" v-loading="loading">
        <el-tab-pane :label="$t('CSS.detailPlay.basicMessage')" name="first">
          <div class="wrapper">
            <BasicInfo :info="info" />
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('CSS.detailPlay.playbackConfiguration')"
          name="second"
        >
          <div class="wrapper">
            <play-config :active="activeName" />
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('CSS.detailPlay.templateConfiguration')"
          name="third"
          lazy
        >
          <div class="wrapper">
            <play-template />
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('CSS.detailPlay.accessControl')"
          name="fourth"
          lazy
        >
          <div class="wrapper">
            <access-control />
          </div>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('CSS.detailPlay.advancedConfiguration')"
          name="fifth"
          lazy
        >
          <div class="wrapper">
            <advance-config />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import BasicInfo from './tabs/BasicInfo'
import PlayConfig from './tabs/playConfig'
import PlayTemplate from './tabs/playTemplate'
import AccessControl from './tabs/accessControl'
import AdvanceConfig from './tabs/advanceConfig'
import { DOMAIN_DELTILS } from '@/constants'
import { CSSErrorTips } from '../components/CSSErrorTips'

let ErrTips = {
  'InternalError.SystemError': '內部錯誤',
  'InvalidParameter.ParamError': '非法入參',
  'ResourceNotFound.UserNotExist': '用戶不存在',
  'ResourceNotFound.DomainNotExist': '域名不存在'
}
export default {
  name: 'detailPushStream',
  data () {
    return {
      activeName: 'first',
      loadShow: false, // 加载
      info: {}, // 详情内容
      loading: true
    }
  },
  components: {
    BasicInfo: BasicInfo,
    PlayConfig,
    PlayTemplate,
    AccessControl,
    AdvanceConfig
  },
  mounted () {
    const params = {
      Version: '2018-08-01',
      DomainName: this.$route.query.Name
    }

    this.loading = true
    this.axios.post(DOMAIN_DELTILS, params).then(res => {
      this.loading = false
      if (res.Response.Error !== undefined) {
        let ErrOr = Object.assign(CSSErrorTips, ErrTips)
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: 'error',
          showClose: true,
          duration: 0
        })
        return
      }

      this.info = res.Response.DomainInfo
    })
  },
  methods: {
    // 返回列表页
    returnBack () {
      this.$router.push({
        name: 'domainManagement'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after {
  content: "";
  display: block;
  clear: both;
}
.topHead {
  width: 100%;
  height: 50px;
  background-color: #fff;
  line-height: 50px;
  padding: 0 20px;
  font-size: 16px;
  font-weight: 600;
  .el-icon-back {
    margin-right: 15px;
    font-size: 24px;
    color: #006eff;
    cursor: pointer;
  }
}
.conTabs {
  width: 100%;
  height: 40px;
  background-color: #fff;
  padding: 0 20px;
  border-bottom: 1px solid #ddd;
}
.wrapper {
  width: 100%;
}
</style>
