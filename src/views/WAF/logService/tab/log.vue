<template>
  <div class="container">
    <div class="editTitle">
      <p class="title">
        <i class="el-icon-back" @click="$router.go(-1)"></i> 日志详情
      </p>
      <div class="main">
        <el-card class="basic">
          <el-row style="margin-bottom: 10px;">
            <el-col :span="16"><h3>基础信息</h3></el-col>
            <el-col :span="8"><h3>访问IP信息</h3></el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <span class="w120">域名</span>
                {{log.domain}}
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row type="flex">
                <el-col :span="12">
                  <span class="w80">地区</span>
                  {{log.ipinfo_state}}
                </el-col>
                <el-col :span="12">
                  <span class="w80">国家</span>
                  {{log.ipinfo_nation}}
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <span class="w120">访问时间</span>
                {{log.request_time}}
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row type="flex">
                <el-col :span="12">
                  <span class="w80">省份</span>
                  {{log.ipinfo_province}}
                </el-col>
                <el-col :span="12">
                  <span class="w80">经度</span>
                  {{log.ipinfo_longitude}}
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <span class="w120">访问源IP</span>
                {{log.client}}
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row type="flex">
                <el-col :span="12">
                  <span class="w80">纬度</span>
                  {{log.ipinfo_dimensionality}}
                </el-col>
                <el-col :span="12">
                  <span class="w80">运营商</span>
                  {{log.ipinfo_isp}}
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <span class="w120">请求UUID</span>
                {{log.uuid}}
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row type="flex">
                <el-col :span="12">
                  <span class="w80">IP类型</span>
                  {{log.ipinfo_type}}
                </el-col>
                <el-col :span="12">
                  <span class="w80">IP详情</span>
                  {{log.ipinfo_type}}
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <span class="w120">请求协议</span>
                {{log.schema}}
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row type="flex">
                <span class="w80">IP所有者</span>
                {{log.ipinfo_operator}}
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <span class="w120">请求方法</span>
                {{log.method}}
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <span class="w120">回源IP端口</span>
                {{log.upstream}}
              </el-row>
            </el-col>
          </el-row>
        </el-card>

        <el-card>
          <el-row style="margin-bottom: 10px;">
            <el-col><h3>请求详情信息</h3></el-col>
          </el-row>
          <el-row>
            <span class="w120">请求URL</span>
            {{log.url}}
          </el-row>
          <el-row>
            <span class="w120">accept</span>
            {{log.accept}}
          </el-row>
          <el-row>
            <span class="w120">accept-encoding</span>
            {{log.encoding}}
          </el-row>
          <el-row>
            <span class="w120">accept-language</span>
            {{log.language}}
          </el-row>
          <el-row>
            <span class="w120">Connection</span>
            {{log.connection}}
          </el-row>
          <el-row>
            <span class="w120">Content_type</span>
            {{log.content_type}}
          </el-row>
          <el-row>
            <span class="w120">Host</span>
            {{log.host}}
          </el-row>
          <el-row>
            <span class="w120">Referer</span>
            {{log.referer}}
          </el-row>
          <el-row>
            <span class="w120">User-Agent</span>
            {{log.user_agent}}
          </el-row>
          <el-row style="">
            <span class="w120">X_forwarded_for</span>
            {{log.x_forwarded_for}}
          </el-row>
          <el-row style="margin: 15px 0; padding-top: 15px;border-top: 1px solid #e5e5e5">
            <el-col><h3>应答详情信息</h3></el-col>
          </el-row>
          <el-row>
            <span class="w120">源站响应码</span>
            {{log.upstrean_status}}
          </el-row>
          <el-row>
            <span class="w120">WAF响应码</span>
            {{log.status}}
          </el-row>
          <el-row>
            <span class="w120">响应大小</span>
            {{log.bytes_sent}}
          </el-row>
          <el-row>
            <span class="w120">WAF回源耗时</span>
            {{parseFloat(log.upstream_connect_time) * 1000 || 0 }}ms
          </el-row>
          <el-row>
            <span class="w120">源站响应时间</span>
             {{parseFloat(log.upstream_response_time) * 1000 || 0}}ms
          </el-row>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      log: {},
    }
  },
  mounted() {
    this.log = this.$route.params.log
  } 
}
</script>
<style lang="scss" scoped>
.container {
  .main {
    // background: #fff;
    margin: 20px;
    padding-bottom: 20px;
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
  .basic {
    color: #000;
    margin-bottom: 20px;
  }
  span {
    display: inline-block;
    color: #888;
    font-size: 12px;
    line-height: 30px;
  }
  .w120 {
    width: 120px;
  }
  .w80 {
    width: 80px;
  }
}
</style>