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
            label="触发策略"
            >
            <template slot-scope="scope">
                <span>cpu使用量：{{scope.row.spec.metrics[0].pods.targetAverageValue}}核</span>
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
            >
            <template slot-scope="scope">
              <span class="tke-text-link">修改配置</span>
              <span class="tke-text-link ml10">编辑YAML</span>
              <span class="tke-text-link ml10">删除</span>
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
  </div>
</template>

<script>
import subTitle from "@/views/TKE/components/subTitle";
import tkeSearch from "@/views/TKE/components/tkeSearch";
import Loading from "@/components/public/Loading";
import { ALL_CITY,TKE_COLONY_QUERY } from "@/constants";
export default {
  name: "colonyResourceCronJob",
  data() {
    return {
      loadShow: false, //加载是否显示
      list:[
        // {
        //   status:false
        // },
        // {
        //   status:true
        // }
      ], //列表
      total:0,
      pageSize:10,
      pageIndex:1,
      multipleSelection: [],
      
      //搜索下拉框
      searchOptions: [],
      searchType: "default", //下拉选中的值
      searchInput: "", //输入的搜索关键字
    };
  },
 
  created() {
    // 从路由获取集群id
    this.clusterId=this.$route.query.clusterId;
    this.tableListData();
    this.nameSpaceList();
  },
  methods: {

    //列表数据展示
    tableListData(){
      var params={
        ClusterName:this.clusterId,
        Method: "GET",
        Path: "/apis/autoscaling/v2beta1/namespaces/"+this.searchType+"/horizontalpodautoscalers?fieldSelector=metadata.name="+this.searchInput,
        Version: "2018-05-25",
      }
      console.log(params)

      this.axios.post(TKE_COLONY_QUERY,params).then(res=>{

        if (res.Response.Error==undefined) {
              var data = JSON.parse(res.Response.ResponseBody);
             console.log(data)
             this.list = data.items;
              
       }
        
      })
    },
     //命名空间选项 
      nameSpaceList() {
        if (this.clusterId) {
          var params = {
            ClusterName: this.clusterId,
            Method: "GET",
            Path: "/api/v1/namespaces",
            Version: "2018-05-25",
          };
          // console.log(params)
          this.axios.post(TKE_COLONY_QUERY, params).then(res => {
            if (res.Response.Error==undefined) {
              var data = JSON.parse(res.Response.ResponseBody);
              var nameList=[];
              console.log(data.items)
              data.items.forEach(item => {
                nameList.push({value:item.metadata.name,label:item.metadata.name})
              })
              this.searchOptions=nameList
              this.searchType=nameList[0].value
              console.log(this.searchType)
            }
          })
        }
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
    goHpaDetail(){
      this.$router.push({
          name: "hpaDetail",
          query: {
            clusterId: this.clusterId
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
    //刷新数据
    refreshList(){
      console.log('refreshList....')
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
      this.pageSize=val;
      // this.getColonyList();
    },

  },
  components: {
    subTitle,
    tkeSearch,
    Loading
  }
};
</script>

<style lang="scss" scoped>
 
</style>

