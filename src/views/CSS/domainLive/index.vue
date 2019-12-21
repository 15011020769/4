<template>
  <div class="domainLive-wrap">
    <div>
      <Header :backShow="false" title="域名管理" />
    </div>
    <div class="toolbar">
      <div class="Tips">
        关于推流域名：慢直播已为您提供系统推流域名，您亦可添加自有已备案域名进行推流。
      </div>
      <div class="Tips">
        关于播放域名：您需要添加自有已备案域名进行慢直播播放，更多域名管理使用方法参见域名管理和CNAME配置
      </div>
      <div class="Addto">
        <el-button type="primary" size="small" @click="_Addto">添加域名</el-button>
      </div>
    </div>
    <div class="tableStyle">
      <el-table :data="tableData" height='450px' v-loading="loadShow">
        <el-table-column prop="Name" label="域名" width="250">
          <template slot-scope="scope">
            <p class="Adetails" @click="jump(scope.row.Name)">
              {{scope.row.Name}}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="TargetDomain" label="CNAME" width="250">
        </el-table-column>
        <el-table-column prop="Type" label="类型">
          <template slot-scope="scope">
            <p>
              {{instanceType[scope.row.Type]}}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="Status" label="状态">
          <template slot-scope="scope">
            <p :class="scope.row.Status===1?'green':'red'">
              {{instanceStatus[scope.row.Status]}}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" label="添加时间">
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size='mini' @click="jump(scope.row.Name)">管理</el-button>
            <el-button type="text" size='mini' @click="_progibitdomain(scope.row.Name)" v-if="scope.row.Status===1">禁用
            </el-button>
            <el-button type="text" size='mini' @click="_Enabledomain(scope.row.Name)" v-if="scope.row.Status===0">启用
            </el-button>
            <el-button type="text" size='mini' @click="_deldomain(scope.row.Name,scope.row.Type)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <AdddomainLive :AddDialogVisible='AddDialogVisible' @AddhandleCancel='AddhandleCancel' />
    </div>
    <div>
      <DeldomainLive :DelDialogVisible='DelDialogVisible' :DomainType='DomainType' :DomainName='DomainName'
        @DelhandleCancel='DelhandleCancel' />
    </div>
    <div>
      <ProhibitdomLive :ProhibitDialogVisible='ProhibitDialogVisible' :DomainName='DomainName'
        @ProhibithandleCancel='ProhibithandleCancel' />
    </div>
    <div>
      <Enabledomain :EnableDialogVisible='EnableDialogVisible' :DomainName='DomainName'
        @EnablehandleCancel='EnablehandleCancel' />
    </div>
  </div>
</template>

<script>
  import Header from "@/components/public/Head";
  import AdddomainLive from './model/Newlydomain' //添加域名
  import DeldomainLive from './model/deletedomain' //删除域名
  import ProhibitdomLive from './model/Prohibitdomain' //禁用域名
  import Enabledomain from './model/Enabledomain' //启用域名

  import {
    DOMAIN_LIST
  } from "@/constants";
  export default {
    name: 'domainLive',
    data() {
      return {
        tableData: [], //表格数据
        Region: this.$cookie.get("regionv2"),
        instanceStatus: {
          0: "未启用",
          1: '已启用'
        },
        instanceType: {
          0: "推流域名",
          1: '播放域名'
        },
        AddDialogVisible: false, //添加域名模态框
        DelDialogVisible: false, //删除域名模态框
        ProhibitDialogVisible: false, //禁用域名模态框
        EnableDialogVisible: false, //启用域名模态框
        DomainName: '',
        DomainType: '',
        loadShow: true
      }
    },
    components: {
      Header,
      AdddomainLive,
      DeldomainLive,
      ProhibitdomLive,
      Enabledomain
    },
    created() {
      this.getDATA()
    },
    methods: {
      //获取数据
      getDATA() {
        this.loadShow = true
        const param = {
          Region: this.Region,
          Version: '2018-08-01',
          IsDelayLive: '1'
        };
        // 获取表格数据
        this.axios.post(DOMAIN_LIST, param).then(data => {
          if (data.Response.Error == undefined) {
            this.tableData = data.Response.DomainList
            this.loadShow = false
          } else {
            this.$message.error(data.Response.Error.Message);
          }
        });
      },
      //添加慢直播域名
      _Addto() {
        this.AddDialogVisible = true
      },
      //关闭添加域名模态框
      AddhandleCancel(val) {
        this.AddDialogVisible = val
      },
      //删除域名
      _deldomain(val, value) {
        this.DomainName = val
        this.DomainType = value
        this.DelDialogVisible = true
      },
      //关闭删除域名模态框
      DelhandleCancel(val) {
        this.DelDialogVisible = val
      },
      //禁用域名_Enabledomain
      _progibitdomain(val) {
        this.DomainName = val
        this.ProhibitDialogVisible = true
      },
      //关闭禁用域名模态框
      ProhibithandleCancel(val) {
        this.ProhibitDialogVisible = val
      },
      //启用域名
      _Enabledomain(val) {
        this.DomainName = val
        this.EnableDialogVisible = true
      },
      //关闭启用域名模态框
      EnablehandleCancel(val) {
        this.EnableDialogVisible = val
      },
      jump(name) {
        this.$router.push({
          name: "domainLivedetails",
          query: {
            name
          }
        });
      }


    },
  }

</script>

<style lang="scss" scoped>
  .domainLive-wrap {
    .green {
      color: #0abf5b
    }

    .red {
      color: #e54545
    }

    .Adetails {
      color: #3E8EF7;
      cursor: pointer;
    }

    .toolbar {
      .Tips {
        padding: 10px 30px 10px 20px;
        vertical-align: middle;
        color: #003b80;
        border: 1px solid #97c7ff;
        border-radius: 2px;
        background: #e5f0ff;
        position: relative;
        box-sizing: border-box;
        margin: 20px;
      }

      .Addto {
        margin-left: 20px;
      }
    }

    .tableStyle {
      margin: 20px;
    }
  }

</style>
