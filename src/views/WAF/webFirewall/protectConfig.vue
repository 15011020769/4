<template>
  <div class="container">
    <div class="editTitle">
      <i class="el-icon-back" @click="backListDomin"></i>{{t('防护设置', 'WAF.fhsz')}}
      <el-select v-model="selectedDomainId" class="domainList">
        <el-option v-for="item in domainList" :value="item.DomainId" :label="item.Domain" :key="item.DomainId"></el-option>
      </el-select>
    </div>
    <div class="tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="t('基础设置', 'WAF.jcsz')" name="first">
          <basicSettings :domain="domain" @change="changeDomain" />
        </el-tab-pane>
        <el-tab-pane :label="t('自定义策略', 'WAF.zdycl')" name="second">
          <customStrategy :domain="domain" />
        </el-tab-pane>
        <el-tab-pane :label="t('CC防护设置2.0', 'WAF.ccsz')" name="third">
          <ccProtectSet :domain="domain" />
        </el-tab-pane>
      </el-tabs>
    </div>
    
  </div>
</template>
<script>
import basicSettings from './tab/basicSettings'//基础设置
import customStrategy from './tab/customStrategy'//自定义策略
import ccProtectSet from './tab/ccProtectSet'//cc防护设置2.0
import { DESCRIBE_HOSTS } from '@/constants'
import { ErrorTips } from "@/components/ErrorTips"
import { COMMON_ERROR } from '../constants'

let loading
export default {
  data(){
    return{
      domainList: [], //域名列表
      domain: {},
      activeName: 'first',
      selectedDomainId: '',
    }
  },
  components:{
    basicSettings,
    customStrategy,
    ccProtectSet,
  },
  watch: {
    async selectedDomainId(n) {
      loading = this.$loading()
      const domain = await this.getDomains(n)
      this.setDomain(domain[0])
    }
  },
  async mounted() {
    const { domainId } = await this.$route.query
    this.selectedDomainId = domainId
    const domainList = await this.getDomains() // 查询所有域名 下拉框
    const currDomain = domainList.find(domain => domain.DomainId === domainId)
    this.domainList = domainList
  },
  methods:{
    async changeDomain() {
      const domain = await this.getDomains(this.domain.DomainId)
      this.setDomain(domain[0])
    },
    setDomain(currDomain) {
      this.domain = {
        ...currDomain,
        statusBool: !!currDomain.Status
      }
      loading && loading.close()
    },
    async getDomains(domainId) {
      const res = await this.axios.post(DESCRIBE_HOSTS, {
        Version: '2018-01-25',
        DomainId: domainId,
      })
      if (res.Response.Error) {
        let ErrOr = Object.assign(ErrorTips, COMMON_ERROR)
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: "error",
          showClose: true,
          duration: 0
        })
        return []
      }
      return res.Response.HostList
    },
     //返回域名列表
    backListDomin(){
      this.$router.go(-1)
    },
    //tab点击
    handleClick(){

    }
  }
}
</script>
<style lang="scss" scoped>
.editTitle{
  height:50px;
  // border-bottom:1px solid #ddd;
  padding:0 20px;
  line-height:50px;
  font-size:16px;
  font-weight: 600;
  background-color:#fff;
  .el-icon-back{
    margin-right:12px;
    color:#006eff;
  }
}
::v-deep button{
  height:30px;
  line-height:30px;
  padding:0 16px;
  border-radius: 0;
}
::v-deep input{
  height:30px;
  line-height: 30px;
  border-radius: 0;
}
.domainList{
  margin-left:10px;
}
.tabs{
  width:100%;
  height:40px;
  border-bottom:1px solid #ddd;
  background-color:#fff;
  padding:0 20px;
}
</style>