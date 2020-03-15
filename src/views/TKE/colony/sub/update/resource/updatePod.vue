 <!-- 新建Service -->
 <template>
   <div class="colony-wrap">
     <div class="tke-content-header">
       <div class="tke-grid ">
         <!-- 左侧 -->
         <div class="grid-left">
           <span class="goback" @click="goBack">
             <i class="el-icon-back"></i>
           </span>
           <h2 class="header-title" >更新Pod数量</h2>
         </div>
         <!-- 右侧 -->
         <div class="grid-right"></div>
       </div>
     </div>
     <div class="colony-main">
       <div class="tke-card tke-formpanel-wrap mb60">
         <el-form class="tke-form" :model="upn" label-position="left" label-width="120px" size="mini"
           >
           <el-form-item label="当前实例数量">
             <span>{{caseNum}}</span>
           </el-form-item>
           <el-form-item label="实例数量">
             <el-radio-group v-model="upn.type" style="margin-bottom: 5px;">
               <el-radio-button label="1">手动调节</el-radio-button>
               <el-radio-button label="2">自动调节</el-radio-button>
             </el-radio-group>
             <div v-if='upn.type=="1"'>
               <p>直接设定实例数量</p>
               <p style="background:#f2f2f2;width:80%;height:60px;line-height:60px;margin-top:6px;padding:0px 10px;">
                 <span>实例数量</span>
                 <el-input-number class="ml100" v-model="upn.num" size="small" :value="1" :min="0"></el-input-number>个
               </p>
             </div>
             <div v-if="upn.type=='2'">
               <p>满足任一设定条件，则自动调节实例（pod）数目
                 <!-- <a href="#">查看更多</a> -->
               </p>
               <el-form-item label="触发策略" style="margin-top:10px">
                 <div class="bottom10" v-for="(val,index) in optionsData" :key="index">

                   <el-select class="w100" v-model="val.value1" @change="changeOne(val.value1,index)">
                     <el-option v-for="item in  val.options" :key="item.value" :label="item.label"
                       :value="item.value">
                     </el-option>
                   </el-select>
                   <el-select v-model="val.value2" placeholder="请选择" size="mini" style="margin:0px 6px">
                   <el-option v-for="item in val.option1" :key="item.label" :label="item.label" :value="item.value"
                     v-if='val.value1 == 1'>
                   </el-option>
                   <el-option v-for="item in val.option2" :key="item.label" :label="item.label" :value="item.value"
                     v-if='val.value1 == 2'>
                   </el-option>
                   <el-option v-for="item in val.option3" :key="item.label" :label="item.label" :value="item.value"
                     v-if='val.value1 == 3'>
                   </el-option>
                   <el-option v-for="item in val.option4" :key="item.label" :label="item.label" :value="item.value"
                     v-if='val.value1 == 4'>

                   </el-option>
                 </el-select>
                 <!-- <el-input class="w100" :class="{ 'pod-wran': val.valueKey==''||!reg.test(val.valueKey) }"  -->
                 <el-input class="w100" 
                 :class="{ 'pod-warn':index===matchIndex}"
                 @focus="matchOneFocus(val.valueKey,index)"
                 @blur="matchOneBlur(val.valueKey,index)"
                v-model="val.valueKey" style="margin-right:6px"></el-input>
                 <!-- <el-input class="w100" :class="{ 'pod-wran': val.valueKey==''||!reg.test(val.valueKey) }"  @blur="podMathBlur(val.valueKey)"
                @focus="podMathFocus(val.valueKey)" v-model="val.valueKey" style="margin-right:6px"></el-input> -->
                  <span v-if='val.value2 == 1'>核</span>
                  <el-tooltip v-if='val.value2 == 2||val.value2 == 3||val.value2 == 4||val.value2 == 7||val.value2 == 8||val.value2 == 9||val.value2 == 10||val.value2 == 11||val.value2 == 12' class="item" effect="light" content="阙值范围0-100" placement="right">
                     <span>%</span>
                   </el-tooltip>
                 <span v-if='val.value2 == 5||val.value2 == 6'>MiB</span>
                 <span v-if='val.value2 == 13||val.value2 == 14||val.value2 == 19||val.value2 == 20||val.value1 == 3'>KB/s</span>
                 <span v-if='val.value2 == 15||val.value2 == 16'>次/s</span>
                 <span v-if='val.value2 == 17||val.value2 == 18||val.value1 == 4'>Mbps</span>
                 <span v-if='val.value2 == 21||val.value2 == 22'>个</span>
                 <el-tooltip class="item" effect="light" content="至少保留一个指标" placement="right">
                   <i class="el-icon-close" @click.prevent="removeOptions(optionsData,index)"></i>
                 </el-tooltip>
                 </div>
                 <p  v-if="colorFlag"    style="color:red">不能使用两个相同的指标</p>
                 <a  @click="newAddTarget">新增指标</a>
               </el-form-item>
               <el-form-item label="实例范围">

                  <el-tooltip class="item"  :disabled="vLeft!=''" effect="light" content="最小副本数不能为空" placement="right">
                   <el-input :class="{'pod-warn':leftFlag}"  @focus="matchTwoFocus(vLeft)"  @blur="matchTwoBlur(vLeft)" v-model.number="vLeft" class="w100" ></el-input>
                 </el-tooltip>
                    ~
                 <!-- <el-input  :class="{ 'pod-wran': mathWarn }"  @blur="podMathBlur"
                @focus="podMathFocus"    v-model.number="vLeft" class="w100" ></el-input>~ -->
                 <el-tooltip class="item" :disabled="vRight!=''" effect="light" content="最大副本数不能为空" placement="right">
                   <el-input :class="{'pod-warn':rightFlag}"     @focus="matchThreeFocus(vRight)"  @blur="matchThreeBlur(vRight)" v-model.number="vRight" class="w100"></el-input>
                 </el-tooltip>
               </el-form-item>
             </div>
           </el-form-item>
         </el-form>
        

         <!-- 底部 -->
         <div class="tke-formpanel-footer">
           <el-button size="small" type="primary" @click="updatePodNumber()">更新实例数目</el-button>
           <el-button size="small" @click="$router.go(-1)">取消</el-button>
         </div>
       </div>
     </div>

   </div>

