 <!-- PersistentVolume-基本信息 -->
<template>
  <div class="colony-main" v-if="list">
    <div class="tke-card tke-formpanel-wrap">
      <h4 class="tke-formpanel-title">{{$t('TKE.overview.jbxx')}}</h4>
      <el-form class="tke-form" label-position="left" label-width="120px" size="mini">
        <el-form-item :label="$t('TKE.overview.mc')">
          <div class="tke-form-item_text">{{this.$route.query.resourceIns}}</div>
        </el-form-item>
        <!-- <el-form-item label="Labels">
          <div class="tke-form-item_text">-</div>
        </el-form-item>-->
        <el-form-item :label="$t('TKE.overview.zt')">
          <div class="tke-form-item_text">
            <span :class="[list.status.phase =='Pending'?'text-red':'text-green']" >{{list.status.phase}}</span>
          </div>
        </el-form-item>
        <el-form-item :label="$t('TKE.storage.fwqx')">
          <div class="tke-form-item_text">{{list.spec.accessModes[0]}}</div>
        </el-form-item>
        <el-form-item label="PVC">
          <div class="tke-form-item_text">{{list.spec.claimRef|claimsRefs}}</div>
        </el-form-item>
        <el-form-item label="StorageClass">
          <div class="tke-form-item_text">{{list.spec.storageClassName}}</div>
        </el-form-item>
        <el-form-item label="Storage">
          <div class="tke-form-item_text">{{list.spec.capacity.storage}}</div>
        </el-form-item>
        <el-form-item label="回收策略">
          <div class="tke-form-item_text">{{list.spec.persistentVolumeReclaimPolicy}}</div>
        </el-form-item>
        <el-form-item :label="$t('TKE.overview.cjsj')">
          <div class="tke-form-item_text">{{list.metadata.creationTimestamp|creationTimestamps}}</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ErrorTips } from "@/components/ErrorTips";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY, POINT_REQUEST } from "@/constants";
export default {
  name: "pvDetailInfo",
  data() {
    return {
      list: {}
    };
  },
  created() {
    this.GetPersistentVolume();
  },
  methods: {
    // 获取pv列表
    GetPersistentVolume() {
      const param = {
        ClusterName: this.$route.query.clusterId,
        Method: "GET",
        Path: "/api/v1/persistentvolumes/" + this.$route.query.resourceIns,
        Version: "2018-05-25"
      };
      this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error == undefined) {
          let data = JSON.parse(res.Response.ResponseBody);
          console.log(data);
          this.list = data;
        } else {
          this.$message({
            message: ErrorTips[res.Response.Error.code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    }
  },
  filters: {
    creationTimestamps: function(value) {
      var d = new Date(value);
      var n = d.getFullYear();
      var y = d.getMonth() + 1;
      var r = d.getDate();
      var h = d.getHours(); //12
      var m = d.getMinutes(); //12
      var s = d.getSeconds();
      h < 10 ? (h = "0" + h) : h;
      m < 10 ? (m = "0" + m) : m;
      return n + "-" + y + "-" + r + " " + h + ":" + m + ":" + s;
    },
    claimsRefs:function(value){
      if(value === undefined) {
        return '-'
      } else {
        return value.name
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

