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
        <div class="flex" style="justify-content: flex-end;  position: relative;">
          <input placeholder="请输入集群名称" clearable class="search" v-model.trim="input" />
          <button class="el-icon-search ip-btn" @click="searchList"></button>
        </div>
        <!-- 内容 -->
        <!-- 内容参数不确定 -->
        <el-table :data="tableData" style="width: 100%" v-loading="loadShow">
          <el-table-column label="ID/名称" width="250">
            <template slot-scope="scope">
              <span>{{scope.row.ClusterId}}</span>
              <br />
              <span>{{scope.row.ClusterName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="250">
            <template slot-scope="scope">
              <span v-if="scope.row" style="color:#0abf5b">
                已开启
                <i style="color:#0abf5b;font-weight:900" class="el-icon-circle-check"></i>
              </span>
              <span v-else-if="!scope.row">未开启</span>
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
  WARNING_GetUSER
} from "@/constants";
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
      loadShow: true // 加载是否显示
    };
  },
  created() {
    this.getData();
    this.getColonyList();
  },
  methods: {
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
        Filters: [{ Name: "ClusterName", Values: this.input }],
        Version: "2018-05-25"
      };
      this.axios.get(TKE_COLONY_QUERY, params).then(res => {
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
    getColonyList() {
      //数据持久化集群列表
      let params = { Version: "2018-05-25" };
      this.axios.post(TKE_COLONY_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.tableData = res.Response.Clusters;
          this.loadShow = false;
          console.log(res.Response.Clusters);
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    }
  },
  components: {
    HeadCom
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
  // background: pink;
}
.event-persistence {
  padding: 20px;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
</style>