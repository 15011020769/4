 <!--工作负载- CronJob -->
<template>
  <div>
    <subTitle title="CronJob" />

    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button @click="goWorkloadCreate('cronJob')" size="small" type="primary">新建</el-button>
        <!-- <el-button size="small">监控</el-button> -->
      </div>
      <!-- 右侧 -->
      <div class="grid-right">
        <tkeSearch
          typeSelect
          refreshData
          exportData
          typeLabel="命名空间"
          :typeOptions="searchOptions"
          :typeValue="searchType"
          inputPlaceholder="请输入关键词搜索"
          :searchInput="searchInput"
          @changeType="changeSearchType"
          @changeInput="changeSearchInput"
          @clickSearch="clickSearch"
          @refresh="refreshList"
          @exportExcel="exportExcel"
        ></tkeSearch>
      </div>
    </div>

    <!-- 数据列表展示 -->
    <div class="tke-card mt10" style="margin-top:12px;">
      <el-table
        :data="list.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)"
        v-loading="loadShow"
        id="exportTable"
        style="width: 100%"
      >
        <el-table-column label="名称">
          <template slot-scope="scope">
            <span class="tke-text-link" @click="goCronJobDetail(scope.row)">{{scope.row.metadata.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="执行策略">
          <template slot-scope="scope">
            <span>{{scope.row.spec.schedule}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="并行度">
          <template slot-scope="scope">
            <span>{{scope.row.spec.jobTemplate.spec.parallelism}}</span>
          </template>
        </el-table-column>

        <el-table-column prop label="重复次数">
          <template slot-scope="scope">
            <span>{{scope.row.spec.jobTemplate.spec.completions}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span class="tke-text-link" @click="goPodUpdate('number')">更新Pod数量</span>
            <span class="tke-text-link ml10" @click="goPodUpdate('config')">更新调度策略</span>
            <el-dropdown class="tke-dropdown">
              <span class="el-dropdown-link ml10">
                更多
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">
                  <span class="tke-text-link">编辑YAML</span>
                </el-dropdown-item>
                <el-dropdown-item command="a">
                  <span class="tke-text-link">删除</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <div class="tke-page">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import subTitle from "@/views/TKE/components/subTitle";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import XLSX from "xlsx";
import FileSaver from "file-saver";
import { ALL_CITY, TKE_COLONY_QUERY } from "@/constants";
export default {
  name: "colonyResourceCronJob",
  data() {
    return {
      loadShow: false, //加载是否显示
      list: [], //列表
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      multipleSelection: [],

      //搜索下拉框
      searchOptions: [],
      searchType: "default", //下拉选中的值
      searchInput: "" //输入的搜索关键字
    };
  },

  created() {
    // 从路由获取集群id
    this.clusterId = this.$route.query.clusterId;

    this.nameSpaceList();
    this.listData();
  },
  methods: {
    // 新建
    goWorkloadCreate(type) {
      this.$router.push({
        name: "workloadCreate",
        query: {
          type: type,
          clusterId: this.clusterId
        }
      });
    },
    //更新pod
    goPodUpdate(type) {
      this.$router.push({
        name: "podUpdate",
        query: {
          type: type,
          clusterId: this.clusterId
        }
      });
    },
    //选择搜索条件
    changeSearchType(val) {
      this.searchType = val;
      this.listData();
      console.log(this.searchType);
    },
    //监听搜索框的值
    changeSearchInput(val) {
      this.searchInput = val;
      console.log(this.searchInput);
    },
    // 点击搜索
    clickSearch(val) {
      this.searchInput = val;
      this.listData();
      console.log(this.searchInput);
    },
    //刷新数据
    refreshList() {
      console.log("refreshList....");
      this.listData();
    },
    // 导出表格
    exportExcel() {
      console.log("exportExcel...");
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector("#exportTable"));
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], {
            type: "application/octet-stream"
          }),
          this.$t("CVM.clBload.fzjh") + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },

    //跳转详情
    goCronJobDetail(rowData) {
      this.$router.push({
        name: "cronJobDetail",
        query: {
          clusterId: this.clusterId,
          spaceName: this.nameSpaceName,
          rowData: rowData
        }
      });
    },

    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val - 1;
      // this.getColonyList();
      this.pageIndex += 1;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      // this.getColonyList();
    },
    //命名空间选项
    nameSpaceList() {
      if (this.clusterId) {
        var params = {
          ClusterName: this.clusterId,
          Method: "GET",
          Path: "/api/v1/namespaces",
          Version: "2018-05-25"
        };
        // console.log(params)
        this.axios.post(TKE_COLONY_QUERY, params).then(res => {
          if (res.Response.Error == undefined) {
            var data = JSON.parse(res.Response.ResponseBody);
            var nameList = [];
            data.items.forEach(item => {
              nameList.push({
                value: item.metadata.name,
                label: item.metadata.name
              });
            });
            this.searchOptions = nameList;
            this.searchType = nameList[0].value;
          }
        });
      }
    },
    listData() {
      var params = {
        ClusterName: this.clusterId,
        Method: "GET",
        Path:
          "/apis/batch/v1beta1/namespaces/" +
          this.searchType +
          "/cronjobs?fieldSelector=metadata.name=" +
          this.searchInput,
        Version: "2018-05-25"
      };
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        if (res.Response.Error == undefined) {
          var data = JSON.parse(res.Response.ResponseBody);
          console.log(data);
          this.list = data.items;
          this.total = data.items.length;
        }
      });
    }
  },
  components: {
    subTitle,
    tkeSearch,
    Loading
  }
};
</script>

<style lang="scss" scoped>
</style>

