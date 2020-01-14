 <!-- 新建Namespace -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">新建Namespace</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>  
    <div class="colony-main">

      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form  class="tke-form" :model="np" label-position='left' label-width="120px" size="mini">
          <el-form-item label="名称">
            <el-input class="w200" v-model="np.name" placeholder="请输入Namespace名称"></el-input>
            <p>最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</p>
          </el-form-item>
          <el-form-item label="描述">
             <el-input
                class="w420"
                type="textarea"
                :rows="6"
                placeholder="请输入描述信息，不超过1000个字符"
                v-model="np.desc">
              </el-input>
          </el-form-item>

          <el-form-item label="镜像仓库秘钥">
            <el-checkbox disabled="" v-model="np.checked1">TKE镜像仓库访问凭证：qcloudregistrykey</el-checkbox>
            <el-checkbox disabled='' v-model="np.checked2">Tencent Hub镜像仓库访问凭证：tencenthubkey</el-checkbox>
          </el-form-item>
        </el-form>

       
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary">创建Namespace</el-button>
          <el-button size="small">取消</el-button>
        </div>
      </div>
    </div>

   
  </div>
</template>

<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
export default {
  name: "namespaceCreate",
  data() {
    return {
      np: {
        name: '',
        desc:'',
        checked1:true,
        checked2:true,
       
       
      }  
    };
  },
  components: {
    
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


</style>

