 <!-- 日志 -->
<template>
  <div>
    <h2>{{$t('TKE.event.rz')}}</h2>
    <el-card class="box-card">
      <h3 style="margin-bottom:20px;">{{$t('TKE.event.tjsx')}}</h3>
      <el-form class="tke-form">
        <el-form-item :label="$t('TKE.overview.gzfzxx')">
          <el-tooltip
            class="item"
            effect="light"
            :content="$t('TKE.event.gzfzlxmmkj')"
            placement="right"
          >
            <i class="el-icon-info"></i>
          </el-tooltip>
          <el-select
            v-model="value1"
            :placeholder="$t('TKE.overview.qxz')"
            size="mini"
            class="ml10"
            @change="nameSpaceList2"
          >
            <!-- 命名空间 -->
            <el-option
              v-for="(item,index) in option1"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-model="value2"
            :placeholder="$t('TKE.event.qxzgzfzlx')"
            size="mini"
            class="ml10"
            @change="nameSpaceList2"
          >
            <!-- 工作负载类型 -->
            <el-option
              v-for="(item,index) in option2"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-model="value3"
            :placeholder="$t('TKE.event.qxzwork')"
            size="mini"
            class="ml10"
          >
            <!-- 工作负载实例 -->
            <el-option
              v-for="(item,index) in option3"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('TKE.event.podxx')">
          <el-tooltip class="item" effect="light" :content="$t('TKE.event.pscs')" placement="right">
            <i class="el-icon-info"></i>
          </el-tooltip>
          <el-select
            v-model="value4"
            :placeholder="$t('TKE.overview.qxz')"
            size="mini"
            class="ml10"
            @change="getPodData"
          >
            <!-- pod第一项 -->
            <el-option
              v-for="(item,index) in option4"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-model="value5"
            :placeholder="$t('TKE.overview.qxz')"
            :disabled="listNumFlag"
            size="mini"
            class="ml10"
            @change="getLog"
          >
            <!-- pod第二项 -->
            <el-option
              v-for="(item,index) in  Array.from(new Set(option5))"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('TKE.event.qtxx')">
          <span>{{$t('TKE.overview.zdsx')}}</span>
          <!-- 自动刷新 -->
          <el-switch v-model="autoRefresh" class="ml10" @change="refresh"></el-switch>
          <el-select
            v-model="value6"
            :placeholder="$t('TKE.overview.qxz')"
            size="mini"
            class="ml10"
            :disabled="listNumFlag"
          >
            <!-- 选择多少条数据 -->
            <el-option
              v-for="item in option6"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div class="box-black">
        <ul v-if="htmls==''">1.{{$t('TKE.event.zwrz')}}</ul>
        <ul v-else>
          <li
            v-for="(item,index) in htmls"
            :key="index"
            style="margin:10px 0"
          >{{index+1}}.&nbsp;&nbsp;{{item.str}}</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script type="text/javascript">
