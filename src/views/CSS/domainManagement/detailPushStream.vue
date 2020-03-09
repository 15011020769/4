<template>
  <div v-loading="loadShow">
    <div class="topHead">
      <i class="el-icon-back" @click="returnBack"></i>
      {{$route.query.Name}}
    </div>
    <div class="conTabs">
      <el-tabs v-model="activeName" v-loading="loading">
        <el-tab-pane label="基本訊息" name="first">
          <div class="wrapper">
            <BasicInfo :info="info" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="推流配置" name="second">
          <div class="wrapper">
            <pushStreamSet :info="info" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="範本配置" name="third">
          <div class="wrapper">
            <templateconfig />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import BasicInfo from "./tabs/BasicInfo";
import pushStreamSet from "./tabs/pushStreamSet";
import templateconfig from "./tabs/templateconfig";
import { DOMAIN_DELTILS } from "@/constants";

let ErrTips = {
  "InternalError.SystemError": "內部錯誤",
  "InvalidParameter.ParamError": "非法入參",
  "ResourceNotFound.UserNotExist": "用戶不存在",
  "ResourceNotFound.DomainNotExist": "域名不存在"
};
export default {
  name: "detailPushStream",
  data() {
    return {
      activeName: "first",
      loadShow: false, //加载
      info: {}, //详情内容
      loading: true
    };
  },
  components: {
    BasicInfo: BasicInfo,
    pushStreamSet: pushStreamSet,
    templateconfig: templateconfig
  },
  mounted() {
    const params = {
      Version: "2018-08-01",
      DomainName: this.$route.query.Name
    };
    this.loading = true;
    this.axios.post(DOMAIN_DELTILS, params).then(res => {
      this.loading = false;
      if (res.Response.Error !== undefined) {
        let ErrOr = Object.assign(ErrorTips, ErrTips);
        this.$message({
          message: ErrOr[res.Response.Error.Code],
          type: "error",
          showClose: true,
          duration: 0
        });
        return;
      }

      this.info = res.Response.DomainInfo;
    });
  },
  methods: {
    //返回列表页
    returnBack() {
      this.$router.push({
        name: "domainManagement"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.newClear:after {
  content: "";
  display: block;
  clear: both;
}
.topHead {
  width: 100%;
  height: 50px;
  background-color: #fff;
  line-height: 50px;
  padding: 0 20px;
  font-size: 16px;
  font-weight: 600;
  .el-icon-back {
    margin-right: 15px;
    font-size: 24px;
    color: #006eff;
    cursor: pointer;
  }
}
.conTabs {
  width: 100%;
  height: 40px;
  background-color: #fff;
  padding: 0 20px;
  border-bottom: 1px solid #ddd;
}
.wrapper {
  width: 100%;
}
</style>
