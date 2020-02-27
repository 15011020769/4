 <!-- 新建HPA -->
 <template>
   <div class="colony-wrap">
     <div class="tke-content-header">
       <div class="tke-grid ">
         <!-- 左侧 -->
         <div class="grid-left">
           <span class="goback" @click="goBack">
             <i class="el-icon-back"></i>
           </span>
           <h2 class="header-title">更新HPA配置</h2>
         </div>
         <!-- 右侧 -->
         <div class="grid-right"></div>
       </div>
     </div>
     <div class="colony-main">

       <div class="tke-card tke-formpanel-wrap mb60">
         <el-form ref="form"   class="tke-form" :model="hpa"  label-position='left' label-width="120px" size="mini">
           <el-form-item label="名称" prop="name">
               {{hpa.name}}
           </el-form-item>

           <el-form-item label="命名空间">
             {{hpa.np}}
           </el-form-item>

           <el-form-item label="工作负载类型">
             <el-select v-model="hpa.type" placeholder="请选择" size="mini">
               <el-option v-for="item in hpa.option2" :key="item" :label="item" :value="item">
               </el-option>
             </el-select>
           </el-form-item>

           <el-form-item label="关联工作负载">
             <el-select v-model="hpa.workload" placeholder="请选择" size="mini">
               <el-option v-for="item in hpa.option3" :key="item" :label="item" :value="item">
               </el-option>
             </el-select>
           </el-form-item>

           <el-form-item label="解决策略">
             <div class='app-tke-fe-form w520'>
               <div class="form-input" v-for="(domain, index) in hpa.domains" :key="domain.key"
                 :prop="'domains.' + index + '.value'">
                 <el-select   @change="changeOne(domain.value4,index)" v-model="domain.value4" placeholder="请选择" size="mini" class="w100">
                   <el-option v-for="item in domain.options" :key="item.label" :label="item.label" :value="item.value">
                   </el-option>
                 </el-select>

                 <el-select v-model="domain.value5" placeholder="请选择" size="mini" class="w200">
                   <el-option v-for="item in domain.option1" :key="item.label" :label="item.label" :value="item.value"
                     v-if='domain.value4 == 1'>
                   </el-option>
                   <el-option v-for="item in domain.option2" :key="item.label" :label="item.label" :value="item.value"
                     v-if='domain.value4 == 2'>
                   </el-option>
                   <el-option v-for="item in domain.option3" :key="item.label" :label="item.label" :value="item.value"
                     v-if='domain.value4 == 3'>
                   </el-option>
                   <el-option v-for="item in domain.option4" :key="item.label" :label="item.label" :value="item.value"
                     v-if='domain.value4 == 4'>

                   </el-option>
                 </el-select>

                 <el-input   v-model="domain.valueKey" size="mini" placeholder="变量值" class='w100'></el-input>
                 <span v-if='domain.value5 == 1'>核</span>
                  <el-tooltip v-if='domain.value5 == 2||domain.value5 == 3||domain.value5 == 4||domain.value5 == 7||domain.value5 == 8||domain.value5 == 9||domain.value5 == 10||domain.value5 == 11||domain.value5 == 12' class="item" effect="light" content="阙值范围0-100" placement="right">
                     <span>%</span>
                   </el-tooltip>
                 <span v-if='domain.value5 == 5||domain.value5 == 6'>MiB</span>
                 <span v-if='domain.value5 == 13||domain.value5 == 14||domain.value5 == 19||domain.value5 == 20||domain.value4 == 3'>KB/s</span>
                 <span v-if='domain.value5 == 15||domain.value5 == 16'>次/s</span>
                 <span v-if='domain.value5 == 17||domain.value5 == 18||domain.value4 == 4'>Mbps</span>
                 <span v-if='domain.value5 == 21||domain.value5 == 22'>个</span>

                 <el-tooltip class="item" effect="light" content="至少保留一个指标" placement="right">
                   <i class="el-icon-close" @click.prevent="removeDomain(hpa.domains,index)"></i>
                 </el-tooltip>

               </div>
               <el-link type="primary" style="cursor: pointer;font-size:12px;" @click="addDomain">新增指标</el-link>
             </div>
           </el-form-item>
           <el-form-item label="实例范围">
             <el-input class='w100' type='number' :min='1' v-model='hpa.vLeft'></el-input>
             <span class='w-span'>~</span>
             <el-input class='w100' type='number' :min='2' v-model='hpa.vRight'></el-input>
             <p>在设定的实例范围内自动调节，不会超出该设定范围</p>
           </el-form-item>
         </el-form>


         <!-- 底部 -->
         <div class="tke-formpanel-footer">
           <el-button size="small" type="primary" @click="startUpdate">更新HPA</el-button>
           <el-button size="small" @click="$router.go(-1)">取消</el-button>
         </div>
       </div>
     </div>


   </div>
 </template>

 <script>
   import FileSaver from "file-saver";
   import XLSX from "xlsx";
   import {
     ALL_CITY,
     TKE_COLONY_QUERY
   } from "@/constants";
   export default {
     name: "hpaCreate",
     data() {
      
       return {
        fontColor:false,
         hpa: {
           name: '',
           np:'',
           option1: [],
           option2: ['deployment', 'statefulset'],
           option3: [],
           domains: [],
           value1: '',
           type: 'deployment',
           workload: '',
           vLeft: 1,
           vRight: 2
         },
         clusterId: '',
       };
     },
     watch: {
       hpa: {
         handler(hpa) {
           if (hpa.value1 && hpa.type && this.clusterId) {
             var params = {
               ClusterName: this.clusterId,
               Method: "GET",
               Path: "/apis/apps/v1beta2/namespaces/" + hpa.value1 + "/" + hpa.type + 's',
               Version: "2018-05-25",
             }
             this.axios.post(TKE_COLONY_QUERY, params).then(res => {
               if (res.Response.Error == undefined) {
                 var data = JSON.parse(res.Response.ResponseBody);
                 if (data.items) {
                   let arr = []
                   data.items.forEach(v => {
                     arr.push(v.metadata.name)
                   })
                   hpa.option3 = arr;
                   hpa.workload = arr[0]
                 }

               }
             })


           }

         },
         deep: true
       }
     },
     created() {
       // 从路由获取类型
       this.clusterId = this.$route.query.clusterId
       this.hpa.name=this.$route.query.name;
       this.hpa.np=this.$route.query.np;

      if(this.hpa.name&&this.hpa.np){
        this.findData()
      }
       this.nameSpaceList();
     },
     methods: {
    
    startUpdate(){

         var kind;
         if(this.hpa.type=='statefulset'){
            kind='StatefulSet'
         }else if(this.hpa.type=='deployment'){
            kind='Deployment'
         }
          let arr=[];
         this.hpa.domains.forEach(x=>{
            //cpu
            if(x.value4=='1'&&x.value5=='1'&&x.valueKey!=''){
               let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_cpu_core_used",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
            }
            if(x.value4=='1'&&x.value5=='2'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_rate_cpu_core_used_node",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
            }
            if(x.value4=='1'&&x.value5=='3'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_rate_cpu_core_used_request",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
            }
            if(x.value4=='1'&&x.value5=='4'&&x.valueKey!=''){
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
             if(x.value4=='2'&&x.value5=='5'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_mem_usage_bytes",
				         	"targetAverageValue": x.valueKey+"Mi"
				         }
               };
               arr.push(obj)
             }
             if(x.value4=='2'&&x.value5=='6'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_mem_no_cache_bytes",
				         	"targetAverageValue": x.valueKey+"Mi"
				         }
               };
               arr.push(obj)
             }
             if(x.value4=='2'&&x.value5=='7'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_rate_mem_usage_node",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
             }
             if(x.value4=='2'&&x.value5=='8'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_rate_mem_no_cache_node",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
             }
             if(x.value4=='2'&&x.value5=='9'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_rate_mem_usage_request",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
             }
             if(x.value4=='2'&&x.value5=='10'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_rate_mem_no_cache_request",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
             }
             if(x.value4=='2'&&x.value5=='11'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_rate_mem_usage_limit",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
             }
             if(x.value4=='2'&&x.value5=='12'&&x.valueKey!=''){
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
             if(x.value4=='3'&&x.value5=='13'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_fs_write_bytes",
				         	"targetAverageValue": x.valueKey+'Ki'
				         }
               };
               arr.push(obj)
             }
             if(x.value4=='3'&&x.value5=='14'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_fs_read_bytes",
				         	"targetAverageValue": x.valueKey+'Ki'
				         }
               };
               arr.push(obj)
             }
             if(x.value4=='3'&&x.value5=='15'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_fs_read_times",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
             }
             if(x.value4=='3'&&x.value5=='16'&&x.valueKey!=''){
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
           if(x.value4=='4'&&x.value5=='17'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_network_receive_bytes_bw",
				         	"targetAverageValue": x.valueKey+"Mi"
				         }
               };
               arr.push(obj)
             }
           if(x.value4=='4'&&x.value5=='18'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_network_transmit_bytes_bw",
				         	"targetAverageValue": x.valueKey+"Mi"
				         }
               };
               arr.push(obj)
             }
           if(x.value4=='4'&&x.value5=='19'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_network_receive_bytes",
				         	"targetAverageValue": x.valueKey+"Ki"
				         }
               };
               arr.push(obj)
             }
           if(x.value4=='4'&&x.value5=='20'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_network_transmit_bytes",
				         	"targetAverageValue": x.valueKey+"Ki"
				         }
               };
               arr.push(obj)
             }
           if(x.value4=='4'&&x.value5=='21'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_network_receive_packets",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
             }
           if(x.value4=='4'&&x.value5=='22'&&x.valueKey!=''){
                let obj={
                  "type": "Pods",
				      "pods": {
				         	"metricName": "k8s_pod_network_transmit_packets",
				         	"targetAverageValue": x.valueKey
				         }
               };
               arr.push(obj)
             }
         })
         if(this.hpa.workload==''||this.hpa.workload==undefined){
             this.$message("关联工作负载不能为空");
            return 
         }
       
         let arr2=this.hpa.domains.filter(v=>{
             return v.valueKey==''||v.valueKey==undefined
         })
         if(arr2.length!=0){
             this.$message("变量值不能为空");
             return  false
         }

         if(this.hpa.vLeft>this.hpa.vRight||this.hpa.vLeft==this.hpa.vRight||this.hpa.vLeft==''||this.hpa.vLeft==''){
             this.$message("最小副本数不能大于等于最大副本数");
            return
         }
         
         var params={
            ClusterName:this.clusterId,
            ContentType: "application/strategic-merge-patch+json",
            Method: "PATCH",
            Path: "/apis/autoscaling/v2beta1/namespaces/"+this.hpa.np+"/horizontalpodautoscalers/"+this.hpa.name,
            RequestBody:{
                "metadata":{},
                "spec":{
                    "minReplicas":Number(this.hpa.vLeft),"maxReplicas":Number(this.hpa.vRight),
                    "metrics":arr,
                    "scaleTargetRef":{"apiVersion":"apps/v1beta2","kind":kind,"name":this.hpa.workload}
                    }
             },   
            Version: "2018-05-25",
         }
         console.log(params)
         this.axios.post(TKE_COLONY_QUERY, params).then(res=>{
             console.log(res)
              if (res.Response.Error == undefined){
                  this.$router.go(-1)
                   this.$message({
                    message: "更新成功",
                    type: "success",
                     });
              }
         })
    },
    findData(){
      var params={
          ClusterName: this.clusterId,
          Method: "GET",
           Path: "/apis/autoscaling/v2beta1/namespaces/"+this.hpa.np+"/horizontalpodautoscalers?fieldSelector=metadata.name="+this.hpa.name,
          Version: "2018-05-25",
      }
      this.axios.post(TKE_COLONY_QUERY, params).then(res=>{
        if (res.Response.Error == undefined) {
               var data = JSON.parse(res.Response.ResponseBody);
               if(data.items){
               console.log(data.items)
                   this.hpa.type=(data.items[0].spec.scaleTargetRef.kind).toLowerCase()
                   this.hpa.workload=data.items[0].spec.scaleTargetRef.name
                   let wd=data.items[0].spec.metrics;
                   this.dataFilter(wd)
              
               }
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

    }, 

    pushData(x,y,z){
    this.hpa.domains.push({
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
             value4: x,
             value5: y,
             valueKey: z
    })
    },
    changeOne(item,index){
        if(item==1){
            this.hpa.domains[index].value5=1
        }else if(item==2){
             this.hpa.domains[index].value5=5 
        }else if(item==3){
             this.hpa.domains[index].value5=13
        }else if(item==4){
             this.hpa.domains[index].value5=17 
        }
    },

    


       //返回上一层
       goBack() {
         this.$router.go(-1);
       },
       removeDomain(domain, index) {
         if (domain.length !== 1) {
           this.hpa.domains.splice(index, 1)
         }
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
           this.axios.post(TKE_COLONY_QUERY, params).then(res => {
             if (res.Response.Error == undefined) {
               var data = JSON.parse(res.Response.ResponseBody);
               data.items.forEach(item => {
                 this.hpa.option1.push(item.metadata.name);
                 this.hpa.value1 = this.hpa.option1[0]
               })
             }
           })
         }
       },
       addDomain() {
         this.hpa.domains.push({
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
           value4: 1,//选择框1
           value5: 1,//选择框2
           valueKey: ''
         })
       }
     }
   };

 </script>

 <style lang="scss" scoped>
   .app-tke-fe-form {
     background-color: #f2f2f2;
     padding: 10px;
   }

   .form-input {
     display: flex;
     justify-content: space-between;
     align-items: center;
     margin-top: 10px;

     span {
       margin: 0 10px;
     }

     i {
       margin: 0 10px;
       cursor: pointer;
     }
   }

   .w-span {
     margin: 0 10px;
   }
   .activeColor {
    color: #f56c6c !important;
  }

 </style>
