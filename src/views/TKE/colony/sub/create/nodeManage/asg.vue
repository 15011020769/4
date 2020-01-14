 <!-- 新建伸缩组 -->
<template>
  <div class="colony-wrap">
    <!-- <HeadCom title="集群管理">
      <el-button style="margin-left:10px;" v-if="!btnload">{{region}}</el-button>
      <el-button style="margin-left:10px;"  icon="el-icon-loading"></el-button>
    </HeadCom> -->
    <div class="tke-content-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">新建伸缩组</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>  
    <div class="colony-main">

      <div class="tke-card tke-formpanel-wrap">
        <h4  class="tke-formpanel-title">启动配置</h4>
        <el-form  class="tke-form" :model="asg" label-position='left' label-width="120px" size="mini">
          <el-form-item label="名称">
            <el-input class="w200" v-model="asg.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="实例类型">
             <el-radio-group  v-model="asg.typeRadio" size="small">
              <el-radio-button label="type1">按量计费</el-radio-button>
              <el-radio-button label="type2">竞价付费</el-radio-button>
            </el-radio-group>
            <p v-if="asg.typeRadio=='type2'">	竞价实例(Spot)可以让您以一定幅度的折扣购买实例,但同时系统可能会自动回收这些折扣售卖的实例,<span class="tke-text-link">查看详情</span></p>
          </el-form-item>
          <el-form-item label="机型设置">
            <div class='form-controls' >
              <el-form  class="tke-form"  label-position='left' label-width="120px" size="mini">
                <el-form-item label="可用区">
                  <el-radio-group  v-model="asg.regionRadio" size="small">
                    <el-radio-button label="region1">全部可用区</el-radio-button>
                    <el-radio-button label="region2">台北一区</el-radio-button>
                  </el-radio-group>
                  <p>启动配置里不包含可用区信息，提供可用区选择的目的是帮助您在已确定将启动实例可用区时，过滤出可用实例类型。</p>
                </el-form-item>
                <el-form-item label="机型">
                  <div class="tke-form-item_text"><span>S3.SMALL1(标准型S3,1核1GB)</span><i class="el-icon-edit tke-icon"></i></div>
                </el-form-item>
                <el-form-item label="系统盘">
                  <div class="tke-form-item_text"><span>高性能云硬盘 50GB</span><i class="el-icon-edit tke-icon"></i></div>
                </el-form-item>
                <el-form-item label="数据盘">
                  <div class="tke-form-item_text"><span>暂不购买</span><i class="el-icon-edit tke-icon"></i></div>
                </el-form-item>
                <el-form-item label="公网带宽">
                  <div class="tke-form-item_text"><span>按带宽计费 1Mbps</span><i class="el-icon-edit tke-icon"></i></div>
                </el-form-item>
              </el-form>
            </div>
          </el-form-item>

          <el-form-item label="登录方式">
             <el-radio-group  v-model="asg.pwdRadio" size="small">
              <el-radio-button label="pwd1">设置密码</el-radio-button>
              <el-radio-button label="pwd2">立即关联密钥</el-radio-button>
              <el-radio-button label="pwd3">自动生成密码</el-radio-button>
            </el-radio-group>
          </el-form-item>
          

         
        </el-form>

        <hr>
        <h4  class="tke-formpanel-title">伸缩组配置</h4>
        <el-form class="tke-form" :model="asg" label-position='left' label-width="120px" size="mini">
          <el-form-item label="支持网络">
            <p>asdasd</p>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary">创建伸缩组</el-button>
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
  name: "asgCreate",
  data() {
    return {
      asg: {
        name: '',
        typeRadio:'type1',
        pwdRadio:'pwd1',
        regionRadio:'region1'
       
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

