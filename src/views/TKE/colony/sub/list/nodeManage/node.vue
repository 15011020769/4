<!-- 节点列表 -->
<template>
  <div>
    <subTitle title="节点列表" />

    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid ">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button size="small" @click="goExpand" type="primary"
          >新建节点</el-button
        >
        <el-button size="small">监控</el-button>
        <el-button size="small" @click="goAddExist">添加已有节点</el-button>
        <el-button size="small" disabled="">移除</el-button>
        <el-button size="small" disabled="">封锁</el-button>
        <el-button size="small" disabled="">解除封锁</el-button>
      </div>
      <!-- 右侧 -->
      <div class="grid-right">
        <tkeSearch
          exportData
          inputPlaceholder="请输入IP或节点名/ID"
          :searchInput="searchInput"
          @changeInput="changeSearchInput"
          @clickSearch="clickSearch"
          @exportExcel="exportExcel"
        >
        </tkeSearch>
      </div>
    </div>

    <!-- 数据列表展示 -->
    <div class="tke-card mt10">
      <el-table
        @selection-change="handleSelectionChange"
        :data="list"
        v-loading="loadShow"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="ID/节点名">
          <template slot-scope="scope">
            <span @click="goNodeDetail()" class="tke-text-link"
              >ins-8czy2x5q</span
            >
            <p>as-test02</p>
          </template>
        </el-table-column>
        <el-table-column prop="" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === true" class="text-green"
              >健康</span
            >
            <span v-else class="text-red">异常</span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="可用区">
          <template slot-scope="scope">
            <el-tooltip effect="light" content="台北一区" placement="top">
              <span>台北一区</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="" label="kubernetes版本">
          <template slot-scope="scope">
            <el-tooltip effect="light" content="v1.10.5-tke.6" placement="top">
              <span>v1.10.5-tke.6</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="address" width="200" label="配置">
          <template slot-scope="scope">
            标准型S3 <br />
            1核 , 1GB , 1 Mbps<br />
            系统盘: 50GB 高性能云硬盘<br />
          </template>
        </el-table-column>
        <el-table-column prop="nodeTotal" label="IP地址">
          <template slot-scope="scope">
            <p>175.97.134.163</p>
            <p>10.209.64.102</p>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="已分配/总资源">
          <template slot-scope="scope">
            <p>CPU: -/-</p>
            <p>内存: -/-</p>
          </template>
        </el-table-column>
        <el-table-column prop="" label="所属伸缩组">
          <template slot-scope="scope">
            <p>asg-p3mt06kq</p>
          </template>
        </el-table-column>
        <el-table-column width="200" prop="" label="计费模式">
          <template slot-scope="scope">
            <p>按量计费-竞价</p>
            <p>2020-01-08 09:40:34创建</p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <p class="tke-text-link">移出</p>

            <el-dropdown class=" tke-dropdown">
              <span class="el-dropdown-link ">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a"
                  ><span class="tke-text-link">封锁</span></el-dropdown-item
                >
                <el-dropdown-item command="a"
                  ><span class="tke-text-link">取消封锁</span></el-dropdown-item
                >
                <el-dropdown-item command="b"
                  ><span class="tke-text-link">驱逐</span></el-dropdown-item
                >
                <el-dropdown-item command="c"
                  ><span class="tke-text-link">编辑标签</span></el-dropdown-item
                >
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
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import subTitle from "@/views/TKE/components/subTitle";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import { ALL_CITYk, POINT_REQUEST } from "@/constants";
export default {
  name: "colonyNodeManageNode",
  data() {
    return {
      clusterId: "",
      searchInput: "", // 输入的搜索关键字
      loadShow: false, // 加载是否显示
      list: [
        {
          status: false
        },
        {
          status: true
        }
      ], // 列表
      total: 0,
      pageSize: 10,
      pageIndex: 0,
      multipleSelection: []
    };
  },
  components: {
    subTitle,
    Loading,
    tkeSearch
  },
  created() {
    // 从路由获取集群id
    this.clusterId = this.$route.query.clusterId;
    this.ForwardRequest()
  },
  methods: {
    // 监听搜索框的值
    changeSearchInput(val) {
      this.searchInput = val;
      console.log(this.searchInput);
    },
    // 点击搜索
    clickSearch(val) {
      this.searchInput = val;
      console.log(this.searchInput);
    },

    // 导出表格
    exportExcel() {
      console.log("exportExcel...");
      /* generate workbook object from table */
      // var wb = XLSX.utils.table_to_book(document.querySelector("#exportTable"));
      /* get binary string as output */
      // var wbout = XLSX.write(wb, {
      //   bookType: "xlsx",
      //   bookSST: true,
      //   type: "array"
      // });
      // try {
      //   FileSaver.saveAs(
      //     new Blob([wbout], {
      //       type: "application/octet-stream"
      //     }),
      //     this.$t("CVM.clBload.fzjh") + ".xlsx"
      //   );
      // } catch (e) {
      //   if (typeof console !== "undefined") console.log(e, wbout);
      // }
      // return wbout;
    },

    // 新建节点跳转
    goExpand() {
      this.$router.push({
        name: "clusterExpand",
        query: {
          clusterId: this.clusterId
        }
      });
    },

    // 添加已有节点跳转呢
    goAddExist() {
      this.$router.push({
        name: "clusterAddExist",
        query: {
          clusterId: this.clusterId
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

    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 详情
    goNodeDetail() {
      this.$router.push({
        name: "nodeDetail",
        query: {
          clusterId: this.clusterId
        }
      });
    },
    ForwardRequest () {
      const param = {
        Method: 'GET',
        Path: '/api/v1/nodes',
        Version: '2018-05-25',
        ClusterName: 'cls-n1xokuh6'
      }
      this.axios.post(POINT_REQUEST, param).then(res => {
        console.log(JSON.parse(res.Response.ResponseBody))
        if (res.code === 0) {
          this.loadShow = true
        }
      })
    },
  }
};
</script>

<style lang="scss" scoped></style>
