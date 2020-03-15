<template>
  <div class="persistence-wrap" v-loading="funllscreenLoading">
    <div class="back-hd flex">
      <h2>{{$t('TKE.overview.sjcjh')}}</h2>
      <div style="width:20px"></div>
      <el-button type="primary" class="init hd-button">{{$t('TKE.overview.zgtb')}}</el-button>
    </div>
    <div class="app-tke-fe-content__inner">
      <div class="tf-g">
        <!-- 搜索框 -->
        <div
          class="grid-right flex"
          style="justify-content: flex-end;  position: relative; bottom:10px;"
        >
          <tkeSearch
            :exportData="false"
            :inputPlaceholder="$t('TKE.overview.qsrjqmc')"
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
        <el-table
          :data="tableData"
          style="width: 100%"
          v-loading="loadShow"
          @cell-mouse-enter="hoverShow"
          @cell-mouse-leave="hoverHide"
        >
          <el-table-column :label="$t('TKE.overview.idmc')" width="220">
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
              <i
                class="el-icon-document u-btn"
                style="cursor: pointer;"
                v-show="showFlag"
                @click="getContext($event)"
              ></i>
              <br />
              <span>{{ scope.row.ClusterName }}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('TKE.overview.zt')" width="220">
            <template slot-scope="scope">
              <el-tooltip
                v-if="scope.row.targetStatus == 'failed'"
                class="item"
                effect="dark"
                :content="scope.row.targetStatusTip"
                placement="left"
              >
                <span class="text-red">
                  {{$t('TKE.overview.sb')}}
                  <i
                    style="color:#e54545;font-size:16px"
                    class="el-icon-warning"
                  ></i>
                </span>
              </el-tooltip>
              <span v-else-if="scope.row.targetStatus == 'running'" class="text-green">
                {{$t('TKE.overview.ykq')}}
                <i
                  style="color:#0abf5b;font-weight:900"
                  class="el-icon-circle-check"
                ></i>
              </span>
              <span v-else>{{$t('TKE.overview.wkq')}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('TKE.overview.ccd')" width="220">
            <template slot-scope="scope">
              <span v-if="scope.row.storageObject">Elasticsearch</span>
              <span v-else-if="!scope.row.storageObject">-</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('TKE.overview.ccdx')" width="320">
            <template slot-scope="scope">
              <span>{{scope.row.storageObject ? scope.row.storageObject: '-'}}</span>
              <p>{{scope.row.indexName ? scope.row.indexName: ''}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <span v-if="!scope.row.storageObject">
                <el-button
                  @click="handleClick(scope.row)"
                  type="text"
                  size="small"
                >{{$t('TKE.overview.sz')}}</el-button>
              </span>
              <span v-else-if="scope.row.storageObject">
                <el-button
                  @click="handleClick(scope.row)"
                  type="text"
                  size="small"
                >{{$t('TKE.overview.gxsz')}}</el-button>
              </span>
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
  TKE_COLONY_STATUS
} from "@/constants";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import { TKE_COLONY_LIST, TKE_COLONY_QUERY } from "@/constants/TKE-jz";
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
      showFlag: false,
      listStatus: [], // 集群列表节点数状态
      listStatusArr: [], // 集群列表节点数状态
      searchOptions: [
        {
          value: "name",
          label: "名稱"
        },
        {
          value: "tag",
          label: "標籤"
        }
      ],
      tableData1: [],
      tableData2: []
    };
  },
  created() {
    // var index = dataList.indexOf(row)
    this.getColonyList();
  },
  methods: {
    hoverHide() {
      this.showFlag = false;
    },
    hoverShow() {
      this.showFlag = true;
    },
    // 查看详情跳转
    goColonySub(id) {
      this.$router.push({
        name: "colonyResourceDeployment",
        query: {
          clusterId: id
        }
      });
    },
    handleClick(uid) {
      //设置
      this.$router.push({
        path: "/persistenceSetting/" + uid.ClusterId,
        query: uid
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
          message: "請重新輸入",
          type: "error",
          showClose: true,
          duration: 0
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
    getContext(e) {
      let getText = e.currentTarget.previousElementSibling.innerHTML;
      this.copy(getText);
    },
    copy(data) {
      // 复制功能
      let url = data;
      let oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message({
        message: "复制成功",
        type: "success",
        showClose: true
      });
      oInput.remove();
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
      //  console.log(res);
      if (res.Response.Error === undefined) {
        let paramsD = {
          Method: "GET",
          Path: "/apis/platform.tke/v1/persistentevents",
          Version: "2018-05-25"
        };
        let k8sList = [];
        let k8sRes = await this.axios.post(TKE_COLONY_QUERY, paramsD);

        if (k8sRes.Response.Error === undefined) {
          var data = JSON.parse(k8sRes.Response.ResponseBody);
          // console.log(data.items);
          if (data.items.length <= 0) {
            this.$message({
              message: "暫無資料",
              type: "success",
              showClose: true,
              duration: 0
            });
          }
          k8sList = data.items;
          this.loadShow = false;
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[k8sRes.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
        if (res.Response.Clusters.length > 0) {
          res.Response.Clusters.map(cluster => {
            k8sList.map(k8s => {  
              if (cluster.ClusterId === k8s.spec.clusterName) {
                if (k8s.status && k8s.status.phase) {
                  cluster.targetStatus = k8s.status.phase;
                  cluster.targetStatusTip = k8s.status.reason;
                }
                if (
                  k8s.spec &&
                  k8s.spec.persistentBackEnd &&
                  k8s.spec.persistentBackEnd.es
                ) {
                  cluster.storageObject =
                    "ES地址( http://" +
                    k8s.spec.persistentBackEnd.es.ip +
                    ":" +
                    k8s.spec.persistentBackEnd.es.port +
                    ")";
                  cluster.indexName =
                    "索引(" + k8s.spec.persistentBackEnd.es.indexName + ")";
                }
              }
            });
            // console.log(cluster);
            return cluster;
          });
        }
        this.total = res.Response.TotalCount;
        this.tableData = res.Response.Clusters;
        this.loadShow = false;
      } else {
        this.loadShow = false;
        let ErrTips = {
          InternalError: "內部錯誤",
          "InternalError.CamNoAuth": "沒有權限。",
          "InternalError.Db": "db錯誤。",
          "InternalError.DbAffectivedRows": "DB錯誤",
          "InternalError.Param": "Param。",
          "InternalError.PublicClusterOpNotSupport": "集群不支持當前操作。",
          "InternalError.QuotaMaxClsLimit": "超過配額限制。",
          "InternalError.QuotaMaxNodLimit": "超過配額限制。",
          InvalidParameter: "參數錯誤",
          "InvalidParameter.Param": "參數錯誤。",
          LimitExceeded: "超過配額限制",
          ResourceNotFound: "資源不存在"
        };
        let ErrOr = Object.assign(ErrorTips, ErrTips);
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: "error",
          showClose: true,
          duration: 0
        });
      }

      var arr = []; //执行合并任务，展示数据
      for (let index = 0; index < this.tableData1.length; index++) {
        arr.push(Object.assign(this.tableData1[index], this.tableData2[index]));
        this.tableData = arr;
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
    }
  },
  components: {
    HeadCom,
    tkeSearch
  }
};
</script>

<style lang="scss" scoped>
.u-btn {
  display: none;
}
.el-table__body tr:hover {
  .u-btn {
    display: inline;
  }
}
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