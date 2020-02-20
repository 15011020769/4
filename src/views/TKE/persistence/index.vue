<template>
  <div class="persistence-wrap" v-loading="funllscreenLoading">
    <div class="back-hd flex">
      <h2>事件持久化</h2>
      <div style="width:20px"></div>
      <el-button type="primary" class="init hd-button">中国台北</el-button>
    </div>
    <div class="app-tke-fe-content__inner">
      <div class="tf-g">
        <!-- 搜索框 -->
        <!-- <div class="flex" style="justify-content: flex-end;  position: relative;">
          <input placeholder="请输入集群名称" clearable class="search" v-model.trim="input" />
          <button class="el-icon-search ip-btn" @click="searchList"></button>
        </div>-->
        <!-- 右侧 -->
        <div
          class="grid-right flex"
          style="justify-content: flex-end;  position: relative; bottom:10px;"
        >
          <tkeSearch
            :exportData="false"
            inputPlaceholder="请输入集群名称"
            :typeSelect="false"
            :typeOptions="searchOptions"
            :searchInput="searchInput"
            :typeValue="searchSelect"
            @changeType="changeType"
            @changeInput="changeSearchInput"
            @clickSearch="clickSearch"
          ></tkeSearch>
        </div>
        <!-- 内容 -->
        <el-table :data="tableData" style="width: 100%" v-loading="loadShow">
          <el-table-column label="ID/名称" width="250">
            <template slot-scope="scope">
              <span
                :class="[
                  scope.row.ClusterStatus == 'Running' ? 'tke-text-link' : ''
                ]"
                @click="
                  scope.row.ClusterStatus == 'Running'
                    ? goColonySub(scope.row.ClusterId)
                    : ''
                "
              >{{ scope.row.ClusterId }}</span>
              <br />
              <span>{{ scope.row.ClusterName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="状态" width="250">
            <template slot-scope="scope">
              <span v-if="scope.row.ClusterStatus == 'Running'" class="text-green">已开启<i style="color:#0abf5b;font-weight:900" class="el-icon-circle-check"></i></span>
              <span v-else-if="scope.row.ClusterStatus == 'Creating'" class="text-green">已开启<i style="color:#0abf5b;font-weight:900" class="el-icon-circle-check"></i></span>
              <span v-else class="text-red">未开启</span>
            </template>
          </el-table-column>
          <el-table-column label="存储端" width="250">
            <template slot-scope="scope">
              <span v-if="scope.row">Elasticsearch</span>
              <span v-else-if="!scope.row">-</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="date" label="存储对象" width="180"></el-table-column> -->
          <el-table-column label="存储对象" width="320">
            <template slot-scope="scope">
              <span v-if="scope.row">
                ES地址( https://233.13.41.5:5452 )
                <br />索引( ffff )
              </span>
              <span v-else-if="!scope.row">-</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">设置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  CreateListGroups,
  WARNING_GetCOLONY,
  WARNING_GetUSER,
  TKE_COLONY_STATUS,
} from "@/constants";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import {
  TKE_COLONY_LIST,
  TKE_COLONY_QUERY
} from "@/constants/TKE-jz";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共错误码
import HeadCom from "@/components/public/Head";
export default {
  name: "persistence",
  data() {
    return {
      list: [],
      funllscreenLoading: false,
      tableData: [], //表格数据
      input: "", //搜索
      loadShow: true, // 加载是否显示
      total: 0,
      pageSize: 10,
      pageIndex: 0,
      searchSelect: "",
      searchInput: "",
      listStatus: [], // 集群列表节点数状态
      listStatusArr: [], // 集群列表节点数状态
      searchOptions: [
        {
          value: "name",
          label: "名称"
        },
        {
          value: "tag",
          label: "标签"
        }
      ]
    };
  },
  created() {
    this.getData();
    this.getColonyList();
  },
  methods: {
    // 查看详情跳转
    goColonySub(id) {
      // scope.row.ClusterType=='MANAGED_CLUSTER'
      this.$router.push({
        name: "colonyResourceDeployment",
        query: {
          clusterId: id
        }
      });
    },
    handleClick(uid) {
      //设置
      console.log(uid);
      this.$router.push({
        path: "/persistenceSetting/" + uid.ClusterId
      });
    },
    searchList() {
      //搜索
      var regex = /^[a-z0-9\.\-_]+$/g;
      if (regex.test(this.input) || this.input === "") {
        this.loadShow = true;
        let params = {
          Filters: [{ Name: "ClusterName", Values: this.input }],
          Version: "2018-05-25"
        };
        this.search();
      } else {
        this.$message({
          message: "请重新输入",
          type: "error"
        });
      }
    },
    getData() {
      this.funllscreenLoading = true;
      let params = {
        Version: "2018-05-25"
      };
      const res = this.axios.post(WARNING_GetUSER, params).then(res => {
        this.funllscreenLoading = false;
        this.loadShow = false;
      });
    },
    search() {
      //搜索数据持久化列表
      let params = {
        Version: "2018-05-25"
      };

      this.axios.get(TKE_COLONY_STATUS, params).then(res => {
        console.log(res);
        if (res.Response.Error === undefined) {
          // this.tableData = res.Response.Clusters;
          // this.loadShow = false;
          // console.log(res.Response.Clusters);
        } else {
          this.loadShow = false;
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 3000
          });
        }
      });
    },
    async getColonyList() {
      this.loadShow = true;
      let params = {
        Version: "2018-05-25",
        Limit: this.pageSize,
        Offset: this.pageIndex
      };
      if (this.searchInput !== "") {
        params["Filters.0.Name"] = "ClusterName";
        params["Filters.0.Values.0"] = this.searchInput;
      }
      const res = await this.axios.post(TKE_COLONY_LIST, params);
      if (res.Response.Error === undefined) {
        if (res.Response.Clusters.length > 0) {
          let ids = [];
          res.Response.Clusters = res.Response.Clusters.map(item => {
            ids.push(item.ClusterId);
            return item;
          });
          this.total = res.Response.TotalCount;
        }
        this.tableData = res.Response.Clusters;
        this.getColonyStatus();
        this.loadShow = false;
      } else {
        this.loadShow = false;
        let ErrTips = {
          InternalError: "内部错误",
          "InternalError.CamNoAuth": "没有权限。",
          "InternalError.Db": "db错误。",
          "InternalError.DbAffectivedRows": "DB错误",
          "InternalError.Param": "Param。",
          "InternalError.PublicClusterOpNotSupport": "集群不支持当前操作。",
          "InternalError.QuotaMaxClsLimit": "超过配额限制。",
          "InternalError.QuotaMaxNodLimit": "超过配额限制。",
          InvalidParameter: "参数错误",
          "InvalidParameter.Param": "参数错误。",
          LimitExceeded: "超过配额限制",
          ResourceNotFound: "资源不存在"
        };
        let ErrOr = Object.assign(ErrorTips, ErrTips);
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: "error",
          showClose: true,
          duration: 0
        });
      }
    },
    // 监听搜索条件的值
    changeType(val) {
      this.searchSelect = val;
    },
    // 监听搜索框的值
    changeSearchInput(val) {
      this.searchInput = val;
      if (val === "") {
        this.getColonyList();
      }
    },
    // 点击搜索
    clickSearch(val) {
      this.searchInput = val;
      this.getColonyList();
    },
    // 获取集群列表状态(不对外单独提供文档,所以无法实现)
    getColonyStatus() {
      let params = {
        Version: "2018-05-25"
      };
      if (this.searchInput !== "") {
        for (var i in this.tableData) {
          params["ClusterIds." + i] = this.tableData[i].ClusterId;
        }
      }

      this.axios.post(TKE_COLONY_STATUS, params).then(res => {
        this.listStatus = res.Response.ClusterStatusSet;
        this.listStatusArr = [];
        for (var i in this.listStatus) {
          this.listStatusArr.push(this.listStatus[i].ClusterInstanceState);
        }
      });
    }
    // getColonyList() {
    //   //数据持久化集群列表
    //   let params = { Version: "2018-05-25" };
    //   this.axios.post(TKE_COLONY_LIST, params).then(res => {
    //     if (res.Response.Error === undefined) {
    //       this.tableData = res.Response.Clusters;
    //       this.loadShow = false;
    //       console.log(res.Response.Clusters);
    //     } else {
    //       let ErrTips = {};
    //       let ErrOr = Object.assign(ErrorTips, ErrTips);
    //       this.$message({
    //         message: ErrOr[res.Response.Error.Code],
    //         type: "error",
    //         showClose: true,
    //         duration: 0
    //       });
    //     }
    //   });
    // }
  },
  components: {
    HeadCom,
    tkeSearch
  }
};
</script>

<style lang="scss" scoped>
.hd-button {
  width: 80px;
  height: 22px;
  padding-left: 30px;
}
.back-hd {
  width: 100%;
  height: 51px;
  background: white;
  padding: 15px;
  border-bottom: 1px solid #cccccc;
  font-size: 12px;
}
.init {
  padding: 0;
  margin: 0;
}
.show {
  display: block;
}
.hide {
  display: none;
}
.center {
  padding-top: 6px;
}
.ep-data-card-main {
  padding: 20px 0 20px 0;
  border-bottom: 1px solid #cccccc;
}
.ep-data-card-hd {
  width: 50px;
  height: 30px;
}
.font {
  font-size: 12px;
}
.flex {
  display: flex;
}
.search {
  width: 200px;
  height: 30px;
  margin: 20px 0 10px 0;
  font-size: 12px;
  padding-left: 5px;
  border: 1px solid #cccccc;
}
.ip-btn {
  font-size: 12px;
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  position: absolute;
  z-index: 1;
  top: 20px;
}
.app-tke-fe-content__inner {
  max-width: 1360px;
  margin: 0 auto;
  padding: 20px;
}
.tf-g {
  font-size: 0;
  margin-bottom: 50px;
}
.event-persistence {
  padding: 20px;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
</style>