<template>
  <div class="CvmRecycle">

    <!-- 标题 -->
    <div class="Title">
      <div>
        <div class="CvmRecycle-tit">
          <h2>实例</h2>
          <el-select v-model="projectId" @change="changeProjectId" placeholder="全部项目" size="small">
            <el-option v-for="item in projectList" :key="item.projectId" :label="item.projectName" :value="item.projectId">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>

    <div class="CvmRecycle-operation">
      <city :parm="parm" @changeCity="changeCity" class="region-btn"></city>
    </div>

    <div class="CvmRecycle-information">
      <p>
        到期后仍未续费的实例，会在回收站中保留7天，这期间您可以续费进行恢复。
        7天后，这些实例会被彻底释放，不可恢复。实例进入回收站后将被强制解除与负载均衡、弹性云盘、基础网络互通的挂载关系。
        续费恢复后，其挂载关系不恢复，需要您重新配置。
      </p>
    </div>

    <!-- 搜索 -->
    <div class="search-div">
      <search class="search-1" :options="options" v-on:search="search"></search>
    </div>

    <!-- 表格 -->
    <div class="CvmRecycle-table">
      <el-table ref="multipleTable" v-loading="tableLoading" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="ID/名称">
          <template slot-scope="scope">
            <div class="id-name">
              <a href="javascript: void(0);" @click="$router.push({name: 'CvmRecycleDetail', query: {KeyId: scope.row.KeyId}})">{{ scope.row.KeyId }}</a>
              <p>{{ scope.row.KeyName }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="AssociatedInstanceIds.length">
        </el-table-column>
        <el-table-column label="所属项目">
          <template slot-scope="scope">
            <p>0</p>
          </template>
        </el-table-column>
        <el-table-column label="所属网络">
          <template slot-scope="scope">
            <p>{{ scope.row.CreatedTime | renderTime }}</p>
          </template>
        </el-table-column>
        <el-table-column label="IP地址">
          <template slot-scope="scope">
            <div class="ope-div">
              <span @click="bindObj.bindShow = true; bindObj.CvmRecycleInfo = scope.row">绑定</span>
              <span @click="unBindObj.unBindShow = true; unBindObj.CvmRecycleInfo = scope.row">解绑</span>
              <span @click="amendShow = true; CvmRecycleInfo = scope.row">修改</span>
              <span @click="deleteFun(scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="释放倒计时" prop="AssociatedInstanceIds.length">
        </el-table-column>
        <el-table-column label="操作" prop="AssociatedInstanceIds.length">
        </el-table-column>
      </el-table>
      <div class="CvmRecycle-pag">
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>

  </div>
</template>
<script>
import City from '@/components/Tools/RegionBtn'
export default {
  data() {
    return {
      parm: 'FWQ',
      projectList: JSON.parse(localStorage.getItem("projectList")), // 项目列表
      projectId: "", // 点击下拉框获取的项目id
      options: [
        // 搜索下拉数组
        {
          value: "key-name",
          label: "名称"
        }
      ],
      searchName: "", // 搜索类型的名字
      searchVal: "", // 搜索类型的值
      tableData: [], // 表格列表数据
      tableLoading: false, // 表格加载动画
      currentPage: 1, // 当前页
      pageSize: 10, // 每页数
      totalPage: 0, // 表格数据数组长度

    };
  },
  components: {
    City
  },
  mounted() {
    let allProject = {
      projectId: '',
      projectInfo: "全部项目",
      projectName: "全部项目"
    }
    this.projectList.unshift(allProject)
    this.getDataList();

  },
  methods: {
    // 获取CvmRecycle秘钥列表
    getDataList() {
      this.tableLoading = true;
      var params = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        'Filters.0.Name': 'restrict-state',
        'Filters.0.Values.0': 'EXPIRED',
        Offset: (this.currentPage - 1) * this.pageSize,
        Limit: this.pageSize
      };
      if (this.projectId !== "") {
        params["Filters.1.Name"] = "project-id";
        params["Filters.1.Values.0"] = this.projectId;
        if (this.searchName === "key-name") {
          params["Filters.2.Name"] = "key-name";
          params["Filters.2.Values.0"] = this.searchVal;
        }
      } else {
        if (this.searchName === "key-name") {
          params["Filters.1.Name"] = "key-name";
          params["Filters.1.Values.0"] = this.searchVal;
        }
      }

      this.axios
        .post("cvm2/DescribeInstances", params)
        .then(data => {
          this.tableLoading = false;
          this.tableData = data.Response.InstanceSet;
          this.totalPage = data.Response.TotalCount;
        });
    },

    // 更换项目事件
    changeProjectId() {
      this.getDataList();
    },

    // 点击城市函数
    changeCity(val) {
      this.getDataList();
    },

    // 搜索
    search(searchInput, searchSelect) {
      this.searchName = searchSelect;
      this.searchVal = searchInput;
      this.getDataList();
    },

    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getDataList();
    },

    // 当前页
    currentChangeHandle(val) {
      this.currentPage = val;
      this.getDataList();
    },
  }
};
</script>

<style lang="scss" scoped>
.CvmRecycle {
  .CvmRecycle-tit {
    margin-left: 0px;
    ::v-deep .el-input__inner {
      border: 0;
    }
  }
  .CvmRecycle-operation {
    margin: 20px 20px 5px 20px;
  }
  .CvmRecycle-information {
    margin: 5px 20px 10px 20px;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    p {
      padding: 6px 20px;
      line-height: 20px;
    }
  }

  .search-div {
    margin: 5px 20px;
    height: 32px;
    .search-1 {
      float: right;
    }
  }
  .CvmRecycle-table {
    margin: 5px 20px 20px 20px;
    background: #fff;
    .ope-div {
      span:not(:first-child) {
        margin-left: 8px;
      }
      span {
        color: #217cf3;
        cursor: pointer;
      }
    }
  }
  .CvmRecycle-pag {
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
