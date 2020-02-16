<template>
  <div>
    <div class="dominList">
      <div class="dominListTitle">
        域名列表
      </div>
      <div class="dominListBtn newClear">
        <el-button class="addDomin" @click="$router.push({name: 'protectDomain'})">添加域名</el-button>
        <el-button class="deleteBtn" @click="enableWAF">开启</el-button>
        <el-button class="deleteBtn" @click="disableWAF">关闭</el-button>
        <el-button class="deleteBtn" @click="del">删除</el-button>
        <span>一级域名套餐已用完，<a @click="packageUpgradeModel">立即升级</a>；子域名套餐还剩余18个。</span>
        <span class="floatRight">
          <el-input placeholder="支持域名、负载均衡名称、监听器名称模糊搜索" v-model="keyword" class="searchIpt"></el-input>
          <el-button class="el-icon-search" @click="getData"></el-button>
        </span>
      </div>
      <div class="tableList">
        <el-table :data="domains" @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column prop="domin" label="域名/ID">
            <template slot-scope="scope">
              <el-link type="primary">{{scope.row.Domain}}</el-link>
              <p>{{scope.row.DomainId}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="proStatus" label="流量模式" width="120">
            <div slot="header" style="padding: 0;">
              流量模式 
              <el-tooltip content="您目前使用了高防、CDN、雲加速等代理" placement="right" effect="light">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </div>
            <template slot-scope="scope">
              {{scope.row.Mode === 1 ? '镜像模式' : '清洗模式'}}
            </template>
          </el-table-column>
          <el-table-column prop="vipAddress" label="区域" width="60">
            <template slot-scope="scope">
              {{scope.row.Region || '无'}}
            </template>
          </el-table-column>
          <el-table-column prop="useType" label="负载均衡（ID）">
            <template slot-scope="scope">
              <span v-if="scope.row.LoadBalancerSet.length">
                {{scope.row.LoadBalancerSet[0].LoadBalancerName}}({{scope.row.LoadBalancerSet[0].LoadBalancerId}})
              </span>
              <span v-else>
                未配置
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="resouIpAdd" label="负载均衡VIP" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.LoadBalancerSet.length">
                {{scope.row.LoadBalancerSet[0].Vip}}
              </span>
              <span v-else>
                未配置
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="useType" label="监听器" width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.LoadBalancerSet.length">
                <p v-for="lb in scope.row.LoadBalancerSet" class="ellipsis" :key="lb.ListenerName">
                  {{lb.ListenerName}}({{lb.Protocol}}:{{lb.Vport}})
                </p>
              </span>
              <span v-else>
                未配置
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="logSwitch" label="访问日志开关">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.ClsStatusBool"
                active-color="#006eff"
                inactive-color="#bbb">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="wafSwitch" label="WAF开关">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.StatusBool"
                active-color="#006eff"
                inactive-color="#bbb">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="action" label="操作" width="250">
            <template slot-scope="scope">
              <el-popover
                placement="bottom"
                width="280"
                v-model="deleteVisible">
                <div class="prpoDialog">
                  <h1>确定删除此域名？</h1>
                  <p>删除后源站IP将会遭受恶意攻击的威胁。</p>
                </div>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="deleteVisible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteVisibleSure(scope.$index)">确定</el-button>
                </div>
                <el-button slot="reference" style="color:#3E8EF7;">删除</el-button>
              </el-popover>
              <el-button type="text" size="small" @click="handelEdit(scope.row)">编辑</el-button>
              <el-button @click.native.prevent="toProtectConfig(scope.$index, tableDataBegin)" type="text" size="small">防护配置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <packageUpgradeModel :isShow="packageUpModelShow" @packageUpModelClose="packageUpModelClose"/>
  </div>
</template>
<script>
import packageUpgradeModel from '../model/packageUpgradeModel'
import { DESCRIBE_HOSTS } from '@/constants'
import { ErrorTips } from "@/components/ErrorTips"
import { PACKAGE_CFG_TYPES, COMMON_ERROR } from '../../constants'
export default {
  data(){
    return{
      domains: [],//表格数据
      keyword: "",//搜索框绑定
      logSwitchValue:true,//访问日志开关
      deleteVisible:false,//删除提示框
      packageUpModelShow:false,//弹框
    }
  },
  components:{
    packageUpgradeModel:packageUpgradeModel,//升级
  },
  mounted(){
    this.getData()
  },
  methods:{
    enableWAF() {

    },
    disableWAF() {

    },
    del() {

    },
    //checkbox
    handleSelectionChange(val){
      this.deleteArr=val
    },
    //获取数据
    getData() {
      this.axios.post(DESCRIBE_HOSTS, {
        Version: '2018-01-25'
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
          const domains = Response.HostList
          domains.forEach(domain => {
            domain.StatusBool = !!domain.Status
            domain.ClsStatusBool = !!domain.ClsStatus
          })
          this.domains = domains
        }
      })
    },
    //点击编辑按钮
    handelEdit(domain){
      this.$router.push({
        name:'protectDomain',
        params: {
          domain,
        }
      })
    },
    //跳转防护配置页
    toProtectConfig(){
      this.$router.push({
        name:'protectConfig'
      })
    },
    //升级按钮
    packageUpgradeModel(){
      this.packageUpModelShow = true
    },
    //升级弹框关闭按钮
    packageUpModelClose(isShow){
      this.packageUpModelShow = isShow
    },
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  display: inline-block;
  content:'';
  clear:both;
}
::v-deep button{
  border-radius: 0;
  height:30px;
  line-height: 30px;
  padding:0 16px;
  border:none;
  outline: none;
}
::v-deep input{
  height: 30px;
  line-height: 30px;
  border-radius: 0;
}
.dominList{
  width:100%;
  min-height:100px;
  background-color:#fff;
  margin-top:20px;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
  padding: 20px;
  .dominListTitle{
    font-size:14px;
    color:#000;
    font-weight: 600;
    margin-bottom:20px;
  }
  .dominListBtn{
    margin-bottom:12px;
    .addDomin{
      background-color:#006eff;
      color:#fff;
    }
    .deleteBtn{
      border:1px solid #ddd;
      background-color:transparent;
      &:last-of-type {
        margin-right:12px;
      }
    }
    .floatRight{
      float:right;
      width:400px;
      .searchIpt{
        width:300px;
        float:left;
        input{
          width:200px;
        }
      }
      .el-icon-search{
        border:1px solid #ddd;
      }
    }
  }
  .tableList{
    min-height: 450px;
    ::v-deep .el-table__header{
      ::v-deep tr{
        ::v-deep th:nth-child(7){
          text-align:center;
        }
        ::v-deep th:nth-child(8){
          text-align:center;
        }
        ::v-deep th:nth-child(9){
          text-align:center;
        }
      }
    }
  }
  .tabListPage{
    height:50px;
    border-top:1px solid #ddd;
    padding-top:8px;
    text-align:right;
  }
}
.el-icon-info{
  margin-left:10px;
}
::v-deep button.el-tooltip:hover{
  background: transparent;
  color:#606266;
}
.prpoDialog{
  text-align:center;
  h1{
    font-size:14px;
    font-weight: 600;
    color:#000;
    margin-top:16px;
  }
  p{
    margin:16px 0;
  }
}
::v-deep .el-popover{
  width:300px!important;
  height:136px!important;
}
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>