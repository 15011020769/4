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
          <h2 class="header-title">新建ConfigMap</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>  
    <div class="colony-main">

      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form  class="tke-form" :model="cm" label-position='left' label-width="120px" size="mini">
          <el-form-item label="名称">
            <el-input class="w200" v-model="cm.name" placeholder="请输入名称"></el-input>
            <p>最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</p>
          </el-form-item>
          <el-form-item label="命名空间">
            <el-select v-model="cm.value" placeholder="请选择">
              <el-option
                v-for="(item,index) in cm.options"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="border">
              <!-- 头部 -->
              <div class="flex f12 header">
                <div class="pl5" style="width:800px;">变量名</div>
                <div class="pl5" style="width:50%">变量值</div>
              </div>
              <!-- 主体 -->
              <div class="flex" style="padding:10px;border-top:1px solid #ddd;">
                <addValue></addValue>
              </div>
            </div>
          </el-form-item>
        </el-form>

       
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary">创建ConfigMap</el-button>
          <el-button size="small">取消</el-button>
        </div>
      </div>
    </div>

   
  </div>
</template>

<script>
// import AddValue from '@/views/TKE/colony/sub/create/config/components/addValue.vue'
import addValue from './components/addValue'
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
export default {
  name: "configmapCreate",
  components: {
    addValue
    },
  data() {
    return {
      cm: {
        name: '',
        value: 'default',
        options: ['请选择Namespace','default','kube-public','kube-system','tfy-pub']
      }  
    };
  },
  created() {
     // 从路由获取类型
   
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
  border:1px solid #ddd;
}
textarea{
  width: 90%;
  max-width: 260px;
  height: 30px;
  line-height: normal;
  border:1px solid #ddd;
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
  border:1px solid #ddd;
}
</style>

