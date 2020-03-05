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
                  <el-row type="flex">
                    <div class="w120">域名</div>
                    <div>{{log.Domain}}</div>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w120">攻击类型</div>
                    <div>{{log.AttackType}}</div>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row type="flex">
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w80">地区</div>
                    <div>{{log.IpinfoState}}</div>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w80">IP所有者</div>
                    <div>{{log.IpinfoDetail}}</div>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w120">聚合攻击次数</div>
                    <div>{{log.Count}}</div>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w120">攻击源IP</div>
                    <div>{{log.AttackIp}}</div>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row type="flex">
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w80">国家</div>
                    <div>{{log.IpinfoNation}}</div>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w80">省份</div>
                    <div>{{log.IpinfoProvince}}</div>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w120">命中规则ID</div>
                    <div>{{log.RuleId}}</div>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w120">命中规则名称</div>
                    <div>{{log.RuleName}}</div>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row type="flex">
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w80">城市</div>
                    <div>{{log.IpinfoCity}}</div>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w80">经度</div>
                    <div>{{log.IpinfoDimensionality}}</div>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w120">请求方法</div>
                    <div>{{log.Method}}</div>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w120">风险等级</div>
                    <div class="h" v-if="log.RiskLevel === '1'">高危</div>
                    <div class="c" v-if="log.RiskLevel === '2'">中危</div>
                    <div v-if="log.RiskLevel === '3'">低危</div>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row type="flex">
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w80">运营商</div>
                    <div>{{log.IpinfoDetail}}</div>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w80">纬度</div>
                    <div>{{log.IpinfoLongtitude}}</div>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w120">攻击时间</div>
                    <div>{{log.AttackTime}}</div>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w120">匹配来源</div>
                    <div>{{ARGS_MAP[log.ArgsName || "none"] || "其他"}}</div>
                  </el-row>                  
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w120">请求UUID</div>
                    <div>{{log.Uuid}}</div>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w120">执行动作</div>
                    <div :class="log.Status === '1' ? 'h' : ''">{{log.Status === '1' ? '拦截' : '观察'}}</div>
                  </el-row>                  
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <el-row type="flex">
                  <div class="w120">请求URI</div>
                  <div>{{log.Uri}}</div>
                </el-row>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <el-row type="flex">
                  <div class="w120">攻击内容</div>
                  <div>{{log.AttackContent}}</div>
                </el-row>                
              </el-row>
            </el-col>
          </el-row>

        </el-card>

        <el-card>
          <h3>详情信息</h3>
          <el-row>
            <el-col v-if="log.HttpLog && log.HttpLog.PROCOTOL">
              <el-row type="flex">
                <div class="w120">协议版本</div>
                <div>{{log.HttpLog.PROCOTOL}}</div>
              </el-row>              
            </el-col>
            <el-col>
              <el-row type="flex">
                <div class="w120">User-Agent</div>
                <div>{{log.UserAgent}}</div>
              </el-row>
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
    
  }
  .w120 {
    display: inline-block;
    color: #888;
    font-size: 12px;
    line-height: 30px;
    width: 120px;
  }
  .w80 {
    display: inline-block;
    color: #888;
    font-size: 12px;
    line-height: 30px;
    width: 80px;
  }
}
::v-deep .el-row--flex {
  // justify-content: center;
  align-items: center;
}
.h {
  color: #e1504a;
}
.c {
  color: #FF9D00;
}
</style>