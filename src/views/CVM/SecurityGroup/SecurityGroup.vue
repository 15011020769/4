<template>
  <div class="SecurityGroup">
    <!-- 标题 -->
    <div class="Title">
      <div>
        <h2>安全组</h2>
        <el-select v-model="projectId" @change="changeProjectId" placeholder="全部项目" size="small">
          <el-option
            v-for="item in projectList"
            :key="item.projectId"
            :label="item.projectName"
            :value="item.projectId"
          ></el-option>
        </el-select>
      </div>
      <div>
        <a href="javascript:;">
          <i class="iconfont">&#xe612;</i>安全组帮助文档
        </a>
      </div>
    </div>
    <div class="wrap">
      <!-- 城市切换 -->
      <div class="citys">
        <City :parm="parm" v-on:changeCity="changeCity"></City>
      </div>
      <!-- 功能按钮 -->
      <div class="new-search">
        <el-button type="primary" size="small" @click="newBuildByVal.newBuildState=true">
          <i class="el-icon-plus"></i>新建
        </el-button>
        <div class="search">
          <search :options="options" v-on:search="search"></search>
        </div>
      </div>
      <!-- 列表-分页 -->
      <div class="table-page">
        <div class="table-box">
          <el-table :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column label="ID/名称" width="165">
              <template slot-scope="scope">
                <a href="javascript:;" @click="Details(scope.row.SecurityGroupId)">{{scope.row.SecurityGroupId}}</a>
                <p @mouseenter="enter(scope.$index)" @mouseleave="leave()">
                  {{scope.row.SecurityGroupName}}
                  <i
                    class="iconfont"
                    v-show="edit&&scope.$index==current"
                    @click="ModifyBtn(scope.row)"
                  >&#xe670;</i>
                </p>
              </template>
            </el-table-column>
            <el-table-column label="关联实例数" width="100"></el-table-column>
            <el-table-column label="备注">
              <template slot-scope="scope">
                <p
                  class="exceed"
                >{{scope.row.SecurityGroupDesc !== "" ? scope.row.SecurityGroupDesc:'-'}}</p>
              </template>
            </el-table-column>
            <el-table-column label="类型" width="80px">
              <template slot-scope="scope">
                <p>{{scope.row.IsDefault === true ? "默认":'自定义'}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="CreatedTime" label="创建时间"></el-table-column>
            <el-table-column label="项目" width="120">
              <template slot-scope="scope">
                <p class="exceed">{{scope.row.ProjectId | ProjectSafety}}</p>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div class="more">
                  <a href="javascript:;">修改规则</a>
                  <a href="javascript:;">管理实例</a>
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                      更多
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <template>
                          <span @click="Clone(scope.row)">克隆</span>
                        </template>
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <template>
                          <el-tooltip
                            class="item"
                            effect="light"
                            content="只能删除自定义镜像"
                            placement="bottom"
                            v-if="scope.row.IsDefault === true"
                          >
                            <span class="dis-delete">删除</span>
                          </el-tooltip>
                          <span v-if="scope.row.IsDefault === false" @click="Delete(scope.row)">删除</span>
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
    </div>
    <!-- 修改 -->
    <editor-modal
      @getDataList="getDataList"
      :modifyShow="modifyByVal"
      v-if="modifyByVal.modifyState"
      v-on:close="modifyByVal.modifyState = false;"
    ></editor-modal>
    <!-- 新建 -->
    <new-build
      @getDataList="getDataList"
      :newBuildShow="newBuildByVal"
      v-if="newBuildByVal.newBuildState"
      v-on:close="newBuildByVal.newBuildState = false"
    ></new-build>
    <!-- 删除 -->
    <delete
      @getDataList="getDataList"
      :deleteShow="deleteByVal"
      v-if="deleteByVal.deleteState"
      v-on:close="deleteByVal.deleteState = false"
    ></delete>
    <!-- 克隆 -->
    <clone
      @getDataList="getDataList"
      :cloneShow="cloneByVal"
      v-if="cloneByVal.cloneState"
      v-on:close="cloneByVal.cloneState = false"
    ></clone>
  </div>
</template>

<script>
import City from "@/components/Tools/RegionBtn";
import NewBuild from "./modal/newBuild"; // 新建
import EditorModal from "./modal/editor"; // 修改
import Delete from "./modal/delete"; // 删除
import Clone from "./modal/clone"; // 克隆
export default {
  data() {
    return {
      parm: "FWQ", // 城市列表接口参数
      projectList: JSON.parse(localStorage.getItem("projectList")), // 项目列表
      projectId: "", // 点击下拉框获取的项目id
      options: [
        //搜索
        {
          value: "安全组名",
          lable: "安全组名"
        },
        {
          value: "ID",
          lable: "ID"
        }
      ],
      searchSelect: "", // 搜索
      searchInput: "", // 搜索
      tableData: [],
      loading: true, // 表格加载动画
      edit: false,
      current: "", // 编辑
      SecurityGroupDesc: "",
      currentPage1: 1, //分页跳转
      pageIndex: 1, // 当前页
      pageSize: 10, // 每页数
      totalPage: 0, // 表格数据数组长度
      newBuildByVal: {
        // 新建
        newBuildState: false
      },
      modifyByVal: {
        // 编辑
        modifyState: false,
        modifyStateId: ""
      },
      deleteByVal: {
        // 删除
        deleteState: false,
        deleteStateId: ""
      },
      cloneByVal: {
        // 克隆
        cloneState: false,
        cloneStateId: ""
      }
    };
  },
  components: {
    EditorModal,
    NewBuild,
    City,
    Delete,
    Clone
  },
  created() {
    this.getDataList();
  },
  methods: {
    // 城市切换
    changeCity(city) {
      this.$cookie.set("regionv1", city.regionCode);
      this.$cookie.set("regionv2", city.Region);
      this.getDataList();
    },
    // 搜索
    search(searchInput, searchSelect) {
      this.searchInput = searchInput;
      this.searchSelect = searchSelect;
      if (this.searchSelect === "安全组名" && this.projectId !== "") {
        this.getDataList();
      } else {
        let parms = {
          Version: "2017-03-12",
          Region: this.$cookie.get("regionv2"),
          Offset: this.pageIndex * this.pageSize - this.pageSize,
          Limit: this.pageSize
        };
        if (this.searchInput !== "" && this.searchSelect === "安全组名") {
          parms["Filters.0.Name"] = "security-group-name";
          parms["Filters.0.Values.0"] = this.searchInput;
        } else if (this.searchInput !== "" && this.searchSelect === "ID") {
          parms["SecurityGroupIds.0"] = this.searchInput;
        } else if (this.searchSelect === "" && this.searchInput !== "") {
          this.$message("请选择类型");
          return;
        }
        this.axios
          .post("vpc2/DescribeSecurityGroups", parms)
          .then(data => {
            this.tableData = data.Response.SecurityGroupSet;
            this.totalPage = data.Response.TotalCount;
            this.loading = false;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    // 安全组列表
    getDataList() {
      let parms = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        Offset: this.pageIndex * this.pageSize - this.pageSize,
        Limit: this.pageSize
      };
      if (this.projectId !== "") {
        parms["Filters.0.Name"] = "project-id";
        parms["Filters.0.Values.0"] = this.projectId;
        if (this.searchInput !== "" && this.searchSelect === "安全组名") {
          parms["Filters.1.Name"] = "security-group-name";
          parms["Filters.1.Values.0"] = this.searchInput;
        }
      } else {
        if (this.searchInput !== "" && this.searchSelect === "安全组名") {
          parms["Filters.0.Name"] = "security-group-name";
          parms["Filters.0.Values.0"] = this.searchInput;
        }
      }
      this.axios
        .post("vpc2/DescribeSecurityGroups", parms)
        .then(data => {
          console.log(data.Response);
          this.tableData = data.Response.SecurityGroupSet;
          this.totalPage = data.Response.TotalCount;
          console.log(this.tableData);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 修改显示图标
    enter(index) {
      this.edit = true;
      this.current = index;
    },
    leave() {
      this.edit = false;
      this.current = null;
    },
    // 修改
    ModifyBtn(id) {
      this.modifyByVal.modifyState = true;
      this.modifyByVal.modifyStateId = id;
    },
    // 删除
    Delete(row) {
      this.deleteByVal.deleteState = true;
      this.deleteByVal.deleteStateId = row;
    },
    // 克隆
    Clone(row) {
      console.log(row);
      this.cloneByVal.cloneState = true;
      this.cloneByVal.cloneStateId = row;
    },
    // 详情
    Details(row) {
      this.$router.push({
        path: "SecurityGroupDetail",
        query: {
          SecurityGroupId: row
        }
      });
    },
    // 更换项目事件
    changeProjectId() {
      console.log(this.projectId);
      this.getDataList();
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
.SecurityGroup {
  .Title {
    border-bottom: 1px solid #ddd;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
      margin: 0px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      h2 {
        font-size: 16px;
        font-weight: 700;
        color: #000;
        height: 30px;
        line-height: 30px;
        margin-right: 20px;
      }
    }
    ::v-deep .el-select .el-input {
      height: auto;
      width: 94px;
      font-size: 12px;
      margin: 0px;
    }
    ::v-deep .el-input--small .el-input__inner {
      padding: 0 34px 0 10px;
      border: 0px;
      color: #444;
    }
    ::v-deep .el-input--small .el-input__inner::-webkit-input-placeholder {
      color: #444;
    }
    ::v-deep .el-input--small .el-input__inner:-moz-placeholder {
      color: #444;
    }
    ::v-deep .el-input--small .el-input__inner::-moz-placeholder {
      color: #444;
    }
    ::v-deep .el-input--small .el-input__inner:-ms-input-placeholder {
      color: #444;
    }
  }
  .wrap {
    margin: 20px;
    .new-search {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      ::v-deep .el-button--primary {
        border-radius: 0px;
        width: 73px;
        height: 30px;
        background: #006eff;
        border-color: #006eff;
        font-size: 12px;
        padding: 0px;
      }
    }
    .table-page {
      .table-box {
        ::v-deep .el-table tr {
          height: 40px;
        }
        ::v-deep .el-table th {
          padding: 0px;
        }
        ::v-deep .el-table th > .cell {
          font-size: 12px;
          color: #888;
          font-weight: 700;
        }
        ::v-deep .el-table--enable-row-transition .el-table__body td {
          font-size: 12px;
        }
        .exceed {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }
        .el-table .cell {
          a {
            color: #006eff;
            &:hover {
              text-decoration: underline;
            }
          }
          i {
            color: #999;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
          }
        }
        .more {
          display: flex;
          & > a {
            margin-right: 10px;
          }
          ::v-deep .el-dropdown {
            color: #006eff;
            font-size: 12px;
            cursor: pointer;
          }
        }
      }
      .page-box {
        padding: 10px 10px 14px 10px;
        height: 57px;
        display: flex;
        justify-content: flex-end;
        background: #fff;
      }
    }
  }
}
.el-dropdown-menu__item {
  padding: 0px;
  & > span {
    display: inline-block;
    width: 100%;
    height: 100%;
    padding: 0 20px;
  }
  .dis-delete {
    cursor: not-allowed;
    color: #bbb;
  }
}
.el-dropdown-menu__item:not(.is-disabled):hover {
  background-color: #f2f2f2;
}
</style>