</template>

 <script>
   import FileSaver from "file-saver";
   import XLSX from "xlsx";
   import {ALL_CITY,POINT_REQUEST} from "@/constants";
   export default {
     name: "updatePod",
     data() {
       return {
         dialogFormVisible: false,
         clusterId: this.$route.query.clusterId,
         spaceName: this.$route.query.spaceName,
         name: this.$route.query.name,//路由传过来的工作负载数据
         workload: this.$route.query.workload,
         name2:'',//处理过的name
         caseNum:'',
         matchIndex:'',
         // 更新pod数量
         upn: {
           type: '1',
           num: 0,
         },
        vLeft:'',
        vRight:'',
        leftFlag:false,
        rightFlag:false,
        mathWarn:false,
        reg:/^\d+$/,
         optionsDataCopy:[],
         optionsData: [{
             options: [{
               value: 1,
               label: 'CPU'
             }, {
               value: 2,
               label: '内存'
             }, {
               value: 3,
               label: '硬盘'
             }, {
               value: 4,
               label: '网络'
             }],

             option1: [{
               value: 1,
               label: 'CPU使用量'
             }, {
               value: 2,
               label: 'CPU利用率(占节点)'
             }, {
               value: 3,
               label: 'CPU利用率(占Request)'
             }, {
               value: 4,
               label: 'CPU利用率(占Limit)'
             }],

             option2: [{
               value: 5,
               label: '内存使用量'
             }, {
               value: 6,
               label: '内存使用量(不含Cache)'
             }, {
               value: 7,
               label: '内存使用量(占节点)'
             }, {
               value: 8,
               label: '内存使用量(占节点、不含Cache)'
             }, {
               value: 9,
               label: '内存使用量(占Request)'
             }, {
               value: 10,
               label: '内存使用量(占Request、不含Cache)'
             }, {
               value: 11,
               label: '内存使用量(占Limit)'
             }, {
               value: 12,
               label: '内存使用量(占Limit、不含Cache)'
             }],

             option3: [{
               value: 13,
               label: '硬盘写流量'
             }, {
               value: 14,
               label: '硬盘读流量'
             }, {
               value: 15,
               label: '硬盘读IOPS'
             }, {
               value: 16,
               label: '硬盘写IOPS'
             }],

             option4: [{
               value: 17,
               label: '网络出带宽'
             }, {
               value: 18,
               label: '网络入带宽'
             }, {
               value: 19,
               label: '网络出流量'
             }, {
               value: 20,
               label: '网络入流量'
             }, {
               value: 21,
               label: '网络出包量'
             }, {
               value: 22,
               label: '网络入包量'
             }],
             value1: 1,
             value2: 1,
             valueKey: ''
           }],
           adjustType:'',//手动变自动
           colorFlag:false,//
       };
     },
     components: {},
     created() {
       this.baseData();
       this.baseDataJudge();
     },
     methods: {
    //获取数据
       baseData(){
         var params={
          Method: "GET",
          Path:"/apis/apps/v1beta2/namespaces/" +this.spaceName +"/"+this.workload+"?fieldSelector=metadata.name=" +this.name,
          Version: "2018-05-25",
          ClusterName: this.clusterId
        };
        this.axios.post(POINT_REQUEST, params).then(res=>{
           if(res.Response.Error === undefined){
              let response = JSON.parse(res.Response.ResponseBody);
                console.log(response,"response");
              this.caseNum=response.items[0].spec.replicas
              this.upn.num=response.items[0].spec.replicas
           }
        })
       },
       baseDataJudge(){
         var params={
          Method: "GET",
          Path:"/apis/apps/v1beta2/namespaces/" +this.spaceName +"/"+this.workload+"/" +this.name+"/horizontalpodautoscalers",
          Version: "2018-05-25",
          ClusterName: this.clusterId
        };
        this.axios.post(POINT_REQUEST, params).then(res=>{
           if(res.Response.Error === undefined){
              let response = JSON.parse(res.Response.ResponseBody);
                console.log(response,"responsepanduan");
                if(response.items.length!=0){//自动调节
                  this.adjustType=1;
                  this.upn.type=2;
                  let arr=JSON.parse(response.items[0].metadata.annotations['autoscaling.alpha.kubernetes.io/metrics']);
                  console.log(arr)
                  this.dataFilter(arr)
                  this.vLeft=response.items[0].spec.minReplicas;
                  this.vRight=response.items[0].spec.maxReplicas;
                  this.name2=response.items[0].metadata.name
                  console.log(this.optionsData)
                }else{//手动调节
                   this.upn.type=1;
                   this.adjustType='';
                }
           }
        })
       },
        //更新实例数目
      updatePodNumber() {
        var param;
         if(this.upn.type=='1'){//手动调节
                
              if(this.adjustType!=''){//修改自动调节
                this.deleteAdjust();
              }  
            param = {
              Method: "PATCH",
              Path: "/apis/apps/v1beta2/namespaces/"+this.spaceName+"/"+this.workload+"/"+this.name,
              Version: "2018-05-25",
              RequestBody: {spec: {replicas: this.upn.num}},
              ContentType: "application/strategic-merge-patch+json",
              ClusterName: this.clusterId
            }
         }else if(this.upn.type=='2'){//自动调节
         let arr2=this.optionsData.filter(v=>{
             return v.valueKey==''||v.valueKey==undefined
         })
         if(arr2.length!=0){
            this.$message({
            message:"触发策略阈值不能为空",
            type:'warning',
            showClose: true,
            duration: 0
            });
             return  false
         }

         if(this.vLeft>this.vRight||this.vLeft==this.vRight||this.vLeft==''||this.vLeft==''){
            this.$message({
            message:"最小副本数不能大于等于最大副本数",
            type:'warning',
            showClose: true,
            duration: 0
            });
            return false
         }

           if(this.adjustType==''){//新建自动调节
            let hpaName='hpa-'+this.name+'-'+Date.now().toString(36);
            let kind=null;
            if(this.workload=='deployments'){
              kind='Deployment';
            }else if(this.workload=='statefulsets'){
              kind='StatefulSet'
            }else if(this.workload=='cronjobs'){
              kind='CronJob'
            }else if(this.workload=='daemonsets'){
              kind='DaemonSet'
            }else if(this.workload=='jobs'){
              kind='Job'
            }
            param={
              ClusterName:this.clusterId,
              Method: "POST",
              Path: "/apis/autoscaling/v2beta1/namespaces/"+this.spaceName+"/horizontalpodautoscalers",
              RequestBody: {"kind":"HorizontalPodAutoscaler","apiVersion":"autoscaling/v2beta1",
              "metadata":{
                  "name":hpaName,
                  "namespace":this.spaceName,
                  "labels":{"qcloud-app":hpaName}},
                  "spec":{
                    "minReplicas":this.vLeft,
                    "maxReplicas":this.vRight,
                    "metrics":this.useData(),
                    "scaleTargetRef":{"apiVersion":"apps/v1beta2","kind":kind,"name":this.name}}},
              Version: "2018-05-25",
            }
           }else{//修改自动调节
             param={
                 ClusterName: this.clusterId,
                 ContentType: "application/strategic-merge-patch+json",
                 Method: "PATCH",
                 Path: "/apis/autoscaling/v2beta1/namespaces/"+this.spaceName+"/horizontalpodautoscalers/"+this.name2,
                 RequestBody: 
                  {"metadata":
                    {"annotations":
                      {"autoscaling.alpha.kubernetes.io/metrics": JSON.stringify(this.useData())}
                    },
                   "spec":{
                      "minReplicas":  this.vLeft,"maxReplicas":this.vRight,
                      "metrics":this.useData()
                      }
                   },
                 Version: "2018-05-25",
               }
           }
         } 
        this.axios.post(POINT_REQUEST, param).then(res => {
          if(res.Response.Error === undefined) {
                 this.$router.go(-1)
                 this.$message({
                type: "success",
                message: "更新成功",
                duration: 0,
                showClose: true
              });
          } else {
            let ErrTips = {
              
            };
            let ErrOr = Object.assign(this.$ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      },
      deleteAdjust(){
        var params={
          ClusterName:this.clusterId,
          Method: "DELETE",
          Path: "/apis/autoscaling/v2beta1/namespaces/"+this.spaceName+"/horizontalpodautoscalers/"+this.name2,
          RequestBody: {"propagationPolicy":"Background"},
          Version: "2018-05-25",
        }
        this.axios.post(POINT_REQUEST, params).then(res=>{
          if(res.Response.Error === undefined) {
          } else {
            let ErrTips = {
              
            };
            let ErrOr = Object.assign(this.$ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        })
      },
     
      dataFilter(arr){//回显数据
        arr.forEach(item=>{
            let type=item.pods.metricName
            let num=item.pods.targetAverageValue;
            if(type=='k8s_pod_cpu_core_used'){
                this.pushData(1,1,parseFloat(num))
            }else if(type=='k8s_pod_rate_cpu_core_used_node'){
                 this.pushData(1,2,parseFloat(num))
            }else if(type=='k8s_pod_rate_cpu_core_used_request'){
                 this.pushData(1,3,parseFloat(num))
            }else if(type=='k8s_pod_rate_cpu_core_used_limit'){
                 this.pushData(1,4,parseFloat(num))
            }else if(type=='k8s_pod_mem_usage_bytes'){
                 this.pushData(2,5,parseFloat(num))
            }else if(type=='k8s_pod_mem_no_cache_bytes'){
                 this.pushData(2,6,parseFloat(num))
            }else if(type=='k8s_pod_rate_mem_usage_node'){
                 this.pushData(2,7,parseFloat(num))
            }else if(type=='k8s_pod_rate_mem_no_cache_node'){
                 this.pushData(2,8,parseFloat(num))
            }else if(type=='k8s_pod_rate_mem_usage_request'){
                 this.pushData(2,9,parseFloat(num))
            }else if(type=='k8s_pod_rate_mem_no_cache_request'){
                 this.pushData(2,10,parseFloat(num))
            }else if(type=='k8s_pod_rate_mem_usage_limit'){
                 this.pushData(2,11,parseFloat(num))
            }else if(type=='k8s_pod_rate_mem_no_cache_limit'){
                 this.pushData(2,12,parseFloat(num))
            }else if(type=='k8s_pod_fs_write_bytes'){
                 this.pushData(3,13,parseFloat(num))
            }else if(type=='k8s_pod_fs_read_bytes'){
                 this.pushData(3,14,parseFloat(num))
            }else if(type=='k8s_pod_fs_read_times'){
                 this.pushData(3,15,parseFloat(num))
            }else if(type=='k8s_pod_fs_read_times'){
                 this.pushData(3,15,parseFloat(num))
            }else if(type=='k8s_pod_fs_write_times'){
                 this.pushData(3,16,parseFloat(num))
            }else if(type=='k8s_pod_network_receive_bytes_bw'){
                 this.pushData(4,17,parseFloat(num))
            }else if(type=='k8s_pod_network_transmit_bytes_bw'){
                 this.pushData(4,18,parseFloat(num))
            }else if(type=='k8s_pod_network_receive_bytes'){
                 this.pushData(4,19,parseFloat(num))
            }else if(type=='k8s_pod_network_transmit_bytes'){
                 this.pushData(4,20,parseFloat(num))
            }else if(type=='k8s_pod_network_receive_packets'){
                 this.pushData(4,21,parseFloat(num))
            }else if(type=='k8s_pod_network_transmit_packets'){
                 this.pushData(4,22,parseFloat(num))
            }
        })
        console.log(this.optionsDataCopy)
        this.optionsData=this.optionsDataCopy;

    }, 
    pushData(x,y,z){
      this.optionsDataCopy.push({
             options: [{
               value: 1,
               label: 'CPU'
             }, {
               value: 2,
               label: '内存'
             }, {
               value: 3,
               label: '硬盘'
             }, {
               value: 4,
               label: '网络'
             }],

             option1: [{
               value: 1,
               label: 'CPU使用量'
             }, {
               value: 2,
               label: 'CPU利用率(占节点)'
             }, {
               value: 3,
               label: 'CPU利用率(占Request)'
             }, {
               value: 4,
               label: 'CPU利用率(占Limit)'
             }],

             option2: [{
               value: 5,
               label: '内存使用量'
             }, {
               value: 6,
               label: '内存使用量(不含Cache)'
             }, {
               value: 7,
               label: '内存使用量(占节点)'
             }, {
               value: 8,
               label: '内存使用量(占节点、不含Cache)'
             }, {
               value: 9,
               label: '内存使用量(占Request)'
             }, {
               value: 10,
               label: '内存使用量(占Request、不含Cache)'
             }, {
               value: 11,
               label: '内存使用量(占Limit)'
             }, {
               value: 12,
               label: '内存使用量(占Limit、不含Cache)'
             }],

             option3: [{
               value: 13,
               label: '硬盘写流量'
             }, {
               value: 14,
               label: '硬盘读流量'
             }, {
               value: 15,
               label: '硬盘读IOPS'
             }, {
               value: 16,
               label: '硬盘写IOPS'
             }],

             option4: [{
               value: 17,
               label: '网络出带宽'
             }, {
               value: 18,
               label: '网络入带宽'
             }, {
               value: 19,
               label: '网络出流量'
             }, {
               value: 20,
               label: '网络入流量'
             }, {
               value: 21,
               label: '网络出包量'
             }, {
               value: 22,
               label: '网络入包量'
             }],
             value1: x,
             value2: y,
             valueKey: z
       })
    },
    useData(){
        let arr=[];
           this.optionsData.forEach(x=>{
            //cpu
            if(x.value1=='1'&&x.value2=='1'&&x.valueKey!=''){
               let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_cpu_core_used",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
            }
            if(x.value1=='1'&&x.value2=='2'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_rate_cpu_core_used_node",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
            }
            if(x.value1=='1'&&x.value2=='3'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_rate_cpu_core_used_request",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
            }
            if(x.value1=='1'&&x.value2=='4'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_rate_cpu_core_used_limit",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
            }
            // 内存
             if(x.value1=='2'&&x.value2=='5'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_mem_usage_bytes",
				         	"targetAverageValue": x.valueKey+"Mi"
				         }
               };
               arr.push(obj)
             }
             if(x.value1=='2'&&x.value2=='6'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_mem_no_cache_bytes",
				         	"targetAverageValue": x.valueKey+"Mi"
				         }
               };
               arr.push(obj)
             }
             if(x.value1=='2'&&x.value2=='7'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_rate_mem_usage_node",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
             }
             if(x.value1=='2'&&x.value2=='8'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_rate_mem_no_cache_node",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
             }
             if(x.value1=='2'&&x.value2=='9'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_rate_mem_usage_request",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
             }
             if(x.value1=='2'&&x.value2=='10'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_rate_mem_no_cache_request",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
             }
             if(x.value1=='2'&&x.value2=='11'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_rate_mem_usage_limit",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
             }
             if(x.value1=='2'&&x.value2=='12'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_rate_mem_no_cache_limit",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
             }
         //硬盘
             if(x.value1=='3'&&x.value2=='13'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_fs_write_bytes",
				         	"targetAverageValue": x.valueKey+'Ki'
				         }
               };
               arr.push(obj)
             }
             if(x.value1=='3'&&x.value2=='14'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_fs_read_bytes",
				         	"targetAverageValue": x.valueKey+'Ki'
				         }
               };
               arr.push(obj)
             }
             if(x.value1=='3'&&x.value2=='15'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_fs_read_times",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
             }
             if(x.value1=='3'&&x.value2=='16'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_fs_write_times",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
             }
         //网络
           if(x.value1=='4'&&x.value2=='17'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_network_receive_bytes_bw",
				         	"targetAverageValue": x.valueKey+"Mi"
				         }
               };
               arr.push(obj)
             }
           if(x.value1=='4'&&x.value2=='18'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_network_transmit_bytes_bw",
				         	"targetAverageValue": x.valueKey+"Mi"
				         }
               };
               arr.push(obj)
             }
           if(x.value1=='4'&&x.value2=='19'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_network_receive_bytes",
				         	"targetAverageValue": x.valueKey+"Ki"
				         }
               };
               arr.push(obj)
             }
           if(x.value1=='4'&&x.value2=='20'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_network_transmit_bytes",
				         	"targetAverageValue": x.valueKey+"Ki"
				         }
               };
               arr.push(obj)
             }
           if(x.value1=='4'&&x.value2=='21'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_network_receive_packets",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
             }
           if(x.value1=='4'&&x.value2=='22'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_network_transmit_packets",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
             }
         });
         return arr
    },
       removeOptions(domain,index){
          if (domain.length !== 1) {
           this.optionsData.splice(index, 1)
         }
       },
      
       newAddTarget() { //新增指标
          this.optionsData.push({
           options: [{
             value: 1,
             label: 'CPU'
           }, {
             value: 2,
             label: '内存'
           }, {
             value: 3,
             label: '硬盘'
           }, {
             value: 4,
             label: '网络'
           }],

           option1: [{
             value: 1,
             label: 'CPU使用量'
           }, {
             value: 2,
             label: 'CPU利用率(占节点)'
           }, {
             value: 3,
             label: 'CPU利用率(占Request)'
           }, {
             value: 4,
             label: 'CPU利用率(占Limit)'
           }],

           option2: [{
             value: 5,
             label: '内存使用量'
           }, {
             value: 6,
             label: '内存使用量(不含Cache)'
           }, {
             value: 7,
             label: '内存使用量(占节点)'
           }, {
             value: 8,
             label: '内存使用量(占节点、不含Cache)'
           }, {
             value: 9,
             label: '内存使用量(占Request)'
           }, {
             value: 10,
             label: '内存使用量(占Request、不含Cache)'
           }, {
             value: 11,
             label: '内存使用量(占Limit)'
           }, {
             value: 12,
             label: '内存使用量(占Limit、不含Cache)'
           }],

           option3: [{
             value: 13,
             label: '硬盘写流量'
           }, {
             value: 14,
             label: '硬盘读流量'
           }, {
             value: 15,
             label: '硬盘读IOPS'
           }, {
             value: 16,
             label: '硬盘写IOPS'
           }],

           option4: [{
             value: 17,
             label: '网络出带宽'
           }, {
             value: 18,
             label: '网络入带宽'
           }, {
             value: 19,
             label: '网络出流量'
           }, {
             value: 20,
             label: '网络入流量'
           }, {
             value: 21,
             label: '网络出包量'
           }, {
             value: 22,
             label: '网络入包量'
           }],
           value1: 1,//选择框1
           value2: 1,//选择框2
           valueKey: ''
         })
       },
        //默认选择项设置
       changeOne(item,index){
        if(item==1){
            this.optionsData[index].value2=1
        }else if(item==2){
             this.optionsData[index].value2=5 
        }else if(item==3){
             this.optionsData[index].value2=13
        }else if(item==4){
             this.optionsData[index].value2=17 
        }
       },
     
       //返回上一层
       goBack() {
         this.$router.go(-1);
       },
       matchOneFocus(v,i){
         if(v==''||!this.reg.test(v)){
           this.matchIndex=i
           console.log(this.matchIndex)
         }else{
           this.matchIndex=''
         }
       },
       matchOneBlur(v,i){
         if(v==''||!this.reg.test(v)){
           this.matchIndex=i
         }else{
           this.matchIndex=''
         }
       },
       matchTwoFocus(v){
         if(v==''||!this.reg.test(v)){
           this.leftFlag=true
         }else{
           this.leftFlag=false;
         }
       },
       matchTwoBlur(v){
          if(v==''||!this.reg.test(v)){
           this.leftFlag=true
         }else{
           this.leftFlag=false;
         }
       },
       matchThreeFocus(v){
         console.log(v)
          if(v==''||!this.reg.test(v)){
           this.rightFlag=true
         }else{
           this.rightFlag=false;
         }
       },
       matchThreeBlur(v){
         console.log('shijiao',v)

          if(v==''||!this.reg.test(v)){
           this.rightFlag=true
         }else{
           this.rightFlag=false;
         }
       },
      
     },
     watch:{
       optionsData:{
         handler(arr){
           console.log(arr)
           let dat=arr.map((item)=>{return item.value2})
           console.log(dat)
           if(dat.length!=Array.from(new Set(dat)).length){
             this.colorFlag=true;
            //   this.$message({
            // message:"不能使用两个相同的指标",
            // type:'warning',
            // showClose: true,
            // duration: 0
            // });
           }else{
             this.colorFlag=false;
           }
         },
         deep:true
       }
     },
   };

 </script>

 <style lang="scss" scoped>
   .w100 {
     width: 100px;
   }
   .ml100 {
     margin-left: 100px;
   }
   .flex {
     display: flex;
   }
   .port {
     max-width: 680px;
     border: 1px solid #ddd;
   }
   .card {
     padding: 10px;
     border-bottom: 1px solid #dcdfe6;
   }
   .text-error {
     color: #e54545;
   }
   .text-warning {
     color: #ff9d00
   }
   .bottom10 {
     margin-bottom: 10px;
   }
    i{
   cursor:pointer;
   }
   .pod-warn {
    ::v-deep .el-input__inner {
      border: 1px solid #e1504a;
    }
  }
 </style>
