<template>
  <div>
    <!-- 按钮--搜索 -->
    <div class="btn-search">
      <div class="btns">
        <div class="discreate" @mouseenter="enter(1)" @mouseleave="leave()">
          <el-button v-show="multipleSelection.length !== 1">创建实例</el-button>
          <p v-if="disCreate">请选择你需要创建实例的镜像</p>
          <p v-if="disCreate1">请选择创建实例的唯一镜像</p>
        </div>
        <el-button
          v-show="multipleSelection.length === 1"
          @click="Establish(establishByVal.establishId)"
        >创建实例</el-button>
        <div class="discreate" @mouseenter="enter(2)" @mouseleave="leave()">
          <el-button
            v-show="multipleSelection.length !== 1 || multipleSelection[0].ImageSize > 51"
          >跨地域复制</el-button>
          <p v-if="copyBtn">请选择你需要复制的镜像</p>
          <p v-if="copyBtn1">暂不支持批量跨地域复制镜像</p>
          <p v-if="copyBtn2">大于50GB的自定义镜像暂不支持跨地域复制</p>
        </div>
        <el-button
          v-show="multipleSelection.length === 1 && multipleSelection[0].ImageSize < 51 "
          @click="regionCopyBtn()"
        >跨地域复制</el-button>
        <el-button @click="ImportBtn()">导入镜像</el-button>
        <div class="discreate" @mouseenter="enter(3)" @mouseleave="leave()">
          <el-button v-show="multipleSelection.length === 0">删除</el-button>
          <p v-if="deleteBtn">请选择你需要删除的镜像</p>
        </div>
        <el-button v-show="multipleSelection.length !== 0" @click="DeleteBtn(multipleSelection)">删除</el-button>
      </div>
      <div class="search">
        <search :options="options" v-on:search="search"></search>
      </div>
    </div>
    <!-- 列表 -->
    <div class="tablePage-box">
      <div class="table-box">
        <el-table
          ref="multipleTable"
          :data="tableData"
          v-loading="loading"
          tooltip-effect="dark"
          style="width: 100%;min-height:400px;"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="36"></el-table-column>
          <el-table-column label="ID/名称">
            <template slot-scope="scope">
              <div class="id-name">
                <a
                  href="javascript:void(0);"
                  @click="Details(scope.row.ImageId)"
                >{{scope.row.ImageId}}</a>
                <p>{{scope.row.ImageName}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="状态" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.ImageState|imageState}}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.ImageType|imageState}}</span>
            </template>
          </el-table-column>
          <el-table-column label="容量" width="90">
            <template slot-scope="scope">
              <span>{{scope.row.ImageSize}}GB</span>
            </template>
          </el-table-column>
          <el-table-column label="操作系统" width="250">
            <template slot-scope="scope">
              <span>{{scope.row.OsName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="创建时间">
            <template slot-scope="scope">
              <span>{{scope.row.CreatedTime?scope.row.CreatedTime:"-"|renderTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <div class="operation">
                <a href="javascript:void(0);" @click="Establish(scope.row.ImageId)">创建实例</a>
                <a href="javascript:void(0);" @click="shareBtn(scope.row.ImageId)">共享</a>
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    更多
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <template>
                        <el-tooltip
                          class="item"
                          effect="light"
                          content="大于50GB的自定义镜像暂不支持跨地域复制"
                          placement="bottom"
                          v-show="scope.row.ImageSize > 51"
                        >
                          <span>跨地域复制</span>
                        </el-tooltip>
                        <span v-show="scope.row.ImageSize < 51" @click="regionCopyBtn()">跨地域复制</span>
                      </template>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <template>
                        <span @click="Details(scope.row.ImageId)">取消共享</span>
                      </template>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <template>
                        <span @click="ModifyBtn(scope.row)">修改</span>
                      </template>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <template>
                        <span @click="DeleteBtn(scope.row)">删除</span>
                      </template>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-box">
        <span>已选{{multipleSelection.length}}项，</span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage1"
          :page-sizes="[10, 15, 20, 25]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
        ></el-pagination>
      </div>
    </div>
    <!-- 创建实例 -->
    <establish
      :establishVal="establishByVal"
      v-if="establishByVal.establish"
      v-on:close="EstablishClose()"
    ></establish>
    <region-copy :regionCopyShow="regionCopy" v-if="regionCopy" v-on:close="regionCopyClose()"></region-copy>
    <share :shareShow="shareByVal" v-if="shareByVal.shareState" v-on:close="shareClose()"></share>
    <delete-modal
      @getDataList="getDataList"
      :deleteShow="deteleByVal"
      v-if="deteleByVal.deleteState"
      v-on:close="deleteClose()"
    ></delete-modal>
    <modify-modal
      @getDataList="getDataList"
      :modifyShow="modifyByVal"
      v-if="modifyByVal.modifyState"
      v-on:close="modifyClose()"
    ></modify-modal>
  </div>
</template>
<script>
import establish from "./modal/establish";
import RegionCopy from "./modal/regionCopy";
import share from "./modal/share"; //共享
import deleteModal from "./modal/delete"; // 删除
import modifyModal from "./modal/modify"; // 修改镜像
export default {
  data() {
    return {
      currentPage1: 1, //分页跳转
      disCreate: false,
      disCreate1: false, // 创建实例
      copyBtn: false,
      copyBtn1: false,
      copyBtn2: false, // 跨地域复制
      deleteBtn: false, // 删除
      pageIndex: 1, // 当前页
      pageSize: 10, // 每页数
      totalPage: 0, // 表格数据数组长度
      options: [
        //搜索
        {
          value: "名称",
          lable: "名称"
        },
        {
          value: "ID",
          lable: "ID"
        }
      ],
      tableData: [],
      loading: true,
      multipleSelection: [],
      searchSelect: "",
      searchInput: "",
      establishByVal: {
        establish: false, // 创建弹框显示隐藏
        establishId: "" // 传id值
      },
      regionCopy: false, // 创建弹框显示隐藏
      shareByVal: {
        // 共享
        shareState: false,
        shareStateId: "",
        norm: ""
      },
      deteleByVal: {
        // 删除
        deleteState: false,
        deleteStateId: ""
      },
      modifyByVal: {
        // 修改
        modifyState: false,
        modifyStateId: ""
      }
    };
  },
  components: {
    establish,
    RegionCopy,
    share,
    deleteModal,
    modifyModal
  },
  created() {
    this.getDataList();
  },
  methods: {
    // 创建按钮
    enter(num) {
      if (num === 1 && this.multipleSelection.length === 0) {
        this.disCreate = true;
      } else if (num === 1 && this.multipleSelection.length !== 1) {
        this.disCreate1 = true;
      } else if (num === 2 && this.multipleSelection.length === 0) {
        this.copyBtn = true;
      } else if (num === 2 && this.multipleSelection.length !== 1) {
        this.copyBtn1 = true;
      } else if (
        num === 2 &&
        this.multipleSelection.length === 1 &&
        this.multipleSelection[0].ImageSize > 50
      ) {
        this.copyBtn2 = true;
      } else if (num === 3) {
        this.deleteBtn = true;
      }
    },
    leave() {
      this.disCreate = false;
      this.disCreate1 = false;
      this.copyBtn = false;
      this.copyBtn1 = false;
      this.copyBtn2 = false;
      this.deleteBtn = false;
    },
    // 创建实例按钮
    Establish(id) {
      this.establishByVal.establish = true;
      this.establishByVal.establishId = id;
    },
    EstablishClose() {
      this.establishByVal.establish = false;
    },
    // 跨地域复制
    regionCopyBtn() {
      this.regionCopy = true;
    },
    regionCopyClose() {
      this.regionCopy = false;
    },
    // 导入镜像
    ImportBtn() {
      this.$router.push({
        path: "ImportImage"
      });
    },
    // 共享
    shareBtn(id) {
      this.shareByVal.shareState = true;
      this.shareByVal.shareStateId = id;
      let param = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        ImageId: id
      };
      this.axios
        .post("cvm2/DescribeImageSharePermission", param)
        .then(data => {
          this.shareByVal.norm = data.Response.SharePermissionSet;
        })
        .catch(error => {
          this.$message({
            message: "数据加载错误",
            type: "error"
          });
        });
    },
    shareClose() {
      this.shareByVal.shareState = false;
    },
    // 删除
    DeleteBtn(id) {
      this.deteleByVal.deleteState = true;
      this.deteleByVal.deleteStateId = id;
    },
    deleteClose() {
      this.deteleByVal.deleteState = false;
    },
    // 修改
    ModifyBtn(id) {
      this.modifyByVal.modifyState = true;
      this.modifyByVal.modifyStateId = id;
    },
    modifyClose() {
      this.modifyByVal.modifyState = false;
    },
    // 搜索
    search(searchInput, searchSelect) {
      this.searchInput = searchInput;
      this.searchSelect = searchSelect;
      this.getDataList();
    },
    // 列表
    getDataList() {
      let parms = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        Offset: this.pageIndex * this.pageSize - this.pageSize,
        Limit: this.pageSize,
        "Filters.0.Name": "image-type",
        "Filters.0.Values.0": "PRIVATE_IMAGE"
      };
      if (this.searchInput !== "" && this.searchSelect === "名称") {
        parms["Filters.0.Name"] = "image-name";
        parms["Filters.0.Values.0"] = this.searchInput;
      } else if (this.searchInput !== "" && this.searchSelect === "ID") {
        parms["Filters.0.Name"] = "image-id";
        parms["Filters.0.Values.0"] = this.searchInput;
      } else if (this.searchSelect === "" && this.searchInput !== "") {
        this.$message("请选择类型");
        return;
      }
      this.axios.post("cvm2/DescribeImages", parms).then(data => {
        this.tableData = data.Response.ImageSet;
        this.totalPage = data.Response.TotalCount;
        this.loading = false;
      });
    },
    // 详情 // 取消共享
    Details(id) {
      this.$router.push({
        path: "ImageDetails",
        query: {
          ImageTypes: "PRIVATE_IMAGE",
          ImageId: id
        }
      });
    },
    // 列表选中
    handleSelectionChange(rows) {
      this.multipleSelection = rows;
      if (rows.length === 1) {
        this.establishByVal.establishId = rows[0].ImageId;
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getDataList();
    }
  }
};
</script>

<style lang="scss" scoped>
.btn-search {
  display: flex;
  width: 100%;
  justify-content: space-between;
  .btns {
    display: flex;
    justify-content: flex-start;
  }
  .discreate {
    position: relative;
    /* 按钮 */
    ::v-deep .el-button {
      color: #ddd;
      cursor: not-allowed;
    }
    ::v-deep .el-button:focus,
    .el-button:hover {
      background: #fff;
    }
    & > p {
      position: absolute;
      top: 30px;
      left: 40px;
      background: #fff;
      padding: 5px 10px;
      border: 1px solid #ddd;
      color: #333;
      z-index: 1000;
      min-width: 178px;
    }
  }
}
.tablePage-box {
  overflow: hidden;
  margin-top: 10px;
  // 列表
  .table-box {
    ::v-deep .el-table {
      font-size: 12px;
      color: #444;
    }
    ::v-deep .el-table th {
      padding: 8px 0px;
    }
    ::v-deep .el-table th > .cell {
      color: #888;
      font-weight: 700;
      font-size: 12px;
    }
    ::v-deep .el-table-column--selection .cell {
      padding: 0 10px;
    }
    ::v-deep.el-dropdown {
      font-size: 12px;
    }
    ::v-deep .el-dropdown-link[data-v-11d5b2e8] {
      color: #006eff;
    }
    .id-name {
      & > a {
        color: #006eff;
        &:hover {
          text-decoration: underline;
        }
      }
      & > p {
        height: 12px;
        line-height: 12px;
      }
    }
    .operation {
      display: flex;
      justify-content: flex-start;
      & > a {
        margin-right: 5px;
        color: #006eff;
        &:hover {
          text-decoration: underline;
        }
      }
      .el-dropdown-link {
        cursor: pointer;
        color: #006eff;
      }
    }
  }
  // 分页
  .page-box {
    background: #fff;
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    /* 分页 */
    ::v-deep .el-pagination span:not([class*="suffix"]) {
      color: #888;
      font-size: 12px;
    }
    & > span {
      line-height: 32px;
      color: #888;
      font-size: 12px;
    }
  }
}

.el-button + .el-button {
  margin: 0px;
  margin-right: 10px;
}
.image-tab[data-v-11d5b2e8] .el-button {
  margin-right: 10px;
}
/* 下拉样式 */
.el-dropdown-menu__item {
  height: 30px;
  line-height: 30px;
  padding: 0px;
  span {
    padding: 20px;
  }
}
.el-dropdown-menu__item .el-tooltip {
  color: #ddd;
  font-size: 12px;
  cursor: default;
  display: inline-block;
  width: 100%;
  padding: 0 20px;
  height: 100%;
  line-height: 30px;
}
.el-dropdown-menu__item .el-tooltip:hover {
  background: #fff;
}
</style>



