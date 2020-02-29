 <!-- Secret-基本信息 -->
<template>
  <div class="colony-main">
    <div class="tke-card tke-formpanel-wrap">
      <h4 class="tke-formpanel-title">基本信息</h4>
      <el-form class="tke-form" label-position="left" label-width="120px" size="mini">
        <el-form-item label="名称">
          <div class="tke-form-item_text">{{Info.name}}</div>
        </el-form-item>
        <el-form-item label="Namespace">
          <div class="tke-form-item_text">{{Info.np}}</div>
        </el-form-item>
        <el-form-item label="类型">
          <div class="tke-form-item_text" v-if="this.secretData.type">Opaque</div>
        </el-form-item>
        <el-form-item label="Labels">
          <div
            class="tke-form-item_text"
            v-if="Info.labels"
          >{{Object.keys(Info.labels).toString()}}:{{Object.values(Info.labels).toString()}}</div>
          <div class="tke-form-item_text" v-else>-</div>
        </el-form-item>
        <el-form-item label="创建时间">
          <div class="tke-form-item_text">
            {{Info.time.substring(0,10)}}
            {{Info.time.substring(11,19)}}
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共错误码
import { ALL_CITY, TKE_COLONY_QUERY } from "@/constants";
export default {
  name: "secretDetailInfo",
  data() {
    return {
      secretData: {},
      clusterId: "",
      Info: {
        name: "",
        np: "",
        labels:"",
        time:""
      }
    };
  },
  components: {},
  created() {
    // 从路由获取类型
    this.clusterId = this.$route.query.clusterId;
    console.log(this.$route.query);
    if (this.$route.query.name && this.$route.query.np) {
      this.Info.name = this.$route.query.name;
      this.Info.np = this.$route.query.np;
    }
    this.getData();
  },
  methods: {
    getData() {
      if (
        this.$route.query.clusterId &&
        this.$route.query.name &&
        this.$route.query.np
      ) {
        var params = {
          Method: "GET",
          Path:
            "/api/v1/namespaces/" +
            this.$route.query.np +
            "/secrets/" +
            this.$route.query.name,
          Version: "2018-05-25",
          ClusterName: this.$route.query.clusterId
        };
        console.log(params);
        this.axios.post(TKE_COLONY_QUERY, params).then(res => {
          if (res.Response.Error === undefined) {
            var mes = JSON.parse(res.Response.ResponseBody);
            console.log(mes);
            this.Info.labels = mes.metadata.labels;
            this.Info.time = mes.metadata.creationTimestamp;
            this.secretData = mes;
          } else {
            let ErrTips = {};
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 2000
            });
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

