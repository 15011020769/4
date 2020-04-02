<template>
  <div class="newswrap">
    <HeaderCom :title="$t('MGC.tzggxq')" @_back="back"  :backShow="true"></HeaderCom>
    <div class="head">
    <p class="time">{{$route.query.publishTime}}</p>
     <p class="title">{{$route.query.title}}</p>
    </div>
      <div id="detilswrap">
        <mavon-editor 
           :value="content" 
           :toolbarsFlag="false" 
           :editable="false" 
           :subfield="false"
           defaultOpen="preview" 
           :boxShadow="false" 
           previewBackground="#fff"
           style="margin: 20px auto; border:0;">
           </mavon-editor>
    </div>
    </div> 
</template>
<script>
import HeaderCom from "@/components/public/Head";
import { mavonEditor } from "mavon-editor";
// import "mavon-editor/dist/css/index.css";
import {NOTICE_DETILS} from '@/constants/MGC.js';
export default {
  created(){
    this.init()
  },
  data() {
    return {
       content:''
    }
  },
   components: {
    HeaderCom,
    mavonEditor
  },
  methods:{
    //返回上一页
    back(){
       this.$router.go(-1);
    },
    //获取详情数据
    init(){
       let id = this.$route.query.detailsDatas
       this.axios.get(`${process.env.VUE_APP_adminUrl + NOTICE_DETILS}`+'?id='+id).then(res=>{
            console.log(res)
            this.content = res.notice.content
       })
    },
  },
  
}
</script>
<style lang="scss" scoped>
.newswrap{
    #detilswrap{
     width:80%;
     margin:0 auto;
     min-height:700px;
     padding:30px 0;
     z-index:1;
     border: 1px solid #cdcdcd;
      ::v-deep .v-note-wrapper .v-note-panel {
       min-height:700px;
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
 }
}
   
</style>