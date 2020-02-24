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
           <h2 class="header-title">新建HPA</h2>
         </div>
         <!-- 右侧 -->
         <div class="grid-right"></div>
       </div>
     </div>
     <div class="colony-main">

       <div class="tke-card tke-formpanel-wrap mb60">
         <el-form ref="form"   class="tke-form" :model="hpa" :rules="rules" label-position='left' label-width="120px" size="mini">
           <el-form-item label="名称" prop="name">
             <el-input class="w180" v-model="hpa.name" placeholder="请输入名称"></el-input>
             <p :class="{ activeColor: fontColor }">最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</p>
           </el-form-item>

           <el-form-item label="命名空间">
             <el-select v-model="hpa.value1" placeholder="请选择" size="mini">
               <el-option v-for="item in hpa.option1" :key="item" :label="item" :value="item">
               </el-option>
             </el-select>
           </el-form-item>

           <el-form-item label="工作负载类型">
             <el-select v-model="hpa.value2" placeholder="请选择" size="mini">
               <el-option v-for="item in hpa.option2" :key="item" :label="item" :value="item">
               </el-option>
             </el-select>
           </el-form-item>

           <el-form-item label="关联工作负载">
             <el-select v-model="hpa.value3" placeholder="请选择" size="mini">
               <el-option v-for="item in hpa.option3" :key="item" :label="item" :value="item">
               </el-option>
             </el-select>
           </el-form-item>

           <el-form-item label="解决策略">
             <div class='app-tke-fe-form w520'>
               <div class="form-input" v-for="(domain, index) in hpa.domains" :key="domain.key"
                 :prop="'domains.' + index + '.value'">
                 <el-select v-model="domain.value4" placeholder="请选择" size="mini" class="w100">
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
           <el-button size="small" type="primary" @click='createHpa'>创建HPA</el-button>
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
        //验证名称
      var validateName = (rule, value, callback) => {
        console.log(value);
        if (value === "") {
          this.fontColor = true;
          callback();
        } else {
          let reg = /^[a-z]([a-z0-9]|-){0,61}([a-z0-9])$/;
          let flag = reg.test(this.hpa.name);
          if (!flag) {
            this.fontColor = true;
            callback();
          } else {
            this.fontColor = false;
            callback();
          }
        }
      };
       return {
         rules: {
          name: [{
            validator: validateName,
            trigger: "blur",
            required: false
          }],
        },
        fontColor:false,
         hpa: {
           name: '',
           option1: [],
           option2: ['deployment', 'statefulset'],
           option3: [],
           domains: [{
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
             value4: 1,
             value5: 1,
             valueKey: ''
           }],
           value1: '',
           value2: 'deployment',
           value3: '',
           vLeft: 1,
           vRight: 2
         },
         clusterId: '',
       };
     },
     watch: {
       hpa: {
         handler(hpa) {
           if (hpa.value1 && hpa.value2 && this.clusterId) {
             var params = {
               ClusterName: this.clusterId,
               Method: "GET",
               Path: "/apis/apps/v1beta2/namespaces/" + hpa.value1 + "/" + hpa.value2 + 's',
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
                   hpa.value3 = arr[0]
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

       this.nameSpaceList();
     },
     methods: {

       createHpa() {

         if (this.hpa.name == "") {
          this.$refs.form.validateField("name");
          this.$message("名称不能為空");
          return false;
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
         var kind;
         if(this.hpa.value2=='statefulset'){
            kind='StatefulSet'
         }else if(this.hpa.value2=='deployment'){
            kind='Deployment'
         }

         if(this.hpa.value3==''||this.hpa.value3==undefined){
             this.$message("关联工作负载不能为空");
            return false
         }

         this.hpa.domains.forEach(v=>{
            if(v.value3==''||v.value3==undefined){
            this.$message("变量值不能为空");
            return false
            }
         })

         if(this.hpa.vLeft>this.hpa.vRight||this.hpa.vLeft==this.hpa.vRight||this.hpa.vLeft==''||this.hpa.vLeft==''){
             this.$message("请输入正确实例范围限制");
            return false
         }

         // var params = {
         //   ClusterName: this.clusterId,
         //   Method: "POST",
         //   Path: "/apis/autoscaling/v2beta1/namespaces/" + this.hpa.value1 + "/horizontalpodautoscalers",
         //   RequestBody: {
         //     "kind": "HorizontalPodAutoscaler",
         //     "apiVersion": "autoscaling/v2beta1",
         //     "metadata": {
         //       "name": this.hpa.name,
         //       "namespace": this.hpa.value1,
         //       "labels": {
         //         "qcloud-app": this.hpa.name
         //       }
         //     },
         //     "spec": {
         //       "minReplicas":Number(this.hpa.vLeft) ,
         //       "maxReplicas": Number(this.hpa.vRight),
         //       "metrics": arr,
         //       "scaleTargetRef": {
         //         "apiVersion": "apps/v1beta2",
         //         "kind": kind,
         //         "name": this.hpa.value3
         //       }
         //     }
         //   },
         //   Version: "2018-05-25",
         // }
         // console.log(params)
         var params2={
            ClusterName: this.clusterId,
            Method: "POST",
            Path: "/apis/autoscaling/v2beta1/namespaces/"+ this.hpa.value1 +"/horizontalpodautoscalers",
            RequestBody: {
               "kind":"HorizontalPodAutoscaler",
               "apiVersion":"autoscaling/v2beta1",
               "metadata":{
                  "name":this.hpa.name,
                  "namespace":this.hpa.value1,
                  "labels":{"qcloud-app":this.hpa.name}},
                  "spec":{"minReplicas":Number(this.hpa.vLeft),"maxReplicas": Number(this.hpa.vRight),
                  "metrics":arr,
                  "scaleTargetRef":{"apiVersion":"apps/v1beta2","kind":kind,"name": this.hpa.value3}
                  }
            },
            Version: "2018-05-25",
         }
         this.axios.post(TKE_COLONY_QUERY, params2).then(res=>{
            console.log(res)
             if (res.Response.Error == undefined) {
                this.$router.push({
                   name:'hpaDetailEvent',
                   query:{
                      clusterId:this.clusterId
                   }
                })
             }
         })


       },


       //返回上一层
       goBack() {
         this.$router.go(-1);
       },
       removeDomain(domain, index) {
         // console.log(domain,index)
         //  var index = this.form.domains.indexOf(item)
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
