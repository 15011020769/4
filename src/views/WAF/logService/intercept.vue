<template>
  <div>
    <div class="topTitle">
      BOT{{t('访问日志', 'WAF.fwrz')}}
    </div>
    <el-card class="content">
      <el-row type="flex" justify="center" align="middle" class="main">
        <img src="../../../assets/WAF/default-permission-open.gif" />
        <el-row class="tip">
          <el-col>
            {{t('使用访问日志功能，需要先购买安全日志服务包，并且在域名列表页选择域名开启访问日志开关。安全日志服务包，支持访问日志记录、查询和下载等功能。', 'WAF.syfwrzgn')}}
          </el-col>
          <el-button type="primary" :disabled="loading" size="small" class="buy" @click="buyLogBackModel=true">{{t('立即购买', 'WAF.ljgm')}}</el-button>
        </el-row>
      </el-row>
    </el-card>
    <buyLogBackModel :package="package" :isShow="buyLogBackModel" @closeLogBackModel="closeLogBackModel"/>
  </div>
</template>
<script>
import buyLogBackModel from '../webFirewall/model/buyLogBackModel'
import { DESCRIBE_USER_INFO } from '@/constants'
export default {
  data() {
    return {
      buyLogBackModel: false,
      package: {},
      loading: true,
    }
  },
  components: {
    buyLogBackModel,
  },
  mounted() {
    this.getPackage()
  },
  methods: {
    closeLogBackModel(isShow){
      this.buyLogBackModel = isShow
    },
    getPackage() {
      this.axios.post(DESCRIBE_USER_INFO, {
        Version: '2018-01-25'
      }).then(resp => {
        this.generalRespHandler(resp, ({ Data }) => {
          this.package = Data
          this.loading = false
        })
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.topTitle{
  width:100%;
  height:50px;
  line-height:50px;
  border-bottom:1px solid #ddd;
  padding:0 20px;
  font-size:16px;
  font-weight:600;
  color:#000;
  background-color:#fff;
}
.content {
  margin: 20px 30px;
  font-size: 12px;
  .main {
    height: 540px;
    .tip {
      width: 400px;
      line-height: 20px;
      margin-left: 15px;
      .buy {
        margin-top: 15px;
      }
    }
  }
  img {
    width: 180px;
    height: 180px;
  }
}
</style>