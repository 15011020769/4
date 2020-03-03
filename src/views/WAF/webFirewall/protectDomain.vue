<template>
  <div class="container">
    <div class="editTitle">
      <p class="title">
      <i class="el-icon-back" @click="backListDomin"></i>{{domainId ? t('编辑', 'WAF.bj') : '新增'}}域名
      </p>
      <div class="main">
        <div class="head">
          <el-steps :active="active" finish-status="success" simple>
            <el-step :title="t('输入域名', 'WAF.srym')" ></el-step>
            <el-step :title="t('选择监听器', 'WAF.xzjtq')" ></el-step>
          </el-steps>
        </div>
        <domain @next="next" :domain.sync="domain" v-if="active === 1" />
        <listener :domain.sync="domain" v-if="active === 2" />
      </div>
    </div>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips"
import { COMMON_ERROR } from '../constants'
import { DESCRIBE_HOSTS } from '@/constants'
import Domain from './components/domain'
import Listener from './components/listener'

export default {
  data() {
    return {
      active: 1,
      domainId: '',
      domain: {
        IsCdn: 0,
        Domain: ''
      }
    }
  },
  components: {
    Domain,
    Listener
  },
  mounted() {
    const { domainId } = this.$route.query
    this.domainId = domainId
    if (domainId) {
      this.axios.post(DESCRIBE_HOSTS, {
        Version: '2018-01-25',
        DomainId: domainId,
      }).then(({ Response }) => {
        if (Response.Error) {
          let ErrOr = Object.assign(ErrorTips, COMMON_ERROR)
          this.$message({
            message: ErrOr[Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          })
        } else {
          if (Response.TotalCount === 1) {
            this.domain = Response.HostList[0]
          }
        }
      })
    }
  },
  methods: {
    next() {
      this.active = 2
    },
    backListDomin() {
      this.$router.go(-1)
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