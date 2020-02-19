<!--
 * @Author: your name
 * @Date: 2020-02-19 17:26:56
 * @LastEditTime: 2020-02-19 20:00:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/WAF/botMan/component/protectionSetting/diyType.vue
 -->
<template>
  <div class="main">
    <el-row type="flex" justify="between">
      <el-col>
        <el-button style="padding: 5px 10px; margin-right: 10px;" type="primary">复制</el-button>
        <el-tooltip placement="right" content="你可以将当前域名的公开BOT策略复制到目标域名；注意，复制后，目标域名的公开BOT策略将会被覆盖。">
          <i class="el-icon-info" />
        </el-tooltip>
      </el-col>
      <i style="cursor: pointer" class="el-icon-refresh"/>
    </el-row>
    <el-table style="margin-top: 20px">
      <el-table-column label="序号" />
      <el-table-column label="BOT 分类" />
      <el-table-column label="BOT 种类数">
        <div slot="header">
         <el-dropdown trigger="click" style="line-height: 0">
            <span class="el-dropdown-link" style="font-size: 12px;">
              动作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>全部</el-dropdown-item>
              <el-dropdown-item>监控</el-dropdown-item>
              <el-dropdown-item>拦截</el-dropdown-item>
              <el-dropdown-item>放行</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-table-column>
      <el-table-column label="动作" />
      <el-table-column label="操作" />
    </el-table>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>

</style>