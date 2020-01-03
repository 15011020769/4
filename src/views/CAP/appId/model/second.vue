<template>
  <div class="appidSecond">
    <el-row>
      <el-button type="primary">购买套餐包</el-button>
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
       options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: ''
    };
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
/* css */
.appidSecond {
  box-sizing: border-box;
  padding: 20px;
  .el-row {
    .el-button--primary {
      height: 30px;
      line-height: 28px;
      min-width: 21px;
      padding: 0 15px;
      font-size: 12px;
      border-radius: 0;
      border: 1px solid #006eff;
      background-color: #006eff;
    }
    .el-select{
      
    }
  }
}
</style>

