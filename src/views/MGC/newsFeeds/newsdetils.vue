<template>
  <div class="news-wrap">
    <HeaderCom :title="$t('MGC.tzggxq')" @_back="back"  :backShow="true"></HeaderCom>
    <div class="detilswrap">
        <div class="wrap"  v-html='content'>
        </div>
    </div>
  </div>
</template>
<script>
import HeaderCom from "@/components/public/Head";
import {NOTICE_DETILS} from '@/constants/MGC.js';
export default {
  components: {
    HeaderCom,
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
    .detilswrap{
     width: 100%;
     padding: 20px;
     box-sizing: border-box;
     .wrap{
       width: 100%;
       height: 700px;
       background: white;
       box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
     }
   }
</style>