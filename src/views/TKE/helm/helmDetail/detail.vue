<template>
    <div class="room">
        <div class="room-padding" v-if="this.Data&&this.info">
            <el-card >
                <h3>基本信息</h3>
                 <el-form  class="tke-form top"  label-position='left' label-width="120px" size="mini">
                    <el-form-item label="Helm名称">
                        <div class="tke-form-item_text">{{info.name}}</div>
                    </el-form-item>
                    <el-form-item label="所属命名空间">
                        <div class="tke-form-item_text">{{info.namespace}}</div>
                    </el-form-item>
                    <el-form-item label="Helm描述">
                        <div class="tke-form-item_text">{{Data.chart.metadata.description}}</div>
                    </el-form-item>
                    <el-form-item label="首次部署时间">
                        <div class="tke-form-item_text">{{info.info.first_deployed|creationTimestamps}}</div>
                    </el-form-item>
                    <el-form-item label="最后一次部署时间">
                        <div class="tke-form-item_text">{{info.info.last_deployed|creationTimestamps}}</div>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card class="top">
                <h3>资源列表</h3>
                 <el-table
                    style="width: 100%"
                    class="top"
                    :data="tableDate">
                    <el-table-column
                        prop="resource"
                        label="资源"
                        max-width="33%">
                        <template slot-scope="scope" >
                            <a style="cursor:pointer;" @click="getJump(scope.row)" v-if="scope.$index!=3">{{scope.row.resource}}</a>
                            <p v-if="scope.$index==3">{{scope.row.resource}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="type"
                        label="类型"
                        max-width="33%">
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        max-width="34%"
                        prop="yaml">
                        <template slot-scope="scope" >
                            <a style="cursor:pointer;" @click="getYaml(scope.row.yaml)">查看YAML</a>
                        </template>
                    </el-table-column>
                 </el-table>
            </el-card>
            <el-card class="top" v-show="see">
                <h3>自定义参数列表</h3>
                <div class="top">
                    <div class="background" ><p v-for="(item,index) in count" :key="index" style="color:white">{{index+1}}&nbsp{{item}}</p></div>
                </div>
            </el-card>
            <el-card class="top" v-if="info">
                <h3>资源状态</h3>
                <div  class="pose">
                    <span>自动刷新</span><el-switch v-model="flag" ></el-switch>
                </div>
                <div class="top">
                    <div class="background">
                        <pre style="color:white">
                            {{resources}}
                        </pre>
                    </div>
                </div>
            </el-card>
        </div>
        <el-dialog
            title="查看YAML"
            :visible.sync="centerDialogVisible"
            width="60%"
            >
            <div class="yaml">
                <codemirror style="background-color: #303133;"  ref="myCm"  :value="yamlInfo"  class="code" >
                </codemirror>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips"
import { POINT_REQUEST } from '@/constants'
import 'codemirror/lib/codemirror.css';
import { codemirror } from 'vue-codemirror'
  require("codemirror/mode/python/python.js")
  require('codemirror/addon/fold/foldcode.js')
  require('codemirror/addon/fold/foldgutter.js')
  require('codemirror/addon/fold/brace-fold.js')
  require('codemirror/addon/fold/xml-fold.js')
  require('codemirror/addon/fold/indent-fold.js')
  require('codemirror/addon/fold/markdown-fold.js')
  require('codemirror/addon/fold/comment-fold.js')
export default {
    name:'HelmDetails',
    data(){
        return{
            info:"",
            Data:"",
            raw:[],
            count:[],
            flag:false,
            tableDate:[],
            centerDialogVisible:false,
            yamlInfo:"",
            see:true,
            resources:'',
            timeId:null
        }
    },
    watch:{
        flag(val){
            if(val){
               this.timeId = setInterval(()=>{
                if(this.$route.path != "/helmDetail/detail"){
                    clearInterval(this.timeId)
                    this.timeId =null
                }   
                this.getHelmResources()
              },4000)
            } else {
                window.clearInterval(this.timeId)
                this.timeId=null
            }
        }
    },
    created(){
        this.getHelmDetail()
        this.getHelmList()
    },
    methods:{
        getYaml(row){
            console.log(row)
            this.centerDialogVisible = true
            this.yamlInfo = row
            
        },
        getJump(row){
            this.$router.push({
                name: 'colonyServiceSvc',
                query: {
                    clusterId:this.$route.query.clusterId
                }
            })
        },
        // 详情
        getHelmDetail(){
            const param = {
                ClusterName: this.$route.query.clusterId,
                Method: "GET",
                Path: "/apis/platform.tke/v1/clusters/"+this.$route.query.clusterId+"/helm/tiller/v2/releases/"+this.$route.query.helmName+"/status/json",
                Version: "2018-05-25"
            }
            this.axios.post(POINT_REQUEST, param).then(res => {
            // console.log(res)
            if (res.Response.Error == undefined) {
                this.info=JSON.parse(res.Response.ResponseBody)
                this.resources = JSON.parse(res.Response.ResponseBody).info.status.resources
                console.log(this.info)
            } else {
                let ErrTips = {};
                let ErrOr = Object.assign(ErrorTips, ErrTips);
                this.$message({
                    message: ErrOr[res.Response.Error.Code],
                    type: "error",
                    showClose: true,
                    duration: 0
                })
            }
            })
        },
        // 详情
        getHelmResources(){
            const param = {
                ClusterName: this.$route.query.clusterId,
                Method: "GET",
                Path: "/apis/platform.tke/v1/clusters/"+this.$route.query.clusterId+"/helm/tiller/v2/releases/"+this.$route.query.helmName+"/status/json",
                Version: "2018-05-25"
            }
            this.axios.post(POINT_REQUEST, param).then(res => {
            // console.log(res)
                if (res.Response.Error == undefined) {
                    this.resources = JSON.parse(res.Response.ResponseBody).info.status.resources
                } else {
                    let ErrTips = {};
                    let ErrOr = Object.assign(ErrorTips, ErrTips);
                    this.$message({
                        message: ErrOr[res.Response.Error.Code],
                        type: "error",
                        showClose: true,
                        duration: 0
                    })
                }
            })
        },
        // 详情2
        getHelmList(){
            const param = {
                ClusterName: this.$route.query.clusterId,
                Method: "GET",
                Path: "/apis/platform.tke/v1/clusters/"+this.$route.query.clusterId+"/helm/tiller/v2/releases/"+this.$route.query.helmName+"/content/json",
                Version: "2018-05-25"
            }
            this.axios.post(POINT_REQUEST, param).then(res => {
            // console.log(res)
            if (res.Response.Error == undefined) {
                this.Data=JSON.parse(res.Response.ResponseBody).release
                var conYaml = this.Data.manifest.split("#")
                this.tableDate.push( {
                    resource:this.Data.name+"-zookeeper-headless",
                    type:"Service",
                    yaml:conYaml[1]
                },
                {
                    resource:this.Data.name+"-zookeeper",
                    type:"Service",
                    yaml:conYaml[2]
                },
                {
                    resource:this.Data.name+"-zookeeper",
                    type:"StatefulSet",
                    yaml:conYaml[3]
                },
                {
                    resource:this.Data.name+"-zookeeper",
                    type:"PodDisruptionBudget",
                    yaml:conYaml[4]
                })
                this.raw =JSON.parse(res.Response.ResponseBody).release.config.raw
                console.log(this.raw)
                // 判断自定义参数列表是否存在
                if(this.raw  == undefined || this.raw ==""){
                    this.see =false
                }else{
                    this.see = true
                    let rawDetail = JSON.parse(this.raw)
                    console.log(rawDetail)
                     for(let key in rawDetail){
                        this.count.push("'"+key+"'"+":"+"'"+rawDetail[key]+"'")
                    }
                }
                console.log(this.tableDate)
                // console.log(this.count)
               
            } else {
                let ErrTips = {};
                let ErrOr = Object.assign(ErrorTips, ErrTips);
                this.$message({
                    message: ErrOr[res.Response.Error.Code],
                    type: "error",
                    showClose: true,
                    duration: 0
                })
            }
            })
        },
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
        },
        components: {
            codemirror
        },
}
</script>
<style lang="scss" scoped>
.room-padding{
    padding:20px;
}
.top{
    margin-top:20px;
    position:relative;
}
.background{
    background-color:#272822;
    padding:10px;
    width:100%;
    height:auto;
}
.pose{
    position:absolute;
    right:20px;
    top:20px;
}
.yaml{
    width:100%;
    background:#303133;
}
</style>