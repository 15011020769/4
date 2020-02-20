<template>
  <div class="container">
      <div class="refesher">
        <i class="el-icon-refresh"></i>
      </div>
      <el-row class="main">
        <el-row type="flex">
          <el-col>
            <h3>{{t('WAF开关', 'WAF.waflg')}}</h3>
            <el-row type="flex" :gutter="20" align="middle" justify="center">
              <el-col class="subText" :span="4">{{t('WAF状态', 'WAF.wafstatus')}}</el-col>
              <el-col>
                <el-switch v-model="domain.statusBool" />
              </el-col>
            </el-row>
            <el-row type="flex" style="margin-top: 10px">
              <el-col :span="4"></el-col>
              <el-col>
                <p class="subText">{{t('关闭WAF总开关后，WAF将不再对经过负载均衡监听器的流量进行防护，WAF所有功能也将失效', 'WAF.gbwaftip')}}。</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col>
            <h3>{{t('WAF防护状态', 'WAF.waffhzt')}}</h3>
            <el-row type="flex" :gutter="20" align="middle" justify="center">
              <el-col class="subText" :span="4">{{t('规则使用模式', 'WAF.gzsyms')}}</el-col>
              <el-col>
                <el-radio-group size="small" v-model="domain.Mode" @change="status => onChangeMode(status, domain)">
                  <el-radio-button :label="0">{{t('观察', 'WAF.gc')}}</el-radio-button>
                  <el-radio-button :label="1">{{t('拦截', 'WAF.lj')}}</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row>
            <el-row type="flex" style="margin-top: 10px">
              <el-col :span="4"></el-col>
              <el-col style="margin-left: 5px;">
                <el-link type="primary" style="cursor: pointer" @click="advanceSetting=!advanceSetting">
                  {{t('高级设置', 'WAF.gjsz')}} 
                  <i class="el-icon-caret-bottom" v-show="!advanceSetting" />
                  <i class="el-icon-caret-top" v-show="advanceSetting"/>
                </el-link>
              </el-col>
            </el-row>
            <el-row type="flex" style="margin-top: 10px" v-show="advanceSetting">
              <el-col :span="4"></el-col>
              <el-col class="subText" style="margin-left: 17px" :span="4">{{t('恶意文件检测', 'WAF.eywjjc')}}</el-col>
              <el-col>
                 <el-radio-group v-model="webShellStatus" @change="onChangeWebShellStatus">
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="item-container">
            <h3>基础设置</h3>
            <el-row type="flex" :gutter="20" align="middle" justify="center">
              <el-col class="subText" :span="4">域名</el-col>
              <el-col>
                {{domain.Domain}}
              </el-col>
            </el-row>
            <el-row type="flex" :gutter="20" align="middle" justify="center">
              <el-col class="subText" :span="4">ID</el-col>
              <el-col>
                {{domain.DomainId}}
              </el-col>
            </el-row>
            <el-row type="flex" :gutter="20" align="middle" justify="center">
              <el-col class="subText" :span="4">代理情况</el-col>
              <el-col>
                {{domain.IsCdn ? '是' : '否'}}
              </el-col>
            </el-row>
            <el-row type="flex" :gutter="20" align="middle" justify="center">
              <el-col class="subText" :span="4">流量模式</el-col>
              <el-col>
                <el-radio-group size="small" v-model="domain.FlowMode">
                  <el-radio-button :label="0">{{t('镜像模式', 'WAF.jxms')}}</el-radio-button>
                  <el-radio-button :label="1">清洗模式</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row>
          </el-col>
          <el-col class="item-container">
            <el-row type="flex" justify="space-between">
              <el-col>
                <h3>地域封禁</h3>
              </el-col>
              <el-col>
                <el-row type="flex" justify="end">
                  <el-button type="text">{{t('编辑', 'WAF.bj')}}</el-button>
                </el-row>
              </el-col>
            </el-row>
            <el-row type="flex" :gutter="20" align="middle" justify="center">
              <el-col class="subText" :span="4">{{t('封禁状态', 'WAF.fjzt')}}</el-col>
              <el-col>
                <el-switch />
              </el-col>
            </el-row>
            <el-row type="flex" style="margin-top: 10px">
              <el-col :span="4"></el-col>
              <el-col>
                <p class="subText" style="margin-left: 8px">{{t('可以选择国内省份和海外地区进行封禁', 'WAF.zyxzgnsf')}}。</p>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :span="4" class="subText">封禁地域</el-col>
              <el-col>
                <p class="subText">国内全部</p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="item-container" :span="12">
            <h3>{{t('负载均衡 - 监听器', 'WAF.lblis')}}</h3>
            <el-row class="table-head">
              <el-col :span="3">{{t('区域', 'WAF.qy')}}</el-col>
              <el-col :span="7">{{t('负载均衡（ID）', 'WAF.lbid')}}</el-col>
              <el-col :span="7">{{t('负载均衡VIP', 'WAF.lbvip')}}</el-col>
              <el-col :span="7">{{t('监听器', 'WAF.lis')}}</el-col>
            </el-row>
            <el-row v-if="domain.LoadBalancerSet" v-for="lb in domain.LoadBalancerSet" :key="lb.LoadBalancerId">
              <el-col :span="3">{{lb.Region}}</el-col>
              <el-col :span="7">{{lb.LoadBalancerId}}</el-col>
              <el-col :span="7">{{lb.Vip}}</el-col>
              <el-col :span="7">{{lb.ListenerName}}</el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-row>
      <addressStopEditModel :isShow="addressModel" @closeAddressModel="closeAddressModel"/>
  </div>
