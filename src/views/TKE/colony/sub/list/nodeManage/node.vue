<!-- 节点列表 -->
<template>
  <div>
    <subTitle :title="tit" />

    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid ">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button size="small" @click="goExpand" type="primary"
          >{{$t('TKE.colony.xjjd')}}</el-button
        >
        <el-button size="small" @click="toMonitor">{{$t('TKE.colony.jk')}}</el-button>
        <el-button size="small" @click="goAddExist">{{$t('TKE.colony.tjyyjd')}}</el-button>
        <el-button
          size="small"
          :disabled="this.multipleSelection.length > 0 ? false : true"
          @click="showDeleteModal()"
          >移出</el-button
        >
        <el-button
          size="small"
          :disabled="
            this.multipleSelection.length > 0 && blockadeType ? false : true
          "
          @click="showBlockModal()"
          >{{$t('TKE.subList.fsuo')}}</el-button
        >
        <el-button
          size="small"
          :disabled="
            this.multipleSelection.length > 0 && unBlockadeType ? false : true
          "
          @click="showUnBlockModal()"
          >{{$t('TKE.subList.jcfs')}}</el-button
        >
      </div>
      <!-- 右侧 -->
      <div class="tool">
        <div class="searchRight">
          <el-select :placeholder="$t('TKE.overview.qxz')" v-model="ChoiceValue">
            <el-option
              v-for="item in searchTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            v-model="searchValue"
            class="searchs"
            :placeholder="$t('TKE.colony.qsrnr')"
            @change="_searchchange"
          >
          </el-input>
          <el-button
            class="el-icon-search"
            size="small"
            @click="_search"
          ></el-button>
          <span>
            <el-tooltip
              class="tooltip"
              effect="dark"
              :content="$t('TKE.subList.dcbg')"
              placement="top"
            >
              <i
                @click="exportExcel"
                class="el-icon-download tke-download "
              ></i>
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
        <el-table-column
          type="selection"
          :selectable="checkboxT"
          disabled="true"
          width="55"
        >
        </el-table-column>
        <el-table-column :label="$t('TKE.colony.idjdm')">
          <template slot-scope="scope">
            <!-- <span @click="goNodeDetail(scope.row)" class="tke-text-link">{{
              scope.row.InstanceId
            }}</span> -->
            <span>{{scope.row.InstanceId}}
              <a :href="'../CVM/index.html#/cloudHost/cloudHostDetail/'+scope.row.InstanceId+'/1'">
                <i class="el-icon-edit-outline"/>
              </a>
            </span>
            <p class="" slot="{{scope.row.InstanceName}}">
              {{ scope.row.InstanceName }}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="" :label="$t('TKE.overview.zt')">
          <template slot-scope="scope">
            <span
              :class="[
                scope.row.status !== 'running' ? 'text-red' : 'text-green'
              ]"
              >{{ scope.row.status | changeStatus }}
            </span>
            <p v-if="scope.row.unschedulable" class="text-red">{{$t('TKE.subList.yfs')}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="" :label="$t('TKE.colony.kyq')">
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              :content="scope.row.Placement.Zone | zone"
              placement="top"
            >
              <span>{{ scope.row.Placement.Zone | zone }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="" label="kubernetes版本">
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              :content="scope.row.kubeletVersion"
              placement="top"
            >
              <span>{{ scope.row.kubeletVersion }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="address" width="200" label="配置">
          <template slot-scope="scope">
            {{ scope.row.InstanceType | instanceType }} <br />
            {{ scope.row.CPU }}核 , {{ scope.row.Memory }}GB ,
            {{ scope.row.InternetAccessible.InternetMaxBandwidthOut }}
            Mbps<br />
            {{$t('TKE.colony.xtp')}}:
            {{ scope.row.SystemDisk && scope.row.SystemDisk.DiskSize }}GB
            {{$t('TKE.colony.gxnyp')}}<br />
          </template>
        </el-table-column>
        <el-table-column prop="nodeTotal" label="IP地址">
          <template slot-scope="scope">
            <p>
              {{
                scope.row.PublicIpAddresses && scope.row.PublicIpAddresses[0] || '-'
              }}(公網)
              <!-- <i class="el-icon-document-copy" @click="copyData"/> -->
            </p>
            <p>
              {{
                scope.row.PrivateIpAddresses && scope.row.PrivateIpAddresses[0] || '-'
              }}(内網)
              <!-- <i class="el-icon-document-copy"/> -->
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="address" :label="$t('TKE.subList.yfpzzy')">
          <template slot-scope="scope">
            <p>CPU: {{scope.row.cpu || '-'}}/{{scope.row.cpuTotal || '-'}}</p>
            <p>{{$t('TKE.overview.ncun')}}: {{scope.row.memory || '-'}}/{{scope.row.memoyTotal || '-'}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="" :label="$t('TKE.subList.ssssz')">
          <template slot-scope="scope">
            <p>{{scope.row.group || '-'}}</p>
          </template>
        </el-table-column>
        <el-table-column width="200" prop="" :label="$t('TKE.colony.jfms')">
          <template slot-scope="scope">
            <p>{{ scope.row.InstanceChargeType | changeChargeType }}</p>
            <p>{{ scope.row.addTime }}{{$t('TKE.subList.cj')}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              :disabled="
                scope.row.status === 'initializing' ||
                scope.row.status === 'upgrading'
                  ? true
                  : false
              "
              class="tke-text-link"
              type="text"
              @click="showDeleteModal(scope.row)"
              >移出
            </el-button>
            <p></p>
            <el-dropdown class=" tke-dropdown">
              <span class="el-dropdown-link ">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">
                  <el-button
                    :disabled="
                      scope.row.status === 'initializing' ||
                      scope.row.status === 'upgrading' ||
                      scope.row.unschedulable
                        ? true
                        : false
                    "
                    class="tke-text-link"
                    type="text"
                    @click="showBlockModal(scope.row)"
                    >{{$t('TKE.subList.fsuo')}}
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item command="a">
                  <el-button
                    :disabled="
                      scope.row.status === 'initializing' ||
                      scope.row.status === 'upgrading' ||
                      !scope.row.unschedulable
                        ? true
                        : false
                    "
                    class="tke-text-link"
                    type="text"
                    @click="showUnBlockModal(scope.row)"
                    >{{$t('TKE.subList.qxfsuo')}}
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item command="b">
                  <el-button
                    :disabled="
                      scope.row.status === 'initializing' ||
                      scope.row.status === 'upgrading'
                        ? true
                        : false
                    "
                    class="tke-text-link"
                    type="text"
                    @click="showExpelDialog(scope.row)"
                    >{{$t('TKE.subList.qzhu')}}
                  </el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <div class="tke-page">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            :pager-count="7"
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
    <el-dialog
      :title="$t('TKE.subList.qdfs')"
      :visible.sync="showBlockademodal"
      width="35%"
    >
      <div>
        {{$t('TKE.colony.yxze')}}<span style="color:#ff9d00;"
          >{{ this.multipleSelection.length }}{{$t('TKE.overview.ge')}}</span
        >{{$t('TKE.overview.jd')}},<a @click="show = !show" style="cursor: pointer;">{{$t('TKE.overview.ckxq')}}</a>
      </div>
      <el-collapse-transition>
        <div v-show="show">
          <el-table :data="multipleSelection" height="200">
            <el-table-column
              property="InstanceId"
              :label="$t('TKE.subList.mcheng')"
              width="150"
            ></el-table-column>
            <el-table-column
              property="InstanceName"
              :label="$t('TKE.colony.jdmc')"
              width="200"
            ></el-table-column>
            <el-table-column :label="$t('TKE.overview.zt')" width="200">
              <template>
                {{$t('TKE.subList.ksc')}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-transition>
      <p>{{$t('TKE.subList.fsjdhou')}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="blockNode()">{{$t('TKE.overview.qd')}}</el-button>
        <el-button @click="closeBlock">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="$t('TKE.subList.qxfs')"
      :visible.sync="showUnBlockademodal"
      width="35%"
    >
      <div>
        {{$t('TKE.colony.yxze')}}<span style="color:#ff9d00;"
          >{{ this.multipleSelection.length }}{{$t('TKE.overview.ge')}}</span
        >{{$t('TKE.overview.jd')}},<a @click="show = !show" style="cursor: pointer;">{{$t('TKE.overview.ckxq')}}</a>
      </div>
      <el-collapse-transition>
        <div v-show="show">
          <el-table :data="multipleSelection" height="200">
            <el-table-column
              property="InstanceId"
              :label="$t('TKE.subList.mcheng')"
              width="150"
            ></el-table-column>
            <el-table-column
              property="InstanceName"
              :label="$t('TKE.colony.jdmc')"
              width="200"
            ></el-table-column>
            <el-table-column :label="$t('TKE.overview.zt')" width="200">
              <template>
                {{$t('TKE.subList.ksc')}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-transition>
      <p>{{$t('TKE.subList.fsjdhou')}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="unBlockNode()">{{$t('TKE.overview.qd')}}</el-button>
        <el-button @click="closeUnBlock">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="$t('TKE.subList.qdscyxjd')"
      :visible.sync="showDelModal"
      width="35%"
    >
      <div>
        {{$t('TKE.colony.yxze')}}<span style="color:#ff9d00;"
          >{{ this.multipleSelection.length }}{{$t('TKE.overview.ge')}}</span
        >{{$t('TKE.overview.jd')}},<a @click="show = !show" style="cursor: pointer;">{{$t('TKE.overview.ckxq')}}</a>
      </div>
      <el-collapse-transition>
        <div v-show="show">
          <el-table :data="multipleSelection" height="200">
            <el-table-column
              property="InstanceId"
              :label="$t('TKE.subList.mcheng')"
              width="150"
            ></el-table-column>
            <el-table-column :label="$t('TKE.overview.zt')" width="150">
              <template>
                {{$t('TKE.subList.ksc')}}
              </template>
            </el-table-column>
            <el-table-column :label="$t('TKE.overview.zt')" width="200">
              <template>
                {{$t('TKE.colony.kycbxh')}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-transition>
      <p style="color: red;">
        {{$t('TKE.subList.ycjdh')}}
      </p>
      <!-- <el-checkbox-group v-model="checkedItem"> -->
      <el-checkbox
        v-model="checkedItem"
        @change="changeDel(checkedItem)"
      ></el-checkbox>
      <!-- </el-checkbox-group> -->
      <span
        >{{$t('TKE.subList.xhaljfjd')}}</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteNode()">{{$t('TKE.overview.qd')}}</el-button>
        <el-button @click="closeDelete">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="$t('TKE.subList.bslx')"
      :visible.sync="showExpelModal"
      width="35%"
    >
      <div>
        {{$t('TKE.colony.yxze')}}<span style="color:#ff9d00;"
          >{{ this.podList.length || 0 }}{{$t('TKE.overview.ge')}}</span
        >{{$t('TKE.subList.sli')}},<a @click="show = !show" style="cursor: pointer;">{{$t('TKE.overview.ckxq')}}</a>
      </div>
      <el-collapse-transition>
        <div v-show="show">
          <el-table :data="podList" height="200">
            <el-table-column
              property="Name"
              :label="$t('TKE.subList.slpmc')"
              width="200"
            ></el-table-column>
            <el-table-column
              property="Namespace"
              :label="$t('TKE.subList.ssjqkj')"
              width="200"
            ></el-table-column>
          </el-table>
        </div>
      </el-collapse-transition>
      <p>
        {{$t('TKE.subList.jdqzh')}}
      </p>
      <p style="color: red;">
        {{$t('TKE.subList.bqzh')}}
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="expelNode()">{{$t('TKE.overview.qd')}}</el-button>
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
import moment from "moment";
import XLSX from "xlsx";
import FileSaver from "file-saver";
import { type } from "os";
import {
  ALL_CITY,
  NODE_INFO,
  NODE_LIST,
  POINT_REQUEST,
  OBJ_LIST,
  DELETE_NODE,
  BLOCK_NODE,
  NODE_ID_LIST,
  NODE_POD_LIST,
  JOB_ID,
  MOMITOR_TKE
} from "@/constants";
export default {
  name: "colonyNodeManageNode",
  data() {
    return {
      tit: "節點清單",
      clusterId: "",
      searchInput: "", // 输入的搜索关键字
      loadShow: false, // 加载是否显示
      city: {},
      list: [], // 列表
      total: 0,
      pageSize: 10,
      pageIndex: 0,
      flag: false,
      showBlockademodal: false, //是否打开封锁弹窗
      showUnBlockademodal: false,
      showDelModal: false, //是否打开删除弹窗
      showExpelModal: false, //是否打开驱逐弹窗
      show: true, //弹窗是否显示详情
      checkedItem: true,
      changeType: "",
      unschedulable: 0,
      ChoiceValue: "", //搜索选择
      searchValue: "", //搜索值
      multipleSelection: [], //选中的列表
      blockadeType: true, //是否显示批量封锁
      unBlockadeType: true, //是否显示批量取消封锁
      podList: [],
      clusterIds: [],
      instanceId: "",
      name: "節點",
      ProjectId: "",
      searchTypes: [
        {
          value: "name",
          label: "節點名稱"
        },
        {
          value: "ip",
          label: "IP"
        },
        {
          value: "id",
          label: "節點ID"
        }
      ]
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
    this.ProjectId = this.$route.query.ProjectId;
    this.ForwardRequest();
    this.getNodeList();
    this.GetCity();
  },
  methods: {
    toMonitor() {
      //跳转监控页面
      this.$router.push({
        name: "nodeMonitor",
        query: {
          title: this.name,
          clusterId: this.$route.query.clusterId
        }
      });
    },
    //获取节点列表
    async getNodeList() {
      this.loadShow = true;
      let params = {
        ClusterId: this.clusterId,
        Offset: this.pageIndex,
        Limit: this.pageSize,
        Version: "2018-05-25",
        InstanceRole: "WORKER"
      };
      if (this.ChoiceValue !== "" && this.searchValue !== "") {
        let clusterIds = this.clusterIds;
        for (let i = 0; i < clusterIds.length; i++) {
          params["InstanceIds." + i] = clusterIds[i];
        }
      }
      const res = await this.axios.post(NODE_INFO, params);
      if (res.Response.Error === undefined) {
        // this.loadShow = false;
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
        };
        let param1 = {
          Method: "GET",
          Path: "/api/v1/nodes",
          Version: "2018-05-25",
          ClusterName: this.clusterId
        };
        var now = new Date;
        now.setMinutes (now.getMinutes () - 10);
        let paramJob = {
          EndTime: new Date().getTime(),
          Limit: 65535,
          Module: "/front/v1",
          NamespaceName: "k8s_node",
          Offset: 0,
          Order: "desc",
          OrderBy: "timestamp",
          StartTime: new Date(now).getTime(),
          Version: "2019-06-06"
        };
        paramJob["Conditions.0"] = JSON.stringify([
          "tke_cluster_instance_id",
          "=",
          this.clusterId
        ]);
        paramJob["Conditions.1"] = JSON.stringify(["node_role", "=", "Node"]);
        paramJob["Fields.0"] = "avg(k8s_node_cpu_core_request_total)";
        paramJob["Fields.1"] = "avg(k8s_node_memory_request_bytes_total)";
        paramJob["GroupBys.0"] = "timestamp(60s)";
        paramJob["GroupBys.1"] = "unInstanceId";
        if (ids.length > 0) {
          this.list = [];
          for (let i = 0; i < ids.length; i++) {
            param["InstanceIds." + i] = ids[i];
          }
          let k8sNodeList = [];
          // this.loadShow = true;
          let k8sRes = await this.axios.post(POINT_REQUEST, param1);
          if (k8sRes.Response.Error === undefined) {
            let response = JSON.parse(k8sRes.Response.ResponseBody);
            k8sNodeList = response.items;
            // this.loadShow = false;
          } else {
            this.loadShow = false;
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[k8sRes.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
          let dataResult = {};
          let jobRes = await this.axios.post(JOB_ID, paramJob);
          if(jobRes.Response.Error === undefined) {
            let param3 = {
              Version: "2019-06-06",
              JobId: jobRes.Response.JobId,
              Module: "/front/v1"
            };
            let resultRes = await this.axios.post(MOMITOR_TKE, param3);
            if(resultRes.Response.Error === undefined) {
              let result = JSON.parse(resultRes.Response.Data);
              if(result.length > 0) {
                for(let i = 0; i < result.length; i++) {
                  let item = result[i];
                  let key = item[1];
                  let value = dataResult[key];
                  if(value) {
                    value.push(result[i]);
                  } else {
                    value = [];
                    value.push(result[i]);
                  }
                  dataResult[key] = value;
                }
              }
              console.log(dataResult);
            } else {
              this.loadShow = false;
              let ErrTips = {};
              let ErrOr = Object.assign(ErrorTips, ErrTips);
              this.$message({
                message: ErrOr[resultRes.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0
              });
            }
          } else {
            this.loadShow = false;
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[jobRes.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
          

          // this.loadShow = true;
          let nodeRes = await this.axios.post(NODE_LIST, param);
          if (nodeRes.Response.Error === undefined) {
            this.loadShow = false;
            if (nodeRes.Response.InstanceSet.length > 0) {
              nodeRes.Response.InstanceSet.map(node => {
                let resultList = dataResult[node.InstanceId];
                if(resultList) {
                  if(resultList.length > 0) {
                    if(resultList[resultList.length - 1][2]) {
                      node.cpu = resultList[resultList.length - 1][2].toFixed(2);
                    }
                    if(resultList[resultList.length - 1][3]) {
                      node.memory = (resultList[resultList.length - 1][3]/(1024*1024*1024)).toFixed(2);
                    }
                  }
                }
                let now = new Date();
                now.setMinutes (now.getMinutes () - 30);
                if(new Date(now).getTime() - new Date(moment(node.CreatedTime).format("YYYY-MM-DD HH:mm:ss")).getTime() > 0) {
                  node.isDelete = false;
                } else {
                  node.isDelete = true;
                }
                node.addTime = moment(node.CreatedTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                );
                nodeInfoList.map(info => {
                  if (node.InstanceId === info.InstanceId) {
                    node.status = info.InstanceState;
                  }
                });
                k8sNodeList.map(k8s => {
                  let providerId = k8s.spec.providerID;
                  if (
                    node.InstanceId ===
                    providerId.substring(providerId.lastIndexOf("/") + 1)
                  ) {
                    node.kubeletVersion = k8s.status.nodeInfo.kubeletVersion;
                    node.allocatable = k8s.status.allocatable;
                    node.cpuTotal =  (Number(k8s.status.allocatable.cpu.substring(0, k8s.status.allocatable.cpu.length -1))/1000).toFixed(2);
                    node.memoyTotal = (Number(k8s.status.allocatable.memory.substring(0, k8s.status.allocatable.memory.length -2))/(1024*1024)).toFixed(2);
                    node.unschedulable = k8s.spec.unschedulable;
                    node.group = k8s.metadata.labels['cloud.tencent.com/auto-scaling-group-id'];
                  }
                });
                return node;
              });
              this.list = nodeRes.Response.InstanceSet;
              console.log(this.list);
            }
            this.total = nodeRes.Response.TotalCount;
            this.clusterIds = [];
          } else {
            this.loadShow = false;
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[nodeRes.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        } else {
          this.loadShow = false;
          this.list = [];
          this.clusterIds = [];
        }
      } else {
        this.loadShow = false;
        let ErrTips = {};
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

    setFlag(data) {
      console.log(data);
      this.flag = data;
    },
    setTime(data) {
      console.log(data);
    },

    //打开封锁弹窗
    showBlockModal(rowObj) {
      if (rowObj) {
        this.multipleSelection.push(rowObj);
      }
      this.showBlockademodal = true;
      this.unschedulable = 1;
    },

    closeBlock() {
      this.showBlockademodal = false;
      this.multipleSelection = [];
    },

    closeUnBlock() {
      this.showUnBlockademodal = false;
      this.multipleSelection = [];
    },

    closeDelete() {
      this.showDelModal = false;
      this.multipleSelection = [];
    },

    //打开解除封锁弹窗
    showUnBlockModal(rowObj) {
      if (rowObj) {
        this.multipleSelection.push(rowObj);
      }
      this.showUnBlockademodal = true;
      this.unschedulable = 0;
    },

    //复制数据
    copyData() {
      
    },

    //打开驱逐弹窗
    async showExpelDialog(rowObj) {
      this.instanceId = rowObj.InstanceId;
      this.showExpelModal = true;
      let param = {
        ClusterId: this.clusterId,
        InstanceId: rowObj.InstanceId,
        DryRun: true,
        Version: "2018-05-25"
      };
      let res = await this.axios.post(NODE_POD_LIST, param);
      if(res.Response.Error === undefined) {
        this.podList = res.Response.Pods;
        this.loadShow = false;
      } else {
        this.loadShow = false;
        let ErrTips = {};
        let ErrOr = Object.assign(ErrorTips, ErrTips);
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: "error",
          showClose: true,
          duration: 0
        });
      }
    },

    //驱逐节点
    async expelNode() {
      this.showExpelModal = true;
      let param = {
        ClusterId: this.clusterId,
        InstanceId: this.instanceId,
        DryRun: false,
        Version: "2018-05-25"
      };
      let res = await this.axios.post(NODE_POD_LIST, param);
      if(res.Response.Error === undefined) {
        this.getNodeList();
        this.showExpelModal = false;
        this.podList = [];
        this.loadShow = false;
        this.$message({
          message: "驅逐成功",
          type: "success",
          showClose: true,
          duration: 0
        });
      } else {
        this.loadShow = false;
        let ErrTips = {};
        let ErrOr = Object.assign(ErrorTips, ErrTips);
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: "error",
          showClose: true,
          duration: 0
        });
      }
    },

    //打开删除弹窗
    showDeleteModal(rowObj) {
      if (rowObj) {
        this.multipleSelection.push(rowObj);
      }
      this.showDelModal = true;
    },

    //选择删除策略
    changeDel(val) {
      let change = this.checkedItem;
      if (change) {
        this.changeType = "terminate";
      } else {
        this.changeType = "retain";
      }
    },

    //解除封锁
    async unBlockNode() {
      this.loadShow = true;
      let param = {
        clusterId: this.clusterId,
        unschedulable: this.unschedulable
      };
      let blockData = this.multipleSelection;
      for (let i = 0; i < blockData.length; i++) {
        param["instanceIds." + i] = blockData[i].InstanceId;
      }
      await this.axios.post(BLOCK_NODE, param).then(res => {
        if (res.code === 0) {
          this.$message({
            message: "操作成功",
            type: "success",
            showClose: true,
            duration: 0
          });
          this.showUnBlockademodal = false;
          this.getNodeList();
          this.multipleSelection = [];
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
    },

    //封锁节点、批量封锁
    async blockNode() {
      this.loadShow = true;
      let param = {
        clusterId: this.clusterId,
        unschedulable: this.unschedulable
      };
      let blockData = this.multipleSelection;
      for (let i = 0; i < blockData.length; i++) {
        param["instanceIds." + i] = blockData[i].InstanceId;
      }
      await this.axios.post(BLOCK_NODE, param).then(res => {
        if (res.code === 0) {
          this.$message({
            message: "操作成功",
            type: "success",
            showClose: true,
            duration: 0
          });
          this.showBlockademodal = false;
          this.getNodeList();
          this.multipleSelection = [];
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
    },

    //删除、批量删除节点
    async deleteNode() {
      this.loadShow = true;
      let param = {
        ClusterId: this.clusterId,
        ForceDelete: false,
        Version: "2018-05-25"
      };
      let deleteData = this.multipleSelection;
      for (let i = 0; i < deleteData.length; i++) {
        param["InstanceIds." + i] = deleteData[i].InstanceId;
      }
      let change = this.checkedItem;
      if (change) {
        param["InstanceDeleteMode"] = "terminate";
      } else {
        param["InstanceDeleteMode"] = "retain";
      }
      await this.axios.post(DELETE_NODE, param).then(res => {
        if (res.Response.RequestId) {
          this.$message({
            message: "移出成功",
            type: "success",
            showClose: true,
            duration: 0
          });
          this.showDelModal = false;
          this.getNodeList();
          this.multipleSelection = [];
        } else {
          let ErrTips = {
            InternalError: "内部錯誤",
            "InternalError.Db": "db錯誤",
            "InternalError.DbAffectivedRows": "DB錯誤",
            "InternalError.Param": "Param",
            "InternalError.PublicClusterOpNotSupport": "集群不支持當前操作",
            InvalidParameter: "參數錯誤",
            LimitExceeded: "超過配額限制"
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
      if (this.searchValue === "") {
        this.getNodeList();
      }
    },

    //根据节点名称获取集id列表
    getClusterNodeIds(param) {
      this.loadShow = true;
      this.axios.post(NODE_ID_LIST, param).then(res => {
        if (res.Response.Error === undefined) {
          this.loadShow = false;
          if (res.Response.InstanceIdSet.length > 0) {
            let instance = res.Response.InstanceIdSet;
            for (let i = 0; i < instance.length; i++) {
              this.clusterIds.push(instance[i]);
            }
            this.getNodeList();
          }
        } else {
          this.loadShow = false;
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
    },

    //搜索
    _search() {
      if (this.ChoiceValue !== "" && this.searchValue !== "") {
        let choiceValue = this.ChoiceValue;
        let searchValue = this.searchValue;
        if (choiceValue === "name") {
          let param = {
            ClusterId: this.clusterId,
            Version: "2018-05-25",
            Offset: this.pageIndex,
            Limit: this.pageSize,
            VagueInstanceName: searchValue
          };
          this.getClusterNodeIds(param);
        } else if (choiceValue === "ip") {
          let param = {
            ClusterId: this.clusterId,
            Version: "2018-05-25",
            Offset: this.pageIndex,
            Limit: this.pageSize,
            VagueIpAddress: searchValue
          };
          this.getClusterNodeIds(param);
        } else if (choiceValue === "id") {
          this.clusterIds.push(searchValue);
          this.getNodeList();
        }
        // this._GetFuncList()
      } else {
        this.$message({
          message: "請選擇過濾條件且輸入搜索值",
          type: "warning",
          showClose: true,
          duration: 0
        });
      }
    },

    checkboxT(row, index) {
      if (row.status === "initializing" || row.status === "upgrading") {
        return 0;
      } else {
        return 1;
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
          clusterId: this.clusterId,
          ProjectId: this.ProjectId
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
      // debugger
      this.multipleSelection = val;
      if (val.length > 0) {
        for (let i = 0; i < val.length; i++) {
          if (val[i].unschedulable) {
            this.blockadeType = false;
            break;
          }
        }
        for (let j = 0; j < val.length; j++) {
          if (val[j].unschedulable === undefined) {
            this.unBlockadeType = false;
            break;
          }
        }
      } else {
        this.blockadeType = true;
        this.unBlockadeType = true;
      }
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
    ForwardRequest() {
      const param = {
        Method: "GET",
        Path: "/api/v1/nodes",
        Version: "2018-05-25",
        ClusterName: "cls-n1xokuh6"
      };
      this.axios.post(POINT_REQUEST, param).then(res => {
        // console.log(JSON.parse(res.Response.ResponseBody))
        // if (res.code === 0) {
        //   this.loadShow = true
        // }
      });
    }
  },
  filters: {
    //返回状态
    changeStatus(status) {
      if (status === "failed") {
        return "異常";
      } else if (status === "initializing") {
        return "創建中";
      } else if (status === "upgrading") {
        return "升級中";
      } else if (status === "running") {
        return "健康";
      }
    },
    //返回计费模式
    changeChargeType(type) {
      if (type === "POSTPAID_BY_HOUR") {
        return "按量計費";
      } else if (type === "PREPAID") {
        return "包年包月";
      } else if (type === "SPOTPAID") {
        return "按量計費-競價";
      } else if (type === "CDHPAID") {
        return "CDH付費";
      }
    },
    //可用区
    zone(val) {
      if (val) {
        if (val.substring(3, val.length - 2) === "taipei") {
          return "台北" + val.substring(val.length - 1, val.length) + "區";
        }
      }
    },
    //机型
    instanceType(val) {
      if (val) {
        if (val.substring(0, 1) === "S") {
          return "標準型" + val.substring(0, 2);
        } else if (val.substring(0, 1) === "M") {
          return "記憶體型" + val.substring(0, 2);
        } else if (val.substring(0, 1) === "C") {
          return "計算型" + val.substring(0, 2);
        }
      }
    },
    //系统盘类型
    diskType(val) {
      if (val) {
        if (val === "CLOUD_SSD") {
          return "SSD雲硬碟";
        } else {
          return "高性能雲硬碟";
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tke-grid {
  height: 39px;
}
.tke-grid >>> .el-input__inner,
.tke-grid >>> .el-button {
  border-radius: 0;
  height: 34px;
}
.tke-node-list-nobr {
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
