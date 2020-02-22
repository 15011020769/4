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
        <el-form  class="tke-form" :model="np" :rules="rules" ref="np" label-position='left' label-width="120px" size="mini">
          <el-form-item label="名称" prop="spaceName">
            <el-input class="w200" v-model="np.spaceName" placeholder="请输入Namespace名称"></el-input>
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
          <el-button size="small" type="primary" @click="submitAdd('np')">创建Namespace</el-button>
          <el-button size="small" @click="goBack">取消</el-button>
        </div>
      </div>
    </div>

   
  </div>
</template>

<script>
import { ALL_CITY,POINT_REQUEST } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  name: "namespaceCreate",
  data() {
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入Namespace名称'));
      } else if(value.length > 63) {
        callback(new Error('Namespace名称不能超过63个字符'));
      } else {
        callback();
      }
    }
    return {
      loadShow: false, //加载是否显示
      clusterId: '',//集群id
      np: {
        spaceName: '',
        desc:'',
        checked1:true,
        checked2:true,
      },
      rules: {
        spaceName: [
          {validator: validateName, trigger: "blur", required: true}
        ]
      }  
    };
  },
  components: {
    
  },
  created() {
    this.clusterId=this.$route.query.clusterId;
  },
  methods: {
    //返回上一层
    goBack(){
      this.$router.go(-1);
    },
    //提交新增
    submitAdd (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createNameSpace();
        } else {
          return false
        }
      })
    },
    //新增命名空间
    async createNameSpace () {
      this.loadShow = true;
      let param = {
        Method: "POST",
        Path: "/apis/platform.tke/v1/clusters/"+this.clusterId+"/apply",
        Version: "2018-05-25",
        RequestBody: {kind: "Namespace", apiVersion: "v1",
            metadata:{name: this.np.spaceName, annotations: {description: this.np.desc}}},
        ClusterName: this.clusterId
      }

      this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error === undefined) {
          this.loadShow = false;
          this.goBack();
        } else {
          this.loadShow = false;
          let ErrTips = {
            
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>


</style>