import HeadCom from "@/components/public/Head";
import SEARCH from "@/components/public/SEARCH";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
import { TKE_COLONY_LIST, TKE_COLONY_QUERY } from "@/constants/TKE-jz";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共错误码
export default {
  name: "create",
  data() {
    return {
      htmls: "",
      autoRefreshFlag: true, //自动刷新
      listNumFlag: true, //条数禁用
      option1: [],
      timeId: null,
      option2: [
        {
          value: "Deployment",
          label: "Deployment"
        },
        {
          value: "StatefulSet",
          label: "StatefulSet"
        },
        {
          value: "DaemonSet",
          label: "DaemonSet"
        },
        {
          value: "Job",
          label: "Job"
        }
      ],
      option3: [],
      option4: [],
      option5: [],
      option6: [
        {
          value: `${this.$t("TKE.event.xs")}100${this.$t("TKE.event.tsj")}`,
          label: `${this.$t("TKE.event.xs")}100${this.$t("TKE.event.tsj")}`
        },
        {
          value: `${this.$t("TKE.event.xs")}200${this.$t("TKE.event.tsj")}`,
          label: `${this.$t("TKE.event.xs")}200${this.$t("TKE.event.tsj")}`
        },
        {
          value: `${this.$t("TKE.event.xs")}500${this.$t("TKE.event.tsj")}`,
          label: `${this.$t("TKE.event.xs")}500${this.$t("TKE.event.tsj")}`
        },
        {
          value: `${this.$t("TKE.event.xs")}1000${this.$t("TKE.event.tsj")}`,
          label: `${this.$t("TKE.event.xs")}1000${this.$t("TKE.event.tsj")}`
        }
      ],
      value1: "default",
      value2: "Deployment",
      value3: "",
      value4: "",
      value5: "",
      value6: `${this.$t("TKE.event.xs")}100${this.$t("TKE.event.tsj")}`,
      autoRefresh: false, //自动刷新
      loadShow: true // 加载是否显示
    };
  },
  components: {
    HeadCom,
    SEARCH
  },
  watch: {
    // autoRefresh(val) {
    //   if (this.autoRefresh === true) {
    //     console.log("kq");
    //     var timeId = setInterval(() => {
    //       this.nameSpaceList();
    //     }, 40000);
    //   } else {
    //     console.log("gb");
    //     this.nameSpaceList();
    //   }
    // }
  },
  created() {
    this.nameSpaceList1();
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh() {
      if (this.autoRefresh === true) {
        this.timeId = setInterval(() => {
          this.nameSpaceList2();
        }, 20000);
      } else {
        clearInterval(this.timeId);
        this.nameSpaceList2();
      }
    },
    //返回上一层
    goBack() {
      this.$router.go(-1);
    },
    nameSpaceList1() {
       //第一项命名空间
      this.option3 = []; //工作负载实例
      this.option4 = [];
      this.option5 = [];
      var params = {
        Method: "GET",
        Path: "/api/v1/namespaces",
        Version: "2018-05-25",
        ClusterName: this.$route.query.clusterId
      };
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          this.option1 = []; //命名空间选项
          mes.items.forEach(item => {
            this.option1.push({
              value: item.metadata.name,
              label: item.metadata.name
            });
          });
          // this.getWorkload();
        } else {
          let ErrTips = {};
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
    nameSpaceList2() {
      //第二项命名空间
      this.option3 = []; //工作负载实例
      this.option4 = [];
      this.option5 = [];
       var v = this.value2;
      v = v.replace(v, this.value2.toLowerCase()) + "s";
      if (v === "jobs") {
        var params = {
          Method: "GET",
          Path: "/apis/batch/v1/namespaces/" + this.value1 + "/" + v,
          Version: "2018-05-25",
          ClusterName: this.$route.query.clusterId
        };
      } else {
        var params = {
          Method: "GET",
          Path: "/apis/apps/v1beta2/namespaces/" + this.value1 + "/" + v,
          Version: "2018-05-25",
          ClusterName: this.$route.query.clusterId
        };
      }
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          this.option1 = []; //命名空间选项
          mes.items.forEach(item => {
            this.option1.push({
              value: item.metadata.name,
              label: item.metadata.name
            });
          });
          // if(){
this.getWorkload();
          // }
          this.getWorkload();
        } else {
          let ErrTips = {};
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
    getPodData() {
      if (v != "") {
        var v = this.value3.replace(
          this.value3[0],
          this.value3[0].toLowerCase()
        );
      }
      var v1 = this.value2;
      v1 = v1.replace(v1, v1.toLowerCase()) + "s";
      var params = {
        Method: "GET",
        Path:
          "/apis/apps/v1beta2/namespaces/" +
          this.value1 +
          "/" +
          v1 +
          "/" +
          v +
          "/pods",
        Version: "2018-05-25",
        ClusterName: this.$route.query.clusterId
      };
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        this.option5 = [];
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          if (mes.items.length > 0) {
            this.option4 = [];
            mes.items.forEach(item => {
              this.option4.push({
                value: item.metadata.name,
                label: item.metadata.name
              });
            });
            this.value4 = this.option4[0].value;
          } else {
            this.option4 = [];
            this.value4 = "Pod" + this.$t("TKE.event.lbwk");
            return;
          }
          if (mes.items.length > 0) {
            this.option5 = [];
            mes.items.forEach(item => {
              item.spec.containers.forEach(i => {
                this.option5.push({
                  value: i.name,
                  label: i.name
                });
              });
            });
            this.value5 = this.option5[0].value;
            this.autoRefresh = true;
            this.getLog();
          } else {
            this.option5 = [];
            this.value5 = "Container" + this.$t("TKE.event.lbwk");
            return;
          }
          this.loadShow = false;
        } else {
          let ErrTips = {};
          this.option5 = [];
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
    getWorkload() {
      var v = this.value2;
      v = v.replace(v, this.value2.toLowerCase()) + "s";
      // if (
      //   v === "jobs" ||
      //   v === "statefulsets" ||
      //   this.value1 === "kube-node-lease" ||
      //   this.value1 === "kube-public"
      // ) {
      //   this.option3 = []; //工作负载实例
      //   this.option4 = [];
      //   this.option5 = [];
      //   this.value3 = "Workload" + this.$t("TKE.event.lbwk");
      //   this.value4 = "Pod" + this.$t("TKE.event.lbwk");
      //   this.value5 = "Container" + this.$t("TKE.event.lbwk");
      //   this.htmls = "";
      //   this.autoRefresh = false;
      //   var params = {
      //     Method: "GET",
      //     Path: "/apis/batch/v1/namespaces/" + this.value1 + "/" + v,
      //     Version: "2018-05-25",
      //     ClusterName: this.$route.query.clusterId
      //   };
      // } else
      if (v === "jobs") {
        var params = {
          Method: "GET",
          Path: "/apis/batch/v1/namespaces/" + this.value1 + "/" + v,
          Version: "2018-05-25",
          ClusterName: this.$route.query.clusterId
        };
      } else {
        var params = {
          Method: "GET",
          Path: "/apis/apps/v1beta2/namespaces/" + this.value1 + "/" + v,
          Version: "2018-05-25",
          ClusterName: this.$route.query.clusterId
        };
      }

      console.log(params);
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          if (mes === []) {
            this.value3 = "Workload" + this.$t("TKE.event.lbwk");
            this.value4 = "Pod" + this.$t("TKE.event.lbwk");
            this.value5 = "Container" + this.$t("TKE.event.lbwk");
            this.option3 = []; ////工作负载实例
            this.option4 = [];
            this.option5 = [];
            this.htmls = "";

            this.autoRefresh = false;
            this.listNumFlag = true;
            return;
          } else {
            this.option3 = []; ////工作负载实例
            mes.items.forEach(item => {
              this.option3.push({
                value: item.metadata.name,
                label: item.metadata.name
              });
            });
            // console.log(this.option3[0].value);
            if (this.option3[0].value != "") {
              this.value3 = this.option3[0].value;
            }
            this.listNumFlag = false;
            this.getPodData();
          }
        } else {
          let ErrTips = {};
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
    async getLog() {
      var params = {
        Method: "GET",
        Path:
          "/api/v1/namespaces/" +
          this.value1 +
          "/pods/" +
          this.value4 +
          "/log?container=" +
          this.value5 +
          "&timestamps=" +
          this.autoRefresh +
          "&tailLines=" +
          this.value6.replace(/[^\d]/g, ""),
        Version: "2018-05-25",
        ClusterName: this.$route.query.clusterId
      };
      await this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = res.Response.ResponseBody;
          var newarrs = [];
          var data = mes.substring(0, 4);
          mes
            .split(data)
            .slice(1)
            .forEach((x, y) => {
              newarrs.push({ str: data + x });
            });
          this.htmls = newarrs;
          this.loadShow = false;
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    }
  },
  destroyed() {
    clearInterval(this.timeId);
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  width: 100%;
  height: auto;
  margin: 20px 0;
}
.item {
  margin: 4px;
}
.box-black {
  // height: 100%;
  min-height: 400px;
  margin: 10px;
  padding: 10px 20px;
  color: #fff;
  background: #272822;
}
</style>

