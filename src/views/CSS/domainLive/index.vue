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
      <el-table :data="tableData" height='450px'>
        <el-table-column prop="Name" label="域名" width="250">
          <template slot-scope="scope">
            <p class="Adetails">
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
            <el-button type="text" size='mini'>管理</el-button>
            <el-button type="text" size='mini'>禁用</el-button>
            <el-button type="text" size='mini'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <AdddomainLive :AddDialogVisible='DialogVisible' @AddhandleCancel='AddhandleCancel' />
    </div>

  </div>
</template>

<script>
  import Header from "@/components/public/Head";
  import AdddomainLive from './model/Newlydomain'
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
          0: "已停用",
          1: '已启用'
        },
        instanceType: {
          0: "推流域名",
          1: '播放域名'
        },
        DialogVisible: false
      }
    },
    components: {
      Header,
      AdddomainLive
    },
    created() {
      this.getDATA()
    },
    methods: {
      //获取数据
      getDATA() {
        const param = {
          Region: this.Region,
          Version: '2018-08-01',
          IsDelayLive: '1'
        };
        // 获取表格数据
        this.axios.post(DOMAIN_LIST, param).then(data => {
          if (data.Response.Error == undefined) {
            this.tableData = data.Response.DomainList
            console.log(data)
          } else {
            this.$message.error(data.Response.Error.Message);
          }
        });
      },
      //添加慢直播域名
      _Addto() {
        this.DialogVisible = true
      },
      AddhandleCancel(val) {
        this.DialogVisible = val
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
      color: red
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
