<template>
  <div class="apikey">
    <Headcom title="API密鑰管理" :backShow="false" />
    <div class="apikey_table">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column label="密钥">
          <template slot-scope="scope">
            <p>secretId:{{scope.row.secretId}}</p>
            <p>secretKey:{{scope.row.secretKey}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import Headcom from "@/components/public/Head"; //头部组件引入
  import {
    APIKEY
  } from "@/constants";
  export default {
    data() {
      return {
        tableData: []
      }
    },
    components: {
      Headcom
    },
    created() {
      this.getdata()
    },
    methods: {
      // this.$cookie.get('uin')
      // this.$cookie.get('subAccountName')
      getdata() {
        this.axios.get(`${process.env.VUE_APP_adminUrl +
        APIKEY}?uin=${this.$cookie.get('uin')}&subAccountName=${this.$cookie.get('subAccountName')}`).then(
          res => {
            this.tableData.push(res.tAccountSub)
          });
      }
    }
  }

</script>
<style lang="scss" scoped>
  .apikey {
    .apikey_table {
      margin: 20px;
    }
  }

</style>
