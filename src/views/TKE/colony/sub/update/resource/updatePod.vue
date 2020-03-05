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
               <p>满足任一设定条件，则自动调节实例（pod）数目<a href="#">查看更多</a> </p>
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
                 <el-input class="w100" v-model="val.valueKey" style="margin-right:6px"></el-input>
                  <span v-if='val.value2 == 1'>核</span>
                  <el-tooltip v-if='val.value2 == 2||val.value2 == 3||val.value2 == 4||val.value2 == 7||val.value2 == 8||val.value2 == 9||val.value2 == 10||val.value2 == 11||val.value2 == 12' class="item" effect="light" content="阙值范围0-100" placement="right">
                     <span>%</span>
                   </el-tooltip>
                 <span v-if='val.value2 == 5||val.value2 == 6'>MiB</span>
                 <span v-if='val.value2 == 13||val.value2 == 14||val.value2 == 19||val.value2 == 20||val.value2 == 3'>KB/s</span>
                 <span v-if='val.value2 == 15||val.value2 == 16'>次/s</span>
                 <span v-if='val.value2 == 17||val.value2 == 18||val.value2 == 4'>Mbps</span>
                 <span v-if='val.value2 == 21||val.value2 == 22'>个</span>
                 <el-tooltip class="item" effect="light" content="至少保留一个指标" placement="right">
                   <i class="el-icon-close" @click.prevent="removeOptions(optionsData,index)"></i>
                 </el-tooltip>
                 </div>
                 <a href="#" @click="newAddTarget">新增指标</a>
               </el-form-item>
               <el-form-item label="实例范围">
                 <el-input class="w100"></el-input>~<el-input class="w100"></el-input>
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
         caseNum:'',
         // 更新pod数量
         upn: {
           type: '1',
           num: 0,
         },
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
       };
     },
     components: {},
     created() {
       this.getData()
     },
     methods: {
    //获取数据
       getData(){
         var params={
          Method: "GET",
          Path:"/apis/apps/v1beta2/namespaces/" +this.spaceName +"/deployments/" +this.name+"/horizontalpodautoscalers",
          // Path:"/apis/apps/v1beta2/namespaces/" +this.spaceName +"/deployments?fieldSelector=metadata.name=" +this.name,
          Version: "2018-05-25",
          ClusterName: this.clusterId
        };
        this.axios.post(POINT_REQUEST, params).then(res=>{
           if(res.Response.Error === undefined){
              let response = JSON.parse(res.Response.ResponseBody);
                console.log(response,"response");
              this.caseNum=response.items[0].status.replicas
              this.upn.num=response.items[0].status.replicas

           }

        })
       },
        //更新实例数目
      updatePodNumber() {

         if(this.upn.type=='1'){
           let param = {
             Method: "PATCH",
             Path: "/apis/apps/v1beta2/namespaces/"+this.spaceName+"/deployments/"+this.name,
             Version: "2018-05-25",
             RequestBody: {spec: {replicas: this.upn.num}},
             ContentType: "application/strategic-merge-patch+json",
             ClusterName: this.clusterId
           }
         }else{
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
        let param={
               ClusterName: this.clusterId,
               ContentType: "application/strategic-merge-patch+json",
              Method: "PATCH",
              Path: "/apis/autoscaling/v2beta1/namespaces/"+this.spaceName+"/horizontalpodautoscalers/hpa-cbs-provisioner-k7a22txx",
              RequestBody: 
               {"metadata":
                 {"annotations":
                   {"autoscaling.alpha.kubernetes.io/metrics":arr}
                 },
                "spec":{
                   "minReplicas":2,"maxReplicas":3,
                   "metrics":arr
                   }
                },
              Version: "2018-05-25",
            }

         } 

        this.axios.post(POINT_REQUEST, param).then(res => {
          console.log(res)
          if(res.Response.Error === undefined) {
            this.$router.go(-1)
          } else {
            let ErrTips = {
              
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
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
       removeOptions(domain,index){
          if (domain.length !== 1) {
           this.optionsData.splice(index, 1)
         }
       },

       //获取更新pod自动调节触发策略数据
       async getTriggerList() {
         let param = {
            Method: "GET",
            Path: "/apis/apps/v1beta2/namespaces/"+this.spaceName+"/deployments/"+this.name+"/horizontalpodautoscalers",
            Version: "2018-05-25",
            ClusterName: this.clusterId
         }
        console.log(param)
        await this.axios.post(POINT_REQUEST, param).then(res => {
        if(res.Response.Error === undefined) {
          let response = JSON.parse(res.Response.ResponseBody);
         
          console.log(response,"response");
        
        } else {
          let ErrTips = {
            
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
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
       //返回上一层
       goBack() {
         this.$router.go(-1);
       },
      
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
 </style>
