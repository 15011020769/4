 <!-- 新建ConfigMap -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header">
      <div class="tke-grid">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">更新ConfigMap</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>
    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary">完成</el-button>
          <el-button size="small" @click="$router.go(-1)">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ALL_CITY, TKE_COLONY_QUERY } from "@/constants";
export default {
  name: "configmapCreate",
  components: {  },
  data() {
    return {
      clusterId: ""
    };
  },
  watch:{
  
  },
  created() {
    // 从路由获取类型
    this.clusterId = this.$route.query.clusterId;
  },
  methods: {
    //返回上一层
    goBack(){
       this.$router.go(-1);
    },

  
  }
};
</script>

<style lang="scss" scoped>
.ipu {
  border: 1px solid #ddd;
}
textarea {
  width: 90%;
  max-width: 260px;
  height: 30px;
  line-height: normal;
  border: 1px solid #ddd;
}
.flex {
  display: flex;
}
.f12 {
  font-size: 12px;
  color: #888;
  font-weight: bold;
}
.pl5 {
  padding-left: 5px;
}
.header {
  width: 300px;
  height: 40px;
  line-height: 40px;
}
.border {
  width: 550px;
  max-height: 400px;
  border: 1px solid #ddd;
}
.text {
  width: 90%;
  max-width: 260px;
  height: 30px;
  line-height: normal;
  border:1px solid #ddd;
}
.form-input{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom:6px;
    span{
        margin:0 10px;
    }
    i{
        margin:0 10px;
        cursor: pointer;
    }
}
.form-p{
    margin-bottom: 10px;
    font-size: 12px;
    color: #888;

}
.box {
    width: 400px;

    .top {
      text-align: center;
    }

    .left {
      float: left;
      width: 60px;
    }

    .right {
      float: right;
      width: 60px;
    }

    .bottom {
      clear: both;
      text-align: center;
    }

    .item {
      margin: 4px;
    }

    .left .el-tooltip__popper,
    .right .el-tooltip__popper {
      padding: 8px 10px;
    }
  }
   .activeColor {
    color: #f56c6c !important;
  }
</style>

