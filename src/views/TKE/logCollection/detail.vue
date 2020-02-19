<template>
    <div> 
        <div class="datails-nav">
            <ul>
                <router-link to="/logCollection">
                <li>
                    <i class="el-icon-back"></i>
                    <span>{{id}}</span>
                </li>
                </router-link>
            </ul>
        </div>
        <div class='room'>
            <el-card class="box-card">
                <el-form label-width="150px" class='tke-form' label-position="left">
                    <h3 style='margin-bottom:20px;'>基本信息</h3>
                        <el-form-item label="日志规则名称">
                            啊实打实
                        </el-form-item>
                        <el-form-item label="所属集群">
                            啊实打实
                        </el-form-item>
                        <el-form-item label="创建时间">
                            啊实打实
                        </el-form-item>
                    <el-divider></el-divider>
                    <h3 style='margin-bottom:20px;'>日志信息</h3>
                        <el-form-item label="日志类型">
                            啊实打实
                        </el-form-item>
                        <el-form-item label="日志源">
                            啊实打实
                        </el-form-item>
                     <el-divider></el-divider>
                    <h3 style='margin-bottom:20px;'>消费端</h3>
                        <el-form-item label="类型">
                            啊实打实
                        </el-form-item>
                        <el-form-item label="CKafka实例">
                            啊实打实
                        </el-form-item>
                        <el-form-item label="CKafka Topic">
                            啊实打实
                        </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>
<script>
     export default {
         name:'logDetail',
         data(){
             return{
                 id:this.$route.query.id
             }
         },
         methods:{
            //  TKE_COLONY_QUERY
         }
     }
</script>
<style lang="scss" scoped>
.datails-nav {
      height: 40px;
      background: #fff;
      span {
        color: #000;
        font-size: 14px;
        padding: 0 20px;
        box-sizing: border-box;
      }
      ul {
        display: flex;
        height: 40px;
        line-height: 40px;
        margin-left: 20px;
        li {
          display: flex;
          align-items: center;
          justify-content: center;
          i {
            font-size: 16px;
            font-weight: bold;
          }
          span{
            font-size: 16px;
            font-weight: 700;
          }
        }
        li:nth-child(1) {
          color: blue;
        }
      }
    }
    .box-card {
        width: 100%;
    }
    .room{
        padding:20px;
    }
</style>