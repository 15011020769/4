 <!-- 伸缩组列表 -->
 <template>
   <div>
     <subTitle :title="$t('TKE.subList.sszlb')" />
     <!-- 全局配置 -->
     <div class="tke-card tke-formpanel-wrap" v-show="saw">
       <div class="tke-grid ">
         <!-- 左侧 -->
         <div class="grid-left">
           <h4 class="tke-formpanel-title">全局配置</h4>
         </div>
         <!-- 右侧 -->
         <div class="grid-right" style="padding-bottom:20px">
           <span class="tke-text-link" @click="dialogFormVisible = true">{{$t('TKE.overview.bj')}}</span>
         </div>
       </div>

       <el-form class="tke-form" label-position='left' label-width="120px" size="mini">
         <el-form-item :label="$t('TKE.subList.zdsr')">
           <div class="tke-form-item_text">{{global.IsScaleDownEnabled|IsScaleDownEnableds}}</div>
         </el-form-item>
         <el-form-item :label="$t('TKE.subList.zdbfsrs')" v-show='control'>
           <div class="tke-form-item_text">{{global.MaxEmptyBulkDelete}}</div>
         </el-form-item>
         <el-form-item :label="$t('TKE.subList.srjsff')" v-show='control'>
           <div class="tke-form-item_text">
             {{$t('TKE.subList.bzhi')}}{{global.ScaleDownUtilizationThreshold}}{{$t('TKE.subList.pdsrtj')}}</div>
           <div class="tke-form-item_text" v-show='global.IgnoreDaemonSetsUtilization'>{{$t('TKE.subList.dlxbzzy')}}
           </div>
         </el-form-item>
         <el-form-item :label="$t('TKE.subList.jdlxkx')" v-show='control'>
           <div class="tke-form-item_text">{{global.ScaleDownUnneededTime}}{{$t('TKE.subList.fzhbsr')}}</div>
         </el-form-item>

         <el-form-item :label="$t('TKE.subList.jqkr')" v-show='control'>
           <div class="tke-form-item_text">{{global.ScaleDownDelay}}{{$t('TKE.subList.fzhpdsrtj')}}</div>
         </el-form-item>
         <el-form-item :label="$t('TKE.subList.bsrjd')" v-show='control'>
           <div class="tke-form-item_text">{{global.SkipNodesWithLocalStorage|SkipNodesWithLocalStorages}}</div>
           <div class="tke-form-item_text">{{global.SkipNodesWithSystemPods|SkipNodesWithSystemPodss}}</div>
         </el-form-item>
         <el-form-item :label="$t('TKE.subList.krsf')">
           <div class="tke-form-item_text">{{global.Expander|Expanders}}</div>
         </el-form-item>
         <el-form-item :label="$t('TKE.subList.jqgmsx')">
           <div class="tke-form-item_text">
             {{$t('TKE.subList.kkrjds')}} <br>
             {{$t('TKE.subList.dqrqwl')}}<br>
             {{$t('TKE.subList.dqdyjqjd')}}：5000<br>
             {{$t('TKE.subList.dqdyaljf')}}：100<br>
           </div>
         </el-form-item>
       </el-form>
     </div>
     <!-- 新建、搜索相关操作 -->
     <div class="tke-grid mt10" style="margin-top: 10px;">
       <!-- 左侧 -->
       <div class="grid-left">
         <el-button @click="goAsgCreate" size="small" type="primary">{{$t('TKE.subList.xjssz')}}</el-button>
         <el-button size="small" :disabled="this.deleteData.length>=1?false:true" @click="openDeleteAllDialog()">
           {{$t('TKE.overview.sc')}}</el-button>
       </div>
       <!-- 右侧 -->
       <div class="grid-right">
         <tkeSearch exportData :inputPlaceholder="$t('TKE.subList.qsrsszid')" :searchInput='searchInput'
           @changeInput="changeSearchInput" @clickSearch="clickSearch" @exportExcel="exportExcel">
         </tkeSearch>
       </div>
     </div>
     <!-- 数据列表展示 -->
     <div class="tke-card mt10">
       <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="list" v-loading="loadShow"
         id="exportTable" style="width: 100%">
         <el-table-column type="selection" width="55">
         </el-table-column>
         <el-table-column :label="$t('TKE.subList.sszmc')">
           <template slot-scope="scope">
             <!-- <span>{{scope.row.AutoScalingGroupId}}</span> -->
             <span> <a :href="'../AS/index.html#/flexGroup/secDetails/'+ scope.row.AutoScalingGroupId"
                 target="_self">{{scope.row.AutoScalingGroupId}}</a></span>
             <p>{{scope.row.AutoScalingGroupName}}<i class="el-icon-edit tke-icon"
                 @click="modifyNameModal(scope.row)"></i></p>
           </template>
         </el-table-column>
         <el-table-column prop="" :label="$t('TKE.subList.ksms')">
           <template slot-scope="scope">
             <span v-if="scope.row.ServiceSettings.ScalingMode==='CLASSIC_SCALING'">{{$t('TKE.subList.sfms')}}</span>
             <span v-else-if="scope.row.ServiceSettings.ScalingMode==='WAKE_UP_STOPPED_SCALING'"></span>
           </template>
         </el-table-column>
         <el-table-column prop="" :label="$t('TKE.overview.zt')">
           <template slot-scope="scope">
             <span
               :class="[scope.row.status === 'enabled' ? 'text-green' : '']">{{ChangeStatus(scope.row.status)}}</span>
           </template>
         </el-table-column>
         <el-table-column prop="" :label="$t('TKE.subList.zjsl')">
           <template slot-scope="scope">
             <span>{{scope.row.InstanceCount}}</span>
           </template>
         </el-table-column>
         <el-table-column prop="" :label="$t('TKE.subList.qwsss')">
           <template slot-scope="scope">
             <span>{{scope.row.DesiredCapacity}}</span>
           </template>
         </el-table-column>
         <el-table-column prop="" :label="$t('TKE.subList.zxsss')">
           <template slot-scope="scope">
             <span>{{scope.row.MinSize}}</span>
           </template>
         </el-table-column>
         <el-table-column prop="address" width="200" :label="$t('TKE.subList.zdsss')">
           <template slot-scope="scope">
             <span>{{scope.row.MaxSize}}</span>
           </template>
         </el-table-column>
         <el-table-column prop="address" :label="$t('TKE.subList.qdpzmc')">
           <template slot-scope="scope">
             <p><a
                 :href="'../AS/index.html#/startCon/secDetails/' + scope.row.LaunchConfigurationId">{{scope.row.LaunchConfigurationId}}</a>
             </p>
             <p>{{scope.row.LaunchConfigurationName}}</p>
           </template>
         </el-table-column>
         <el-table-column label="操作" width="130">
           <template slot-scope="scope">
             <el-button size="small" type="text" :disabled="scope.row.status==='disabled'?false:true"
               @click="showUse(scope.row)">{{$t('TKE.subList.qiy')}}</el-button>
             <el-button size="small" type="text" :disabled="scope.row.status==='enabled'?false:true"
               @click="showStop(scope.row)">停用</el-button>

             <el-dropdown class=" tke-dropdown">
               <span class="el-dropdown-link ml10">更多<i class="el-icon-arrow-down el-icon--right"></i>
               </span>
               <el-dropdown-menu slot="dropdown">
                 <el-dropdown-item command="a">
                   <el-button size="small" type="text" :disabled="scope.row.status==='enabled'?false:true"
                     @click="showToConfigure(scope.row)">{{$t('TKE.subList.tzpz')}}</el-button>
                 </el-dropdown-item>
                 <el-dropdown-item command="a"><span class="tke-text-link"
                     @click="deleteSigle(scope.row)">{{$t('TKE.overview.sc')}}</span></el-dropdown-item>
               </el-dropdown-menu>
             </el-dropdown>
           </template>
         </el-table-column>
       </el-table>
       <div class="tke-page">
         <div class="block">
           <el-pagination @size-change="handleSizeChange" :pager-count="7" @current-change="handleCurrentChange"
             :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
             layout="total, sizes, prev, pager, next" :total="total">
           </el-pagination>
         </div>
       </div>
     </div>

     <!-- 编辑 -->
     <el-dialog :title="$t('TKE.subList.szjqss')" :visible.sync="dialogFormVisible" width="70%">
       <el-card class="box-card">
         <el-form :model="global" :rules="rules" ref="ruleForm" label-position='left' label-width="250px">
           <el-form-item :label="$t('TKE.subList.zdsrong')" :label-width="formLabelWidth" class='bottom'>
             <el-checkbox v-model="global.IsScaleDownEnabled">{{$t('TKE.subList.kqzdsr')}}</el-checkbox>
             <p>{{$t('TKE.subList.jqjdkx')}}
               <!-- <a>集群自动扩缩容说明</a> -->
             </p>
           </el-form-item>
           <el-form-item :label="$t('TKE.subList.srpz')" :label-width="formLabelWidth" class='bottom'
             v-show='global.IsScaleDownEnabled'>
             <el-form-item :label="$t('TKE.subList.zdbfsrs')" prop="MaxEmptyBulkDelete">
               <el-input v-model="global.MaxEmptyBulkDelete" :placeholder="$t('TKE.colony.qsrnr')" class='input-w'
                 prop="input1" size='mini'></el-input>
             </el-form-item>
             <!-- <i class='el-icon-warning-outline'></i> -->
             <el-form-item :label="$t('TKE.subList.bzhi')" class='bottom' prop="ScaleDownUtilizationThreshold">
               <el-input v-model="global.ScaleDownUtilizationThreshold" :placeholder="$t('TKE.colony.qsrnr')"
                 class='input-w' size='mini'></el-input><span>{{$t('TKE.subList.kspdsrtj')}}</span>
               <p v-if="global.ScaleDownUtilizationThreshold != ''">{{$t('TKE.subList.zbfw')}}<span
                   v-if="global.ScaleDownUtilizationThreshold == 0">{{$t('TKE.subList.zbw')}}</span></p>
             </el-form-item>
             <el-form-item label=" " class='bottom'>
               <p>
                 <el-checkbox v-model="global.IgnoreDaemonSetsUtilization">{{$t('TKE.subList.dlxbzzy')}}</el-checkbox>
               </p>
             </el-form-item>
             <el-form-item :label="$t('TKE.subList.jdlxkx')" class='bottom' prop="ScaleDownUnneededTime">
               <el-input v-model="global.ScaleDownUnneededTime" :placeholder="$t('TKE.colony.qsrnr')" class='input-w'
                 prop="input3" size='mini'></el-input><span>{{$t('TKE.subList.fzhbsr')}}</span>
             </el-form-item>
             <el-form-item :label="$t('TKE.subList.jqkr')" class='bottom' prop="ScaleDownDelay">
               <el-input v-model="global.ScaleDownDelay" :placeholder="$t('TKE.colony.qsrnr')" class='input-w'
                 prop="input3" size='mini'></el-input><span>{{$t('TKE.subList.fzhpdsrtj')}}</span>
             </el-form-item>
             <el-form-item :label="$t('TKE.subList.bsrjd')" class='bottom'>
               <el-checkbox v-model="global.SkipNodesWithLocalStorage">{{$t('TKE.subList.hybdjd')}}</el-checkbox>
               <p>
                 <el-checkbox v-model="global.SkipNodesWithSystemPods">{{$t('TKE.subList.hypjd')}}</el-checkbox>
               </p>
             </el-form-item>
           </el-form-item>
           <el-form-item :label="$t('TKE.subList.krsf')" :label-width="formLabelWidth">
             <el-radio-group v-model="global.Expander" class='left' @change='setRadio($event)'>
               <el-radio label="random">{{ $t('TKE.subList.sji')}}</el-radio>
               <el-radio label="most-pods">most-pods</el-radio>
               <el-radio label="least-waste">least-waste</el-radio>
             </el-radio-group>
             <p class='left' v-if="global.Expander === 'random'">{{$t('TKE.subList.sjxz')}}</p>
             <p class='left' v-else-if="global.Expander === 'most-pods'">{{$t('TKE.subList.xzddssz')}}</p>
             <p class='left' v-else-if="global.Expander === 'least-waste'">{{$t('TKE.subList.xzdd')}}</p>
           </el-form-item>
         </el-form>
       </el-card>
       <div slot="footer" class="dialog-footer">
         <el-button @click="dialogFormVisible = false">取 消</el-button>
         <el-button type="primary" @click="setTrue()">{{$t('TKE.overview.qd')}}</el-button>
       </div>
     </el-dialog>
     <!-- 全选删除弹窗 -->
     <el-dialog :title="$t('TKE.subList.scssz')" :visible.sync="iSdialogDeleteAll" width="35%">
       <p>{{$t('TKE.subList.qdscyxssz')}}</p>
       <div>{{$t('TKE.colony.yxz')}}<span
           style="color:#ff9d00;">{{this.deleteData.length}}{{$t('TKE.overview.ge')}}</span>{{$t('TKE.subList.ssz')}},<a
           @click="show=!show" style="cursor: pointer;">{{$t('TKE.overview.ckqx')}}</a></div>
       <el-collapse-transition>
         <div v-show="show">
           <el-table :data="deleteData" height="200">
             <el-table-column property="AutoScalingGroupId" label="ID" width="150"></el-table-column>
             <el-table-column property="status" :label="$t('TKE.overview.zt')" width="150"></el-table-column>
             <el-table-column :label="$t('TKE.overview.zt')" width="200">
               <template>
                 {{$t('TKE.subList.ksc')}}
               </template>
             </el-table-column>
           </el-table>
         </div>
       </el-collapse-transition>
       <el-checkbox v-model="checkedItem" @change="changeDel(checkedItem)"></el-checkbox>
       <span>{{$t('TKE.subList.xhaljfjd')}}</span>
       <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="deleteSingleGroup('all')">{{$t('TKE.overview.qd')}}</el-button>
         <el-button @click="iSdialogDeleteAll = false">取 消</el-button>
       </span>
     </el-dialog>
     <!--停用伸缩组-->
     <el-dialog :title="$t('TKE.subList.tyssz')" :visible.sync="showStopModal" width="35%">
       <p>{{$t('TKE.subList.qdtyssz')}}{{groupId}}么？</p>
       <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="EnabledGroup()">{{$t('TKE.overview.qd')}}</el-button>
         <el-button @click="showStopModal = false">取 消</el-button>
       </span>
     </el-dialog>
     <!--启用伸缩组-->
     <el-dialog :title="$t('TKE.subList.qyssz')" :visible.sync="showUseModal" width="35%">
       <p>{{$t('TKE.subList.qdqyssz')}}{{groupId}}么？</p>
       <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="EnabledGroup()">{{$t('TKE.overview.qd')}}</el-button>
         <el-button @click="showUseModal = false">取 消</el-button>
       </span>
     </el-dialog>
     <!--调整配置-->
     <el-dialog :title="$t('TKE.subList.tzsszpz')" :visible.sync="showToConfigureModal" width="35%">
       <el-form label-width="80px">
         <el-form-item :label="$t('TKE.overview.mc')">
           <p>{{groupObj.AutoScalingGroupId}}({{groupObj.AutoScalingGroupName}})</p>
         </el-form-item>
         <el-form-item :label="$t('TKE.subList.slfw')">
           <el-input size="small" v-model="minSize" style="width:30%;"></el-input>
           <span>~</span>
           <el-input size="small" v-model="maxSize" style="width:30%;"></el-input>
           <p>{{$t('TKE.subList.zdtj')}}</p>
         </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="submitToConfigure()">{{$t('TKE.overview.qd')}}</el-button>
         <el-button @click="showToConfigureModal = false">取 消</el-button>
       </span>
     </el-dialog>
     <!--单个删除伸缩组-->
     <el-dialog :title="$t('TKE.subList.scssz')" :visible.sync="deleteSingleModal" width="35%">
       <p>{{$t('TKE.subList.qdscssz')}}{{groupId}}么？</p>
       <el-checkbox v-model="checkedItem" @change="changeDel(checkedItem)"></el-checkbox>
       <span>{{$t('TKE.subList.xhaljfjd')}}</span>
       <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="deleteSingleGroup('single')">{{$t('TKE.overview.qd')}}</el-button>
         <el-button @click="deleteSingleModal = false">取 消</el-button>
       </span>
     </el-dialog>
     <el-dialog :title="$t('TKE.subList.xgsszmc')" :visible.sync="showModifyNameModal" width="35%">
       <el-form label-width="80px">
         <el-form-item :label="$t('TKE.overview.mc')">
           <p>{{groupObj.AutoScalingGroupName}}</p>
         </el-form-item>
         <el-form-item :label="$t('TKE.subList.slfw')">
           <el-input size="small" v-model="groupName"></el-input>
           <p>{{$t('TKE.subList.mcbcgzf')}}</p>
         </el-form-item>
       </el-form>
       <span slot="footer" class="dialog-footer">
         <el-button type="primary" @click="modifyName()">{{$t('TKE.overview.qd')}}</el-button>
         <el-button @click="showModifyNameModal = false">取 消</el-button>
       </span>
     </el-dialog>
   </div>
 </template>
 <script>
   import subTitle from "@/views/TKE/components/subTitle";
   import tkeSearch from "@/views/TKE/components/tkeSearch";
   import Loading from "@/components/public/Loading";
   import {
     ErrorTips
   } from "@/components/ErrorTips";
   import XLSX from "xlsx";
   import FileSaver from "file-saver";
   import {
     ALL_CITY,
     CLUSTERS_GROUPS,
     AUTOSCALING_GROUPS,
     CLUSTERS_GROUPSOPTION,
     MODIFY_ATTRIBUTE,
     GROUP_OPTION,
     MODIFY_GROUP_STATUS,
     DELETE_GROUP,
     MODIFY_NAME
   } from "@/constants";
   export default {
     name: "colonyNodeManageAsg",
     data() {
       return {
         saw: '',
         iSdialogDeleteAll: false,
         show: true,
         clusterId: '',
         searchInput: "", //输入的搜索关键字
         loadShow: false, //加载是否显示
         control: false,
         list: [], //列表
         deleteData: [],
         groupIds: [], //伸缩组id列表
         total: 0,
         pageSize: 10,
         pageIndex: 0,
         groupName: '',
         multipleSelection: [],
         dialogFormVisible: false,
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
         global: {
           IsScaleDownEnabled: '',
           MaxEmptyBulkDelete: '', // 最大并发缩容数
           // OkTotalUnreadyCount:'',
           ScaleDownDelay: '',
           ScaleDownUtilizationThreshold: '', // 缩容计算方法
           SkipNodesWithLocalStorage: '',
           SkipNodesWithSystemPods: '',
           Expander: '',
           IgnoreDaemonSetsUtilization: '',
           ScaleDownUnneededTime: ''
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
           MaxEmptyBulkDelete: [{
             required: true,
             message: '最大並發縮容數不能為空',
             trigger: 'change'
           }],
           ScaleDownUtilizationThreshold: [{
             required: true,
             message: '佔比不能為空',
             trigger: 'change'
           }],
           ScaleDownUnneededTime: [{
             required: true,
             message: '時間不能為空',
             trigger: 'change'
           }],
           ScaleDownDelay: [{
             required: true,
             message: '時間不能為空',
             trigger: 'change'
           }],
         }
       };
     },
     created() {
       // 从路由获取集群id
       this.GetGroupsOption();
       this.clusterId = this.$route.query.clusterId;
       this.GetGroupsList();
     },
     methods: {
       //获取
       // 新建伸缩组
       goAsgCreate() {
         this.$router.push({
           name: "asgCreate",
           query: {
             clusterId: this.clusterId
           }
         });
       },

       // 确定
       setTrue() {
         this.dialogFormVisible = false
         this.DetailGroupsList()
         if (this.global.IsScaleDownEnabled) {
           this.control = true
           return
         }
         this.control = false
       },

       setRadio(e) {
         console.log(e)
       },
       //监听搜索框的值
       changeSearchInput(val) {
         this.searchInput = val;
         console.log(this.searchInput)
       },

       // 点击搜索
       clickSearch(val) {
         this.searchInput = val;
         this.GetGroupsList();
         console.log(this.searchInput)
       },

       //打开批量删除弹窗
       openDeleteAllDialog() {
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
         this.pageIndex = val - 1;
         this.GetGroupsList();
         this.pageIndex += 1;
       },
       handleSizeChange(val) {
         this.pageSize = val;
         this.GetGroupsList();
       },
       //全选
       handleSelectionChange(val) {
         this.deleteData = val;
       },
       // 获取伸缩组全局配置
       async GetGroupsOption() {
         this.loadShow = true;
         let param = {
           ClusterId: this.$route.query.clusterId,
           Version: "2018-05-25"
         }
         const res = await this.axios.post(CLUSTERS_GROUPSOPTION, param);
         if (res.Error === undefined) {
           console.log(res)
           this.global.IsScaleDownEnabled = res.Response.ClusterAsGroupOption.IsScaleDownEnabled
           if (res.Response.ClusterAsGroupOption.IsScaleDownEnabled) {
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
         } else {
           this.loadShow = false;
           let ErrTips = {
             "FailedOperation": "操作失敗",
             "InternalError": "内部錯誤",
             "InternalError.AccountUserNotAuthenticated": "帳戶未通過認證",
             "InternalError.AsCommon": "伸縮組資源創建報錯",
             "InternalError.CamNoAuth": "沒有權限",
             "InternalError.Param": "Param",
             "UnknownParameter": "未知參數錯誤",
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
       async DetailGroupsList() {
         this.loadShow = true;
         let param = {
           ClusterId: this.$route.query.clusterId,
           Version: "2018-05-25"
         }
         param['ClusterAsGroupOption.IsScaleDownEnabled'] = this.global.IsScaleDownEnabled;
         param['ClusterAsGroupOption.MaxEmptyBulkDelete'] = Number(this.global.MaxEmptyBulkDelete);
         param['ClusterAsGroupOption.ScaleDownDelay'] = Number(this.global.ScaleDownDelay);
         param['ClusterAsGroupOption.ScaleDownUtilizationThreshold'] = Number(this.global
           .ScaleDownUtilizationThreshold);
         param['ClusterAsGroupOption.SkipNodesWithLocalStorage'] = this.global.SkipNodesWithLocalStorage;
         param['ClusterAsGroupOption.SkipNodesWithSystemPods'] = this.global.SkipNodesWithSystemPods;
         param['ClusterAsGroupOption.Expander'] = this.global.Expander;
         param['ClusterAsGroupOption.IgnoreDaemonSetsUtilization'] = this.global.IgnoreDaemonSetsUtilization;
         param['ClusterAsGroupOption.ScaleDownUnneededTime'] = this.global.ScaleDownUnneededTime;
         const res = await this.axios.post(MODIFY_ATTRIBUTE, param);
         if (res.Response.Error === undefined) {
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
       async GetGroupsListId() {
         this.loadShow = true;
         let param = {
           ClusterId: this.$route.query.clusterId,
           Limit: this.pageSize,
           Offset: this.pageIndex,
           Version: "2018-05-25"
         }
         const res = await this.axios.post(CLUSTERS_GROUPS, param);
         if (res.Error === undefined) {
           // console.log(res,222)
           if (res.Response.ClusterAsGroupSet.length > 0) {
             this.saw = true
             let ids = [];
             res.Response.ClusterAsGroupSet = res.Response.ClusterAsGroupSet.map(item => {
               this.groupIds.push(item.AutoScalingGroupId);
               return item;
             })
           } else {
             this.saw = false
           }
           this.loadShow = false;
         } else {
           this.loadShow = false;
           let ErrTips = {
             "FailedOperation": "操作失敗",
             "InternalError": "内部錯誤",
             "InternalError.AccountUserNotAuthenticated": "帳戶未通過認證",
             "InternalError.AsCommon": "伸縮組資源創建報錯",
             "InternalError.Db": "db錯誤",
             "InternalError.PodNotFound": "Pod未找到",
             "InternalError.Param": "Param",
             "InternalError.VpcCommon": "VPC報錯",
             "InternalError.VpcPeerNotFound": "對等連接不存在",
             "InternalError.VpcRecodrNotFound": "未發現vpc記錄",
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
       async GetGroupsList() {
         this.loadShow = true;
         let ids = [];
         let param = {
           ClusterId: this.$route.query.clusterId,
           Limit: this.pageSize,
           Offset: this.pageIndex,
           Version: "2018-05-25"
         }
         if (this.searchInput !== "") {
           param["AutoScalingGroupIds.0"] = this.searchInput;
         }
         const res = await this.axios.post(CLUSTERS_GROUPS, param);
         if (res.Error === undefined) {
           // console.log(res,222)
           if (res.Response.ClusterAsGroupSet.length > 0) {
             this.saw = true
             res.Response.ClusterAsGroupSet = res.Response.ClusterAsGroupSet.map(item => {
               ids.push(item);
               return item;
             })
           } else {
             this.saw = false
           }
           this.loadShow = false;
         } else {
           this.loadShow = false;
           let ErrTips = {
             "FailedOperation": "操作失敗",
             "InternalError": "内部錯誤",
             "InternalError.AccountUserNotAuthenticated": "帳戶未通過認證",
             "InternalError.AsCommon": "伸縮組資源創建報錯",
             "InternalError.Db": "db錯誤",
             "InternalError.PodNotFound": "Pod未找到",
             "InternalError.Param": "Param",
             "InternalError.VpcCommon": "VPC報錯",
             "InternalError.VpcPeerNotFound": "對等連接不存在",
             "InternalError.VpcRecodrNotFound": "未發現vpc記錄",
           };
           let ErrOr = Object.assign(ErrorTips, ErrTips);
           this.$message({
             message: ErrOr[res.Response.Error.Code],
             type: "error",
             showClose: true,
             duration: 0
           });
         }
         if (ids.length > 0) {
           this.list = [];
           this.loadShow = true;
           let param = {
             Limit: this.pageSize,
             Version: "2018-04-19"
           }
           for (var i = 0; i < ids.length; i++) {
             param['AutoScalingGroupIds.' + i] = ids[i].AutoScalingGroupId;
           }
           const res = await this.axios.post(AUTOSCALING_GROUPS, param);
           if (res.Response.Error === undefined) {
             if (res.Response.AutoScalingGroupSet.length > 0) {
               res.Response.AutoScalingGroupSet.map(group => {
                 ids.map(groupid => {
                   if (group.AutoScalingGroupId === groupid.AutoScalingGroupId) {
                     group.status = groupid.Status;
                   }
                 })
               });
               this.total = res.Response.TotalCount;
             }
             this.list = res.Response.AutoScalingGroupSet;
             console.log("list", this.list);
             this.loadShow = false;
           } else {
             this.loadShow = false;
             let ErrTips = {
               "InvalidFilter": "無效的過濾器",
               "InvalidParameterConflict": "指定的兩個參數衝突，不能同時存在",
               "InvalidParameterValue.Filter": "無效的過濾器",
               "InvalidPermission": "帳戶不支持該操作",
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
           if (res.Response.Error === undefined) {
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
               "InvalidParameter.InScenario": "在特定場景下的不合法參數。",
               "InvalidParameterValue.CvmError": "CVM參數校驗異常。",
               "InvalidParameterValue.GroupNameDuplicated": "伸縮組名稱重複。",
               "InvalidParameterValue.LaunchConfigurationNotFound": "找不到指定啟動配置。",
               "InvalidParameterValue.LbProjectInconsistent": "負載均衡器專案不一致。",
               "InvalidParameterValue.LbVpcInconsistent": "負載均衡器和伸縮組的VPC不一致。",
               "InvalidParameterValue.LimitExceeded": "取值超出限制。",
               "InvalidParameterValue.OnlyVpc": "帳號僅支持VPC網路。",
               "InvalidParameterValue.Range": "取值超出指定範圍。",
               "InvalidParameterValue.Size": "伸縮組最大數量、最小數量、期望實例數取值不合法。",
               "InvalidParameterValue.SubnetIds": "子網訊息不合法。",
               "InvalidParameterValue.TooLong": "取值過多。",
               "LimitExceeded": "超過配額限制",
               "LimitExceeded.MaxSizeLimitExceeded": "最大實例數大於限制。",
               "LimitExceeded.MinSizeLimitExceeded": "最小實例數低於限制。",
               "MissingParameter": "缺少參數錯誤",
               "MissingParameter.InScenario": "在特定場景下缺少參數。",
               "ResourceNotFound.AutoScalingGroupIdNotFound": "伸縮組不存在。",
               "ResourceUnavailable.LaunchConfigurationStatusAbnormal": "啟動配置狀態異常。",
               "ResourceUnavailable.ProjectInconsistent": "專案不一致。",
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
         if (change) {
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
         if (deleteData.length > 0) {
           for (var i = 0; i < deleteData.length; i++) {
             param["AutoScalingGroupIds." + i] = deleteData[i].AutoScalingGroupId;
           }
         }
         await this.axios.post(DELETE_GROUP, param).then(res => {
           if (res.Response.Error === undefined) {
             this.loadShow = false;
             if (type === 'all') {
               this.iSdialogDeleteAll = false;
             } else {
               this.deleteSingleModal = false;
             }
             this.$message({
               message: '刪除成功',
               type: "success",
               showClose: true,
               duration: 0
             });
             this.GetGroupsList();
           } else {
             this.loadShow = false;
             let ErrTips = {
               "FailedOperation": "操作失敗",
               "InternalError": "内部錯誤",
               "InternalError.AccountUserNotAuthenticated	": "帳戶未通過認證",
               "InternalError.AsCommon": "伸縮組資源創建報錯",
               "InternalError.Param": "Param",
               "InternalError.PublicClusterOpNotSupport": "集群不支持當前操作",
               "InternalError.QuotaMaxClsLimit": "超過配額限制",
               "InternalError.QuotaMaxNodLimit": "超過配額限制",
               "InternalError.QuotaMaxRtLimit": "超過配額限制",
               "InvalidParameter": "參數錯誤",
               "InvalidParameter.AsCommonError": "彈性伸縮組創建參數錯誤",
               "InvalidParameter.Param": "參數錯誤",
               "InvalidParameter.RouteTableNotEmpty": "路由表非空",
               "LimitExceeded": "超過配額限制",
               "MissingParameter": "缺少參數錯誤",
               "ResourceInUse": "資源被佔用",
               "ResourceNotFound": "資源不存在",
               "UnknownParameter": "未知參數錯誤",
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
         if (enableType === 'tingyong') {
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
           if (res.Response.Error === undefined) {
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
               "FailedOperation": "操作失敗",
               "InternalError": "内部錯誤",
               "InternalError.AccountUserNotAuthenticated	": "帳戶未通過認證",
               "InternalError.AsCommon": "伸縮組資源創建報錯",
               "InternalError.CamNoAuth": "沒有權限",
               "InvalidParameter": "參數錯誤",
               "InvalidParameter.AsCommonError": "彈性伸縮組創建參數錯誤",
               "InvalidParameter.CidrOutOfRouteTable": "CIDR不在路由表之内",
               "InvalidParameter.GatewayAlreadyAssociatedCidr": "下一跳地址已關聯CIDR",
               "InvalidParameter.Param": "參數錯誤",
               "InvalidParameter.RouteTableNotEmpty": "路由表非空",
               "LimitExceeded": "超過配額限制",
               "MissingParameter": "缺少參數錯誤",
               "ResourceInUse": "資源被佔用",
               "ResourceNotFound": "資源不存在",
               "ResourceUnavailable": "資源不可用",
               "UnauthorizedOperation": "未授權操作",
               "UnknownParameter": "未知參數錯誤",
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
         if (this.minSize === '') {
           this.$message({
             message: '請輸入最小值',
             type: "warning",
             showClose: true,
             duration: 0
           });
           return
         }
         if (this.maxSize === '') {
           this.$message({
             message: '請輸入最大值',
             type: "warning",
             showClose: true,
             duration: 0
           });
           return
         }
         if (Number(this.minSize) > Number(this.maxSize)) {
           this.$message({
             message: '最小值不能大於最大值',
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
           if (res.Response.Error === undefined) {
             this.loadShow = false;
             this.showToConfigureModal = false;
             this.$message({
               message: '調整成功',
               type: "success",
               showClose: true,
               duration: 0
             });
             this.GetGroupsList();
           } else {
             this.loadShow = false;
             let ErrTips = {
               "FailedOperation": "操作失敗",
               "InternalError": "内部錯誤",
               "InternalError.AccountUserNotAuthenticated	": "帳戶未通過認證",
               "InternalError.AsCommon": "伸縮組資源創建報錯",
               "InternalError.CamNoAuth": "沒有權限",
               "InvalidParameter": "參數錯誤",
               "InvalidParameter.AsCommonError": "彈性伸縮組創建參數錯誤",
               "InvalidParameter.CidrOutOfRouteTable": "CIDR不在路由表之内",
               "InvalidParameter.GatewayAlreadyAssociatedCidr": "下一跳地址已關聯CIDR",
               "InvalidParameter.Param": "參數錯誤",
               "InvalidParameter.RouteTableNotEmpty": "路由表非空",
               "LimitExceeded": "超過配額限制",
               "MissingParameter": "缺少參數錯誤",
               "ResourceInUse": "資源被佔用",
               "ResourceNotFound": "資源不存在",
               "ResourceUnavailable": "資源不可用",
               "UnauthorizedOperation": "未授權操作",
               "UnknownParameter": "未知參數錯誤",
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
         if (val === 'enabled') {
           return '已啟用';
         } else if (val === 'enabling') {
           return '開啟中';
         } else if (val === 'disabled') {
           return '已停用';
         } else if (val === 'disabling') {
           return '關閉中';
         } else if (val === 'updating') {
           return '更新中';
         } else if (val === 'deleting') {
           return '刪除中';
         } else if (val === 'scaleDownEnabling') {
           return '開啟縮容中';
         } else if (val === 'scaleDownDisabling') {
           return '關閉縮容中';
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
       IsScaleDownEnableds: function (val) {
         if (val) {
           // this.control = true
           return "已開啟"
         } else {
           return "已關閉"
         }
       },
       SkipNodesWithLocalStorages: function (val) {
         if (val) {
           return "含有本地存儲Pod的節點"
         } else {
           return ''
         }
       },
       SkipNodesWithSystemPodss: function (val) {
         if (val) {
           return "含有kube-system namespace下非DaemonSet管理的Pod的節點"
         } else {
           return ''
         }
       },
       Expanders: function (val) {
         if (val == 'random') {
           return "隨機"
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
   .tke-grid {
     margin-top: 0;
   }

   .tke-grid>>>.el-input__inner,
   .tke-grid>>>.el-button {
     border-radius: 0;
   }

   .bottom {
     margin: 15px 0;
   }

   .text {
     font-size: 14px;
   }

   .item {
     padding: 18px 0;
   }

   .box-card {
     width: 100%;
     padding: 10px;
   }

   .customWidth {
     width: 80%;
   }

   .input-w {
     width: 150px;
   }

   .tke-button {
     border: none;
     /* color: #006eff */
   }

 </style>
