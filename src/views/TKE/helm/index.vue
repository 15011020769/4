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
            <el-table-column label="状态" max-width="10%"></el-table-column>
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
        <el-button @click="centerDialogVisible = false">取 消</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-if="this.flagAgin == 2">
        <el-button type="primary" @click="openContect()">确 定</el-button>
        <el-button @click="centerDialogVisible = false">取 消</el-button>
      </span>
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
      cities: [],
      selectedRegion: '',
      selectedCity: '',
      select: '',
      options:[],
      value:'',
      flag:false,
      flagSE:true,
      flagAgin:"",
      flagLast:false,
      loadShow:true,
      centerDialogVisible:false,
      centerDialogVisible2:false,
      centerDialogVisible3:false,
      ruleForm:{
          name:'',
          chart:'',
          address:'',
          nameTwo:'',
          pass:''
      },
      domains: [],
      isCollapse:true
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
          if( time > 4 || this.status== "running"  || this.$route.path!='/helm'){
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
          this.value = res.Response.Clusters[0].ClusterId
          // this.getHelmList()
          this.getFlag()
          console.log(this.value)
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
            console.log(this.tableData)
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
      } else {
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
            // this.getColony()
            //this.Data=JSON.parse(res.Response.ResponseBody).release
            // // this.raw =JSON.parse(res.Response.ResponseBody).release.config.raw
            // // let rawDetail = JSON.parse(this.raw)
            // console.log(res)
            // this.getFlag()
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
          console.log(JSON.parse(res.Response.ResponseBody))
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
    setCusId(){
      this.flagSE = true
      // this.flagAgin = 1
      this.flagAgin = ""
      this.loadShow = true
      this.tableData=[]
      this.getFlag()
      console.log(this.value) 
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
    // button {
    //   height: 30px;
    //   padding: 0 20px;
    //   background-color: #006eff;
    //   color: #fff;
    //   border: 1px solid #006eff;
    //   line-height: 30px;
    //   text-align: center;
    //   outline: 0 none;
    //   box-sizing: border-box;
    //   text-decoration: none;
    //   font-size: 12px;
    // }
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
}
</style>
