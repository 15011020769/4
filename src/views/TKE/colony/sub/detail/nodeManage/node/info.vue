 <!-- 节点-基本信息 -->
 <template>
   <div class="colony-main">
     <div class="tke-card tke-formpanel-wrap">
       <h4 class="tke-formpanel-title">{{$t('TKE.subList.zjxx')}}</h4>
       <el-form class="tke-form" label-position='left' label-width="120px" size="mini">
         <el-form-item :label="`${$t('TKE.overview.jd')}ID`">
           <div class="tke-form-item_text">
             <span>
               <a :href="'../CVM/index.html#/cloudHost/cloudHostDetail/'+detail.InstanceId+'/1'" target="_self">
                 {{detail.InstanceId}}
               </a>
             </span>
           </div>
         </el-form-item>
         <el-form-item :label="$t('TKE.overview.zt')">
           <div class="tke-form-item_text"><span class="text-green"></span>{{detail.status}}</div>
         </el-form-item>
         <el-form-item label="地域">
           <div class="tke-form-item_text">{{$t('TKE.storage.gatdqtwtb')}}</div>
         </el-form-item>
         <el-form-item :label="$t('TKE.colony.kyq')">
           <div class="tke-form-item_text">{{$t('TKE.colony.tbyq')}}</div>
         </el-form-item>
         <el-form-item label="配置">
           <div class="tke-form-item_text">
             <span class="text-gray">CPU:</span> {{detail.CPU}} 核，
             <span class="text-gray">内存:</span> {{detail.Memory}} GB，
             <span class="text-gray">{{$t('TKE.colony.dk')}}:</span> 1 Mbps，
             <span class="text-gray">{{$t('TKE.colony.xtp')}}:</span> {{detail.SystemDisk.DiskSize}} GB({{$t('TKE.colony.gxnyp')}})</div>
         </el-form-item>
         <el-form-item label="IP地址">
           <div class="tke-form-item_text">
             <p>{{detail.PrivateIpAddresses[0]}} ({{$t('TKE.colony.ww')}})</p>
             <p>{{detail.PublicIpAddresses[0]}} ({{$t('TKE.colony.nw')}})</p>
           </div>
         </el-form-item>
         <el-form-item :label="$t('TKE.colony.czxt')">
           <div class="tke-form-item_text">{{detail.OsName}}</div>
         </el-form-item>
         <el-form-item :label="$t('TKE.overview.cjsj')">
           <div class="tke-form-item_text">{{detail.addTime}}</div>
         </el-form-item>
       </el-form>
     </div>

     <!-- <div class="tke-card tke-formpanel-wrap mt10">
      <h4  class="tke-formpanel-title">Kubernetes信息</h4>
      <el-form  class="tke-form" label-position='left' label-width="150px" size="mini">
        <el-form-item label="Kubernetes Labels">
          <div class="tke-form-item_text">
            beta.kubernetes.io/arch：amd64 <br>
            beta.kubernetes.io/instance-type：QCLOUD<br>
            beta.kubernetes.io/os：linux<br>
            cloud.tencent.com/auto-scaling-group-id：asg-p3mt06kq<br>
            cloud.tencent.com/node-instance-id：ins-5ic5rvb2<br>
            failure-domain.beta.kubernetes.io/region：tpe<br>
            failure-domain.beta.kubernetes.io/zone：390001<br>
            kubernetes.io/hostname：10.0.128.8
          </div>
        </el-form-item>
        <el-form-item label="Kubernetes Annotations">
          <div class="tke-form-item_text">
            node.alpha.kubernetes.io/ttl：0 <br>
            volumes.kubernetes.io/controller-managed-attach-detach：true
          </div>
        </el-form-item>
        <el-form-item label="已分配资源">
          <div class="tke-form-item_text">
            <span class="text-gray">CPU:</span> 0.81 核，
            <span class="text-gray">内存:</span> 0.55 GB
          </div>
        </el-form-item>
        <el-form-item label="总可分配资源">
          <div class="tke-form-item_text">
            <span class="text-gray">CPU:</span> 0.94 核，
            <span class="text-gray">内存:</span> 0.59 GB
          </div>
        </el-form-item>
        <el-form-item label="容器运行时版本">
          <div class="tke-form-item_text">docker://18.6.3</div>
        </el-form-item>
        <el-form-item label="Kubelet版本">
          <div class="tke-form-item_text">v1.10.5-tke.6</div>
        </el-form-item>
        <el-form-item label="KubeProxy版本">
          <div class="tke-form-item_text">v1.10.5-tke.6</div>
        </el-form-item>
      </el-form>
    </div> -->
   </div>
 </template>

 <script>
   import FileSaver from "file-saver";
   import XLSX from "xlsx";
   import {
     ALL_CITY
   } from "@/constants";
   export default {
     name: "nodeDetailInfo",
     data() {
       return {
         detail: {}
       };
     },
     components: {

     },
     created() {
       // 从路由获取类型
       this.detail = this.$route.query.detail;
     },
     methods: {

     }
   };

 </script>

 <style lang="scss" scoped>




 </style>
