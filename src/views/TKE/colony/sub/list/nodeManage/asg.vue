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
    <div class="tke-grid mt10">
      <!-- 左侧 -->
      <div class="grid-left">
        <el-button @click="goAsgCreate" size="small" type="primary">新建伸缩组</el-button>
        <el-button size="small" disabled="">删除</el-button>
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
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="伸缩组ID/名称"
          >
          <template slot-scope="scope">
            <span class="tke-text-link" >ins-8czy2x5q</span>
            <p>as-test02</p>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="状态"
          >
          <template slot-scope="scope">
              <span v-if="scope.row.status===true" class="text-green">已启用</span>
              <span v-else class="text-red">已停用</span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="子机数量"
          >
          <template slot-scope="scope">
            <el-tooltip effect="light" content="台北一区" placement="top">
              <span>台北一区</span>
            </el-tooltip>
          </template>
        </el-table-column>
        
        <el-table-column
          prop=""
          label="最小伸缩数"
          >
          <template slot-scope="scope">
            <el-tooltip effect="light" content="v1.10.5-tke.6" placement="top">
              <span>v1.10.5-tke.6</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
            width="200"
          label="最大伸缩数">
          <template slot-scope="scope">
            标准型S3 <br>
            1核 , 1GB , 1 Mbps<br>
            系统盘: 50GB 高性能云硬盘<br>
          </template>
        </el-table-column>
        <el-table-column
        width="120"
          prop="nodeTotal"
          label="Label">
          <template slot-scope="scope">
            <p>175.97.134.163</p>
            <p>10.209.64.102</p>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="启动配置ID/名称">
          <template slot-scope="scope">
            <p>CPU: -/-</p>
            <p>内存: -/-</p>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="130"
          >
          <template slot-scope="scope">
            <span class="text-gray">停用</span>
            <span class="tke-text-link ml10">启用</span>
            
            <el-dropdown class=" tke-dropdown" >
              <span class="el-dropdown-link ml10" >更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a"><span class="tke-text-link">调整配置</span></el-dropdown-item>
                <el-dropdown-item command="a"><span class="tke-text-link">删除</span></el-dropdown-item>
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
              <p>集群中节点空闲资源较多时将触发缩容。详情请查看<a>集群自动扩缩容说明</a></p>
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
                <el-radio-group v-model="form.radio" class='left' @change='setRadio($event)'>
                  <el-radio :label="1">随机</el-radio>
                  <el-radio :label="2">most-pods</el-radio>
                  <el-radio :label="3">least-waste</el-radio>
                </el-radio-group>
              <p class='left' v-if="form.radio == 1">随机选择一个伸缩组进行扩容</p>
              <p class='left' v-else-if="form.radio == 2">选择能调度更多pod的伸缩组进行扩容</p>
              <p class='left' v-else="form.radio == 3">选择pod调度后资源剩余更少的伸缩组进行扩容</p>
            </el-form-item>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="setTrue()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import subTitle from "@/views/TKE/components/subTitle";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import { ALL_CITY,CLUSTERS_GROUPS,AUTOSCALING_GROUPS,CLUSTERS_GROUPSOPTION,MODIFY_ATTRIBUTE } from "@/constants";
export default {
  name: "colonyNodeManageAsg",
  data() {
    return {
      saw:'',
      clusterId:'',
      searchInput: "", //输入的搜索关键字
      loadShow: false, //加载是否显示
      control:false,
      list:[
        {
          status:false
        },
        {
          status:true
        }
      ], //列表
      total:0,
      pageSize:10,
      pageIndex:0,
      multipleSelection: [],
      dialogFormVisible:false,
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
    this.GetGroupsOption()
    this.GetGroupsListId()
    this.clusterId=this.$route.query.clusterId;
  },
  methods: {
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
      console.log(this.searchInput)
    },
    
    // 导出表格
    exportExcel() {
      console.log('exportExcel...')
      /* generate workbook object from table */
      // var wb = XLSX.utils.table_to_book(document.querySelector("#exportTable"));
      /* get binary string as output */
      // var wbout = XLSX.write(wb, {
      //   bookType: "xlsx",
      //   bookSST: true,
      //   type: "array"
      // });
      // try {
      //   FileSaver.saveAs(
      //     new Blob([wbout], {
      //       type: "application/octet-stream"
      //     }),
      //     this.$t("CVM.clBload.fzjh") + ".xlsx"
      //   );
      // } catch (e) {
      //   if (typeof console !== "undefined") console.log(e, wbout);
      // }
      // return wbout;
    },

    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val-1;
      // this.getColonyList();
      this.pageIndex+=1;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      // this.pageSize=val;
      this.getColonyList();
    },
    //全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取伸缩组全局配置
    async GetGroupsOption () { 
      let param = {
        ClusterId: this.$route.query.clusterId,
        Version: "2018-05-25"
      }
      const res = await this.axios.post(CLUSTERS_GROUPSOPTION, param);
      if(res.Error){
        console.log(res);
        // this.loadShow = false;
      }else{
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
      }
    },
    // 修改全局配置
    async DetailGroupsList () { 
      let param = {
        ClusterAsGroupOption:this.global,
        ClusterId: this.$route.query.clusterId,
        Version: "2018-05-25"
      }
      console.log(param)
      const res = await this.axios.post(MODIFY_ATTRIBUTE, param);
      console.log(res)
    },

    // 获取伸缩组列表ID
    async GetGroupsListId () { 
      let param = {
        ClusterId: this.$route.query.clusterId,
        Limit: 20,
        Offset: 0,
        Version: "2018-05-25"
      }
      const res = await this.axios.post(CLUSTERS_GROUPS, param);
      if(res.Error){
        console.log(res);
        // this.loadShow = false;
      }else{
        // console.log(res,222)
        if(res.Response.ClusterAsGroupSet.length>0){
          this.saw=true
          let ids=[];
          res.Response.ClusterAsGroupSet = res.Response.ClusterAsGroupSet.map(item => {
              ids.push(item.AutoScalingGroupId);
              return item;
          })
          // this.GetGroupsList(ids)
        }
        else{
          this.saw = false
        }
      }
    },
    // 获取伸缩祖列表ID
    // 获取不到数据，无法进行后续操作
    async GetGroupsList (ids) { 
      console.log(ids)
      let param = {
        AutoScalingGroupIds: ids,
        Limit: 20,
        Offset: 0,
        Version: "2018-04-19"
      }
      const res = await this.axios.post(AUTOSCALING_GROUPS, param);
      if(res.Error){
        console.log(res);
        // this.loadShow = false;
      }else{
        console.log(res,222)
      }
    },
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
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>

