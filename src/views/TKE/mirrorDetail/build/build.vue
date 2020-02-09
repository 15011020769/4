<template>
    <div class="room">
        <el-card class="box-card" shadow='never'>
            <div class="title">
                <span>构建配置</span>
                <div class="t-detail">
                    <i class="el-icon-edit" style="font-size:12px;"></i>
                    <el-link type="primary"><router-link :to="{name: 'mirrorDetailConfig',query: {id: this.$route.query.id}}">编辑</router-link></el-link>
                </div>
            </div>
            <p class="f14">没有自动构建配置</p>
            <el-button type="primary" style="margin-top:20px;margin-bottom:20px;" size="small">立即创建</el-button>
            <p class="f14" style="font-weight:700;">构建记录</p>
             <el-table
                style="width: 100%">
                <el-table-column
                    label="开始时间"
                    width="180">
                </el-table-column>
                <el-table-column
                    label="状态"
                    width="180">
                </el-table-column>
                <el-table-column
                    label="	生成的镜像版本">
                </el-table-column>
                 <el-table-column
                    label="来源">
                </el-table-column>
                 <el-table-column
                    label="耗时">
                </el-table-column>
                <el-table-column
                    label="操作">
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                tableData:[]
            }
        }
    }
</script>
<style lang="scss" scoped>
  .room{
      width: 100%;
      padding: 20px;
   }
  .box-card {
    width: 100%;
  }
  .title{
      font-size: 16px;
      font-weight: 700;
      width: 100%;
      float: left;
      margin-bottom: 20px;
      span{
          float: left;
      }
      .t-detail{
          margin-left:20px;
          float: left;
      }
  }
</style>