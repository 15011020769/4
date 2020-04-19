<template>
    <div class='room'>
      <el-card class="box-card">
          <p class="box-info">基本信息</p>
          <el-form label-width="150px" class='tke-form' label-position="left" >
            <el-form-item label="仓库名称">
              <div>{{reponame}}</div>
            </el-form-item>
            <el-form-item label="类型">
              <div>{{repotype}}</div>
            </el-form-item>
            <el-form-item label="来源">
              <div><a :href="'https://hub.docker.com/_/'+reponame">https://hub.docker.com/_/{{reponame}}</a></div>
            </el-form-item>
            <el-form-item label="获取镜像">
              <div>docker pull {{reponame}}:latest</div>
            </el-form-item>
            <el-form-item label="仓库地址">
              <div>docker.io/{{reponame}}</div>
            </el-form-item>
            <el-form-item label="描述">
              <div>{{simpleDesc}}</div>
            </el-form-item>
          </el-form>
      </el-card>
    </div>
</template>
<script>
import { TKE_DOCKERHUB_INFO } from "@/constants"
export default {
    name: 'DockerHubInfo',
    data () {
      return {
        reponame:'',
        repotype:'',
        simpleDesc:''
      }
    },
    created(){
      this.getInfo()
    },
    methods:{
     // 获取DockerHub基本信息
      getInfo () {
        const param = {
          reponame: this.$route.query.id,
        }
        this.axios.post(TKE_DOCKERHUB_INFO, param).then(res => {
          if (res.code === 0 && res.Error == undefined){
              this.reponame = res.data.reponame
              this.repotype = res.data.repotype
              this.simpleDesc = res.data.simpleDesc
          } else {
            this.$message({
                message: ErrorTips[res.codeDesc],
                type: "error",
                showClose: true,
                duration: 0
            })
          }
        })
      },
    }
}
</script>
<style lang="scss" scoped>
  .text {
    font-size: 14px;
  }

  .item {
    width: 100px;
    ul>li{
        padding-top:30px;
        font-size: 12px;
        color:#888;
    }
  }

  .box-card {
    width: 100%;
    .box-info{
        font-size: 14px;
        font-weight: 700;
        margin-bottom:10px;
    }
  }

  .room{
    padding:20px;
  }
</style>
