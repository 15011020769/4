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
          <!-- 工作负载选项名 -->
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
            @change="changepod"
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
            @change="getPodData1"
          >
            <!-- pod第一项 -->
            <el-option
              v-for="(item,index) in option4"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
            <!-- :disabled="listNumFlag" -->
          <el-select
            v-model="value5"
            :placeholder="$t('TKE.overview.qxz')"
            size="mini"
            class="ml10"
          >
            <!-- pod第二项 -->
            <el-option
              v-for="(item,index) in  option5"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('TKE.event.qtxx')">
          <span>{{$t('TKE.overview.zdsx')}}</span>
          <!-- 自动重新整理 -->
          <el-switch v-model="autoRefresh" class="ml10" @change="refresh"></el-switch>
          <el-select
            v-model="value6"
            :placeholder="$t('TKE.overview.qxz')"
            size="mini"
            class="ml10"
            @change="getLog()"
            :disabled="value4=='Pod'+$t('TKE.event.lbwk')"
          >
            <!-- :disabled="listNumFlag" -->
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
      autoRefreshFlag: true, //自动重新整理
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
      autoRefresh: false, //自动重新整理
      loadShow: true, // 加载是否显示
      podList: []
    };
  },
  components: {
    HeadCom,
    SEARCH
  },
  watch: {
    autoRefresh(val) {
      if (val) {
        this.timeId = setInterval(() => {
          this.getLog();
        }, 1000 * 10);
      } else {
        clearInterval(this.timeId); 
      }
    },
    deep:true,
    immediate :true
  },
  created() {
    this.nameSpaceList1();
    this.nameSpaceList2();
    
  },
  mounted() {
    // this.refresh();
  },
  methods: {
    refresh() {
      if (this.autoRefresh) {
        this.timeId = setInterval(() => {
          if (this.option3.length == 0) {
            this.getLog();
          } 
        }, 100000*20);
      } else {
        clearInterval(this.timeId);
      }
    },
    //返回上一层
    goBack() {
      this.$router.go(-1);
    },
    changepod() {
      this.getPodData();
    },
    //获取命名空间列表数据
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
          this.autoRefresh = true;
          var mes = JSON.parse(res.Response.ResponseBody);
          // this.option1 = []; //命名空间选项
          mes.items.forEach(item => {
            this.option1.push({
              value: item.metadata.name,
              label: item.metadata.name
            });
          });
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
    //获取工作负载列表数据
    async  nameSpaceList2() {
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
    await  this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          if (mes.items.length > 0) {
            mes.items.forEach(item => {
              this.option3.push({
                value: item.metadata.name,
                label: item.metadata.name
              });
            });
            this.value3=this.option3[0].value
            this.getPodData();
          } else {
            this.option3 = []; //工作负载实例
            this.option4 = [];
            this.option5 = [];
            this.value3 = "Workload" + this.$t("TKE.event.lbwk");
            this.value4 = "Pod" + this.$t("TKE.event.lbwk");
            this.value5 = "Container" + this.$t("TKE.event.lbwk");
            this.htmls = "";
            this.autoRefresh = false;
            // this.refresh();
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
    getPodData1() {
      let podList = this.podList || [];
      if(podList.length > 0) {
        this.option5 = [];
        podList.forEach(item => {
          if(item.metadata.name === this.value4) {
            item.spec.containers.forEach(i => {
              this.option5.push({
                value: i.name,
                label: i.name
              });
            });
          }
        })
        this.value5 = this.option5[0].value;
      }
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
      var  params;
      if(this.value2=='Job'){
         params = {
          Method: "GET",
          Path: `/apis/batch/v1/namespaces/${this.value1}/jobs/${v}/pods`,
          Version: "2018-05-25",
          ClusterName: this.$route.query.clusterId
        };
      }else{
         params = {
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
      }
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        this.option5 = [];
        if (res.Response.Error === undefined) {
          this.podList = [];
          var mes = JSON.parse(res.Response.ResponseBody);
          this.podList = mes.items;
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
              if(item.metadata.name === this.value4) {
                item.spec.containers.forEach(i => {
                  this.option5.push({
                    value: i.name,
                    label: i.name
                  });
                });
              }
            });
            this.value5 = this.option5[0].value;
            // this.autoRefresh = true;
            // this.refresh();
            this.getLog();
          } else {
            this.option5 = [];
            this.value5 = "Container" + this.$t("TKE.event.lbwk");
            return;
          }
          this.loadShow = false;
        } else {
           this.value4 = "Pod" + this.$t("TKE.event.lbwk");
          this.value5 = "Container" + this.$t("TKE.event.lbwk");
          // let ErrTips = {};
          // this.option5 = [];
          // let ErrOr = Object.assign(ErrorTips, ErrTips);
          // this.$message({
          //   message: ErrOr[res.Response.Error.Code],
          //   type: "error",
          //   showClose: true,
          //   duration: 0
          // });
        }
      });
    },

    //获取容器列表数据
    getContainers() {
      param = {
        Method: "GET",
        Path: `/apis/apps/v1beta2/namespaces/${this.value1}/${this.value2}/${this.value3}/pods`,
        Version: "2018-05-25",
        ClusterName: this.$route.query.clusterId
      }
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
          "&timestamps=true" +
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
          this.htmls=''
          // let ErrTips = {};
          // let ErrOr = Object.assign(ErrorTips, ErrTips);
          // this.$message({
          //   message: ErrOr[res.Response.Error.Code],
          //   type: "error",
          //   showClose: true,
          //   duration: 0
          // });
        }
      });
    }
  },
  //销毁定时器
  beforeDestroy(){
    if(this.timeId) { //如果定时器在运行则关闭
      clearInterval(this.timeId); 
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
  // height: 100%;
  min-height: 400px;
  margin: 10px;
  padding: 10px 20px;
  color: #fff;
  background: #272822;
}
</style>

