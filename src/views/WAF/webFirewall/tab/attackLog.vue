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
            <el-col :span="8"><h3>攻击IP详情</h3></el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <el-col :span="12">
                  <span class="w120">域名</span>
                  {{log.Domain}}
                </el-col>
                <el-col :span="12">
                  <span class="w120">攻击类型</span>
                  {{log.AttackType}}
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row type="flex">
                <el-col :span="12">
                  <span class="w80">地区</span>
                  {{log.IpinfoState}}
                </el-col>
                <el-col :span="12">
                  <span class="w80">IP所有者</span>
                  {{log.IpinfoDetail}}
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <el-col :span="12">
                  <span class="w120">聚合攻击次数</span>
                  {{log.Count}}
                </el-col>
                <el-col :span="12">
                  <span class="w120">攻击源IP</span>
                  {{log.AttackIp}}
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row type="flex">
                <el-col :span="12">
                  <span class="w80">国家</span>
                  {{log.IpinfoNation}}
                </el-col>
                <el-col :span="12">
                  <span class="w80">省份</span>
                  {{log.IpinfoProvince}}
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <el-col :span="12">
                  <span class="w120">命中规则ID</span>
                  {{log.RuleId}}
                </el-col>
                <el-col :span="12">
                  <span class="w120">命中规则名称</span>
                  {{log.RuleName}}
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row type="flex">
                <el-col :span="12">
                  <span class="w80">城市</span>
                  {{log.IpinfoCity}}
                </el-col>
                <el-col :span="12">
                  <span class="w80">经度</span>
                  {{log.IpinfoDimensionality}}
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <el-col :span="12">
                  <span class="w120">请求方法</span>
                  {{log.Method}}
                </el-col>
                <el-col :span="12">
                  <span class="w120">风险等级</span>
                  <span v-if="log.RiskLevel === '1'">高危</span>
                  <span v-if="log.RiskLevel === '2'">中危</span>
                  <span v-if="log.RiskLevel === '3'">低危</span>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row type="flex">
                <el-col :span="12">
                  <span class="w80">运营商</span>
                  {{log.IpinfoDetail}}
                </el-col>
                <el-col :span="12">
                  <span class="w80">纬度</span>
                  {{log.IpinfoLongtitude}}
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <el-col :span="12">
                  <span class="w120">攻击时间</span>
                  {{log.AttackTime}}
                </el-col>
                <el-col :span="12">
                  <span class="w120">匹配来源</span>
                  {{ARGS_MAP[log.ArgsName || "none"] || "其他"}}
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <el-col :span="12">
                  <span class="w120">请求UUID</span>
                  {{log.Uuid}}
                </el-col>
                <el-col :span="12">
                  <span class="w120">执行动作</span>
                  {{log.Status === '1' ? '拦截' : '观察'}}
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <span class="w120">请求URI</span>
                {{log.Uri}}
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <span class="w120">攻击内容</span>
                {{log.AttackContent}}
              </el-row>
            </el-col>
          </el-row>

        </el-card>

        <el-card>
          <h3>详情信息</h3>
          <el-row>
            <el-col>
              <span>协议版本</span>
              {{log.HttpLog && log.HttpLog.PROCOTOL}}
            </el-col>
            <el-col>
              <span>User-Agent</span>
              {{log.UserAgent}}
            </el-col>
          </el-row>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import { ARGS_MAP } from '../../constants'
export default {
  data() {
    return {
      log: {},
      ARGS_MAP,
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