 <!-- 新建Workload -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">新建Workload</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>  
    <div class="colony-main">

      <div class="tke-card tke-formpanel-wrap">
        <el-form  class="tke-form" :model="wl" label-position='left' label-width="120px" size="mini">
          <el-form-item label="名称">
            <el-input class="w200" v-model="wl.name" placeholder="请输入Workload名称"></el-input>
            <p>最长40个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</p>
          </el-form-item>
          <el-form-item label="描述">
             <el-input
                class="w420"
                type="textarea"
                :rows="6"
                placeholder="请输入描述信息，不超过1000个字符"
                v-model="wl.desc">
              </el-input>
          </el-form-item>

          <el-form-item label="类型">
            <div class='form-controls' style="width:350px">
              <el-radio-group class="tke-radio-group" v-model="wl.type">
                <el-radio label="deployment">Deployment（可扩展的部署Pod）</el-radio> 
                <el-radio label="daemonSet">DaemonSet（在每个主机上运行Pod）</el-radio>
                <el-radio label="statefulSet">StatefulSet（有状态集的运行Pod）</el-radio>
                <el-radio label="cronJob">CronJob（按照Cron的计划定时运行）</el-radio>
                <el-radio label="job">Job（单次任务）</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-form>

       
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary">创建Workload</el-button>
          <el-button size="small">取消</el-button>
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
  name: "workloadCreate",
  data() {
    return {
      wl: {
        name: '',
        desc:'',
        type:''
       
      }  
    };
  },
  components: {
    HeadCom,
    SEARCH
  },
  created() {
     // 从路由获取类型
    this.wl.type=this.$route.query.type;
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

.tke-reminder{
  padding: 10px 30px 10px 20px;
  vertical-align: middle;
  color: #003b80;
  border: 1px solid #97c7ff;
  border-radius: 2px;
  background: #e5f0ff;
  position: relative;
  box-sizing: border-box;
  margin-bottom: 20px;  
}
.tke-formpanel-wrap{
    margin-bottom: 60px;
  }
  .tke-radio-group{
    .el-radio{
      display: block;
    }
    .el-radio+.el-radio{
      margin-left: 0;
      margin-top: 10px;
    }
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
}



</style>

