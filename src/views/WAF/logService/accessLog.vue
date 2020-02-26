<template>
  <div class="container">
    <div class="topTitle">
      {{t('访问日志', 'WAF.fwrz')}}
    </div>
    <div class="main">
      <el-card class="overview">
        <el-row type="flex">
          <el-col>
            <p>{{t('启用安全日志服务域名', 'WAF.qyaqrzfwym')}}</p>
            <p><span class="num-font">{{cls.ClsDomain}}</span>{{t('个', 'WAF.g')}}</p>
            <p>{{t('接入域名总数', 'WAF.jrymzs')}}：<span class="f_font_w600">{{cls.AllDomain}}</span></p>
          </el-col>
          <el-col>
            <p>{{t('安全日志服务包', 'WAF.aqrzfwb')}}</p>
            <p><span class="num-font">{{cls.Packages}}</span>{{t('个', 'WAF.g')}}</p>
            <p>
              {{t('已使用约', 'WAF.ysyy')}}：<span class="f_font_w600" style="color:#0abf5b;">{{cls.Used}}</span> GB 
              <el-tooltip placement="right-end" :content="t('访问日志使用量按天进行统计，已使用量为开通日志服务到当前日期前一天的日志存储使用量，和实际使用量略有差异。', 'WAF.fwrzsylattj')" effect="light">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </p>
            <p>{{t('总存储空间', 'WAF.zcckj')}}：<span class="f_font_w600">{{cls.Packages && cls.Packages * 1000}}</span> GB</p>
          </el-col>
        </el-row>
      </el-card>
      <el-tabs v-model="attackLog">
        <el-tab-pane :label="t('日志查询', 'WAF.rzcx')" name="first">
          <logQuery/>
        </el-tab-pane>
        <el-tab-pane :label="t('下载任务', 'WAF.xzrw')" name="second">
          <downloadTask :active="attackLog"/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import logQuery from './tab/logQuery'
import downloadTask from './tab/downloadTask'
import { DESCRIBE_CLS } from '@/constants'
export default {
  data(){
    return{
      attackLog:'first',//tab
      cls: {}
    }
  },
  components:{
    logQuery:logQuery,//日志查询
    downloadTask:downloadTask,//下载任务
  },
  mounted() {
    this.axios.post(DESCRIBE_CLS, {
      Version: '2018-01-25',
      Edition: 'clb-waf',
    }).then(resp => {
      this.generalRespHandler(resp, data => {
        this.cls = data
      })
    })
  }
}
</script>
<style lang="scss" scoped>
.container {
  .main {
    padding: 20px 30px;
    .overview {
      color: #454a51;
      font-size: 14px;
      p {
        line-height: 30px;
      }
    }
  }
  .topTitle {
    width:100%;
    height:50px;
    line-height:50px;
    font-size:16px;
    font-weight: 600;
    padding:0 20px;
    background-color:#fff;
  }
  .num-font {
    font-family: qcloud-num !important;
    font-size: 36px;
  }
  .f_font_w600 {
    font-weight: 600;
  }
}
</style>