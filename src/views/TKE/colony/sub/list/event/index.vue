 <!-- 事件 -->
<template>
  <div>
    <subTitle title="事件" />
    <div class="tke-card tke-formpanel-wrap">
      <h4 class="tke-formpanel-title">条件筛选</h4>
      <el-form class="tke-form" label-position="left" label-width="120px" size="mini">
        <el-form-item label="命名空间">
          <el-select v-model="nsValue" placeholder="请选择" @change="getKind">
            <el-option
              v-for="item in nsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="typeValue" filterable placeholder="请选择" @change="getEventList">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-select v-model="nameValue" placeholder="请选择" :disabled="nameFlag">
            <el-option
              v-for="item in nameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="其余选项">
          <div class="tke-form-item_text">
            <span>自动刷新</span>
            <el-switch v-model="autoRefresh" class="ml10"></el-switch>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据列表展示 -->
    <div class="tke-card mt10">
      <el-table :data="list" v-loading="loadShow" style="width: 100%">
        <el-table-column label="首次出现时间">
          <template slot-scope="scope">
            <p>{{scope.row.firstTimestamp}}</p>
          </template>
        </el-table-column>
        <el-table-column label="最后出现时间">
          <template slot-scope="scope">
            <p>{{scope.row.lastTimestamp}}</p>
          </template>
        </el-table-column>
        <el-table-column prop label="级别">
          <template slot-scope="scope">
            <span v-if="scope.row.type=='Warning'" class="text-red">{{scope.row.type}}</span>
            <span v-if="scope.row.type=='Normal'">{{scope.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="资源类型">
          <template slot-scope="scope">
            <span>{{scope.row.involvedObject.kind}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="资源名称">
          <template slot-scope="scope">
            <span>{{scope.row.metadata.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="内容">
          <template slot-scope="scope">
            <span>{{scope.row.reason}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nodeTotal" label="详细描述">
          <template slot-scope="scope">
            <p>{{scope.row.message}}</p>
          </template>
        </el-table-column>
        <el-table-column prop label="出现次数">
          <template slot-scope="scope">
            <p>{{scope.row.count}}</p>
          </template>
        </el-table-column>
      </el-table>

      <div class="tke-page">
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
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
      typeOptions: [
        {
          value: "全部类型",
          label: "全部类型"
        },
        {
          value: "CronJob",
          label: "CronJob"
        },
        {
          value: "DaemonSet",
          label: "DaemonSet"
        },
        {
          value: "Deployment",
          label: "Deployment"
        },
        {
          value: "Ingress",
          label: "Ingress"
        }
      ],
      typeValue: "全部类型",
      nameOptions: [
        {
          value: "aaa",
          label: "aaa"
        },
        {
          value: "bbb",
          label: "bbb"
        }
      ],
      nameValue: "",
      autoRefresh: true
    };
  },

  created() {
    // this.getEventList();
    this.nameSpaceList();
    // this.getKind();
    this.refresh();
  },
  methods: {
    refresh() {
      this.nsOptions = [];
      if (this.autoRefresh == true) {
        var timeId = setInterval(() => {
          this.nameSpaceList();
          // this.getKind();
        }, 20000);
         window.clearInterval(timeId);
      } else {
        window.clearInterval(timeId);
        this.nsOptions = [];
        this.nameSpaceList();
        // this.getKind();
      }
    },
    //    /api/v1/namespaces    get
    //    /api/v1/namespaces/{namespace}/events?&limit=20 get
    //    /api/v1/namespaces//events?limit=20
    //命名空间选项
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
    getKind() {
      //获取类型的数据
      var params = {
        Method: "GET",
        Path: "/api/v1/namespaces/" + this.nsValue + "/events?&limit=20",
        Version: "2018-05-25",
        ClusterName: this.$route.query.clusterId
      };
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          this.list = mes.items;
          this.total = mes.items.length;
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
    },
    getEventList() {
      //事件列表
      var typeValues = this.typeValue;
      typeValues =
        typeValues.replace(typeValues[0], typeValues[0].toLowerCase()) + "s";
      console.log(typeValues);
      var params = {
        Method: "GET",
        // /apis/apps/v1beta2/namespaces/default/daemonsets
        Path:
          "/apis/batch/v1beta1/namespaces/" + this.nsValue + "/" + typeValues,
        ClusterName: this.$route.query.clusterId,
        Version: "2018-05-25"
      };
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          this.list = mes.items;
          this.total = mes.items.length;
          console.log(mes.items[0]);
          if (mes.items[0].metadata.name !== "") {
            this.nameFlag = false;
          }
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
      var params = {
        Method: "GET",
        Path: "/apis/apps/v1beta2/namespaces/" + this.nsValue + "/daemonsets",
        ClusterName: this.$route.query.clusterId,
        Version: "2018-05-25"
      };
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          this.list = mes.items;
          this.total = mes.items.length;
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
    },
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val - 1;
      this.getEventList();
      this.pageIndex += 1;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getEventList();
    }
  },
  components: {
    subTitle,
    Loading
  }
};
</script>

<style lang="scss" scoped>
</style>

