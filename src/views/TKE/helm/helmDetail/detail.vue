<template>
    <div class="room">
        <div class="room-padding">
            <el-card>
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
                    class="top">
                    <el-table-column
                        prop="date"
                        label="资源"
                        max-width="33%">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="类型"
                        max-width="33%">
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="操作"
                        max-width="34%">
                        <div>查看YAML</div>
                    </el-table-column>
                 </el-table>
            </el-card>
            <el-card class="top">
                <h3>自定义参数列表</h3>
                <div class="top">
                    <div class="background" ><p v-for="(item,index) in count" :key="index" style="color:white">{{index+1}}&nbsp{{item}}</p></div>
                </div>
            </el-card>
            <el-card class="top">
                <h3>资源状态</h3>
                <el-switch v-model="flag" class="pose"></el-switch>
                <div class="top">
                    <div class="background">
                        <div style="color:white">
                            {{info.info.status.resources}}
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips"
import { POINT_REQUEST } from '@/constants'
export default {
    name:'HelmDetails',
    data(){
        return{
            info:"",
            Data:"",
            raw:[],
            count:[],
            flag:true
        }
    },
    created(){
        this.getHelmDetail()
        this.getHelmList()
    },
    methods:{
        // 详情1
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
                console.log(this.info)
                // console.log(res)
                // this.options = res.Response.Clusters
                // this.value = res.Response.Clusters[0].ClusterId
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
                this.raw =JSON.parse(res.Response.ResponseBody).release.config.raw
                let rawDetail = JSON.parse(this.raw)
                // console.log(rawDetail)
                for(let key in rawDetail){
                    this.count.push("'"+key+"'"+":"+"'"+rawDetail[key]+"'")
                }
                // console.log(this.count)
                console.log(this.Data)
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
        }
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
</style>