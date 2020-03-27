 <!-- 节点-pod管理 -->
<template>
  <div class="colony-main">
    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid ">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button size="small" >监控</el-button>
      </div>
      <!-- 右侧 -->
      <div class="tool">
        <div class="searchRight">
          <el-select :placeholder="$t('TKE.overview.qxz')" v-model="ChoiceValue">
            <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-input v-model="searchValue" class="searchs" :placeholder="$t('TKE.colony.qsrnr')" @change="_searchchange">
          </el-input>
          <el-button class="el-icon-search" size="small" @click="_search"></el-button>
        </div>
      </div>
    </div>

    <!-- 数据列表展示 -->
    <div class="tke-card mt10">
      <el-table
        @selection-change="handleSelectionChange"
        :data="list"
        v-loading="loadShow"
        style="width: 100%">
        <el-table-column type="expand" prop="container">
          <template slot-scope="scope">
            <el-table border :data="scope.row.spec.containers" >
                <el-table-column prop="" :label="`容器${$t('TKE.overview.mc')}`">
                  <template slot-scope="scope1">
                    <span>{{scope1.row.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="容器ID" >
                  <template slot-scope="scope1">
                    <span>{{scope1.row.containerID}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" :label="$t('TKE.overview.jx')+$t('TkE.overview.bbh')" >
                  <template slot-scope="scope1">
                    <span>{{scope1.row.imageID}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="CPU Request" >
                  <template slot-scope="scope1">
                    <span>{{scope1.row.resources && scope1.row.resources.requests && scope1.row.resources.requests.cpu && scope1.row.resources.requests.cpu  || '无限制'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="CPU Limit" >
                  <template slot-scope="scope1">
                    <span>{{scope1.row.resources && scope1.row.resources.limits && scope1.row.resources.limits.cpu && scope1.row.resources.limits.cpu || '无限制'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="内存 Request" >
                  <template slot-scope="scope1">
                    <span>{{scope1.row.resources && scope1.row.resources.requests && scope1.row.resources.requests.memory && scope1.row.resources.requests.memory || '无限制'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="内存 Limit" >
                  <template slot-scope="scope1">
                    <span>{{scope1.row.resources && scope1.row.resources.limits && scope1.row.resources.limits.memory && scope1.row.resources.limits.memory || '无限制'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" label="重啟次數" >
                  <template>
                    <span>{{scope.row.restart}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="" :label="$t('TKE.overview.zt')" >
                  <template>
                    <span class="text-green">{{scope.row.status.phase}}</span>
                  </template>
                </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          :label="$t('TKE.colony.slmc')"
          >
          <template slot-scope="scope">
            <span>{{scope.row.metadata.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          :label="$t('TKE.overview.zt')"
          >
          <template slot-scope="scope">
              <span :class="[scope.row.redStatus?'text-red':'text-green']">{{scope.row.status.phase}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="實例所在節點IP"
          >
          <template slot-scope="scope">
              <span>{{scope.row.status.hostIP}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="實例IP"
          >
          <template slot-scope="scope">
            <span>{{scope.row.status.podIP}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop=""
          label="CPU Request"
          >
          <template slot-scope="scope">
            <span>{{scope.row.cpu}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="内存 Request"
          >
          <template slot-scope="scope">
            <span>{{scope.row.memory}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          :label="$t('TKE.overview.mmkj')"
          >
          <template slot-scope="scope">
            <span>{{scope.row.metadata.namespace}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="所屬工作負載"
          >
          <template slot-scope="scope">
            <p>{{scope.row.metadata.ownerReferences && scope.row.metadata.ownerReferences[0].name}}</p>
            <p>{{scope.row.metadata.ownerReferences && scope.row.metadata.ownerReferences[0].kind}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          :label="$t('TKE.overview.cjsj')"
          >
          <template slot-scope="scope">
            <p>{{scope.row.addTime}}</p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="重啟次數"
          >
          <template slot-scope="scope">
            <span>{{scope.row.restart}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="操作"
          >
          <template slot-scope="scope">
            <span class="tke-text-link" @click="reconstruction(scope.row)">销毁重建</span>
            <span class="tke-text-link ml10" @click="remoteLogin(scope.row)">远程登录</span>
          </template>
        </el-table-column> -->
      </el-table>


      <!-- 分页 -->
      <div class="tke-page">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="銷毀實例" :visible.sync="showReconstModal" width="35%">
      <div>
        <p style="color:black;">您確定要銷毀實例{{podName}}嗎？</p>
        <p style="color:#888;">實例銷毀重建後將不可恢復，請提前備份好數據。</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteReconst()">{{$t('TKE.overview.qd')}}</el-button>
        <el-button @click="showReconstModal = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="`容器${$t('TKE.mirrorDetail.dl')}`" :visible.sync="showRemoteLoginModal" width="35%">
      <div>該實例下共有<span style="color:#ff9d00;">{{this.podLoginList.length || 0}}个</span>容器</div>
          <el-collapse-transition>
            <el-table :data="podLoginList" height="200">
              <el-table-column property="name" label="容器名稱" width="200"></el-table-column>
              <el-table-column property="" :label="$t('TKE.overview.zt')" width="150"></el-table-column>
              <el-table-column label="操作" width="150">
                <a href="">{{$t('TKE.mirrorDetail.dl')}}</a>
              </el-table-column>
            </el-table>
          </el-collapse-transition>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showRemoteLoginModal = false">关 闭</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import moment from 'moment';
import { ErrorTips } from "@/components/ErrorTips";
import { ALL_CITY,POINT_REQUEST } from "@/constants";
import { GET_LINE_LIST } from '@/constants/BILL.js';
export default {
  name: "nodeDetailPod",
  data() {
    return {
      loadShow: false, //加载是否显示
      clusterId: "",
      node: '',
      list:[], //列表
      total:0,
      pageSize:10,
      pageIndex:0,
      multipleSelection: [],
      showReconstModal: false,//是否打开销毁重建modal
      showRemoteLoginModal: false,//是否打开远程登录modal
      podName: '',//实例名称
      nameSpace: '',//空间名
      podLoginList: [],//容器登录列表
      ChoiceValue: '', //搜索选择
      searchValue: '', //搜索值
       //搜索下拉框
      searchOptions: [
        {
          value: "podname",
          label: "Pod名稱"
        },
        {
          value: "status",
          label: "狀態"
        },
        {
          value: "namespace",
          label: "命名空間"
        }

      ],
      searchType: "", //下拉选中的值
      searchInput: "", //输入的搜索关键字
    };
  },
  components: {
    tkeSearch,
    Loading
  },
  created() {
    // 从路由获取集群id
    this.clusterId = this.$route.query.clusterId;
    this.node = this.$route.query.node;
    this.getPodList();
  },
  methods: {
    //获取列表数据
    async getPodList() {
      this.list = [];
      const param = {
        Method: 'GET',
        Path: '/api/v1/pods?fieldSelector=spec.nodeName='+this.node+'&limit='+this.pageSize,
        Version: '2018-05-25',
        ClusterName: this.clusterId
      }
      if(this.ChoiceValue !== '' && this.searchValue !== '') {
        let ChoiceValue = this.ChoiceValue;
        let searchValue = this.searchValue;
        if(ChoiceValue === 'status') {
          param.Path = '/api/v1/pods?fieldSelector=spec.nodeName='+this.node+',status.phase='+searchValue+'&limit='+this.pageSize
        } else if(ChoiceValue === 'podname') {
          param.Path = '/api/v1/pods?fieldSelector=spec.nodeName='+this.node+',metadata.name='+searchValue+'&limit='+this.pageSize
        } else if(ChoiceValue === 'namespace') {
          param.Path = '/api/v1/pods?fieldSelector=spec.nodeName='+this.node+',metadata.namespace='+searchValue+'&limit='+this.pageSize
        }
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false
          let response = JSON.parse(res.Response.ResponseBody);
          if(response.items.length > 0) {
            response.items.map(o => {
              o.addTime = moment(o.metadata.creationTimestamp).format("YYYY-MM-DD HH:mm:ss");
              let cpu = 0, memory = 0, restart = 0;

              if(o.spec && o.spec.containers.length > 0) {
                for(var i = 0; i < o.spec.containers.length; i++) {
                  let containers = o.spec.containers[i];
                  cpu += containers.resources && containers.resources.requests && containers.resources.requests.cpu
                    && Number(containers.resources.requests.cpu.substring(0,containers.resources.requests.cpu.length - 1)) || 0;
                  memory += containers.resources && containers.resources.requests && containers.resources.requests.memory
                    && Number(containers.resources.requests.memory.substring(0,containers.resources.requests.memory.length - 1)) || 0;
                }
              }
              if(o.status && o.status.containerStatuses.length > 0) {
                for(var j = 0; j < o.status.containerStatuses.length; j++) {
                  let containerStatuses = o.status.containerStatuses[j];
                  restart += containerStatuses.restartCount;
                }
              }
              if(cpu > 0) {
                o.cpu = cpu/1000 + '核';
              } else {
                o.cpu = '无限制';
              }
              if(memory > 0) {
                o.memory = memory + 'M';
              } else {
                o.memory = '无限制';
              }
              o.restart = restart;
              if(o.status.conditions) {
                for(let i = 0; i < o.status.conditions.length; i++) {
                  if(o.status.conditions.length[i].status !== 'True') {
                    o.redStatus = true;
                  }
                }
              }
            });
            this.list = response.items;
            this.total = response.items.length;
            console.log(this.list);
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
      })
    },
    //搜索
    _search() {
      if (this.ChoiceValue !== '' && this.searchValue !== '') {
        this.getPodList();
      } else {
        this.$message({
          message: '請選擇過濾條件且輸入搜索值',
          type: "warning",
          showClose: true,
          duration: 0
        });
      }
    },
    // 搜索框内容为空
    _searchchange() {
      if (this.searchValue === '') {
        this.getPodList();
      }
    },
    //返回上一层
    goBack(){
      this.$router.go(-1);
    },
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val-1;
      this.getPodList();
      this.pageIndex+=1;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize=val;
      this.getPodList();
    },
    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //打开销毁重建弹窗
    reconstruction(rowObj) {
      this.showReconstModal = true;
      this.podName = rowObj.metadata.name;
      this.nameSpace = rowObj.metadata.namespace;
    },
    //打开远程登录弹窗
    remoteLogin(rowObj) {
      this.showRemoteLoginModal = true;
      this.podLoginList = rowObj.status.containerStatuses;
    },
    //销毁重建
    async deleteReconst() {
      this.loadShow = true;
      let param = {
        Method: "DELETE",
        Path: "/api/v1/namespaces/"+this.nameSpace+"/pods/"+this.podName,
        Version: "2018-05-25",
        RequestBody: JSON.stringify({'propagationPolicy': 'Background'}),
        ClusterName: this.clusterId
      }
      await this.axios.post(POINT_REQUEST, param).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false;
          this.showReconstModal = false;
          this.getPodList();
          this.$message({
            message: '刪除成功',
            type: "success",
            showClose: true,
            duration: 0
          });
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
    }
  }
};
</script>

<style lang="scss" scoped>
  .tool {
    margin: 20px 20px 10px 20px;
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

