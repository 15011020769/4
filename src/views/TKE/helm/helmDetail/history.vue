<template>
    <div style="padding:20px;">
        <el-table
            :data="tableData"
            style="width: 100%"
            v-loading="loadShow">
            <el-table-column
                prop="release"
                label="应用名">
                 <template slot-scope="scope">
                    {{scope.row.release.name}}
                </template>
            </el-table-column>
            <el-table-column
                prop="release"
                label="部署详情">
                <template slot-scope="scope">
                    {{scope.row.release.chart.metadata.name}}@{{scope.row.release.chart.metadata.version}}
                </template>
            </el-table-column>
            <el-table-column
                label="描述">
            </el-table-column> 
            <el-table-column
                label="状态">
            </el-table-column>
            <el-table-column
                prop="release"
                label="版本号">
                <template slot-scope="scope">
                    {{scope.row.release.version}}
                </template>
            </el-table-column>
            <el-table-column
                prop="release"
                label="部署时间">
                 <template slot-scope="scope">
                    {{scope.row.release.info.first_deployed|creationTimestamps}}
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                label="操作">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips"
import { POINT_REQUEST } from '@/constants'
    export default {
      data() {
        return {
          tableData:[],
          loadShow:true
        }
      },
      created(){
        // this.getHelmDetail()
        this.getHelmList()
    },
      methods:{
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
                this.tableData.push(JSON.parse(res.Response.ResponseBody))
                // console.log(this.tableData)
                this.loadShow=false
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