 <!-- ConfigMap-基本信息 -->
 <template>
  <div class="colony-main">
    <div class="tke-card tke-formpanel-wrap">
      <h4 class="tke-formpanel-title">{{$t('TKE.overview.jbxx')}}</h4>
      <el-form class="tke-form" label-position="left" label-width="120px" size="mini">
        <el-form-item :label="$t('TKE.overview.mc')">
          <div class="tke-form-item_text">{{Info.name}}</div>
        </el-form-item>
        <el-form-item label="Namespace">
          <div class="tke-form-item_text">{{Info.np}}</div>
        </el-form-item>
        <el-form-item label="Labels">
          <div class="tke-form-item_text">-</div>
        </el-form-item>
        <el-form-item :label="$t('TKE.overview.cjsj')">
          <div class="tke-form-item_text">{{Info.time}}</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

 <script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY, TKE_COLONY_QUERY } from "@/constants";
export default {
  name: "configmapDetailInfo",
  data() {
    return {
      clusterId: "",
      Info: {
        name: "",
        np: "",
        time: ""
      }
    };
  },
  components: {},
  created() {
    // 从路由获取集群id
    this.clusterId = this.$route.query.clusterId;
    console.log(this.$route.query);
    if (this.$route.query.name && this.$route.query.np) {
      this.Info.name = this.$route.query.name;
      this.Info.np = this.$route.query.np;
    }
    this.findData();
  },
  methods: {
    findData() {
      if (
        this.$route.query.clusterId &&
        this.$route.query.name &&
        this.$route.query.np
      ) {
        var params = {
          ClusterName: this.$route.query.clusterId,
          Method: "GET",
          Path:
            "/api/v1/namespaces/" +
            this.$route.query.np +
            "/configmaps/" +
            this.$route.query.name,
          Version: "2018-05-25"
        };
        this.axios.post(TKE_COLONY_QUERY, params).then(res => {
          if (res.Response.Error == undefined) {
            var data = JSON.parse(res.Response.ResponseBody);
            console.log(data);
            this.Info.time = this.timeFormat(data.metadata.creationTimestamp);
          }
        });
      }
    },
    timeFormat(times) {
      var d = new Date(times);
      var n = d.getFullYear();
      var y = d.getMonth() + 1;
      var r = d.getDate();
      var h = d.getHours(); //12
      var m = d.getMinutes(); //12
      var s = d.getSeconds();
      h < 10 ? (h = "0" + h) : h;
      m < 10 ? (m = "0" + m) : m;

      return n + "-" + y + "-" + r + " " + h + ":" + m + ":" + s;
    }
  }
};
</script>

 <style lang="scss" scoped>
</style>
