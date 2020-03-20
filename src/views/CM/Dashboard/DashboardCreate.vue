<template>
    <div class="room">
        <h2>创建监控图表</h2>
        <div class="top">
            <div class="top-one">
                <span>产品类型</span>
                <Type v-on:PassData="PassData" :projectId='projectId' :searchParam='searchParam' :productValue='productValue' ></Type>
            </div>
            <div class="top-two">
                <span>数据视图</span>
                <div class="top-two-see">明细试图</div>
            </div>
        </div>
        <h3 style="margin-bottom:20px">配置监控图表</h3>
        <div class="footer">
            <div class="footer-left">
                <div class="footer-left-left">
                    <h4>图标配置</h4>
                    <div style="margin-top:30px">
                        <p style="margin-bottom:10px">图表名称</p>
                        <el-input size="mini" v-model="picName"></el-input>
                    </div>
                     <div style="margin-top:30px">
                        <p style="margin-bottom:10px">监控指标</p>
                          <el-select v-model="target" placeholder="请选择" size="mini" @change="getTarget">
                            <el-option
                            v-for="item in optionTarget"
                            :key="item.value"
                            :label="item.label"
                            :value="item"
                            >
                            </el-option>
                         </el-select>
                    </div>
                </div>
                <div class="footer-left-right">
                   <h2>{{picName}}</h2>
                   <div>
                       
                   </div>
                </div>
            </div>
            <div class="footer-right">
                <div class="Cam-right">
                    <CamTransferCpt style="width:100%" 
                    :productData='productListData'
                    v-on:projectId="projectIds"
                    v-on:searchParam="searchParams"
                    v-on:multipleSelection="selectDatas"
                    :isShowRight="flag"
                    ></CamTransferCpt>
                </div>
            </div>
        </div>
        <div class="bottom">
             <el-button type="primary" size='mini'>确定</el-button>
             <el-button size='mini' @click="jump">取消</el-button>
        </div>
    </div>
</template>
<script>
import Type from '@/views/CM/CM_assembly/product_type'
import CamTransferCpt from '@/views/CM/CM_assembly/CamTransferCpt'
import {CREATDASHBORD,All_MONITOR} from '@/constants'
export default {
    name:"DashboardCreate",
    components:{
        Type,
        CamTransferCpt
    },
    created(){
        this.getMonitorList()
    },
    data(){
        return{
            projectId:0,
            searchParam: {},
            productValue: 'cvm_device',
            optionTarget:[], // 监控指标
            target:"", // 指标
            picName:"",
            productData:[],
            productListData:{},
            flag:false
        }
    },
    methods:{
        PassData(data) {
            this.productListData = data
            setTimeout(() => {
                this.productListData = {};
                // this.isShow = true;
            }, 500);
            setTimeout(() => {
                this.productListData = data;
                // this.isShow = true;
            }, 600);
            console.log(this.productListData)
            this.optionTarget=data.MetricName
            this.target = data.MetricName[0]
            this.picName = "明细-"+ this.target.label
        },
        getTarget(val){
            this.picName = "明细-"+ val.label
        },
        projectIds(data) {
            console.log(data)
            this.projectId = data;
        },
        searchParams(data) {
            console.log(data)
            this.searchParam = data;
        },
        selectDatas(val) {
            this.rightData  = val;
            console.log(val)
        },
        // 跳转
        jump(){
            this.$router.go(-1)
        },
        // async getMonitorList(){
        //     let params = {
        //         Namespace: "qce/cvm",
        //         MetricName: "cpu_usage",
        //         StartTime: "2020-03-20T19:31:24+08:00",
        //         EndTime: "2020-03-20T20:31:24+08:00",
        //         Period: 10,
        //         // 'Instances.0.Dimensions.0.Name':'InstanceId',
        //         // 'Instances.0.Dimensions.0.Value':'ins-kfkzimbi',
        //         'Dimensions.0.unInstanceId': "ins-c6uthv4s",
        //         // 'Instances.0.Dimensions.0.vpnGwId': "vpngw-jby0g51u",
        //         // 'Instances.0.Dimensions.1.vpnGwId': "vpngw-fibqovh8",
        //         Version: "2018-07-24",
        //         Region: localStorage.getItem("regionv2"),
        //     }
        //     await this.axios.post(All_MONITOR, params).then(res=>{
        //         console.log(res)
        //     })
        // }
        // 创建Dashboard
        async createDashboard(){
            const param = {
                Module :'monitor',
                Namespace:'qce/cvm',
                DescName:this.picName,
                DashboardID:76484,
                MetricNames:["partition"],
                Meta:{"aggregateType":"detail","aggregations":["Avg","Max","Min"],"chartTypes":["column"],"configId":"cvm","layout":{"h":"5","h2":"0","w":"4","x":"0","y":"0"},"timeAggregate":"last"},
                Instances:["{\"regionId\":\"1\",\"unInstanceId\":\"ins-19719mfp\"}"]
            }   
            await this.axios.post(CREATDASHBORD, param).then(res => {
                console.log(res)
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .room{
        padding:20px;
        background: white;
    }
    .top{
        margin-top:20px;
        font-size: 14px;
        height: 50px;
        // line-height: center;
        .top-one{
            width: 300px;
            float: left;
            display: flex;
            justify-content: space-between;
            // align-self: center;
            align-items: center;
        }
        .top-two{
            width: 150px;
            float: left;
            margin-left: 20px;
             display: flex;
            justify-content: space-between;
            // align-self: center;
            align-items: center;
            .top-two-see{
                border:1px solid rgb(0, 110, 255);
                width:80px;
                height: 30px;
                color: rgb(0, 110, 255) ;
                line-height: 30px;
                text-align: center;
                cursor: pointer;
            }
        }
    }
    .footer{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .footer-left{
            width: 55%;
            height: 450px;
            border:1px solid #ddd;
            display: flex;
            justify-content: space-between;
            .footer-left-left{
                width: 25%;
                height: 448px;
                background: #f2f2f2;
                padding:10px;
            }
            .footer-left-right{
                width: 75%;
                height: 450px;
                padding:10px;
            }
        }
        .footer-right{
            width: 42%;
            height: 450px;
        }
    }
    .bottom{
        margin-top:20px;
    }
    .Cam-right{
        float: right;
    }
</style>