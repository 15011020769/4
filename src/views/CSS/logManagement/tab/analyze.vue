<!--
 * @Author: your name
 * @Date: 2020-01-07 16:47:16
 * @LastEditTime : 2020-01-08 16:00:20
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/CSS/logManagement/tab/analyze.vue
 -->
<template>
  <div class="main">
    <div class="explain">
      <p>
        实时日志分析现已开放公测，欢迎体验。
        <a href="#">产品文档 DEMO体验>>>></a>
      </p>
    </div>

    <el-card class="box-card">
      <h3>卡片名称</h3>
      <el-form>
        <el-form-item prop="">

        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  }
}
</script>

<style lang="scss" scoped>
.explain {
  color: #003b80;
  border: 1px solid #97c7ff;
  background: #e5f0ff;
  padding: 10px 30px 10px 20px;
  margin-bottom: 20px;
  border-radius: 2px;

  p {
    line-height: 18px;

    a {
      color: #006eff;
    }
    a:hover {
      border-bottom: 1px #006eff solid;
    }
  }
}
</style>
