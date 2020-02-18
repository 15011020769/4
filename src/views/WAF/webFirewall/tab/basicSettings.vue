<template>
  <div class="container">
      <div class="refesher">
        <i class="el-icon-refresh"></i>
      </div>
      <el-row class="main">
        <el-row type="flex">
          <el-col>
            <h3>WAF开关</h3>
            <el-row type="flex" :gutter="20" align="middle" justify="center">
              <el-col class="subText" :span="4">WAF状态</el-col>
              <el-col>
                <el-switch v-model="domain.statusBool" />
              </el-col>
            </el-row>
            <el-row type="flex" style="margin-top: 10px">
              <el-col :span="4"></el-col>
              <el-col>
                <p class="subText">关闭WAF总开关后，WAF将不再对经过负载均衡监听器的流量进行防护，WAF所有功能也将失效。</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col>
            <h3>WAF防护状态</h3>
            <el-row type="flex" :gutter="20" align="middle" justify="center">
              <el-col class="subText" :span="4">规则使用模式</el-col>
              <el-col>
                <el-radio-group size="small" v-model="domain.Mode" @change="onChangeMode">
                  <el-radio-button :label="0">观察</el-radio-button>
                  <el-radio-button :label="1">拦截</el-radio-button>
                </el-radio-group>
              </el-col>
            </el-row>
            <el-row type="flex" style="margin-top: 10px">
              <el-col :span="4"></el-col>
              <el-col style="margin-left: 5px;">
                <el-link type="primary" style="cursor: pointer" @click="advanceSetting=!advanceSetting">
                  高级设置 
                  <i class="el-icon-caret-bottom" v-show="!advanceSetting" />
                  <i class="el-icon-caret-top" v-show="advanceSetting"/>
                </el-link>
              </el-col>
            </el-row>
            <el-row type="flex" style="margin-top: 10px" v-show="advanceSetting">
              <el-col :span="4"></el-col>
              <el-col class="subText" style="margin-left: 17px" :span="4">恶意文件检测</el-col>
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
                waf.dhycloud.com
              </el-col>
            </el-row>
            <el-row type="flex" :gutter="20" align="middle" justify="center">
              <el-col class="subText" :span="4">ID</el-col>
              <el-col>
                waf.dhycloud.com
              </el-col>
            </el-row>
            <el-row type="flex" :gutter="20" align="middle" justify="center">
              <el-col class="subText" :span="4">代理情况</el-col>
              <el-col>
                waf.dhycloud.com
              </el-col>
            </el-row>
            <el-row type="flex" :gutter="20" align="middle" justify="center">
              <el-col class="subText" :span="4">流量模式</el-col>
              <el-col>
                waf.dhycloud.com
              </el-col>
            </el-row>
          </el-col>
          <el-col class="item-container">
            <h3>地域封禁</h3>
            <el-row type="flex" :gutter="20" align="middle" justify="center">
              <el-col class="subText" :span="4">封禁状态</el-col>
              <el-col>
                <el-switch />
              </el-col>
            </el-row>
            <el-row type="flex" style="margin-top: 10px">
              <el-col :span="4"></el-col>
              <el-col>
                <p class="subText" style="margin-left: 8px">可以选择国内省份和海外地区进行封禁。</p>
              </el-col>
            </el-row>
            <el-row type="flex">
              <el-col :span="4">封禁地域</el-col>
              <el-col>
                <p class="subText">国内全部</p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col class="item-container">
            <h3>负载均衡 - 监听器</h3>
            <el-row>
              <el-col>区域</el-col>
              <el-col>负载均衡（ID）</el-col>
              <el-col>负载均衡VIP</el-col>
              <el-col>监听器</el-col>
            </el-row>
            <el-row>
              <el-col>广州</el-col>
              <el-col>lb-3ba257(lb-3k1yq</el-col>
              <el-col>203.195.183.195203.19</el-col>
              <el-col>勿删(HTTP:80)勿删</el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-row>
      <addressStopEditModel :isShow="addressModel" @closeAddressModel="closeAddressModel"/>
  </div>
</template>
<script>
import addressStopEditModel from '../model/addressStopEditModel'
import { DESCRIBE_WEBSHELL_STATUS, MODIFY_WEBSHELL_STATUS, MODIFY_HOST_MODE } from '@/constants'
import { flatObj } from '@/utils'
import { ErrorTips } from "@/components/ErrorTips"
import { COMMON_ERROR } from '../../constants'

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
      }
    },
  },
  mounted() {

  },
  components:{
    addressStopEditModel:addressStopEditModel
  },
  methods:{
    onChangeMode(Mode) {
      delete domain.statusBool
      this.axios.post(MODIFY_HOST_MODE, {
        Version: '2018-01-25',
        Domain: this.domain.Domain,
        DomainId: this.domain.DomainId,
        Mode: 0 ? 10 : 20 // 10 规则观察 20 规则拦截
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
          this.$emit('change')
        }
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
          this.webShellStatus = Math.abs(status - 1)     
        })
      } else {
        this.updateWebShellStatus(status)
      }
    },
    getWebShellStatus(Domain) {
      this.axios.post(DESCRIBE_WEBSHELL_STATUS, {
        Version: '2018-01-25',
        Domain,
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
          console.log(Response.Status)
          this.webShellStatus = Response.Status
        }
      })
    },
    updateWebShellStatus(Status) {
      this.axios.post(MODIFY_WEBSHELL_STATUS, flatObj({
        Version: '2018-01-25',
        Webshell: {
          Domain: this.domain.Domain,
          Status,
        },
      })).then(({ Response }) => {
        if (Response.Error) {
          let ErrOr = Object.assign(ErrorTips, COMMON_ERROR)
          this.$message({
            message: ErrOr[Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          })
        } else {
          this.getWebShellStatus(this.domain.Domain)
          this.$message({
            message: '切换“恶意文件上传”状态成功',
            type: "success",
            showClose: true,
            duration: 0
          })
        }
      })
    },
    //编辑按钮
    editH(){
      this.$router.push({
        name:'editDominList'
      })
    },
    //观察拦截事件
    ruleUseType(thisType){
      this.thisType=thisType;
      // console.log(thisType);
    },
    //WAF状态事件
    switchChange(){

    },
    //地域编辑按钮
    editAddress(){
      this.addressModel=true;
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
</style>