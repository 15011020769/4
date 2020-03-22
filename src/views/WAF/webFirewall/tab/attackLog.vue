<template>
  <div class="container">
    <div class="editTitle">
      <p class="title">
        <i class="el-icon-back" @click="$router.go(-1)"></i>
        {{t('日志详情', 'WAF.rzxq')}}
      </p>
      <div class="main">
        <el-card class="basic">
          <el-row style="margin-bottom: 10px;">
            <el-col :span="16"><h3>{{t('基础信息', 'WAF.jcxx')}}</h3></el-col>
            <el-col :span="8"><h3>{{t('攻击IP详情', 'WAF.gjipxq')}}</h3></el-col>
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
                    <div class="w120">{{t('攻击类型', 'WAF.gjlx')}}</div>
                    <div>{{$s2t(log.AttackType)}}</div>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row type="flex">
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w80">{{t('地区', 'WAF.dq')}}</div>
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
                    <div class="w120">{{t('聚合攻击次数', 'WAF.jhgjcs')}}</div>
                    <div>{{log.Count}}</div>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w120">{{t('攻击源IP', 'WAF.gjyip')}}</div>
                    <div>{{log.AttackIp}}</div>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row type="flex">
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w80">{{t('国家', 'WAF.country')}}</div>
                    <div>{{$s2t(log.IpinfoNation)}}</div>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w80">省份</div>
                    <div>{{$s2t(log.IpinfoProvince)}}</div>
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
                    <div class="w120">{{t('命中规则ID', 'WAF.mzgzid')}}</div>
                    <div>{{log.RuleId}}</div>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w120">{{t('命中规则名称', 'WAF.mzgzmc')}}</div>
                    <div>{{$s2t(log.RuleName)}}</div>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row type="flex">
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w80">城市</div>
                    <div>{{$s2t(log.IpinfoCity)}}</div>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w80">{{t('经度', 'WAF.jingdu')}}</div>
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
                    <div class="w120">{{t('请求方法', 'WAF.qqff')}}</div>
                    <div>{{log.Method}}</div>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w120">{{t('风险等级', 'WAF.fxdj')}}</div>
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
                    <div class="w80">{{t('运营商', 'WAF.yys')}}</div>
                    <div>{{log.IpinfoDetail}}</div>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w80">{{t('纬度', 'WAF.wd')}}</div>
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
                    <div class="w120">{{t('攻击时间', 'WAF.gjsj')}}</div>
                    <div>{{log.AttackTime}}</div>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w120">{{t('匹配来源', 'WAF.pply')}}</div>
                    <div>{{$s2t(ARGS_MAP[log.ArgsName || "none"] || "其他")}}</div>
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
                    <div class="w120">{{t('请求UUID', 'WAF.qquuid')}}</div>
                    <div>{{log.Uuid}}</div>
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-row type="flex">
                    <div class="w120">{{t('执行动作', 'WAF.zxdz')}}</div>
                    <div :class="log.Status === '1' ? 'h' : ''">
                      {{log.Status === '1' ? this.t('拦截', 'WAF.lj') : this.t('观察', 'WAF.gc')}}
                    </div>
                  </el-row>                  
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <el-row type="flex">
                  <div class="w120">{{t('请求URI', 'WAF.qquri')}}</div>
                  <div>{{log.Uri}}</div>
                </el-row>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-row type="flex">
                <el-row type="flex">
                  <div class="w120">{{t('攻击内容', 'WAF.gjlr')}}</div>
                  <div>{{log.AttackContent}}</div>
                </el-row>                
              </el-row>
            </el-col>
          </el-row>

        </el-card>

        <el-card>
          <h3>{{t('详情', 'WAF.xq')}}信息</h3>
          <el-row>
            <el-col v-if="log.HttpLog && log.HttpLog.PROCOTOL">
              <el-row type="flex">
                <div class="w120">{{t('协议版本', 'WAF.xybb')}}</div>
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