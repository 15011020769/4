<template>
  <div class="news-wrap">
    <HeaderCom title="通知公告详情" @_back="back"  :backShow="true"></HeaderCom>
    <div class="detilswrap">
         <div class="wrap"></div>
    </div>
  </div>
</template>
<script>
import HeaderCom from "@/components/public/Head";
export default {
  components: {
    HeaderCom
  },
  data() {
    return {
      
    }
  },
  methods:{
    //返回上一页
    back(){
       this.$router.go(-1);
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
       height: 800px;
       background: white;
       box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
     }
   }
</style>