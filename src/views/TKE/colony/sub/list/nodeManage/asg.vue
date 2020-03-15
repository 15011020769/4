 <!-- 伸缩组列表 -->
<template>
  <div >
    <subTitle title='伸缩组列表'  />
     <!-- 全局配置 -->
    <div class="tke-card tke-formpanel-wrap" v-show="saw">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <h4 class="tke-formpanel-title">全局配置</h4>
        </div>
        <!-- 右侧 -->
        <div class="grid-right" style="padding-bottom:20px">
          <span class="tke-text-link" @click="dialogFormVisible = true">编辑</span>
        </div>
      </div>
      
      <el-form  class="tke-form"  label-position='left' label-width="120px" size="mini">
        <el-form-item label="自动缩容">
          <div class="tke-form-item_text">{{global.IsScaleDownEnabled|IsScaleDownEnableds}}</div>
        </el-form-item>
        <el-form-item label="最大并发缩容数" v-show='control'>
          <div class="tke-form-item_text">{{global.MaxEmptyBulkDelete}}</div>
        </el-form-item>
        <el-form-item label="缩容计算方法" v-show='control'>
          <div class="tke-form-item_text">	Pod占用资源/可分配资源小于{{global.ScaleDownUtilizationThreshold}}%开始判断缩容条件</div>
          <div class="tke-form-item_text" v-show='global.IgnoreDaemonSetsUtilization'>DaemonSet类型不计入pod占用资源</div>
        </el-form-item>
        <el-form-item label="节点连续空闲" v-show='control'>
          <div class="tke-form-item_text">{{global.ScaleDownUnneededTime}}分钟后被缩容</div>
        </el-form-item>

        <el-form-item label="集群扩容" v-show='control'>
          <div class="tke-form-item_text">{{global.ScaleDownDelay}}分钟后开始判断缩容条件</div>
        </el-form-item>
        <el-form-item label="不缩容节点" v-show='control'>
          <div class="tke-form-item_text">{{global.SkipNodesWithLocalStorage|SkipNodesWithLocalStorages}}</div>
          <div class="tke-form-item_text">{{global.SkipNodesWithSystemPods|SkipNodesWithSystemPodss}}</div>
        </el-form-item>
        <el-form-item label="扩容算法">
          <div class="tke-form-item_text">{{global.Expander|Expanders}}</div>
        </el-form-item>
        <el-form-item label="集群规模上限">
          <div class="tke-form-item_text">
            可扩容节点数量受VPC网络、容器网络、TKE集群节点配额、可购买云主机配额限制 <br>
            当前容器网络 172.16.0.0/16 最大支持 1008个节点<br>
            当前地域下集群节点数量上限配额为：5000<br>
            当前地域下按量计费云服务器剩余配额为：100<br>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!-- 新建、搜索相关操作 -->
    <div class="tke-grid mt10" style="margin-top: 10px;">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button @click="goAsgCreate" size="small" type="primary">新建伸缩组</el-button>
        <el-button size="small" :disabled="this.deleteData.length>=1?false:true" @click="openDeleteAllDialog()">删除</el-button>
      </div>
      <!-- 右侧 -->
      <div class="grid-right">
        <tkeSearch 
            exportData
            inputPlaceholder='请输入伸缩组ID'
            :searchInput='searchInput'
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
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        :data="list"
        v-loading="loadShow"
        id="exportTable"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="伸缩组ID/名称"
          >
          <template slot-scope="scope">
            <span>{{scope.row.AutoScalingGroupId}}</span>
            <!-- <span class="tke-text-link" >{{scope.row.AutoScalingGroupId}}</span> -->
            <p>{{scope.row.AutoScalingGroupName}}<i class="el-icon-edit tke-icon" @click="modifyNameModal(scope.row)"></i></p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="扩缩模式"
          >
          <template slot-scope="scope">
              <span v-if="scope.row.ServiceSettings.ScalingMode==='CLASSIC_SCALING'">释放模式</span>
              <span v-else-if="scope.row.ServiceSettings.ScalingMode==='WAKE_UP_STOPPED_SCALING'"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="状态"
          >
          <template slot-scope="scope">
              <span :class="[scope.row.status === 'enabled' ? 'text-green' : '']">{{ChangeStatus(scope.row.status)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="子机数量"
          >
          <template slot-scope="scope">
            <span>{{scope.row.InstanceCount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="期望伸缩数"
          >
          <template slot-scope="scope">
            <span>{{scope.row.DesiredCapacity}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="最小伸缩数"
          >
          <template slot-scope="scope">
            <span>{{scope.row.MinSize}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
            width="200"
          label="最大伸缩数">
          <template slot-scope="scope">
            <span>{{scope.row.MaxSize}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="启动配置ID/名称">
          <template slot-scope="scope">
            <p><a :href="'../startCon/secDetails/' + scope.row.LaunchConfigurationId">{{scope.row.LaunchConfigurationId}}</a></p>
            <p>{{scope.row.LaunchConfigurationName}}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="130"
          >
          <template slot-scope="scope">
            <el-button size="small" type="text" :disabled="scope.row.status==='disabled'?false:true" @click="showUse(scope.row)">启用</el-button>
            <el-button size="small" type="text" :disabled="scope.row.status==='enabled'?false:true" @click="showStop(scope.row)">停用</el-button>
            
            <el-dropdown class=" tke-dropdown" >
              <span class="el-dropdown-link ml10" >更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">
                  <el-button size="small" type="text" :disabled="scope.row.status==='enabled'?false:true" @click="showToConfigure(scope.row)">调整配置</el-button>
                </el-dropdown-item>
                <el-dropdown-item command="a"><span class="tke-text-link" @click="deleteSigle(scope.row)">删除</span></el-dropdown-item>
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
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 编辑 -->
    <el-dialog title="设置集群伸缩全局配置" :visible.sync="dialogFormVisible" width="70%">
      <el-card class="box-card">
        <el-form :model="global" :rules="rules" ref="ruleForm" label-position='left' label-width="250px" >
            <el-form-item label="自动缩容" :label-width="formLabelWidth" class='bottom' >
              <el-checkbox v-model="global.IsScaleDownEnabled" >开启自动缩容</el-checkbox>
              <p>集群中节点空闲资源较多时将触发缩容。详情请查看
                <!-- <a>集群自动扩缩容说明</a> -->
              </p>
            </el-form-item>
            <el-form-item label="缩容配置" :label-width="formLabelWidth" class='bottom' v-show='global.IsScaleDownEnabled'>
              <el-form-item label="最大并发缩容数" prop="MaxEmptyBulkDelete">
                  <el-input v-model="global.MaxEmptyBulkDelete" placeholder="请输入内容" class='input-w' prop="input1" size='mini'></el-input>
              </el-form-item>
              <!-- <i class='el-icon-warning-outline'></i> -->
              <el-form-item label="Pod占用资源/可分配资源小于" class='bottom'  prop="ScaleDownUtilizationThreshold" >
                  <el-input v-model="global.ScaleDownUtilizationThreshold" placeholder="请输入内容" class='input-w'  size='mini'></el-input><span>%时开始判断缩容条件</span>
                  <p v-if="global.ScaleDownUtilizationThreshold != ''">占比范围为0-80。<span v-if="global.ScaleDownUtilizationThreshold == 0">占比为0时,仅在节点内的所有Pod运行完成后才开始缩容。</span></p>
              </el-form-item>
              <el-form-item label=" " class='bottom'>
                  <p>
                  <el-checkbox v-model="global.IgnoreDaemonSetsUtilization">DaemonSet类型不计入pod占用资源</el-checkbox>
                  </p>
              </el-form-item>
              <el-form-item label="节点连续空闲" class='bottom' prop="ScaleDownUnneededTime">
                  <el-input v-model="global.ScaleDownUnneededTime" placeholder="请输入内容" class='input-w' prop="input3" size='mini'></el-input><span>分钟后被缩容</span>
              </el-form-item>
               <el-form-item label="集群扩容" class='bottom' prop="ScaleDownDelay">
                  <el-input v-model="global.ScaleDownDelay" placeholder="请输入内容" class='input-w' prop="input3" size='mini'></el-input><span>分钟后开始判断缩容条件</span>
              </el-form-item>
               <el-form-item label="不缩容节点" class='bottom'>
                  <el-checkbox v-model="global.SkipNodesWithLocalStorage" >含有本地存储Pod的节点</el-checkbox>
                  <p><el-checkbox v-model="global.SkipNodesWithSystemPods" >含有kube-system namespace下非DaemonSet管理的Pod的节点</el-checkbox></p>
              </el-form-item>
            </el-form-item>
            <el-form-item label="扩容算法" :label-width="formLabelWidth">
                <el-radio-group v-model="global.Expander" class='left' @change='setRadio($event)'>
                  <el-radio label="random">随机</el-radio>
                  <el-radio label="most-pods">most-pods</el-radio>
                  <el-radio label="least-waste">least-waste</el-radio>
                </el-radio-group>
              <p class='left' v-if="global.Expander === 'random'">随机选择一个伸缩组进行扩容</p>
              <p class='left' v-else-if="global.Expander === 'most-pods'">选择能调度更多pod的伸缩组进行扩容</p>
              <p class='left' v-else-if="global.Expander === 'least-waste'">选择pod调度后资源剩余更少的伸缩组进行扩容</p>
            </el-form-item>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="setTrue()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 全选删除弹窗 -->
    <el-dialog title="删除伸缩组" :visible.sync="iSdialogDeleteAll" width="35%">
      <p>确定要删除以下伸缩组么？</p>
      <div>已选择<span style="color:#ff9d00;">{{this.deleteData.length}}个</span>伸缩组,<a @click="show=!show" style="cursor: pointer;">查看详情</a></div>
          <el-collapse-transition>
            <div v-show="show">
              <el-table :data="deleteData" height="200">
                <el-table-column property="AutoScalingGroupId" label="ID" width="150"></el-table-column>
                <el-table-column property="status" label="状态" width="150"></el-table-column>
                <el-table-column label="状态" width="200">
                  <template>
                      可删除
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-transition>
          <el-checkbox v-model="checkedItem" @change="changeDel(checkedItem)"></el-checkbox>
          <span>销毁按量计费的节点（销毁后不可恢复，请谨慎操作并提前备份数据），包年包月不支持销毁</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="deleteSingleGroup('all')">确 定</el-button>
          <el-button @click="iSdialogDeleteAll = false">取 消</el-button>
        </span>
    </el-dialog>
    <!--停用伸缩组-->
    <el-dialog title="停用伸缩组" :visible.sync="showStopModal" width="35%">
      <p>确定要停用伸缩组{{groupId}}么？</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="EnabledGroup()">确 定</el-button>
          <el-button @click="showStopModal = false">取 消</el-button>
        </span>
    </el-dialog>
    <!--启用伸缩组-->
    <el-dialog title="停用伸缩组" :visible.sync="showUseModal" width="35%">
      <p>确定要启用伸缩组{{groupId}}么？</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="EnabledGroup()">确 定</el-button>
        <el-button @click="showUseModal = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--调整配置-->
    <el-dialog title="调整伸缩组配置" :visible.sync="showToConfigureModal" width="35%">
      <el-form label-width="80px">
        <el-form-item label="名称">
          <p>{{groupObj.AutoScalingGroupId}}({{groupObj.AutoScalingGroupName}})</p>
        </el-form-item>
        <el-form-item label="实例范围">
          <el-input size="small" v-model="minSize" style="width:30%;"></el-input>
          <span>~</span>
          <el-input size="small" v-model="maxSize" style="width:30%;"></el-input>
          <p>在设定的实例范围内自动调节，不会超出该设定范围</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitToConfigure()">确 定</el-button>
        <el-button @click="showToConfigureModal = false">取 消</el-button>
      </span>
    </el-dialog>
    <!--单个删除伸缩组-->
    <el-dialog title="删除伸缩组" :visible.sync="deleteSingleModal" width="35%">
      <p>确定要删除伸缩组{{groupId}}么？</p>
      <el-checkbox v-model="checkedItem" @change="changeDel(checkedItem)"></el-checkbox>
      <span>销毁按量计费的节点（销毁后不可恢复，请谨慎操作并提前备份数据），包年包月不支持销毁</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteSingleGroup('single')">确 定</el-button>
        <el-button @click="deleteSingleModal = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改伸缩组名称" :visible.sync="showModifyNameModal" width="35%">
      <el-form label-width="80px">
        <el-form-item label="名称">
          <p>{{groupObj.AutoScalingGroupName}}</p>
        </el-form-item>
        <el-form-item label="实例范围">
          <el-input size="small" v-model="groupName"></el-input>
          <p>名称不超过25个字符，仅支持中文、英文、数字、下划线，分隔符("-")及小数点</p>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyName()">确 定</el-button>
        <el-button @click="showModifyNameModal = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import subTitle from "@/views/TKE/components/subTitle";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import { ErrorTips } from "@/components/ErrorTips";
import XLSX from "xlsx";
import FileSaver from "file-saver";
import { ALL_CITY,
  CLUSTERS_GROUPS,
  AUTOSCALING_GROUPS,
  CLUSTERS_GROUPSOPTION,
  MODIFY_ATTRIBUTE,
  GROUP_OPTION,
  MODIFY_GROUP_STATUS,
  DELETE_GROUP,
  MODIFY_NAME } from "@/constants";
export default {
  name: "colonyNodeManageAsg",
  data() {
    return {
      saw:'',
      iSdialogDeleteAll: false,
      show: true,
      clusterId:'',
      searchInput: "", //输入的搜索关键字
      loadShow: false, //加载是否显示
      control:false,
      list:[], //列表
      deleteData:[],
      groupIds: [],//伸缩组id列表
      total:0,
      pageSize:10,
      pageIndex:0,
      groupName: '',
      multipleSelection: [],
      dialogFormVisible:false,
      checkedItem: true,
      showUseModal: false,
      AutoScalingGroupEnabled: false,
      enableType: '',
      showToConfigureModal: false,
      deleteSingleModal: false,
      changeType: false,
      showModifyNameModal: false,
      groupObj: {},
      minSize: 0,
      maxSize: 0,
      global:{
        IsScaleDownEnabled:'',
        MaxEmptyBulkDelete:'',// 最大并发缩容数
        // OkTotalUnreadyCount:'',
        ScaleDownDelay:'',
        ScaleDownUtilizationThreshold:'',// 缩容计算方法
        SkipNodesWithLocalStorage:'',
        SkipNodesWithSystemPods:'',
        Expander:'',
        IgnoreDaemonSetsUtilization:'',
        ScaleDownUnneededTime:''
      },
      showStopModal: false,
      groupId: '',
      form: {
        checked1: '',
        checked2: '',
        checked3: '',
        checked4: '',
        radio: 1,
        input1: '',
        input2: '',
        input3: '',
        input4: '',
      },
      formLabelWidth: '80px',
      rules: {
        MaxEmptyBulkDelete: [
          { required: true, message: '最大并发缩容数不能为空', trigger: 'change' }
        ],
        ScaleDownUtilizationThreshold: [
          { required: true, message: '占比不能为空', trigger: 'change' }
        ],
         ScaleDownUnneededTime: [
          { required: true, message: '时间不能为空', trigger: 'change' }
        ],
         ScaleDownDelay: [
          { required: true, message: '时间不能为空', trigger: 'change' }
        ],
      }
    };
  },
  created() {
    // 从路由获取集群id
    this.GetGroupsOption();
    this.clusterId=this.$route.query.clusterId;
    this.GetGroupsList();
  },
  methods: {
    //获取
     // 新建伸缩组
    goAsgCreate(){
      this.$router.push({
          name: "asgCreate",
          query: {
            clusterId: this.clusterId
          }
      });
    },

    // 确定
    setTrue(){
      this.dialogFormVisible = false
      this.DetailGroupsList()
      if(this.global.IsScaleDownEnabled){
        this.control = true
        return
      }
      this.control = false
    },

    setRadio(e){
      console.log(e)
    },
    //监听搜索框的值
    changeSearchInput(val) {
      this.searchInput = val;
      console.log(this.searchInput)
    },

    // 点击搜索
    clickSearch(val){
      this.searchInput = val;
      this.GetGroupsList();
      console.log(this.searchInput)
    },

    //打开批量删除弹窗
    openDeleteAllDialog () {
      this.iSdialogDeleteAll = true;
    },
    
    // 导出表格
    exportExcel() {
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
          this.$t("tke-groupList") + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },

    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val-1;
      this.GetGroupsList();
      this.pageIndex+=1;
    },
    handleSizeChange(val) {
      this.pageSize=val;
      this.GetGroupsList();
    },
    //全选
    handleSelectionChange(val) {
      this.deleteData = val;
    },
    // 获取伸缩组全局配置
    async GetGroupsOption () { 
      this.loadShow = true;
      let param = {
        ClusterId: this.$route.query.clusterId,
        Version: "2018-05-25"
      }
      const res = await this.axios.post(CLUSTERS_GROUPSOPTION, param);
      if(res.Error  === undefined){
        console.log(res)
        this.global.IsScaleDownEnabled = res.Response.ClusterAsGroupOption.IsScaleDownEnabled
        if(res.Response.ClusterAsGroupOption.IsScaleDownEnabled){
          this.control = true
        }
        this.global.MaxEmptyBulkDelete = res.Response.ClusterAsGroupOption.MaxEmptyBulkDelete
        this.global.ScaleDownDelay = res.Response.ClusterAsGroupOption.ScaleDownDelay
        this.global.ScaleDownUnneededTime = res.Response.ClusterAsGroupOption.ScaleDownUnneededTime
        this.global.ScaleDownUtilizationThreshold = res.Response.ClusterAsGroupOption.ScaleDownUtilizationThreshold
        this.global.SkipNodesWithLocalStorage = res.Response.ClusterAsGroupOption.SkipNodesWithLocalStorage
        this.global.SkipNodesWithSystemPods = res.Response.ClusterAsGroupOption.SkipNodesWithSystemPods
        this.global.Expander = res.Response.ClusterAsGroupOption.Expander
        this.global.IgnoreDaemonSetsUtilization = res.Response.ClusterAsGroupOption.IgnoreDaemonSetsUtilization
        this.loadShow = false;
      }else{
        this.loadShow = false;
        let ErrTips = {
          "FailedOperation": "操作失败",
          "InternalError": "内部错误",
          "InternalError.AccountUserNotAuthenticated": "账户未通过认证",
          "InternalError.AsCommon": "伸缩组资源创建报错",
          "InternalError.CamNoAuth": "没有权限",
          "InternalError.Param": "Param",
          "UnknownParameter": "未知参数错误",
          "UnsupportedOperation": "UnsupportedOperation",
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
    // 修改全局配置
    async DetailGroupsList () { 
      this.loadShow = true;
      let param = {
        ClusterId: this.$route.query.clusterId,
        Version: "2018-05-25"
      }
      param['ClusterAsGroupOption.IsScaleDownEnabled'] = this.global.IsScaleDownEnabled;
      param['ClusterAsGroupOption.MaxEmptyBulkDelete'] = Number(this.global.MaxEmptyBulkDelete);
      param['ClusterAsGroupOption.ScaleDownDelay'] = Number(this.global.ScaleDownDelay);
      param['ClusterAsGroupOption.ScaleDownUtilizationThreshold'] = Number(this.global.ScaleDownUtilizationThreshold);
      param['ClusterAsGroupOption.SkipNodesWithLocalStorage'] = this.global.SkipNodesWithLocalStorage;
      param['ClusterAsGroupOption.SkipNodesWithSystemPods'] = this.global.SkipNodesWithSystemPods;
      param['ClusterAsGroupOption.Expander'] = this.global.Expander;
      param['ClusterAsGroupOption.IgnoreDaemonSetsUtilization'] = this.global.IgnoreDaemonSetsUtilization;
      param['ClusterAsGroupOption.ScaleDownUnneededTime'] = this.global.ScaleDownUnneededTime;
      const res = await this.axios.post(MODIFY_ATTRIBUTE, param);
      if(res.Response.Error === undefined) {
        this.GetGroupsOption();
        this.GetGroupsList();
        this.$message({
          message: "更新成功",
          type: "success",
          showClose: true,
          duration: 0
        });
        this.dialogFormVisible = false;
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

    // 获取伸缩组列表ID
    async GetGroupsListId () {
      this.loadShow = true;
      let param = {
        ClusterId: this.$route.query.clusterId,
        Limit: this.pageSize,
        Offset: this.pageIndex,
        Version: "2018-05-25"
      }
      const res = await this.axios.post(CLUSTERS_GROUPS, param);
      if(res.Error === undefined ){
        // console.log(res,222)
        if(res.Response.ClusterAsGroupSet.length > 0){
          this.saw=true
          let ids=[];
          res.Response.ClusterAsGroupSet = res.Response.ClusterAsGroupSet.map(item => {
              this.groupIds.push(item.AutoScalingGroupId);
              return item;
          })
        }
        else{
          this.saw = false
        }
        this.loadShow = false;
      } else {
        this.loadShow = false;
        let ErrTips = {
          "FailedOperation": "操作失败",
          "InternalError": "内部错误",
          "InternalError.AccountUserNotAuthenticated": "账户未通过认证",
          "InternalError.AsCommon": "伸缩组资源创建报错",
          "InternalError.Db": "db错误",
          "InternalError.PodNotFound": "Pod未找到",
          "InternalError.Param": "Param",
          "InternalError.VpcCommon": "VPC报错",
          "InternalError.VpcPeerNotFound": "对等连接不存在",
          "InternalError.VpcRecodrNotFound": "未发现vpc记录",
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
    // 获取伸缩祖列表ID
    // 获取不到数据，无法进行后续操作
    async GetGroupsList () { 
      this.loadShow = true;
      let ids=[];
      let param = {
        ClusterId: this.$route.query.clusterId,
        Limit: this.pageSize,
        Offset: this.pageIndex,
        Version: "2018-05-25"
      }
      if(this.searchInput !== "") {
        param["AutoScalingGroupIds.0"] = this.searchInput; 
      }
      const res = await this.axios.post(CLUSTERS_GROUPS, param);
      if(res.Error === undefined ){
        // console.log(res,222)
        if(res.Response.ClusterAsGroupSet.length > 0){
          this.saw=true
          res.Response.ClusterAsGroupSet = res.Response.ClusterAsGroupSet.map(item => {
              ids.push(item);
              return item;
          })
        }
        else{
          this.saw = false
        }
        this.loadShow = false;
      } else {
        this.loadShow = false;
        let ErrTips = {
          "FailedOperation": "操作失败",
          "InternalError": "内部错误",
          "InternalError.AccountUserNotAuthenticated": "账户未通过认证",
          "InternalError.AsCommon": "伸缩组资源创建报错",
          "InternalError.Db": "db错误",
          "InternalError.PodNotFound": "Pod未找到",
          "InternalError.Param": "Param",
          "InternalError.VpcCommon": "VPC报错",
          "InternalError.VpcPeerNotFound": "对等连接不存在",
          "InternalError.VpcRecodrNotFound": "未发现vpc记录",
        };
        let ErrOr = Object.assign(ErrorTips, ErrTips);
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: "error",
          showClose: true,
          duration: 0
        });
      }
      if(ids.length > 0) {
        this.list = [];
        this.loadShow = true;
        let param = {
          Limit: this.pageSize,
          Version: "2018-04-19"
        }
        for(var i = 0; i < ids.length; i++) {
          param['AutoScalingGroupIds.'+i] = ids[i].AutoScalingGroupId;
        }
        const res = await this.axios.post(AUTOSCALING_GROUPS, param);
        if(res.Response.Error === undefined){
          if(res.Response.AutoScalingGroupSet.length > 0) {
            res.Response.AutoScalingGroupSet.map(group => {
              ids.map(groupid => {
                if(group.AutoScalingGroupId === groupid.AutoScalingGroupId) {
                  group.status = groupid.Status;
                }
              })
            });
            this.total = res.Response.TotalCount;
          }
          this.list = res.Response.AutoScalingGroupSet;
          console.log("list",this.list);
          this.loadShow = false;
        }else{
          this.loadShow = false;
          let ErrTips = {
            "InvalidFilter": "无效的过滤器",
            "InvalidParameterConflict": "指定的两个参数冲突，不能同时存在",
            "InvalidParameterValue.Filter": "无效的过滤器",
            "InvalidPermission": "账户不支持该操作",
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      } else {
        this.list = [];
        this.loadShow = false;
      }
    },
    //打开停止伸缩组modal
    showStop(row) {
      this.showStopModal = true;
      this.groupId = row.AutoScalingGroupId;
      this.AutoScalingGroupEnabled = false;
      this.enableType = 'tingyong';
    },
    //代开启用伸缩组modal
    showUse(row) {
      this.showUseModal = true;
      this.groupId = row.AutoScalingGroupId;
      this.AutoScalingGroupEnabled = true;
      this.enableType = 'qiyong';
    },
    //打开配置modal
    showToConfigure(row) {
      this.showToConfigureModal = true;
      this.groupObj = row;
      this.groupId = row.AutoScalingGroupId;
      this.minSize = row.MinSize;
      this.maxSize = row.MaxSize;
    },

    //单个删除伸缩组
    deleteSigle(row) {
      this.deleteSingleModal = true;
      this.groupId = row.AutoScalingGroupId;
      this.deleteData.push(row);
    },

    //打开修改名称modal
    modifyNameModal(row) {
      this.showModifyNameModal = true;
      this.groupObj = row;
    },

    //修改名称
    async modifyName() {
      this.loadShow = true;
      let param = {
        Version: "2018-04-19",
        AutoScalingGroupId: this.groupObj.AutoScalingGroupId,
        AutoScalingGroupName: this.groupName
      }
      await this.axios.post(MODIFY_NAME, param).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false;
          this.showModifyNameModal = false;
          this.GetGroupsList();
          this.$message({
            message: '修改成功',
            type: "success",
            showClose: true,
            duration: 0
          });
        } else {
          this.loadShow = false;
          let ErrTips = {
            "InvalidParameter.InScenario": "在特定场景下的不合法参数。",
            "InvalidParameterValue.CvmError":	"CVM参数校验异常。",
            "InvalidParameterValue.GroupNameDuplicated": "伸缩组名称重复。",
            "InvalidParameterValue.LaunchConfigurationNotFound":	"找不到指定启动配置。",
            "InvalidParameterValue.LbProjectInconsistent": "负载均衡器项目不一致。",
            "InvalidParameterValue.LbVpcInconsistent": "负载均衡器和伸缩组的VPC不一致。",
            "InvalidParameterValue.LimitExceeded":	"取值超出限制。",
            "InvalidParameterValue.OnlyVpc":	"账号仅支持VPC网络。",
            "InvalidParameterValue.Range":	"取值超出指定范围。",
            "InvalidParameterValue.Size":	"伸缩组最大数量、最小数量、期望实例数取值不合法。",
            "InvalidParameterValue.SubnetIds":	"子网信息不合法。",
            "InvalidParameterValue.TooLong":	"取值过多。",
            "LimitExceeded":	"超过配额限制",
            "LimitExceeded.MaxSizeLimitExceeded":	"最大实例数大于限制。",
            "LimitExceeded.MinSizeLimitExceeded":	"最小实例数低于限制。",
            "MissingParameter":	"缺少参数错误",
            "MissingParameter.InScenario":	"在特定场景下缺少参数。",
            "ResourceNotFound.AutoScalingGroupIdNotFound":	"伸缩组不存在。",
            "ResourceUnavailable.LaunchConfigurationStatusAbnormal":	"启动配置状态异常。",
            "ResourceUnavailable.ProjectInconsistent":	"项目不一致。",
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

    //选择删除策略
    changeDel(val) {
      let change = this.checkedItem;
      if(change) {
        this.changeType = false;
      } else {
        this.changeType = true;
      }
    },

    //删除伸缩组
    async deleteSingleGroup(type) {
      this.loadShow = true;
      let deleteData = this.deleteData;
      let param = {
        Version: "2018-05-25",
        ClusterId: this.clusterId,
        KeepInstance: this.changeType
      }
      if(deleteData.length > 0) {
        for(var i = 0; i < deleteData.length; i++) {
          param["AutoScalingGroupIds."+i] = deleteData[i].AutoScalingGroupId;
        }
      }
      await this.axios.post(DELETE_GROUP, param).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false;
          if(type === 'all') {
            this.iSdialogDeleteAll = false;
          } else {
            this.deleteSingleModal = false;
          }
          this.$message({
            message: '删除成功',
            type: "success",
            showClose: true,
            duration: 0
          });
          this.GetGroupsList();
        } else {
          this.loadShow = false;
          let ErrTips = {
            "FailedOperation": "操作失败",
            "InternalError": "内部错误",
            "InternalError.AccountUserNotAuthenticated	": "账户未通过认证",
            "InternalError.AsCommon": "伸缩组资源创建报错",
            "InternalError.Param": "Param",
            "InternalError.PublicClusterOpNotSupport": "集群不支持当前操作",
            "InternalError.QuotaMaxClsLimit": "超过配额限制",
            "InternalError.QuotaMaxNodLimit": "超过配额限制",
            "InternalError.QuotaMaxRtLimit": "超过配额限制",
            "InvalidParameter": "参数错误",
            "InvalidParameter.AsCommonError": "弹性伸缩组创建参数错误",
            "InvalidParameter.Param": "参数错误",
            "InvalidParameter.RouteTableNotEmpty": "路由表非空",
            "LimitExceeded": "超过配额限制",
            "MissingParameter": "缺少参数错误",
            "ResourceInUse": "资源被占用",
            "ResourceNotFound": "资源不存在",
            "UnknownParameter": "未知参数错误",
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

    //启用/停用伸缩组
    async EnabledGroup() {
      let enableType = this.enableType;
      let param = {}
      if(enableType === 'tingyong') {
        param = {
          Version: "2018-05-25",
          ClusterId: this.clusterId
        }
        param["ClusterAsGroupAttribute.AutoScalingGroupId"] = this.groupId;
        param["ClusterAsGroupAttribute.AutoScalingGroupEnabled"] = false;
      } else {
        param = {
          Version: "2018-05-25",
          ClusterId: this.clusterId
        }
        param["ClusterAsGroupAttribute.AutoScalingGroupId"] = this.groupId;
        param["ClusterAsGroupAttribute.AutoScalingGroupEnabled"] = true;
      }
      await this.axios.post(MODIFY_GROUP_STATUS, param).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false;
          this.showUseModal = false;
          this.showStopModal = false;
          this.$message({
            message: '操作成功',
            type: "success",
            showClose: true,
            duration: 0
          });
          this.GetGroupsList();
        } else {
          this.loadShow = false;
          let ErrTips = {
            "FailedOperation": "操作失败",
            "InternalError": "内部错误",
            "InternalError.AccountUserNotAuthenticated	": "账户未通过认证",
            "InternalError.AsCommon": "伸缩组资源创建报错",
            "InternalError.CamNoAuth": "没有权限",
            "InvalidParameter": "参数错误",
            "InvalidParameter.AsCommonError": "弹性伸缩组创建参数错误",
            "InvalidParameter.CidrOutOfRouteTable": "CIDR不在路由表之内",
            "InvalidParameter.GatewayAlreadyAssociatedCidr": "下一跳地址已关联CIDR",
            "InvalidParameter.Param": "参数错误",
            "InvalidParameter.RouteTableNotEmpty": "路由表非空",
            "LimitExceeded": "超过配额限制",
            "MissingParameter": "缺少参数错误",
            "ResourceInUse": "资源被占用",
            "ResourceNotFound": "资源不存在",
            "ResourceUnavailable": "资源不可用",
            "UnauthorizedOperation": "未授权操作",
            "UnknownParameter": "未知参数错误",
            "UnsupportedOperation": "操作不支持",
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

    //提交调整伸缩组
    async submitToConfigure() {
      if(this.minSize === '') {
        this.$message({
          message: '请输入最小值',
          type: "warning",
          showClose: true,
          duration: 0
        });
        return 
      }
      if(this.maxSize === '') {
        this.$message({
          message: '请输入最大值',
          type: "warning",
          showClose: true,
          duration: 0
        });
        return 
      }
      if(Number(this.minSize) > Number(this.maxSize)) {
        this.$message({
          message: '最小值不能大于最大值',
          type: "warning",
          showClose: true,
          duration: 0
        });
        return 
      }
      this.loadShow = true;
      let param = {
        Version: "2018-05-25",
        ClusterId: this.clusterId
      }
      param["ClusterAsGroupAttribute.AutoScalingGroupId"] = this.groupId;
      param["ClusterAsGroupAttribute.AutoScalingGroupRange.MinSize"] = Number(this.minSize);
      param["ClusterAsGroupAttribute.AutoScalingGroupRange.MaxSize"] = Number(this.maxSize);

      await this.axios.post(MODIFY_GROUP_STATUS, param).then(res => {
        if(res.Response.Error === undefined) {
          this.loadShow = false;
          this.showToConfigureModal = false;
          this.$message({
            message: '调整成功',
            type: "success",
            showClose: true,
            duration: 0
          });
          this.GetGroupsList();
        } else {
          this.loadShow = false;
          let ErrTips = {
            "FailedOperation": "操作失败",
            "InternalError": "内部错误",
            "InternalError.AccountUserNotAuthenticated	": "账户未通过认证",
            "InternalError.AsCommon": "伸缩组资源创建报错",
            "InternalError.CamNoAuth": "没有权限",
            "InvalidParameter": "参数错误",
            "InvalidParameter.AsCommonError": "弹性伸缩组创建参数错误",
            "InvalidParameter.CidrOutOfRouteTable": "CIDR不在路由表之内",
            "InvalidParameter.GatewayAlreadyAssociatedCidr": "下一跳地址已关联CIDR",
            "InvalidParameter.Param": "参数错误",
            "InvalidParameter.RouteTableNotEmpty": "路由表非空",
            "LimitExceeded": "超过配额限制",
            "MissingParameter": "缺少参数错误",
            "ResourceInUse": "资源被占用",
            "ResourceNotFound": "资源不存在",
            "ResourceUnavailable": "资源不可用",
            "UnauthorizedOperation": "未授权操作",
            "UnknownParameter": "未知参数错误",
            "UnsupportedOperation": "操作不支持",
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
    
    ChangeStatus(val) {
      if(val === 'enabled') {
        return '已启用';
      } else if (val === 'enabling') {
        return '开启中';
      } else if (val === 'disabled') {
        return '已停用';
      } else if (val === 'disabling') {
        return '关闭中';
      } else if (val === 'updating') {
        return '更新中';
      } else if (val === 'deleting') {
        return '删除中';
      } else if (val === 'scaleDownEnabling') {
        return '开启缩容中';
      } else if (val === 'scaleDownDisabling') {
        return '关闭缩容中';
      }
    }
    // DescribeClusterAsGroupOption
  },
  components: {
    subTitle,
    tkeSearch,
    Loading
  },
  filters: {
    IsScaleDownEnableds:function(val){
      if(val){
        // this.control = true
        return "已开启"
      }
      else{
        return "已关闭"
      }
    },
    SkipNodesWithLocalStorages:function(val){
      if(val){
        return "含有本地存储Pod的节点"
      }
      else{
        return ''
      }
    },
    SkipNodesWithSystemPodss:function(val){
      if(val){
        return "含有kube-system namespace下非DaemonSet管理的Pod的节点"
      } else{
        return ''
      }
    },
    Expanders:function(val){
      if(val == 'random'){
        return "随机"
      } else if (val == 'most-pods') {
        return 'most-pods';
      } else if (val == 'least-waste') {
        return 'least-waste';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tke-grid{
  margin-top:0;
}
.tke-grid >>> .el-input__inner,
.tke-grid >>> .el-button {
  border-radius: 0;
}
  .bottom{
    margin:15px 0;
  }
  .text {
    font-size: 14px;
  }
  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 100%;
    padding:10px;
  }
  .customWidth{
    width:80%;
  }
  .input-w{
    width:150px;
  }
  .tke-button{
    border: none;
    /* color: #006eff */
  }
</style>

