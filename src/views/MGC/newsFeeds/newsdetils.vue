<template>
  <div class="news-wrap">
    <HeaderCom :title="$t('MGC.tzggxq')" @_back="back"  :backShow="true"></HeaderCom>
    <div id="detilswrap">
        <mavon-editor :value="content" 
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
  </div>
</template>
<script>
import HeaderCom from "@/components/public/Head";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import {NOTICE_DETILS} from '@/constants/MGC.js';
export default {
  components: {
    HeaderCom,
    mavonEditor
  },
  data() {
    return {
       content:''
    }
  },
  created(){
    this.init()
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
  }
}
</script>
<style lang="scss" scoped>
    #detilswrap{
     width:80%;
  margin:0 auto;
  min-height:700px;
  padding:30px 0;
   }
</style>