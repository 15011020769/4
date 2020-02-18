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
        <el-button size="small" @click='flag=!flag'>监控</el-button>
        <el-button size="small" @click="goAddExist">添加已有节点</el-button>
        <el-button size="small" :disabled="this.multipleSelection.length > 0 ? false : true" @click="showDeleteModal()">移出</el-button>
        <el-button size="small" :disabled="this.multipleSelection.length > 0 ? false : true" @click="showBlockModal()">封锁</el-button>
        <el-button size="small" :disabled="this.multipleSelection.length > 0 ? false : true">解除封锁</el-button>
      </div>
       <!-- 抽屉 -->
      <openDrawer :flag='flag'
        title='节点监控'
       @changeFlag='setFlag'
       @setTime='setTime'></openDrawer>
      <!-- 右侧 -->
      <div class="grid-right">
        <tkeSearch
          exportData
          inputPlaceholder="请输入IP或节点名/ID"
          :typeSelect="false"
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
        id="exportTable"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="ID/节点名">
          <template slot-scope="scope">
            <span @click="goNodeDetail()" class="tke-text-link"
              >{{scope.row.InstanceId}}</span
            >
            <p class="" slot="{{scope.row.InstanceName}}">{{scope.row.InstanceName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === true" class="text-green"
              ></span
            >
            <span v-else class="text-red"></span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="可用区">
          <template slot-scope="scope">
            <el-tooltip effect="light" content="台北一区" placement="top">
              <span></span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="" label="kubernetes版本">
          <template slot-scope="scope">
            <el-tooltip effect="light" content="v1.10.5-tke.6" placement="top">
              <span></span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="address" width="200" label="配置">
          <template slot-scope="scope">
            标准型{{scope.row.InstanceFamily}} <br />
            {{scope.row.CPU}}核 , {{scope.row.Memory}}GB , 1 Mbps<br />
            系统盘: {{scope.row.SystemDisk && scope.row.SystemDisk.DiskSize}}GB 高性能云硬盘<br />
          </template>
        </el-table-column>
        <el-table-column prop="nodeTotal" label="IP地址">
          <template slot-scope="scope">
            <p>{{scope.row.PublicIpAddresses && scope.row.PublicIpAddresses[0]}}</p>
            <p>{{scope.row.PrivateIpAddresses && scope.row.PrivateIpAddresses[0]}}</p>
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
            <p></p>
          </template>
        </el-table-column>
        <el-table-column width="200" prop="" label="计费模式">
          <template slot-scope="scope">
            <p></p>
            <p>{{scope.row.CreatedTime}}创建</p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <p class="tke-text-link" @click="showDeleteModal(scope.row)">移出</p>

            <el-dropdown class=" tke-dropdown">
              <span class="el-dropdown-link ">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a"
                  ><span class="tke-text-link" @click="showBlockModal(scope.row)">封锁</span></el-dropdown-item
                >
                <el-dropdown-item command="a"
                  ><span class="tke-text-link" @click="show">取消封锁</span></el-dropdown-item
                >
                <el-dropdown-item command="b"
                  ><span class="tke-text-link">驱逐</span></el-dropdown-item
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
    <el-dialog title="您确定封锁以下节点么？" :visible.sync="showBlockademodal" width="35%">
      <div>已选择<span style="color:#ff9d00;">{{this.multipleSelection.length}}个</span>节点,<a @click="show=!show" style="cursor: pointer;">查看详情</a></div>
          <el-collapse-transition>
            <div v-show="show">
              <el-table :data="multipleSelection" height="200">
                <el-table-column property="InstanceId" label="名称" width="150"></el-table-column>
                <el-table-column property="InstanceName" label="节点名称" width="200"></el-table-column>
                <el-table-column label="状态" width="200">
                  <template>
                      可删除
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-transition>
          <p>封锁节点后，将不接受新的Pod调度到该节点，需要手动取消封锁的节点。</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="blockNode()">确 定</el-button>
          <el-button @click="showBlockademodal = false">取 消</el-button>
        </span>
    </el-dialog>
    <el-dialog title="您确定删除以下节点么？" :visible.sync="showDelModal" width="35%">
      <div>已选择<span style="color:#ff9d00;">{{this.multipleSelection.length}}个</span>节点,<a @click="show=!show" style="cursor: pointer;">查看详情</a></div>
          <el-collapse-transition>
            <div v-show="show">
              <el-table :data="multipleSelection" height="200">
                <el-table-column property="InstanceId" label="名称" width="150"></el-table-column>
                <el-table-column label="状态" width="150">
                  <template>
                      可删除
                  </template>
                </el-table-column>
                <el-table-column label="状态" width="200">
                  <template>
                      可移出并销毁
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-transition>
          <p style="color: red;">移除节点后若需重新加入到集群需重装系统，请谨慎操作。</p>
          <!-- <el-checkbox-group v-model="checkedItem"> -->
            <el-checkbox v-model="checkedItem" @change="changeDel(checkedItem)"></el-checkbox>
          <!-- </el-checkbox-group> -->
          <span>销毁按量计费的节点（销毁后不可恢复，请谨慎操作并提前备份数据），包年包月不支持销毁</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="deleteNode()">确 定</el-button>
          <el-button @click="showDelModal = false">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import subTitle from "@/views/TKE/components/subTitle";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import openDrawer from "./components/openDrawer";
import { ErrorTips } from "@/components/ErrorTips";
import XLSX from "xlsx";
import FileSaver from "file-saver";
import { ALL_CITY, NODE_INFO, NODE_LIST, POINT_REQUEST, OBJ_LIST, DELETE_NODE, BLOCK_NODE } from '@/constants';
export default {
  name: "colonyNodeManageNode",
  data() {
    return {
      clusterId: "",
      searchInput: "", // 输入的搜索关键字
      loadShow: false, // 加载是否显示
      city: {},
      list: [], // 列表
      total: 0,
      pageSize: 20,
      pageIndex: 0,
      flag: false,
      showBlockademodal: false,
      showDelModal: false,
      show: true,
      checkedItem: true,
      changeType: '',
      unschedulable: 0,
      multipleSelection: []
    };
  },
  components: {
    subTitle,
    Loading,
    tkeSearch,
    openDrawer
  },
  created() {
    // 从路由获取集群id
    this.clusterId = this.$route.query.clusterId;
    this.ForwardRequest();
    this.getNodeList();
    this.GetCity();
  },
  methods: {
    //获取节点列表
    async getNodeList () {
      this.loadShow = true;
      let params = {
        ClusterId: this.clusterId,
        Offset: this.pageIndex,
        Limit: this.pageSize,
        Version: "2018-05-25",
        InstanceRole: "WORKER"
      };
      if(this.searchInput !== '') {

      }
      const res = await this.axios.post(NODE_INFO, params);
      this.loadShow = false;
      let ids = [];
      if (res.Response.InstanceSet.length > 0) {
        res.Response.InstanceSet.map(obj => {
          ids.push(obj.InstanceId);
        });
      }
      let param = {
        Version: "2017-03-12",
        Offset: this.pageIndex,
        Limit: this.pageSize
      }
      if(ids.length > 0) {
        for(let i = 0; i < ids.length; i++) {
          param['InstanceIds.'+i] = ids[i];
        }
        this.loadShow = true;
        let nodeRes = await this.axios.post(NODE_LIST, param);
        if(nodeRes.Response.Error === undefined) {
          this.loadShow = false;
          if(nodeRes.Response.InstanceSet.length > 0) {
            this.list = nodeRes.Response.InstanceSet;
          }
        } else {
          this.loadShow = false;
          let ErrTips = {
            
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      }
    },

    // 获取地域
    GetCity() {
      this.axios.get(ALL_CITY).then(data => {
        let city = data.data[0];
        localStorage.setItem("regionv1", city.regionCode);
        localStorage.setItem("regionv2", city.Region);
      });
    },

    // 监听搜索框的值
    changeSearchInput(val) {
      this.searchInput = val;
      console.log(this.searchInput);
    },
    // 点击搜索
    clickSearch(val) {
      this.searchInput = val;
      this.getNodeList();
      console.log(this.searchInput);
    },
    setFlag (data) {
      console.log(data)
      this.flag = data
    },
    setTime (data) {
      console.log(data)
    },

    //打开封锁弹窗
    showBlockModal(rowObj) {
      if(rowObj) {
        this.multipleSelection.push(rowObj);
      }
      this.showBlockademodal = true;
      this.unschedulable = 1;
    },

    //打开删除弹窗
    showDeleteModal(rowObj) {
      if(rowObj) {
        this.multipleSelection.push(rowObj);
      }
      this.showDelModal = true;
    },

    //选择删除策略
    changeDel(val) {
      let change = this.checkedItem;
      if(change) {
        this.changeType = 'terminate';
      } else {
        this.changeType = 'retain';
      }
    },

    //封锁节点、批量封锁
    async blockNode() {
      this.loadShow = true;
      let param = {
        clusterId: this.clusterId,
        unschedulable: this.unschedulable
      }
      let blockData = this.multipleSelection;
      for (let i = 0; i < blockData.length; i++) {
        param["instanceIds."+i] = blockData[i].InstanceId;
      }
      await this.axios.post(BLOCK_NODE, param).then(res => {
        if(res.code === 0) {
          this.showBlockademodal = false;
          this.getNodeList();
          this.multipleSelection = [];
        } else {
          let ErrTips = {
            
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },

    //删除、批量删除节点
    async deleteNode() {
      this.loadShow = true;
      let param = {
        ClusterId: this.clusterId,
        ForceDelete: false,
        Version: "2018-05-25",
      }
      let deleteData = this.multipleSelection;
      for (let i = 0; i < deleteData.length; i++) {
        param["InstanceIds."+i] = deleteData[i].InstanceId;
      }
      let change = this.checkedItem;
      if(change) {
        param["InstanceDeleteMode"] = 'terminate';
      } else {
        param["InstanceDeleteMode"] = 'retain';
      }
      debugger
      await this.axios.post(DELETE_NODE, param).then(res => {
        if(res.Response.RequestId) {
          this.showDelModal = false;
          this.getNodeList();
          this.multipleSelection = [];
        } else {
          let ErrTips = {
            "InternalError": "内部错误",
            "InternalError.Db": "db错误",
            "InternalError.DbAffectivedRows": "DB错误",
            "InternalError.Param": "Param",
            "InternalError.PublicClusterOpNotSupport": "集群不支持当前操作",
            "InvalidParameter": "参数错误",
            "LimitExceeded": "超过配额限制"
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },

    // 导出表格
    exportExcel() {
      console.log("exportExcel...");
      var wb = XLSX.utils.table_to_book(document.querySelector("#exportTable"));
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
          this.$t("tke-nodeList") + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
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
  
<style lang="scss" scoped>
  .tke-node-list-nobr{
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
</style>
