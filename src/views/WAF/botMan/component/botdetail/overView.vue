<template>
  <div class="main">
    <div class="firstShow">

    </div>
    <el-row class="secondShow">
      <el-col :span="12">
        <h3 class="topfont">
          <!-- {{t('访问类型占比', 'WAF.fwlxzb')}} -->
          BOT 动作占比
          <span style="color:#bbb;">(%)</span>
        </h3>
        <!-- <EPie
          :series="seriesPie"
          :color="colorPie"
          :legendText="legendTextPie"
        /> -->
        </el-col>
        <el-col :span="12">
        <h3 class="topfont">
          <!-- {{t('攻击类型占比', 'WAF.gjlxzb')}} -->
          BOT 类型占比
          <span style="color:#bbb;">(%)</span>
        </h3>
        <!-- <el-row class="empty" v-if="seriesPieAttack.length == 0 ? true : false">暂无数据</el-row>
        <EPie
          :series="seriesPieAttack"
          :color="colorPie"
          :legendText="legendTextPieAttack"
          v-else
        /> -->
      </el-col>
    </el-row>
    <div class="thirdShow">

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    domin: {
      type: String,
      default: "tfc.dhycloud.com"
    },
    times: {
      type: Array,
      defaule: () => []
    }
  },
  methods: {

  }
}

</script>
<style lang='scss' scoped>
::v-deep .el-col-12:nth-child(1) {
  height: 100%;
  border-right: 1px solid #e5e5e5;
}
.main {
  .firstShow {
    width: 100%;
    height: 375px;
    background: #fff;
    box-sizing: border-box;
  }
  .secondShow {
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
    .empty {
      height: 200px;
      width: 100%;
      line-height: 200px;
      text-align: center;
      font-weight: bold
    }
  }
  .thirdShow {
    width: 100%;
    height: 658px;
    padding: 20px 0;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    margin-top: 20px;
    .topfont{
      padding-left: 20px;
    }
  }
}
</style>
