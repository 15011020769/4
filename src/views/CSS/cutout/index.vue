<template>
  <div class="cutout-wrap">
    <div>
      <Header :backShow="false" :title="$t('CSS.cutout.0')" />
    </div>
    <div class="toolbar">
      <XTimeX v-on:switchData="GetDat" :classsvalue="value" :granularity="false"></XTimeX>
      <div class="search">
        <el-input v-model="searchInput" :placeholder="$t('CSS.cutout.2')"></el-input>
        <el-button type="primary" size="small" class="searchbtn" @click="doFilter">{{$t('CSS.cutout.1')}}</el-button>
      </div>
    </div>
    <div class="cutoutTable">
      <div class="tableWrap">
        <el-table :data="tableData">
          <el-table-column prop="StreamName" :label="$t('CSS.cutout.3')">
          </el-table-column>
          <el-table-column prop="AppName" :label="$t('CSS.cutout.4')">
          </el-table-column>
          <el-table-column prop="DomainName" label="域名">
          </el-table-column>
          <el-table-column prop="StreamStartTime" :label="$t('CSS.cutout.5')">
            <template slot-scope="scope">
              {{format(scope.row.StreamStartTime)}}
            </template>
          </el-table-column>
          <el-table-column prop="StreamEndTime" :label="$t('CSS.cutout.6')">
             <template slot-scope="scope">
              {{format(scope.row.StreamEndTime)}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('CSS.cutout.7')">
             <template slot-scope="scope">
              {{duration(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column prop="ClientIp" label="推流客户端IP">
          </el-table-column>
          <el-table-column prop="StopReason" :label="$t('CSS.cutout.8')">
          </el-table-column>
        </el-table>
      </div>
      <div class="tabListPage">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from "@/components/public/Head";
  import XTimeX from "@/components/public/TimeY";
  import moment from "moment";
  import {
    CUTOUT_LIST
  } from "@/constants";
  export default {
    name: 'cutout',
    data() {
      return {
        StartTime: '',
        EndTime: '',
        value: 1,
        searchInput: '',
        tableData: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
      }
    },
    components: {
      Header,
      XTimeX
    },
    methods: {
      duration(row) {
        let t = moment(row.StreamEndTime).diff(moment(row.StreamStartTime), 's')
        // 抄的腾讯的
        var n = 0
            , r = 0
            , a = 0;
        Number(t) > 60 && (n = Math.floor(t / 60),
        t = Math.floor(t % 60),
        n >= 60 && (r = Math.floor(n / 60),
        n = Math.floor(n % 60),
        r >= 24 && (a = Math.floor(r / 24),
        r = Math.floor(r % 24))));
        var o = "" + Math.floor(t) + "秒";
        return n > 0 && (o = "" + Math.floor(n) + "分" + o),
        r > 0 && (o = "" + Math.floor(r) + "小时" + o),
        a > 0 && (o = "" + Math.floor(a) + "天" + o),
        o
      },
      format(utcDate) {
        return moment(utcDate).format('YYYY-MM-DD HH:mm:ss')
      },
      //获取数据
      GetDat(params) {
        this.StartTime = params[1].StartTIme
        this.EndTime = params[1].EndTIme
        this.value = params[2]
        this.$nextTick(this.getDATA)
      },
      getDATA() {
        const param = {
          Version: '2018-08-01',
          StartTime: moment(this.StartTime).utc().format(),
          EndTime: moment(this.EndTime).utc().format(),
          IsFilter: 0,
          IsAsc: 0,
        };
        if (this.searchInput != '') {
          param['StreamName'] = this.searchInput
        }
        // 获取表格数据
        this.axios.post(CUTOUT_LIST, param).then(data => {
          if (data.Response.Error == undefined) {
            this.tableData = data.Response.EventList
            this.total = data.Response.TotalNum
          } else {
            this.$message.error(data.Response.Error.Message);
          }
        });
      },
      doFilter() {
        this.currentPage = 1
        this.$nextTick(this.getDATA)
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.$nextTick(this.getDATA)
      },
      handleCurrentChange(val) {
        this.pageNum = val;
        this.$nextTick(this.getDATA)
      }
    },
  }

</script>

<style lang="scss" scoped>
  .cutout-wrap {
    .toolbar {
      display: flex;
      margin-top: 20px;
      .search {
        display: flex;
        margin-left: 50px;

        ::v-deep .el-input__inner {
          height: 34px !important;
        }

        .searchbtn {
          margin-left: 30px;
        }
      }
    }
    .cutoutTable {
      padding: 20px 20px 0px 20px;
      box-sizing: border-box;
      width: 100%;
      .tableWrap {
        width: 100%;
        min-height: 450px;
        background: white;
        .Right-style {
          display: flex;
          justify-content: flex-end;

          .esach-inputL {
            width: 300px;
            margin-right: 20px;
          }
        }
        .page-box {
          padding: 20px;
          padding-right: 30px;
          box-sizing: border-box;
        }
      }
    }
    .tabListPage{
      height:50px;
      padding-top:8px;
      border-top:1px solid #ddd;
      text-align:right;
      background-color:#fff;
      ::v-deep .el-input__inner {
        width: 100% !important;
        height: 30px !important;
      }
    }
  }

</style>