</template>
<script>
import addressStopEditModel from '../model/addressStopEditModel'
import { 
  DESCRIBE_WEBSHELL_STATUS,
  MODIFY_WEBSHELL_STATUS,
  MODIFY_HOST_MODE,
  DESCRIBE_AREABAN_AREAS,
  DESCRIBE_AREABAN_SUPPORT_AREAS
} from '@/constants'
import { flatObj } from '@/utils'
import { ErrorTips } from "@/components/ErrorTips"
import { COMMON_ERROR, POLICY_RULE_ACTION_ARR } from '../../constants'

export default {
  props: {
    domain: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      addressModel: false,
      advanceSetting: false,
      webShellStatus: false,
    }
  },
  watch: {
    domain(n) {
      if (n) {
        this.getWebShellStatus(n)
        this.getAreaBan(n)
        this.getAreaBanSupport()
      }
    },
  },
  components:{
    addressStopEditModel:addressStopEditModel
  },
  methods:{
    getAreaBanSupport() {
      this.axios.post(DESCRIBE_AREABAN_SUPPORT_AREAS, {
        Version: '2018-01-25',
      }).then(resp => {
        this.generalRespHandler(resp, () => {
          // TODO 获取支持禁用的地域列表
        },)
      })
    },
    getAreaBan({ Domain }) {
      this.axios.post(DESCRIBE_AREABAN_AREAS, {
        Version: '2018-01-25',
        Domain,
      }).then(resp => {
        this.generalRespHandler(resp, () => {
          // TODO 获取禁用地域
        })
      })
    },
    onChangeMode(status, domain) {
      // 返回 0 观察 1拦截
      this.domain.Mode = status^1 // 0 1互换
      this.axios.post(MODIFY_HOST_MODE, {
        Version: '2018-01-25',
        Domain: this.domain.Domain,
        DomainId: this.domain.DomainId,
        Mode: status ? 20 : 10 // 传入 10 规则观察 20 规则拦截
      }).then(resp => {
        this.generalRespHandler(resp, () => {
          this.domain.Mode = status
        }, COMMON_ERROR, '切换模式成功')
      })
    },
    onChangeWebShellStatus(status) {
      if (status === 0) {
        this.webShellStatus = 1
        this.$confirm('恶意文件检测功能关闭后，WAF将无法拦截恶意Webshell上传行为。', '关闭恶意文件检测', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        }).then(() => {
          this.updateWebShellStatus(status)
        }).catch(() => {
          this.webShellStatus = status^1    
        })
      } else {
        this.updateWebShellStatus(status)
      }
    },
    getWebShellStatus(Domain) {
      this.axios.post(DESCRIBE_WEBSHELL_STATUS, {
        Version: '2018-01-25',
        Domain,
      }).then(resp => {
        this.generalRespHandler(resp, ({ Status }) => {
          this.webShellStatus = Status
        })
      })
    },
    updateWebShellStatus(Status) {
      this.axios.post(MODIFY_WEBSHELL_STATUS, flatObj({
        Version: '2018-01-25',
        Webshell: {
          Domain: this.domain.Domain,
          Status,
        },
      })).then(resp => {
        this.generalRespHandler(resp, () => {
          this.getWebShellStatus(this.domain.Domain)
        }, COMMON_ERROR, '切换“恶意文件上传”状态成功')
      })
    },
    //编辑按钮
    editH(){
      this.$router.push({
        name:'editDominList'
      })
    },
    //关闭地域编辑弹框
    closeAddressModel(isShow){
      this.addressModel=isShow;
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  .refesher {
    text-align: right;
    .el-icon-refresh {
      font-size:20px;
    }
  }
  .main {
    margin-top: 15px;
    padding: 20px;
    background: #fff;
    h3 {
      margin-bottom: 10px;
    }
    & > div {
      border-bottom: 1px solid #ccc;
      padding-bottom: 15px;
      margin-bottom: 20px;
    }
    & > div:first-of-type {
      margin-right: 20px;
    }
    .item-container {
      & > div {
        margin-bottom: 20px;
      }
    }
  }
  .subText {
    font-size: 12px;
    color: #888;
  }
}
.table-head {
  color: #888;
  font-weight: 600;
}
</style>