<template>
  <div class="domainManagement-wrap">
    <HeadCom title="域名管理"></HeadCom>
    <div class="wrap">
      <div class="domainTitle-wrap">
        <div class="title">
          <p>{{ $t("CSS.domainManagement.0") }}</p>
          <p>
            {{ $t("CSS.domainManagement.1") }}
            <el-link
              type="primary"
              href="../../index.html#/documentcenter/doc/30559"
              target="_blank"
              >域名管理</el-link
            >
            和
            <el-link
              type="primary"
              href="../../index.html#/documentcenter/doc/30560"
              target="_blank"
              >CNAME配置</el-link
            >
          </p>

          <p>{{ $t("CSS.domainManagement.2") }}</p>
        </div>
      </div>
      <div class="domainTitleBnt">
        <div class="bntWrap" style="flex:1">
          <el-button type="primary" @click="addDomin">添加域名</el-button>
          <!-- <el-button type="primary" @click="editTags">编辑标签</el-button> -->
        </div>
        <div class="input">
          <el-input
            v-model="tableDataName"
            :placeholder="$t('CSS.domainManagement.8')"
            size="small"
            class="inputSearch"
            style="width:90%;"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="doFilter"
            ></i>
          </el-input>
        </div>
      </div>
      <div class="domainTable">
        <div class="tableWrap">
          <el-table
            empty-text="暫無數據"
            :data="tableDataBegin"
            ref="multipleTable"
            tooltip-effect="dark"
            v-loading="loadShow"
          >
            <el-table-column prop="Name" label="域名" width>
              <template slot-scope="scope">
                <el-button type="text" @click="toDetail(scope.row)">{{
                  scope.row.Name
                }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="CurrentCName" label="CNAME" width>
              <template slot-scope="scope">
                <el-tooltip
                  effect="light"
                  content="CNAME已配置"
                  placement="bottom"
                  v-if="scope.row.BCName === 1"
                >
                  <i class="el-icon-success" style="color: #0abf5b;"></i>
                </el-tooltip>

                <el-tooltip
                  effect="light"
                  content="CNAME未配置"
                  placement="bottom"
                  v-else
                >
                  <i class="el-icon-warning" style="color: #e54545;"></i>
                </el-tooltip>
                {{ scope.row.TargetDomain }}
                <!-- <span v-if="scope.row.Status==0">{{scope.row.TargetDomain}}</span>
                <span v-if="scope.row.Status==1">{{scope.row.CurrentCName}}</span>-->
              </template>
            </el-table-column>
            <el-table-column prop="Type" :label="$t('CSS.domainManagement.3')">
              <template slot-scope="scope">
                <span v-if="scope.row.Type == 0">推流域名</span>
                <span v-if="scope.row.Type == 1">播放域名</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="Status"
              :label="$t('CSS.domainManagement.4')"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.Status == 0" style="color:red"
                  >未{{ $t("CSS.domainManagement.7") }}</span
                >
                <span v-if="scope.row.Status == 1" style="color:green"
                  >已{{ $t("CSS.domainManagement.7") }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="CreateTime"
              :label="$t('CSS.domainManagement.5')"
            >
              <template slot-scope="scope">{{ scope.row.CreateTime }}</template>
            </el-table-column>
            <el-table-column
              prop="RentExpireTime"
              :label="$t('CSS.domainManagement.6')"
            >
              <template slot-scope="scope">{{
                scope.row.RentExpireTime
              }}</template>
            </el-table-column>
            <el-table-column prop="action" label="操作" width="180">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="toDetail(scope.row)"
                  >管理</el-button
                >
                <el-button
                  v-if="scope.row.Status == 0"
                  type="text"
                  size="small"
                  @click="startBtn(scope.$index, scope.row)"
                  >啟用</el-button
                >
                <el-button
                  v-if="scope.row.Status == 1"
                  type="text"
                  size="small"
                  @click="stopBtn(scope.$index, scope.row)"
                  >禁用</el-button
                >
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, scope.row)"
                  type="text"
                  size="small"
                  :disabled="scope.row.isOwnDomain"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tabListPage">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalItems"
          ></el-pagination>
        </div>
      </div>
      <addModel :isShow="addModel" @closeAddModel="closeAddModel" />
      <stopModel
        :isShow="stopModel"
        :con="DomainName"
        @closeStopDominModel="closeStopDominModel"
      />
      <deleteModel
        :isShow="deleteModel"
        :con="deleteDominArr"
        @closedeleteDominModel="closedeleteDominModel"
      />
      <editTagsModel
        :isShow="editTagsModel"
        @closeEditTagsModel="closeEditTagsModel"
      />
    </div>
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
import addModel from "./model/addModel";
import stopModel from "./model/stopModel";
import deleteModel from "./model/deleteModel";
import editTagsModel from "./model/editTagsModel";
import { DOMAIN_LIST, ENABLE_DOMAIN, PROHIBIT_DOMAIN } from "@/constants";
import { isOwnDomain } from "./utils/OwnDomain";

export default {
  components: {
    HeadCom,
    addModel: addModel, // 添加域名弹框
    stopModel: stopModel, // 禁用弹框
    deleteModel: deleteModel, // 删除弹框
    editTagsModel: editTagsModel // 编辑标签
  },
  name: "domainManagement",
  data() {
    return {
      tableDataBegin: [], // 表格数据
      tableDataName: "", // 搜索框值
      tableDataEnd: [], // 定义一个空数组
      currentPage: 1, // 当前页数
      pageSize: 10, // 每页长度
      totalItems: 0, // 总数量
      filterTableDataEnd: [], // 过滤之后的数组
      flag: false, // 定义一个开关
      checkArr: [], // 被选中选项
      addModel: false, // 添加域名弹框
      stopModel: false, // 禁用弹框
      DomainName: "", // 禁用域名传值
      deleteDominArr: [], // 删除域名数组传值
      deleteModel: false, // 删除弹框
      editTagsModel: false, // 编辑标签弹框
      loadShow: false, // 加载
      allData: [], //
      typeNew: "" // 类型
    };
  },
  mounted() {
    // this.getData();
    this.describeLiveDomains();
  },
  methods: {
    // 1.1.查询域名列表(支持分页查询)
    describeLiveDomains() {
      this.loadShow = true;
      let params = {
        Version: "2018-08-01",
        PageSize: this.pageSize, // 分页大小，范围：10~100。默认10
        PageNum: this.currentPage // 取第几页，范围：1~100000。默认1
        // DomainPrefix: this.tableDataName
      };
      if (this.tableDataName) {
        params.DomainPrefix = this.tableDataName;
      }
      this.axios.post(DOMAIN_LIST, params).then(res => {

        // 是否是自有域名
        res.Response.DomainList.forEach(element => {
          element.isOwnDomain = isOwnDomain(element.Name)
        });

        console.log(res.Response.DomainList);
        this.allData = res.Response.DomainList;
        this.tableDataBegin = res.Response.DomainList;
        this.totalItems = res.Response.AllCount;
        this.loadShow = false;
        // if(false) {
        //   this.$message({
        //     message: '恭喜你，这是一条成功消息',
        //     type: 'success'
        //   });
        // } else {
        //   this.$message.error('错了哦，这是一条错误消息');
        // }
      });
    },
    // 搜索
    doFilter() {
      this.currentPage = 1;
      this.$nextTick(this.describeLiveDomains);
    },
    // 切换pagesize
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.$nextTick(this.describeLiveDomains);
    },
    // 切换分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      // 分页查询
      this.$nextTick(this.describeLiveDomains);
    }, // 组件自带监控当前页码

    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.tableDataEnd = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from]);
        }
      }
    },
    // 启用域名按钮
    startBtn(index, row) {
      this.DomainName = row.Name;
      let params = {
        Version: "2018-08-01",
        DomainName: this.DomainName
      };
      this.axios.post(ENABLE_DOMAIN, params).then(data => {
        if (data.Response.Error == undefined) {
          this.$message({
            message: "启用域名成功",
            type: "success"
          });
          this.describeLiveDomains(); // 刷新列表页面
        } else {
          this.$message.error(data.Response.Error.Message);
        }
      });
    },
    // 禁用域名按钮
    stopBtn(index, row) {
      this.stopModel = true;
      this.DomainName = row.Name;
    },
    // 关闭禁用域名弹框
    closeStopDominModel(isShow) {
      if (isShow) {
        // 是否确认禁用
        console.log(isShow);
        let param = {
          Version: "2018-08-01",
          DomainName: this.DomainName
        };
        this.axios.post(PROHIBIT_DOMAIN, param).then(data => {
          if (data.Response.Error == undefined) {
            this.$message({
              message: "禁用域名成功",
              type: "success"
            });
            this.describeLiveDomains(); // 刷新列表页面
          } else {
            this.$message.error(data.Response.Error.Message);
          }
        });
      }
      this.stopModel = false;
    },
    // 删除按钮
    deleteRow(index, row) {
      this.deleteDominArr = [];
      this.deleteModel = true;
      this.deleteDominArr.push(row.Name);
      this.deleteDominArr.push(row.Type);
      // console.log(this.deleteDominArr)
    },
    // 关闭删除弹框
    closedeleteDominModel(isShow) {
      this.deleteModel = isShow;
    },
    // 编辑标签
    editTags() {
      if (this.checkArr.length == 0) {
        this.$message({
          showClose: true,
          message: "没有選擇域名"
        });
        return false;
      } else {
        this.editTagsModel = true;
      }
    },
    // 关闭编辑标签弹框
    closeEditTagsModel(isShow) {
      this.editTagsModel = isShow;
    },
    // 添加域名
    addDomin() {
      this.addModel = true;
    },
    // 关闭添加域名弹框
    closeAddModel(isShow) {
      this.addModel = isShow;
    },
    // 跳转详情页
    toDetail(row) {
      if (row.Type === 1) {
        // 播放域名
        this.$router.push({
          name: "detailPlay",
          query: row
        });
      } else if (row.Type === 0) {
        // 推流域名
        this.$router.push({
          name: "detailPushStream",
          query: row
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-link {
  color: #006eff;
}
i {
  cursor: pointer;
}
.newClear:after {
  display: block;
  content: "";
  clear: both;
}
.domainManagement-wrap >>> .el-button {
  height: 30px;
  line-height: 30px;
  border-radius: 0;
  font-size: 12px;
  padding-top: 0;
}
.wrap {
  width: 100%;
  .domainTitle-wrap {
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    .title {
      color: #003b80;
      padding: 10px 30px 10px 20px;
      border: 1px solid #97c7ff;
      border-radius: 2px;
      background: #e5f0ff;
      box-sizing: border-box;
      p {
        margin: 5px;
      }
    }
  }
  .domainTitleBnt {
    width: 100%;
    display: flex;
    padding: 0px 20px 0 20px;
    box-sizing: border-box;
  }
  .domainTable {
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
  .tabListPage {
    height: 50px;
    padding-top: 8px;
    border-top: 1px solid #ddd;
    text-align: right;
    background-color: #fff;
    ::v-deep .el-input__inner {
      width: 100% !important;
      height: 30px !important;
    }
  }
}
</style>
