 <!-- 事件 -->
<template>
  <div>
    <subTitle title="事件" />
    <div class="tke-card tke-formpanel-wrap">
      <h4 class="tke-formpanel-title">条件筛选</h4>
      <el-form class="tke-form" label-position="left" label-width="120px" size="mini">
        <el-form-item label="命名空间">
          <el-select v-model="nsValue" placeholder="请选择">
            <el-option
              v-for="item in nsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="typeValue" filterable placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-select v-model="nameValue" placeholder="请选择">
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
            <p>2020-01-09 19:10:37</p>
          </template>
        </el-table-column>
        <el-table-column label="最后出现时间">
          <template slot-scope="scope">
            <p>2020-01-10 17:01:02</p>
          </template>
        </el-table-column>
        <el-table-column prop label="级别">
          <template slot-scope="scope">
            <span class="text-red">Warning</span>
          </template>
        </el-table-column>
        <el-table-column prop label="资源类型">
          <template slot-scope="scope">
            <span>HorizontalPodAutoscaler</span>
          </template>
        </el-table-column>

        <el-table-column prop label="资源名称">
          <template slot-scope="scope">
            <span>asdas.15e83372c763e97e</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="内容">
          <template slot-scope="scope">
            <span>FailedGetPodsMetric</span>
          </template>
        </el-table-column>
        <el-table-column prop="nodeTotal" label="详细描述">
          <template slot-scope="scope">
            <p>Error: ImagePullBackOff</p>
          </template>
        </el-table-column>
        <el-table-column prop label="出现次数">
          <template slot-scope="scope">
            <p>2617</p>
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
import { ALL_CITY, POINT_REQUEST } from "@/constants";
export default {
  name: "colonyEvent",
  data() {
    return {
      loadShow: false, //加载是否显示
      list: [
        {
          status: false
        },
        {
          status: true
        },
        {
          status: true
        },
        {
          status: true
        }
      ], //列表
      total: 0,
      pageSize: 10,
      pageIndex: 0,
      multipleSelection: [],

      nsOptions: [
        {
          value: "default",
          label: "default"
        },
        {
          value: "kube-system",
          label: "kube-system"
        },
        {
          value: "kube-public",
          label: "kube-public"
        }
      ],
      nsValue: "default",
      typeOptions: [
        {
          value: "all",
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
      typeValue: "all",
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
    this.getEvent();
    this.getEventList();
  },
  methods: {
    //    /api/v1/namespaces    get
    //    /api/v1/namespaces/{namespace}/events?&limit=20 get
    //    /api/v1/namespaces//events?limit=20
    getEvent() {
      let params = {
        Method: "GET",
        Path: "/api/v1/namespaces/"+default+"/events?&limit=20",
        Version: "2018-05-25",
        ClusterName: "cls-l74ol4g0"
      };
      this.axios
        // .get("/api/v1/namespaces/", params).then(res => {
        .get(POINT_REQUEST, params)
        .then(res => {
          console.log(res);

          if (res.Response.Error === undefined) {
            console.log(res);
            // this.tableData = res.Response.Clusters;
            this.loadShow = false;
            console.log(res.Response.Clusters);
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
    getEventList() {
      //     /api/v1/namespaces/{namespace}/events
      let params = { Version: "2018-05-25" };
      this.axios
        // .get("/api/v1/namespaces/" + 'default' + "/events", params)
        // .then(res => {
        .get(POINT_REQUEST, params)
        .then(res => {
          console.log(res);
          if (res.Response.Error === undefined) {
            this.tableData = res.Response.Clusters;
            this.loadShow = false;
            console.log(res.Response.Clusters);
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
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val - 1;
      // this.getColonyList();
      this.pageIndex += 1;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      // this.getColonyList();
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

