 <!--HorizontalPodAutoscaler -->
<template>
  <div >
      <subTitle title='HorizontalPodAutoscaler'  />

      <!-- 新建、搜索相关操作 -->
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <el-button @click="goHpaCreate()" size="small" type="primary">新建</el-button>
        </div>
        <!-- 右侧 -->
        <div class="grid-right">
          <tkeSearch 
            typeSelect 
            refreshData
            exportData
            typeLabel='命名空间' 
            :typeOptions='searchOptions'
            :typeValue='searchType' 
            inputPlaceholder='请输入关键词搜索'
            :searchInput='searchInput'

            @changeType="changeSearchType"
            @changeInput="changeSearchInput"
            @clickSearch="clickSearch"
            @refresh='refreshList'
            @exportExcel="exportExcel"
          >
          </tkeSearch>
        
            
        </div>
      </div>

      <!-- 数据列表展示 -->
      <div class="tke-card mt10">
        <el-table
          :data="list.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)"
           id="exportTable"
          
          v-loading="loadShow"
          style="width: 100%">
          <el-table-column
            label="名称"
            >
            <template slot-scope="scope">
              <span @click="goHpaDetail(scope.row)" class="tke-text-link">{{scope.row.metadata.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="关联工作负载"
            >
            <template slot-scope="scope">
               <span>{{scope.row.spec.scaleTargetRef.kind}}:{{scope.row.spec.scaleTargetRef.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            :show-overflow-tooltip="true"
            label="触发策略"
            >
            <template slot-scope="scope">
                <span v-for="(v,i) in scope.row.spec.metrics" :key="i" >
                 {{v|dataShow(v)}}&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
                <!-- <span v-for="(v,i) in scope.row.spec.metrics" >cpu使用量：{{scope.row.spec.metrics[0].pods.targetAverageValue}}核</span> -->
            </template>
          </el-table-column>
          
          <el-table-column
            prop=""
            label="最小实例数"
            >
            <template slot-scope="scope">
              <span>{{scope.row.spec.minReplicas}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop=""
            label="最大实例数"
            >
            <template slot-scope="scope">
              <span>{{scope.row.spec.maxReplicas}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="220"
            >
            <template slot-scope="scope">
              <div v-if="scope.row.metadata.namespace=='kube-system'">
               <el-tooltip class="tooltip" effect="dark" content="当前Namespace下的不可进行此操作" placement="top">
                     <el-button   class='btn btn2'  >修改配置</el-button>
              </el-tooltip>
               <el-tooltip class="tooltip" effect="dark" content="当前Namespace下的不可进行此操作" placement="top">
                     <el-button   class='btn btn2' >编辑YAML</el-button>
              </el-tooltip>
               <el-tooltip class="tooltip" effect="dark" content="当前Namespace下的不可进行此操作" placement="top">
                     <el-button   class='btn btn2'  >删除</el-button>
              </el-tooltip>
              </div>
              <div v-else>
                   <el-button   class='btn' @click="goUpdatepz(scope.row)" >修改配置</el-button>
                   <el-button  class='btn' @click="goUpdateYaml(scope.row)">编辑YAML</el-button>
                   <el-button   class='btn' @click="delConfig(scope.row)">删除</el-button>
              </div>
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
       <el-dialog
        title="删除资源"
        :visible.sync="dialogVisible"
       width="30%"
      :before-close="handleClose">
        <span>您确定要删除HorizontalPodAutoscaler:{{name}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="delSure">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import subTitle from "@/views/TKE/components/subTitle";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import XLSX from "xlsx";
import FileSaver from "file-saver";
import { ALL_CITY,TKE_COLONY_QUERY } from "@/constants";
export default {
  name: "colonyResourceCronJob",
  data() {
    return {
      name:'',
      dialogVisible:false,
      loadShow: false, //加载是否显示
      list:[], //列表
      total:0,
      pageSize:10,
      pageIndex:1,
      multipleSelection: [],
      
      //搜索下拉框
      searchOptions: [],
      searchType: "", //下拉选中的值
      searchInput: "", //输入的搜索关键字
    };
  },
 
  created() {
    // 从路由获取集群id
    this.clusterId=this.$route.query.clusterId;
    this.getData();    
  },
  methods: {
    async getData() {
      await this.nameSpaceList();
      await this.tableListData();
    },
    //命名空间选项 
    async nameSpaceList() {
      if (this.clusterId) {
        var params = {
          ClusterName: this.clusterId,
          Method: "GET",
          Path: "/api/v1/namespaces",
          Version: "2018-05-25",
        };
        await this.axios.post(TKE_COLONY_QUERY, params).then(res => {
          if (res.Response.Error==undefined) {
            var data = JSON.parse(res.Response.ResponseBody);
            var nameList=[];
            data.items.forEach(item => {
              nameList.push({value:item.metadata.name,label:item.metadata.name})
            })
            this.searchOptions=nameList
            this.searchType=nameList[0].value
          }
        })
      }
    },
    //列表数据展示
    async tableListData(){
      var params={
        ClusterName:this.clusterId,
        Method: "GET",
        Path: "/apis/autoscaling/v2beta1/namespaces/"+this.searchType+"/horizontalpodautoscalers?fieldSelector=metadata.name="+this.searchInput,
        Version: "2018-05-25",
      }
      console.log(params)
      this.loadShow=true
      await this.axios.post(TKE_COLONY_QUERY,params).then(res=>{

        if (res.Response.Error==undefined) {
              var data = JSON.parse(res.Response.ResponseBody);
             console.log(data)
             this.list = data.items;
             this.total=data.items.length
              this.loadShow=false
         }else{
            this.loadShow = false;
          let ErrTips = {};
          let ErrOr = Object.assign(this.ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
         }
        
      })
    },
    delConfig(item){
      this.dialogVisible=true;
      this.name=item.metadata.name;
    // this.np=item.metadata.namespace;
    },
      delSure(){
          this.dialogVisible = false
          var params={
            ClusterName: this.clusterId,
            Method: "DELETE",
            Path: "/apis/autoscaling/v2beta1/namespaces/"+this.searchType+"/horizontalpodautoscalers/"+this.name,
            RequestBody: {"propagationPolicy":"Background"},
            Version: "2018-05-25"
          }
          this.axios.post(TKE_COLONY_QUERY, params).then(res=>{

            if (res.Response.Error==undefined) {
               this.$message({
                    message: "删除成功",
                    type: "success",
                    showClose: true,
                    duration: 0,
                     });
                 this.tableListData();
            }
          })

      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
     // 新建
    goHpaCreate(){
      this.$router.push({
          name: "hpaCreate",
          query: {
            clusterId: this.clusterId
          }
      });
    },

    // 详情
    goHpaDetail(item){
      this.$router.push({
          name: "hpaDetail",
          query: {
            clusterId: this.clusterId,
            name:item.metadata.name,
            np:item.metadata.namespace,
          }
      });
    },
    //编辑配置
    goUpdatepz(item){
      console.log(item)
       this.$router.push({
          name: "updateHpa",
          query: {
            clusterId: this.clusterId,
            name:item.metadata.name,
            np:item.metadata.namespace,
          }
      });
    },
    //编辑yaml
    goUpdateYaml(item){
       this.$router.push({
          name: "updateHpaYaml",
          query: {
            clusterId: this.clusterId,
            name:item.metadata.name,
            np:item.metadata.namespace,
          }
      });

    },

    //选择搜索条件
    changeSearchType(val) {
      this.searchType = val;
      console.log(this.searchType)
      this.tableListData();
    },
    //监听搜索框的值
    changeSearchInput(val) {
      this.searchInput = val;
      this.tableListData();
      console.log(this.searchInput)
    },
    // 点击搜索
    clickSearch(val){
      this.searchInput = val;
      this.tableListData();
      console.log(this.searchInput)
    },
    //重新整理数据
    refreshList(){
      console.log('refreshList....')
       this.tableListData();
    },
    // 导出表格
    exportExcel() {
      console.log('exportExcel...')
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector("#exportTable"));
      /* get binary string as output */
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
          this.$t("CVM.clBload.fzjh") + ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },

    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val-1;
      // this.getColonyList();
      this.pageIndex+=1;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize=val;
      // this.getColonyList();
    },

  },
  filters:{
    dataShow(val){
      if(val.resource){
         if(val.resource.name=='cpu'){
             return "CPU利用率（占Request）"+val.resource.targetAverageUtilization+'%'
        }
      }

      if(val.pods){
       //cpu
        if(val.pods['metricName']=='k8s_pod_cpu_core_used'){
          return "CPU使用量"+val.pods.targetAverageValue+'核'
        }
        if(val.pods['metricName']=='k8s_pod_rate_cpu_core_used_node'){
          return "CPU利用率（占节点）"+val.pods.targetAverageValue+'%'
        }
        if(val.pods['metricName']=='k8s_pod_rate_cpu_core_used_request'){
          return "CPU利用率（占Request）"+val.pods.targetAverageValue+'%'
        }
       
        if(val.pods['metricName']=='k8s_pod_rate_cpu_core_used_limit'){
          return "CPU利用率（占Limit）"+val.pods.targetAverageValue+'%'
        }
        //内存
         if(val.pods['metricName']=='k8s_pod_mem_usage_bytes'){
          return "内存使用量"+val.pods.targetAverageValue+'B'
          }
         if(val.pods['metricName']=='k8s_pod_mem_no_cache_bytes'){
          return "内存使用量（不包含 Cache）"+val.pods.targetAverageValue+'B'
          }
         if(val.pods['metricName']=='k8s_pod_rate_mem_usage_node'){
          return "内存利用率（占节点）"+val.pods.targetAverageValue+'%'
          }
         if(val.pods['metricName']=='k8s_pod_rate_mem_no_cache_node'){
          return "内存利用率（占节点，不包含 Cache）"+val.pods.targetAverageValue+'%'
          }
         if(val.pods['metricName']=='k8s_pod_rate_mem_usage_request'){
          return "内存利用率（占Request）"+val.pods.targetAverageValue+'%'
          }
         if(val.pods['metricName']=='k8s_pod_rate_mem_no_cache_request'){
          return "内存利用率（占 Request，不包含Cache）"+val.pods.targetAverageValue+'%'
          }
         if(val.pods['metricName']=='k8s_pod_rate_mem_usage_limit'){
          return "内存利用率（占 Limit）"+val.pods.targetAverageValue+'%'
          }
         if(val.pods['metricName']=='k8s_pod_rate_mem_no_cache_limit'){
          return "内存利用率（占 Limit，不包含 Cache）"+val.pods.targetAverageValue+'%'
          }
         //硬盘 
         if(val.pods['metricName']=='k8s_pod_fs_write_bytes'){
          return "硬盘写流量"+val.pods.targetAverageValue+'B/s'
          }
         if(val.pods['metricName']=='k8s_pod_fs_read_bytes'){
          return "硬盘读流量"+val.pods.targetAverageValue+'B/s'
          }
         if(val.pods['metricName']=='k8s_pod_fs_read_times'){
          return "硬盘读 IOPS "+val.pods.targetAverageValue+'次/s'
          }
         if(val.pods['metricName']=='k8s_pod_fs_write_times'){
          return "硬盘写 IOPS "+val.pods.targetAverageValue+'次/s'
          }
        //网络  
         if(val.pods['metricName']=='k8s_pod_network_receive_bytes_bw'){
          return "网络入带宽 "+val.pods.targetAverageValue+'B'
          }
         if(val.pods['metricName']=='k8s_pod_network_transmit_bytes_bw'){
          return "网络出带宽 "+val.pods.targetAverageValue+'B'
          }
         if(val.pods['metricName']=='k8s_pod_network_receive_bytes'){
          return "网络入流量 "+val.pods.targetAverageValue+'B/s'
          }
         if(val.pods['metricName']=='k8s_pod_network_transmit_bytes'){
          return "网络出流量 "+val.pods.targetAverageValue+'B/s'
          }
         if(val.pods['metricName']=='k8s_pod_network_receive_packets'){
          return "网络入包量 "+val.pods.targetAverageValue+'个'
          }
         if(val.pods['metricName']=='k8s_pod_network_transmit_packets'){
          return "网络出包量 "+val.pods.targetAverageValue+'个'
          }
      }
    }
  },
  components: {
    subTitle,
    tkeSearch,
    Loading
  }
};
</script>

<style lang="scss">
 .el-tooltip__popper{font-size: 14px; max-width:30% } /*设置显示隐藏部分内容，按50%显示*/
  .btn{
    display: inline-block;
    width: 52px;
    padding: 0px;
    border: none;
    margin-left: 6px;
    font-size: 12px;
    color:#409eff;
  }
  .btn2{
    color:#bbb !important;
    cursor:not-allowed;
  }
</style>

