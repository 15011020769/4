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
            <el-button type="primary" style="margin-top:20px;margin-bottom:20px;" size="small" @click="setTage()">立即创建</el-button>
            <p class="f14" style="font-weight:700;">构建记录</p>
             <el-table
                style="width: 100%"
                 :data="tableData">
                <el-table-column
                    label="开始时间"
                    width="180"
                    prop='type'>
                </el-table-column>
                <el-table-column
                    label="状态"
                    width="180"
                    prop='type'>
                      <template slot-scope="scope">
                        {{scope.row.type}}<i class='el-icon-tickets' style="cursor:pointer;" @click='drawer = true'></i>
                      </template>
                </el-table-column>
                <el-table-column
                    label="	生成的镜像版本"
                    prop='type'>
                </el-table-column>
                 <el-table-column
                    label="来源"
                    prop='type'>
                </el-table-column>
                 <el-table-column
                    label="耗时"
                    prop='type'>
                </el-table-column>
                <el-table-column
                    label="操作"
                    prop='type'>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 编辑弹窗 -->
        <el-dialog title="立即构建镜像" :visible.sync="dialogFormVisible">
            <el-form :model="form" class="tke-form" label-width="100px">
                 <el-form-item label="构建方式"  >
                    <el-radio-group v-model="form.radio">
                        <el-radio :label="3">使用Dockerfile进行构建</el-radio>
                        <el-radio :label="6">指定源码分支构建</el-radio>
                        <el-radio :label="9">指定commit号构建</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="镜像版本"  >
                   <el-input v-model="form.input"  class='w180' size='mini'></el-input>
                   <p>最长为128位字符，只能包含大小写字母、数字及分隔符("."、"_"、"-")，且不能以分隔符开头或结尾</p>
                </el-form-item>
                 <el-form-item label="Dockerfile文件" >
                </el-form-item>
                <div class='border'>
                     <!-- <el-form-item v-for="(item,index) in form.total" :key='index' :label="item.id" >
                         <el-input v-model="item.value"  class='w180' size='mini' ></el-input>
                    </el-form-item> -->
                    <div v-for="(item,index) in form.total" :key='index'>
                         <span style='color:#2b91af;'>{{index+1}}</span>
                         <input v-model="item.value"  class='w180' style='border:none;outline-color:#F2F2F2;margin-left:10px;' @keyup.enter='addInput' ></input>
                    </div>
                </div>
            </el-form>
        </el-dialog>
        <!-- 抽屉 -->
        <el-drawer
            title="1231日志"
            :visible.sync="drawer"
            class='drawer-height'
            :modal='false'
            size='60%'
            show-close>
            <p class='p-left'>123</p>
            <div class='back-room'>
            </div>
        </el-drawer>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                drawer: false,
                formLabelWidth:50,
                tableData:[
                    {
                        type:"nihao"
                    }
                ],
                dialogFormVisible: false,
                form:{
                    radio:3,
                    input:'',
                    total:[{
                        value:''
                    }]
                }
            }
        },
        methods:{
            setTage(){
                this.dialogFormVisible = true
            },
            addInput(){
                console.log(1)
                this.form.total.push({
                    values:''
                })
                
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
  .border{
      border: 1px solid rgb(242, 242, 242);
      width:100%;
      height:180px;
      overflow-y:scroll;
  }
  .drawer-height{
      top:60px;
    right:0;
    bottom:0;
    font-size:20px;
  }
  .p-left{
      margin-left:20px;
      font-size:14px;
  }
  .back-room{
    background-color: #F2F2F2;
    width:93%;
    height:85%;
    margin:30px;
    overflow-y:scroll;
  }
</style>