<template>
    <div class="room">
        <h2>创建监控图表</h2>
        <div class="top">
            <div class="top-one">
                <span>产品类型</span>
                <Type v-on:PassData="PassData" :projectId='projectId' :searchParam='searchParam' :productValue='productValue' v-on:loading="Type_loading"></Type>
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
                       <Echarts :time='times' :series='series' :period = "'60'" :xdata="true" 
                       style="width:90%;height:400px;margin-left:-15px" v-if="series.length"></Echarts>
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
                    v-loading="loading"
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
import Echarts from './components/echars-line'
import moment from 'moment';
export default {
    name:"DashboardCreate",
    components:{
        Type,
        CamTransferCpt,
        Echarts
    },
    created(){
        this.StartTime= moment(new Date(moment().format()).getTime()-1000*60*60).format("YYYY-MM-DD HH:mm:ss")
        this.EndTime =  moment(new Date(moment().format()).getTime()).format("YYYY-MM-DD HH:mm:ss")
        this.DashboardID = this.$route.query.DashboardID
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
            MetricName:"",// 监控名
            rightData:"",// 多选数据
            StartTime:"",//开始时间
            EndTime:"",//结束时间
            timeDate:{},
            times:[],
            series:[],
            DashboardID:"",//
            loading: true,
            flag:false
        }
    },
    methods:{
        PassData(data) {
            this.productListData = data
            console.log(this.productListData)
             setTimeout(() => {
                this.productListData = {};
            // this.isShow = true;
            }, 500);
            setTimeout(() => {
                this.productListData = data;
            // this.isShow = true;
            }, 600);
            this.Namespace = data.Namespace
            this.productValue = data.productValue
            this.optionTarget=data.MetricName
            this.target = data.MetricName[0] // 指标
            this.MetricName = data.MetricName[0].value // 监控名
            this.picName = "明细-"+ this.target.label
            this.rightData=[]
            this.loading =false
        },
        getTarget(val){
            this.picName = "明细-"+ val.label
            this.MetricName = val.value
            this.getMonitorList()
            console.log(this.MetricName)
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
            // if(this.rightData.length){
            this.getMonitorList()
            // }
        },
        Type_loading(val) {
            this.loading = val
            this.series=[]
        },
        // 跳转
        jump(){
            this.$router.go(-1)
        },
        // 获取监控列表
        async getMonitorList(){
            this.timeDate = {}
            this.times=[]
            this.series=[]
            let color = ['#2072d9','#fff2cc','#ffd966','#f1c232','#9fc5e8','#3d85c6','#00ff00','#008bff','#980000','#1c4587']
            let params = {
                Namespace: this.Namespace,
                MetricName: this.MetricName,
                StartTime:this.StartTime,
                EndTime: this.EndTime,
                Period: 60,
                Version: "2017-03-12",
            }
            for(let i=0 ; i<this.rightData.length ; i++){
                if (this.productValue=== "cvm_device"){
                    params['Dimensions.'+i+'.unInstanceId'] = this.rightData[i].InstanceId
                } else if (this.productValue === "VPN_GW"){
                    params['Dimensions.'+i+'.vpnGwId'] = this.rightData[i].VpnGatewayId
                } else if (this.productValue === "vpn_tunnel"){
                    params['Dimensions.'+i+'.vpnConnId'] = this.rightData[i].VpnConnectionId
                } else if (this.productValue === "nat_tc_stat"){
                    params['Dimensions.'+i+'.natId'] = this.rightData[i].NatGatewayId
                } else if (this.productValue === "DC_GW"){
                    params['Dimensions.'+i+'.directConnectGatewayId'] = this.rightData[i].DirectConnectGatewayId
                } else if (this.productValue === "REDIS-CLUSTER"){
                    params['Dimensions.'+i+'.appid'] = this.rightData[i].Appid
                    params['Dimensions.'+i+'.instanceid'] = this.rightData[i].InstanceId
                } else if (this.productValue === "dcchannel"){
                    params['Dimensions.'+i+'.directConnectConnId'] = this.rightData[i].DirectConnectTunnelId
                } else if (this.productValue === "COS"){
                    params['Dimensions.'+i+'.bucket'] = this.rightData[i].Name
                } 
                // else if (this.productValue === "BS"){
                //     params['Dimensions.'+i+'.bucket'] = this.rightData[i].DiskId
                // }  
            }
            await this.axios.post(All_MONITOR, params).then(res=>{
                if(res.Response.Error == undefined){
                    console.log(res)
                    if(res.Response.DataPoints.length){
                        // 监控数据处理
                        for(let i in res.Response.DataPoints){
                            this.timeDate['DataPoints.'+i] = []
                            for(let j in res.Response.DataPoints[i].Points){
                                this.timeDate['DataPoints.'+i].push({
                                    point:res.Response.DataPoints[i].Points[j],
                                    time:moment(new Date(this.StartTime).getTime()+60000*j).format("YYYY-MM-DD HH:mm:ss")
                                }) 
                            }
                        }
                        // x轴数据
                        for(let keyTime in this.timeDate['DataPoints.0']){
                            this.times.push(this.timeDate['DataPoints.0'][keyTime].time)
                        }
                        // y轴
                        for(let item in res.Response.DataPoints){
                            if(res.Response.DataPoints.length){
                                this.series.push({
                                    labelLine: {
                                        normal: {
                                        show: false
                                        }
                                    },
                                    type: 'line', 
                                    data: res.Response.DataPoints[item].Points,
                                    symbol: "none",
                                    itemStyle: {
                                        normal: {
                                            color: color[item]?color[item]:color[item%10],
                                            lineStyle: {
                                                color: color[item]?color[item]:color[item%10]
                                            }
                                        }
                                    }
                                })
                            }
                        }
                        console.log(this.series)
                    } else {
                        this.series = []
                    }
                }
            })
        },
        // 创建Dashboard
        // async createDashboard(){
        //     const param = {
        //         Version: '2018-07-24',
        //         Region: 'ap-taipei',
        //         Module: 'monitor',
        //         Namespace:this.Namespace,
        //         DescName:this.picName,
        //         DashboardID:this.DashboardID,
        //         MetricNames:["partition"],
        //         Meta:{
        //         "aggregateType":"detail",
        //         "aggregations":["Avg","Max","Min"],
        //         "chartTypes":["column"],
        //         "configId":"cvm",
        //         "layout":{"h":"5","h2":"0","w":"4","x":"0","y":"0"},
        //         "timeAggregate":"last"
        //         },
        //         "Instances.0":["{\"regionId\":\"1\",\"unInstanceId\":\"ins-19719mfp\"}"]
        //     }   
        //     await this.axios.post(CREATDASHBORD, param).then(res => {
        //         console.log(res)
        //     })
        // }
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
            width: 56%;
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