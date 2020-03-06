<template>
  <div class="helm-wrap">
    <HeadCom title="Helm应用">
      <slot>
        <div class="head-address">
          <City :Cityvalue.sync="selectedRegion" :cities="cities" class="city" @changeCity="changeCity"></City>
          <div class="head-cluster">
            <span style="font-size:12px;">集群</span>
            <el-select v-model="value" slot="prepend" placeholder="请选择" size="mini" style="width:100px" @change="setCusId()">
              <el-option v-for="item in options"
                        :key="item.ClusterId"
                        :label="item.ClusterName"
                        :value="item.ClusterId">
              </el-option>
            </el-select>
          </div>
        </div>
      </slot>
    </HeadCom>
    <div class="wrap">
      <div class="wrap-bnt">
        <el-button type="primary" size="mini" @click="jump()" :disabled="flagSE">新建</el-button>
      </div>
       <div class="room-center" v-show="flagSE">
         <div class="explain" v-show="flagAgin == 1 ? true:false">
            <p>该集群暂未开通Helm应用，开通需在集群内安装Helm tiller组件，需要占用一定资源，如需使用请<a @click="centerDialogVisible3 = true" style="cursor:pointer">申请开通</a></p>
          </div>
          <div class="explain" v-show="flagAgin == 2 ? true:false">
            <p>开通失败，请确认集群保留足够的空闲资源，并<a @click="centerDialogVisible3 = true" style="cursor:pointer">重新开通</a></p>
          </div>
          <div class="explain" v-show="flagAgin == 3 ? true:false">
            <p> 正在校验Helm应用管理功能<i class="el-icon-loading"></i></p>
          </div>
      </div>
      <div class="room-center" v-show="getflags">
         <div class="explain-o">
            <p>正在创建新的Helm应用<i class="el-icon-loading"></i><a style="cursor:pointer" @click="centerDialogVisible4 = true">查看详情</a></p>
          </div>
      </div>
      <div class="helm-table">
        <template>
          <el-table :data="tableData" style="width: 100%" height="450" v-loading="loadShow">
            <el-table-column label="应用名" max-width="10%" prop="name">
                <template slot-scope="scope">
                      <div @click="jumpDetail(scope.row)">
                         <a style="cursor:pointer;">{{scope.row.name}}</a>
                      </div>
                </template>
            </el-table-column>
            <el-table-column label="状态" max-width="10%" prop="info">
              <template slot-scope="scope">
                 <div>{{scope.row.info.status.code|codes}}</div>
               </template>
            </el-table-column>
            <el-table-column label="版本号" max-width="15%" prop="version">
               <template slot-scope="scope">
                 <div>{{scope.row.version}}</div>
               </template>
            </el-table-column>
            <el-table-column label="创建时间" max-width="15%" prop="info"> 
              <template slot-scope="scope">
                 <div class="point-white">{{scope.row.info.first_deployed|creationTimestamps}}</div>
               </template>
            </el-table-column>
            <el-table-column label="Chart仓库" max-width="15%" prop="chart_metadata">
              <template slot-scope="scope">
                 <div>{{scope.row.chart_metadata.repo}}</div>
               </template>
            </el-table-column>
            <el-table-column label="Chart命名空间" max-width="15%"></el-table-column>
            <el-table-column label="Chart版本" max-width="10%" prop="chart_metadata">
              <template slot-scope="scope">
                 <div>{{scope.row.chart_metadata.version}}</div>
               </template>
            </el-table-column>
            <el-table-column label="操作" max-width="10%">
               <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">更新应用</el-button>
                <el-button @click="handleDelete(scope.row)"  type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </div>
    <!-- 更新helm应用弹窗 -->
    <el-dialog
      title="更新Helm应用"
      :visible.sync="centerDialogVisible"
      width="45%">
      <div>
        <div class="explain" style="margin-bottom:20px;">
          <p>注意，若您重新填写了任意变量，将覆盖应用下所有自定义变量。不填写变量时，将会使用上次填写的变量更新应用。
          </p>
        </div>
        <el-form  class="tke-form m0" :model="ruleForm" ref="ruleForm" label-position='left' label-width="100px" size="mini">
            <el-form-item label="应用名">
                {{ruleForm.name}}
            </el-form-item>
            <el-form-item label="Chart名称">
                {{ruleForm.chart}}
            </el-form-item>
             <el-form-item label="Chart_Url">
                <el-input class="w200" v-model="ruleForm.address" placeholder="请输入Chart_Url"></el-input>
                <p>最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</p>
            </el-form-item>
            <el-form-item label="类型">
              <el-radio-group v-model="isCollapse"  size="mini">
                  <el-radio-button :label="true" >公有</el-radio-button>
                  <el-radio-button :label="false">私有</el-radio-button>
                </el-radio-group>
                 <div v-show="!isCollapse" class="user-room">
                    <!-- <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="60px" class="demo-ruleForm"> -->
                        <el-form-item label="用户名" prop="name" class="margin-length">
                            <el-input type="text" v-model="ruleForm.nameTwo" size="mini" style="width:180px;"></el-input>
                        </el-form-item>
                          <el-form-item label="密码" prop="pass" class="margin-length">
                            <el-input type="password" v-model="ruleForm.pass" size="mini" style="width:180px;"></el-input>
                        </el-form-item>
                    <!-- </el-form> -->
                  </div>
            </el-form-item>
            <el-form-item label="Key-Value">
                <div style="width:450px;">
                  <div class="form-input"
                  v-for="(domain, index) in domains"
                  :key="domain.key"
                  :prop="'domains.' + index + '.value'">
                      <el-input v-model="domain.value" size="mini" placeholder="变量名"></el-input>
                      <span>=</span>
                      <el-input v-model="domain.valueKey" size="mini" placeholder="变量值"></el-input>
                        <el-tooltip class="item" effect="dark" content="删除" placement="right">
                          <i class="el-icon-close" @click.prevent="removeDomain(domain)"></i>
                      </el-tooltip>
                  </div>
                </div>
                <p v-show="domains.length?true:false" class="form-p">可通过设置自定义参数替换Chart包的默认配置，如：image.repository = nginx</p>
                <el-link type="primary" style="cursor: pointer;"  @click="addDomain" :disabled="flag">新增变量</el-link>
            </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="getUpdate()">确 定</el-button>
        <el-button @click="centerDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog
      :title="'您确定要删除吗'+ruleForm.name"
      :visible.sync="centerDialogVisible2"
      width="40%">
      <span>删除应用将删除该应用创建的所有K8S资源，删除后所有数据将被清除且不可恢复,请提前备份数据。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="deleteRow()">确 定</el-button>
        <el-button @click="centerDialogVisible2 = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 重新开通弹窗 -->
    <el-dialog
      title="集群Helm应用管理功能"
      :visible.sync="centerDialogVisible3"
      width="40%"
      center>
      <div>
        <p>新建Helm应用需要先开通Helm应用，当前所选集群暂未开通。</p>
        <p>开通Helm应用功能：</p>
        <p>1.将在集群内安装Helm tiller组件</p>
        <p>2.将占用集群<span style="color: #ff9d00"> 0.28核 CPU 180Mi 内存</span> 的资源</p>
      </div>
      <span slot="footer" class="dialog-footer" v-if="this.flagAgin == 1">
        <el-button type="primary" @click="ApplyOpen()">确 定</el-button>
        <el-button @click="centerDialogVisible3 = false">取 消</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-if="this.flagAgin == 2">
        <el-button type="primary" @click="openContect()">确 定</el-button>
        <el-button @click="centerDialogVisible3 = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="Helm应用安装日志"
      :visible.sync="centerDialogVisible4"
      width="60%">
      <div style="width:100%;height:400px;">
        <div style="width:40%;height:400px;float:left;">
          <el-table
            ref="newData"
            :data="newData"
            tooltip-effect="dark"
            style="width: 100%"
             @select="selected"
             @select-all="selectAll">
            <el-table-column
              type="selection">
            </el-table-column>
            <el-table-column
              label="Helm名称"
              prop="name">
              <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
            </el-table-column>
            <el-table-column  label="状态" prop="status">
              <!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作">
              <template slot-scope="scope">
                <el-button @click="deleteStatus(scope)" type="text" size="small">取消安装</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="width:60%;height:400px;background:black;float:left;color:white;">
          {{tableError}}
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import HeadCom from '@/components/public/Head'
import { ErrorTips } from "@/components/ErrorTips";
import City from '@/components/public/CITY'
import {
  ALL_CITY,TKE_COLONY_LIST,TKE_DELETE_POLICIES,POINT_REQUEST
} from '@/constants'
export default {
  name: 'helm',
  components: {
    HeadCom,
    City
  },
  data () {
    return {
      tableData: [],
      newData:[],
      cities: [],
      selectedRegion: '',
      selectedCity: '',
      select: '',
      options:[],
      value:'',
      getflags:false,
      flag:false,
      flagSE:true,
      flagAgin:"",
      flagLast:false,
      loadShow:true,
      centerDialogVisible:false,
      centerDialogVisible2:false,
      centerDialogVisible3:false,
      centerDialogVisible4:false,
      ruleForm:{
          name:'',
          chart:'',
          address:'',
          nameTwo:'',
          pass:''
      },
      domains: [],
      isCollapse:true,
      timeIds:null,
      openData:"",//是否开通数据
      number:1,
      numdel:1,
      tableError:""
    }
  },
  created () {
    this.GetCity()
    this.getColony()
  },
  watch:{
    domains:{
      handler(news,old){
        for(var i in news){
          if(news[i].value == "" || news[i].valueKey == "" && news.length != 0 ){
              this.flag = true
          } else if(news.length == 0){
              this.flag = false
          } else {
              this.flag = false
          }
        }
      },
      immediate: true,
      deep: true
    },
    // openData 监听数据变化
    openData:{
        handler:function(data){
          var arr = Object.keys(data)
          if(arr.length){
          // console.log(JSON.parse(data))
          // for(let key in JSON.parse(data)){
          //      console.log(key)
          // }
          for(let key in data){
            if(data[key]  == 0){
              // 插入newData数据
              if(this.number == 1){
                this.newData.push({
                  name:key,
                  status:"创建中",
                })
              }
              clearInterval(this.timeIds)
                this.timeIds = setInterval(()=>{
                    this.getflags= true
                    this.$store.commit("getFlag",this.getflags);
                    //  if(this.newData.length>1){
                    //     this.number = 1
                    //     // clearInterval(this.timeIds)
                    //     this.newData.splice(this.newData.length-1,1)
                    //     this.getCreate()
                    //     return
                    //  }
                    if(this.$route.path != "/helm" || data[key] == undefined){
                        clearInterval(this.timeIds)
                        this.timeIds = null
                        this.getflags = false
                        this.$store.commit("getFlag",this.getflags);
                        return
                    } 
                  this.getCreate()
                  console.log(data[key])
                  // if(this.newData.length>0){
                  //   this.newData.splice(this.newData.length,1)
                  // }
                  this.number++
                  // this.numdel = 1
                },2000)
              } else if(data[key] == 1){
                this.number = 1
                // let news = JSON.parse(JSON.stringify(this.newData))
                
                console.log(arr)
                console.log(this.newData.length)
                if(arr.length != this.newData.length){
                  this.newData.push({
                        name:key,
                        status:"失败",
                  })
                }
                if(arr.length == this.newData.length){
                  this.newData = this.newData.filter(item=>{
                    if(item.status == "失败"){
                          return item
                    }
                  })
                }
                // for(let i in newData){
                //   if(this.newData.length>0&&newData[i].status == "创建中"){
                //     this.newData.splice(this.newData.length-1,1)
                //   }
                // }
                // if(this.newData.length>0){
                //   this.newData.splice(this.newData.length-1,1)
                // }
               
                // this.newData = this.newData.map(item=>{
                //   if(item.status == "失败"){
                //     return item
                //   }
                // })
                this.numdel++
                this.getflags = true
                this.$store.commit("getFlag",this.getflags)
                clearInterval(this.timeIds)
              } else {
                this.number = 1
                 this.newData = this.newData.filter(item=>{
                  if(item.status == "失败"){
                        return item
                  }
                })
                this.getflags = false
                this.$store.commit("getFlag",this.getflags)
                clearInterval(this.timeIds)
                this.timeIds = null
              }
            }
          } else {
            this.newData = []
          }
        },
        deep:true,
        immediate :true
    },
    newData(value){
      console.log(value)
      if(value.length == 0){
          console.log(value,3234)
          this.getflags = false
          this.$store.commit("getFlag",this.getflags);
      }
    }
  },
  methods: {
    handleClick(row){
      this.centerDialogVisible = true
      this.ruleForm.name = row.name
      this.ruleForm.chart = row.chart_metadata.name 
    },
    handleDelete(row){
      this.centerDialogVisible2 = true
      this.ruleForm.name = row.name
    },
    selected(selection, row){
      console.log(selection[0].name)
         if (selection.length > 1) {
          let del_row = selection.shift();
          this.$refs.newData.toggleRowSelection(del_row, false); // 用于多选表格，切换某一行的选中状态，如果使用
        }
        this.getError(selection[0].name)
    },
    selectAll(selection) {
        // console.log('当用户手动勾选全选 Checkbox 时触发的事件', selection)
        // 选择项大于2时
        if (selection.length > 1) {
            selection.length = 1;
        }
        this.getError(selection[0].name)
    },
    getUpdate(){
      this.loadShow = true
      this.setHelm()
      
      this.centerDialogVisible = false
    },
    // 移除新增变量
    removeDomain (item) {
      var index = this.domains.indexOf(item)
      if (index !== -1) {
        this.domains.splice(index, 1)
      }
      if(this.domains.length == 0){
        this.flag = false
      }
    },
    // 添加新增变量
    addDomain () {
      this.domains.push({
        value: '',
        valueKey: '',
      })
    },
    setCusId(){
      this.flagSE = true
      // this.flagAgin = 1
      this.flagAgin = ""
      this.loadShow = true
      this.tableData=[]
      this.getCreate()
      this.getFlag()
      this.$router.push({
          name: 'helm',
          query: {
            clusterId:this.value
          }
      })
      console.log(this.value) 
    },
    // 申请开通
    ApplyOpen(){
        console.log(2)
        this.centerDialogVisible3 = false
        this.flagAgin = 3
        this.getPost()
        var timeId = setInterval(()=>{
          if(this.status != "running"){
              this.getFlag(timeId)
              if(this.status== "running" || this.status== "failed"){
                  this.getHelmList()
                  clearInterval(timeId)
              }
          }
        },4000)
    },
    // 重新开通
    openContect(){
      console.log(3)
      this.centerDialogVisible3 = false
      var time = 0
      this.flagAgin = 3
      if(this.status != "running"){
        var timeId = setInterval(()=>{
          this.getFlag(timeId)
          time ++
          if( time > 4 || this.status== "running" || this.status== "failed" || this.$route.path!='/helm'){
            this.getHelmList()
            clearInterval(timeId)
            // this.flagAgin = 2
          }
        },4000)
      }
    },
    getColony () { // 获取集群数据
      const param = {
        Version: "2018-05-25"
      }
      this.axios.post(TKE_COLONY_LIST, param).then(res => {
        if (res.Error == undefined) {
          // console.log(res)
          this.options = res.Response.Clusters
          console.log(this.$route.query.clusterId)
          if(this.$route.query.clusterId || this.$route.query.clusterId!=undefined){
            this.value = this.$route.query.clusterId
          } else {
            this.value = res.Response.Clusters[0].ClusterId
          }
          // this.getHelmList()
          this.getCreate()
          this.getFlag()
        } else {
          this.$message({
              message: ErrorTips[res.codeDesc],
              type: "error",
              showClose: true,
              duration: 0
          })
        }
      })
    },
    // Helm列表
    getHelmList(){
        const param = {
          ClusterName: this.value,
          Method: "GET",
          Path: "/apis/platform.tke/v1/clusters/"+this.value+"/helm/tiller/v2/releases/json?status_codes=DEPLOYED&&status_codes=FAILED&&status_codes=DELETING&&status_codes=DELETED&&status_codes=UNKNOWN&&sort_by=LAST_RELEASED&&sort_order=DESC&&limit=10",
          Version: "2018-05-25"
        }
        this.axios.post(POINT_REQUEST, param).then(res => {
          // console.log(res)
          if (res.Response.Error == undefined) {
            this.tableData=JSON.parse(res.Response.ResponseBody).releases
            this.loadShow = false
            this.flagSE = false
            // clearInterval(timeId)
            // this.flag = false
            console.log(this.tableData,999)
          } else {
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
                message: ErrOr[res.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0
            })
            this.tableData=[]
            this.loadShow = false
          }
        })
    },
    // 判断是否开通
    getFlag(timeId){
      this.tableData=[]
        const param = {
         ClusterName: this.value,
         Method: "GET",
         Path: "/apis/platform.tke/v1/helms?fieldSelector=spec.clusterName="+this.value,
         Version: "2018-05-25"
        }
        this.axios.post(POINT_REQUEST, param).then(res => {
          // console.log(res)
          if (res.Response.Error == undefined) {
            console.log(JSON.parse(res.Response.ResponseBody))
            if(JSON.parse(res.Response.ResponseBody).items.length){
                this.status = JSON.parse(res.Response.ResponseBody).items[0].status.phase
                 if(this.status == "running"){
                    clearInterval(timeId)
                    this.getHelmList()
                  } else if(this.status == "checking"){
                    this.flagAgin = 3
                  } else {
                    this.flagAgin = 2
                    this.loadShow = false
                  }
            } else {
              this.flagAgin = 1
              this.status =""
              this.loadShow = false
              this.tableData=[]
            }
          } else {
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
                message: ErrOr[res.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0
            })
            this.tableData=[]
            this.loadShow = false
          }
        })
    },
    // 修改helm
    setHelm(){
      let nmAll = this.domains.map(item=>{
        return item.value+"="+item.valueKey
      })
      if(this.domains.length > 0 && this.ruleForm.nameTwo=="" && this.ruleForm.pass==""){
         var RequestBodyAll = {"chart_url":this.ruleForm.address,"values":{"raw_original":nmAll.join(','),"values_type":"kv"}}
      }else if(this.domains.length > 0 && this.ruleForm.nameTwo && this.ruleForm.pass){
         var RequestBodyAll = {"chart_url":this.ruleForm.address,"username":this.ruleForm.nameTwo,"password":this.ruleForm.pass,"values":{"raw_original":nmAll.join(','),"values_type":"kv"}}
      }else if(this.domains.length == 0 && this.ruleForm.nameTwo && this.ruleForm.pass){
         var RequestBodyAll = {"chart_url":this.ruleForm.address,"username":this.ruleForm.nameTwo,"password":this.ruleForm.pass}
      }else {
        var RequestBodyAll = {"chart_url":this.ruleForm.address}
      }
      const param = {
          ClusterName: this.value,
          Method: "PUT",
          Path: "/apis/platform.tke/v1/clusters/"+this.value+"/helm/tiller/v2/releases/"+this.ruleForm.name+"/json",
          RequestBody: RequestBodyAll,
          Version: "2018-05-25"
      }
      this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error == undefined) {
            this.getColony()
            // this.Data=JSON.parse(res.Response.ResponseBody).release
            // this.raw =JSON.parse(res.Response.ResponseBody).release.config.raw
            // let rawDetail = JSON.parse(this.raw)
            console.log(res)
          } else {
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
                message: ErrOr[res.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0,
            })
            this.loadShow = false
          }
        })
    },
    // 申请开通
    getPost(){
      const param = {
          ClusterName: this.value,
          Method: "POST",
          Path: "/apis/platform.tke/v1/helms",
          RequestBody: {"kind":"Helm","apiVersion":"platform.tke/v1","metadata":{"generateName":"hm"},"spec":{"clusterName": this.value}},
          Version: "2018-05-25"
      }
      this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error == undefined) {
            console.log(JSON.parse(res.Response.ResponseBody))
            this.flagAgin = 3
            this.tableData=[]
          } else {
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
                message: ErrOr[res.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0,
            })
            this.loadShow = false
          }
        })
    },
    // 删除单行
    deleteRow(){
      this.centerDialogVisible2 = false
      const param = {
          ClusterName: this.value,
          Method: "DELETE",
          Path: "/apis/platform.tke/v1/clusters/"+this.value+"/helm/tiller/v2/releases/"+this.ruleForm.name+"/json?purge=true",
          Version: "2018-05-25"
      }
      this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error == undefined) {
          // console.log(JSON.parse(res.Response.ResponseBody))
          this.loadShow = true
          this.getFlag()
          } else {
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
                message: ErrOr[res.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0,
            })
            this.loadShow = false
          }
        })
    },
    // 取消安装
    deleteStatus(scope){
      this.centerDialogVisible2 = false
      const param = {
          ClusterName: this.value,
          Method: "DELETE",
          Path: "/apis/platform.tke/v1/clusters/"+this.value+"/helm/tiller/v2/releases/installing/"+scope.row.name+"/json",
          Version: "2018-05-25"
      }
      this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error == undefined) {
            this.newData.splice(scope.$index,1)
            if(this.newData.length == 0){
                this.getflags = false
                this.$store.commit("getFlag",this.getflags);
            }
            console.log(this.newData.length)
          } else {
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
                message: ErrOr[res.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0,
            })
            this.loadShow = false
          }
        })
    },
    // 是否创建成功
    getCreate(){
      const param = {
          ClusterName: this.value,
          Method: "GET",
          Path: "/apis/platform.tke/v1/clusters/"+this.value+"/helm/tiller/v2/releases/installing/json",
          Version: "2018-05-25"
      }
      this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error == undefined) {
          this.openData = JSON.parse(res.Response.ResponseBody)
          console.log(this.openData)
         
          this.getflags = this.$store.state.flag
          // var arr = Object.keys(openData)
          if(this.newData.length == 0){
              this.getflags = false
              this.$store.commit("getFlag",this.getflags);
          }
          console.log(this.$store.state.flag,45)
          console.log(JSON.parse(res.Response.ResponseBody),99999)
        } else {
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
                message: ErrOr[res.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0,
            })
            this.loadShow = false
            this.getflags = false
            this.$store.commit("getFlag",this.getflags);
          }
        })
    },
    getError(name){
      const param = {
          ClusterName: "cls-nlj8k7wm",
          Method: "GET",
          Path: "/apis/platform.tke/v1/clusters/"+this.$route.query.clusterId+"/helm/tiller/v2/releases/installing/"+name+"/content/json",
          Version: "2018-05-25"
      }
      this.axios.post(POINT_REQUEST, param).then(res => {
             if (res.Response.Error == undefined) {
               console.log(res)
               this.tableError=JSON.parse(res.Response.ResponseBody).message
             }
             else{
                let ErrTips = {};
                let ErrOr = Object.assign(ErrorTips, ErrTips);
                this.$message({
                    message: ErrOr[res.Response.Error.Code],
                    type: "error",
                    showClose: true,
                    duration: 0,
                })
             }
          })
        },
    GetCity () {
      this.axios.get(ALL_CITY).then(data => {
        console.log(data.data)
        this.cities = data.data
        this.selectedRegion = data.data[0].Region
        this.selectedCity = data.data[0]
        this.$cookie.set('regionv2', this.selectedCity.Region)
      })
    },
    changeCity (city) {
      this.selectedCity = city
      this.$cookie.set('regionv2', city.Region)
      // this.GetTabularData()
    },
    jump () {
      this.$router.push({
        name: 'helmCreate',
        query: {
          clusterId:this.value
        }
      })
    },
    jumpDetail(row){
      this.$router.push({
        name: 'helmDetailDetail',
        query: {
          clusterId:this.value,
          helmName:row.name
        }
      })
    }
  },
  filters:{
    codes:function(value){
        if(value == "DEPLOYED"){
            return "正常"
        } else if (value == "DELETED"){
            return "已删除"
        } else if (value == "DELETING"){
            return "正在删除"
        } else if (value == "SUPERSEDED"){
            return "已废弃"
        } else if (value == "FAILED"){
            return "异常"
        } else if (value == "UNHEALTHY"){
            return "异常"
        } else {
            return "-"
        }
    },
   creationTimestamps:function(value){
        var d = new Date(value);
        var n = d.getFullYear();
        var y = d.getMonth() + 1;
        var r = d.getDate();
        var h = d.getHours(); //12
        var m = d.getMinutes(); //12
        var s = d.getSeconds();
        h < 10 ? h = "0" + h : h;
        m < 10 ? m = "0" + m : m
        return n + '-' + y + '-' + r + ' ' + h + ':' + m + ':' + s
      }
  }

}
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  .wrap-bnt {
    width: 100%;
    padding: 20px 0 20px 20px;
    box-sizing: border-box;
  }
  .helm-titleWrap {
    width: 100%;
    padding: 0px 20px 20px 20px;
    box-sizing: border-box;
    .helm-titleBox {
      color: #c07400;
      padding: 10px 30px 10px 20px;
      border: 1px solid #ffd18b;
      border-radius: 2px;
      background: #fff4e3;
      box-sizing: border-box;
    }
  }
  .helm-table {
    width: 100%;
    padding: 0px 20px 0 20px;
    box-sizing: border-box;
  }
}
.head-address{
  margin-top:10px;
  margin-left:20px;
  width: 250px;
  display: flex;
  justify-content: space-between;
  .head-cluster{
    display: flex;
    justify-content: space-between;
    width: 140px;
  }
}
.explain {
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    p {
        font-size: 11px;
        line-height: 18px;
    }
}
.form-input{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top:10px;
    span{
        margin:0 10px;
    }
    i{
        margin:0 10px;
        cursor: pointer;
    }
}
.form-p{
    margin-bottom: 10px;
    font-size: 12px;
    color: #888;

}
.user-room{
        margin-top:20px;
        height:140px;
        width: 280px;
        background: #f2f2f2;
}
.margin-length{
  padding:10px 0;
}
.room-center {
  // margin-top: 20px;
  padding:0px 20px 20px 20px;
  .explain {
    // padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #ffd18b;
    background:  #fff4e3;
    p {
      width:100%;
      font-size: 11px;
      line-height: 18px;
    }
  }
  .explain-o{
    vertical-align: middle;
    color: #003b80;
    border:1px solid #97c7ff;
    background:  #e5f0ff;
    p {
      padding:10px;
      width:100%;
      font-size: 11px;
      line-height: 18px;
    }
  }
}

</style>
