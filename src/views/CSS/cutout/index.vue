<template>
  <div class="cutout-wrap">
    <div>
      <Header :backShow="false" title="断流诊断" />
    </div>
    <div class="toolbar">
      <XTimeX v-on:switchData="GetDat" :classsvalue="value"></XTimeX>
      <div class="search">
        <el-input v-model="searchInput" placeholder="输入推流名称" @change="_searchchange"></el-input>
        <el-button type="primary" size="small" class="searchbtn" @click="_search">查询</el-button>
      </div>
    </div>
    <div class="tableStyle">
      <el-table :data="tableData" height='450px'>
        <el-table-column prop="" label="流名称">
        </el-table-column>
        <el-table-column prop="" label="路径">
        </el-table-column>
        <el-table-column prop="" label="域名">
        </el-table-column>
        <el-table-column prop="" label="开始时间">
        </el-table-column>
        <el-table-column prop="" label="结束时间">
        </el-table-column>
        <el-table-column prop="" label="推流时长">
        </el-table-column>
        <el-table-column prop="" label="推流客户端IP">
        </el-table-column>
        <el-table-column prop="" label="断流原因(错误码)">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import Header from "@/components/public/Head";
  import XTimeX from "@/components/public/TimeN";
  import moment from "moment";
  import {
    CUTOUT_LIST
  } from "@/constants";
  export default {
    name: 'cutout',
    data() {
      return {
        Start_End: [],
        value: 1,
        searchInput: '',
        tableData: [],
        Region: this.$cookie.get("regionv2")
      }
    },
    components: {
      Header,
      XTimeX
    },
    methods: {
      //获取数据
      GetDat(data) {
        this.Start_End = data[0];
        this.value = data[1];
        this.getDATA()
      },
      getDATA() {
        const param = {
          Region: this.Region,
          Version: '2018-08-01',
          StartTime: moment(this.Start_End.StartTIme).utc().format(),
          EndTime: moment(this.Start_End.EndTIme).utc().format()
        };
        if (this.searchInput != '') {
          param['StreamName'] = this.searchInput
        }
        // 获取表格数据
        this.axios.post(CUTOUT_LIST, param).then(data => {
          if (data.Response.Error == undefined) {
            console.log(data)
          } else {
            this.$message.error(data.Response.Error.Message);
          }
        });
      },
      _search() {
        if (this.searchInput == '') {
          this.$message('请输入流名称');
        } else {
          this.getDATA()
        }
      },
      _searchchange() {
        if (this.searchInput == '') {
          this.getDATA()
        }
      }
    },
  }

</script>

<style lang="scss" scoped>
  .cutout-wrap {
    .toolbar {
      display: flex;

      .search {
        display: flex;
        margin-top: 20px;
        margin-left: 50px;

        ::v-deep .el-input__inner {
          height: 34px !important;
        }

        .searchbtn {
          margin-left: 30px;
        }
      }
    }

    .tableStyle {
      margin: 20px;
    }
  }

</style>
