 <!-- 日志 -->
<template>
  <div>
    <h2>日志</h2>
    <el-card class="box-card">
      <h3 style="margin-bottom:20px;">条件筛选</h3>
      <el-form class="tke-form">
        <el-form-item label="工作负载选项">
          <el-tooltip
            class="item"
            effect="light"
            content="工作负载类型、命名空间、Workload实例"
            placement="right"
          >
            <i class="el-icon-info"></i>
          </el-tooltip>
          <el-select
            v-model="value1"
            placeholder="请选择"
            size="mini"
            class="ml10"
            @change="nameSpaceList()"
          >
            <el-option
              v-for="item in option1"
              :key="item.metadata.name"
              :label="item.metadata.name"
              :value="item.metadata.name"
            ></el-option>
          </el-select>
          <el-select
            v-model="value2"
            placeholder="请选择工作负载类型"
            size="mini"
            class="ml10"
            @change="getWorkload()"
          >
            <el-option
              v-for="item in option2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-model="value3"
            placeholder="请选择Workload"
            size="mini"
            class="ml10"
            :disabled="value2==1?true:false"
            @change="getPod"
          >
            <el-option
              v-for="item in option3"
              :key="item.metadata.name"
              :label="item.metadata.name"
              :value="item.metadata.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Pod选项">
          <el-tooltip class="item" effect="light" content="Pod实例、Container实例" placement="right">
            <i class="el-icon-info"></i>
          </el-tooltip>
          <el-select v-model="value4" placeholder="请选择" size="mini" class="ml10">
            <el-option
              v-for="item in option4"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-model="value5"
            placeholder="请选择"
            :disabled="listNumFlag"
            size="mini"
            class="ml10"
          >
            <el-option
              v-for="item in option5"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="其他选项">
          <span>自动刷新</span>
          <el-switch v-model="autoRefresh" class="ml10"></el-switch>
          <el-select
            v-model="value6"
            placeholder="请选择"
            size="mini"
            class="ml10"
            :disabled="listNumFlag"
          >
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
        <ul v-if="htmls==''">1.暂无日志</ul>
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

<script>
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
      listNumFlag: true, //条数禁用
      option1: [],
      option2: [
        {
          value: 1,
          label: "请选择工作负载类型"
        },
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
          value: "显示100条数据",
          label: "显示100条数据"
        },
        {
          value: "显示200条数据",
          label: "显示200条数据"
        },
        {
          value: "显示500条数据",
          label: "显示500条数据"
        },
        {
          value: "显示1000条数据",
          label: "显示1000条数据"
        }
      ],
      value1: "default",
      value2: "Deployment",
      // value3: "Workload列表为空",
      value3: "",
      value4: "Pod列表为空",
      value5: "Container列表为空",
      value6: "显示100条数据",
      autoRefresh: true, //自动刷新
      loadShow: true // 加载是否显示
    };
  },
  components: {
    HeadCom,
    SEARCH
  },
  created() {
    this.nameSpaceList();
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh() {
      if (this.autoRefresh === true) {
        var timeId = setInterval(() => {
          this.nameSpaceList();
          window.clearInterval(timeId);
        }, 20000);
      } else {
        window.clearInterval(timeId);
      }
    },
    getDefault() {
      // this.getWorkload();
    },
    getPod() {
      this.getPodData();
    },
    //返回上一层
    goBack() {
      this.$router.go(-1);
    },
    nameSpaceList() {
      //第一项命名空间
      this.loadShow = true;
      var params = {
        Method: "GET",
        Path: "/api/v1/namespaces",
        Version: "2018-05-25",
        ClusterName: this.$route.query.clusterId
      };
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody).items;
          this.option1 = mes;
          this.loadShow = false;
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
    getLog() {
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
      console.log(params);
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
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
    },
    getPodData() {
      var v = this.value3;
      v = v.replace(v[0], v[0].toLowerCase());
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
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          if (mes.items != []) {
            this.option4 = [];
            mes.items.forEach(item => {
              this.option4.push({
                value: item.metadata.name,
                label: item.metadata.name
              });
            });
            this.value4 = this.option4[0].value;
          } else {
            this.value4 = "Pod列表为空";
            return;
          }
          if (mes.items != []) {
            this.option5 = [];
            mes.items.forEach(item => {
              item.spec.containers.map(i => {
                return this.option5.push({
                  value: i.name,
                  label: i.name
                });
              });
            });
            this.value5 = this.option5[0].value;
            this.getLog();
          } else {
            this.value5 = "Container列表为空";
          }
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
    },
    getWorkload() {
      var v = this.value2;
      v = v.replace(v, v.toLowerCase()) + "s";
      if (v == "jobs") {
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
          var mes = JSON.parse(res.Response.ResponseBody).items;
          this.option3 = mes;
          if (mes === []) {
            this.value3 = "Workload列表为空";
            this.value4 = "Pod列表为空";
            this.value5 = "Container列表为空";
            this.listNumFlag = true;
            return;
          } else {
            this.listNumFlag = false;
            this.value3 = mes[0].metadata.name;
            
            this.getPodData();
          }
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
  height: 100%;
  margin: 10px;
  padding: 10px 20px;
  color: #fff;
  background: #272822;
}
</style>

