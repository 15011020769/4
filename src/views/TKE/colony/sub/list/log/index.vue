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
          <el-select v-model="value1" placeholder="请选择" size="mini" class="ml10">
            <el-option
              v-for="item in option1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="value2" placeholder="请选择" size="mini" class="ml10">
            <el-option
              v-for="item in option2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-model="value3"
            placeholder="请选择"
            size="mini"
            class="ml10"
            :disabled="value2==1?true:false"
          >
            <el-option
              v-for="item in option3"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
          <el-select v-model="value5" placeholder="请选择" size="mini" class="ml10">
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
          <el-switch v-model="flag" class="ml10"></el-switch>
          <el-select v-model="value6" placeholder="请选择" size="mini" class="ml10">
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
      <div class="box-black">1</div>
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
      option1: [
        {
          value: "tfy-pub",
          label: "tfy-pub"
        },
        {
          value: "default",
          label: "default"
        },
        {
          value: "kube-public",
          label: "kube-public"
        },
        {
          value: "kube-system",
          label: "kube-system"
        }
      ],
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
      option6: [],
      value1: "",
      value2: "",
      value3: "",
      value4: "",
      value5: "",
      value6: "",
      flag: false,
      loadShow: true, // 加载是否显示
    };
  },
  components: {
    HeadCom,
    SEARCH
  },
  created() {
    this.nameSpaceList();
  },
  methods: {
    //返回上一层
    goBack() {
      this.$router.go(-1);
    },
    nameSpaceList() {
      var params = {
        Method: "GET",
        Path: "/api/v1/namespaces",
        Version: "2018-05-25",
        ClusterName: this.$route.query.clusterId
      };
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          // console.log(mes);
          this.list = mes.items;
          this.total = mes.items.length;
          mes.items.forEach(item => {
            this.nsOptions.push({
              value: item.metadata.name,
              label: item.metadata.name
            });
          });
          this.loadShow = false;
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
      this.getKind();
    },
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  width: 100%;
  margin: 20px 0;
}
.item {
  margin: 4px;
}
.box-black {
  margin: 10px;
  background: black;
}
</style>

