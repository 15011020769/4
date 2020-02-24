<template>
  <div>
    <el-row class="echartsShowThird">
        <el-col :span="12">
        <h3 class="topfont">
          {{t('访问类型占比', 'WAF.fwlxzb')}}
          <span style="color:#bbb;">(%)</span>
        </h3>
        <EPie
          :series="seriesPie"
          :color="colorPie"
          :legendText="legendTextPie"
        />
        </el-col>
        <el-col :span="12">
        <h3 class="topfont">
          {{t('攻击类型占比', 'WAF.gjlxzb')}}
          <span style="color:#bbb;">(次)</span>
        </h3>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import EPie from "./pie"
export default {
  name: "attackType",
  data() {
    return {
      
      };
  },
  props: {
    seriesPie: {
      type: Array
    },
    colorPie: Array,
    legendTextPie: Array,
  },
  watch: {
    seriesPie(val) {
      this.seriesPie = val;
    },
    colorPie(val) {
      this.colorPie = val;
    },
    legendTextPie(val) {
      this.legendTextPie = val;
    }
  },
  components: {
    EPie,
  },
  mounted() {
  },
  methods: {
    
  }
};

</script>
<style lang="scss" scoped>
  .echartsShowThird {
    width: 100%;
    height: 258px;
    padding: 20px 0;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    margin-top: 20px;
    .topfont{
      padding-left: 20px;
    }
  }
</style>