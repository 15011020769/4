 <!-- 事件 -->
<template>
  <div style="height: 400px;">
    <subTitle title="事件" />
    <div class="tke-card tke-formpanel-wrap">
      <h4 class="tke-formpanel-title">{{$t('TKE.event.tjsx')}}</h4>
      <el-form class="tke-form" label-position="left" label-width="120px" size="mini">
        <el-form-item :label="$t('TKE.overview.mmkj')">
          <el-select v-model="nsValue" :placeholder="$t('TKE.event.qxzmmkj')" @change="getKind">
            <el-option
              v-for="item in nsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('TKE.overview.lx')">
          <el-select
            v-model="typeValue"
            filterable
            :placeholder="$t('TKE.event.qxzlx')"
            @change="getEventList"
          >
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('TKE.overview.mc')">
          <el-select
            v-model="nameValue"
            :placeholder="$t('TKE.event.qxzmc')"
            :disabled="nameFlag"
            @change="getNameList"
          >
            <el-option
              v-for="item in nameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('TKE.event.qyxx')">
          <div class="tke-form-item_text">
            <span>{{$t('TKE.overview.zdsx')}}</span>
            <el-switch v-model="autoRefresh" class="ml10"></el-switch>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据列表展示 -->
    <div class="tke-card mt10">
      <el-table :data="list" v-loading="loadShow" style="width: 100%">
        <el-table-column :label="$t('TKE.event.sccxsj')">
          <template slot-scope="scope">
            <p>{{scope.row.firstTimestamp}}</p>
          </template>
        </el-table-column>
        <el-table-column :label="$t('TKE.event.zhcxsj')">
          <template slot-scope="scope">
            <p>{{scope.row.lastTimestamp}}</p>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('TKE.event.jb')">
          <template slot-scope="scope">
            <span v-if="scope.row.type=='Warning'" class="text-red">{{scope.row.type}}</span>
            <span v-if="scope.row.type=='Normal'">{{scope.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('TKE.event.zylx')">
          <template slot-scope="scope">
            <span v-if="scope.row.involvedObject.kind">{{scope.row.involvedObject.kind}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('TKE.event.zymc')">
          <template slot-scope="scope">
            <span>{{scope.row.metadata.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="内容">
          <template slot-scope="scope">
            <span>{{scope.row.reason}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nodeTotal" :label="$t('TKE.event.xxms')">
          <template slot-scope="scope">
            <p>{{scope.row.message}}</p>
          </template>
        </el-table-column>
        <el-table-column prop :label="$t('TKE.event.cxcs')">
          <template slot-scope="scope">
            <p>{{scope.row.count}}</p>
          </template>
        </el-table-column>
      </el-table>

      <div class="tke-page">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            :pager-count="7"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import subTitle from "@/views/TKE/components/subTitle";
import Loading from "@/components/public/Loading";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共错误码
import { ALL_CITY, POINT_REQUEST, TKE_COLONY_QUERY } from "@/constants";
export default {
  name: "colonyEvent",
  data() {
    return {
      loadShow: false, //加载是否显示
      list: [], //列表
      total: 0,
      pageSize: 10,
      pageIndex: 0,
      multipleSelection: [],
      nsOptions: [],
      nsValue: "default",
      nameFlag: true,
      timeId: null,
      typeOptions: [
        {
          value: "全部類型",
          label: "全部類型"
        },
        {
          value: "cronjob",
          label: "CronJob"
        },
        {
          value: "daemonset",
          label: "DaemonSet"
        },
        {
          value: "deployment",
          label: "Deployment"
        },
        {
          value: "ingress",
          label: "Ingress"
        },
        {
          value: "job",
          label: "Job"
        },
        {
          value: "node",
          label: "Node"
        },
        {
          value: "pods",
          label: "Pod"
        },
        {
          value: "pv",
          label: "PersistentVolume"
        },
        {
          value: "pvc",
          label: "PersistentVolumeClaim"
        },
        {
          value: "sc",
          label: "StorageClass"
        },
        {
          value: "statefulset",
          label: "StatefulSet"
        },
        {
          value: "svc",
          label: "Service"
        }
      ],
      typeValue: "全部類型",
      nameOptions: [],
      nameValue: "",
      autoRefresh: false
    };
  },

  created() {
    this.nameSpaceList();
    this.refresh();
  },
  methods: {
    refresh() {
      this.nsOptions = [];
      if (this.autoRefresh == true) {
        this.timeId = setInterval(() => {
          this.getKind();
        }, 1000);
      } else {
        window.clearInterval(this.timeId);
        this.nsOptions = [];
        this.getKind();
      }
    },
    // 初始化命名空间获取的列表事件
    nameSpaceList() {
      this.loadShow = true;
      var params = {
        Method: "GET",
        Path: "/api/v1/namespaces",
        Version: "2018-05-25",
        ClusterName: this.$route.query.clusterId
      };
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        if (res.Response.Error === undefined) {
          this.list = [];
          this.nsOptions = [];
          var mes = JSON.parse(res.Response.ResponseBody);
          if (mes.items.length > 0) {
            this.total = mes.items.length;
            mes.items.forEach(item => {
              this.nsOptions.push({
                value: item.metadata.name,
                label: item.metadata.name
              });
            });
          }
          this.getKind();
          this.loadShow = false;
        } else {
          this.list = [];
          let ErrTips = {};
          this.loadShow = false;
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
    getKind() {
      //改变命名空间获取的数据
      this.loadShow = true;
      var params = {
        Method: "GET",
        Path: "/api/v1/namespaces/" + this.nsValue + "/events?&limit=20",
        Version: "2018-05-25",
        ClusterName: this.$route.query.clusterId
      };
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        this.list = [];
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          this.list = mes.items;
          console.log(this.list);
          this.total = mes.items.length;
          this.loadShow = false;
        } else {
          let ErrTips = {};
          this.list = [];
          this.loadShow = false;
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
    getEventList() {
      //事件列表
      this.loadShow = true;
      var typeValues = this.typeValue;
      if (typeValues.charAt(typeValues.length - 1) == "s") {
        typeValues =
          typeValues.replace(typeValues[0], typeValues[0].toLowerCase()) + "es";
      } else {
        typeValues =
          typeValues.replace(typeValues[0], typeValues[0].toLowerCase()) + "s";
      }

      // console.log(this.typeValue);
      var params = {};
      if (
        this.typeValue == "daemonset" ||
        this.typeValue == "deployment" ||
        this.typeValue == "statefulset"
      ) {
        // /apis/apps/v1beta2/namespaces/default/daemonsets
        params.Path =
          "/apis/apps/v1beta2/namespaces/" + this.nsValue + "/" + typeValues;
      } else if (this.typeValue == "cronjob") {
        // Path: "/apis/batch/v1beta1/namespaces/default/cronjobs"
        params.Path =
          "/apis/batch/v1beta1/namespaces/" + this.nsValue + "/" + typeValues;
      } else if (this.typeValue == "ingress") {
        //  /apis/extensions/v1beta1/namespaces/default/ingresses
        params.Path =
          "/apis/extensions/v1beta1/namespaces/" +
          this.nsValue +
          "/" +
          typeValues;
      } else if (this.typeValue == "job") {
        // /apis/batch/v1/namespaces/default/jobs
        params.Path =
          "/apis/batch/v1/namespaces/" + this.nsValue + "/" + typeValues;
      } else if (this.typeValue == "node") {
        // /api/v1/nodes
        params.Path = "/api/v1/" + typeValues;
      } else if (this.typeValue == "pv") {
        // /api/v1/nodes
        params.Path = "/api/v1/persistentvolumes";
      } else if (this.typeValue == "pods") {
        // /api/v1/namespaces/default/pods
        params.Path =
          "/api/v1/namespaces/" + this.nsValue + "/" + this.typeValue;
      } else if (this.typeValue == "pvc") {
        params.Path =
          "/api/v1/namespaces/" + this.nsValue + "/persistentvolumeclaims";
      } else if (this.typeValue == "svc") {
        params.Path = "/api/v1/namespaces/" + this.nsValue + "/services";
      } else if (this.typeValue == "sc") {
        // /apis/storage.k8s.io/v1/storageclasses
        params.Path = "/apis/storage.k8s.io/v1/storageclasses";
      }
      params.Method = "GET";
      params.ClusterName = this.$route.query.clusterId;
      params.Version = "2018-05-25";

      var params1 = {
        Path:
          "/api/v1/namespaces/" +
          this.nsValue +
          "/events?fieldSelector=involvedObject.kind=" +
          this.typeValue.charAt(0).toUpperCase() +
          this.typeValue.slice(1) +
          "&limit=20"
      };
      params1.Method = "GET";
      params1.ClusterName = this.$route.query.clusterId;
      params1.Version = "2018-05-25";

      console.log(this.typeValue, params);
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        this.nameOptions = [];
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          console.log(mes);
          // this.list = mes.items;
          // this.total = mes.items.length;
          if (mes.items.length > 0) {
            mes.items.forEach(item => {
              this.nameOptions.push({
                value: item.metadata.name,
                label: item.metadata.name
              });
            });
            this.nameFlag = false;
          } else {
            this.nameFlag = true;
          }
          this.loadShow = false;
        } else {
          let ErrTips = {};
          this.nameOptions = [];
          this.loadShow = false;
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });

      this.axios.post(TKE_COLONY_QUERY, params1).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          this.list = mes.items;
          this.total = mes.items.length;
          this.loadShow = false;
        } else {
          let ErrTips = {};
          this.loadShow = false;
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
    getNameList() {
      // /api/v1/namespaces/default/events?fieldSelector=involvedObject.kind=DaemonSet,involvedObject.name=workload57&limit=20
      var params1 = {
        Path:
          "/api/v1/namespaces/" +
          this.nsValue +
          "/events?fieldSelector=involvedObject.kind=" +
          this.typeValue.charAt(0).toUpperCase() +
          this.typeValue.slice(1) +
          ",involvedObject.name=" +
          this.nameValue +
          "&limit=20"
      };
      params1.Method = "GET";
      params1.ClusterName = this.$route.query.clusterId;
      params1.Version = "2018-05-25";

      console.log(params1);
      this.axios.post(TKE_COLONY_QUERY, params1).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          this.list = mes.items;
          this.total = mes.items.length;
          this.loadShow = false;
        } else {
          let ErrTips = {};
          this.loadShow = false;
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
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val - 1;
      // this.getEventList();
      this.pageIndex += 1;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      // this.getEventList();
    }
  },
  components: {
    subTitle,
    Loading
  },
  destroyed() {
    window.clearInterval(this.timeId);
  }
};
</script>

<style lang="scss" scoped>
</style>

