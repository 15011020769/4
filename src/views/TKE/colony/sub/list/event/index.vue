 <!-- 事件 -->
<template>
  <div >
    <p>事件</p>
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
import SEARCH from "@/components/public/SEARCH";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY } from "@/constants";
export default {
  name: "create",
  data() {
    return {
    
    };
  },
  components: {
    HeadCom,
    SEARCH
  },
  created() {

  },
  methods: {
    //返回上一层
    goBack(){
          this.$router.go(-1);
    },
  }
};
</script>

<style lang="scss" tke-formpanel>


</style>

