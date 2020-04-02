<template>
  <div class="newswrap">
    <HeaderCom :title="$t('MGC.tzggxq')" @_back="back"  :backShow="true"></HeaderCom>
    <div class="head">
    <p class="time">{{$route.query.publishTime}}</p>
     <p class="title">{{$route.query.title}}</p>
    </div>
      <div id="detilswrap">
        <mavon-editor 
           v-if="!isIE"
           :value="content" 
           :toolbarsFlag="false" 
           :editable="false" 
           :subfield="false"
           defaultOpen="preview" 
           :boxShadow="false" 
           previewBackground="#fff"
           style="margin:0px auto; border:0;">
           </mavon-editor>
           <div style="height:100%;background:white;min-height:700px" v-if="isIE" v-html="content"></div>
          
    </div>
    </div> 
</template>
<script>
import HeaderCom from "@/components/public/Head";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import {NOTICE_DETILS} from '@/constants/MGC.js';
export default {
  created(){
    this.init()
   
  },
  mounted(){
  },
  data() {
    return {
       content:'',
       isIE:false,
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
             if(this.IEVersion()==-1){//非IE
                  this.isIE=false
              }else{//IE
                this.isIE=true
                this.content= this.content.replace(/<p>/,'<p style="font-size:16px;padding:10px; text-indent:32px;line-height:1.5">');
              }
       })
    },
    
    IEVersion() {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串  
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器  
            var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器  
            var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            if(isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if(fIEVersion == 7) {
                    return 7;
                } else if(fIEVersion == 8) {
                    return 8;
                } else if(fIEVersion == 9) {
                    return 9;
                } else if(fIEVersion == 10) {
                    return 10;
                } else {
                    return 6;//IE版本<=7
                }   
            } else if(isEdge) {
                return 'edge';//edge
            } else if(isIE11) {
                return 11; //IE11  
            }else{
                return -1;//不是ie浏览器
            }
       }
  },
  
}
</script>
<style lang="scss" scoped>
.newswrap{
    #detilswrap{
     width:80%;
     margin:30px auto;
     min-height:700px;
    
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