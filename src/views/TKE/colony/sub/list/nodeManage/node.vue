<!-- 节点列表 -->
<template>
  <div>
    <subTitle :title="tit" />

    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid ">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button size="small" @click="goExpand" type="primary"
          >新建节点</el-button
        >
        <el-button size="small" @click='toMonitor' >监控</el-button>
        <el-button size="small" @click="goAddExist">添加已有节点</el-button>
        <el-button size="small" :disabled="this.multipleSelection.length > 0 ? false : true" @click="showDeleteModal()">移出</el-button>
        <el-button size="small" :disabled="this.multipleSelection.length > 0 ? false : true" @click="showBlockModal()">封锁</el-button>
        <el-button size="small" :disabled="this.multipleSelection.length > 0 ? false : true" @click="showUnBlockModal()">解除封锁</el-button>
      </div>
      <!-- 右侧 -->
      <div class="tool">
        <div class="searchRight">
          <el-select placeholder="请选择" v-model="ChoiceValue">
            <el-option v-for="item in searchTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-input v-model="searchValue" class="searchs" placeholder="请输入内容" @change="_searchchange">
          </el-input>
          <el-button class="el-icon-search" size="small" @click="_search"></el-button>
          <span>
            <el-tooltip class="tooltip" effect="dark" content="導出表格" placement="top">
              <i  @click="exportExcel" class="el-icon-download tke-download "></i>
            </el-tooltip>
          </span>
        </div>
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
            <span @click="goNodeDetail(scope.row)" class="tke-text-link"
              >{{scope.row.InstanceId}}</span
            >
            <p class="" slot="{{scope.row.InstanceName}}">{{scope.row.InstanceName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="" label="状态">
          <template slot-scope="scope">
            <span :class="[
                scope.row.status !== 'running' ? 'text-red' : 'text-green'
              ]" >{{scope.row.status | changeStatus}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="" label="可用区">
          <template slot-scope="scope">
            <!-- <el-tooltip effect="light" content="" placement="top"> -->
              <span>{{scope.row.Placement.Zone | zone}}</span>
            <!-- </el-tooltip> -->
          </template>
        </el-table-column>

        <el-table-column prop="" label="kubernetes版本">
          <template slot-scope="scope">
            <el-tooltip effect="light" content="v1.10.5-tke.6" placement="top">
              <span>{{scope.row.kubeletVersion}}</span>
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
            <p>-</p>
          </template>
        </el-table-column>
        <el-table-column width="200" prop="" label="计费模式">
          <template slot-scope="scope">
            <p>{{scope.row.InstanceChargeType | changeChargeType}}</p>
            <p>{{scope.row.addTime}}创建</p>
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
                  ><span class="tke-text-link" @click="showUnBlockModal(scope.row)">取消封锁</span></el-dropdown-item
                >
                <el-dropdown-item command="b"
                  ><span class="tke-text-link" @click="showExpelDialog(scope.row)">驱逐</span></el-dropdown-item
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
    <el-dialog title="您确定取消封锁以下节点么？" :visible.sync="showUnBlockademodal" width="35%">
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
          <el-button type="primary" @click="unBlockNode()">确 定</el-button>
          <el-button @click="showUnBlockademodal = false">取 消</el-button>
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
    <el-dialog title="您确定对选中节点进行驱逐么？" :visible.sync="showExpelModal" width="35%">
      <div>已选择<span style="color:#ff9d00;">{{this.podList.length || 0}}个</span>实例,<a @click="show=!show" style="cursor: pointer;">查看详情</a></div>
          <el-collapse-transition>
            <div v-show="show">
              <el-table :data="podList" height="200">
                <el-table-column property="Name" label="实例(Pod)名称" width="200"></el-table-column>
                <el-table-column property="Namespace" label="所属集群空间" width="200"></el-table-column>
              </el-table>
            </div>
          </el-collapse-transition>
          <p>节点驱逐后，将会把节点内的所有Pod（不包含DaemonSet管理的Pod）从节点中驱逐到集群内其他节点，并将节点设置为封锁状态。</p>
          <p style="color: red;">注意：本地存储的Pod被驱逐后数据将丢失，请谨慎操作</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="expelNode()">确 定</el-button>
          <el-button @click="showExpelModal = false">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import subTitle from "@/views/TKE/components/subTitle";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import { ErrorTips } from "@/components/ErrorTips";
import moment from 'moment';
import XLSX from "xlsx";
import FileSaver from "file-saver";
import { ALL_CITY, NODE_INFO, NODE_LIST, POINT_REQUEST, OBJ_LIST, DELETE_NODE, BLOCK_NODE, 
  NODE_ID_LIST, NODE_POD_LIST, JOB_ID, MOMITOR_TKE } from '@/constants';
export default {
  name: "colonyNodeManageNode",
  data() {
    return {
      tit:"节点列表",
      clusterId: "",
      searchInput: "", // 输入的搜索关键字
      loadShow: false, // 加载是否显示
      city: {},
      list: [], // 列表
      total: 0,
      pageSize: 10,
      pageIndex: 0,
      flag: false,
      showBlockademodal: false,//是否打开封锁弹窗
      showUnBlockademodal: false,
      showDelModal: false,//是否打开删除弹窗
      showExpelModal: false,//是否打开驱逐弹窗
      show: true,//弹窗是否显示详情
      checkedItem: true,
      changeType: '',
      unschedulable: 0,
      ChoiceValue: '', //搜索选择
      searchValue: '', //搜索值
      multipleSelection: [],//选中的列表
      podList: [],
      clusterIds: [],
      instanceId: '',
      searchTypes: [
        {
          value: 'name',
          label: '节点名称'
        },
        {
          value: 'ip',
          label: 'IP'
        },
        {
          value: 'id',
          label: '节点ID'
        }
      ]
    };
  },
  components: {
    subTitle,
    Loading,
    tkeSearch,
  },
  created() {
    // 从路由获取集群id
    this.clusterId = this.$route.query.clusterId;
    this.ForwardRequest();
    this.getNodeList();
    this.GetCity();
  },
  methods: {
    toMonitor(){
      //跳转监控页面
      this.$router.push({
        name:"colonyOpenMonitor",
        query:{
          title:this.tit
        }
      })
    },
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
      if(this.ChoiceValue !== '' && this.searchValue !== '') {
        let clusterIds = this.clusterIds;
        params.InstanceIds = [];
        clusterIds.map(o => {
          params.InstanceIds.push(o);
        })
      }
      const res = await this.axios.post(NODE_INFO, params);
      if(res.Response.Error === undefined) {
        this.loadShow = false;
        let ids = [];
        if (res.Response.InstanceSet.length > 0) {
          res.Response.InstanceSet.map(obj => {
            ids.push(obj.InstanceId);
          });
        }
        let nodeInfoList = res.Response.InstanceSet;
        let param = {
          Version: "2017-03-12",
          Limit: this.pageSize
        }
        let param1 = {
          Method: "GET",
          Path: "/api/v1/nodes",
          Version: "2018-05-25",
          ClusterName: this.clusterId,
        }
        let paramJob = {
          // Conditions: [JSON.stringify(["tke_cluster_instance_id","=",this.clusterId]),JSON.stringify(["node_role","=","Node"])],
          EndTime: new Date().getTime(),
          // Fields: ["avg(k8s_node_cpu_core_request_total)", "avg(k8s_node_memory_request_bytes_total)"],
          // GroupBys: ["timestamp(60s)", "unInstanceId"],
          Limit: 65535,
          Module: "/front/v1",
          NamespaceName: "k8s_node",
          Offset: 0,
          Order: "desc",
          OrderBy: "timestamp",
          StartTime: new Date().getTime(),
          Version: "2019-06-06"
        }
        paramJob['Conditions.0'] = JSON.stringify(["tke_cluster_instance_id","=",this.clusterId]);
        paramJob['Conditions.1'] = JSON.stringify(["node_role","=","Node"]);
        paramJob['Fields.0'] = 'avg(k8s_node_cpu_core_request_total)';
        paramJob['Fields.1'] = 'avg(k8s_node_memory_request_bytes_total)';
        paramJob['GroupBys.0'] = 'timestamp(60s)';
        paramJob['GroupBys.1'] = 'unInstanceId';
        if(ids.length > 0) {
          for(let i = 0; i < ids.length; i++) {
            param['InstanceIds.'+i] = ids[i];
          }
          let k8sNodeList = [];
          this.loadShow = true;
          let k8sRes = await this.axios.post(POINT_REQUEST,param1);
          if(k8sRes.Response.Error === undefined) {
            let response = JSON.parse(k8sRes.Response.ResponseBody);
            k8sNodeList = response.items;
            this.loadShow = false;
          } else {
            this.loadShow = false;
            let ErrTips = {
              
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[k8sRes.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
          let jobRes = await this.axios.post(JOB_ID, paramJob);
          let param3 = {
            Version: "2019-06-06",
            JobId: jobRes.Response.JobId,
            Module: '/front/v1'
          }
          
          let jobRes22 = await this.axios.post(MOMITOR_TKE, param3);
          
          this.loadShow = true;
          let nodeRes = await this.axios.post(NODE_LIST, param);
          if(nodeRes.Response.Error === undefined) {
            this.loadShow = false;
            if(nodeRes.Response.InstanceSet.length > 0) {
              nodeRes.Response.InstanceSet.map(node => {
                node.addTime = moment(node.CreatedTime).format("YYYY-MM-DD HH:mm:ss");
                nodeInfoList.map(info => {
                  if(node.InstanceId === info.InstanceId) {
                    node.status = info.InstanceState;
                  }
                });
                k8sNodeList.map(k8s => {
                  let providerId = k8s.spec.providerID;
                  if(node.InstanceId === providerId.substring(providerId.lastIndexOf("/")+1)) {
                    node.kubeletVersion = k8s.status.nodeInfo.kubeletVersion;
                    node.allocatable = k8s.status.allocatable;
                    node.unschedulable = k8s.spec.unschedulable;
                  }
                });
                return node;
              });
              this.list = nodeRes.Response.InstanceSet;
              console.log(this.list);
            }
            this.total = res.Response.TotalCount;
          } else {
            this.loadShow = false;
            let ErrTips = {
              
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[nodeRes.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
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
    },

    // 获取地域
    GetCity() {
      this.axios.get(ALL_CITY).then(data => {
        let city = data.data[0];
        localStorage.setItem("regionv1", city.regionCode);
        localStorage.setItem("regionv2", city.Region);
      });
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

    //打开解除封锁弹窗
    showUnBlockModal(rowObj) {
      if(rowObj) {
        this.multipleSelection.push(rowObj);
      }
      this.showUnBlockademodal = true;
      this.unschedulable = 0;
    },

    //打开驱逐弹窗
    async showExpelDialog(rowObj) {
      this.instanceId = rowObj.InstanceId;
      this.showExpelModal = true;
      let param = {
        ClusterId: this.clusterId,
        InstanceId: rowObj.InstanceId,
        DryRun: 1
      }
      let res = await this.axios.post(NODE_POD_LIST, param);
      if(res.code === 0 && res.data) {
        this.podList = res.data.Pods;
        this.loadShow = false;
      }
    },

    //驱逐节点
    async expelNode() {
      this.showExpelModal = true;
      let param = {
        ClusterId: this.clusterId,
        InstanceId: this.instanceId,
        DryRun: 0
      }
      let res = await this.axios.post(NODE_POD_LIST, param);
      if(res.code === 0) {
        this.showExpelModal = false;
        this.podList = [];
        this.loadShow = false;
      }
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

    //解除封锁
    async unBlockNode() {
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
          this.showUnBlockademodal = false;
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

    // 搜索框内容为空
    _searchchange() {
      if (this.searchValue === '') {
        this.getNodeList();
      }
    },

    //根据节点名称获取集id列表
    async getClusterNodeIds(param) {
      this.loadShow = true;
      await this.axios.post(NODE_ID_LIST, param).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false;
          if(res.Response.InstanceIdSet.length > 0) {
            let instance = res.Response.InstanceIdSet;
            for(let i = 0; i < instance.length; i++) {
              this.clusterIds.push(instance[i]);
            }
            this.getNodeList();
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
      });
    },

    //搜索
    _search() {
      if (this.ChoiceValue !== '' && this.searchValue !== '') {
        console.log(this.ChoiceValue,"ChoiceValue")
        console.log(this.searchValue,"searchValue")
        let choiceValue = this.ChoiceValue;
        let searchValue = this.searchValue;
        if(choiceValue === 'name') {
          let param = {
            ClusterId: this.clusterId, 
            Version: "2018-05-25",
            Offset: this.pageIndex,
            Limit: this.pageSize,
            VagueInstanceName: searchValue
          }
          this.getClusterNodeIds(param);
        } else if (choiceValue === 'ip') {
          let param = {
            ClusterId: this.clusterId, 
            Version: "2018-05-25",
            Offset: this.pageIndex,
            Limit: this.pageSize,
            VagueIpAddress: searchValue
          }
          this.getClusterNodeIds(param);
        } else if (choiceValue === 'id') {
          this.clusterIds.push(searchValue);
        }
        // this._GetFuncList()
      } else {
        this.$message({
          message: '请选择过滤条件且输入搜索值',
          type: "warning",
          showClose: true,
          duration: 0
        });
      }
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
      this.getNodeList();
      this.pageIndex += 1;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getNodeList();
    },

    // 全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 详情
    goNodeDetail(row) {
      this.$router.push({
        name: "nodeDetail",
        query: {
          clusterId: this.clusterId,
          node: row.PrivateIpAddresses[0],
          detail: row
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
        // console.log(JSON.parse(res.Response.ResponseBody))
        // if (res.code === 0) {
        //   this.loadShow = true
        // }
      })
    }  
  },
  filters: {
    //返回状态
    changeStatus(status) {
      if(status === 'failed') {
        return '异常';
      } else if(status === 'initializing') {
        return '创建中';
      } else if(status === 'upgrading') {
        return "升级中";
      } else if(status === 'running') {
        return '健康';
      }
    },
    //返回计费模式
    changeChargeType(type) {
      if(type === 'POSTPAID_BY_HOUR') {
        return '按量计费';
      } else if(type === 'PREPAID') {
        return '报年报月';
      } else if(type === 'SPOTPAID') {
        return '按量计费-竞价';
      }
    },
    //可用区
    zone(val) {
      if(val) {
        if (val.substring(3, val.length - 2) === "taipei") {
          return "台北" + val.substring(val.length - 1, val.length) + "区";
        }
      }
    }
  }  
};
</script>
  
<style lang="scss" scoped>
.tke-grid{
  height:39px;
}
 .tke-grid >>> .el-input__inner,
  .tke-grid >>> .el-button {
    border-radius: 0;
    height: 34px;
  }
  .tke-node-list-nobr{
    vertical-align: middle;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .tool {
    margin: 20px 20px 20px 20px;
    display: flex;
    justify-content: space-between;

    ::v-deep .el-button {
      border-radius: 0 !important;
    }

    ::v-deep .el-button--small {
      border-radius: 0 !important;

    }

    .searchRight {
      display: flex;
    }
  }
</style>
