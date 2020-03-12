<template>
  <div class="mesg-detils">
    <HeaderCom :title="$t('MGC.znxxq')" @_back="back"  :backShow="true"></HeaderCom>
    <div class="head">
    <p class="time">{{$route.query.time}}</p>
     <p class="title">{{$route.query.title}}</p>
    <el-button class="del" type="danger" size="small" @click="dialogVisible = true">刪除</el-button>
    </div>
    <div class="detilswrap">
        <div class="wrap" v-html="content"></div>
    </div>
    <el-dialog
        title="删除"
        :visible.sync="dialogVisible"
        width="30%">
        <span style="font-size:15px">確定删除？</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="del()">確 定</el-button>
  </span>
  </el-dialog>
  </div>
</template>
<script>
import HeaderCom from "@/components/public/Head";
import {DATA_DETILE,UPDATA_DATA,DELETE_DATA,} from  '@/constants/MGC.js';
export default {
  components: {
    HeaderCom,
  },
  data() {
    return {
      content:'',
      dialogVisible:false
    }
  },
  methods:{
    //返回上一页
    back(){
       this.$router.push({path:"/message",query:{page:this.$route.query.page}});
    },
    //获取详情数据
    init(){
       let id = this.$route.query.detailsData
       this.axios.get(`${process.env.VUE_APP_adminUrl + DATA_DETILE}`+'?id='+id).then(res=>{
            console.log(res)
            this.content = res.inMailEntity.content
       })
    },
    update(){
       let id = this.$route.query.detailsData
       this.axios.get(`${process.env.VUE_APP_adminUrl + UPDATA_DATA}`+'?id='+id).then(res=>{
            console.log(res)
       })
    },
    del(){
       let id = this.$route.query.detailsData
       this.axios.get(`${process.env.VUE_APP_adminUrl + DELETE_DATA}`+'?ids='+id+',').then(res=>{
            if(res.code==0){
               this.$message({
              type: "success",
              message: "已刪除",
              duration: 0,
              showClose: true,
          });
                this.dialogVisible=false
                this.$router.go(-1)
            }
        })
  },
  },
  created(){
    this.init()
  }
}
</script>
<style lang="scss" scoped>
   .detilswrap{
     width: 100%;
     padding: 20px;
     box-sizing: border-box;
     .wrap{
       width: 100%;
       display: flex;
       background: white;
       box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
     }
   }
   .head{
    font-size:15px;
    display:flex !important;
    position:relative;
    height: 50px;
    background: white;
    align-items: center;
  .title{
    font-weight:800;
    margin-left:20px;
  }
  .time{
    margin-left:20px;
  }
  .del{
    position:absolute;
    right:50px;
  }}
</style>