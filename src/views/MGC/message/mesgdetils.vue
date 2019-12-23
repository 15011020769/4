<template>
  <div class="mesg-detils">
    <HeaderCom title="站内信详情" @_back="back"  :backShow="true"></HeaderCom>
    <div class="detilswrap">
          <mavon-editor v-model="html" :toolbarsFlag="false" :editable="false" :subfield="false" defaultOpen="preview" style="width: 100%; margin: 20px auto;"></mavon-editor>
    </div>
  </div>
</template>
<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import HeaderCom from "@/components/public/Head";
export default {
  components: {
    HeaderCom,
    mavonEditor
  },
  data() {
    return {
      html: ''
    }
  },
  methods:{
    //返回上一页
    back(){
       this.$router.go(-1);
    },
    //获取详情数据
    init(){
      let params = {
        id:this.$route.query.detailsData
      }
      this.axios.get(`${process.env.VUE_APP_adminUrl}`+"/taifucloud/inmail/info/"+params.id).then(res=>{
          console.log(res)
          this.html = res.data.content
      })
    }
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
       height: 800px;
       background: white;
       box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
     }
   }
</style>