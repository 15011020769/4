<template>
  <div class="colony-wrap">
    <HeadCom title="集群管理">
      <el-button style="margin-left:10px;">{{region}}</el-button>
    </HeadCom>
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
import { ALL_CITY } from "@/constants";
export default {
  name: "colony",
  data() {
    return {
      region: ""
    };
  },
  components: {
    HeadCom
  },
  created() {
    this._region();
  },
  methods: {
    _region() {
      this.axios.post(ALL_CITY).then(res => {
        this.region = res.data[0].zone;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.colony-wrap >>> .el-button {
  height: 30px;
  line-height: 30px;
  border-radius: 0;
  font-size: 12px;
  padding-top: 0;
}
</style>