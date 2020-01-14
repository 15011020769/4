<template>
  <div class="mesg-detils">
    <HeaderCom :title="$t('MGC.znxxq')" @_back="back"  :backShow="true"></HeaderCom>
    <div class="detilswrap">
        <div class="wrap" v-html="content">123</div>
    </div>
  </div>
</template>
<script>
import HeaderCom from "@/components/public/Head";
import {DATA_DETILE,UPDATA_DATA} from  '@/constants/MGC.js';
export default {
  components: {
    HeaderCom,
  },
  data() {
    return {
      content:''
    }
  },
  methods:{
    //返回上一页
    back(){
       this.$router.go(-1);
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
       display: flex;
       background: white;
       box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
     }
   }
</style>