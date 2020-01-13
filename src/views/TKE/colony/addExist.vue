 <!-- 添加已有节点 -->
<template>
  <div class="colony-wrap">
    <!-- <HeadCom title="集群管理">
      <el-button style="margin-left:10px;" v-if="!btnload">{{region}}</el-button>
      <el-button style="margin-left:10px;"  icon="el-icon-loading"></el-button>
    </HeadCom> -->

    <!-- 头部 -->
    <div class="tke-content-header " >
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">cls-gwblk71e（tfy_test1）</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>

    <div class="colony-main">

      

      <div class="tke-card tke-formpanel-wrap">
        <div class="tke-step tke-grid">
          <div class="tke-step-item is-curr">
            <span class="num">1</span>
            <span class="title">选择节点</span>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="tke-step-item">
            <span class="num">2</span>
            <span class="title">云服务器配置</span>
          </div>
        </div>
        <hr style="margin-left:-20px;margin-right:-20px">

        

        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small">取消</el-button>
          <el-button size="small" type="primary">下一步</el-button>
        </div>
      </div>
    </div>

   
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
import SEARCH from "@/components/public/SEARCH";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
export default {
  name: "create",
  data() {
    return {
      colony: {
        chargingMode:'mode1',
        
      }  
    };
  },
  components: {
    HeadCom,
    SEARCH
  },
  created() {

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

.colony-wrap >>> .el-button,
.colony-wrap >>> .el-input__inner {
  height: 30px !important;
  line-height: 30px;
  border-radius: 0;
  font-size: 12px;
  padding-top: 0;
}
.colony-wrap {
  .colony-main {
    padding: 20px;
    box-sizing: border-box;

    .search {
      float: right;
      height: 100%;
    }

    .colony-table {
      background: white;
      margin-top: 10px;
    }
    .page {
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
}


//by liling

.tke-formpanel-wrap{
    margin-bottom: 60px;
  }

.w50{
  width: 50px;
}
.w70{
  width: 70px;
}
.w200{
  width: 200px;
}
.w320{
  width: 320px;
}
.w420{
  width: 420px;
}


.tke-form {
  .el-icon-refresh{
    font-size: 16px;
    font-weight: 800;
    vertical-align: middle;
    cursor: pointer;
  }
  .el-icon-info{
   cursor: pointer;
  }
  .form-controls{
    background-color: #f2f2f2;
    padding: 10px;
    width: 600px;
    box-sizing: border-box;
  }
}



</style>

