<template>
  <div class="news-wrap">
    <HeaderCom title="通知公告详情" @_back="back"  :backShow="true"></HeaderCom>
    <div class="detilswrap">
            <mavon-editor v-model="html" :toolbarsFlag="false" :editable="false" :subfield="false" defaultOpen="preview" style="width: 100%; margin: 20px auto;"></mavon-editor>
       
    </div>
  </div>
</template>
<script>
import HeaderCom from "@/components/public/Head";
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
  components: {
    HeaderCom,
    mavonEditor
  },
  data() {
    return {
       html:''
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
       let params = {
         noticeId:this.$route.query.detailsData,
         qcloudUin:this.$route.query.detailsIn
       }
       this.axios.post(`${process.env.VUE_APP_adminUrl}`+"/taifucloud/notice/owner/info",params).then(res=>{
          console.log(res)
          this.html = res.data.content
       })
    }
  }
}
</script>
<style lang="scss" scoped>
    .detilswrap{
     width: 100%;
     padding: 20px;
     box-sizing: border-box;
   }
</style>